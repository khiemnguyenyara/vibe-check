# Interface Contracts — Domain Modules

**Status:** Source of Truth
**Owner:** Product Architecture
**Last updated:** 2026-08-01
**Implemented in:** `src/modules/types.ts`
**Sửa đổi mới nhất:** [`specs/002-architecture-and-api-contracts.md`](../specs/002-architecture-and-api-contracts.md) đổi `InterviewService` sang một method `submitTurn` và thu hẹp `locale` — xem §2.1 và §5.

## 1. Mục đích

Tài liệu này là **hợp đồng bắt buộc** giữa Core và mọi domain module. Bất kỳ PR nào thêm/sửa module mà vi phạm contract ở đây phải bị reject ở code review, bất kể tính năng có "chạy được" hay không. Contract được implement bằng TypeScript trong `src/modules/types.ts` — file đó là nguồn compile-time enforcement, tài liệu này là nguồn giải thích **tại sao** contract có hình dạng như vậy.

Nguyên tắc thiết kế: **contract nghiêm ở biên (boundary), tự do ở bên trong (implementation)**. Core chỉ ép domain module tuân thủ hình dạng input/output; cách domain module hiện thực bên trong `workspace.tsx`/`prompt.ts` không bị ràng buộc.

## 2. `ModuleDefinition` — hợp đồng gốc

Mọi domain (`tech`, `marketing`, và các domain tương lai) phải export đúng một giá trị thoả `ModuleDefinition` từ `src/modules/<domain>/index.ts`.

```ts
export interface ModuleDefinition {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly getSystemPrompt: SystemPromptBuilder;
  readonly Workspace: ComponentType<ModuleWorkspaceProps>;
  readonly interviewService?: InterviewService;
}
```

| Field | Bắt buộc | Ràng buộc | Lý do |
|---|---|---|---|
| `id` | ✅ | kebab-case, duy nhất trong toàn registry, không đổi sau khi ship (dùng làm khoá lưu trữ session) | Là primary key tham chiếu từ URL, database, analytics. Đổi `id` sau khi ship là breaking change dữ liệu, không phải breaking change code. |
| `label` | ✅ | Chuỗi hiển thị cho người dùng, ví dụ `"Technology"` | Tách biệt khỏi `id` để cho phép đổi tên hiển thị (rebrand, i18n) mà không ảnh hưởng dữ liệu đã lưu. |
| `description` | ✅ | Một câu ngắn, dùng ở màn hình chọn domain | Bắt buộc để tránh domain "câm" không có mô tả khi UI liệt kê lựa chọn. |
| `getSystemPrompt` | ✅ | Hàm thuần (pure function), xem mục 3 | System prompt tĩnh (string cứng) không đủ biểu đạt cho phỏng vấn cá nhân hoá theo level/focus area. |
| `Workspace` | ✅ | React component nhận đúng `ModuleWorkspaceProps`, xem mục 4 | Chuẩn hoá props để Core render bất kỳ Workspace nào một cách generic, không cần biết domain cụ thể. |
| `interviewService` | ❌ (optional) | Đúng một method `submitTurn`, xem §2.1; phần chấm điểm phía server phải tất định | Cho phép Core (Session Engine) điều khiển vòng lặp phỏng vấn một cách generic: Core sở hữu vòng lặp và trạng thái phiên, module sở hữu nội dung câu hỏi và tiêu chí chấm. Optional để module chưa có bộ câu hỏi (vd. `marketing`) vẫn thoả contract — Core render trạng thái "chưa khả dụng" thay vì crash. |

`readonly` trên mọi field là chủ đích: `ModuleDefinition` là **cấu hình bất biến** được định nghĩa một lần lúc module khởi tạo, không phải state runtime. Nếu cần state, nó thuộc về Session Engine (Core), không thuộc về `ModuleDefinition`.

### 2.1. `InterviewService` — hợp đồng nội dung phỏng vấn

```ts
export interface InterviewService {
  submitTurn(input: TurnSubmission): Promise<TurnOutcome>;
}
```

> **Breaking change, 2026-08-01.** Trước đây interface này có hai method
> (`fetchNextQuestion` + `evaluateAnswer`) và một field `sessionLength`. Hai
> method ánh xạ thành hai round trip tới một route duy nhất, và **không thể
> gộp lại**: `evaluateAnswer` không hề nhận `transcript` mà một request
> stateless bắt buộc phải có. Gộp thành `submitTurn` cũng loại bỏ một failure
> mode có thật — chấm điểm thành công nhưng lấy câu hỏi kế tiếp thất bại, để
> lại một lượt đã chấm mà không có câu hỏi nào để trả lời.
>
> Đây là breaking change được phép theo §5 vì đúng một module (`tech`) đang
> implement và đã được migrate trong cùng commit.

