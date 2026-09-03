import "server-only";

import type { SpecialtyBank } from "./types";

export const cybersecurityBank: SpecialtyBank = {
  id: "cybersecurity",
  label: "Cybersecurity",
  questions: {
    junior: [
      {
        type: "open",
        question: {
          vi: "Phân biệt giữa authentication và authorization. Cho ví dụ cụ thể từ hệ thống đăng nhập.",
          en: "Distinguish between authentication and authorization with concrete examples.",
        },
        expectedKeyPoints: [
          {
            vi: "Authentication: xác định bạn là ai (verify identity), thường qua password hoặc MFA",
            en: "Authentication: proving who you are, via password or MFA",
          },
          {
            vi: "Authorization: xác định bạn được phép làm gì (access control) dựa trên role",
            en: "Authorization: what you are allowed to do, based on role",
          },
          {
            vi: "Ví dụ: login = auth, sau auth mới kiểm tra quyền xem/edit = authz",
            en: "Example: login is auth; checking view/edit permissions is authz",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: nhầm lẫn hai khái niệm. 5-7: phân biệt đúng nhưng ví dụ thiếu rõ ràng. 8-10: phân biệt rõ ràng kèm ví dụ cụ thể.",
            en: "0-4: confuses the two. 5-7: distinguishes but examples lack clarity. 8-10: clear with concrete examples.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Nền tảng bảo mật cơ bản.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "OWASP Top 10 là gì, và liệt kê 3 lỗ hổng phổ biến nhất. Cách phòng tránh mỗi cái?",
          en: "What is OWASP Top 10? List 3 vulnerabilities and how to prevent each.",
        },
        expectedKeyPoints: [
          {
            vi: "OWASP Top 10: danh sách 10 lỗ hổng bảo mật phổ biến nhất trong ứng dụng web",
            en: "OWASP Top 10: list of ten most common web vulnerabilities",
          },
          {
            vi: "Injection: validate & parameterize input, không concatenate user data",
            en: "Injection: validate and parameterize, never concatenate user data",
          },
          {
            vi: "Broken authentication: hash password, MFA, secure session management",
            en: "Broken authentication: hash passwords, use MFA, secure sessions",
          },
          {
            vi: "XSS: encode output, CSP, tránh innerHTML với user input",
            en: "XSS: encode output, use CSP, avoid innerHTML with user input",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: không biết OWASP. 5-7: biết khái niệm nhưng phòng tránh thiếu chi tiết. 8-10: 3 lỗ hổng kèm cách phòng tránh cụ thể.",
            en: "0-4: unfamiliar with OWASP. 5-7: knows concept but prevention vague. 8-10: three vulnerabilities with specific prevention.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Kiến thức bắt buộc cho developer.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Bạn phát hiện plaintext password trong code repository. Bạn xử lý thế nào?",
          en: "You find plaintext passwords in a repo. How do you handle it?",
        },
        expectedKeyPoints: [
          {
            vi: "Rotate mật khẩu ngay vì nó đã exposed",
            en: "Rotate the password immediately since it is exposed",
          },
          {
            vi: "Xoá từ git history (git filter-branch hoặc BFG) để không còn ở đâu",
            en: "Remove from git history (git filter-branch or BFG)",
          },
          {
            vi: "Triển khai secrets management (environment variables, vaults)",
            en: "Implement secrets management (environment variables, vaults)",
          },
          {
            vi: "Thêm pre-commit hook để detect secrets trước commit",
            en: "Add pre-commit hooks to detect secrets before committing",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ xoá file. 5-7: rotates + xoá history. 8-10: toàn bộ quy trình: rotate, cleanup, prevention.",
            en: "0-4: only deletes. 5-7: rotates and removes history. 8-10: full process: rotate, cleanup, prevent.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Tình huống thực tế, xử lý khẩn cấp.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Cách nào là KHÔNG an toàn khi lưu mật khẩu người dùng?",
          en: "Which is NOT secure for storing passwords?",
        },
        options: [
          { vi: "bcrypt hoặc Argon2 với salt", en: "bcrypt or Argon2 with salt" },
          { vi: "SHA-256 hash của mật khẩu", en: "SHA-256 hash of password" },
          { vi: "SCRYPT hoặc PBKDF2", en: "SCRYPT or PBKDF2" },
          { vi: "Plaintext encrypted với AES", en: "Plaintext encrypted with AES" },
        ],
        correctOptionIndex: 1,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Hiểu đúng cách hash password.",
        },
      },
      {
        type: "multiple_choice",
        question: {
          vi: "HTTPS sử dụng cặp khóa nào để thiết lập kết nối ban đầu?",
          en: "HTTPS uses which key pair for initial connection?",
        },
        options: [
          { vi: "Symmetric keys", en: "Symmetric keys" },
          { vi: "Asymmetric keys (public/private)", en: "Asymmetric keys (public/private)" },
          { vi: "Session keys", en: "Session keys" },
          { vi: "Pre-shared keys", en: "Pre-shared keys" },
        ],
        correctOptionIndex: 1,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Hiểu cơ bản về TLS handshake.",
        },
      },
    ],
    mid: [
      {
        type: "open",
        question: {
          vi: "Rate limiting và throttling khác nhau thế nào? Khi nào dùng cái nào để phòng chống DDoS?",
          en: "How do rate limiting and throttling differ? When use each against DDoS?",
        },
        expectedKeyPoints: [
          {
            vi: "Rate limiting: từ chối request khi vượt ngưỡng (hard limit)",
            en: "Rate limiting: reject requests exceeding limit (hard cutoff)",
          },
          {
            vi: "Throttling: chậm hóa requests hoặc queue chúng (soft limit)",
            en: "Throttling: slow down or queue requests (soft approach)",
          },
          {
            vi: "DDoS: rate limiting tốt hơn vì nhanh từ chối, throttling có thể cạn tài nguyên queue",
            en: "DDoS: rate limiting better (fast rejection); throttling exhausts queue resources",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: không phân biệt rõ. 5-7: phân biệt đúng nhưng DDoS context vào vở. 8-10: phân biệt rõ kèm DDoS mitigation.",
            en: "0-4: unclear. 5-7: correct distinction but DDoS vague. 8-10: clear with DDoS context.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "DDoS mitigation Mid-level skill.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Encryption ở tầng nào (transport vs application)? Khi nào mỗi cái cần dùng?",
          en: "Encryption at which layer (transport vs application)? When need each?",
        },
        expectedKeyPoints: [
          {
            vi: "Transport (TLS/SSL): bảo vệ toàn bộ connection, automatic, end-to-end (client-server)",
            en: "Transport (TLS/SSL): protects entire connection, automatic, client-server",
          },
          {
            vi: "Application: bảo vệ từng message/field, custom logic, survives logging/storage",
            en: "Application: protects each message/field, custom, survives logging",
          },
          {
            vi: "Cần cả hai: TLS cho connection, application-level cho sensitive data (PII, card number)",
            en: "Need both: TLS for transport, application for sensitive data (PII, cards)",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết TLS. 5-7: phân biệt hai tầng nhưng when chưa rõ. 8-10: phân biệt rõ kèm use case cụ thể.",
            en: "0-4: knows TLS only. 5-7: distinguishes layers but when unclear. 8-10: clear with use cases.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "Encryption strategy Mid-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "API security: làm thế nào để bảo vệ API khỏi abuse, data leak, bị giả mạo?",
          en: "API security: protect from abuse, data leak, impersonation?",
        },
        expectedKeyPoints: [
          {
            vi: "Authenticate (API key, OAuth token, mTLS), authorize (scope, role), rate limit",
            en: "Authenticate (API key, OAuth, mTLS), authorize (scope, role), rate limit",
          },
          {
            vi: "HTTPS always, validate input, encrypt sensitive fields, sign requests",
            en: "Always HTTPS, validate input, encrypt sensitive, sign requests",
          },
          {
            vi: "Log and monitor abuse patterns, IP blocking, WAF rules",
            en: "Log and monitor abuse, IP blocking, WAF rules",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết một cách bảo vệ. 5-7: nêu được vài cách nhưng chưa đầy đủ. 8-10: đầy đủ: auth + input validation + monitoring.",
            en: "0-4: one method only. 5-7: several but incomplete. 8-10: full: auth, validation, monitoring.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "API security là kỹ năng cơ bản Mid-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Thiết kế lưu trữ token an toàn cho SPA: localStorage, sessionStorage hay HTTP-only cookies? Tại sao?",
          en: "How to securely store tokens in a SPA? localStorage, sessionStorage, or HTTP-only cookies?",
        },
        expectedKeyPoints: [
          {
            vi: "localStorage/sessionStorage: dễ access nhưng XSS dễ đánh cắp",
            en: "localStorage/sessionStorage: accessible but XSS can steal tokens",
          },
          {
            vi: "HTTP-only cookies: bảo vệ khỏi XSS, nhưng vẫn có CSRF risk",
            en: "HTTP-only cookies: protected from XSS, but CSRF risk remains",
          },
          {
            vi: "Cách tốt nhất: HTTP-only, Secure, SameSite=Strict + CSRF token",
            en: "Best: HTTP-only, Secure, SameSite=Strict cookie plus CSRF token",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết một cách. 5-7: so sánh đúng nhưng thiếu CSRF mention. 8-10: phân tích đầy đủ với SameSite & CSRF.",
            en: "0-4: knows one option. 5-7: compares but misses CSRF. 8-10: comprehensive with SameSite and CSRF token.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "Thiết kế bảo mật token ở Mid-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Threat modeling: STRIDE/PASTA là gì? Áp dụng vào một API endpoint cụ thể.",
          en: "What is threat modeling? Explain STRIDE/PASTA and apply to an API endpoint.",
        },
        expectedKeyPoints: [
          {
            vi: "Threat modeling: nhận diện mối đe dọa tiềm ẩn trước khi code",
            en: "Threat modeling: identify threats before coding",
          },
          {
            vi: "STRIDE: Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation",
            en: "STRIDE: Spoofing, Tampering, Repudiation, Disclosure, DoS, Elevation",
          },
          {
            vi: "Ví dụ endpoint: GET /api/user/profile có risk Spoofing, Information Disclosure, ...",
            en: "Example: GET /api/user/profile risks Spoofing, Disclosure, ...",
          },
          {
            vi: "Mỗi threat có mitigation: auth, encryption, logging, rate limit",
            en: "Each threat has mitigations: auth, encryption, logging, rate limiting",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: không biết threat modeling. 5-7: biết khái niệm nhưng apply chưa cụ thể. 8-10: áp dụng cụ thể với mitigations.",
            en: "0-4: unfamiliar. 5-7: concept known but vague. 8-10: specific application with mitigations.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "Kỹ năng thiết kế bảo mật hệ thống.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Một cuộc tấn công CSRF yêu cầu điều gì?",
          en: "A CSRF attack requires what?",
        },
        options: [
          { vi: "Nạn nhân logged-in vào trang đích", en: "Victim to be logged into target site" },
          { vi: "Nạn nhân click link độc hại từ trang khác", en: "Victim to click link from another site" },
          { vi: "Server không validate CSRF token", en: "Server not validating CSRF token" },
          { vi: "Cả 1, 2, và 3", en: "All of the above" },
        ],
        correctOptionIndex: 3,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "CSRF là lỗ hổng phổ biến.",
        },
      },
    ],
    senior: [
      {
        type: "open",
        question: {
          vi: "Thiết kế Zero Trust Architecture cho một tổ chức. Nguyên tắc chính là gì? Triển khai ở network, app, data layer?",
          en: "Design Zero Trust Architecture. Core principles and implementation at network, app, data layers?",
        },
        expectedKeyPoints: [
          {
            vi: "Never trust, always verify. Không default trust vào internal network",
            en: "Never trust, always verify. No default trust for internal networks",
          },
          {
            vi: "Network: micro-segmentation, mỗi connection phải authenticate (không traditional DMZ)",
            en: "Network: micro-segmentation, each connection authenticated (no traditional DMZ)",
          },
          {
            vi: "App: MFA, least privilege, certificate-based (mTLS)",
            en: "App: MFA, least privilege, certificate-based (mTLS)",
          },
          {
            vi: "Data: encryption at rest & transit, audit every access, dynamic RBAC",
            en: "Data: encryption at rest and in transit, audit all access, dynamic RBAC",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết khái niệm. 5-7: nêu nguyên tắc nhưng triển khai thiếu chi tiết. 8-10: kiến trúc đầy đủ 3 layer.",
            en: "0-4: concept only. 5-7: principles but vague. 8-10: full 3-layer architecture.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Kiến trúc bảo mật Senior-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Khi dùng symmetric encryption, asymmetric, hay hybrid? Cho ví dụ thực tế cụ thể.",
          en: "When to use symmetric, asymmetric, or hybrid encryption? Real examples?",
        },
        expectedKeyPoints: [
          {
            vi: "Symmetric (AES): nhanh nhưng key distribution phức tạp, dùng data at rest với shared key",
            en: "Symmetric (AES): fast but key distribution hard; use for data at rest",
          },
          {
            vi: "Asymmetric (RSA): chậm nhưng giải quyết key distribution, dùng handshake/signatures",
            en: "Asymmetric (RSA): slow but solves key distribution; use for handshakes",
          },
          {
            vi: "Hybrid (TLS): asymmetric để exchange key, sau đó symmetric cho bulk data",
            en: "Hybrid (TLS): asymmetric for key exchange, then symmetric for bulk data",
          },
          {
            vi: "Ví dụ: disk encryption = AES, PKI = RSA, HTTPS = hybrid",
            en: "Examples: disk uses AES, PKI uses RSA, HTTPS uses hybrid",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: không phân biệt được. 5-7: phân biệt đúng nhưng ví dụ vào vở. 8-10: phân tích rõ ràng kèm ví dụ concrete.",
            en: "0-4: cannot distinguish. 5-7: distinguishes but textbook examples. 8-10: clear analysis with real examples.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Lựa chọn thuật toán encryption Senior-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Supply chain security: phòng chống SolarWinds-style attack (trusted vendor bị compromise)? Quy trình gì?",
          en: "Supply chain security: prevent SolarWinds-style attacks (compromised vendor)? Process?",
        },
        expectedKeyPoints: [
          {
            vi: "Vendor assessment: audit vendor security practices, incident history, SLAs",
            en: "Vendor assessment: audit security practices, incident history, SLAs",
          },
          {
            vi: "Dependency scanning: nhận diện phiên bản, detect vulnerabilities, stay updated",
            en: "Dependency scanning: identify versions, detect CVEs, stay current",
          },
          {
            vi: "Isolation: run vendor code ở môi trường isolated, monitor behavior, restrict permissions",
            en: "Isolation: run vendor code isolated, monitor behavior, restrict permissions",
          },
          {
            vi: "Monitoring: detect unusual activity từ vendor software, alert on anomalies",
            en: "Monitoring: detect unusual activity, alert on anomalies",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết phòng chống chung. 5-7: nêu được risk nhưng mitigation vào vở. 8-10: strategy đầy đủ: assess + scan + isolate + monitor.",
            en: "0-4: generic prevention only. 5-7: risk identified but mitigation vague. 8-10: full strategy: assess, scan, isolate, monitor.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Supply chain security là Senior/Staff concern.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Trong SSL/TLS handshake, bước nào xác định cipher suite sẽ dùng?",
          en: "In SSL/TLS handshake, which step determines the cipher suite?",
        },
        options: [
          { vi: "ClientHello", en: "ClientHello" },
          { vi: "ServerHello", en: "ServerHello" },
          { vi: "Certificate", en: "Certificate" },
          { vi: "Finished", en: "Finished" },
        ],
        correctOptionIndex: 1,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Hiểu TLS handshake sequence.",
        },
      },
      {
        type: "open",
        question: {
          vi: "Phòng chống side-channel attacks (timing attack, power analysis): kỹ thuật nào?",
          en: "Prevent side-channel attacks (timing, power analysis): techniques?",
        },
        expectedKeyPoints: [
          {
            vi: "Timing attack: dùng constant-time algorithms, không early return",
            en: "Timing: use constant-time algorithms, no early returns",
          },
          {
            vi: "Power analysis: thêm noise, masking, blinding",
            en: "Power: add noise, masking, blinding",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: không biết side-channel. 5-7: biết khái niệm. 8-10: nêu được kỹ thuật cụ thể.",
            en: "0-4: unfamiliar. 5-7: concept known. 8-10: specific techniques.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Advanced cryptography Senior.",
        },
        requiresPractice: false,
      },
    ],
    staff: [
      {
        type: "open",
        question: {
          vi: "Xây dựng chiến lược bảo mật dài hạn: threat identification, prevention, detection, response. Cân nhắc cost, team, compliance.",
          en: "Design long-term security strategy: threats, prevention, detection, response. Consider cost, team, compliance.",
        },
        expectedKeyPoints: [
          {
            vi: "Threat landscape: external (attacker), internal (misconfiguration), supply chain",
            en: "Threats: external attackers, internal misconfig, supply chain",
          },
          {
            vi: "Prevention: secure SDLC, code review, dependency scanning, training",
            en: "Prevention: secure SDLC, code review, scanning, training",
          },
          {
            vi: "Detection: SIEM, endpoint monitoring, log aggregation, anomaly detection",
            en: "Detection: SIEM, endpoint monitoring, log aggregation, anomalies",
          },
          {
            vi: "Response: incident response plan, runbooks, post-mortems, continuous learning",
            en: "Response: incident plans, runbooks, post-mortems, continuous learning",
          },
          {
            vi: "Budget: prevention > detection > response (~80-15-5)",
            en: "Budget split: prevention > detection > response (~80-15-5)",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ liệt kê công cụ. 5-7: có chiến lược nhưng thiếu trade-off. 8-10: chiến lược tổng thể với budget allocation.",
            en: "0-4: lists tools only. 5-7: strategy but misses trade-offs. 8-10: holistic with budget allocation.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Chiến lược bảo mật org-wide Staff-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Incident response: quy trình từ detection → containment → eradication → recovery. Cân bằng tốc độ vs độ chính xác?",
          en: "Incident response: detection → containment → eradication → recovery. Balance speed vs accuracy?",
        },
        expectedKeyPoints: [
          {
            vi: "Detection: alert quickly nhưng false positive cao làm mất tin tưởng",
            en: "Detection: quick alerts but high false positives erode trust",
          },
          {
            vi: "Containment: nhanh hạn chế damage, nhưng cũng có thể block legitimate traffic",
            en: "Containment: fast limits damage, but can block legitimate traffic",
          },
          {
            vi: "Tradeoff: tốc độ trong 5 phút đầu vs độ chính xác sau 1h deeper investigation",
            en: "Trade-off: speed in first 5 mins vs accuracy after 1h investigation",
          },
          {
            vi: "Plan: runbook fast-path (auto-containment), manual verification parallel",
            en: "Plan: runbook fast-path (auto-contain), manual verification in parallel",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết quy trình. 5-7: nêu được tradeoff nhưng solution vào vở. 8-10: tradeoff rõ ràng kèm plan cân bằng.",
            en: "0-4: process only. 5-7: trade-off identified but vague. 8-10: trade-off clear with balanced plan.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Incident response decision-making Staff-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Xây dựng security culture tổ chức: từ leadership commitment đến employee training. KPI gì để đo?",
          en: "Build org security culture: leadership commitment to employee training. KPIs to measure?",
        },
        expectedKeyPoints: [
          {
            vi: "Leadership: commit time, budget, example hành động an toàn",
            en: "Leadership: time, budget, modeling safe behavior",
          },
          {
            vi: "Training: regular, relevant, hands-on, không chỉ compliance checkbox",
            en: "Training: regular, relevant, hands-on, not just compliance",
          },
          {
            vi: "KPI: phishing click rate, vulnerability disclosure, incident response time, employee satisfaction",
            en: "KPIs: phishing clicks, vulnerability reports, response time, satisfaction",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết training. 5-7: leadership + training nhưng KPI vào vở. 8-10: đầy đủ: leadership + training + KPI.",
            en: "0-4: training only. 5-7: leadership and training, vague KPI. 8-10: full with KPIs.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Security culture là Staff/CISO concern.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Quan hệ giữa bảo mật và business: risk tolerance, cost-benefit tradeoff, stakeholder communication?",
          en: "Security and business: risk tolerance, cost-benefit trade-off, stakeholder communication?",
        },
        expectedKeyPoints: [
          {
            vi: "Risk tolerance: business xác định chứ không IT, dựa trên impact và likelihood",
            en: "Risk tolerance: business defines, not IT, based on impact and likelihood",
          },
          {
            vi: "Cost-benefit: security là investment, không expense, measure ROI",
            en: "Cost-benefit: security is investment, measure ROI",
          },
          {
            vi: "Communication: translate risk to business language (impact $, customer trust), không technical jargon",
            en: "Communication: translate risk to business terms ($, trust), not jargon",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết technical security. 5-7: liên quan business nhưng chưa rõ. 8-10: rõ ràng: risk tolerance + ROI + communication.",
            en: "0-4: technical only. 5-7: business related but vague. 8-10: clear: tolerance, ROI, communication.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Business acumen Staff/leadership.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "GDPR và compliance: nếu bị breach phải notify users trong thời gian bao lâu?",
          en: "GDPR compliance: how long to notify users after a breach?",
        },
        options: [
          { vi: "Ngay lập tức (immediately)", en: "Immediately" },
          { vi: "Trong 24 giờ (within 24 hours)", en: "Within 24 hours" },
          { vi: "Trong 30 ngày (within 30 days)", en: "Within 30 days" },
          { vi: "Phải báo cáo nhưng timeline tùy vào risk", en: "Must report but timeline depends on risk" },
        ],
        correctOptionIndex: 3,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Compliance Staff/legal.",
        },
      },
    ],
  },
};
