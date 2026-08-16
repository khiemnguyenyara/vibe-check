import "server-only";

import type { ExperienceLevel } from "../../types";

/**
 * The Tech question bank. Server-only by construction.
 *
 * specs/002-architecture-and-api-contracts.md §3.1 puts question selection
 * on the server so the bank stays out of the JS bundle and out of a curious
 * candidate's DevTools. The `server-only` import above turns an accidental
 * client import into a build error rather than a silent leak — the invariant
 * is worth more than a comment asking people to remember it.
 *
 * Content is unchanged from the previous client-side mock; only its location
 * and its export shape moved.
 */

export type QuestionBankEntry =
  | {
      readonly type: "open";
      readonly question: string;
      readonly expectedKeyPoints: readonly string[];
      readonly rubric: {
        readonly maxScore: number;
        readonly criteria: string;
      };
      readonly difficulty_analysis: {
        readonly suggestedLevel: "EASY" | "MEDIUM" | "HARD";
        readonly reasoning: string;
      };
      /** None of the current questions ask for a code exercise — all false today. */
      readonly requiresPractice: boolean;
    }
  | {
      readonly type: "multiple_choice";
      readonly question: string;
      readonly options: readonly string[];
      /** Index into `options`. Server-only — never enters `toQuestion()`'s output. */
      readonly correctOptionIndex: number;
      readonly maxScore: number;
      readonly difficulty_analysis: {
        readonly suggestedLevel: "EASY" | "MEDIUM" | "HARD";
        readonly reasoning: string;
      };
    };

/** How many questions one Tech session contains. */
export const TECH_SESSION_LENGTH = 5;

