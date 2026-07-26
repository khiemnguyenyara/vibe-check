# User Stories — Vibe Check

**Status:** Source of Truth
**Owner:** Product Architecture
**Last updated:** 2026-07-25

## 1. Cách đọc tài liệu này

Mỗi story theo format:

> **Là** [vai trò], **tôi muốn** [hành động], **để** [giá trị].
> **Chấp nhận khi (AC):** danh sách điều kiện kiểm chứng được.
> **Domain:** module nào sở hữu story này (`core` = không phụ thuộc domain cụ thể).

Story được đánh dấu `[MVP]` phải xong trước khi ship v1. Story `[Fast-follow]` không chặn MVP nhưng nên thiết kế để không phải viết lại kiến trúc khi làm. Story `[Roadmap]` là định hướng, chưa cam kết thời điểm.

## 2. MVP — Tech Domain

### 2.1. Chọn domain & khởi tạo phiên

**US-01 [MVP] — Domain:** `core`
Là một ứng viên chuẩn bị phỏng vấn, tôi muốn thấy danh sách các domain khả dụng (hiện tại chỉ có "Technology") kèm mô tả ngắn, để tôi biết mình sắp luyện tập nội dung gì.

- AC1: Màn hình chọn domain render `label` và `description` từ mọi entry trong `moduleRegistry`, không hard-code text.
- AC2: Nếu registry chỉ có một domain (`tech`), UI vẫn hoạt động bình thường (không giả định luôn có ≥2 lựa chọn).

**US-02 [MVP] — Domain:** `core`
Là một ứng viên, tôi muốn khai báo level kinh nghiệm (junior/mid/senior/staff) và focus area (vd. "React", "System Design") trước khi bắt đầu, để câu hỏi phù hợp với trình độ của tôi.

- AC1: Input này được đóng gói thành `InterviewSessionContext` đúng theo `interface-contracts.md`.
- AC2: `focusAreas` cho phép rỗng (candidate chưa chắc muốn tập trung mảng nào) — `getSystemPrompt` phải tự xử lý trường hợp này (xem §3.2 `interface-contracts.md`).

### 2.2. Vòng lặp phỏng vấn

**US-03 [MVP] — Domain:** `tech`
Là một ứng viên, tôi muốn AI đặt câu hỏi kỹ thuật phù hợp với level và focus area tôi đã chọn, để buổi luyện tập sát với phỏng vấn thật.

- AC1: `techModule.getSystemPrompt(context)` phản ánh `experienceLevel` và `focusAreas` trong nội dung prompt (kiểm chứng bằng snapshot test ở giai đoạn triển khai).
- AC2: Câu hỏi đầu tiên xuất hiện trong Chat pane trong vòng < 5s sau khi khởi tạo phiên (NFR, đo ở giai đoạn triển khai AI Gateway).

**US-04 [MVP] — Domain:** `tech`
Là một ứng viên, tôi muốn có một khu vực làm bài riêng biệt (viết code / vẽ sơ đồ) tách khỏi khung chat, để tôi không phải trộn lẫn câu trả lời tự luận với phần thực hành.

- AC1: `TechWorkspace` render trong Workspace pane theo layout chuẩn ở `design-system.md`.
- AC2: Nội dung người dùng nhập trong Workspace được gửi lên qua `onSubmit` đúng shape `WorkspaceSubmission`, không gọi thẳng AI Gateway.

**US-05 [MVP] — Domain:** `core`
Là một ứng viên, tôi muốn thấy rõ trạng thái hiện tại của phiên (đang diễn ra / tạm dừng / đã hoàn thành), để tôi biết khi nào có thể tiếp tục hay đã kết thúc.

- AC1: `SessionStatus` hiển thị nhất quán ở cả Chat pane và Workspace pane (cùng một nguồn state từ Session Engine).
- AC2: Khi `status === "completed"`, Workspace chuyển read-only (đúng contract §4.2 `interface-contracts.md`).

### 2.3. Kết thúc & xem lại

**US-06 [MVP] — Domain:** `core`
Là một ứng viên, tôi muốn kết thúc phiên bất kỳ lúc nào và xem lại toàn bộ hội thoại, để tôi có thể tự đánh giá lại sau.

