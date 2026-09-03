import "server-only";

import type { SpecialtyBank } from "./types";

/**
 * DevOps & Cloud — deployment, infrastructure, reliability, and operational
 * maturity.
 *
 * `id` matches the `devops-cloud` specialty in src/lib/domains.ts. Topic
 * selection drew general orientation from donnemartin/system-design-primer's
 * survey of caching, load balancing, and infrastructure concerns — see
 * ATTRIBUTION.md at the repo root for exactly what that means and doesn't
 * mean. Every prompt, rubric, and key point below is original authorship.
 *
 * Junior probes fundamentals (containers, secrets, the CI/CD split); mid
 * moves to concrete operational decisions (zero-downtime deploys, caching,
 * alerting); senior and staff lean on system- and organization-scale
 * reasoning, matching the pattern the other specialty banks use for those
 * tiers.
 */
export const devopsCloudBank: SpecialtyBank = {
  id: "devops-cloud",
  label: "DevOps & Cloud",
  questions: {
    junior: [
      {
        type: "open",
        question: {
          vi: "Một đồng nghiệp nói 'lỗi thì SSH vào server rồi restart app là được' mỗi khi có sự cố. Cách vận hành này có vấn đề gì, và bước đầu tiên để hướng tới một quy trình đáng tin cậy hơn là gì?",
          en: "A teammate says 'just SSH into the server and restart the app' whenever something breaks. What's wrong with this operational model, and what's the first step toward something more reliable?",
        },
        expectedKeyPoints: [
          {
            vi: "Sửa tay qua SSH không lặp lại được và không ai khác biết đã thay đổi những gì",
            en: "A manual SSH fix isn't reproducible, and nobody else knows what actually changed",
          },
          {
            vi: "Cấu hình giữa các server dần lệch nhau (configuration drift) vì mỗi lần sửa tay khác nhau",
            en: "Servers drift out of sync with each other over time, since each manual fix is a little different",
          },
          {
            vi: "Không có gì phát hiện sự cố trước khi khách hàng báo lỗi — thiếu giám sát chủ động",
            en: "Nothing detects the failure before a customer reports it — there's no proactive monitoring",
          },
          {
            vi: "Bước đầu tiên hợp lý: script hoá việc khởi động lại hoặc thêm giám sát/cảnh báo cơ bản, trước khi nghĩ tới tự động hoá toàn bộ",
            en: "A reasonable first step: script the restart or add basic monitoring/alerting, before jumping to full automation",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: không thấy vấn đề gì với cách làm hiện tại. 5-7: nêu được rủi ro của việc sửa tay. 8-10: nêu được rủi ro kèm bước cải thiện đầu tiên hợp lý, không nhảy thẳng tới giải pháp phức tạp.",
            en: "0-4: sees nothing wrong with the current approach. 5-7: names the risk of manual fixes. 8-10: names the risk and proposes a sensible first improvement, not a leap straight to a complex solution.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning:
            "Nhận diện vấn đề vận hành thủ công cơ bản, phù hợp Junior mới tiếp cận DevOps.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Đội của bạn đang lưu mật khẩu cơ sở dữ liệu trực tiếp trong một file cấu hình được commit vào Git. Bạn giải thích rủi ro này thế nào, và đề xuất cách lưu trữ thông tin nhạy cảm thay thế là gì?",
          en: "Your team stores a database password directly in a config file that's committed to Git. How do you explain the risk, and what do you propose instead for storing sensitive values?",
        },
        expectedKeyPoints: [
          {
            vi: "Mật khẩu trong Git tồn tại vĩnh viễn trong lịch sử, kể cả sau khi xoá khỏi commit mới nhất",
            en: "A password in Git lives forever in history, even after it's removed from the latest commit",
          },
          {
            vi: "Bất kỳ ai có quyền đọc repository — kể cả cộng tác viên cũ — đều thấy được thông tin nhạy cảm",
            en: "Anyone with read access to the repository — including former collaborators — can see the secret",
          },
          {
            vi: "Đề xuất dùng dịch vụ quản lý secret chuyên dụng (secrets manager) hoặc biến môi trường bơm vào lúc chạy, thay vì file cấu hình",
            en: "Propose a dedicated secrets manager or environment variables injected at runtime, instead of a config file",
          },
          {
            vi: "Nếu đã lộ, phải coi secret đó là không còn an toàn và xoay vòng (rotate) ngay, không chỉ xoá khỏi Git",
            en: "If already exposed, treat the secret as compromised and rotate it immediately — removing it from Git alone is not enough",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ nói xoá khỏi file cấu hình. 5-7: hiểu lịch sử Git giữ lại secret và đề xuất biến môi trường. 8-10: thêm đề xuất secrets manager và nhấn mạnh phải rotate secret đã lộ.",
            en: "0-4: just says remove it from the config file. 5-7: understands Git history retains it and proposes environment variables. 8-10: adds a secrets manager and stresses rotating the exposed secret.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning:
            "Quản lý thông tin nhạy cảm là kỹ năng nền tảng của DevOps, kể cả ở Junior.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Đội của bạn cần đóng gói một web service không lưu trạng thái (stateless) để triển khai. Bạn sẽ chọn đóng gói thành Docker container hay một máy ảo (VM) đầy đủ? Nêu sự khác biệt thực tế và lý do chọn.",
          en: "Your team needs to package a stateless web service for deployment. Do you package it as a Docker container or a full virtual machine? Explain the practical difference and your reasoning.",
        },
        expectedKeyPoints: [
          {
            vi: "Container chia sẻ kernel của hệ điều hành host, khởi động nhanh hơn và nhẹ hơn VM nhiều lần",
            en: "A container shares the host OS kernel, starting far faster and lighter than a VM",
          },
          {
            vi: "VM ảo hoá toàn bộ phần cứng, cô lập mạnh hơn nhưng tốn tài nguyên và thời gian khởi động hơn",
            en: "A VM virtualizes the full hardware stack, giving stronger isolation but costing more resources and startup time",
          },
          {
            vi: "Với service không trạng thái, chọn container vì cần khởi động nhanh, mở rộng theo chiều ngang dễ dàng",
            en: "For a stateless service, choose a container — fast startup and easy horizontal scaling matter more",
          },
          {
            vi: "VM vẫn hợp lý khi cần cô lập mạnh giữa các khách hàng hoặc chạy hệ điều hành khác với host",
            en: "A VM still makes sense when strong tenant isolation is required or a different OS than the host is needed",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: không phân biệt được container và VM. 5-7: nêu đúng khác biệt kỹ thuật cơ bản. 8-10: nêu đúng khác biệt, chọn container có lý do, và biết khi nào VM vẫn hợp lý.",
            en: "0-4: cannot distinguish containers from VMs. 5-7: states the basic technical difference. 8-10: states the difference, picks a container with reasoning, and knows when a VM still fits.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning:
            "Container vs VM là kiến thức nền tảng bắt buộc có ở Junior DevOps.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Vai trò chính của một bộ điều phối container (container orchestrator) như Kubernetes là gì?",
          en: "What is the primary role of a container orchestrator like Kubernetes?",
        },
        options: [
          {
            vi: "Lên lịch, khởi động lại và phân phối container qua nhiều máy chủ",
            en: "Scheduling, restarting, and distributing containers across multiple machines",
          },
          {
            vi: "Biên dịch mã nguồn ứng dụng",
            en: "Compiling application source code",
          },
          {
            vi: "Lưu trữ lâu dài toàn bộ secret của tổ chức",
            en: "Long-term storage for an organization's entire set of secrets",
          },
          {
            vi: "Thay thế hệ thống quản lý phiên bản mã nguồn",
            en: "Replacing source control version management",
          },
        ],
        correctOptionIndex: 0,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Kiến thức nền tảng về vai trò của container orchestration.",
        },
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Trong CI/CD, 'continuous deployment' khác 'continuous delivery' ở điểm nào?",
          en: "In CI/CD, how does 'continuous deployment' differ from 'continuous delivery'?",
        },
        options: [
          {
            vi: "Continuous deployment tự động đưa mỗi bản build đạt yêu cầu lên production, không cần phê duyệt thủ công",
            en: "Continuous deployment automatically ships every passing build to production, with no manual approval step",
          },
          {
            vi: "Continuous delivery nghĩa là mã nguồn không được kiểm thử",
            en: "Continuous delivery means the code is not tested",
          },
          {
            vi: "Continuous deployment chỉ áp dụng cho migration cơ sở dữ liệu",
            en: "Continuous deployment only applies to database migrations",
          },
          {
            vi: "Hai khái niệm này hoàn toàn giống nhau",
            en: "The two concepts are identical",
          },
        ],
        correctOptionIndex: 0,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Phân biệt thuật ngữ CI/CD cơ bản, thường gây nhầm lẫn ở Junior.",
        },
      },
    ],
    mid: [
      {
        type: "open",
        question: {
          vi: "Hiện tại đội của bạn triển khai bằng cách SSH vào từng máy trong 5 server rồi restart thủ công. Bạn muốn đạt được triển khai không downtime. Bạn tiếp cận thế nào, và rủi ro cụ thể của cách làm hiện tại là gì?",
          en: "Your team currently deploys by SSHing into each of 5 servers and manually restarting. You want zero-downtime deploys. What approach do you take, and what's the specific risk of the current approach?",
        },
        expectedKeyPoints: [
          {
            vi: "Rủi ro hiện tại: request đang xử lý giữa chừng khi restart sẽ lỗi, và mỗi server tạm thời chạy phiên bản khác nhau",
            en: "Current risk: in-flight requests fail during the restart, and servers briefly run different versions of each other",
          },
          {
            vi: "Triển khai cuốn chiếu (rolling deploy): thay từng máy một, chỉ đưa traffic vào máy mới sau khi health check qua",
            en: "Rolling deploy: replace one server at a time, only routing traffic to it after its health check passes",
          },
          {
            vi: "Hoặc blue-green: dựng môi trường mới song song, chuyển traffic sang khi đã sẵn sàng, giữ môi trường cũ để rollback nhanh",
            en: "Or blue-green: stand up a parallel environment, cut traffic over once ready, keep the old one for a fast rollback",
          },
          {
            vi: "Cần health check thật sự kiểm tra ứng dụng sẵn sàng, không chỉ kiểm tra tiến trình đang chạy",
            en: "The health check must verify the app is actually ready, not just that the process is running",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ đề xuất tự động hoá việc SSH restart. 5-7: đề xuất rolling deploy hoặc blue-green đúng hướng. 8-10: nêu rõ rủi ro hiện tại, chọn chiến lược phù hợp, và nhấn mạnh health check thật sự.",
            en: "0-4: just automates the SSH restart. 5-7: proposes rolling deploy or blue-green correctly. 8-10: states the current risk clearly, picks a fitting strategy, and stresses a real readiness health check.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Chuyển từ vận hành thủ công sang chiến lược triển khai không downtime — đúng tầm Mid-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Một trang có lượng truy cập cao đang chạy một truy vấn cơ sở dữ liệu chậm. Bạn cần thêm cache phía trước truy vấn này. Trình bày chiến lược cache, và cách xử lý khi dữ liệu gốc thay đổi.",
          en: "A high-traffic page runs a slow database query. You need to add caching in front of it. Walk through your caching strategy and how you handle invalidation when the underlying data changes.",
        },
        expectedKeyPoints: [
          {
            vi: "Mẫu cache-aside: ứng dụng đọc cache trước, nếu trống thì đọc database rồi ghi vào cache",
            en: "Cache-aside pattern: the app reads the cache first, and on a miss reads the database and populates the cache",
          },
          {
            vi: "Dùng TTL (thời gian sống) làm cơ chế hết hạn mặc định để chấp nhận độ trễ dữ liệu ở mức kiểm soát được",
            en: "Use a TTL as the default expiry mechanism, accepting a bounded amount of staleness",
          },
          {
            vi: "Với dữ liệu thay đổi thường xuyên, chủ động xoá (invalidate) cache ngay khi ghi thay vì chỉ chờ TTL hết hạn",
            en: "For frequently-changing data, actively invalidate the cache on write rather than waiting for the TTL alone",
          },
          {
            vi: "Nhận ra rủi ro cache stampede: khi một khoá nóng hết hạn, nhiều request cùng lúc đánh thẳng vào database",
            en: "Recognises the cache-stampede risk: when a hot key expires, many requests hit the database at once",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ nói 'thêm cache' không có chiến lược cụ thể. 5-7: có mẫu cache-aside và TTL. 7-8: thêm invalidate chủ động khi ghi. 9-10: thêm nhận diện rủi ro cache stampede.",
            en: "0-4: just says 'add caching' with no concrete strategy. 5-7: has cache-aside and a TTL. 7-8: adds active invalidation on write. 9-10: adds the cache-stampede risk.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Thiết kế cache thực tế với đánh đổi độ mới dữ liệu — kỹ năng cốt lõi tầm Mid-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Một sự cố production xảy ra lúc 2 giờ sáng và không ai biết cho tới khi khách hàng phàn nàn vào sáng hôm sau. Đội của bạn đang thiếu gì trong vận hành, và bạn ưu tiên bổ sung cái gì trước?",
          en: "A production incident happened at 2am, and nobody noticed until a customer complained the next morning. What's missing from the team's operational setup, and what do you prioritize adding first?",
        },
        expectedKeyPoints: [
          {
            vi: "Thiếu cảnh báo chủ động dựa trên chỉ số ảnh hưởng người dùng (tỷ lệ lỗi, độ trễ), không chỉ chỉ số hạ tầng",
            en: "Missing proactive alerting on user-impact metrics (error rate, latency), not just infrastructure metrics",
          },
          {
            vi: "Thiếu lịch trực (on-call rotation) để có người phản ứng ngoài giờ hành chính",
            en: "Missing an on-call rotation so someone can respond outside business hours",
          },
          {
            vi: "Cảnh báo chỉ nên bật khi thực sự ảnh hưởng người dùng, tránh cảnh báo giả gây mệt mỏi (alert fatigue)",
            en: "Alerts should fire only on genuine user impact, avoiding false alarms that cause alert fatigue",
          },
          {
            vi: "Ưu tiên bổ sung giám sát cho luồng có traffic hoặc doanh thu cao nhất trước, không cố phủ hết mọi thứ cùng lúc",
            en: "Prioritise monitoring the highest-traffic or highest-revenue path first, rather than trying to cover everything at once",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ nói cần thêm log. 5-7: đề xuất cảnh báo và lịch trực. 7-8: nhấn mạnh cảnh báo theo tác động người dùng, tránh alert fatigue. 9-10: thêm cách ưu tiên luồng quan trọng nhất trước.",
            en: "0-4: just says add more logging. 5-7: proposes alerting and on-call. 7-8: stresses user-impact-based alerts and alert fatigue. 9-10: adds prioritising the most critical path first.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Xây dựng năng lực vận hành cơ bản (giám sát, on-call) — đúng tầm Mid-level.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Trong chiến lược blue-green deployment, môi trường 'green' đóng vai trò gì?",
          en: "In a blue-green deployment strategy, what role does the 'green' environment play?",
        },
        options: [
          {
            vi: "Môi trường mới, song song với môi trường 'blue' đang phục vụ traffic, sẵn sàng nhận traffic khi được xác nhận ổn định",
            en: "The new environment, running alongside the 'blue' one currently serving traffic, ready to take over once confirmed stable",
          },
          {
            vi: "Môi trường chỉ dùng để chạy test đơn vị (unit test)",
            en: "An environment used only to run unit tests",
          },
          {
            vi: "Bản sao lưu (backup) dữ liệu định kỳ",
            en: "A periodic data backup",
          },
          {
            vi: "Môi trường luôn nhận 100% traffic đọc, không bao giờ nhận traffic ghi",
            en: "An environment that always receives 100% of read traffic and never write traffic",
          },
        ],
        correctOptionIndex: 0,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "Thuật ngữ triển khai phổ biến, cần hiểu đúng ở Mid-level.",
        },
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Infrastructure as Code (IaC) giải quyết chủ yếu vấn đề gì?",
          en: "What problem does Infrastructure as Code (IaC) primarily solve?",
        },
        options: [
          {
            vi: "Hạ tầng được khai báo dưới dạng file có thể review, tái tạo và kiểm soát phiên bản, thay vì cấu hình tay qua giao diện",
            en: "Infrastructure is declared as reviewable, reproducible, version-controlled files, instead of manual configuration through a UI",
          },
          {
            vi: "Tăng tốc độ chạy của ứng dụng",
            en: "Making the application run faster",
          },
          {
            vi: "Thay thế hoàn toàn nhu cầu giám sát hệ thống",
            en: "Eliminating the need for system monitoring entirely",
          },
          {
            vi: "Tự động viết test cho ứng dụng",
            en: "Automatically writing tests for the application",
          },
        ],
        correctOptionIndex: 0,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "Hiểu đúng giá trị cốt lõi của IaC, không chỉ là 'dùng script'.",
        },
      },
    ],
    senior: [
      {
        type: "open",
        question: {
          vi: "Sản phẩm của bạn có cam kết độ trễ (SLA) nghiêm ngặt với người dùng ở cả hai bờ đại dương. Bạn thiết kế triển khai đa vùng (multi-region) thế nào, và xử lý failover khi một vùng gặp sự cố ra sao?",
          en: "Your product has a strict latency SLA for users on both sides of an ocean. How do you design a multi-region deployment, and how do you handle failover when one region goes down?",
        },
        expectedKeyPoints: [
          {
            vi: "Định tuyến người dùng tới vùng gần nhất bằng DNS theo địa lý hoặc anycast để giảm độ trễ mạng",
            en: "Route users to the nearest region via geo-DNS or anycast to cut network latency",
          },
          {
            vi: "Quyết định dữ liệu đồng bộ giữa các vùng thế nào: chấp nhận nhất quán cuối, hay chấp nhận độ trễ ghi để giữ nhất quán mạnh",
            en: "Decide how data syncs across regions: accept eventual consistency, or accept write latency to keep strong consistency",
          },
          {
            vi: "Failover cần phát hiện sự cố tự động (health check liên vùng) và chuyển traffic mà không cần can thiệp thủ công",
            en: "Failover needs automatic failure detection (cross-region health checks) and traffic shift without manual intervention",
          },
          {
            vi: "Kiểm thử failover định kỳ (chaos engineering hoặc game day), vì một cơ chế chưa từng được thử thì không đáng tin",
            en: "Test failover regularly (chaos engineering or a game day) — an untested mechanism can't be trusted",
          },
          {
            vi: "Cân nhắc chi phí: chạy đủ dung lượng dự phòng ở vùng thứ hai để hấp thụ toàn bộ traffic khi failover",
            en: "Weigh the cost: the standby region needs enough spare capacity to absorb full traffic during failover",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ nói dựng thêm server ở vùng khác. 4-6: có định tuyến theo địa lý và xử lý dữ liệu cơ bản. 7-8: thêm failover tự động. 9-10: thêm kiểm thử failover định kỳ và phân tích chi phí dung lượng dự phòng.",
            en: "0-3: just adds servers in another region. 4-6: has geo-routing and basic data handling. 7-8: adds automatic failover. 9-10: adds regular failover testing and standby-capacity cost analysis.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Thiết kế hệ thống đa vùng với ràng buộc SLA thực tế — đúng tầm Senior.",
        },
        requiresPractice: true,
      },
      {
        type: "open",
        question: {
          vi: "Dịch vụ của bạn có traffic tăng gấp 10 lần vào giờ cao điểm mỗi ngày rồi giảm mạnh. Bạn thiết kế chính sách autoscaling thế nào, và xử lý vấn đề cold-start khi scale lên nhanh ra sao?",
          en: "Your service sees 10x traffic during a daily peak, then drops sharply. How do you design an autoscaling policy, and how do you handle the cold-start problem when scaling up quickly?",
        },
        expectedKeyPoints: [
          {
            vi: "Autoscale theo chỉ số phản ánh tải thực tế (độ trễ request, độ dài hàng đợi) thay vì chỉ CPU, vì CPU thấp không có nghĩa là còn dư sức",
            en: "Scale on metrics that reflect real load (request latency, queue depth) rather than CPU alone, since low CPU doesn't mean spare capacity",
          },
          {
            vi: "Đặt ngưỡng scale-up nhanh nhưng scale-down chậm hơn, tránh dao động liên tục (flapping)",
            en: "Scale up on a fast threshold but scale down more slowly, avoiding constant flapping",
          },
          {
            vi: "Cold-start: máy mới cần thời gian khởi động, nạp cache, kết nối database — nên scale trước khi tải thực sự tới đỉnh, dựa vào mẫu traffic đã biết",
            en: "Cold-start: new instances need time to boot, warm caches, and connect to the database — scale ahead of the actual peak, using known traffic patterns",
          },
          {
            vi: "Cân nhắc giữ một mức capacity nền tối thiểu (warm pool) thay vì scale từ 0 mỗi ngày",
            en: "Consider keeping a minimum warm baseline capacity rather than scaling from zero every day",
          },
          {
            vi: "Đảm bảo phần phụ thuộc (database, cache) cũng chịu được tải gấp 10 lần, không chỉ tầng ứng dụng",
            en: "Ensure downstream dependencies (database, cache) can also absorb the 10x load, not just the application tier",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ đề xuất scale theo CPU. 4-6: có chỉ số scale hợp lý hơn và ngưỡng lên/xuống khác nhau. 7-8: xử lý được cold-start bằng dự đoán trước tải. 9-10: thêm warm pool và kiểm tra phần phụ thuộc chịu tải.",
            en: "0-3: only proposes CPU-based scaling. 4-6: has better metrics and asymmetric thresholds. 7-8: handles cold-start with predictive scaling. 9-10: adds a warm pool and checks downstream capacity.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Thiết kế autoscaling thực tế với ràng buộc cold-start — bài toán tầm Senior.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Công ty bạn chuyển từ một team duy nhất triển khai lên nhiều team cùng phát hành độc lập trên chung một hạ tầng. Bạn thiết kế pipeline CI/CD thế nào để các team không giẫm chân nhau?",
          en: "Your company is moving from one team deploying to many teams releasing independently on shared infrastructure. How do you design the CI/CD pipeline so teams don't collide?",
        },
        expectedKeyPoints: [
          {
            vi: "Mỗi team cần pipeline và môi trường triển khai độc lập, không phụ thuộc vào lịch phát hành của team khác",
            en: "Each team needs an independent pipeline and deploy environment, not tied to another team's release schedule",
          },
          {
            vi: "Dùng feature flag để tách việc merge code khỏi việc bật tính năng cho người dùng, giảm rủi ro khi nhiều team cùng thay đổi",
            en: "Use feature flags to decouple merging code from exposing it to users, reducing risk when multiple teams change things at once",
          },
          {
            vi: "Chuẩn hoá quy trình promote qua các môi trường (dev → staging → production) dùng chung, nhưng để mỗi team tự quyết định khi nào promote",
            en: "Standardise the promotion path across environments (dev → staging → production), but let each team decide when to promote",
          },
          {
            vi: "Cần ranh giới rõ ràng về quyền sở hữu hạ tầng dùng chung, tránh một team vô tình phá cấu hình của team khác",
            en: "Draw clear ownership boundaries on shared infrastructure, so one team can't accidentally break another's configuration",
          },
          {
            vi: "Giám sát và cảnh báo phải gắn với từng team/service để biết lỗi thuộc về ai, không phải một hàng đợi chung",
            en: "Monitoring and alerts must be scoped per team/service so it's clear who owns a failure, not one shared queue",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ nói dùng chung một pipeline cho tất cả team. 4-6: có pipeline riêng cho mỗi team. 7-8: thêm feature flag và quy trình promote chuẩn hoá. 9-10: thêm ranh giới quyền sở hữu hạ tầng và giám sát theo team.",
            en: "0-3: just uses one shared pipeline for every team. 4-6: gives each team its own pipeline. 7-8: adds feature flags and a standardised promotion process. 9-10: adds infrastructure ownership boundaries and per-team monitoring.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Thiết kế CI/CD cho nhiều team triển khai độc lập — bài toán tổ chức kỹ thuật tầm Senior.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Vai trò chính của một service mesh sidecar proxy (ví dụ Envoy) trong kiến trúc microservice là gì?",
          en: "What is the primary role of a service mesh sidecar proxy (e.g. Envoy) in a microservice architecture?",
        },
        options: [
          {
            vi: "Xử lý định tuyến, retry, mã hoá và quan sát giao tiếp giữa các service mà không cần sửa code ứng dụng",
            en: "Handling routing, retries, encryption, and observability for inter-service traffic without changing application code",
          },
          {
            vi: "Thay thế hoàn toàn cơ sở dữ liệu chính",
            en: "Fully replacing the primary database",
          },
          {
            vi: "Biên dịch mã nguồn của mỗi service",
            en: "Compiling each service's source code",
          },
          {
            vi: "Lưu trữ log lâu dài duy nhất của hệ thống",
            en: "Serving as the system's sole long-term log store",
          },
        ],
        correctOptionIndex: 0,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Kiến thức service mesh, thường gặp trong hệ thống microservice ở tầm Senior.",
        },
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Chiến lược triển khai nào đưa một phần nhỏ traffic thật sang phiên bản mới trước khi phát hành toàn bộ?",
          en: "Which deployment strategy routes a small percentage of real traffic to a new version before a full rollout?",
        },
        options: [
          { vi: "Big-bang deployment", en: "Big-bang deployment" },
          { vi: "Canary release", en: "Canary release" },
          { vi: "Cold standby", en: "Cold standby" },
          { vi: "Shadow database", en: "Shadow database" },
        ],
        correctOptionIndex: 1,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Phân biệt các chiến lược triển khai giảm rủi ro — kiến thức tầm Senior.",
        },
      },
    ],
    staff: [
      {
        type: "open",
        question: {
          vi: "Công ty có mười lăm team, mỗi team tự dựng CI/CD, giám sát và quản lý secret theo cách riêng. Bạn được giao xây dựng một 'paved road' (nền tảng hạ tầng dùng chung) để giảm trùng lặp mà không ép buộc. Bạn bắt đầu từ đâu?",
          en: "The company has fifteen teams, each building its own CI/CD, monitoring, and secrets management. You're asked to build a 'paved road' (a shared internal platform) to cut duplication without mandating it. Where do you start?",
        },
        expectedKeyPoints: [
          {
            vi: "Khảo sát trước để biết team nào đang chịu chi phí lớn nhất từ việc tự xây, ưu tiên giải quyết nỗi đau thật thay vì đoán",
            en: "Survey first to find which teams pay the highest cost from building it themselves — solve a real pain, not a guess",
          },
          {
            vi: "Nền tảng phải dễ dùng hơn tự xây thì mới được áp dụng thật, không thể chỉ dựa vào chỉ thị từ trên xuống",
            en: "The platform has to be easier than building it yourself to actually get adopted — a top-down mandate alone won't work",
          },
          {
            vi: "Làm mẫu ở một team thí điểm trước, lấy kết quả thật để thuyết phục các team còn lại",
            en: "Pilot with one team first and use the real result to persuade the rest",
          },
          {
            vi: "Giữ khả năng mở rộng/tuỳ biến cho từng team, vì ép một khuôn cứng cho mọi trường hợp sẽ khiến team tự rẽ nhánh (fork) ra ngoài",
            en: "Keep it extensible per team — forcing one rigid shape onto every case pushes teams to fork away from it",
          },
          {
            vi: "Đo mức độ áp dụng bằng số liệu thật, sẵn sàng bỏ phần nào của nền tảng không tạo ra khác biệt",
            en: "Measure adoption with real numbers, and be willing to drop parts of the platform that don't make a difference",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ nói xây một nền tảng chung rồi bắt buộc dùng. 4-6: có khảo sát và thí điểm. 7-8: thêm khả năng mở rộng/tuỳ biến. 9-10: thêm đo lường áp dụng và sẵn sàng loại bỏ phần không hiệu quả.",
            en: "0-3: just builds a shared platform and mandates it. 4-6: surveys and pilots first. 7-8: adds extensibility per team. 9-10: adds adoption metrics and willingness to drop what doesn't work.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Xây dựng nền tảng nội bộ dùng chung nhiều team mà không có thẩm quyền ép buộc — tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Ban lãnh đạo hỏi liệu công ty có nên đầu tư vào hạ tầng đa vùng (multi-region) dự phòng hay không, sau khi một sự cố mất cả một khu vực khiến dịch vụ ngừng hoạt động sáu giờ. Bạn phân tích quyết định này thế nào?",
          en: "Leadership asks whether the company should invest in a multi-region failover setup, after an outage that took down an entire region for six hours. How do you frame this decision?",
        },
        expectedKeyPoints: [
          {
            vi: "Quy đổi thời gian ngừng hoạt động thành chi phí thực tế (doanh thu mất, hợp đồng SLA vi phạm) để so sánh với chi phí đầu tư đa vùng",
            en: "Convert downtime into a real cost (lost revenue, breached SLA contracts) to compare against the cost of a multi-region build",
          },
          {
            vi: "Đa vùng đầy đủ tốn kém và phức tạp vận hành lâu dài, không phải quyết định chỉ làm một lần",
            en: "Full multi-region is expensive and adds lasting operational complexity — it's not a one-time decision",
          },
          {
            vi: "Cân nhắc phương án trung gian: sao lưu dữ liệu đa vùng nhưng chỉ phục vụ đọc, hoặc phục hồi thảm hoạ (DR) thủ công có kiểm soát thay vì failover tự động toàn phần",
            en: "Consider a middle option: multi-region backups with read-only failover, or a controlled manual DR process instead of full automatic failover",
          },
          {
            vi: "Quyết định nên dựa trên mức độ chấp nhận rủi ro của sản phẩm cụ thể — không phải mọi dịch vụ đều cần độ sẵn sàng như nhau",
            en: "The decision should hinge on this specific product's risk tolerance — not every service needs the same availability bar",
          },
          {
            vi: "Nếu đầu tư, cần kiểm thử failover định kỳ, vì năng lực chưa từng thử là năng lực không thể tin tưởng khi cần",
            en: "If investing, test failover regularly — untested capability can't be relied on when it's actually needed",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: đề xuất xây đa vùng ngay vì sự cố vừa xảy ra. 4-6: có quy đổi chi phí downtime. 7-8: cân nhắc phương án trung gian phù hợp mức rủi ro. 9-10: thêm yêu cầu kiểm thử failover định kỳ nếu quyết định đầu tư.",
            en: "0-3: proposes building multi-region immediately because of the recent outage. 4-6: converts downtime to cost. 7-8: weighs a middle option matched to risk tolerance. 9-10: adds a requirement to test failover regularly if the investment goes ahead.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Quyết định đầu tư hạ tầng lớn dựa trên phân tích rủi ro và chi phí — tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Bạn cần chuẩn hoá CI/CD cho mười lăm team đang dùng năm ngôn ngữ và ba nền tảng cloud khác nhau, mà không làm chậm tốc độ ra tính năng của bất kỳ team nào. Bạn tiếp cận thế nào?",
          en: "You need to standardise CI/CD for fifteen teams using five languages and three cloud platforms, without slowing down any team's feature velocity. How do you approach it?",
        },
        expectedKeyPoints: [
          {
            vi: "Chuẩn hoá phần giao diện/hợp đồng của pipeline (các bước, tiêu chí pass/fail), không ép buộc công cụ cụ thể bên trong mỗi bước",
            en: "Standardise the pipeline's interface/contract (the stages, the pass/fail criteria), not the specific tooling inside each stage",
          },
          {
            vi: "Cho phép mỗi team tự triển khai chi tiết theo ngôn ngữ/nền tảng của họ, miễn là tuân thủ hợp đồng chung",
            en: "Let each team implement the details for their own language/platform, as long as they honour the shared contract",
          },
          {
            vi: "Di trú tăng dần theo từng team thí điểm, không ép chuyển đổi hàng loạt cùng lúc",
            en: "Migrate incrementally through pilot teams, not a forced bulk cutover",
          },
          {
            vi: "Đầu tư công cụ/mẫu dùng chung để tuân thủ chuẩn dễ hơn là không tuân thủ",
            en: "Invest in shared tooling/templates so following the standard is easier than not",
          },
          {
            vi: "Đo tốc độ ra tính năng của các team trong quá trình di trú để phát hiện sớm nếu chuẩn hoá đang làm chậm ai đó",
            en: "Track feature velocity across teams during the migration to catch early if the standard is slowing anyone down",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: ép một công cụ CI/CD duy nhất cho tất cả team. 4-6: chuẩn hoá hợp đồng thay vì công cụ cụ thể. 7-8: thêm di trú tăng dần và công cụ hỗ trợ tuân thủ. 9-10: thêm đo lường tốc độ ra tính năng trong quá trình chuyển đổi.",
            en: "0-3: forces one CI/CD tool onto every team. 4-6: standardises the contract rather than the specific tooling. 7-8: adds incremental migration and compliance tooling. 9-10: adds tracking feature velocity during the transition.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Chuẩn hoá quy trình xuyên nhiều team với ràng buộc kỹ thuật đa dạng — tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Bộ phận bảo mật yêu cầu mọi team phải thêm quét lỗ hổng bảo mật (security scanning) bắt buộc vào pipeline trong quý này. Một số team lo ngại điều này sẽ chặn việc release của họ. Bạn triển khai yêu cầu này thế nào?",
          en: "Security requires every team to add mandatory vulnerability scanning to their pipeline this quarter. Some teams worry it will block their releases. How do you roll this out?",
        },
        expectedKeyPoints: [
          {
            vi: "Trước hết chạy quét ở chế độ chỉ cảnh báo (không chặn) để đo mức độ ảnh hưởng thật trước khi bắt buộc",
            en: "Run scanning in warn-only mode first to measure real impact before making it a hard gate",
          },
          {
            vi: "Phân loại lỗ hổng theo mức độ nghiêm trọng — chỉ chặn release với lỗ hổng nghiêm trọng, không chặn vì lỗi mức thấp",
            en: "Classify vulnerabilities by severity — block releases only for critical findings, not low-severity noise",
          },
          {
            vi: "Cho team thời gian và hỗ trợ để xử lý các lỗ hổng tồn đọng trước khi chuyển sang chế độ chặn cứng",
            en: "Give teams time and support to clear the existing backlog before switching to a hard gate",
          },
          {
            vi: "Cung cấp đường dẫn ngoại lệ có kiểm soát (ví dụ chấp nhận rủi ro tạm thời có thời hạn) cho trường hợp cần release gấp",
            en: "Provide a controlled exception path (a time-boxed accepted-risk waiver) for genuinely urgent releases",
          },
          {
            vi: "Đo tỷ lệ lỗ hổng nghiêm trọng giảm theo thời gian để chứng minh chương trình có hiệu quả, không chỉ là rào cản",
            en: "Track the critical-vulnerability rate over time to show the programme works, not just that it's a gate",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: bật chế độ chặn cứng ngay cho tất cả team. 4-6: có phân loại mức độ nghiêm trọng. 7-8: thêm giai đoạn cảnh báo trước và thời gian xử lý nợ tồn đọng. 9-10: thêm đường dẫn ngoại lệ có kiểm soát và đo hiệu quả chương trình.",
            en: "0-3: enables a hard gate for everyone immediately. 4-6: classifies by severity. 7-8: adds a warn-first phase and time to clear backlog. 9-10: adds a controlled exception path and tracks programme effectiveness.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Cân bằng giữa yêu cầu bảo mật tổ chức và tốc độ ra tính năng của nhiều team — tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Công ty đang cân nhắc chuyển từ một nhà cung cấp cloud duy nhất sang chiến lược đa cloud (multi-cloud) để tránh phụ thuộc một nhà cung cấp. Bạn đánh giá đề xuất này thế nào?",
          en: "The company is weighing a move from a single cloud provider to a multi-cloud strategy to avoid vendor lock-in. How do you evaluate this proposal?",
        },
        expectedKeyPoints: [
          {
            vi: "Đa cloud thật sự (chạy song song trên nhiều nhà cung cấp) tốn chi phí vận hành và kỹ năng đội ngũ lớn hơn nhiều so với vẻ ngoài",
            en: "True multi-cloud (running in parallel across providers) costs far more in operations and team skill than it looks",
          },
          {
            vi: "Phần lớn lợi ích tránh khoá nhà cung cấp có thể đạt được bằng cách tránh dùng dịch vụ độc quyền sâu, mà không cần multi-cloud thật sự",
            en: "Most of the lock-in-avoidance benefit comes from avoiding deep proprietary services, without needing true multi-cloud at all",
          },
          {
            vi: "Cân nhắc rủi ro thực sự đang giải quyết: chi phí, tuân thủ pháp lý theo khu vực, hay chịu lỗi nhà cung cấp — mỗi lý do dẫn tới giải pháp khác nhau",
            en: "Consider the real risk being solved — cost, regional compliance, or provider outage tolerance — each points to a different solution",
          },
          {
            vi: "Đề xuất lớp trừu tượng ở ranh giới (ví dụ container, IaC chuẩn hoá) để có thể chuyển đổi sau này mà không phải viết lại toàn bộ",
            en: "Propose a boundary abstraction (containers, standardised IaC) so a future switch doesn't mean rewriting everything",
          },
          {
            vi: "Ghi nhận quyết định dạng ADR với điều kiện xem xét lại, thay vì cam kết multi-cloud vĩnh viễn ngay từ đầu",
            en: "Record the decision as an ADR with revisit conditions, rather than committing to permanent multi-cloud upfront",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: đồng ý chuyển sang multi-cloud ngay vì tránh khoá nhà cung cấp nghe hợp lý. 4-6: nhận ra chi phí vận hành thực sự. 7-8: phân tích đúng rủi ro cụ thể cần giải quyết. 9-10: thêm lớp trừu tượng ranh giới và ghi nhận quyết định có điều kiện xem xét lại.",
            en: "0-3: agrees to move to multi-cloud immediately because avoiding lock-in sounds reasonable. 4-6: recognises the real operational cost. 7-8: correctly analyses the specific risk being solved. 9-10: adds a boundary abstraction and records the decision with revisit conditions.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Đánh giá một quyết định chiến lược hạ tầng tốn kém dựa trên rủi ro thực tế, không theo xu hướng — tầm Staff.",
        },
        requiresPractice: false,
      },
    ],
  },
};