export const QUESTION_BANK: Record<ExperienceLevel, readonly QuestionBankEntry[]> = {
  junior: [
    {
      type: "open",
      question:
        "Sự khác biệt giữa `useState` và `useRef` trong React là gì? Khi nào bạn sẽ chọn dùng `useRef` thay vì `useState`?",
      expectedKeyPoints: [
        "useState trigger re-render, useRef thì không",
        "useRef giữ giá trị mutable xuyên suốt vòng đời component",
        "Ví dụ dùng useRef: tham chiếu DOM node, lưu giá trị không cần hiển thị lên UI",
      ],
      rubric: {
        maxScore: 10,
        criteria:
          "0-4: nhầm lẫn công dụng hai hook. 5-7: phân biệt đúng nhưng thiếu ví dụ. 8-10: phân biệt đúng kèm ví dụ thực tế hợp lý.",
      },
      difficulty_analysis: {
        suggestedLevel: "EASY",
        reasoning: "Kiến thức nền tảng về React hooks, phù hợp Junior.",
      },
      requiresPractice: false,
    },
    {
      type: "open",
      question:
        "`key` prop trong danh sách React dùng để làm gì? Điều gì xảy ra nếu bạn dùng index của mảng làm `key`?",
      expectedKeyPoints: [
        "key giúp React nhận diện phần tử nào thay đổi/thêm/xoá giữa các lần render",
        "Dùng index làm key có thể gây lỗi state khi thứ tự phần tử thay đổi (thêm/xoá/sắp xếp lại)",
        "Nên dùng id ổn định của dữ liệu thay vì index khi danh sách có thể thay đổi thứ tự",
      ],
      rubric: {
        maxScore: 10,
        criteria:
          "0-4: không biết vai trò của key. 5-7: biết vai trò nhưng không nêu được rủi ro của index-as-key. 8-10: nêu đúng rủi ro kèm ví dụ cụ thể.",
      },
      difficulty_analysis: {
        suggestedLevel: "EASY",
        reasoning: "Kiến thức nền tảng về reconciliation trong React.",
      },
      requiresPractice: false,
    },
    {
      type: "open",
      question:
        "Bạn hiểu thế nào về `any` và `unknown` trong TypeScript? Vì sao `unknown` thường được xem là lựa chọn an toàn hơn?",
      expectedKeyPoints: [
        "any tắt hoàn toàn type-checking, unknown vẫn giữ type-safety",
        "unknown bắt buộc phải narrow type trước khi sử dụng",
        "Ví dụ thực tế: dữ liệu từ API response nên type unknown rồi validate",
      ],
      rubric: {
        maxScore: 10,
        criteria:
          "0-4: cho rằng any và unknown tương đương. 5-7: phân biệt đúng khái niệm. 8-10: phân biệt đúng kèm ví dụ áp dụng thực tế.",
      },
      difficulty_analysis: {
        suggestedLevel: "EASY",
        reasoning: "Kiến thức nền tảng TypeScript cần có ở Junior.",
      },
      requiresPractice: false,
    },
    {
      type: "multiple_choice",
      question:
        "Trong JavaScript, phương thức nào dùng để chuyển một chuỗi JSON thành object?",
      options: [
        "JSON.parse()",
        "JSON.stringify()",
        "Object.assign()",
        "String.parse()",
      ],
      correctOptionIndex: 0,
      maxScore: 10,
      difficulty_analysis: {
        suggestedLevel: "EASY",
        reasoning: "Kiến thức nền tảng về JSON trong JavaScript.",
      },
    },
    {
      type: "multiple_choice",
      question:
        "Trong CSS Flexbox, thuộc tính nào dùng để căn giữa các item theo trục chính (main axis) khi `flex-direction` là `row`?",
      options: [
        "justify-content",
        "align-items",
        "align-self",
        "flex-wrap",
      ],
      correctOptionIndex: 0,
      maxScore: 10,
      difficulty_analysis: {
        suggestedLevel: "EASY",
        reasoning: "Kiến thức nền tảng về Flexbox layout.",
      },
    },
  ],
  mid: [
    {
      type: "open",
      question:
        "Bạn có component `UserList` nhận props `users: User[]` và callback `onSelect: (id: string) => void`. Mỗi khi component cha re-render vì một state không liên quan thay đổi, toàn bộ `UserList` và các item con đều re-render theo, dù `users` không đổi. Giải thích nguyên nhân và cách bạn tối ưu, kèm cách type props bằng TypeScript.",
      expectedKeyPoints: [
        "Callback prop được tạo mới mỗi lần render khiến React.memo không hiệu quả",
        "Dùng useCallback để giữ tham chiếu ổn định",
        "Bọc component con bằng React.memo",
        "Cân nhắc useMemo nếu users là dữ liệu tính toán lại",
        "Nêu được trade-off: chỉ tối ưu khi list lớn / render tốn kém",
      ],
      rubric: {
        maxScore: 10,
        criteria:
          "0-3: chỉ nhận diện hiện tượng. 4-6: giải thích đúng nguyên nhân + 1 giải pháp. 7-8: đầy đủ useCallback+React.memo+type props. 9-10: thêm phân tích trade-off và đề cập profiling trước khi tối ưu.",
      },
      difficulty_analysis: {
        suggestedLevel: "MEDIUM",
        reasoning:
          "Đòi hỏi hiểu cơ chế render + kỹ thuật tối ưu phổ biến, đúng tầm Mid-level Frontend theo JD (React, TypeScript, performance).",
      },
      requiresPractice: false,
    },
    {
      type: "open",
      question:
        "Generic trong TypeScript giúp ích gì khi viết một custom hook như `useFetch<T>`? Hãy phác thảo signature của hook này và giải thích lý do.",
      expectedKeyPoints: [
        "Generic cho phép hook tái sử dụng với nhiều kiểu dữ liệu trả về khác nhau mà vẫn giữ type-safety",
        "Không dùng any/unknown ép kiểu, tránh mất type-checking ở nơi gọi",
        "Ví dụ signature hợp lý: function useFetch<T>(url: string): { data: T | null; isLoading: boolean; error: string | null }",
      ],
      rubric: {
        maxScore: 10,
        criteria:
          "0-4: không dùng generic, ép kiểu any. 5-7: dùng generic đúng nhưng signature chưa đầy đủ trạng thái loading/error. 8-10: signature đầy đủ, giải thích rõ lợi ích type-safety.",
      },
      difficulty_analysis: {
        suggestedLevel: "MEDIUM",
        reasoning:
          "Đòi hỏi hiểu generic và thiết kế API hook tái sử dụng — kỹ năng cốt lõi của Mid-level.",
      },
      requiresPractice: false,
    },
    {
      type: "open",
      question:
        "So sánh Context API và một thư viện state management ngoài (Zustand/Redux) khi dùng cho một form nhiều bước (multi-step form) có validate chéo giữa các bước.",
      expectedKeyPoints: [
        "Context API dễ gây re-render toàn cây con khi value thay đổi thường xuyên",
        "Zustand/Redux tách state ra ngoài React tree, chọn lọc re-render qua selector",
        "Với form nhiều bước, cần cân nhắc validate chéo cần đọc state từ nhiều bước cùng lúc",
        "Kết luận hợp lý tuỳ quy mô: Context đủ dùng cho form nhỏ, store ngoài phù hợp form phức tạp",
      ],
      rubric: {
        maxScore: 10,
        criteria:
          "0-4: chỉ biết một giải pháp. 5-7: so sánh đúng ưu nhược điểm cơ bản. 8-10: so sánh sâu kèm khuyến nghị theo quy mô cụ thể.",
      },
      difficulty_analysis: {
        suggestedLevel: "MEDIUM",
        reasoning: "Yêu cầu so sánh đánh đổi công cụ ở một tình huống cụ thể, đúng tầm Mid-level.",
      },
      requiresPractice: false,
    },
    {
      type: "multiple_choice",
      question:
        "Trong React, hook nào phù hợp nhất để memo hoá kết quả của một phép tính tốn kém, tránh tính lại mỗi lần re-render nếu dependencies không đổi?",
      options: ["useEffect", "useMemo", "useCallback", "useLayoutEffect"],
      correctOptionIndex: 1,
      maxScore: 10,
      difficulty_analysis: {
        suggestedLevel: "MEDIUM",
        reasoning: "Phân biệt đúng công dụng các hook tối ưu hoá trong React.",
      },
    },
    {
      type: "multiple_choice",
      question:
        "HTTP status code nào biểu thị request thành công nhưng server không trả về nội dung (no content)?",
      options: ["201", "202", "204", "200"],
      correctOptionIndex: 2,
      maxScore: 10,
      difficulty_analysis: {
        suggestedLevel: "MEDIUM",
        reasoning: "Kiến thức về các mã trạng thái HTTP phổ biến trong thiết kế API.",
      },
    },
  ],
  senior: [
    {
      type: "open",
      question:
        "Thiết kế state management cho một dashboard có nhiều widget độc lập, mỗi widget fetch dữ liệu riêng nhưng cần chia sẻ một số filter chung (khoảng thời gian, khu vực). Bạn sẽ tổ chức state ở đâu, dùng công cụ gì, và đánh đổi giữa Context API, Redux/Zustand, và server state (React Query) ra sao?",
      expectedKeyPoints: [
        "Tách bạch client state (filter dùng chung) và server state (dữ liệu từng widget)",
        "Đề xuất dùng React Query/SWR cho server state, tránh tự quản lý cache thủ công",
        "Context hoặc store nhẹ (Zustand) cho filter dùng chung, tránh prop drilling",
        "Phân tích khi nào Redux là over-engineering cho bài toán này",
        "Đề cập tránh re-render toàn dashboard khi một filter đổi (selector pattern)",
      ],
      rubric: {
        maxScore: 10,
        criteria:
          "0-4: đề xuất một giải pháp duy nhất không phân tích trade-off. 5-7: phân tách đúng client/server state. 8-10: phân tách rõ ràng, chọn công cụ hợp lý, có phân tích performance/re-render.",
      },
      difficulty_analysis: {
        suggestedLevel: "HARD",
        reasoning:
          "Yêu cầu tư duy kiến trúc, đánh đổi công cụ và performance ở quy mô nhiều component — đúng tầm Senior.",
      },
      requiresPractice: false,
    },
    {
      type: "open",
      question:
        "Một trang danh sách sản phẩm bị Largest Contentful Paint (LCP) chậm trên mobile. Bạn sẽ chẩn đoán nguyên nhân theo quy trình nào, và liệt kê 3 hướng tối ưu cụ thể cho Next.js App Router?",
      expectedKeyPoints: [
        "Quy trình chẩn đoán: đo bằng Lighthouse/WebPageTest, xác định phần tử LCP cụ thể",
        "Kiểm tra ảnh: dùng next/image, ưu tiên preload ảnh LCP, đúng định dạng/kích thước",
        "Kiểm tra render: Server Components để giảm JS gửi xuống client, tránh waterfall fetch",
        "Kiểm tra font: font-display swap, preconnect, tránh layout shift",
      ],
      rubric: {
        maxScore: 10,
        criteria:
          "0-4: chỉ đoán nguyên nhân không có quy trình đo đạc. 5-7: có quy trình đo + 1-2 hướng tối ưu đúng. 8-10: quy trình rõ ràng kèm ít nhất 3 hướng tối ưu cụ thể, đúng ngữ cảnh Next.js.",
      },
      difficulty_analysis: {
        suggestedLevel: "HARD",
        reasoning:
          "Đòi hỏi kinh nghiệm thực chiến về performance profiling và tối ưu ở tầng framework — tầm Senior.",
      },
      requiresPractice: false,
    },
    {
      type: "multiple_choice",
      question:
        "CAP theorem phát biểu rằng một hệ thống phân tán chỉ có thể đảm bảo tối đa 2 trong 3 tính chất nào cùng lúc?",
      options: [
        "Concurrency, Availability, Precision",
        "Consistency, Availability, Partition tolerance",
        "Consistency, Atomicity, Persistence",
        "Availability, Accuracy, Performance",
      ],
      correctOptionIndex: 1,
      maxScore: 10,
      difficulty_analysis: {
        suggestedLevel: "HARD",
        reasoning: "Kiến thức nền tảng về hệ thống phân tán, cần thiết ở tầm Senior.",
      },
    },
    {
      type: "multiple_choice",
      question:
        "Kỹ thuật nào giúp giảm rủi ro khi nhiều service gọi tuần tự tới cùng một downstream dependency đang lỗi, bằng cách 'ngắt mạch' tạm thời sau một ngưỡng lỗi nhất định?",
      options: [
        "Load balancing",
        "Connection pooling",
        "Rate limiting",
        "Circuit breaker",
      ],
      correctOptionIndex: 3,
      maxScore: 10,
      difficulty_analysis: {
        suggestedLevel: "HARD",
        reasoning: "Mẫu thiết kế chịu lỗi phổ biến trong hệ thống phân tán ở tầm Senior.",
      },
    },
  ],
  staff: [
    {
      type: "open",
      question:
        "Bạn được giao dẫn dắt việc tách một monolith Next.js front-end (một team, một repo) thành kiến trúc module hoá cho nhiều team cùng phát triển song song mà không giẫm chân nhau. Bạn sẽ định nghĩa ranh giới module như thế nào, enforce nó ra sao (tooling/CI), và xử lý các phần dùng chung (design system, auth) thế nào để tránh trở thành nút thắt cổ chai?",
      expectedKeyPoints: [
        "Định nghĩa ranh giới theo domain/nghiệp vụ, không theo layer kỹ thuật",
        "Đề xuất enforce bằng lint rule (import boundaries) hoặc codeowners, không chỉ dựa vào quy ước",
        "Chiến lược versioning cho shared packages (design system) để không block các team khác",
        "Cân nhắc giữa monorepo (workspaces) và multi-repo, đánh đổi CI/CD",
        "Kế hoạch di trú tăng dần (incremental migration), không big-bang rewrite",
      ],
      rubric: {
        maxScore: 10,
        criteria:
          "0-4: chỉ dừng ở tách file/folder. 5-7: có chiến lược ranh giới và shared code hợp lý. 8-10: thêm cơ chế enforce tự động và kế hoạch di trú an toàn.",
      },
      difficulty_analysis: {
        suggestedLevel: "HARD",
        reasoning:
          "Vấn đề tổ chức kiến trúc multi-team, vượt khỏi phạm vi kỹ thuật thuần tuý sang tổ chức/process — tầm Staff.",
      },
      requiresPractice: false,
    },
    {
      type: "open",
      question:
        "Làm thế nào bạn đưa ra quyết định kỹ thuật gây tranh cãi (ví dụ: đổi thư viện state management toàn hệ thống) khi các team khác không đồng thuận? Hãy trình bày quy trình bạn dùng để đạt đồng thuận và giảm thiểu rủi ro triển khai.",
      expectedKeyPoints: [
        "Đề xuất viết RFC/ADR (Architecture Decision Record) nêu rõ bối cảnh, lựa chọn, đánh đổi",
        "Thu thập phản hồi từ các bên liên quan trước khi chốt quyết định",
        "Đề xuất rollout tăng dần (feature flag, một module thí điểm) thay vì áp dụng toàn hệ thống ngay",
        "Có tiêu chí đo lường thành công/thất bại rõ ràng trước khi mở rộng",
      ],
      rubric: {
        maxScore: 10,
        criteria:
          "0-4: chỉ mô tả quyết định kỹ thuật, không đề cập quy trình đồng thuận. 5-7: có quy trình cơ bản. 8-10: quy trình đầy đủ (RFC, rollout tăng dần, tiêu chí đo lường).",
      },
      difficulty_analysis: {
        suggestedLevel: "HARD",
        reasoning:
          "Đánh giá năng lực lãnh đạo kỹ thuật và quản trị thay đổi ở quy mô tổ chức — tầm Staff.",
      },
      requiresPractice: false,
    },
  ],
};
