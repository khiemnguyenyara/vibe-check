import "server-only";

import type { ContentBank } from "./types";

/**
 * The general software-engineering bank.
 *
 * This is the designed fallback, not a stub. A `tech` specialty with no
 * dedicated bank (mobile-development, ai-ml, devops-cloud, data, blockchain,
 * cybersecurity today) resolves here and runs a complete, level-appropriate
 * session rather than erroring — the alternative, refusing to start, would
 * make every unauthored specialty a dead card on the /fields page.
 *
 * Content is therefore deliberately stack-agnostic: nothing here assumes
 * React, a browser, or a particular cloud. Anything that does belongs in a
 * specialty bank.
 *
 * Every string a candidate can see is authored in both locales. `en` is not a
 * machine translation of `vi` placed here to satisfy the type — the two are
 * written to probe the same thing, because a candidate's score comes from how
 * much of `expectedKeyPoints` their answer covers, and a looser translation
 * would quietly make one language easier to score well in.
 */
export const generalBank: ContentBank = {
  id: "general",
  label: "General Software Engineering",
  questions: {
    junior: [
      {
        type: "open",
        question: {
          vi: "Bạn hiểu thế nào về `any` và `unknown` trong TypeScript? Vì sao `unknown` thường được xem là lựa chọn an toàn hơn?",
          en: "How do `any` and `unknown` differ in TypeScript? Why is `unknown` generally considered the safer choice?",
        },
        expectedKeyPoints: [
          {
            vi: "any tắt hoàn toàn type-checking, unknown vẫn giữ type-safety",
            en: "any disables type checking entirely, unknown keeps type safety",
          },
          {
            vi: "unknown bắt buộc phải narrow type trước khi sử dụng",
            en: "unknown forces you to narrow the type before using the value",
          },
          {
            vi: "Ví dụ thực tế: dữ liệu từ API response nên type unknown rồi validate",
            en: "Practical example: type an API response as unknown, then validate it",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: cho rằng any và unknown tương đương. 5-7: phân biệt đúng khái niệm. 8-10: phân biệt đúng kèm ví dụ áp dụng thực tế.",
            en: "0-4: treats any and unknown as equivalent. 5-7: distinguishes them correctly. 8-10: distinguishes them and gives a real applied example.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Kiến thức nền tảng TypeScript cần có ở Junior.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Git: bạn vừa commit nhầm một file chứa API key vào nhánh làm việc của mình nhưng chưa push. Bạn xử lý thế nào, và nếu đã push rồi thì khác gì?",
          en: "Git: you just committed a file containing an API key to your working branch, but haven't pushed. How do you handle it, and what changes if you already pushed?",
        },
        expectedKeyPoints: [
          {
            vi: "Chưa push: dùng git reset hoặc git commit --amend để gỡ file khỏi lịch sử cục bộ",
            en: "Not pushed: use git reset or git commit --amend to remove the file from local history",
          },
          {
            vi: "Thêm file vào .gitignore để không commit lại lần sau",
            en: "Add the file to .gitignore so it isn't committed again",
          },
          {
            vi: "Đã push: phải coi key đó là đã lộ và thu hồi/xoay vòng (rotate) ngay",
            en: "Already pushed: treat the key as compromised and rotate it immediately",
          },
          {
            vi: "Viết lại lịch sử sau khi push ảnh hưởng người khác, cần thông báo cho team",
            en: "Rewriting history after a push affects others, so tell the team first",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ nói xoá file rồi commit tiếp. 5-7: xử lý đúng lịch sử git nhưng quên việc thu hồi key. 8-10: xử lý lịch sử đúng và nhận ra key đã lộ thì phải rotate.",
            en: "0-4: just deletes the file and commits again. 5-7: handles git history correctly but forgets to revoke the key. 8-10: handles history correctly and recognises an exposed key must be rotated.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning:
            "Tình huống git thường gặp, đồng thời kiểm tra phản xạ an toàn thông tin cơ bản.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Phân biệt lỗi được xử lý (handled error) và lỗi ngoài dự kiến (unexpected error). Khi viết một hàm gọi API, bạn quyết định khi nào nên bắt lỗi tại chỗ và khi nào nên để lỗi ném lên trên như thế nào?",
          en: "Distinguish a handled error from an unexpected one. When writing a function that calls an API, how do you decide whether to catch the error there or let it propagate?",
        },
        expectedKeyPoints: [
          {
            vi: "Bắt lỗi tại chỗ khi hàm có đủ thông tin để phục hồi hoặc trả về giá trị thay thế hợp lý",
            en: "Catch locally when the function has enough context to recover or return a sensible fallback",
          },
          {
            vi: "Để lỗi ném lên khi tầng gọi mới biết cách xử lý (hiển thị UI, retry, log)",
            en: "Let it propagate when only the caller knows how to handle it (show UI, retry, log)",
          },
          {
            vi: "Tránh catch rồi nuốt lỗi im lặng vì làm bug không thể tìm ra",
            en: "Never catch and swallow silently — it makes the bug impossible to find",
          },
          {
            vi: "Phân biệt lỗi nghiệp vụ (404, validation) và lỗi hạ tầng (network, timeout)",
            en: "Separate business errors (404, validation) from infrastructure errors (network, timeout)",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ nói bọc try/catch quanh mọi thứ. 5-7: phân biệt được hai loại lỗi. 8-10: nêu rõ tiêu chí quyết định bắt hay ném, và chỉ ra tác hại của việc nuốt lỗi.",
            en: "0-4: just wraps everything in try/catch. 5-7: separates the two error kinds. 8-10: states a clear catch-or-throw criterion and names the harm of swallowing errors.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning:
            "Nguyên tắc xử lý lỗi nền tảng, áp dụng cho mọi ngôn ngữ và mọi vị trí kỹ thuật.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Trong JavaScript, phương thức nào dùng để chuyển một chuỗi JSON thành object?",
          en: "In JavaScript, which method converts a JSON string into an object?",
        },
        options: [
          { vi: "JSON.parse()", en: "JSON.parse()" },
          { vi: "JSON.stringify()", en: "JSON.stringify()" },
          { vi: "Object.assign()", en: "Object.assign()" },
          { vi: "String.parse()", en: "String.parse()" },
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
        question: {
          vi: "Độ phức tạp thời gian trung bình của thao tác tìm kiếm nhị phân (binary search) trên một mảng đã sắp xếp có n phần tử là bao nhiêu?",
          en: "What is the average time complexity of binary search over a sorted array of n elements?",
        },
        options: [
          { vi: "O(1)", en: "O(1)" },
          { vi: "O(log n)", en: "O(log n)" },
          { vi: "O(n)", en: "O(n)" },
          { vi: "O(n log n)", en: "O(n log n)" },
        ],
        correctOptionIndex: 1,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Kiến thức giải thuật nền tảng, yêu cầu tối thiểu ở Junior.",
        },
      },
    ],
    mid: [
      {
        type: "open",
        question: {
          vi: "Một endpoint đang chậm bất thường ở môi trường production nhưng chạy nhanh ở local. Hãy trình bày quy trình bạn dùng để khoanh vùng nguyên nhân, theo thứ tự bạn sẽ thực hiện.",
          en: "An endpoint is unusually slow in production but fast locally. Walk through the process you would use to isolate the cause, in the order you would do it.",
        },
        expectedKeyPoints: [
          {
            vi: "Xác nhận hiện tượng bằng số liệu: latency p95/p99 chứ không chỉ giá trị trung bình",
            en: "Confirm it with data: p95/p99 latency, not just the average",
          },
          {
            vi: "Phân biệt chậm ở tầng nào: mạng, ứng dụng, hay truy vấn database",
            en: "Identify which layer is slow: network, application, or database query",
          },
          {
            vi: "Kiểm tra khác biệt môi trường: khối lượng dữ liệu, thiếu index, cấu hình connection pool",
            en: "Check environment differences: data volume, missing index, connection pool settings",
          },
          {
            vi: "Dùng log có cấu trúc hoặc tracing để đo từng đoạn thay vì đoán",
            en: "Use structured logs or tracing to measure each segment instead of guessing",
          },
          {
            vi: "Chỉ tối ưu sau khi đã xác định được điểm nghẽn cụ thể",
            en: "Only optimise after the specific bottleneck has been identified",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: đoán nguyên nhân không có quy trình. 4-6: có quy trình nhưng bỏ qua việc đo đạc. 7-8: quy trình hợp lý dựa trên số liệu. 9-10: thêm phân biệt p95/p99 và khác biệt dữ liệu giữa hai môi trường.",
            en: "0-3: guesses without a process. 4-6: has a process but skips measurement. 7-8: a sound data-driven process. 9-10: adds p95/p99 reasoning and the data difference between environments.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Kỹ năng chẩn đoán có hệ thống, phân biệt rõ Mid-level với Junior.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Bạn thiết kế một API cho phép client tải danh sách đơn hàng có thể lên tới hàng trăm nghìn bản ghi. Bạn chọn cơ chế phân trang nào, và đánh đổi giữa offset-based và cursor-based ra sao?",
          en: "You are designing an API that returns an order list which may reach hundreds of thousands of rows. Which pagination scheme do you choose, and what are the trade-offs between offset-based and cursor-based?",
        },
        expectedKeyPoints: [
          {
            vi: "Offset-based đơn giản nhưng chậm dần khi offset lớn vì database vẫn phải quét qua các bản ghi bị bỏ",
            en: "Offset-based is simple but degrades at large offsets because the database still scans the skipped rows",
          },
          {
            vi: "Offset-based cho kết quả không ổn định khi dữ liệu được thêm/xoá giữa các trang",
            en: "Offset-based gives unstable results when rows are inserted or deleted between pages",
          },
          {
            vi: "Cursor-based dùng khoá sắp xếp ổn định nên hiệu năng không phụ thuộc độ sâu trang",
            en: "Cursor-based uses a stable sort key, so performance does not depend on page depth",
          },
          {
            vi: "Cursor-based khó nhảy tới trang bất kỳ, phù hợp cuộn vô hạn hơn là phân trang có số trang",
            en: "Cursor-based cannot jump to an arbitrary page, suiting infinite scroll more than numbered pages",
          },
          {
            vi: "Cần đặt giới hạn tối đa cho page size để client không tự yêu cầu toàn bộ dữ liệu",
            en: "Cap the maximum page size so a client cannot request the whole dataset",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết offset/limit. 5-7: nêu đúng ưu nhược điểm hai cơ chế. 8-10: chọn được cơ chế phù hợp theo ngữ cảnh và nêu giới hạn page size.",
            en: "0-4: only knows offset/limit. 5-7: states the pros and cons of both. 8-10: picks the right scheme for the context and caps page size.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "Thiết kế API ở quy mô dữ liệu lớn, đúng tầm Mid-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Đồng nghiệp gửi bạn một pull request 800 dòng thay đổi nhiều thứ cùng lúc. Bạn review thế nào để vừa hữu ích vừa không chặn tiến độ của họ?",
          en: "A colleague sends you an 800-line pull request that changes several things at once. How do you review it so you are useful without blocking their progress?",
        },
        expectedKeyPoints: [
          {
            vi: "Ưu tiên đọc theo lớp: đúng đắn logic trước, cấu trúc sau, phong cách code cuối cùng",
            en: "Read in layers: correctness first, structure next, style last",
          },
          {
            vi: "Phân biệt rõ góp ý bắt buộc sửa và góp ý tuỳ chọn để tác giả biết cái gì chặn merge",
            en: "Mark blocking comments separately from optional ones so the author knows what stops the merge",
          },
          {
            vi: "Đề nghị tách PR lớn thành các PR nhỏ hơn cho lần sau, kèm lý do cụ thể",
            en: "Ask for smaller PRs next time, with a concrete reason why",
          },
          {
            vi: "Góp ý về code chứ không về người; đưa ra đề xuất thay thế thay vì chỉ phê bình",
            en: "Comment on the code, not the person; propose an alternative rather than only criticising",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ nói kiểm tra lỗi cú pháp và style. 5-7: có thứ tự ưu tiên review hợp lý. 8-10: thêm cách phân loại mức độ góp ý và cách trao đổi không gây xung đột.",
            en: "0-4: only checks syntax and style. 5-7: has a sensible review priority order. 8-10: adds comment severity levels and a non-confrontational way to raise them.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Kỹ năng cộng tác trong team, kỳ vọng có ở Mid-level trở lên.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "HTTP status code nào biểu thị request thành công nhưng server không trả về nội dung (no content)?",
          en: "Which HTTP status code means the request succeeded but the server returns no content?",
        },
        options: [
          { vi: "201", en: "201" },
          { vi: "202", en: "202" },
          { vi: "204", en: "204" },
          { vi: "200", en: "200" },
        ],
        correctOptionIndex: 2,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "Kiến thức về các mã trạng thái HTTP phổ biến trong thiết kế API.",
        },
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Trong một hệ quản trị cơ sở dữ liệu quan hệ, thêm index vào một cột sẽ đánh đổi điều gì?",
          en: "In a relational database, what is the trade-off of adding an index to a column?",
        },
        options: [
          {
            vi: "Đọc nhanh hơn, nhưng ghi chậm hơn và tốn thêm dung lượng lưu trữ",
            en: "Faster reads, but slower writes and extra storage",
          },
          {
            vi: "Ghi nhanh hơn, nhưng đọc chậm hơn",
            en: "Faster writes, but slower reads",
          },
          {
            vi: "Cả đọc và ghi đều nhanh hơn, không có đánh đổi",
            en: "Both reads and writes get faster, with no trade-off",
          },
          {
            vi: "Giảm dung lượng lưu trữ nhờ nén dữ liệu cột đó",
            en: "Reduces storage by compressing that column",
          },
        ],
        correctOptionIndex: 0,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Đánh đổi cơ bản khi tối ưu database, cần hiểu đúng ở Mid-level.",
        },
      },
    ],
    senior: [
      {
        type: "open",
        question: {
          vi: "Bạn cần đổi schema của một bảng đang phục vụ traffic thật: tách cột `full_name` thành `first_name` và `last_name`. Không được có downtime và không được mất dữ liệu. Bạn triển khai theo các bước nào?",
          en: "You need to change the schema of a table serving live traffic: split `full_name` into `first_name` and `last_name`. No downtime, no data loss. What steps do you take?",
        },
        expectedKeyPoints: [
          {
            vi: "Expand: thêm cột mới trước, chưa xoá cột cũ, deploy schema tách rời khỏi deploy code",
            en: "Expand: add the new columns first, keep the old one, and deploy schema separately from code",
          },
          {
            vi: "Ghi kép (dual write) vào cả cột cũ và cột mới trong giai đoạn chuyển tiếp",
            en: "Dual-write to both old and new columns during the transition",
          },
          {
            vi: "Backfill dữ liệu cũ theo lô để không khoá bảng quá lâu",
            en: "Backfill existing rows in batches so the table is not locked for long",
          },
          {
            vi: "Chuyển đường đọc sang cột mới, quan sát một thời gian trước khi đi tiếp",
            en: "Switch reads to the new columns and observe before going further",
          },
          {
            vi: "Contract: chỉ xoá cột cũ sau khi chắc chắn không còn consumer nào đọc nó",
            en: "Contract: drop the old column only once no consumer reads it",
          },
          {
            vi: "Mỗi bước phải rollback được độc lập",
            en: "Every step must be independently reversible",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: đề xuất một migration duy nhất đổi tại chỗ. 4-6: nhận ra cần nhiều bước nhưng thiếu ghi kép hoặc backfill. 7-8: đủ expand-migrate-contract. 9-10: thêm khả năng rollback từng bước và tách deploy schema khỏi deploy code.",
            en: "0-3: proposes a single in-place migration. 4-6: sees it needs multiple steps but misses dual-write or backfill. 7-8: a full expand-migrate-contract. 9-10: adds per-step rollback and separates schema deploy from code deploy.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Yêu cầu kinh nghiệm vận hành thật với dữ liệu production, đúng tầm Senior.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Hệ thống của bạn gọi một dịch vụ thanh toán bên thứ ba. Dịch vụ này thỉnh thoảng timeout nhưng giao dịch vẫn có thể đã được thực hiện. Bạn thiết kế cơ chế retry thế nào để không tính tiền khách hàng hai lần?",
          en: "Your system calls a third-party payment service. It occasionally times out, yet the transaction may still have gone through. How do you design retries so a customer is never charged twice?",
        },
        expectedKeyPoints: [
          {
            vi: "Dùng idempotency key do client sinh ra và giữ nguyên qua mọi lần retry",
            en: "Use a client-generated idempotency key, kept identical across every retry",
          },
          {
            vi: "Phía nhận phải lưu kết quả theo key để trả lại cùng kết quả thay vì thực hiện lại",
            en: "The receiver stores the result per key and replays it instead of re-executing",
          },
          {
            vi: "Timeout không đồng nghĩa với thất bại — phải truy vấn lại trạng thái trước khi kết luận",
            en: "A timeout is not a failure — query the status before concluding anything",
          },
          {
            vi: "Retry có exponential backoff và jitter để tránh dồn tải khi dịch vụ đang hồi phục",
            en: "Retry with exponential backoff and jitter so a recovering service is not stampeded",
          },
          {
            vi: "Giới hạn số lần retry và có đường dẫn xử lý thủ công cho trường hợp không chắc chắn",
            en: "Cap the retry count and provide a manual path for genuinely uncertain cases",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ đề xuất retry đơn thuần. 4-6: nhận ra rủi ro tính tiền hai lần nhưng giải pháp chưa chặt. 7-8: dùng idempotency key đúng cách. 9-10: thêm backoff/jitter và xử lý trạng thái không xác định sau timeout.",
            en: "0-3: proposes plain retries. 4-6: sees the double-charge risk but the fix is loose. 7-8: uses an idempotency key correctly. 9-10: adds backoff/jitter and handles the unknown state after a timeout.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Bài toán idempotency và trạng thái không xác định trong hệ phân tán — đúng tầm Senior.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Đội của bạn có một service quan trọng nhưng gần như không có test. Mỗi lần sửa đều sợ vỡ chỗ khác. Bạn xây dựng chiến lược test thế nào khi không thể dừng phát triển tính năng để viết test cho toàn bộ codebase?",
          en: "Your team owns a critical service with almost no tests, and every change risks breaking something else. How do you build a testing strategy when you cannot pause feature work to cover the whole codebase?",
        },
        expectedKeyPoints: [
          {
            vi: "Không viết test từ đầu cho mọi thứ; ưu tiên theo rủi ro và tần suất thay đổi",
            en: "Do not test everything from scratch; prioritise by risk and rate of change",
          },
          {
            vi: "Bắt đầu bằng characterization test bao quanh hành vi hiện tại trước khi refactor",
            en: "Start with characterization tests around current behaviour before refactoring",
          },
          {
            vi: "Ưu tiên test ở tầng cho tỷ lệ tin cậy trên chi phí cao nhất, thường là integration hơn là unit cho code cũ",
            en: "Test at the layer with the best confidence-per-cost — usually integration over unit for legacy code",
          },
          {
            vi: "Đặt quy tắc: mọi bug fix phải kèm một test tái hiện bug đó",
            en: "Adopt a rule: every bug fix ships with a test reproducing that bug",
          },
          {
            vi: "Đo bằng chỉ số có ý nghĩa (tỷ lệ lỗi thoát ra production) chứ không chỉ coverage",
            en: "Measure with a meaningful metric (escaped-defect rate), not coverage alone",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ nói cần tăng coverage. 4-6: có ưu tiên nhưng thiếu chiến lược cho code cũ. 7-8: đề xuất characterization test và ưu tiên theo rủi ro. 9-10: thêm cơ chế duy trì lâu dài và chỉ số đo lường hợp lý.",
            en: "0-3: only says raise coverage. 4-6: prioritises but has no legacy-code strategy. 7-8: proposes characterization tests and risk-based priority. 9-10: adds a durable mechanism and a sensible metric.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Yêu cầu tư duy chiến lược về chất lượng trên codebase kế thừa — tầm Senior.",
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
          vi: "Làm thế nào bạn đưa ra quyết định kỹ thuật gây tranh cãi (ví dụ: đổi thư viện state management toàn hệ thống) khi các team khác không đồng thuận? Hãy trình bày quy trình bạn dùng để đạt đồng thuận và giảm thiểu rủi ro triển khai.",
          en: "How do you drive a contested technical decision (for example, replacing the state management library system-wide) when other teams disagree? Describe the process you use to reach agreement and reduce rollout risk.",
        },
        expectedKeyPoints: [
          {
            vi: "Đề xuất viết RFC/ADR (Architecture Decision Record) nêu rõ bối cảnh, lựa chọn, đánh đổi",
            en: "Write an RFC/ADR stating the context, the options, and the trade-offs",
          },
          {
            vi: "Thu thập phản hồi từ các bên liên quan trước khi chốt quyết định",
            en: "Gather stakeholder feedback before the decision is finalised",
          },
          {
            vi: "Đề xuất rollout tăng dần (feature flag, một module thí điểm) thay vì áp dụng toàn hệ thống ngay",
            en: "Roll out incrementally (feature flag, one pilot module) rather than system-wide at once",
          },
          {
            vi: "Có tiêu chí đo lường thành công/thất bại rõ ràng trước khi mở rộng",
            en: "Define explicit success and failure criteria before scaling up",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ mô tả quyết định kỹ thuật, không đề cập quy trình đồng thuận. 5-7: có quy trình cơ bản. 8-10: quy trình đầy đủ (RFC, rollout tăng dần, tiêu chí đo lường).",
            en: "0-4: describes only the technical decision, no consensus process. 5-7: a basic process. 8-10: a complete one (RFC, incremental rollout, measurable criteria).",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Đánh giá năng lực lãnh đạo kỹ thuật và quản trị thay đổi ở quy mô tổ chức — tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Một hệ thống đang chạy ổn định nhưng chi phí hạ tầng tăng gấp ba trong sáu tháng, trong khi lượng người dùng chỉ tăng 40%. Bạn dẫn dắt việc điều tra và xử lý thế nào, và cân bằng giữa giảm chi phí với tốc độ ra tính năng ra sao?",
          en: "A stable system's infrastructure cost has tripled in six months while users grew only 40%. How do you lead the investigation and response, and how do you balance cost reduction against feature velocity?",
        },
        expectedKeyPoints: [
          {
            vi: "Trước hết quy chi phí về đơn vị nghiệp vụ (chi phí trên mỗi người dùng/request) thay vì nhìn tổng số",
            en: "First convert cost to a business unit (cost per user or per request) rather than looking at the total",
          },
          {
            vi: "Phân bổ chi phí theo service/team để biết ai đang tạo ra nó (cost attribution)",
            en: "Attribute cost per service and team so you know who is generating it",
          },
          {
            vi: "Phân biệt chi phí do tăng trưởng, do lãng phí, và do lựa chọn kiến trúc trong quá khứ",
            en: "Separate cost from growth, from waste, and from past architectural choices",
          },
          {
            vi: "Ưu tiên các khoản tiết kiệm lớn ít rủi ro trước, tránh tối ưu vi mô tốn thời gian kỹ sư",
            en: "Take the large low-risk savings first; avoid micro-optimisations that burn engineer time",
          },
          {
            vi: "Đặt guardrail lâu dài (ngân sách, cảnh báo, review định kỳ) thay vì một đợt dọn dẹp một lần",
            en: "Install lasting guardrails (budgets, alerts, periodic review) instead of a one-off cleanup",
          },
          {
            vi: "Nêu rõ đánh đổi: thời gian kỹ sư bỏ ra tối ưu cũng là một khoản chi phí",
            en: "State the trade-off plainly: engineer time spent optimising is itself a cost",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ liệt kê mẹo giảm chi phí kỹ thuật. 4-6: có điều tra nhưng không quy về đơn vị nghiệp vụ. 7-8: phân bổ chi phí rõ ràng và ưu tiên hợp lý. 9-10: thêm guardrail lâu dài và cân nhắc chi phí cơ hội của thời gian kỹ sư.",
            en: "0-3: lists cost-cutting tips. 4-6: investigates but never normalises to a business unit. 7-8: clear attribution and sensible priority. 9-10: adds lasting guardrails and weighs the opportunity cost of engineer time.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Kết hợp kỹ thuật, tài chính và ưu tiên tổ chức — phạm vi quyết định tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Bạn phát hiện một quyết định kiến trúc bạn đưa ra một năm trước đang trở thành nút thắt cho ba team. Bạn xử lý thế nào, và làm sao để việc thừa nhận sai lầm không làm giảm niềm tin vào các quyết định kiến trúc khác của bạn?",
          en: "You discover an architectural decision you made a year ago is now a bottleneck for three teams. How do you handle it, and how do you admit the mistake without eroding trust in your other architectural calls?",
        },
        expectedKeyPoints: [
          {
            vi: "Xác nhận vấn đề bằng dữ liệu cụ thể trước khi kết luận đó là do quyết định cũ",
            en: "Confirm the problem with concrete data before blaming the old decision",
          },
          {
            vi: "Phân biệt quyết định sai với quyết định đúng ở bối cảnh cũ nhưng đã hết phù hợp",
            en: "Separate a wrong decision from one that was right then and has since been outgrown",
          },
          {
            vi: "Công khai cập nhật ADR gốc thay vì âm thầm đổi hướng",
            en: "Update the original ADR openly rather than quietly changing course",
          },
          {
            vi: "Đề xuất đường di trú tăng dần, không yêu cầu ba team dừng việc cùng lúc",
            en: "Propose an incremental migration that does not stop all three teams at once",
          },
          {
            vi: "Rút ra tín hiệu cảnh báo sớm để áp dụng cho các quyết định sau",
            en: "Extract an early-warning signal to apply to future decisions",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: né tránh hoặc bảo vệ quyết định cũ. 4-6: thừa nhận vấn đề nhưng không có kế hoạch di trú. 7-8: có kế hoạch di trú tăng dần và cập nhật tài liệu. 9-10: thêm việc rút ra tín hiệu cảnh báo sớm cho tương lai.",
            en: "0-3: deflects or defends the old decision. 4-6: admits the problem but has no migration plan. 7-8: incremental migration plus updated documentation. 9-10: also extracts an early-warning signal for the future.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Đánh giá sự trưởng thành kỹ thuật và cách xử lý uy tín cá nhân ở quy mô nhiều team — tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Một team đề xuất viết lại toàn bộ service từ đầu vì code hiện tại 'quá tệ để sửa'. Bạn đánh giá đề xuất này thế nào, và nếu không đồng ý thì bạn đưa ra lựa chọn thay thế nào?",
          en: "A team proposes rewriting an entire service from scratch because the current code is 'too bad to fix'. How do you evaluate that proposal, and if you disagree, what alternative do you offer?",
        },
        expectedKeyPoints: [
          {
            vi: "Yêu cầu dữ liệu cụ thể thay vì cảm tính: tần suất lỗi, thời gian thêm một tính năng, phần nào của code thật sự gây đau",
            en: "Ask for concrete data instead of feeling: defect rate, time to add a feature, which parts of the code actually hurt",
          },
          {
            vi: "Viết lại thường mất nhiều thời gian hơn ước tính và trong lúc đó vẫn phải bảo trì hệ thống cũ",
            en: "A rewrite usually takes longer than estimated, and the old system still needs maintaining meanwhile",
          },
          {
            vi: "Hệ thống cũ chứa nhiều tri thức ngầm về trường hợp biên mà bản viết lại sẽ phải học lại từ đầu",
            en: "The old system encodes tacit knowledge about edge cases that a rewrite has to rediscover the hard way",
          },
          {
            vi: "Đề xuất thay thế: bóp nghẹt dần theo mẫu strangler, thay từng phần sau một lớp giao diện ổn định",
            en: "Offer the strangler pattern instead: replace one piece at a time behind a stable interface",
          },
          {
            vi: "Nêu điều kiện khi viết lại thật sự hợp lý: đổi mô hình dữ liệu nền tảng, hoặc nền tảng công nghệ đã hết hỗ trợ",
            en: "Name when a rewrite genuinely is right: a changed core data model, or a platform that is out of support",
          },
          {
            vi: "Nếu vẫn viết lại thì phải có tiêu chí thành công và điểm dừng được thống nhất trước khi bắt đầu",
            en: "If the rewrite proceeds anyway, agree success criteria and an abort point before starting",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: đồng ý hoặc bác bỏ ngay mà không đòi dữ liệu. 4-6: nêu được rủi ro của viết lại. 7-8: đề xuất di trú tăng dần thay thế. 9-10: thêm điều kiện khi viết lại là đúng và tiêu chí dừng.",
            en: "0-3: agrees or refuses immediately without asking for data. 4-6: names the risks of a rewrite. 7-8: offers incremental migration instead. 9-10: adds when a rewrite is genuinely right, plus an abort criterion.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Quyết định kinh điển tầm Staff: cân bằng giữa nợ kỹ thuật thật và sức hấp dẫn của việc làm lại từ đầu.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Bạn muốn nâng chuẩn kỹ thuật chung (review, test, tài liệu thiết kế) cho năm team mà bạn không quản lý trực tiếp. Bạn làm thế nào để chuẩn đó được áp dụng thật thay vì chỉ nằm trong một trang wiki?",
          en: "You want to raise shared engineering standards (review, testing, design docs) across five teams you do not manage. How do you make the standard real rather than a page on a wiki?",
        },
        expectedKeyPoints: [
          {
            vi: "Bắt đầu từ vấn đề các team đang thật sự gặp, không áp chuẩn từ trên xuống",
            en: "Start from a problem the teams actually feel rather than imposing a standard top-down",
          },
          {
            vi: "Làm mẫu trước ở một team thí điểm và lấy kết quả đó thuyết phục các team còn lại",
            en: "Prove it in one pilot team first and use that result to persuade the rest",
          },
          {
            vi: "Biến chuẩn thành thứ dễ làm hơn là không làm: khuôn mẫu sẵn, kiểm tra tự động, công cụ dùng chung",
            en: "Make the standard easier to follow than to skip: templates, automated checks, shared tooling",
          },
          {
            vi: "Phân biệt điều bắt buộc và điều khuyến nghị, vì bắt buộc mọi thứ sẽ khiến không điều gì được tuân thủ",
            en: "Separate what is required from what is advised — requiring everything means nothing is followed",
          },
          {
            vi: "Xây dựng mạng lưới người ủng hộ trong từng team thay vì dựa vào thẩm quyền bạn không có",
            en: "Build a network of advocates inside each team rather than relying on authority you do not have",
          },
          {
            vi: "Đo mức độ áp dụng và tác động, sẵn sàng bỏ phần nào của chuẩn không tạo ra khác biệt",
            en: "Measure adoption and impact, and drop any part of the standard that makes no difference",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ nói viết tài liệu và thông báo cho các team. 4-6: có thí điểm hoặc người ủng hộ. 7-8: thêm tự động hoá để chuẩn dễ tuân thủ. 9-10: có đo lường và sẵn sàng loại bỏ phần không hiệu quả.",
            en: "0-3: writes a document and announces it. 4-6: has a pilot or advocates. 7-8: adds automation so the standard is easy to follow. 9-10: measures impact and will drop what does not work.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Ảnh hưởng không dựa trên thẩm quyền quản lý — năng lực đặc trưng của vai trò Staff.",
        },
        requiresPractice: false,
      },
    ],
  },
};
