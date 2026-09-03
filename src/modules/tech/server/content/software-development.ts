import "server-only";

import type { SpecialtyBank } from "./types";

/**
 * Software Development — system design, data structures, distributed systems.
 *
 * `id` matches the `software-development` specialty in src/lib/domains.ts,
 * which marks it difficulty 3. The bank is weighted accordingly: the junior
 * tier still probes fundamentals, but senior and staff lean on
 * distributed-systems reasoning rather than framework knowledge.
 *
 * The CAP and circuit-breaker questions previously sat in the flat bank and
 * were being served to frontend candidates; they belong here.
 */
export const softwareDevelopmentBank: SpecialtyBank = {
  id: "software-development",
  label: "Software Development",
  questions: {
    junior: [
      {
        type: "open",
        question: {
          vi: "Khi nào bạn chọn dùng hash map thay vì mảng để lưu một tập dữ liệu? Nêu một ví dụ cụ thể và độ phức tạp của thao tác tra cứu trong mỗi trường hợp.",
          en: "When would you choose a hash map over an array to store a dataset? Give a concrete example and the lookup complexity of each.",
        },
        expectedKeyPoints: [
          {
            vi: "Hash map cho tra cứu theo khoá trung bình O(1), mảng phải quét O(n) nếu chưa sắp xếp",
            en: "Hash map gives average O(1) key lookup; an unsorted array must scan in O(n)",
          },
          {
            vi: "Mảng phù hợp khi cần giữ thứ tự hoặc truy cập theo chỉ số",
            en: "An array fits when order matters or access is by index",
          },
          {
            vi: "Ví dụ cụ thể: đếm số lần xuất hiện, hoặc tra cứu người dùng theo id",
            en: "Concrete example: counting occurrences, or looking up a user by id",
          },
          {
            vi: "Hash map tốn thêm bộ nhớ và không đảm bảo thứ tự duyệt trong mọi ngôn ngữ",
            en: "Hash maps cost extra memory and do not guarantee iteration order in every language",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: không nêu được độ phức tạp. 5-7: nêu đúng độ phức tạp nhưng thiếu ví dụ. 8-10: nêu đúng độ phức tạp, có ví dụ, và nhận ra đánh đổi bộ nhớ hoặc thứ tự.",
            en: "0-4: cannot state the complexity. 5-7: correct complexity but no example. 8-10: correct complexity, an example, and the memory or ordering trade-off.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Kiến thức cấu trúc dữ liệu nền tảng, bắt buộc có ở Junior.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Bạn được giao viết hàm kiểm tra một chuỗi có phải là palindrome hay không, bỏ qua khoảng trắng và phân biệt hoa thường. Hãy trình bày cách làm, độ phức tạp, và những trường hợp biên bạn sẽ kiểm tra.",
          en: "Write a function that checks whether a string is a palindrome, ignoring whitespace and case. Describe your approach, its complexity, and the edge cases you would test.",
        },
        expectedKeyPoints: [
          {
            vi: "Chuẩn hoá chuỗi trước: đưa về chữ thường và loại bỏ ký tự không phải chữ/số",
            en: "Normalise first: lowercase and strip non-alphanumeric characters",
          },
          {
            vi: "Dùng hai con trỏ từ hai đầu vào giữa, độ phức tạp O(n) thời gian",
            en: "Two pointers from both ends inward, O(n) time",
          },
          {
            vi: "Nêu được cách làm O(1) bộ nhớ thay vì tạo chuỗi đảo ngược",
            en: "Achieves O(1) extra space instead of building a reversed copy",
          },
          {
            vi: "Trường hợp biên: chuỗi rỗng, một ký tự, chuỗi chỉ có khoảng trắng, ký tự Unicode",
            en: "Edge cases: empty string, single character, whitespace only, Unicode characters",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: giải được nhưng không nêu độ phức tạp. 5-7: có thuật toán đúng và độ phức tạp. 8-10: thêm phân tích bộ nhớ và liệt kê trường hợp biên cụ thể.",
            en: "0-4: solves it but states no complexity. 5-7: correct algorithm and complexity. 8-10: adds space analysis and concrete edge cases.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning:
            "Bài toán cơ bản, dùng để đánh giá cách nghĩ về trường hợp biên hơn là độ khó thuật toán.",
        },
        requiresPractice: true,
      },
      {
        type: "open",
        question: {
          vi: "Phân biệt tính bất biến (immutability) và khả biến (mutability) khi truyền dữ liệu giữa các hàm. Vì sao truyền một object khả biến vào hàm rồi sửa nó bên trong lại thường bị coi là thiết kế tệ?",
          en: "Distinguish immutability from mutability when passing data between functions. Why is mutating a caller's object inside a function usually considered poor design?",
        },
        expectedKeyPoints: [
          {
            vi: "Sửa tham số đầu vào tạo tác dụng phụ (side effect) mà nơi gọi không nhìn thấy từ signature",
            en: "Mutating an argument creates a side effect the signature does not reveal to the caller",
          },
          {
            vi: "Làm hàm khó test và khó suy luận vì kết quả phụ thuộc trạng thái bên ngoài",
            en: "Makes the function hard to test and reason about, since results depend on outside state",
          },
          {
            vi: "Dữ liệu bất biến an toàn hơn khi chia sẻ giữa nhiều nơi hoặc nhiều luồng",
            en: "Immutable data is safer when shared across call sites or threads",
          },
          {
            vi: "Đánh đổi: tạo bản sao tốn bộ nhớ, cần cân nhắc với dữ liệu lớn",
            en: "Trade-off: copying costs memory, which matters for large data",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ nêu định nghĩa. 5-7: nêu được tác hại của side effect. 8-10: nêu tác hại kèm ảnh hưởng tới testing và nhận ra đánh đổi bộ nhớ.",
            en: "0-4: only gives definitions. 5-7: names the harm of side effects. 8-10: names the harm, its effect on testing, and the memory trade-off.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Nguyên tắc thiết kế hàm nền tảng, áp dụng cho mọi ngôn ngữ.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Cấu trúc dữ liệu nào phù hợp nhất để triển khai cơ chế 'undo' nhiều bước trong một trình soạn thảo?",
          en: "Which data structure best implements multi-step 'undo' in an editor?",
        },
        options: [
          { vi: "Queue (FIFO)", en: "Queue (FIFO)" },
          { vi: "Stack (LIFO)", en: "Stack (LIFO)" },
          { vi: "Hash map", en: "Hash map" },
          { vi: "Binary heap", en: "Binary heap" },
        ],
        correctOptionIndex: 1,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning:
            "Ánh xạ giữa yêu cầu nghiệp vụ và cấu trúc dữ liệu phù hợp — kỹ năng nền tảng.",
        },
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Trong bốn tính chất ACID của giao dịch cơ sở dữ liệu, tính chất nào đảm bảo rằng một giao dịch hoặc thực hiện trọn vẹn, hoặc không để lại thay đổi nào?",
          en: "Among the four ACID properties, which guarantees that a transaction either completes fully or leaves no change at all?",
        },
        options: [
          { vi: "Atomicity", en: "Atomicity" },
          { vi: "Consistency", en: "Consistency" },
          { vi: "Isolation", en: "Isolation" },
          { vi: "Durability", en: "Durability" },
        ],
        correctOptionIndex: 0,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Kiến thức giao dịch cơ sở dữ liệu nền tảng.",
        },
      },
    ],
    mid: [
      {
        type: "open",
        question: {
          vi: "Thiết kế lược đồ dữ liệu cho tính năng bình luận nhiều tầng (comment có thể trả lời comment khác, không giới hạn độ sâu). Bạn chọn cách lưu nào, và truy vấn 'lấy toàn bộ cây bình luận của một bài viết' hoạt động ra sao?",
          en: "Design the data model for threaded comments (a comment can reply to another, unbounded depth). Which storage approach do you choose, and how does 'fetch the whole comment tree for a post' work?",
        },
        expectedKeyPoints: [
          {
            vi: "Cách đơn giản nhất là adjacency list với cột parent_id tự tham chiếu",
            en: "The simplest model is an adjacency list with a self-referencing parent_id",
          },
          {
            vi: "Adjacency list dễ ghi nhưng đọc cả cây cần đệ quy hoặc recursive CTE",
            en: "Adjacency list writes easily but reading the tree needs recursion or a recursive CTE",
          },
          {
            vi: "Nêu được ít nhất một lựa chọn thay thế: materialized path hoặc nested set, kèm đánh đổi",
            en: "Names at least one alternative — materialized path or nested set — with its trade-off",
          },
          {
            vi: "Materialized path đọc cây rất nhanh nhưng di chuyển nhánh thì tốn kém",
            en: "Materialized path reads trees fast but makes moving a subtree expensive",
          },
          {
            vi: "Cần index trên parent_id và post_id để truy vấn không quét toàn bảng",
            en: "Index parent_id and post_id so the query does not scan the whole table",
          },
          {
            vi: "Cân nhắc giới hạn độ sâu hiển thị để tránh truy vấn không giới hạn",
            en: "Cap displayed depth to avoid an unbounded query",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ nêu bảng phẳng không xử lý phân cấp. 4-6: dùng parent_id nhưng không nói cách đọc cả cây. 7-8: nêu được cách đọc và đánh đổi giữa hai mô hình. 9-10: thêm index và giới hạn độ sâu thực tế.",
            en: "0-3: a flat table with no hierarchy. 4-6: uses parent_id but cannot explain reading the tree. 7-8: explains reading and the trade-off between two models. 9-10: adds indexing and a practical depth cap.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Thiết kế dữ liệu phân cấp có nhiều lựa chọn đánh đổi — đúng tầm Mid-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Hai request đồng thời cùng trừ tồn kho của một sản phẩm chỉ còn 1 cái, và cả hai đều thành công. Giải thích cơ chế gây ra lỗi này và ít nhất hai cách khắc phục ở tầng dữ liệu.",
          en: "Two concurrent requests both decrement the stock of a product that has only 1 left, and both succeed. Explain the mechanism behind this bug and at least two fixes at the data layer.",
        },
        expectedKeyPoints: [
          {
            vi: "Đây là race condition kiểu read-modify-write: cả hai đọc cùng giá trị cũ trước khi ai kịp ghi",
            en: "A read-modify-write race: both read the same old value before either writes",
          },
          {
            vi: "Cách 1 — optimistic locking: dùng cột version hoặc điều kiện WHERE stock > 0 và kiểm tra số dòng bị ảnh hưởng",
            en: "Fix 1 — optimistic locking: a version column or WHERE stock > 0, then check rows affected",
          },
          {
            vi: "Cách 2 — pessimistic locking: SELECT ... FOR UPDATE để khoá dòng trong giao dịch",
            en: "Fix 2 — pessimistic locking: SELECT ... FOR UPDATE to lock the row in the transaction",
          },
          {
            vi: "Cập nhật nguyên tử ngay trong câu lệnh (UPDATE ... SET stock = stock - 1) thay vì tính trong code ứng dụng",
            en: "Update atomically in SQL (UPDATE ... SET stock = stock - 1) rather than computing in app code",
          },
          {
            vi: "Đánh đổi: pessimistic lock giảm throughput, optimistic lock cần xử lý retry khi xung đột",
            en: "Trade-off: pessimistic locks cut throughput; optimistic locks need retry on conflict",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ mô tả hiện tượng. 4-6: gọi đúng tên race condition và một cách khắc phục. 7-8: nêu được hai cách khắc phục đúng. 9-10: thêm phân tích đánh đổi throughput và xử lý retry.",
            en: "0-3: only describes the symptom. 4-6: names the race condition and one fix. 7-8: gives two correct fixes. 9-10: adds the throughput trade-off and retry handling.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Bài toán concurrency điển hình, phân biệt rõ Mid-level với Junior.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Khi nào bạn chọn giao tiếp bất đồng bộ qua message queue thay vì gọi HTTP đồng bộ giữa hai service? Nêu cái giá phải trả khi chuyển sang bất đồng bộ.",
          en: "When do you choose asynchronous messaging over a synchronous HTTP call between two services? What price do you pay for going async?",
        },
        expectedKeyPoints: [
          {
            vi: "Chọn queue khi công việc chạy lâu, khi cần chịu tải đột biến, hoặc khi bên gọi không cần kết quả ngay",
            en: "Choose a queue for long work, for absorbing spikes, or when the caller needs no immediate result",
          },
          {
            vi: "Queue giúp hai service không phải cùng sống một lúc, giảm ảnh hưởng dây chuyền khi một bên lỗi",
            en: "A queue removes the need for both services to be up together, limiting cascading failure",
          },
          {
            vi: "Cái giá: mất tính nhất quán tức thời, người dùng thấy trạng thái cũ trong một khoảng thời gian",
            en: "The price: no immediate consistency — users see stale state for a while",
          },
          {
            vi: "Phải xử lý message trùng lặp vì phần lớn queue đảm bảo at-least-once chứ không exactly-once",
            en: "Must handle duplicates, since most queues guarantee at-least-once, not exactly-once",
          },
          {
            vi: "Khó debug hơn: luồng xử lý không còn nằm trong một stack trace duy nhất, cần correlation id",
            en: "Harder to debug: the flow no longer fits one stack trace, so you need correlation ids",
          },
          {
            vi: "Cần dead letter queue cho message xử lý thất bại nhiều lần",
            en: "Needs a dead letter queue for messages that keep failing",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ nói queue nhanh hơn. 4-6: nêu đúng trường hợp nên dùng. 7-8: nêu thêm cái giá về tính nhất quán và trùng lặp. 9-10: thêm khả năng quan sát (correlation id) và dead letter queue.",
            en: "0-3: just says queues are faster. 4-6: names the right use cases. 7-8: adds the consistency and duplication costs. 9-10: adds observability (correlation ids) and a dead letter queue.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Đánh đổi kiến trúc phổ biến, yêu cầu nhìn được cả mặt trái.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Trong thiết kế API REST, phương thức nào được coi là idempotent, nghĩa là gọi nhiều lần với cùng payload cho cùng kết quả trạng thái?",
          en: "In REST API design, which method is idempotent — repeated calls with the same payload leave the same resulting state?",
        },
        options: [
          { vi: "POST", en: "POST" },
          { vi: "PUT", en: "PUT" },
          { vi: "PATCH", en: "PATCH" },
          { vi: "Cả ba đều idempotent", en: "All three are idempotent" },
        ],
        correctOptionIndex: 1,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Idempotency là nền tảng của retry an toàn — kiến thức cần có khi thiết kế API.",
        },
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Độ phức tạp thời gian trong trường hợp xấu nhất của thuật toán quicksort là bao nhiêu?",
          en: "What is the worst-case time complexity of quicksort?",
        },
        options: [
          { vi: "O(n)", en: "O(n)" },
          { vi: "O(n log n)", en: "O(n log n)" },
          { vi: "O(n²)", en: "O(n²)" },
          { vi: "O(log n)", en: "O(log n)" },
        ],
        correctOptionIndex: 2,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Phân biệt trường hợp trung bình và xấu nhất là dấu hiệu hiểu thuật toán thật sự.",
        },
      },
    ],
    senior: [
      {
        type: "open",
        question: {
          vi: "Thiết kế hệ thống rút gọn URL phục vụ 10.000 lượt đọc mỗi giây và 100 lượt tạo mới mỗi giây. Trình bày cách sinh mã ngắn, lựa chọn lưu trữ, và chiến lược cache.",
          en: "Design a URL shortener serving 10,000 reads per second and 100 writes per second. Cover short-code generation, storage choice, and caching strategy.",
        },
        expectedKeyPoints: [
          {
            vi: "Nhận ra tỷ lệ đọc/ghi lệch mạnh (100:1) và thiết kế tối ưu cho đường đọc",
            en: "Recognises the 100:1 read/write skew and optimises the read path",
          },
          {
            vi: "Sinh mã: base62 từ id tăng dần, hoặc hash có xử lý va chạm — nêu được đánh đổi giữa mã đoán được và mã ngẫu nhiên",
            en: "Code generation: base62 of an incrementing id, or a hash with collision handling — weighs guessable against random",
          },
          {
            vi: "Lưu trữ key-value là đủ, không cần quan hệ phức tạp; đường đọc là tra cứu theo khoá chính",
            en: "Key-value storage suffices; the read path is a primary-key lookup",
          },
          {
            vi: "Cache tầng trước (Redis/CDN) cho các mã nóng, vì phân bố truy cập thường lệch mạnh",
            en: "Front cache (Redis/CDN) for hot codes, since access is heavily skewed",
          },
          {
            vi: "Xử lý cache miss và cache stampede khi một mã viral hết hạn cùng lúc",
            en: "Handles cache misses and stampede when a viral code expires at once",
          },
          {
            vi: "Cân nhắc sharding hoặc phân vùng khoảng id khi ghi vượt khả năng một node",
            en: "Considers sharding or id-range partitioning when writes outgrow one node",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ mô tả bảng lưu url. 4-6: có cách sinh mã hợp lý và lưu trữ phù hợp. 7-8: thêm chiến lược cache dựa trên tỷ lệ đọc/ghi. 9-10: xử lý được cache stampede và bàn tới phân vùng khi mở rộng.",
            en: "0-3: only describes a URL table. 4-6: sound code generation and storage. 7-8: adds a cache strategy driven by the read/write ratio. 9-10: handles stampede and discusses partitioning at scale.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Bài system design kinh điển, đánh giá khả năng suy luận từ con số tải cụ thể.",
        },
        requiresPractice: true,
      },
      {
        type: "open",
        question: {
          vi: "Bạn tách một module ra khỏi monolith thành service riêng. Dữ liệu của module đó đang nằm chung database và có foreign key sang bảng của module khác. Bạn xử lý ranh giới dữ liệu thế nào?",
          en: "You are extracting a module from a monolith into its own service. Its data shares a database and has foreign keys into another module's tables. How do you handle the data boundary?",
        },
        expectedKeyPoints: [
          {
            vi: "Không thể giữ foreign key xuyên service; ràng buộc phải chuyển lên tầng ứng dụng hoặc chấp nhận nhất quán cuối",
            en: "Cross-service foreign keys cannot hold; move the constraint to the application or accept eventual consistency",
          },
          {
            vi: "Tách database trước hoặc tách service trước là một quyết định có thật, cần nêu lý do chọn",
            en: "Splitting the database first or the service first is a real choice that needs a stated reason",
          },
          {
            vi: "Sao chép dữ liệu tham chiếu cần thiết vào service mới thay vì gọi chéo mỗi request",
            en: "Replicate the reference data the new service needs rather than calling across on every request",
          },
          {
            vi: "Đồng bộ bằng sự kiện, chấp nhận độ trễ và thiết kế UI chịu được dữ liệu hơi cũ",
            en: "Sync by events, accept the lag, and design the UI to tolerate slightly stale data",
          },
          {
            vi: "Giai đoạn chuyển tiếp cần strangler pattern: định tuyến dần thay vì cắt một lần",
            en: "Use the strangler pattern in transition: route gradually rather than cutting over at once",
          },
          {
            vi: "Nhận ra rằng nếu hai bên vẫn cần giao dịch nguyên tử với nhau thì có thể ranh giới đã bị vẽ sai",
            en: "Recognises that if both sides still need one atomic transaction, the boundary is probably drawn wrong",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ nói tách code, giữ nguyên database chung. 4-6: nhận ra vấn đề foreign key. 7-8: có chiến lược đồng bộ và di trú tăng dần. 9-10: chất vấn được ranh giới nếu vẫn cần giao dịch nguyên tử.",
            en: "0-3: splits code only, keeps the shared database. 4-6: sees the foreign-key problem. 7-8: has a sync strategy and incremental migration. 9-10: questions the boundary itself when atomicity is still required.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Đòi hỏi kinh nghiệm thật với việc tách hệ thống và hiểu giới hạn của nhất quán cuối.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Một job xử lý nền chạy hằng đêm bắt đầu thất bại ngẫu nhiên khoảng 5% số lần, không có quy luật rõ ràng. Bạn điều tra thế nào, và thiết kế lại job ra sao để lỗi ngẫu nhiên không còn là sự cố cần người can thiệp?",
          en: "A nightly background job starts failing randomly about 5% of the time, with no clear pattern. How do you investigate, and how do you redesign the job so random failures no longer need human intervention?",
        },
        expectedKeyPoints: [
          {
            vi: "Trước hết thu thập dữ liệu: log có cấu trúc, phân loại lỗi theo loại thay vì đếm tổng",
            en: "Collect data first: structured logs, classifying failures by kind rather than counting totals",
          },
          {
            vi: "Phân biệt lỗi tạm thời (timeout, tranh chấp khoá) và lỗi thật sự (dữ liệu sai)",
            en: "Separate transient failures (timeouts, lock contention) from genuine ones (bad data)",
          },
          {
            vi: "Thiết kế job idempotent để chạy lại an toàn, đây là điều kiện cần trước khi retry tự động",
            en: "Make the job idempotent so reruns are safe — a precondition for automatic retry",
          },
          {
            vi: "Chia job lớn thành các đơn vị nhỏ có checkpoint, để lần chạy lại không bắt đầu từ đầu",
            en: "Split the job into checkpointed units so a rerun does not start from scratch",
          },
          {
            vi: "Retry có backoff cho lỗi tạm thời, đưa lỗi thật sự vào hàng đợi xử lý riêng",
            en: "Retry with backoff for transient failures; route genuine ones to a separate queue",
          },
          {
            vi: "Cảnh báo dựa trên tỷ lệ thất bại vượt ngưỡng, không cảnh báo trên từng lần lỗi đơn lẻ",
            en: "Alert on a failure-rate threshold, not on every individual failure",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ đề xuất thêm retry. 4-6: có phân loại lỗi. 7-8: thiết kế idempotent và chia checkpoint. 9-10: thêm chiến lược cảnh báo theo tỷ lệ và tách đường xử lý lỗi thật sự.",
            en: "0-3: just adds retries. 4-6: classifies failures. 7-8: designs for idempotency and checkpoints. 9-10: adds rate-based alerting and a separate path for genuine failures.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Đánh giá tư duy độ tin cậy vận hành, không chỉ sửa lỗi trước mắt.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "CAP theorem phát biểu rằng một hệ thống phân tán chỉ có thể đảm bảo tối đa 2 trong 3 tính chất nào cùng lúc?",
          en: "The CAP theorem states that a distributed system can guarantee at most two of which three properties at once?",
        },
        options: [
          {
            vi: "Concurrency, Availability, Precision",
            en: "Concurrency, Availability, Precision",
          },
          {
            vi: "Consistency, Availability, Partition tolerance",
            en: "Consistency, Availability, Partition tolerance",
          },
          {
            vi: "Consistency, Atomicity, Persistence",
            en: "Consistency, Atomicity, Persistence",
          },
          {
            vi: "Availability, Accuracy, Performance",
            en: "Availability, Accuracy, Performance",
          },
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
        question: {
          vi: "Kỹ thuật nào giúp giảm rủi ro khi nhiều service gọi tuần tự tới cùng một downstream dependency đang lỗi, bằng cách 'ngắt mạch' tạm thời sau một ngưỡng lỗi nhất định?",
          en: "Which technique reduces risk when services repeatedly call a failing downstream dependency, by temporarily 'tripping' after an error threshold?",
        },
        options: [
          { vi: "Load balancing", en: "Load balancing" },
          { vi: "Connection pooling", en: "Connection pooling" },
          { vi: "Rate limiting", en: "Rate limiting" },
          { vi: "Circuit breaker", en: "Circuit breaker" },
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
        question: {
          vi: "Tổ chức của bạn có mười service do bốn team sở hữu, và mỗi sự cố production đều mất hàng giờ chỉ để xác định service nào gây ra. Bạn xây dựng năng lực quan sát (observability) thế nào ở quy mô tổ chức, và làm sao để nó không trở thành một dự án hạ tầng không ai dùng?",
          en: "Your organisation has ten services owned by four teams, and every production incident costs hours just to find which service caused it. How do you build observability at organisational scale, and how do you keep it from becoming an infrastructure project nobody uses?",
        },
        expectedKeyPoints: [
          {
            vi: "Phân biệt ba trụ cột log, metric, trace và nêu rõ distributed tracing là thứ giải quyết đúng vấn đề đang mô tả",
            en: "Separates logs, metrics and traces, and names distributed tracing as the fit for this specific problem",
          },
          {
            vi: "Chuẩn hoá correlation id xuyên service, đây là điều kiện cần để trace có ý nghĩa",
            en: "Standardises a correlation id across services — the precondition for traces to mean anything",
          },
          {
            vi: "Cung cấp thư viện/template dùng chung để team không phải tự tích hợp từ đầu",
            en: "Ships a shared library or template so teams do not integrate from scratch",
          },
          {
            vi: "Định nghĩa SLO cho từng service để cảnh báo dựa trên tác động người dùng thay vì ngưỡng kỹ thuật",
            en: "Defines per-service SLOs so alerts fire on user impact rather than technical thresholds",
          },
          {
            vi: "Cân nhắc chi phí: lưu toàn bộ trace rất đắt, cần sampling có chủ đích",
            en: "Weighs cost: storing every trace is expensive, so sampling must be deliberate",
          },
          {
            vi: "Đo thành công bằng thời gian trung bình xác định nguyên nhân (MTTI), không bằng số dashboard đã dựng",
            en: "Measures success by mean time to identify, not by dashboards built",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ đề xuất thêm log. 4-6: nêu đủ ba trụ cột. 7-8: thêm correlation id và SLO. 9-10: thêm chiến lược sampling theo chi phí và chỉ số đo lường thành công của chính sáng kiến này.",
            en: "0-3: just adds more logging. 4-6: covers all three pillars. 7-8: adds correlation ids and SLOs. 9-10: adds cost-aware sampling and a success metric for the initiative itself.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Xây dựng năng lực nền tảng cho nhiều team, kèm bài toán áp dụng và chi phí — tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Bạn phải chọn giữa xây dựng nội bộ và mua giải pháp có sẵn cho một thành phần cốt lõi (ví dụ: hệ thống tìm kiếm). Bạn xây dựng khung phân tích nào để quyết định, và bảo vệ quyết định đó ra sao khi bối cảnh thay đổi sau hai năm?",
          en: "You must choose between building in-house and buying an off-the-shelf solution for a core component (say, search). What framework do you use to decide, and how do you defend that decision when the context changes two years later?",
        },
        expectedKeyPoints: [
          {
            vi: "Phân biệt thành phần tạo lợi thế cạnh tranh và thành phần chỉ cần đủ tốt",
            en: "Separates components that create competitive advantage from those that need only be good enough",
          },
          {
            vi: "Tính tổng chi phí sở hữu, gồm cả chi phí vận hành và thời gian kỹ sư dài hạn, không chỉ giá license",
            en: "Computes total cost of ownership including operations and long-term engineer time, not just licence price",
          },
          {
            vi: "Đánh giá rủi ro phụ thuộc nhà cung cấp và chi phí thoát ra (exit cost)",
            en: "Assesses vendor lock-in risk and the cost of exiting",
          },
          {
            vi: "Thiết kế lớp trừu tượng ở ranh giới để việc thay thế sau này không lan ra toàn hệ thống",
            en: "Puts an abstraction at the boundary so a later swap does not ripple system-wide",
          },
          {
            vi: "Ghi lại quyết định dạng ADR kèm điều kiện xem xét lại, thay vì coi là quyết định vĩnh viễn",
            en: "Records the decision as an ADR with revisit conditions rather than treating it as permanent",
          },
          {
            vi: "Nêu rõ tốc độ ra thị trường là một yếu tố hợp lệ, không phải lý do kém kỹ thuật",
            en: "States that time to market is a legitimate factor, not a technically inferior reason",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: quyết định dựa trên sở thích kỹ thuật. 4-6: có so sánh chi phí cơ bản. 7-8: tính tổng chi phí sở hữu và rủi ro phụ thuộc. 9-10: thêm lớp trừu tượng ranh giới và điều kiện xem xét lại quyết định.",
            en: "0-3: decides on technical preference. 4-6: a basic cost comparison. 7-8: total cost of ownership plus lock-in risk. 9-10: adds a boundary abstraction and revisit conditions.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Quyết định build-vs-buy ảnh hưởng nhiều năm, đòi hỏi tư duy chi phí và rủi ro — tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Một sự cố nghiêm trọng vừa xảy ra do một thay đổi của team khác. Bạn dẫn dắt buổi postmortem thế nào để tìm ra nguyên nhân hệ thống thay vì dừng ở 'ai đã deploy cái này'?",
          en: "A severe incident was caused by another team's change. How do you run the postmortem so it reaches the systemic cause rather than stopping at 'who deployed this'?",
        },
        expectedKeyPoints: [
          {
            vi: "Nguyên tắc blameless: mục tiêu là tìm điều kiện cho phép lỗi xảy ra, không tìm người chịu trách nhiệm",
            en: "Blameless principle: find the conditions that allowed the failure, not the person to blame",
          },
          {
            vi: "Dựng dòng thời gian dựa trên dữ liệu trước khi phân tích nguyên nhân",
            en: "Build a data-backed timeline before analysing causes",
          },
          {
            vi: "Đào sâu nhiều tầng: vì sao thay đổi lọt qua review, vì sao test không bắt được, vì sao phát hiện chậm",
            en: "Dig through layers: why review passed it, why tests missed it, why detection was slow",
          },
          {
            vi: "Phân biệt nguyên nhân kích hoạt (trigger) và nguyên nhân hệ thống (thiếu cổng an toàn)",
            en: "Separates the trigger from the systemic cause (a missing safety gate)",
          },
          {
            vi: "Hành động khắc phục phải có người sở hữu và thời hạn, nếu không postmortem chỉ là thủ tục",
            en: "Action items need an owner and a deadline, or the postmortem is ceremony",
          },
          {
            vi: "Theo dõi xem hành động khắc phục có thực sự được hoàn thành hay không",
            en: "Tracks whether the action items are actually completed",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: dừng ở việc xác định thay đổi gây lỗi. 4-6: có dòng thời gian và nguyên tắc blameless. 7-8: đào được tới nguyên nhân hệ thống. 9-10: thêm cơ chế theo dõi hành động khắc phục tới khi hoàn thành.",
            en: "0-3: stops at identifying the breaking change. 4-6: has a timeline and blameless framing. 7-8: reaches the systemic cause. 9-10: adds follow-through tracking on action items.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Đánh giá năng lực dẫn dắt quy trình và cải thiện hệ thống xuyên team — tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Bạn cần loại bỏ một endpoint đang được hơn hai mươi consumer nội bộ sử dụng, trong đó vài consumer thuộc team đã giải thể. Bạn thiết kế quy trình ngừng hỗ trợ thế nào để không làm hỏng hệ thống của ai?",
          en: "You need to remove an endpoint used by more than twenty internal consumers, some owned by teams that no longer exist. How do you design the deprecation so nobody's system breaks?",
        },
        expectedKeyPoints: [
          {
            vi: "Trước hết đo xem ai còn gọi thật: bổ sung ghi nhận theo consumer thay vì dựa vào tài liệu đã cũ",
            en: "Measure who actually still calls it: add per-consumer logging rather than trusting stale documentation",
          },
          {
            vi: "Công bố lịch trình ngừng hỗ trợ có mốc thời gian rõ ràng và đường dẫn thay thế cụ thể",
            en: "Publish a deprecation timeline with firm dates and a concrete replacement path",
          },
          {
            vi: "Phát tín hiệu ngay trong phản hồi bằng header cảnh báo để đội ngũ nhận ra khi đọc log",
            en: "Signal in the response itself with a deprecation header so teams notice it in their logs",
          },
          {
            vi: "Tắt thử có kiểm soát trong thời gian ngắn để lộ ra các consumer chưa ai biết, rồi bật lại",
            en: "Run a short controlled brownout to surface unknown consumers, then restore service",
          },
          {
            vi: "Với consumer không còn chủ sở hữu, cần leo thang lên cấp quản lý để chỉ định người chịu trách nhiệm",
            en: "For unowned consumers, escalate to management to assign an owner rather than guessing",
          },
          {
            vi: "Chỉ xoá sau khi lưu lượng về không trong một khoảng đủ dài để phủ các tác vụ chạy theo tháng",
            en: "Only delete after traffic reaches zero for long enough to cover monthly batch jobs",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ thông báo rồi xoá theo hạn. 4-6: có đo lưu lượng và lịch trình. 7-8: thêm tín hiệu trong phản hồi và tắt thử có kiểm soát. 9-10: xử lý được consumer không còn chủ và tính tới tác vụ chạy theo chu kỳ dài.",
            en: "0-3: announces it and deletes on the date. 4-6: measures traffic and sets a timeline. 7-8: adds response signalling and a brownout. 9-10: handles unowned consumers and accounts for long-cycle batch jobs.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Quản lý thay đổi phá vỡ tương thích xuyên nhiều team, gồm cả phần tổ chức — tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Sản phẩm của bạn chuyển từ một khách hàng lớn sang mô hình nhiều khách hàng dùng chung hạ tầng. Bạn thiết kế việc cô lập dữ liệu giữa các khách hàng thế nào, và đánh đổi giữa các mức cô lập ra sao?",
          en: "Your product is moving from a single large customer to many customers sharing infrastructure. How do you design data isolation between them, and what are the trade-offs between isolation levels?",
        },
        expectedKeyPoints: [
          {
            vi: "Ba mức thường gặp: cơ sở dữ liệu riêng, lược đồ riêng, hoặc bảng chung có cột định danh khách hàng",
            en: "Three common levels: a database per customer, a schema per customer, or shared tables with a tenant column",
          },
          {
            vi: "Bảng chung rẻ và dễ vận hành nhất nhưng rủi ro lộ dữ liệu cao nhất nếu quên điều kiện lọc",
            en: "Shared tables are cheapest to operate but carry the highest leak risk if a filter is ever forgotten",
          },
          {
            vi: "Cô lập phải được cưỡng chế ở tầng thấp nhất có thể, không phụ thuộc việc lập trình viên nhớ thêm điều kiện",
            en: "Enforce isolation at the lowest possible layer, never relying on a developer remembering a clause",
          },
          {
            vi: "Cơ sở dữ liệu riêng cho cô lập mạnh nhất nhưng chi phí vận hành và di trú tăng theo số khách hàng",
            en: "A database per customer isolates best but operational and migration cost grows with customer count",
          },
          {
            vi: "Cần tính tới khách hàng lớn gây ảnh hưởng tới khách hàng khác khi dùng chung tài nguyên",
            en: "Account for a noisy large customer degrading others when resources are shared",
          },
          {
            vi: "Yêu cầu pháp lý về nơi lưu trữ dữ liệu có thể quyết định lựa chọn thay cho lý do kỹ thuật",
            en: "Legal data-residency requirements may decide the choice regardless of the technical argument",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ thêm một cột định danh khách hàng. 4-6: nêu được các mức cô lập. 7-8: đề xuất cưỡng chế ở tầng thấp và phân tích đánh đổi chi phí. 9-10: thêm ảnh hưởng chéo giữa khách hàng và ràng buộc pháp lý.",
            en: "0-3: just adds a tenant column. 4-6: names the isolation levels. 7-8: enforces low in the stack and analyses cost trade-offs. 9-10: adds cross-customer interference and legal constraints.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Quyết định kiến trúc nền tảng khó đảo ngược, có cả yếu tố bảo mật và pháp lý — tầm Staff.",
        },
        requiresPractice: false,
      },
    ],
  },
};
