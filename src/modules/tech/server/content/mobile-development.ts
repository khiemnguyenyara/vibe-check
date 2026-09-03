import "server-only";

import type { SpecialtyBank } from "./types";

export const mobileDevelopmentBank: SpecialtyBank = {
  id: "mobile-development",
  label: "Mobile Development",
  questions: {
    junior: [
      {
        type: "open",
        question: {
          vi: "Phân biệt giữa native app (iOS/Android) và cross-platform (React Native/Flutter). Ưu nhược điểm mỗi cái?",
          en: "Distinguish native (iOS/Android) vs cross-platform (React Native/Flutter). Pros and cons?",
        },
        expectedKeyPoints: [
          {
            vi: "Native: tối ưu hiệu năng, truy cập đầy đủ platform APIs, nhưng code riêng cho mỗi platform",
            en: "Native: optimized performance, full API access, but separate code per platform",
          },
          {
            vi: "Cross-platform: một codebase cho 2+ platform, phát triển nhanh hơn, nhưng trade-off hiệu năng",
            en: "Cross-platform: one codebase for multiple platforms, faster, but performance trade-offs",
          },
          {
            vi: "Native: iOS Objective-C/Swift, Android Java/Kotlin. Cross: JavaScript/Dart chạy qua bridge",
            en: "Native: iOS/Swift or Objective-C, Android/Kotlin or Java. Cross: JS/Dart through bridge",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: không phân biệt rõ. 5-7: phân biệt đúng nhưng ví dụ thiếu chi tiết. 8-10: so sánh đầy đủ ưu nhược điểm.",
            en: "0-4: unclear distinction. 5-7: correct but examples lack detail. 8-10: full comparison of pros/cons.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Nền tảng hiểu biết về mobile development.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Vòng đời Activity/ViewController là gì? Tại sao phải biết nó để viết app stable?",
          en: "What is the lifecycle of Activity/ViewController? Why must you know it for stable apps?",
        },
        expectedKeyPoints: [
          {
            vi: "Android Activity: onCreate → onStart → onResume → onPause → onStop → onDestroy",
            en: "Android Activity: onCreate → onStart → onResume → onPause → onStop → onDestroy",
          },
          {
            vi: "iOS ViewController: viewDidLoad → viewWillAppear → viewDidAppear → viewWillDisappear → viewDidDisappear",
            en: "iOS ViewController: viewDidLoad → viewWillAppear → viewDidAppear → viewWill/DidDisappear",
          },
          {
            vi: "Phải biết để: setup/cleanup resources đúng, tránh memory leak, handling rotation, quản lý state",
            en: "Must know to: setup/cleanup correctly, avoid memory leaks, handle rotation, manage state",
          },
          {
            vi: "Ví dụ: API call trong onCreate (Android) hoặc viewDidLoad (iOS), cleanup trong onDestroy",
            en: "Example: fetch API in onCreate or viewDidLoad, cleanup in onDestroy",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết một platform, lifecycle không rõ. 5-7: biết lifecycle nhưng tại sao chưa rõ. 8-10: lifecycle + các case sử dụng cụ thể.",
            en: "0-4: knows one platform only, lifecycle unclear. 5-7: knows lifecycle but not why. 8-10: lifecycle plus concrete use cases.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Kiến thức nền tảng mobile development.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Thread vs Main Thread là gì? Tại sao không được block Main Thread? Làm thế nào để chạy task nặng mà không làm frozen UI?",
          en: "What is Main Thread? Why cannot you block it? How to run heavy tasks without freezing the UI?",
        },
        expectedKeyPoints: [
          {
            vi: "Main Thread: chạy UI rendering, phải respond nhanh. Block nó = app frozen, ANR (Android), watchdog timeout (iOS)",
            en: "Main Thread: handles UI, must be responsive. Blocking it = frozen app, ANR or watchdog timeout",
          },
          {
            vi: "Solution: chạy task nặng trên background thread (Thread, AsyncTask, coroutine/GCD)",
            en: "Solution: heavy work on background thread (Thread, AsyncTask, coroutine/GCD)",
          },
          {
            vi: "Sau khi xong, post result về Main Thread để update UI",
            en: "Then post result back to Main Thread to update UI",
          },
          {
            vi: "Ví dụ: network request → background thread → update UI on Main → display result",
            en: "Example: network request on background, update UI on Main, display result",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: không biết khái niệm. 5-7: biết Main Thread nhưng solution vào vở. 8-10: rõ lý do + solution cụ thể.",
            en: "0-4: unfamiliar. 5-7: knows Main Thread but vague solution. 8-10: clear why plus concrete solution.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Nền tảng responsive UI trong mobile.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Trong Android, để lưu dữ liệu đơn giản (key-value), nên dùng gì?",
          en: "In Android, what do you use to save simple key-value data?",
        },
        options: [
          { vi: "SharedPreferences", en: "SharedPreferences" },
          { vi: "SQLite Database", en: "SQLite Database" },
          { vi: "Internal File Storage", en: "Internal File Storage" },
          { vi: "External Storage", en: "External Storage" },
        ],
        correctOptionIndex: 0,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Hiểu đúng storage options trong Android.",
        },
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Trong iOS, để lưu dữ liệu persistent như user preferences, nên dùng gì?",
          en: "In iOS, what do you use for persistent storage like user preferences?",
        },
        options: [
          { vi: "UserDefaults", en: "UserDefaults" },
          { vi: "Core Data", en: "Core Data" },
          { vi: "Realm", en: "Realm" },
          { vi: "Files", en: "Files" },
        ],
        correctOptionIndex: 0,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Hiểu đúng storage options trong iOS.",
        },
      },
    ],
    mid: [
      {
        type: "open",
        question: {
          vi: "Memory leak trong mobile: nguyên nhân phổ biến là gì? Làm thế nào để phát hiện và fix?",
          en: "Memory leaks in mobile: common causes? How to detect and fix?",
        },
        expectedKeyPoints: [
          {
            vi: "Nguyên nhân: circular reference, listener/observer không unsubscribe, activity context leak",
            en: "Causes: circular refs, listeners not unsubscribed, activity context leaks",
          },
          {
            vi: "Android: static reference to activity, inner class holding outer class, coroutine scope",
            en: "Android: static refs to activity, inner class leaking outer, scope management",
          },
          {
            vi: "Detection: Android Profiler, Memory Leaks analyzer, iOS Xcode Instruments",
            en: "Detection: Android Profiler, Memory Analyzer, iOS Instruments",
          },
          {
            vi: "Fix: unsubscribe listeners, use weak references, clear references in onDestroy/deinit",
            en: "Fix: unsubscribe, use weak refs, clear in onDestroy or deinit",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết memory leak là xấu. 5-7: nêu được nguyên nhân nhưng detection/fix vào vở. 8-10: nguyên nhân + detection tool + fix cụ thể.",
            en: "0-4: knows leaks are bad only. 5-7: names causes but vague on detection. 8-10: causes, tools, specific fixes.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "Debugging memory issue là Mid-level skill.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Tối ưu performance mobile app: FPS, battery, data usage. Cách đo và improve mỗi metric?",
          en: "Optimize mobile performance: FPS, battery, data usage. How to measure and improve each?",
        },
        expectedKeyPoints: [
          {
            vi: "FPS: 60fps smooth, phát hiện bằng Android Profiler/iOS Instruments, fix bằng optimize rendering",
            en: "FPS: target 60fps, detect with Profiler/Instruments, fix rendering",
          },
          {
            vi: "Battery: profile bằng Battery Historian, giảm CPU/location/network usage, batch operations",
            en: "Battery: profile with Battery Historian, reduce CPU/location/network, batch ops",
          },
          {
            vi: "Data: compress images/videos, lazy load, use caching, choose JSON over XML",
            en: "Data: compress media, lazy load, cache, JSON over XML",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết tối ưu performance chung. 5-7: nêu được metric nhưng cách fix vào vở. 8-10: mỗi metric có cách đo + improve cụ thể.",
            en: "0-4: generic optimization only. 5-7: metrics named but vague fixes. 8-10: measure and improve each.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "Performance profiling Mid-level skill.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Trong React Native, để access native code (camera, bluetooth), nên dùng gì?",
          en: "In React Native, how do you access native code (camera, Bluetooth)?",
        },
        options: [
          { vi: "Native Modules", en: "Native Modules" },
          { vi: "REST API", en: "REST API" },
          { vi: "Web Workers", en: "Web Workers" },
          { vi: "Direct SDK import", en: "Direct SDK import" },
        ],
        correctOptionIndex: 0,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "Hiểu bridge giữa JS và native trong React Native.",
        },
      },
      {
        type: "open",
        question: {
          vi: "App state management khi có background process (location tracking, music playing). Cách design state, persistence?",
          en: "State management with background processes (location, music). Design and persistence?",
        },
        expectedKeyPoints: [
          {
            vi: "Background state: tách từ UI state, lưu persistent (database/file, không memory)",
            en: "Background state: separate from UI, store persistent (database, not memory)",
          },
          {
            vi: "Sync: background updates local storage, UI reads từ storage khi app resumes",
            en: "Sync: background updates storage, UI reads on resume",
          },
          {
            vi: "Communication: broadcast intent (Android) hoặc app delegate callback (iOS) để notify UI",
            en: "Communication: broadcast (Android) or delegate callback (iOS) to notify UI",
          },
          {
            vi: "Edge case: app terminated, user kill background process, low battery mode",
            en: "Edge cases: app terminated, user kills process, low battery",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết UI state. 5-7: biết tách nhưng sync chưa rõ. 8-10: tách rõ ràng kèm sync mechanism.",
            en: "0-4: UI state only. 5-7: separation but sync unclear. 8-10: clear separation with sync mechanism.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "Background state management Mid-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Network handling: retry logic, exponential backoff, circuit breaker pattern. Khi nào dùng cái nào?",
          en: "Network handling: retry logic, exponential backoff, circuit breaker. When use which?",
        },
        expectedKeyPoints: [
          {
            vi: "Retry logic: tự động retry khi failure tạm thời, nhưng tránh retry infinite",
            en: "Retry logic: retry temporary failures, but avoid infinite retries",
          },
          {
            vi: "Exponential backoff: increase delay giữa retries để tránh overwhelm server",
            en: "Exponential backoff: increase delay to prevent server overload",
          },
          {
            vi: "Circuit breaker: stop trying khi fail liên tục, đợi server recovery, return cached data",
            en: "Circuit breaker: stop trying after continuous failures, wait for recovery, cache data",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết retry. 5-7: retry + backoff nhưng circuit breaker chưa rõ. 8-10: cả ba pattern kèm use case.",
            en: "0-4: retry only. 5-7: retry and backoff, vague on circuit breaker. 8-10: all three with use cases.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "Network resilience Mid-level.",
        },
        requiresPractice: false,
      },
    ],
    senior: [
      {
        type: "open",
        question: {
          vi: "Thiết kế architecture cho một large-scale mobile app: modularization, dependency injection, testing. Tradeoff giữa chúng?",
          en: "Design architecture for large-scale mobile: modularization, DI, testing. Trade-offs?",
        },
        expectedKeyPoints: [
          {
            vi: "Modularization: tách feature riêng biệt, reusable, testable, nhưng build time có thể lâu",
            en: "Modularization: separate features, reusable, testable, but build time increases",
          },
          {
            vi: "DI (Dependency Injection): Hilt/Dagger (Android), DI container (iOS), giảm coupling, tăng testability",
            en: "DI: Hilt/Dagger (Android), container (iOS), reduce coupling, improve testing",
          },
          {
            vi: "Testing: unit test business logic, integration test modules, UI test critical flows",
            en: "Testing: unit test logic, integration test modules, UI test flows",
          },
          {
            vi: "Tradeoff: modularization = complexity, build time. DI = initial setup. Testing = time nhưng long-term savings",
            en: "Trade-offs: modularization adds complexity; DI has setup cost; testing pays off long-term",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ liệt kê pattern. 5-7: nêu pattern nhưng tradeoff vào vở. 8-10: pattern + tradeoff analysis rõ ràng.",
            en: "0-4: lists patterns only. 5-7: patterns but vague trade-offs. 8-10: patterns with trade-off analysis.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Thiết kế architecture mobile Senior-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Xử lý offline-first architecture: sync data, conflict resolution, cache strategy. Case study: todo app.",
          en: "Offline-first architecture: sync, conflict resolution, caching. Case: todo app.",
        },
        expectedKeyPoints: [
          {
            vi: "Offline-first: read from local storage, write locally, sync khi có connection",
            en: "Offline-first: read from local, write locally, sync when connected",
          },
          {
            vi: "Sync strategy: queue pending changes, last-write-wins hoặc merge logic",
            en: "Sync: queue pending changes, use last-write-wins or merge logic",
          },
          {
            vi: "Conflict resolution: choose strategy (client-side, server-side, or hybrid) tùy vào use case",
            en: "Conflicts: choose strategy (client, server, or hybrid) per use case",
          },
          {
            vi: "Cache: local SQLite/Realm, invalidate when sync completes",
            en: "Cache: local database, invalidate after sync",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết offline là cache. 5-7: offline + sync nhưng conflict vào vở. 8-10: đầy đủ sync + conflict resolution.",
            en: "0-4: caching only. 5-7: offline and sync, vague on conflicts. 8-10: full sync and conflict strategy.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Offline-first là pattern Senior-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Xây dựng SDK mobile: API design, versioning, backward compatibility, deprecation strategy?",
          en: "Design mobile SDK: API design, versioning, backward compatibility, deprecation?",
        },
        expectedKeyPoints: [
          {
            vi: "API design: simple, consistent, clear naming, chainable (builder pattern)",
            en: "API design: simple, consistent, clear naming, chainable",
          },
          {
            vi: "Versioning: semver (major.minor.patch), major = breaking changes",
            en: "Versioning: semver, major for breaking changes",
          },
          {
            vi: "Backward compatibility: deprecated API runs 2+ versions before removal",
            en: "Backward compatibility: deprecated APIs last 2+ versions before removal",
          },
          {
            vi: "Communication: changelog, migration guides, beta releases",
            en: "Communication: changelog, migration guides, beta releases",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết API design. 5-7: design + versioning nhưng deprecation vào vở. 8-10: đầy đủ design + versioning + deprecation strategy.",
            en: "0-4: API design only. 5-7: design and versioning, vague deprecation. 8-10: full with deprecation strategy.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "SDK design là Senior concern.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Android Fragment lifecycle event nào xảy ra khi user navigate away từ Fragment?",
          en: "Which Android Fragment lifecycle event fires when user navigates away?",
        },
        options: [
          { vi: "onPause", en: "onPause" },
          { vi: "onStop", en: "onStop" },
          { vi: "onDestroyView", en: "onDestroyView" },
          { vi: "onDestroy", en: "onDestroy" },
        ],
        correctOptionIndex: 1,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Lifecycle nuances Senior-level.",
        },
      },
      {
        type: "open",
        question: {
          vi: "Xử lý push notification: deep linking, notification handling, background vs foreground state?",
          en: "Push notification handling: deep linking, notification handling, foreground vs background?",
        },
        expectedKeyPoints: [
          {
            vi: "Deep linking: click notification → route tới screen cụ thể trong app",
            en: "Deep linking: click notification → route to specific screen",
          },
          {
            vi: "Background: app terminat, notification gọi intent, phải setup intent filter",
            en: "Background: app terminated, notification triggers intent, needs intent filter",
          },
          {
            vi: "Foreground: app đang chạy, listen notification event, update UI trong app",
            en: "Foreground: app running, listen event, update UI in-app",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết notification display. 5-7: deep linking + background nhưng foreground chưa rõ. 8-10: đầy đủ cả ba state.",
            en: "0-4: display only. 5-7: deep link and background, vague foreground. 8-10: all three states.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Push notification lifecycle Senior.",
        },
        requiresPractice: false,
      },
    ],
    staff: [
      {
        type: "open",
        question: {
          vi: "Quyết định native vs cross-platform: criteria, long-term cost, team capability, market time. Framework evaluation?",
          en: "Native vs cross-platform decision: criteria, cost, team, time-to-market, framework evaluation?",
        },
        expectedKeyPoints: [
          {
            vi: "Criteria: time-to-market vs quality, team expertise, platform-specific features needed",
            en: "Criteria: time-to-market vs quality, team skills, platform-specific features",
          },
          {
            vi: "Cost: native = 2x teams, cross = 1 team but trade-offs, outsourcing risk",
            en: "Cost: native needs 2x teams; cross is 1 team but has trade-offs",
          },
          {
            vi: "Framework evaluation: React Native maturity, Flutter ecosystem, maintenance burden",
            en: "Framework eval: maturity, ecosystem, maintenance, hiring pool",
          },
          {
            vi: "Long-term: native = control + cost, cross = speed + constraint",
            en: "Long-term: native gives control but costs more; cross is faster but constrained",
          },
          {
            vi: "Hybrid approach: native core, cross-platform features khi possible",
            en: "Hybrid: native core, cross-platform where possible",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết technical difference. 5-7: nêu criteria nhưng cost/team analysis vào vở. 8-10: criteria + cost + long-term analysis rõ ràng.",
            en: "0-4: technical difference only. 5-7: criteria but cost/team vague. 8-10: criteria, cost, long-term clear.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Strategic platform decision là Staff-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "App store optimization và release strategy: versioning, beta testing, rollout stages, rollback plan?",
          en: "App store optimization and releases: versioning, beta testing, rollout, rollback?",
        },
        expectedKeyPoints: [
          {
            vi: "Versioning: semver, build number > version number, communicate breaking changes",
            en: "Versioning: semver, build numbers, communicate breaking changes",
          },
          {
            vi: "Beta testing: internal → closed beta (small group) → open beta (opt-in) → stable",
            en: "Beta testing: internal → closed beta → open beta → stable",
          },
          {
            vi: "Rollout: phased release (5% → 25% → 50% → 100%) để detect issues sớm",
            en: "Rollout: phased (5% → 25% → 50% → 100%) to detect issues early",
          },
          {
            vi: "Rollback: keep previous version accessible, canary releases, automated crash detection",
            en: "Rollback: keep old version, canary releases, crash detection",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết deploy. 5-7: beta + rollout nhưng rollback vào vở. 8-10: đầy đủ: versioning + beta + rollout + rollback.",
            en: "0-4: deploy only. 5-7: beta and rollout, vague rollback. 8-10: full: versioning, beta, rollout, rollback.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Release strategy và risk management Staff-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Quy mô lớn: handle platform fragmentation (OS versions, devices, screen sizes). Trade-off là gì?",
          en: "Large-scale: handle platform fragmentation (OS, devices, screens). What are the trade-offs?",
        },
        expectedKeyPoints: [
          {
            vi: "Fragmentation: iOS 5 devices, 100+ Android phones, nhưng user base nhỏ hơn 5%, có worth optimize?",
            en: "Fragmentation: old iOS, 100+ Android phones, but <5% of users, worth optimizing?",
          },
          {
            vi: "Strategy: drop support old OS (push user update), graceful degradation, feature flags",
            en: "Strategy: drop old OS (push updates), graceful degradation, feature flags",
          },
          {
            vi: "Testing: prioritize by market share (80% devices), test representative sample, not every combo",
            en: "Testing: test by market share (80% devices), representative sample, not all",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết test mọi device. 5-7: nêu được strategy nhưng prioritization chưa rõ. 8-10: cân bằng: support + drop + test by share.",
            en: "0-4: test every device. 5-7: strategy but prioritization vague. 8-10: balance: support, drop, test by share.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Pragmatic trade-offs at scale Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Building a mobile team: hiring (iOS/Android expert vs full-stack), onboarding, knowledge share?",
          en: "Build mobile team: hiring (iOS/Android expert vs full-stack), onboarding, knowledge share?",
        },
        expectedKeyPoints: [
          {
            vi: "Expert vs full-stack: expert deeper, faster, but specialist risk. Full-stack flexible.",
            en: "Expert: deeper, faster; specialist risk. Full-stack: flexible.",
          },
          {
            vi: "Onboarding: real project early, mentor pairing, clear doc, platform-specific gotchas",
            en: "Onboarding: real project early, pairing, docs, platform gotchas",
          },
          {
            vi: "Knowledge share: cross-platform code review, brown bag, documented patterns",
            en: "Knowledge share: cross-platform review, talks, patterns doc",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết hiring. 5-7: hiring + onboarding nhưng knowledge share chưa rõ. 8-10: đầy đủ: hiring + onboarding + share strategy.",
            en: "0-4: hiring only. 5-7: hiring and onboarding, vague share. 8-10: full: hiring, onboarding, share.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "People and org Staff/leadership.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Monitoring mobile app: crash reporting, analytics, performance tracing. Tool nào, metric nào?",
          en: "Monitor mobile app: crash reporting, analytics, performance. Tools and metrics?",
        },
        expectedKeyPoints: [
          {
            vi: "Crash reporting: Sentry, Firebase Crashlytics, capture stack trace, session breadcrumb",
            en: "Crash: Sentry, Firebase Crashlytics, stack traces, breadcrumbs",
          },
          {
            vi: "Analytics: Firebase Analytics, track user journey, conversion funnel",
            en: "Analytics: Firebase, user journey, conversion funnel",
          },
          {
            vi: "Performance: APM tool (New Relic, Datadog), measure frame rate, memory, startup time",
            en: "Performance: APM (New Relic, Datadog), frame rate, memory, startup",
          },
          {
            vi: "Metric: crash rate, ANR rate, hang time, user retention",
            en: "Metrics: crash rate, ANR, hang time, retention",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết một tool. 5-7: nêu được crash + analytics. 8-10: đầy đủ: crash + analytics + APM + metric.",
            en: "0-4: one tool only. 5-7: crash and analytics. 8-10: full: crash, analytics, APM, metrics.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Observability strategy Staff.",
        },
        requiresPractice: false,
      },
    ],
  },
};
