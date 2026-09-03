import "server-only";

import type { SpecialtyBank } from "./types";

/**
 * QA & Testing.
 *
 * `id` matches the `qa-testing` specialty in src/lib/domains.ts, which marks
 * it difficulty 1 — the easiest entry point in the tech domain. The junior
 * tier reflects that, while senior and staff deliberately do not: a low
 * barrier to entry is not the same as a low ceiling, and a bank that topped
 * out at "what is a unit test" would be useless to anyone past their first
 * year.
 */
export const qaTestingBank: SpecialtyBank = {
  id: "qa-testing",
  label: "QA & Testing",
  questions: {
    junior: [
      {
        type: "open",
        question: {
          vi: "Phân biệt unit test, integration test và end-to-end test. Với một tính năng đăng nhập, mỗi loại sẽ kiểm tra điều gì?",
          en: "Distinguish unit, integration, and end-to-end tests. For a login feature, what would each one check?",
        },
        expectedKeyPoints: [
          {
            vi: "Unit test kiểm tra một đơn vị code độc lập, các phụ thuộc được thay bằng test double",
            en: "A unit test checks one isolated unit, with dependencies replaced by test doubles",
          },
          {
            vi: "Integration test kiểm tra nhiều thành phần làm việc cùng nhau, ví dụ API và database",
            en: "An integration test checks components working together, e.g. API and database",
          },
          {
            vi: "End-to-end test chạy qua giao diện thật như người dùng, từ nhập form tới thấy trang chủ",
            en: "An end-to-end test drives the real UI as a user would, from form entry to landing on the home page",
          },
          {
            vi: "Càng lên cao càng chậm và dễ vỡ (flaky) hơn, nên số lượng thường giảm dần",
            en: "Higher levels are slower and flakier, so their count usually decreases",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: nhầm lẫn giữa các loại. 5-7: phân biệt đúng ba loại. 8-10: phân biệt đúng, có ví dụ cụ thể cho tính năng đăng nhập, và nêu được đánh đổi tốc độ/độ ổn định.",
            en: "0-4: confuses the levels. 5-7: distinguishes all three. 8-10: distinguishes them with concrete login examples and names the speed/stability trade-off.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Kiến thức phân tầng kiểm thử nền tảng, bắt buộc có ở Junior QA.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Bạn được giao kiểm thử một ô nhập số lượng sản phẩm trong giỏ hàng. Hãy liệt kê các trường hợp kiểm thử bạn sẽ viết và giải thích cách bạn chọn ra chúng.",
          en: "You are asked to test a quantity input in a shopping cart. List the test cases you would write and explain how you chose them.",
        },
        expectedKeyPoints: [
          {
            vi: "Phân vùng tương đương: số hợp lệ, số âm, số không, số vượt tồn kho",
            en: "Equivalence partitioning: valid numbers, negatives, zero, above available stock",
          },
          {
            vi: "Phân tích giá trị biên: 0, 1, giá trị tối đa, giá trị tối đa cộng một",
            en: "Boundary value analysis: 0, 1, the maximum, and the maximum plus one",
          },
          {
            vi: "Đầu vào không phải số: chữ, ký tự đặc biệt, khoảng trắng, chuỗi rỗng",
            en: "Non-numeric input: letters, special characters, whitespace, empty string",
          },
          {
            vi: "Trường hợp giao diện: dán (paste) giá trị, nhập số thập phân, số rất lớn",
            en: "UI cases: pasting a value, entering a decimal, entering a very large number",
          },
          {
            vi: "Giải thích được vì sao chọn các trường hợp đó thay vì liệt kê ngẫu nhiên",
            en: "Explains why those cases were chosen rather than listing them at random",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: liệt kê ngẫu nhiên vài trường hợp. 5-7: có phân vùng tương đương hoặc giá trị biên. 8-10: dùng cả hai kỹ thuật và giải thích được lý do chọn.",
            en: "0-4: lists a few random cases. 5-7: uses partitioning or boundary analysis. 8-10: uses both techniques and justifies the selection.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning:
            "Đánh giá kỹ thuật thiết kế test case cơ bản — năng lực cốt lõi của QA.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Một bug report tốt cần có những gì? Vì sao 'chức năng tìm kiếm bị lỗi' là một report kém, và bạn sẽ viết lại nó thế nào?",
          en: "What does a good bug report contain? Why is 'search is broken' a poor report, and how would you rewrite it?",
        },
        expectedKeyPoints: [
          {
            vi: "Các bước tái hiện cụ thể, đánh số, để người khác làm theo được",
            en: "Concrete numbered reproduction steps someone else can follow",
          },
          {
            vi: "Kết quả mong đợi và kết quả thực tế, tách bạch rõ ràng",
            en: "Expected result and actual result, stated separately",
          },
          {
            vi: "Môi trường: trình duyệt, phiên bản, tài khoản, dữ liệu dùng để test",
            en: "Environment: browser, version, account, and the test data used",
          },
          {
            vi: "Bằng chứng: ảnh chụp màn hình, video, hoặc log lỗi",
            en: "Evidence: screenshot, video, or error log",
          },
          {
            vi: "Mức độ nghiêm trọng và mức độ ưu tiên là hai thứ khác nhau",
            en: "Severity and priority are two different things",
          },
          {
            vi: "Report kém vì không tái hiện được, buộc lập trình viên phải đoán",
            en: "The report is poor because it is not reproducible, forcing the developer to guess",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ nói cần mô tả rõ hơn. 5-7: nêu được các bước tái hiện và kết quả mong đợi/thực tế. 8-10: đầy đủ cả môi trường, bằng chứng, và phân biệt severity với priority.",
            en: "0-4: just says be more descriptive. 5-7: gives repro steps and expected/actual results. 8-10: adds environment, evidence, and separates severity from priority.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning:
            "Kỹ năng giao tiếp nền tảng của QA, ảnh hưởng trực tiếp tới tốc độ sửa lỗi.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Trong kim tự tháp kiểm thử (test pyramid), loại test nào nên chiếm số lượng nhiều nhất?",
          en: "In the test pyramid, which kind of test should be the most numerous?",
        },
        options: [
          { vi: "End-to-end test", en: "End-to-end test" },
          { vi: "Integration test", en: "Integration test" },
          { vi: "Unit test", en: "Unit test" },
          {
            vi: "Manual exploratory test",
            en: "Manual exploratory test",
          },
        ],
        correctOptionIndex: 2,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Hiểu đúng kim tự tháp kiểm thử là nền tảng để phân bổ công sức test.",
        },
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Thuật ngữ nào mô tả một test đôi khi pass đôi khi fail dù code và dữ liệu không thay đổi?",
          en: "Which term describes a test that sometimes passes and sometimes fails even though code and data are unchanged?",
        },
        options: [
          { vi: "Regression test", en: "Regression test" },
          { vi: "Flaky test", en: "Flaky test" },
          { vi: "Smoke test", en: "Smoke test" },
          { vi: "Characterization test", en: "Characterization test" },
        ],
        correctOptionIndex: 1,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Thuật ngữ cơ bản, xuất hiện hằng ngày trong công việc QA tự động.",
        },
      },
    ],
    mid: [
      {
        type: "open",
        question: {
          vi: "Bộ end-to-end test của team có 12% số lần chạy thất bại ngẫu nhiên, và mọi người đã quen với việc bấm 'chạy lại'. Bạn xử lý tình trạng này thế nào?",
          en: "Your team's end-to-end suite fails randomly on 12% of runs, and everyone has got used to hitting 'retry'. How do you address this?",
        },
        expectedKeyPoints: [
          {
            vi: "Nguy hiểm lớn nhất là mất niềm tin: khi test đỏ không còn nghĩa là có lỗi, test thật sẽ bị bỏ qua",
            en: "The real danger is lost trust: once red no longer means broken, genuine failures get ignored",
          },
          {
            vi: "Đo và phân loại trước: test nào flaky, tần suất bao nhiêu, lỗi thuộc nhóm nguyên nhân nào",
            en: "Measure and classify first: which tests, how often, and which cause category",
          },
          {
            vi: "Nguyên nhân phổ biến: chờ theo thời gian cố định thay vì chờ theo điều kiện, dữ liệu test dùng chung, thứ tự chạy phụ thuộc nhau",
            en: "Common causes: fixed sleeps instead of condition waits, shared test data, order-dependent tests",
          },
          {
            vi: "Cách ly test flaky ra khỏi luồng chặn merge trong khi sửa, nhưng phải có thời hạn để không bị quên",
            en: "Quarantine flaky tests out of the merge-blocking path while fixing, with a deadline so they are not forgotten",
          },
          {
            vi: "Mỗi test phải tự dựng và tự dọn dữ liệu của mình để chạy song song an toàn",
            en: "Each test must set up and tear down its own data so parallel runs are safe",
          },
          {
            vi: "Theo dõi tỷ lệ flaky như một chỉ số có chủ sở hữu, không phải việc ai rảnh thì làm",
            en: "Track the flake rate as an owned metric, not as whoever-has-time work",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: đề xuất tự động chạy lại nhiều lần. 4-6: nhận ra tác hại và một vài nguyên nhân. 7-8: có quy trình phân loại và sửa theo nguyên nhân gốc. 9-10: thêm cơ chế cách ly có thời hạn và theo dõi tỷ lệ flaky như một chỉ số.",
            en: "0-3: proposes automatic reruns. 4-6: sees the harm and some causes. 7-8: has a classification process and root-cause fixes. 9-10: adds time-boxed quarantine and flake-rate tracking as a metric.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Vấn đề kinh điển của kiểm thử tự động ở quy mô thật — đúng tầm Mid-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Bạn cần test một service phụ thuộc vào API thanh toán bên thứ ba. Bạn chọn dùng mock, stub, hay gọi thật vào môi trường sandbox? Phân tích đánh đổi cho từng lựa chọn.",
          en: "You need to test a service that depends on a third-party payment API. Do you use mocks, stubs, or real sandbox calls? Analyse the trade-offs of each.",
        },
        expectedKeyPoints: [
          {
            vi: "Mock/stub cho tốc độ và tính tất định, nhưng có nguy cơ mock không còn giống API thật",
            en: "Mocks and stubs give speed and determinism, but risk drifting from the real API",
          },
          {
            vi: "Gọi sandbox thật bắt được thay đổi phía nhà cung cấp nhưng chậm và phụ thuộc dịch vụ bên ngoài",
            en: "Real sandbox calls catch provider changes but are slow and depend on an external service",
          },
          {
            vi: "Contract test là giải pháp trung gian: xác nhận giả định của mình về API vẫn đúng",
            en: "Contract tests are the middle ground: they verify your assumptions about the API still hold",
          },
          {
            vi: "Phân tầng: unit test dùng mock, một số ít test định kỳ chạy thật để phát hiện drift",
            en: "Layer it: mocks for unit tests, a few scheduled real runs to detect drift",
          },
          {
            vi: "Không bao giờ để test tự động tạo giao dịch thật với tiền thật",
            en: "Never let automated tests create real transactions with real money",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chọn một cách duy nhất không phân tích. 4-6: nêu đúng ưu nhược điểm của mock và gọi thật. 7-8: đề xuất phân tầng hợp lý. 9-10: nhắc tới contract test hoặc cơ chế phát hiện mock bị lệch so với API thật.",
            en: "0-3: picks one approach with no analysis. 4-6: states the pros and cons of mocking versus real calls. 7-8: proposes a sensible layering. 9-10: mentions contract tests or a drift-detection mechanism.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Đánh đổi test double là quyết định thường gặp và dễ làm sai.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Team chạy CI mất 45 phút mỗi lần và lập trình viên bắt đầu gộp nhiều thay đổi vào một PR để đỡ phải chờ. Bạn cải thiện thế nào?",
          en: "CI takes 45 minutes per run and developers have started batching changes into one PR to avoid waiting. How do you improve it?",
        },
        expectedKeyPoints: [
          {
            vi: "Nhận ra hệ quả thật: PR to hơn nghĩa là review kém hơn và lỗi khó khoanh vùng hơn",
            en: "Names the real consequence: bigger PRs mean worse review and harder fault isolation",
          },
          {
            vi: "Đo trước xem thời gian nằm ở đâu: cài đặt phụ thuộc, build, hay chạy test",
            en: "Measure where the time goes first: dependency install, build, or test execution",
          },
          {
            vi: "Chạy song song và phân mảnh (shard) bộ test trên nhiều máy",
            en: "Parallelise and shard the suite across machines",
          },
          {
            vi: "Cache phụ thuộc và kết quả build giữa các lần chạy",
            en: "Cache dependencies and build output between runs",
          },
          {
            vi: "Phân tầng CI: bộ test nhanh chặn merge, bộ test chậm chạy định kỳ hoặc trước khi release",
            en: "Tier the pipeline: a fast suite blocks merge, a slow one runs periodically or pre-release",
          },
          {
            vi: "Chọn lọc test theo phần code thay đổi khi hệ thống đủ lớn",
            en: "Select tests based on what changed once the system is large enough",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ đề xuất bớt test đi. 4-6: có song song hoá hoặc cache. 7-8: đo trước rồi tối ưu đúng chỗ. 9-10: thêm phân tầng CI và nhận ra hệ quả tổ chức của việc CI chậm.",
            en: "0-3: just proposes fewer tests. 4-6: parallelises or caches. 7-8: measures first, then optimises the right thing. 9-10: adds pipeline tiering and names the organisational effect of slow CI.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Kết nối chất lượng kỹ thuật với hành vi của team — dấu hiệu của Mid-level trở lên.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Kỹ thuật kiểm thử nào đánh giá chất lượng bộ test bằng cách cố ý thay đổi nhỏ trong code và kiểm tra xem có test nào fail hay không?",
          en: "Which technique evaluates a test suite's quality by deliberately making small code changes and checking whether any test fails?",
        },
        options: [
          { vi: "Mutation testing", en: "Mutation testing" },
          { vi: "Fuzz testing", en: "Fuzz testing" },
          { vi: "Snapshot testing", en: "Snapshot testing" },
          { vi: "Load testing", en: "Load testing" },
        ],
        correctOptionIndex: 0,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Phân biệt đo chất lượng test với đo độ phủ — kiến thức nâng cao hơn coverage đơn thuần.",
        },
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Độ phủ code (code coverage) đạt 100% đảm bảo điều gì?",
          en: "What does 100% code coverage actually guarantee?",
        },
        options: [
          {
            vi: "Phần mềm không còn bug",
            en: "The software has no bugs left",
          },
          {
            vi: "Mọi dòng code đã được thực thi ít nhất một lần trong khi chạy test",
            en: "Every line was executed at least once during the test run",
          },
          {
            vi: "Mọi trường hợp nghiệp vụ đã được kiểm thử",
            en: "Every business case has been tested",
          },
          {
            vi: "Mọi nhánh điều kiện đã được kiểm thử đầy đủ",
            en: "Every conditional branch has been fully tested",
          },
        ],
        correctOptionIndex: 1,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Hiểu đúng giới hạn của coverage là điều kiện cần để không lạm dụng chỉ số này.",
        },
      },
    ],
    senior: [
      {
        type: "open",
        question: {
          vi: "Công ty chuyển sang release hằng ngày thay vì hai tuần một lần, nhưng chu kỳ kiểm thử thủ công hiện tại mất ba ngày. Bạn thiết kế lại chiến lược chất lượng thế nào để theo kịp?",
          en: "The company is moving from fortnightly to daily releases, but the current manual test cycle takes three days. How do you redesign the quality strategy to keep up?",
        },
        expectedKeyPoints: [
          {
            vi: "Không thể tăng tốc kiểm thử thủ công tuyến tính; phải đổi mô hình chứ không đổi tốc độ",
            en: "Manual testing does not speed up linearly; the model must change, not the pace",
          },
          {
            vi: "Chuyển phần kiểm thử hồi quy lặp lại sang tự động, giữ người cho exploratory testing",
            en: "Automate repetitive regression testing and reserve people for exploratory testing",
          },
          {
            vi: "Dịch chuyển sang trái: kiểm tra sớm ngay trong quá trình phát triển thay vì dồn về cuối",
            en: "Shift left: test during development rather than batching at the end",
          },
          {
            vi: "Dịch chuyển sang phải: feature flag, canary release, giám sát production như một tầng kiểm thử",
            en: "Shift right: feature flags, canary releases, and production monitoring as a testing layer",
          },
          {
            vi: "Định nghĩa tiêu chí release rõ ràng và tự động hoá được, thay vì phụ thuộc phán đoán cá nhân",
            en: "Define release criteria that are explicit and automatable rather than a personal judgement call",
          },
          {
            vi: "Chấp nhận rằng một số lỗi sẽ ra production, nên phải rút ngắn thời gian phát hiện và rollback",
            en: "Accepts some defects will reach production, so shorten detection and rollback time",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: đề xuất thuê thêm QA. 4-6: tự động hoá kiểm thử hồi quy. 7-8: kết hợp shift-left và tiêu chí release tự động. 9-10: thêm giám sát production và khả năng rollback như một phần của chiến lược chất lượng.",
            en: "0-3: proposes hiring more QA. 4-6: automates regression. 7-8: combines shift-left with automated release criteria. 9-10: adds production monitoring and rollback as part of the quality strategy.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Yêu cầu thiết kế lại toàn bộ mô hình chất lượng chứ không tối ưu quy trình cũ.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Bạn cần kiểm thử hiệu năng cho một API trước đợt khuyến mãi lớn. Trình bày cách bạn thiết kế bài test, và vì sao con số 'chịu được 5000 request mỗi giây' tự nó chưa nói lên điều gì?",
          en: "You need to performance-test an API before a large promotion. Describe how you design the test, and why 'handles 5000 requests per second' says nothing on its own.",
        },
        expectedKeyPoints: [
          {
            vi: "Phải gắn với ngưỡng độ trễ chấp nhận được: 5000 rps ở p99 bao nhiêu mili giây mới là câu hỏi đúng",
            en: "It must be tied to an acceptable latency: 5000 rps at what p99 is the real question",
          },
          {
            vi: "Mô hình tải phải giống thực tế: tỷ lệ các endpoint, kích thước payload, tỷ lệ người dùng mới và cũ",
            en: "The load model must be realistic: endpoint mix, payload sizes, new versus returning users",
          },
          {
            vi: "Phân biệt load test, stress test và soak test — mỗi loại trả lời một câu hỏi khác nhau",
            en: "Separates load, stress and soak tests — each answers a different question",
          },
          {
            vi: "Môi trường test phải tương đương production về cấu hình và khối lượng dữ liệu, nếu không kết quả vô nghĩa",
            en: "The environment must match production in configuration and data volume, or results are meaningless",
          },
          {
            vi: "Quan sát cả phía hệ thống (CPU, kết nối database, hàng đợi) chứ không chỉ số liệu phía client",
            en: "Observe the system side too (CPU, database connections, queues), not just client-side numbers",
          },
          {
            vi: "Xác định điểm gãy và hành vi khi vượt ngưỡng: suy giảm dần hay sập hoàn toàn",
            en: "Find the breaking point and the behaviour past it: graceful degradation or total collapse",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ mô tả bắn tải bằng công cụ. 4-6: có mô hình tải và ngưỡng độ trễ. 7-8: phân biệt các loại test hiệu năng và yêu cầu môi trường tương đương. 9-10: thêm quan sát phía hệ thống và phân tích hành vi khi vượt ngưỡng.",
            en: "0-3: just describes firing load with a tool. 4-6: has a load model and latency target. 7-8: distinguishes the test types and requires a matched environment. 9-10: adds system-side observation and past-threshold behaviour.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Kiểm thử hiệu năng đúng cách đòi hỏi hiểu cả hệ thống lẫn cách đọc số liệu.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Một lỗi nghiêm trọng lọt ra production dù bộ test có độ phủ 85% và toàn bộ CI đều xanh. Bạn phân tích thế nào để bộ test lần sau bắt được loại lỗi này?",
          en: "A severe bug reached production despite 85% coverage and a fully green CI. How do you analyse it so the suite catches this class of bug next time?",
        },
        expectedKeyPoints: [
          {
            vi: "Trước hết xác định loại lỗi: logic nghiệp vụ, tích hợp, dữ liệu thật, hay điều kiện đồng thời",
            en: "First classify the bug: business logic, integration, real data, or a concurrency condition",
          },
          {
            vi: "Coverage cao không đồng nghĩa test tốt — code được chạy qua không có nghĩa là hành vi được kiểm chứng",
            en: "High coverage is not good testing — executing a line does not verify its behaviour",
          },
          {
            vi: "Kiểm tra xem test có assert đúng thứ cần assert hay chỉ kiểm tra không throw",
            en: "Check whether tests assert the right thing or merely that nothing threw",
          },
          {
            vi: "Nhiều lỗi production đến từ dữ liệu thật hoặc tương tác giữa các thành phần, tầng unit test không bắt được",
            en: "Many production bugs come from real data or component interaction, which unit tests cannot catch",
          },
          {
            vi: "Bổ sung test tái hiện chính lỗi này trước khi sửa, để tránh tái phát",
            en: "Add a test reproducing this exact bug before fixing it, to prevent regression",
          },
          {
            vi: "Tổng quát hoá: rút ra một lớp rủi ro chưa được kiểm thử, không chỉ vá một trường hợp",
            en: "Generalise: identify an untested risk class rather than patching one case",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: kết luận cần tăng coverage. 4-6: nhận ra giới hạn của coverage. 7-8: phân loại đúng lỗi và bổ sung test tái hiện. 9-10: tổng quát hoá thành một lớp rủi ro và điều chỉnh chiến lược test tương ứng.",
            en: "0-3: concludes coverage must rise. 4-6: recognises coverage's limits. 7-8: classifies the bug and adds a reproducing test. 9-10: generalises to a risk class and adjusts the strategy accordingly.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Đòi hỏi tư duy phản biện về chính bộ test thay vì bổ sung máy móc.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Đội của bạn cần dữ liệu thật để kiểm thử cho đúng, nhưng dữ liệu production chứa thông tin cá nhân của khách hàng. Bạn giải quyết mâu thuẫn này thế nào?",
          en: "Your team needs realistic data to test properly, but production data contains customer personal information. How do you resolve that tension?",
        },
        expectedKeyPoints: [
          {
            vi: "Sao chép thẳng dữ liệu production xuống môi trường thấp hơn là rủi ro pháp lý, không chỉ rủi ro kỹ thuật",
            en: "Copying production data into lower environments is a legal exposure, not just a technical one",
          },
          {
            vi: "Che dữ liệu nhạy cảm phải giữ nguyên đặc tính thống kê, nếu không thì lỗi liên quan tới phân bố dữ liệu sẽ không lộ ra",
            en: "Masking must preserve statistical shape, or defects tied to data distribution will never surface",
          },
          {
            vi: "Sinh dữ liệu tổng hợp an toàn hơn nhưng khó tái tạo được các trường hợp biên kỳ lạ ngoài đời",
            en: "Synthetic data is safer but struggles to reproduce the strange edge cases real life produces",
          },
          {
            vi: "Giữ tính toàn vẹn tham chiếu khi che dữ liệu, nếu không các phép nối bảng sẽ hỏng",
            en: "Preserve referential integrity while masking, or joins across tables will break",
          },
          {
            vi: "Cách thực dụng là kết hợp: dữ liệu tổng hợp cho phần lớn, kèm bộ dữ liệu biên được che kỹ lấy từ sự cố thật",
            en: "The pragmatic answer is a mix: synthetic data for the bulk, plus a carefully masked edge-case set drawn from real incidents",
          },
          {
            vi: "Cần quy trình làm mới dữ liệu test định kỳ, vì dữ liệu test cũ dần không còn giống production",
            en: "Refresh test data on a schedule, since stale test data drifts away from production over time",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: đề xuất sao chép dữ liệu production. 4-6: biết cần che dữ liệu nhạy cảm. 7-8: nhận ra phải giữ đặc tính thống kê và toàn vẹn tham chiếu. 9-10: đề xuất cách kết hợp và quy trình làm mới định kỳ.",
            en: "0-3: proposes copying production data. 4-6: knows sensitive data must be masked. 7-8: sees that statistical shape and referential integrity must survive. 9-10: proposes a blended approach and a refresh cadence.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Kết hợp chất lượng kiểm thử với ràng buộc bảo mật dữ liệu — bài toán thường gặp ở tầm Senior.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Hệ thống của bạn có tám service do bốn team sở hữu. Kiểm thử tích hợp đầu cuối rất chậm và hay hỏng, nhưng bỏ đi thì lỗi giao tiếp giữa các service lọt ra production. Bạn thiết kế lại chiến lược này thế nào?",
          en: "Your system has eight services owned by four teams. End-to-end integration tests are slow and brittle, but dropping them lets inter-service defects reach production. How do you redesign the strategy?",
        },
        expectedKeyPoints: [
          {
            vi: "Kiểm thử đầu cuối đầy đủ tăng theo cấp số nhân với số service nên không mở rộng được",
            en: "Full end-to-end coverage grows combinatorially with service count and cannot scale",
          },
          {
            vi: "Kiểm thử hợp đồng giữa hai bên xác nhận giả định về giao diện mà không cần dựng cả hệ thống",
            en: "Contract tests verify each pair's interface assumptions without standing up the whole system",
          },
          {
            vi: "Bên cung cấp chạy kiểm thử theo kỳ vọng của bên tiêu thụ để phát hiện thay đổi phá vỡ tương thích trước khi phát hành",
            en: "The provider runs the consumers' expectations to catch a breaking change before release",
          },
          {
            vi: "Giữ lại một số ít kịch bản đầu cuối cho các luồng sinh doanh thu quan trọng nhất, không phải cho mọi đường đi",
            en: "Keep a small number of end-to-end scenarios for the highest-value flows, not for every path",
          },
          {
            vi: "Bù phần còn thiếu bằng giám sát production và khả năng quay lui nhanh thay vì cố phủ hết trước khi phát hành",
            en: "Cover the remainder with production monitoring and fast rollback rather than pre-release exhaustiveness",
          },
          {
            vi: "Cần thoả thuận về quyền sở hữu vì kiểm thử hợp đồng chỉ hiệu quả khi cả bốn team cùng tuân thủ",
            en: "Agree ownership explicitly, since contract testing only works if all four teams honour it",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: đề xuất viết thêm kiểm thử đầu cuối. 4-6: nhận ra vấn đề mở rộng. 7-8: đề xuất kiểm thử hợp đồng và giữ lại số ít kịch bản quan trọng. 9-10: thêm giám sát production và thoả thuận quyền sở hữu giữa các team.",
            en: "0-3: proposes writing more end-to-end tests. 4-6: recognises the scaling problem. 7-8: proposes contract tests plus a few critical scenarios. 9-10: adds production monitoring and cross-team ownership agreement.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Chiến lược kiểm thử cho kiến trúc phân tán nhiều chủ sở hữu — đúng tầm Senior.",
        },
        requiresPractice: false,
      },
    ],
    staff: [
      {
        type: "open",
        question: {
          vi: "Tổ chức muốn giải thể team QA riêng và chuyển trách nhiệm chất lượng về từng team phát triển. Bạn thiết kế quá trình chuyển đổi này thế nào để chất lượng không tụt, và vai trò của chuyên gia chất lượng khi đó là gì?",
          en: "The organisation wants to dissolve the dedicated QA team and move quality responsibility into each development team. How do you design that transition so quality does not fall, and what becomes of the quality specialists?",
        },
        expectedKeyPoints: [
          {
            vi: "Rủi ro lớn nhất: giải thể mà không chuyển giao năng lực sẽ khiến chất lượng rơi tự do sau vài tháng",
            en: "The main risk: dissolving without transferring capability sends quality into free fall within months",
          },
          {
            vi: "Chuyên gia chất lượng chuyển từ người thực thi test sang người xây nền tảng và huấn luyện",
            en: "Quality specialists shift from executing tests to building platform and coaching",
          },
          {
            vi: "Đầu tư vào công cụ và khuôn mẫu để lập trình viên viết test dễ hơn là không viết",
            en: "Invest in tooling and templates so writing a test is easier than skipping one",
          },
          {
            vi: "Định nghĩa quyền sở hữu rõ ràng: team nào sở hữu service thì sở hữu luôn chất lượng của nó",
            en: "Define ownership clearly: the team that owns a service owns its quality",
          },
          {
            vi: "Đo bằng chỉ số kết quả (lỗi thoát ra production, thời gian phục hồi) chứ không bằng số test đã viết",
            en: "Measure outcomes (escaped defects, recovery time), not the number of tests written",
          },
          {
            vi: "Chuyển đổi theo từng team thí điểm, có dữ liệu trước khi mở rộng toàn tổ chức",
            en: "Transition via pilot teams, with data before rolling out organisation-wide",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: phản đối hoặc đồng ý mà không có kế hoạch. 4-6: nêu được vai trò mới của chuyên gia chất lượng. 7-8: có đầu tư nền tảng và quyền sở hữu rõ ràng. 9-10: thêm chỉ số kết quả và lộ trình thí điểm dựa trên dữ liệu.",
            en: "0-3: opposes or agrees with no plan. 4-6: names the specialists' new role. 7-8: has platform investment and clear ownership. 9-10: adds outcome metrics and a data-driven pilot path.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Thay đổi mô hình vận hành chất lượng ở quy mô tổ chức — đúng phạm vi Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Bạn được yêu cầu đưa ra một bộ chỉ số chất lượng để báo cáo lên ban lãnh đạo hằng quý. Bạn chọn những chỉ số nào, và làm sao tránh việc chính các chỉ số đó bị tối ưu một cách hình thức?",
          en: "You are asked to define a set of quality metrics reported to leadership each quarter. Which do you choose, and how do you stop those very metrics from being gamed?",
        },
        expectedKeyPoints: [
          {
            vi: "Ưu tiên chỉ số kết quả: tỷ lệ lỗi thoát ra production, thời gian phát hiện, thời gian phục hồi",
            en: "Prefer outcome metrics: escaped-defect rate, time to detect, time to recover",
          },
          {
            vi: "Tránh chỉ số dễ bị thao túng đứng một mình, điển hình là code coverage và số test case",
            en: "Avoid easily gamed metrics in isolation — code coverage and test-case counts especially",
          },
          {
            vi: "Ghép cặp chỉ số đối trọng: tốc độ giao hàng đi kèm tỷ lệ thay đổi gây lỗi (change failure rate)",
            en: "Pair counterbalancing metrics: delivery speed alongside change failure rate",
          },
          {
            vi: "Nêu rõ hiệu ứng Goodhart: một chỉ số trở thành mục tiêu thì không còn là thước đo tốt",
            en: "Names Goodhart's law: a measure that becomes a target ceases to be a good measure",
          },
          {
            vi: "Trình bày theo xu hướng và ngữ cảnh, không so sánh tuyệt đối giữa các team khác nhau",
            en: "Present trends with context rather than absolute comparisons between different teams",
          },
          {
            vi: "Chỉ số phải dẫn tới quyết định cụ thể, nếu không thì không đáng thu thập",
            en: "A metric must lead to a concrete decision, or it is not worth collecting",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chọn coverage và số bug làm chỉ số chính. 4-6: có chỉ số kết quả hợp lý. 7-8: ghép cặp chỉ số đối trọng. 9-10: nhận diện được hiệu ứng Goodhart và yêu cầu chỉ số phải dẫn tới quyết định.",
            en: "0-3: picks coverage and bug counts as headline metrics. 4-6: has sensible outcome metrics. 7-8: pairs counterbalancing metrics. 9-10: identifies Goodhart's law and requires metrics to drive decisions.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Thiết kế hệ đo lường cho tổ chức, kèm nhận thức về tác dụng phụ của chính hệ đo lường.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Bốn team đang dùng bốn khung kiểm thử tự động khác nhau, và việc chuyển người giữa các team trở nên tốn kém. Bạn quyết định thống nhất hay để nguyên, và dựa trên cơ sở nào?",
          en: "Four teams use four different test automation frameworks, and moving people between teams has become expensive. Do you consolidate or leave it, and on what basis?",
        },
        expectedKeyPoints: [
          {
            vi: "Trước hết định lượng chi phí thật: thời gian làm quen khi chuyển team, công bảo trì trùng lặp, hạ tầng chạy song song",
            en: "Quantify the real cost first: ramp-up time when moving teams, duplicated maintenance, parallel infrastructure",
          },
          {
            vi: "Thống nhất có chi phí di trú lớn và thường bị đánh giá thấp vì phải viết lại kiểm thử đang chạy tốt",
            en: "Consolidation has a large migration cost, usually underestimated because working tests must be rewritten",
          },
          {
            vi: "Cân nhắc lựa chọn ở giữa: thống nhất phần hạ tầng và báo cáo, để tự do ở tầng viết kiểm thử",
            en: "Consider the middle path: standardise infrastructure and reporting, leave freedom at the test-authoring layer",
          },
          {
            vi: "Nếu thống nhất thì chọn theo tiêu chí công khai, không theo khung mà team đông người nhất đang dùng",
            en: "If consolidating, choose on published criteria rather than whichever framework the largest team uses",
          },
          {
            vi: "Di trú dần cùng với việc viết kiểm thử mới, không dừng lại để chuyển đổi hàng loạt",
            en: "Migrate gradually alongside new test writing rather than pausing for a bulk conversion",
          },
          {
            vi: "Chấp nhận rằng đôi khi câu trả lời đúng là không làm gì, nếu chi phí di trú vượt chi phí đang chịu",
            en: "Accept that sometimes the right answer is to do nothing, when migration costs more than the status quo",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chọn thống nhất ngay vì đồng nhất là tốt. 4-6: có định lượng chi phí. 7-8: cân nhắc lựa chọn ở giữa và di trú dần. 9-10: sẵn sàng kết luận không làm gì nếu số liệu chỉ ra như vậy.",
            en: "0-3: consolidates immediately because uniformity is good. 4-6: quantifies the cost. 7-8: considers a middle path and gradual migration. 9-10: willing to conclude 'do nothing' when the numbers say so.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Quyết định nền tảng dùng chung nhiều team, trong đó câu trả lời đúng có thể là không thay đổi — tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Một bản phát hành lớn sắp tới hạn, còn hai lỗi nghiêm trọng chưa xử lý xong và ban lãnh đạo hỏi bạn có nên phát hành không. Bạn trả lời thế nào, và bạn dựa vào cơ sở nào để đưa ra khuyến nghị?",
          en: "A major release is due, two serious defects remain open, and leadership asks whether to ship. How do you answer, and on what basis do you make the recommendation?",
        },
        expectedKeyPoints: [
          {
            vi: "Vai trò của bạn là trình bày rủi ro rõ ràng để người có thẩm quyền quyết định, không phải tự phủ quyết",
            en: "Your role is to present the risk clearly so the accountable person decides, not to veto unilaterally",
          },
          {
            vi: "Diễn đạt rủi ro theo tác động người dùng và nghiệp vụ, không theo mức độ nghiêm trọng kỹ thuật",
            en: "Frame risk in user and business impact rather than technical severity labels",
          },
          {
            vi: "Ước lượng khả năng gặp phải: lỗi nằm trên luồng bao nhiêu phần trăm người dùng đi qua",
            en: "Estimate likelihood of exposure: what share of users traverse the affected path",
          },
          {
            vi: "Nêu các phương án giảm nhẹ thay vì chỉ hai lựa chọn phát hành hay hoãn: cờ tính năng, phát hành từng phần, hướng dẫn tạm thời",
            en: "Offer mitigations instead of a ship-or-delay binary: feature flags, staged rollout, a documented workaround",
          },
          {
            vi: "Nêu rõ khả năng phát hiện và quay lui nhanh tới đâu, vì điều đó thay đổi mức rủi ro chấp nhận được",
            en: "State how fast you can detect and roll back, since that changes what risk is acceptable",
          },
          {
            vi: "Ghi lại quyết định và cơ sở của nó để lần sau không tranh luận lại từ đầu",
            en: "Record the decision and its basis so the same argument is not relitigated next time",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: đưa ra phán quyết có hoặc không mà không nêu cơ sở. 4-6: mô tả rủi ro theo ngôn ngữ kỹ thuật. 7-8: diễn đạt theo tác động nghiệp vụ và đề xuất phương án giảm nhẹ. 9-10: thêm khả năng quay lui và ghi nhận quyết định.",
            en: "0-3: issues a yes-or-no verdict with no basis. 4-6: describes risk in technical terms. 7-8: frames business impact and offers mitigations. 9-10: adds rollback capability and records the decision.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Ra khuyến nghị dưới áp lực và bất định, ranh giới giữa vai trò kỹ thuật và quyền quyết định — tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Đội ngũ coi chất lượng là việc của team kiểm thử, và lập trình viên đẩy code sang với kỳ vọng người khác tìm lỗi hộ. Bạn thay đổi văn hoá này thế nào khi không có thẩm quyền quản lý?",
          en: "The organisation treats quality as the test team's job, and developers hand off code expecting someone else to find the bugs. How do you change that culture without managerial authority?",
        },
        expectedKeyPoints: [
          {
            vi: "Văn hoá theo sau cơ chế khuyến khích, nên phải tìm xem hệ thống hiện tại đang thưởng cho hành vi nào",
            en: "Culture follows incentives, so find what the current system actually rewards",
          },
          {
            vi: "Rút ngắn vòng phản hồi để lập trình viên tự thấy hậu quả, ví dụ cho họ tham gia trực sự cố",
            en: "Shorten the feedback loop so developers feel the consequence, for example by joining the on-call rotation",
          },
          {
            vi: "Làm cho việc tự kiểm thử dễ hơn việc đẩy sang người khác, bằng công cụ và môi trường sẵn sàng",
            en: "Make self-testing easier than handing off, through tooling and ready environments",
          },
          {
            vi: "Chuyển vai trò của người kiểm thử sang hỗ trợ và huấn luyện thay vì làm người gác cổng cuối cùng",
            en: "Shift testers from final gatekeeper to enabler and coach",
          },
          {
            vi: "Bắt đầu từ một team sẵn sàng thay đổi và dùng kết quả của họ để thuyết phục, thay vì thuyết giảng",
            en: "Start with one willing team and let their results persuade the rest rather than preaching",
          },
          {
            vi: "Đo bằng kết quả như lỗi thoát ra production, để thay đổi được nhìn nhận bằng số liệu chứ không bằng cảm tính",
            en: "Measure by outcomes such as escaped defects, so the change is seen in numbers rather than opinion",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: đề xuất ra quy định bắt buộc lập trình viên viết kiểm thử. 4-6: nhận ra vấn đề nằm ở cơ chế khuyến khích. 7-8: rút ngắn vòng phản hồi và đổi vai trò người kiểm thử. 9-10: có team thí điểm và chỉ số kết quả để chứng minh.",
            en: "0-3: proposes mandating that developers write tests. 4-6: sees the problem is incentives. 7-8: shortens feedback loops and redefines the tester role. 9-10: adds a pilot team and outcome metrics as proof.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Thay đổi văn hoá kỹ thuật bằng ảnh hưởng thay vì thẩm quyền — năng lực đặc trưng tầm Staff.",
        },
        requiresPractice: false,
      },
    ],
  },
};