`sessionLength` chuyển vào `TurnOutcome` thay vì là hằng số phía client: server
là nguồn quyết định độ dài phiên (specs/002 §10 Q1).

`InterviewQuestion` và `AnswerEvaluation` được định nghĩa ở `src/lib/session/types.ts` — tức thuộc **Core**, không thuộc module. Đây là chủ đích: chúng là hình dạng dữ liệu Core lưu trữ và render, nên đặt ở `src/lib` giữ đúng chiều phụ thuộc `modules → lib` của `hla.md` §6 và tránh vòng lặp import.

Phần chấm điểm (nay nằm ở `ServerInterviewModule.evaluate`, phía server) chịu **cùng ràng buộc tất định** như `getSystemPrompt` ở §3.2 quy tắc 1, và vì lý do giống hệt: kết quả tái lập được thì mới debug được, và mới biến việc thay scorer mock bằng mô hình thật thành một thay đổi quan sát được thay vì âm thầm.

## 3. Contract cho System Prompt

### 3.1. Vấn đề với "prompt tĩnh"

Một string cố định (`export const prompt = "..."`) không thể phản ánh: level ứng viên (junior/senior), focus area do người dùng chọn, ngôn ngữ hiển thị, hay lịch sử phỏng vấn trước đó. Do đó contract bắt buộc prompt phải là **hàm dựng (builder)**, không phải giá trị tĩnh.

```ts
export type ExperienceLevel = "junior" | "mid" | "senior" | "staff";
export type Locale = "vi-VN";

export interface InterviewSessionContext {
  readonly sessionId: string;
  readonly candidateName?: string;
  readonly experienceLevel: ExperienceLevel;
  readonly focusAreas: readonly string[];
  readonly locale: Locale; // closed union — xem bên dưới
}

export type SystemPromptBuilder = (
  context: InterviewSessionContext
) => string;
```

### 3.2. Quy tắc bắt buộc cho `getSystemPrompt`

1. **Phải là pure function.** Cùng một `context` đầu vào luôn phải trả về cùng một prompt. Không được đọc `Date.now()`, `Math.random()`, biến môi trường, hay bất kỳ I/O nào bên trong. Lý do: prompt phải reproducible để debug và để cache ở tầng AI Gateway trong tương lai.
2. **Không được throw.** Nếu `context.focusAreas` rỗng hoặc thiếu optional field, hàm phải tự áp dụng giá trị mặc định hợp lý bên trong domain, không đẩy lỗi ra Core. Core coi `getSystemPrompt` là infallible theo type signature (không trả `Error`/`never`).
3. **Không chứa secrets.** Prompt là dữ liệu có thể bị log/hiển thị debug — cấm nhúng API key, nội dung nội bộ nhạy cảm.
4. **`experienceLevel` là closed union**, không phải `string` tự do — thêm level mới (vd. `"intern"`) là thay đổi ở `types.ts`, được review tập trung, không phải mỗi module tự định nghĩa levels riêng.
5. **`locale` cũng là closed union** vì đúng lý do đó. Chấp nhận một locale chưa có ngân hàng câu hỏi không tạo ra lỗi type — nó tạo ra response 200 sai ngôn ngữ, khó phát hiện hơn nhiều. Mở rộng locale là sửa một dòng ở `types.ts` và một dòng ở `interview-contract.ts`; một compile-time assertion bắt buộc hai chỗ phải đi cùng nhau.

### 3.3. Ví dụ tuân thủ

```ts
// src/modules/tech/prompt.ts
export const getTechSystemPrompt: SystemPromptBuilder = (context) => {
  const focus = context.focusAreas.length
    ? context.focusAreas.join(", ")
    : "general software engineering";

  return [
    `You are a ${context.experienceLevel}-level technical interviewer.`,
    `Focus areas: ${focus}.`,
    `Respond in locale: ${context.locale}.`,
  ].join(" ");
};
```

## 4. Contract cho Workspace Component

### 4.1. Vấn đề với "component không props"

Một `Workspace` không nhận props (`() => <div />`) không thể phản ánh trạng thái phiên (đang chờ AI trả lời, đã hoàn thành, tạm dừng) hay gửi dữ liệu ngược lên Core. Contract bắt buộc props hình dạng cố định:

