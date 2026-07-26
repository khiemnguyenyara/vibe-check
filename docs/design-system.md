# Design System — Vibe Check

**Status:** Source of Truth
**Owner:** Product Architecture
**Last updated:** 2026-07-25

## 1. Triết lý thiết kế

Vibe Check có một layout nghiệp vụ **bất biến qua mọi domain**: một phiên phỏng vấn luôn gồm **Chat pane** (hội thoại với AI) và **Workspace pane** (không gian làm bài đặc thù domain). Design system này định nghĩa phần khung (chrome) dùng chung và ranh giới rõ ràng cho phần mà mỗi domain được tự do tuỳ biến bên trong.

Nguyên tắc: **domain module không bao giờ tự quyết định layout tổng thể** — nó chỉ điền nội dung vào một vùng đã được Core cấp sẵn kích thước, scroll behavior, và responsive rules.

## 2. Nền tảng UI: Shadcn/UI

### 2.1. Lý do chọn Shadcn/UI

- Component là **code được copy vào repo** (`src/components/ui`), không phải package đóng gói — phù hợp triết lý "core không phụ thuộc runtime vào domain" vì ngược lại cũng đúng: domain không bị khoá vào version của một UI library bên thứ ba tách biệt khỏi codebase.
- Dựa trên Radix UI (accessibility primitives) + Tailwind CSS (đã có sẵn trong project) — không thêm một hệ styling song song.
- Dễ tuỳ biến theo token riêng của Vibe Check mà không cần override CSS của thư viện đóng gói.

### 2.2. Quy tắc sử dụng

1. **Mọi component trong `src/components/ui` là primitive dùng chung** — Button, Dialog, Input, Tabs, Card, ScrollArea, Separator, Badge... Không domain nào được fork hay wrap riêng một bản khác của cùng một primitive.
2. **Domain module chỉ được compose từ primitive có sẵn**, không tự tạo primitive mới trong `src/modules/<domain>`. Nếu một domain cần một primitive chưa có (vd. `CodeEditor`), primitive đó phải được thêm vào `src/components/ui` (nếu đủ tổng quát để tái sử dụng) hoặc `src/components/<domain-agnostic-name>` — không đặt trong `src/modules/*`.
3. **Không hard-code màu/spacing bằng giá trị số.** Luôn dùng Tailwind token (`bg-background`, `text-muted-foreground`, `gap-4`...) đã cấu hình theo theme của Shadcn, để dark mode và rebrand không phải sửa từng component domain.
4. **Icon dùng chung một bộ** (`lucide-react`, đi kèm chuẩn Shadcn/UI) — không trộn nhiều icon set trong cùng một màn hình.

### 2.3. Thiết lập

Chạy `npx shadcn@latest init` và thêm component theo nhu cầu (`npx shadcn@latest add button dialog tabs scroll-area`) trước khi bắt đầu code UI. Kết quả sinh ra nằm trong `src/components/ui/`, cấu hình trong `components.json` ở root.

## 3. Layout chuẩn: Chat vs. Workspace

### 3.1. Cấu trúc hai cột

```
┌──────────────────────────────────────────────────────────┐
│  App Header (logo, session status, timer)                │
├───────────────────────────┬────────────────────────────────┤
│                           │                                │
│      Chat Pane            │        Workspace Pane          │
│  (hội thoại AI ↔ user)    │   (module.Workspace render ở đây) │
│                           │                                │
│  - scroll độc lập         │   - scroll độc lập              │
│  - luôn hiển thị          │   - có thể collapse trên mobile  │
│                           │                                │
├───────────────────────────┴────────────────────────────────┤
│  Input bar (gắn với Chat Pane, sticky bottom)               │
└──────────────────────────────────────────────────────────┘
```

- **Desktop (≥ 1024px):** hai cột cạnh nhau, tỉ lệ mặc định 40% Chat / 60% Workspace — Workspace thường cần nhiều không gian hơn (code editor, canvas).
- **Tablet (768–1023px):** hai cột vẫn song song nhưng tỉ lệ 45/55, padding thu gọn.
- **Mobile (< 768px):** chuyển sang tab switcher (`Tabs` của Shadcn) giữa "Chat" và "Workspace" — không bao giờ ép hai pane chồng lên nhau theo chiều dọc mặc định, vì Workspace (code/canvas) cần chiều cao đủ lớn để dùng được.

### 3.2. Trách nhiệm của từng bên

| | Chat Pane | Workspace Pane |
|---|---|---|
| **Sở hữu bởi** | Core (`src/app` + `src/components`) | Domain module (`module.Workspace`), đặt trong khung do Core cấp |
| **Nội dung** | Lịch sử hội thoại, input box, trạng thái "AI đang trả lời" | Hoàn toàn do domain quyết định (code editor, case-study canvas, content brief...) |
| **Được domain tuỳ biến?** | Không — domain không render trực tiếp vào Chat Pane | Có — toàn quyền bên trong khung, miễn tuân thủ props ở `interface-contracts.md` |
| **Responsive** | Core xử lý | Domain tự chịu trách nhiệm responsive *bên trong* khung được cấp (Core chỉ đảm bảo khung có kích thước hợp lý) |

### 3.3. Quy tắc không thoả hiệp

1. **Workspace không được render fixed/absolute ra ngoài khung của nó** (vd. modal toàn màn hình che cả Chat pane) trừ khi dùng `Dialog`/`Sheet` chuẩn của Shadcn — vì lúc đó nó là tương tác tạm thời được Core kiểm soát z-index, không phải domain tự ý chiếm layout.
2. **Chat Pane luôn phải visible hoặc truy cập được trong 1 thao tác** (kể cả trên mobile ở chế độ tab) — đây là kênh duy nhất người dùng thấy phản hồi AI, không được ẩn sâu.
3. **Trạng thái loading/streaming của AI hiển thị trong Chat Pane, không phải Workspace** — Workspace chỉ phản ánh `SessionStatus` được truyền qua props (đã định nghĩa ở `interface-contracts.md`), không tự vẽ thêm loading indicator cho việc AI đang suy nghĩ.

## 4. Theming

- Light/dark mode dùng CSS variables chuẩn của Shadcn (`--background`, `--foreground`, `--primary`...) khai báo trong `globals.css`. Domain module không định nghĩa theme riêng.
- Trạng thái `SessionStatus` có màu semantic cố định dùng xuyên suốt app: `idle` = `muted`, `in_progress` = `primary`, `paused` = `warning` (amber), `completed` = `success` (green). Domain module tái sử dụng đúng token này khi hiển thị trạng thái trong Workspace, không tự chọn màu khác.

## 5. Accessibility

- Mọi primitive tương tác (button, input, tab) kế thừa từ Radix qua Shadcn nên đã có ARIA + keyboard navigation mặc định — domain module không được strip các thuộc tính này khi compose.
- Workspace chứa code editor/canvas phải có ít nhất một đường dẫn thao tác bằng bàn phím thuần (không bắt buộc chuột), vì đây là công cụ luyện phỏng vấn — nhiều ứng viên sẽ dùng để luyện thao tác gõ phím nhanh.

## 6. Tài liệu liên quan

- [`hla.md`](./hla.md) — vị trí của Shell/Workspace trong luồng dữ liệu tổng thể.
- [`interface-contracts.md`](./interface-contracts.md) — props chính xác mà `Workspace` nhận được từ Core.
