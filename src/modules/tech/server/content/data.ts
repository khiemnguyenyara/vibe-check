import "server-only";

import type { SpecialtyBank } from "./types";

/**
 * Data — modeling, pipelines, warehousing, and data platform reliability.
 *
 * `id` matches the `data` specialty in src/lib/domains.ts. Topic selection
 * drew general orientation from donnemartin/system-design-primer's survey of
 * sharding, replication, and SQL-vs-NoSQL trade-offs — see ATTRIBUTION.md at
 * the repo root for exactly what that means and doesn't mean. Every prompt,
 * rubric, and key point below is original authorship.
 *
 * Junior probes relational fundamentals (joins, normalization, indexing);
 * mid moves to concrete modeling and pipeline decisions; senior and staff
 * lean on system- and organization-scale data platform reasoning, matching
 * the pattern the other specialty banks use for those tiers.
 */
export const dataBank: SpecialtyBank = {
  id: "data",
  label: "Data",
  questions: {
    junior: [
      {
        type: "open",
        question: {
          vi: "Một báo cáo hiển thị số 0 đơn hàng cho những khách hàng thực ra chưa từng đặt đơn nào, thay vì hiển thị đúng là họ tồn tại nhưng có 0 đơn. Nguyên nhân có thể là gì, và bạn sửa truy vấn thế nào?",
          en: "A report shows zero orders for customers, but those customers with genuinely zero orders are missing from the report entirely instead of showing as 0. What might cause this, and how do you fix the query?",
        },
        expectedKeyPoints: [
          {
            vi: "INNER JOIN chỉ giữ lại các dòng có khớp ở cả hai bảng, nên khách hàng không có đơn hàng nào bị loại hoàn toàn",
            en: "INNER JOIN keeps only rows matching in both tables, so a customer with zero orders is dropped entirely",
          },
          {
            vi: "Cần đổi sang LEFT JOIN từ bảng khách hàng để giữ lại mọi khách hàng, kể cả khi không có đơn hàng khớp",
            en: "Switch to a LEFT JOIN from the customer table to keep every customer, even with no matching order",
          },
          {
            vi: "Sau LEFT JOIN, các cột từ bảng đơn hàng sẽ là NULL với khách hàng không có đơn — cần dùng COUNT hoặc COALESCE để hiển thị 0 thay vì NULL",
            en: "After the LEFT JOIN, order-table columns are NULL for those customers — use COUNT or COALESCE to show 0 instead of NULL",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: không xác định được nguyên nhân là loại JOIN. 5-7: xác định đúng nguyên nhân và đổi sang LEFT JOIN. 8-10: thêm xử lý NULL thành 0 sau khi đổi JOIN.",
            en: "0-4: cannot identify the join type as the cause. 5-7: identifies it correctly and switches to LEFT JOIN. 8-10: also handles NULL becoming 0 after the join change.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Phân biệt INNER và LEFT JOIN là kiến thức SQL nền tảng bắt buộc.",
        },
        requiresPractice: true,
      },
      {
        type: "open",
        question: {
          vi: "Trong một bảng đơn hàng, địa chỉ giao hàng của khách được lặp lại ở mọi dòng đơn hàng của người đó thay vì lưu riêng. Vì sao đây thường bị coi là thiết kế chưa tốt, và bạn tổ chức lại thế nào?",
          en: "In an orders table, a customer's shipping address is repeated on every one of their order rows instead of stored separately. Why is this usually considered poor design, and how would you reorganize it?",
        },
        expectedKeyPoints: [
          {
            vi: "Lặp lại dữ liệu tốn dung lượng và tạo rủi ro không nhất quán nếu chỉ một vài dòng được cập nhật khi địa chỉ đổi",
            en: "Repeated data wastes storage and risks inconsistency if only some rows get updated when the address changes",
          },
          {
            vi: "Tách địa chỉ ra bảng riêng, liên kết bằng khoá ngoại tới khách hàng — đây là chuẩn hoá dữ liệu (normalization)",
            en: "Move the address into its own table, linked by a foreign key to the customer — this is normalization",
          },
          {
            vi: "Đánh đổi: truy vấn cần JOIN thêm để lấy địa chỉ, phức tạp hơn một chút so với đọc trực tiếp từ một bảng",
            en: "Trade-off: queries now need an extra JOIN to fetch the address, slightly more complex than reading from one table",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: không thấy vấn đề với việc lặp lại dữ liệu. 5-7: nhận ra vấn đề và đề xuất tách bảng. 8-10: đề xuất tách bảng đúng kèm nêu được đánh đổi truy vấn.",
            en: "0-4: sees no problem with the repetition. 5-7: recognises it and proposes splitting the table. 8-10: proposes the split correctly and names the query trade-off.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Chuẩn hoá dữ liệu là nguyên tắc thiết kế cơ sở dữ liệu nền tảng.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Một truy vấn lọc theo cột `email` trên một bảng người dùng hàng triệu dòng đang chạy rất chậm. Bước đầu tiên bạn kiểm tra là gì, và việc thêm index có đánh đổi gì?",
          en: "A query filtering on the `email` column of a users table with millions of rows runs very slowly. What's the first thing you check, and what's the trade-off of adding an index?",
        },
        expectedKeyPoints: [
          {
            vi: "Kiểm tra xem cột `email` đã có index chưa — nếu chưa, database phải quét toàn bảng cho mỗi truy vấn",
            en: "Check whether the `email` column already has an index — without one, the database scans the entire table for every query",
          },
          {
            vi: "Thêm index giúp tra cứu nhanh hơn nhiều, gần với thời gian không đổi thay vì tuyến tính theo số dòng",
            en: "Adding an index makes lookups far faster, close to constant time instead of scanning linearly with row count",
          },
          {
            vi: "Đánh đổi: index làm chậm thao tác ghi (insert/update) vì phải cập nhật cả index, và tốn thêm dung lượng lưu trữ",
            en: "Trade-off: an index slows down writes (insert/update) since the index must be updated too, and it costs extra storage",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: không nghĩ tới index. 5-7: đề xuất thêm index đúng chỗ. 8-10: đề xuất index kèm nêu đúng đánh đổi về ghi và dung lượng.",
            en: "0-4: doesn't consider indexing. 5-7: correctly proposes adding an index. 8-10: proposes it and correctly names the write and storage trade-off.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Indexing là kiến thức tối ưu truy vấn nền tảng, bắt buộc có ở Junior.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Mệnh đề SQL nào dùng để lọc kết quả SAU KHI đã nhóm dữ liệu bằng GROUP BY?",
          en: "Which SQL clause filters results AFTER data has been grouped by GROUP BY?",
        },
        options: [
          { vi: "WHERE", en: "WHERE" },
          { vi: "HAVING", en: "HAVING" },
          { vi: "ORDER BY", en: "ORDER BY" },
          { vi: "LIMIT", en: "LIMIT" },
        ],
        correctOptionIndex: 1,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Phân biệt WHERE và HAVING là kiến thức SQL cơ bản.",
        },
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Khoá ngoại (foreign key) trong một bảng quan hệ dùng để làm gì?",
          en: "What is a foreign key in a relational table used for?",
        },
        options: [
          {
            vi: "Tham chiếu tới khoá chính của một bảng khác, đảm bảo tính toàn vẹn giữa hai bảng",
            en: "Referencing another table's primary key, enforcing integrity between the two tables",
          },
          {
            vi: "Mã hoá dữ liệu nhạy cảm trong cột đó",
            en: "Encrypting sensitive data in that column",
          },
          {
            vi: "Tăng tốc độ ghi dữ liệu vào bảng",
            en: "Speeding up writes into the table",
          },
          {
            vi: "Giới hạn số dòng tối đa của bảng",
            en: "Capping the table's maximum row count",
          },
        ],
        correctOptionIndex: 0,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Khái niệm khoá ngoại là nền tảng của mô hình dữ liệu quan hệ.",
        },
      },
    ],
    mid: [
      {
        type: "open",
        question: {
          vi: "Bạn thiết kế lưu trữ cho danh mục sản phẩm, trong đó mỗi loại sản phẩm (quần áo, điện tử, sách) có tập thuộc tính khác nhau và thường xuyên thay đổi. Bạn chọn cơ sở dữ liệu quan hệ hay NoSQL, và vì sao?",
          en: "You're designing storage for a product catalog where each category (clothing, electronics, books) has a different, frequently-changing set of attributes. Do you choose a relational database or NoSQL, and why?",
        },
        expectedKeyPoints: [
          {
            vi: "Cơ sở dữ liệu quan hệ đòi hỏi schema cố định, nên thuộc tính thay đổi theo từng loại sản phẩm gây khó khăn (nhiều cột NULL hoặc phải đổi schema liên tục)",
            en: "A relational database requires a fixed schema, so per-category varying attributes are awkward — many NULL columns or constant schema changes",
          },
          {
            vi: "Cơ sở dữ liệu document (NoSQL) cho phép mỗi sản phẩm có tập trường khác nhau mà không cần đổi schema toàn cục",
            en: "A document database (NoSQL) lets each product have a different set of fields without a global schema change",
          },
          {
            vi: "Đánh đổi: mất một số ràng buộc toàn vẹn và JOIN mạnh mẽ mà cơ sở dữ liệu quan hệ cung cấp",
            en: "Trade-off: loses some of the integrity constraints and strong JOIN support a relational database provides",
          },
          {
            vi: "Cân nhắc phương án lai: quan hệ cho dữ liệu cốt lõi ổn định (giá, tồn kho), cột JSON hoặc NoSQL riêng cho thuộc tính biến đổi",
            en: "Consider a hybrid: relational for stable core data (price, stock), a JSON column or separate NoSQL store for variable attributes",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chọn một loại mà không phân tích. 5-7: chọn NoSQL/document đúng lý do. 8-10: nêu đúng đánh đổi và đề xuất được phương án lai.",
            en: "0-4: picks one type with no analysis. 5-7: picks NoSQL/document with correct reasoning. 8-10: names the trade-off and proposes a hybrid approach.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Chọn công cụ lưu trữ theo đặc điểm dữ liệu thực tế — quyết định thường gặp tầm Mid-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Đội của bạn cần đưa dữ liệu bán hàng hằng ngày vào một bảng báo cáo cho đội kinh doanh xem mỗi sáng. Bạn thiết kế pipeline này chạy theo lô (batch) hay thời gian thực, và vì sao?",
          en: "Your team needs to load daily sales data into a reporting table the sales team checks every morning. Do you design this pipeline as batch or real-time, and why?",
        },
        expectedKeyPoints: [
          {
            vi: "Nhu cầu thực tế chỉ cần dữ liệu sẵn sàng vào buổi sáng, không cần cập nhật liên tục trong ngày",
            en: "The real need is just data ready by morning, not continuous updates throughout the day",
          },
          {
            vi: "Chạy theo lô (batch) hằng đêm đơn giản hơn nhiều để xây dựng, kiểm thử và gỡ lỗi so với hệ thống thời gian thực",
            en: "A nightly batch job is far simpler to build, test, and debug than a real-time system",
          },
          {
            vi: "Thời gian thực chỉ đáng đầu tư khi có nhu cầu nghiệp vụ thật sự cần độ trễ thấp, không phải vì nghe hiện đại hơn",
            en: "Real-time is only worth the investment when there's a genuine low-latency business need, not because it sounds more modern",
          },
          {
            vi: "Cần có cảnh báo khi job batch thất bại hoặc chạy trễ, để đội kinh doanh không âm thầm thấy số liệu cũ",
            en: "Need alerting when the batch job fails or runs late, so the sales team doesn't silently see stale numbers",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chọn thời gian thực mà không phân tích nhu cầu thực tế. 5-7: chọn batch đúng lý do. 8-10: thêm điều kiện khi nào thời gian thực mới đáng đầu tư và cảnh báo khi job thất bại.",
            en: "0-4: picks real-time without analysing the actual need. 5-7: picks batch with correct reasoning. 8-10: adds when real-time would actually be worth it and alerting on job failure.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Chọn đúng mức độ phức tạp cần thiết cho pipeline dữ liệu — đúng tầm Mid-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Đội kinh doanh cần một dashboard phân tích doanh số theo thời gian, khu vực, và sản phẩm. Bạn thiết kế mô hình dữ liệu (star schema) cho việc này thế nào?",
          en: "The business team needs a dashboard analyzing sales over time, region, and product. How do you design the data model (star schema) for this?",
        },
        expectedKeyPoints: [
          {
            vi: "Bảng fact ở trung tâm lưu các sự kiện bán hàng (số lượng, doanh thu), mỗi dòng là một giao dịch hoặc tổng hợp theo ngày",
            en: "A central fact table stores sale events (quantity, revenue), one row per transaction or per-day aggregate",
          },
          {
            vi: "Các bảng dimension riêng cho thời gian, khu vực, sản phẩm — mỗi bảng chứa thuộc tính mô tả để lọc và nhóm",
            en: "Separate dimension tables for time, region, and product — each holding descriptive attributes for filtering and grouping",
          },
          {
            vi: "Bảng fact liên kết tới các dimension qua khoá ngoại, giữ cấu trúc đơn giản dễ truy vấn cho công cụ BI",
            en: "The fact table links to dimensions via foreign keys, keeping the structure simple for BI tools to query",
          },
          {
            vi: "Đây là mô hình cố ý phi chuẩn hoá (denormalized) so với hệ thống giao dịch gốc, đánh đổi lấy tốc độ đọc/tổng hợp",
            en: "This is deliberately denormalized compared to the source transactional system, trading write purity for read/aggregation speed",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ nói dựng một bảng tổng hợp duy nhất. 5-7: có bảng fact và dimension cơ bản. 8-10: nêu đúng mối liên kết và giải thích được lý do phi chuẩn hoá cho phân tích.",
            en: "0-4: just builds a single aggregate table. 5-7: has a basic fact and dimension structure. 8-10: gets the linking right and explains the reasoning for denormalizing for analytics.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Thiết kế mô hình dữ liệu phân tích cơ bản — kỹ năng cốt lõi tầm Mid-level.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Hệ thống OLTP (giao dịch) và OLAP (phân tích) khác nhau chủ yếu ở điểm nào?",
          en: "What is the main difference between an OLTP (transactional) system and an OLAP (analytical) one?",
        },
        options: [
          {
            vi: "OLTP tối ưu cho nhiều giao dịch đọc/ghi nhỏ; OLAP tối ưu cho truy vấn tổng hợp lớn trên nhiều dữ liệu",
            en: "OLTP is optimized for many small read/write transactions; OLAP is optimized for large aggregate queries over lots of data",
          },
          {
            vi: "OLTP chỉ dùng cho web, OLAP chỉ dùng cho ứng dụng di động",
            en: "OLTP is only for web apps, OLAP is only for mobile apps",
          },
          {
            vi: "OLAP luôn nhanh hơn OLTP trong mọi trường hợp",
            en: "OLAP is always faster than OLTP in every case",
          },
          {
            vi: "Không có khác biệt thực sự, chỉ là tên gọi khác nhau",
            en: "There is no real difference, just different naming",
          },
        ],
        correctOptionIndex: 0,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "Phân biệt OLTP và OLAP là kiến thức nền tảng cho vai trò Data.",
        },
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Phi chuẩn hoá (denormalization) dữ liệu chủ yếu đánh đổi điều gì?",
          en: "What does denormalizing data primarily trade off?",
        },
        options: [
          {
            vi: "Đọc nhanh hơn, đổi lấy dữ liệu trùng lặp và rủi ro không nhất quán khi cập nhật",
            en: "Faster reads, in exchange for duplicated data and update-inconsistency risk",
          },
          {
            vi: "Ghi nhanh hơn, đổi lấy đọc chậm hơn",
            en: "Faster writes, in exchange for slower reads",
          },
          {
            vi: "Giảm dung lượng lưu trữ",
            en: "Reduced storage usage",
          },
          {
            vi: "Không có đánh đổi nào đáng kể",
            en: "No meaningful trade-off",
          },
        ],
        correctOptionIndex: 0,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "Đánh đổi cơ bản khi thiết kế dữ liệu cho phân tích — cần hiểu đúng ở Mid-level.",
        },
      },
    ],
    senior: [
      {
        type: "open",
        question: {
          vi: "Một bảng giao dịch đã vượt quá khả năng của một database instance duy nhất. Bạn thiết kế chiến lược sharding thế nào, và chọn khoá shard (shard key) ra sao?",
          en: "A transactions table has outgrown what a single database instance can handle. How do you design a sharding strategy, and how do you choose the shard key?",
        },
        expectedKeyPoints: [
          {
            vi: "Chọn shard key dựa trên mẫu truy vấn thực tế: khoá thường xuất hiện trong điều kiện WHERE để tránh truy vấn phải quét mọi shard",
            en: "Choose the shard key based on real query patterns: one that commonly appears in WHERE clauses, so queries don't need to fan out across every shard",
          },
          {
            vi: "Tránh shard key gây lệch tải (hot shard), ví dụ dùng ngày tạo nếu phần lớn traffic tập trung vào dữ liệu gần đây",
            en: "Avoid a shard key that causes hot shards — e.g. creation date if most traffic concentrates on recent data",
          },
          {
            vi: "Cân nhắc trước khả năng cần cân bằng lại (rebalance) khi một shard quá tải, vì di chuyển dữ liệu giữa các shard đang chạy rất tốn kém",
            en: "Plan ahead for rebalancing when one shard grows too large, since moving data between live shards is expensive",
          },
          {
            vi: "Truy vấn xuyên shard (cần dữ liệu từ nhiều shard) trở nên khó hơn nhiều — cần thiết kế lại hoặc chấp nhận tổng hợp ở tầng ứng dụng",
            en: "Cross-shard queries (needing data from multiple shards) become much harder — redesign around this or accept application-level aggregation",
          },
          {
            vi: "Ràng buộc toàn vẹn xuyên shard (ví dụ khoá ngoại) không còn được database đảm bảo, phải xử lý ở tầng ứng dụng",
            en: "Cross-shard integrity constraints (like foreign keys) are no longer enforced by the database — must be handled at the application layer",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ nói 'chia bảng ra nhiều database'. 4-6: chọn shard key dựa trên mẫu truy vấn. 7-8: tránh được hot shard và tính tới rebalance. 9-10: thêm xử lý truy vấn xuyên shard và ràng buộc toàn vẹn.",
            en: "0-3: just says 'split the table across multiple databases'. 4-6: chooses a shard key based on query patterns. 7-8: avoids hot shards and plans for rebalancing. 9-10: adds handling cross-shard queries and integrity.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Thiết kế sharding thực tế với nhiều đánh đổi đồng thời — đúng tầm Senior.",
        },
        requiresPractice: true,
      },
      {
        type: "open",
        question: {
          vi: "Đội sản phẩm cần một dashboard hiển thị số liệu gần thời gian thực (độ trễ vài giây) từ hàng triệu sự kiện người dùng mỗi phút. Bạn thiết kế pipeline dữ liệu thế nào?",
          en: "The product team needs a dashboard showing near-real-time numbers (a few seconds of latency) from millions of user events per minute. How do you design the data pipeline?",
        },
        expectedKeyPoints: [
          {
            vi: "Dùng hệ thống streaming (ví dụ hàng đợi sự kiện) thay vì batch, vì độ trễ yêu cầu chỉ vài giây",
            en: "Use a streaming system (an event queue) rather than batch, since the latency requirement is only a few seconds",
          },
          {
            vi: "Tổng hợp theo cửa sổ thời gian (windowing) ở tầng xử lý stream để giảm khối lượng trước khi ghi vào nơi lưu phục vụ dashboard",
            en: "Aggregate with time windowing in the stream-processing layer to reduce volume before writing to the store the dashboard reads",
          },
          {
            vi: "Chấp nhận đánh đổi giữa exactly-once và at-least-once xử lý — hầu hết hệ thống streaming chỉ đảm bảo at-least-once, cần xử lý trùng lặp",
            en: "Accept the trade-off between exactly-once and at-least-once processing — most streaming systems only guarantee at-least-once, so handle duplicates",
          },
          {
            vi: "Tách riêng nơi lưu phục vụ đọc nhanh cho dashboard khỏi nơi lưu dữ liệu thô lâu dài phục vụ phân tích sâu sau này",
            en: "Separate the fast-read store serving the dashboard from long-term raw storage kept for deeper analysis later",
          },
          {
            vi: "Có cơ chế phát hiện khi pipeline streaming bị trễ hoặc dừng, vì lỗi im lặng ở đây trực tiếp làm sai số liệu người dùng thấy",
            en: "Have a way to detect when the streaming pipeline lags or stalls, since a silent failure here directly corrupts what users see",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: đề xuất chạy batch mỗi vài phút. 4-6: chọn streaming và có windowing cơ bản. 7-8: xử lý được vấn đề trùng lặp at-least-once. 9-10: thêm tách kho lưu trữ và phát hiện pipeline bị trễ/dừng.",
            en: "0-3: proposes batch every few minutes. 4-6: picks streaming with basic windowing. 7-8: handles the at-least-once duplication issue. 9-10: adds storage separation and detecting a lagging/stalled pipeline.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Thiết kế pipeline streaming thực tế với ràng buộc độ trễ nghiêm ngặt — tầm Senior.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Công ty có dữ liệu nằm rải rác ở CRM, hệ thống billing, và log sử dụng sản phẩm — ba nguồn khác nhau, không đồng bộ với nhau. Bạn thiết kế data warehouse hợp nhất chúng thế nào?",
          en: "The company's data is scattered across a CRM, a billing system, and product usage logs — three sources that don't sync with each other. How do you design a data warehouse to unify them?",
        },
        expectedKeyPoints: [
          {
            vi: "Xây tầng nạp thô (raw/staging layer) giữ nguyên dữ liệu gốc từ mỗi nguồn trước khi biến đổi, để có thể chạy lại nếu logic biến đổi sai",
            en: "Build a raw/staging layer that keeps each source's data as-is before transformation, so logic errors can be reprocessed from source",
          },
          {
            vi: "Chuẩn hoá định danh dùng chung (ví dụ customer_id) giữa các nguồn, vì mỗi hệ thống thường dùng khoá khác nhau cho cùng một khách hàng",
            en: "Standardise a shared identifier (e.g. customer_id) across sources, since each system typically uses a different key for the same customer",
          },
          {
            vi: "Nạp tăng dần (incremental load) thay vì tải lại toàn bộ mỗi lần, để pipeline chạy trong thời gian hợp lý khi dữ liệu lớn dần",
            en: "Load incrementally rather than reloading everything each run, so the pipeline stays fast as data grows",
          },
          {
            vi: "Có kiểm tra chất lượng dữ liệu ở mỗi tầng (số dòng, giá trị null bất thường) để phát hiện lỗi nguồn sớm, không để lan tới báo cáo",
            en: "Add data-quality checks at each layer (row counts, unexpected nulls) to catch source errors early, before they reach reports",
          },
          {
            vi: "Nêu được vấn đề độ trễ đồng bộ: dữ liệu từ ba nguồn có thể không cùng thời điểm, cần quyết định cách xử lý dữ liệu đến muộn",
            en: "Names the sync-lag problem: data from the three sources may not arrive at the same time, so decide how to handle late-arriving data",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ nói gộp cả ba nguồn vào một bảng. 4-6: có tầng staging và chuẩn hoá định danh. 7-8: thêm nạp tăng dần và kiểm tra chất lượng. 9-10: thêm xử lý dữ liệu đến muộn giữa các nguồn.",
            en: "0-3: just merges all three sources into one table. 4-6: has a staging layer and identifier standardisation. 7-8: adds incremental loading and quality checks. 9-10: adds handling late-arriving data across sources.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Thiết kế data warehouse hợp nhất nhiều nguồn không đồng bộ — bài toán tầm Senior.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Trong xử lý streaming, ngữ nghĩa 'at-least-once' nghĩa là gì?",
          en: "In stream processing, what does 'at-least-once' delivery semantics mean?",
        },
        options: [
          {
            vi: "Mỗi sự kiện chắc chắn được xử lý, nhưng có thể bị xử lý trùng lặp hơn một lần",
            en: "Every event is guaranteed to be processed, but may be processed more than once",
          },
          {
            vi: "Mỗi sự kiện được xử lý đúng một lần duy nhất, không bao giờ trùng",
            en: "Every event is processed exactly once, never duplicated",
          },
          {
            vi: "Sự kiện có thể bị mất mà không được xử lý",
            en: "Events may be lost and never processed",
          },
          {
            vi: "Chỉ áp dụng cho hệ thống batch, không áp dụng cho streaming",
            en: "Only applies to batch systems, not streaming",
          },
        ],
        correctOptionIndex: 0,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Ngữ nghĩa xử lý streaming là kiến thức quan trọng ở tầm Senior.",
        },
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Khác biệt chính giữa data lake và data warehouse là gì?",
          en: "What is the main difference between a data lake and a data warehouse?",
        },
        options: [
          {
            vi: "Data lake lưu dữ liệu thô, đa dạng định dạng, chưa qua xử lý; data warehouse lưu dữ liệu đã cấu trúc và biến đổi sẵn cho phân tích",
            en: "A data lake stores raw, varied-format, unprocessed data; a data warehouse stores structured, pre-transformed data ready for analysis",
          },
          {
            vi: "Data lake chỉ dùng cho ảnh và video",
            en: "A data lake is only for images and video",
          },
          {
            vi: "Data warehouse luôn rẻ hơn data lake",
            en: "A data warehouse is always cheaper than a data lake",
          },
          {
            vi: "Không có khác biệt, hai thuật ngữ dùng thay thế cho nhau",
            en: "There is no difference, the terms are interchangeable",
          },
        ],
        correctOptionIndex: 0,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Phân biệt data lake và data warehouse là kiến thức kiến trúc dữ liệu tầm Senior.",
        },
      },
    ],
    staff: [
      {
        type: "open",
        question: {
          vi: "Công ty có hơn hai mươi team tự tạo và sử dụng dữ liệu mà không có quy chuẩn chung, dẫn tới nhiều bảng trùng lặp và không ai biết nguồn nào là chính xác. Bạn xây dựng chương trình quản trị dữ liệu (data governance) thế nào?",
          en: "The company has twenty-plus teams creating and consuming data with no shared standard, resulting in duplicate tables and no clear source of truth. How do you build a data governance programme?",
        },
        expectedKeyPoints: [
          {
            vi: "Bắt đầu bằng việc xác định chủ sở hữu (owner) rõ ràng cho từng tập dữ liệu quan trọng, không phải mọi bảng đều cần quản trị chặt như nhau",
            en: "Start by assigning clear ownership for each important dataset — not every table needs equally strict governance",
          },
          {
            vi: "Xây danh mục dữ liệu (data catalog) để mọi người tìm được nguồn chính xác thay vì tự tạo bản sao",
            en: "Build a data catalog so people can find the authoritative source instead of creating their own copy",
          },
          {
            vi: "Đặt tiêu chuẩn tối thiểu (định danh dùng chung, quy ước đặt tên) áp dụng dần, không ép toàn bộ tổ chức đổi cùng lúc",
            en: "Set minimum standards (shared identifiers, naming conventions) and roll them out gradually, not force the whole org to change at once",
          },
          {
            vi: "Ưu tiên quản trị chặt cho dữ liệu ảnh hưởng quyết định quan trọng (báo cáo tài chính, chỉ số cho ban lãnh đạo) trước",
            en: "Prioritise strict governance first for data that drives important decisions (financial reporting, leadership metrics)",
          },
          {
            vi: "Đo thành công bằng mức độ tin cậy và tái sử dụng dữ liệu thực tế, không phải số lượng chính sách đã ban hành",
            en: "Measure success by actual trust and reuse of the data, not by how many policies were published",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: đề xuất ban hành quy định bắt buộc cho mọi bảng ngay lập tức. 4-6: có xác định chủ sở hữu và danh mục dữ liệu. 7-8: thêm áp dụng dần và ưu tiên dữ liệu quan trọng trước. 9-10: thêm cách đo thành công bằng mức độ tin cậy thực tế.",
            en: "0-3: mandates strict rules for every table immediately. 4-6: has ownership and a catalog. 7-8: adds gradual rollout and prioritising critical data first. 9-10: adds measuring success by real trust and reuse.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Xây dựng chương trình quản trị dữ liệu xuyên tổ chức không có thẩm quyền ép buộc — tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Công ty muốn di chuyển data warehouse cũ đặt tại chỗ (on-premise) lên nền tảng cloud hiện đại, trong khi đội kinh doanh vẫn phụ thuộc báo cáo hằng ngày từ hệ thống cũ. Bạn lập kế hoạch di trú thế nào?",
          en: "The company wants to migrate its legacy on-premise data warehouse to a modern cloud platform, while the business team still depends on daily reports from the old system. How do you plan the migration?",
        },
        expectedKeyPoints: [
          {
            vi: "Chạy song song hai hệ thống trong một giai đoạn, đối chiếu kết quả để đảm bảo hệ thống mới cho ra số liệu khớp trước khi chuyển hẳn",
            en: "Run both systems in parallel for a period, reconciling outputs to confirm the new system matches before fully cutting over",
          },
          {
            vi: "Di trú theo từng miền dữ liệu hoặc từng báo cáo một, không chuyển toàn bộ warehouse cùng lúc",
            en: "Migrate by data domain or by report, not the entire warehouse at once",
          },
          {
            vi: "Ưu tiên di trú các báo cáo ít rủi ro trước để xây dựng độ tin cậy vào quy trình, để dành báo cáo quan trọng nhất cho giai đoạn cuối",
            en: "Migrate lower-risk reports first to build confidence in the process, saving the most critical reports for last",
          },
          {
            vi: "Có kế hoạch rollback rõ ràng nếu hệ thống mới cho kết quả sai lệch sau khi đã chuyển một phần",
            en: "Have a clear rollback plan if the new system produces divergent results after a partial cutover",
          },
          {
            vi: "Giao tiếp lịch trình rõ ràng với đội kinh doanh, vì họ là người trực tiếp chịu ảnh hưởng nếu báo cáo sai lệch",
            en: "Communicate the timeline clearly to the business team, since they are the ones directly affected if reports diverge",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: đề xuất chuyển toàn bộ warehouse trong một lần cắt sang. 4-6: có chạy song song để đối chiếu. 7-8: di trú theo từng phần và ưu tiên rủi ro thấp trước. 9-10: thêm kế hoạch rollback và giao tiếp với đội kinh doanh.",
            en: "0-3: proposes a single big-bang cutover for the whole warehouse. 4-6: runs both systems in parallel to reconcile. 7-8: migrates incrementally, low-risk first. 9-10: adds a rollback plan and communication with the business team.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Di trú hạ tầng dữ liệu quan trọng mà không làm gián đoạn nghiệp vụ đang phụ thuộc — tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Các team sản phẩm liên tục phải xếp hàng chờ đội dữ liệu viết truy vấn hộ, khiến đội dữ liệu trở thành nút thắt cổ chai. Bạn xây dựng nền tảng dữ liệu tự phục vụ (self-serve) thế nào để giảm việc này?",
          en: "Product teams constantly queue up waiting for the data team to write queries for them, making the data team a bottleneck. How do you build a self-serve data platform to reduce this?",
        },
        expectedKeyPoints: [
          {
            vi: "Cung cấp các bảng đã được làm sạch, tài liệu hoá rõ ràng, để team khác tự truy vấn mà không cần hiểu logic biến đổi phức tạp bên dưới",
            en: "Provide clean, well-documented tables so other teams can query directly without understanding the complex transformation logic underneath",
          },
          {
            vi: "Đầu tư vào công cụ truy vấn thân thiện (BI tool, SQL editor có gợi ý) để người không chuyên về dữ liệu vẫn dùng được",
            en: "Invest in accessible query tooling (a BI tool, an assisted SQL editor) so non-specialists can still use it",
          },
          {
            vi: "Đặt ranh giới rõ giữa dữ liệu tự phục vụ được và dữ liệu nhạy cảm vẫn cần đội dữ liệu kiểm soát",
            en: "Draw a clear boundary between what's safe for self-serve and sensitive data that still needs data-team gatekeeping",
          },
          {
            vi: "Đội dữ liệu chuyển vai trò từ người viết truy vấn hộ sang người xây nền tảng và huấn luyện đội khác dùng đúng cách",
            en: "The data team shifts from writing queries for others to building the platform and training others to use it correctly",
          },
          {
            vi: "Đo thành công bằng số lượng yêu cầu chờ đội dữ liệu giảm đi, không phải số công cụ đã triển khai",
            en: "Measure success by the drop in requests queued for the data team, not by how many tools were shipped",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ đề xuất thuê thêm người viết truy vấn hộ. 4-6: có bảng làm sạch và công cụ truy vấn. 7-8: thêm ranh giới rõ với dữ liệu nhạy cảm và vai trò mới của đội dữ liệu. 9-10: thêm cách đo thành công bằng số yêu cầu giảm đi.",
            en: "0-3: just proposes hiring more people to write queries. 4-6: has clean tables and query tooling. 7-8: adds a boundary for sensitive data and the data team's new role. 9-10: adds measuring success by the drop in queued requests.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Xây dựng nền tảng tự phục vụ để loại bỏ nút thắt cổ chai tổ chức — tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Một khách hàng yêu cầu xoá toàn bộ dữ liệu cá nhân của họ theo quy định bảo vệ dữ liệu, nhưng dữ liệu đó nằm rải rác trong hàng chục hệ thống và pipeline khác nhau. Bạn xây dựng năng lực đáp ứng yêu cầu này thế nào?",
          en: "A customer requests deletion of all their personal data under data-protection regulation, but that data is scattered across dozens of systems and pipelines. How do you build the capability to fulfill this?",
        },
        expectedKeyPoints: [
          {
            vi: "Trước hết cần một bản đồ dữ liệu (data map) biết chính xác dữ liệu cá nhân nằm ở đâu — không thể xoá cái không biết mình có",
            en: "First need a data map that knows exactly where personal data lives — you can't delete what you don't know you have",
          },
          {
            vi: "Chuẩn hoá cách định danh một cá nhân xuyên hệ thống, để một yêu cầu xoá có thể truy vết tới mọi nơi liên quan",
            en: "Standardise how an individual is identified across systems, so one deletion request can be traced to everywhere it matters",
          },
          {
            vi: "Phân biệt dữ liệu có thể xoá ngay và dữ liệu phải giữ lại vì nghĩa vụ pháp lý khác (ví dụ hồ sơ kế toán), xử lý minh bạch với khách hàng",
            en: "Separate data that can be deleted immediately from data that must be retained for another legal obligation (e.g. accounting records), and be transparent with the customer about it",
          },
          {
            vi: "Xây quy trình tự động hoá thay vì xử lý thủ công từng hệ thống mỗi lần có yêu cầu, vì thủ công không mở rộng được và dễ bỏ sót",
            en: "Automate the process rather than manually touching each system per request — manual doesn't scale and misses things easily",
          },
          {
            vi: "Ghi lại bằng chứng đã thực hiện xoá cho mục đích tuân thủ, kể cả trong các bản sao lưu (backup) theo chu kỳ",
            en: "Keep auditable evidence the deletion happened, including across periodic backups, for compliance purposes",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: đề xuất xoá thủ công từng hệ thống khi có yêu cầu. 4-6: có bản đồ dữ liệu và định danh chuẩn hoá. 7-8: phân biệt được dữ liệu phải giữ lại và tự động hoá quy trình. 9-10: thêm xử lý backup và ghi bằng chứng tuân thủ.",
            en: "0-3: proposes manually deleting from each system per request. 4-6: has a data map and standardised identity. 7-8: separates data that must be retained and automates the process. 9-10: adds handling backups and audit evidence.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Xây dựng năng lực tuân thủ bảo vệ dữ liệu xuyên nhiều hệ thống — bài toán tổ chức tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Một lỗi trong pipeline âm thầm làm sai một chỉ số quan trọng suốt nhiều tuần trước khi bị phát hiện, và chỉ số đó đã được dùng trong báo cáo cho ban lãnh đạo. Bạn xây dựng chương trình đảm bảo chất lượng dữ liệu thế nào để việc này không lặp lại?",
          en: "A pipeline bug silently corrupted an important metric for weeks before anyone noticed, and that metric had already been used in leadership reporting. How do you build a data-quality programme so this doesn't happen again?",
        },
        expectedKeyPoints: [
          {
            vi: "Thêm kiểm tra tự động ở pipeline: số dòng bất thường, giá trị ngoài khoảng hợp lý, thay đổi đột ngột so với xu hướng lịch sử",
            en: "Add automated pipeline checks: unusual row counts, out-of-range values, sudden deviation from historical trend",
          },
          {
            vi: "Ưu tiên giám sát chặt các chỉ số ảnh hưởng quyết định quan trọng nhất trước, không thể giám sát chặt như nhau cho mọi pipeline",
            en: "Prioritise strict monitoring for the metrics that drive the most important decisions first — not every pipeline can get equal scrutiny",
          },
          {
            vi: "Khi phát hiện sai lệch, cần quy trình thông báo rõ ràng cho những người đã dùng số liệu sai, không chỉ âm thầm sửa",
            en: "When a discrepancy is found, have a clear process to notify everyone who used the wrong number, not just quietly fix it",
          },
          {
            vi: "Xây văn hoá xem chất lượng dữ liệu là trách nhiệm chung, không chỉ của đội dữ liệu — người tạo ra dữ liệu cũng phải chịu trách nhiệm",
            en: "Build a culture where data quality is a shared responsibility, not just the data team's — those producing data are accountable too",
          },
          {
            vi: "Đo thành công bằng thời gian trung bình phát hiện lỗi (không phải số kiểm tra đã thêm), vì mục tiêu thật là phát hiện sớm hơn",
            en: "Measure success by mean time to detect (not the number of checks added), since the real goal is catching issues sooner",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ đề xuất thêm kiểm tra thủ công định kỳ. 4-6: có kiểm tra tự động cơ bản. 7-8: thêm ưu tiên theo mức độ quan trọng và quy trình thông báo khi phát hiện lỗi. 9-10: thêm văn hoá trách nhiệm chung và chỉ số đo thời gian phát hiện.",
            en: "0-3: just proposes periodic manual checks. 4-6: has basic automated checks. 7-8: adds priority by importance and a notification process on discovery. 9-10: adds shared-responsibility culture and a mean-time-to-detect metric.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Xây dựng chương trình chất lượng dữ liệu tổ chức sau một sự cố thật — tầm Staff.",
        },
        requiresPractice: false,
      },
    ],
  },
};