```ts
export type SessionStatus = "idle" | "in_progress" | "paused" | "completed";

export interface WorkspaceSubmission {
  readonly type: string;
  readonly payload: unknown;
  readonly submittedAt: string; // ISO 8601
}

export interface ModuleWorkspaceProps {
  readonly context: InterviewSessionContext;
  readonly status: SessionStatus;
  readonly onSubmit: (submission: WorkspaceSubmission) => void;
}
```

### 4.2. Quy tắc bắt buộc cho `Workspace`

1. **Controlled, không tự quản trạng thái phiên.** `Workspace` được phép giữ local UI state (vd. nội dung đang gõ dở trong code editor) nhưng **không** được tự quyết định `SessionStatus` — trạng thái phiên chỉ do Session Engine (Core) sở hữu và truyền xuống qua props.
2. **`onSubmit` là kênh giao tiếp duy nhất lên Core.** Domain module không được gọi thẳng `src/lib/ai` hay ghi thẳng vào storage. Mọi output của Workspace đi qua `onSubmit`, Core chịu trách nhiệm forward tới AI Gateway.
3. **`payload: unknown`, không phải `any`.** Core không diễn giải nội dung `payload` — domain module tự định nghĩa type cụ thể cho `payload` bên trong domain (vd. `CodeSubmissionPayload`) và tự cast/validate khi đọc lại lịch sử của chính mình. `unknown` ép domain phải validate trước khi dùng, ngăn lỗi runtime âm thầm lan từ module này sang module khác.
4. **Không side-effect ẩn khi `status === "completed"`.** Khi phiên đã kết thúc, `Workspace` phải render ở chế độ read-only (không cho thao tác thêm), dù Core vẫn có thể tiếp tục render lại component này ở màn hình xem lại kết quả.

## 5. Nguyên tắc versioning cho contract

Vì `ModuleDefinition` là hợp đồng dùng chung cho mọi domain hiện tại và tương lai, thay đổi nó ảnh hưởng toàn bộ registry:

- **Additive, optional trước.** Thêm field mới vào `ModuleDefinition`/`ModuleWorkspaceProps` phải là optional (`field?:`) trong ít nhất một minor version, để module cũ không lập tức bị lỗi compile.
  - *Tiền lệ:* `interviewService` (2026-08-01) được thêm đúng theo quy tắc này — `techModule` cung cấp, `marketingModule` không, và không module nào phải sửa để tiếp tục compile.
- **Breaking change bắt buộc migration đồng thời.** Nếu buộc phải đổi field bắt buộc (vd. đổi `getSystemPrompt` signature), PR đó phải cập nhật **toàn bộ** module hiện có (`tech`, `marketing`, ...) trong cùng một commit — không được để module nào "nợ" migration.
- **Không tái sử dụng `id` đã từng bị xoá** cho một domain có ý nghĩa khác, vì `id` có thể đã tồn tại trong dữ liệu lịch sử của người dùng.

## 6. Checklist review cho module mới

Trước khi merge một domain module mới, xác nhận:

- [ ] `id` là kebab-case, chưa tồn tại trong `registry.ts`, và là giá trị cuối cùng (không phải placeholder tạm).
- [ ] `getSystemPrompt` không throw với `context` tối thiểu (chỉ có field bắt buộc, không có optional field).
- [ ] `getSystemPrompt` không đọc `Date.now()`, `Math.random()`, `process.env`, hay thực hiện network call.
- [ ] `Workspace` render hợp lệ ở cả 4 giá trị của `SessionStatus`.
- [ ] `Workspace` không import bất kỳ thứ gì từ `src/modules/<domain-khác>`.
- [ ] Không có `any` trong public surface của module (`index.ts` export).
- [ ] Nếu module cung cấp `interviewService`: phần chấm điểm phía server tất định (không `Date.now()`, `Math.random()`) — cùng câu hỏi + câu trả lời luôn cho cùng kết quả.
- [ ] Ngân hàng câu hỏi và scorer nằm dưới `server/` và import `"server-only"` — không bao giờ lọt vào bundle client (specs/002 §3.1).
- [ ] Module có nội dung phía server phải được đăng ký ở **cả** `registry.ts` (client) và `server-registry.ts` (route handler).

## 7. Tài liệu liên quan

- [`hla.md`](./hla.md) — vai trò của contract này trong luồng dữ liệu tổng thể.
- [`design-system.md`](./design-system.md) — cách `Workspace` được đặt trong layout Chat vs. Workspace.
