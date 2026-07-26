# Product Requirements Document: ProbeAI Platform (MVP)

## 1. Tổng quan & Bối cảnh (Overview & Background)
- **Vấn đề cốt lõi:** Người lao động (đặc biệt là Junior/Mid-level) thiếu môi trường thực hành phỏng vấn chuyên sâu, dẫn đến thiếu tự tin và hổng kiến thức thực tế. Các giải pháp hiện tại thường quá chung chung hoặc bị giới hạn trong một lĩnh vực duy nhất.
- **Mục tiêu:** 
    1. Xây dựng nền tảng phỏng vấn giả lập (AI Mock Interview) có khả năng mở rộng đa lĩnh vực.
    2. Cung cấp phản hồi chuyên môn tức thời (Feedback loop) dựa trên đặc thù công việc của từng ngành (Tech, Marketing, Content, v.v.).

## 2. Chỉ số thành công (Success Metrics)
- **Completion Rate:** Tỷ lệ người dùng hoàn thành ít nhất 1 phiên phỏng vấn (target: > 60%).
- **Domain Diversity:** Khả năng triển khai thành công thêm ít nhất 1 Domain mới (ví dụ: Marketing) mà không cần thay đổi Core Logic.
- **CSAT:** Điểm hài lòng của người dùng (> 4/5).

## 3. Đối tượng mục tiêu & User Stories
- **Đối tượng:** Junior/Mid-level Professionals trong nhiều lĩnh vực (Bắt đầu với Tech/Dev).
- **User Stories:**
    - "Là một người tìm việc, tôi muốn tham gia phỏng vấn mô phỏng đúng với lĩnh vực của mình, để tôi không phải trả lời những câu hỏi sáo rỗng."
    - "Là một Junior, tôi muốn AI phản biện các bài giải/sản phẩm của tôi, để tôi hiểu được các lỗ hổng tư duy của mình."
    - "Là một người dùng, tôi muốn nhận báo cáo đánh giá sau phỏng vấn, để tôi có lộ trình ôn tập cụ thể."

## 4. Yêu cầu tính năng (Product Requirements)
### Yêu cầu chức năng:
- **Domain-Based Session:** Người dùng chọn lĩnh vực (Tech, Content, Marketing...) trước khi bắt đầu. Hệ thống sẽ tự nạp Prompt và Workspace tương ứng.
- **Flexible Workspace:** 
    - Tech: Tích hợp Monaco Editor.
    - Content/Marketing: Tích hợp Text Editor (Rich Text).
    - Các ngành khác: Tích hợp Whiteboard/Diagram tool trong tương lai.
- **AI Evaluation Engine:** Chấm điểm dựa trên rubric chuyên biệt theo từng Domain.
- **Reporting Engine:** Tổng kết báo cáo chuyên môn theo ngành.

### Yêu cầu phi chức năng:
- **Scalability:** Kiến trúc "Module-based". Logic phỏng vấn (Chat) tách rời với công cụ hỗ trợ (Workspace).
- **Latency:** Thời gian phản hồi AI (streaming) < 2s.
- **Security:** Bảo mật dữ liệu người dùng và API Keys.

## 5. Phạm vi (In-scope & Out-of-scope)
- **In-scope (MVP):** Nền tảng Core (Chat + Session), 01 Domain mẫu (Software Engineering), 01 Workspace mẫu (Monaco Editor).
- **Out-of-scope:** Hệ thống Auth phức tạp, hệ thống thanh toán, upload file, social features.

## 6. Trải nghiệm người dùng (UX/UI)
- **Design Philosophy:** Minimalist, Dark mode, tối ưu không gian hiển thị cho Workspace để người dùng tập trung cao độ.
- **Component Library:** Sử dụng Shadcn/UI.

## 7. Rủi ro, Giả định & Câu hỏi mở
- **Giả định:** Người dùng sẵn sàng tương tác với AI thay vì người thật để luyện tập.
- **Rủi ro:** Chi phí OpenAI API (cần tối ưu prompt để giảm token). 
- **Câu hỏi mở:** Làm thế nào để tạo ra các tập rubric chấm điểm chuẩn xác cho những ngành mang tính định tính cao như Content/Marketing? (Giải pháp: Hợp tác hoặc nghiên cứu từ các nguồn tài liệu uy tín của ngành).

## 8. Lộ trình & Mốc thời gian (Roadmap & Timeline)
- **Phase 1 (MVP - Dev Focus):** Xây dựng Core & Module Tech (4 tuần).
- **Phase 2 (Scaling):** Tách biệt Prompt/Workspace để tích hợp Module Marketing/Content (2 tuần tiếp theo).
- **Launch Date:** [Ngày dự kiến hoàn thành].