- AC1: Kết thúc phiên chuyển `status` sang `"completed"` và chặn mọi `onSubmit` mới từ Workspace.
- AC2: Lịch sử hội thoại + submission được truy xuất lại nguyên vẹn (persistence layer nằm ngoài phạm vi tài liệu này).

## 3. Fast-follow

**US-07 [Fast-follow] — Domain:** `core`
Là một ứng viên, tôi muốn tạm dừng phiên và quay lại sau, để tôi không mất tiến độ khi bị gián đoạn.

- AC1: `status = "paused"` được Session Engine hỗ trợ ngay từ MVP dù UI tạm dừng chưa cần hoàn thiện — đây là lý do `SessionStatus` có 4 giá trị ngay từ đầu thay vì chỉ 2.

**US-08 [Fast-follow] — Domain:** `core`
Là một ứng viên, tôi muốn nhận một bản tóm tắt đánh giá (điểm mạnh/điểm yếu) sau khi hoàn thành phiên, để biết mình cần cải thiện gì.

- AC1: Bản tóm tắt được sinh từ `getSystemPrompt` + lịch sử hội thoại, không cần thay đổi `ModuleDefinition`.

## 4. Roadmap — Mở rộng đa domain

**US-09 [Roadmap] — Domain:** `marketing`
Là một ứng viên ứng tuyển vị trí Marketing, tôi muốn luyện tập case-study phỏng vấn (vd. lên kế hoạch chiến dịch, phân tích brand), để chuẩn bị cho phỏng vấn thực tế của ngành marketing thay vì tech.

- AC1: `marketingModule` implement đúng `ModuleDefinition` — không cần Core biết trước "case-study canvas" là gì.
- AC2: Thêm domain này chỉ thay đổi: `src/modules/marketing/*` và một dòng trong `registry.ts` (kiểm chứng trực tiếp nguyên tắc ở `hla.md` §7).

**US-10 [Roadmap] — Domain:** `content`
Là một ứng viên ứng tuyển vị trí Content/Copywriting, tôi muốn được chấm bài viết mẫu theo tiêu chí ngành content, để biết chất lượng bài viết của mình so với kỳ vọng nhà tuyển dụng.

- AC1: Workspace của domain `content` là một rich-text editor thay vì code editor — minh chứng rằng `ModuleWorkspaceProps` đủ tổng quát cho mọi loại UI làm bài, không chỉ code.

**US-11 [Roadmap] — Domain:** `core`
Là một product manager, tôi muốn bật/tắt một domain cho một nhóm người dùng cụ thể (feature flag / A-B test), để thử nghiệm domain mới trước khi ra mắt toàn bộ.

- AC1: Registry hỗ trợ điều kiện include/exclude entry theo config, không cần đổi `ModuleDefinition` (đã dự trù ở `hla.md` §5).

**US-12 [Roadmap] — Domain:** `core`
Là một ứng viên, tôi muốn chuyển đổi giữa các domain khác nhau trong cùng một tài khoản và xem lịch sử luyện tập theo từng domain, để theo dõi tiến bộ của mình trên nhiều mảng nghề nghiệp.

- AC1: Lịch sử phiên lưu kèm `moduleId` — đây là lý do `id` trong `ModuleDefinition` phải ổn định vĩnh viễn (xem `interface-contracts.md` §5).

## 5. Ngoài phạm vi (Explicitly Out of Scope — MVP)

Để tránh scope creep khi triển khai, các mục sau **không** thuộc MVP dù có thể được đề cập ở review:

- Chấm điểm tự động bằng rubric có trọng số (chỉ có nhận xét định tính ở MVP).
- Phỏng vấn bằng giọng nói (voice-to-voice).
- Multi-domain trong cùng một phiên (một phiên luôn gắn với đúng một `moduleId`).
- Cộng tác nhiều người dùng trong cùng một phiên.

## 6. Tài liệu liên quan

- [`hla.md`](./hla.md) — cách kiến trúc hiện thực hoá các story roadmap mà không cần viết lại Core.
- [`interface-contracts.md`](./interface-contracts.md) — contract mà mọi domain ở §4 phải tuân thủ.
