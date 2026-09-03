import "server-only";

import type { SpecialtyBank } from "./types";

/**
 * Web Development — the flagship specialty bank.
 *
 * `id` matches the `web-development` specialty in src/lib/domains.ts. That
 * pairing is what routes a candidate who picked "Web Development" here rather
 * than to ./general.
 *
 * The React/TypeScript/CSS/Next.js questions below carry over from the
 * previous flat bank, which was web-focused in content but keyed only by
 * level and therefore served to all nine tech specialties. The stack-agnostic
 * questions that used to sit alongside them moved to ./general; the
 * distributed-systems ones moved to ./software-development.
 */
export const webDevelopmentBank: SpecialtyBank = {
  id: "web-development",
  label: "Web Development",
  questions: {
    junior: [
      {
        type: "open",
        question: {
          vi: "Khi nào thì một component là Controlled Component và khi nào là Uncontrolled Component trong React? Hãy cho ví dụ từng cái.",
          en: "When is a component a Controlled Component and when is it Uncontrolled in React? Give examples of each.",
        },
        expectedKeyPoints: [
          {
            vi: "Controlled: form value được quản lý bởi React state, mỗi thay đổi cập nhật state",
            en: "Controlled: form value is managed by React state; each change updates the state",
          },
          {
            vi: "Uncontrolled: form value nằm trực tiếp trên DOM, React không quản lý nó",
            en: "Uncontrolled: form value lives on the DOM; React does not manage it",
          },
          {
            vi: "Ví dụ Controlled: input với onChange/value. Ví dụ Uncontrolled: input với useRef.current.value",
            en: "Controlled example: input with onChange/value. Uncontrolled: input with useRef.current.value",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: không phân biệt được hai loại. 5-7: phân biệt đúng nhưng ví dụ thiếu chi tiết. 8-10: phân biệt rõ ràng kèm ví dụ code chính xác.",
            en: "0-4: cannot distinguish the two. 5-7: distinguishes correctly but examples lack detail. 8-10: clear distinction with accurate code examples.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Kiến thức nền tảng về form handling trong React.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Sự khác biệt giữa `useState` và `useRef` trong React là gì? Khi nào bạn sẽ chọn dùng `useRef` thay vì `useState`?",
          en: "What is the difference between `useState` and `useRef` in React? When would you reach for `useRef` instead of `useState`?",
        },
        expectedKeyPoints: [
          {
            vi: "useState trigger re-render, useRef thì không",
            en: "useState triggers a re-render, useRef does not",
          },
          {
            vi: "useRef giữ giá trị mutable xuyên suốt vòng đời component",
            en: "useRef holds a mutable value across the component's whole lifetime",
          },
          {
            vi: "Ví dụ dùng useRef: tham chiếu DOM node, lưu giá trị không cần hiển thị lên UI",
            en: "useRef examples: referencing a DOM node, storing a value the UI never displays",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: nhầm lẫn công dụng hai hook. 5-7: phân biệt đúng nhưng thiếu ví dụ. 8-10: phân biệt đúng kèm ví dụ thực tế hợp lý.",
            en: "0-4: confuses what the two hooks do. 5-7: distinguishes them but gives no example. 8-10: distinguishes them with a sound real example.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Kiến thức nền tảng về React hooks, phù hợp Junior.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "`key` prop trong danh sách React dùng để làm gì? Điều gì xảy ra nếu bạn dùng index của mảng làm `key`?",
          en: "What is the `key` prop for in a React list? What goes wrong if you use the array index as the `key`?",
        },
        expectedKeyPoints: [
          {
            vi: "key giúp React nhận diện phần tử nào thay đổi/thêm/xoá giữa các lần render",
            en: "key lets React identify which items changed, were added, or removed between renders",
          },
          {
            vi: "Dùng index làm key có thể gây lỗi state khi thứ tự phần tử thay đổi (thêm/xoá/sắp xếp lại)",
            en: "Index-as-key causes state bugs when item order changes (insert, delete, reorder)",
          },
          {
            vi: "Nên dùng id ổn định của dữ liệu thay vì index khi danh sách có thể thay đổi thứ tự",
            en: "Use a stable data id rather than the index whenever the list can reorder",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: không biết vai trò của key. 5-7: biết vai trò nhưng không nêu được rủi ro của index-as-key. 8-10: nêu đúng rủi ro kèm ví dụ cụ thể.",
            en: "0-4: does not know what key is for. 5-7: knows the role but cannot name the index-as-key risk. 8-10: names the risk with a concrete example.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Kiến thức nền tảng về reconciliation trong React.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Vì sao nên dùng thẻ HTML ngữ nghĩa (`<button>`, `<nav>`, `<main>`) thay vì `<div>` gắn sự kiện click? Hãy nêu ít nhất hai hệ quả cụ thể.",
          en: "Why use semantic HTML (`<button>`, `<nav>`, `<main>`) instead of a `<div>` with a click handler? Give at least two concrete consequences.",
        },
        expectedKeyPoints: [
          {
            vi: "Screen reader thông báo đúng vai trò của phần tử, div không có vai trò gì",
            en: "A screen reader announces the correct role; a div has no role at all",
          },
          {
            vi: "Thẻ button hỗ trợ sẵn bàn phím (Enter/Space, tab focus) mà div phải tự thêm tabindex và xử lý phím",
            en: "button gets keyboard support free (Enter/Space, tab focus); a div needs tabindex and key handlers",
          },
          {
            vi: "Cải thiện khả năng hiểu cấu trúc trang cho công cụ tìm kiếm và cho chính người đọc code",
            en: "Improves page structure for search engines and for whoever reads the code next",
          },
          {
            vi: "Muốn giữ hành vi tương đương với div thì phải thêm role, tabindex và keydown handler — nhiều việc hơn và dễ sai",
            en: "Matching the behaviour with a div means role, tabindex and keydown handlers — more work, easily wrong",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ nói 'chuẩn hơn' mà không nêu hệ quả. 5-7: nêu được một hệ quả cụ thể. 8-10: nêu được ít nhất hai hệ quả, trong đó có accessibility hoặc hỗ trợ bàn phím.",
            en: "0-4: just says it is 'more correct' with no consequence. 5-7: names one concrete consequence. 8-10: names at least two, including accessibility or keyboard support.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning:
            "Kiến thức HTML/accessibility nền tảng, cần có ngay từ Junior frontend.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Trong CSS Flexbox, thuộc tính nào dùng để căn giữa các item theo trục chính (main axis) khi `flex-direction` là `row`?",
          en: "In CSS Flexbox, which property centres items along the main axis when `flex-direction` is `row`?",
        },
        options: [
          { vi: "justify-content", en: "justify-content" },
          { vi: "align-items", en: "align-items" },
          { vi: "align-self", en: "align-self" },
          { vi: "flex-wrap", en: "flex-wrap" },
        ],
        correctOptionIndex: 0,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Kiến thức nền tảng về Flexbox layout.",
        },
      },
      {
        type: "open",
        question: {
          vi: "So sánh event delegation và direct event binding trong JavaScript/React. Khi nào nên dùng cái nào?",
          en: "Compare event delegation and direct event binding in JavaScript/React. When should you use which?",
        },
        expectedKeyPoints: [
          {
            vi: "Direct binding: gắn listener trực tiếp trên phần tử, chính xác nhưng có chi phí nếu nhiều phần tử",
            en: "Direct binding: attach a listener to each element, precise but costly with many elements",
          },
          {
            vi: "Event delegation: gắn listener trên parent, xử lý bubble event từ con, tiết kiệm memory",
            en: "Event delegation: attach to a parent, handle bubbled events, saves memory",
          },
          {
            vi: "Dùng delegation cho danh sách động (item có thể thêm/xoá), dùng direct khi item ít hoặc cần chính xác",
            en: "Use delegation for dynamic lists (items added/removed); use direct for static or where accuracy is critical",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết một cách. 5-7: so sánh hai cách nhưng ví dụ không rõ. 8-10: so sánh rõ ràng kèm trường hợp sử dụng phù hợp.",
            en: "0-4: knows only one approach. 5-7: compares them but lacks clear examples. 8-10: clear comparison with appropriate use cases.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Kiến thức nền tảng về event handling trong web.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Với `box-sizing: border-box`, một phần tử có `width: 200px; padding: 20px; border: 5px solid` sẽ chiếm chiều rộng tổng cộng bao nhiêu?",
          en: "With `box-sizing: border-box`, how wide in total is an element with `width: 200px; padding: 20px; border: 5px solid`?",
        },
        options: [
          { vi: "200px", en: "200px" },
          { vi: "240px", en: "240px" },
          { vi: "250px", en: "250px" },
          { vi: "220px", en: "220px" },
        ],
        correctOptionIndex: 0,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning:
            "Hiểu đúng box model là điều kiện cần để làm layout CSS không bị lệch.",
        },
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Trong HTML, khi nào nên dùng `<section>` thay vì `<div>`?",
          en: "In HTML, when should you use `<section>` instead of `<div>`?",
        },
        options: [
          { vi: "Luôn dùng thay cho div vì nó ngữ nghĩa hơn", en: "Always use it instead of div because it is more semantic" },
          { vi: "Khi section này là một phần có ý nghĩa riêng của trang, có thể có heading của riêng nó", en: "When this is a meaningful section of the page with its own content and potentially its own heading" },
          { vi: "Chỉ dùng khi bạn cần group styling", en: "Only when you need to group styling" },
          { vi: "Không nên dùng, nó không có lợi ích gì so với div", en: "Never use it; it has no benefit over div" },
        ],
        correctOptionIndex: 1,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "EASY",
          reasoning: "Hiểu đúng khi dùng semantic HTML tags trong thực tế.",
        },
      },
    ],
    mid: [
      {
        type: "open",
        question: {
          vi: "Bạn có component `UserList` nhận props `users: User[]` và callback `onSelect: (id: string) => void`. Mỗi khi component cha re-render vì một state không liên quan thay đổi, toàn bộ `UserList` và các item con đều re-render theo, dù `users` không đổi. Giải thích nguyên nhân và cách bạn tối ưu, kèm cách type props bằng TypeScript.",
          en: "You have a `UserList` component taking `users: User[]` and a callback `onSelect: (id: string) => void`. Whenever the parent re-renders due to unrelated state, the whole `UserList` and its children re-render too, even though `users` is unchanged. Explain why, how you would optimise it, and how you would type the props in TypeScript.",
        },
        expectedKeyPoints: [
          {
            vi: "Callback prop được tạo mới mỗi lần render khiến React.memo không hiệu quả",
            en: "The callback prop is recreated each render, defeating React.memo",
          },
          {
            vi: "Dùng useCallback để giữ tham chiếu ổn định",
            en: "Use useCallback to keep the reference stable",
          },
          {
            vi: "Bọc component con bằng React.memo",
            en: "Wrap the child component in React.memo",
          },
          {
            vi: "Cân nhắc useMemo nếu users là dữ liệu tính toán lại",
            en: "Consider useMemo if users is recomputed data",
          },
          {
            vi: "Nêu được trade-off: chỉ tối ưu khi list lớn / render tốn kém",
            en: "States the trade-off: only optimise when the list is large or rendering is expensive",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ nhận diện hiện tượng. 4-6: giải thích đúng nguyên nhân + 1 giải pháp. 7-8: đầy đủ useCallback+React.memo+type props. 9-10: thêm phân tích trade-off và đề cập profiling trước khi tối ưu.",
            en: "0-3: only describes the symptom. 4-6: explains the cause plus one fix. 7-8: full useCallback + React.memo + typed props. 9-10: adds the trade-off analysis and profiling before optimising.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Đòi hỏi hiểu cơ chế render + kỹ thuật tối ưu phổ biến, đúng tầm Mid-level Frontend.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Generic trong TypeScript giúp ích gì khi viết một custom hook như `useFetch<T>`? Hãy phác thảo signature của hook này và giải thích lý do.",
          en: "What do TypeScript generics buy you when writing a custom hook like `useFetch<T>`? Sketch the hook's signature and explain your reasoning.",
        },
        expectedKeyPoints: [
          {
            vi: "Generic cho phép hook tái sử dụng với nhiều kiểu dữ liệu trả về khác nhau mà vẫn giữ type-safety",
            en: "Generics let one hook serve many return types while staying type-safe",
          },
          {
            vi: "Không dùng any/unknown ép kiểu, tránh mất type-checking ở nơi gọi",
            en: "Avoids casting through any/unknown, which would lose type checking at the call site",
          },
          {
            vi: "Ví dụ signature hợp lý: function useFetch<T>(url: string): { data: T | null; isLoading: boolean; error: string | null }",
            en: "A sound signature: function useFetch<T>(url: string): { data: T | null; isLoading: boolean; error: string | null }",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: không dùng generic, ép kiểu any. 5-7: dùng generic đúng nhưng signature chưa đầy đủ trạng thái loading/error. 8-10: signature đầy đủ, giải thích rõ lợi ích type-safety.",
            en: "0-4: no generics, casts to any. 5-7: uses generics but the signature lacks loading/error state. 8-10: complete signature with a clear type-safety rationale.",
          },
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
        question: {
          vi: "So sánh Context API và một thư viện state management ngoài (Zustand/Redux) khi dùng cho một form nhiều bước (multi-step form) có validate chéo giữa các bước.",
          en: "Compare the Context API against an external state library (Zustand/Redux) for a multi-step form with cross-step validation.",
        },
        expectedKeyPoints: [
          {
            vi: "Context API dễ gây re-render toàn cây con khi value thay đổi thường xuyên",
            en: "Context re-renders the whole subtree whenever its value changes frequently",
          },
          {
            vi: "Zustand/Redux tách state ra ngoài React tree, chọn lọc re-render qua selector",
            en: "Zustand/Redux keep state outside the React tree and re-render selectively via selectors",
          },
          {
            vi: "Với form nhiều bước, cần cân nhắc validate chéo cần đọc state từ nhiều bước cùng lúc",
            en: "Cross-step validation needs to read state from several steps at once",
          },
          {
            vi: "Kết luận hợp lý tuỳ quy mô: Context đủ dùng cho form nhỏ, store ngoài phù hợp form phức tạp",
            en: "Concludes by scale: Context suffices for a small form, an external store fits a complex one",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết một giải pháp. 5-7: so sánh đúng ưu nhược điểm cơ bản. 8-10: so sánh sâu kèm khuyến nghị theo quy mô cụ thể.",
            en: "0-4: knows only one option. 5-7: compares the basic pros and cons. 8-10: compares deeply and recommends by concrete scale.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "Yêu cầu so sánh đánh đổi công cụ ở một tình huống cụ thể.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: 'Trong Next.js App Router, khi nào bạn giữ một component là Server Component và khi nào buộc phải thêm `"use client"`? Việc đặt `"use client"` sai chỗ gây hậu quả gì?',
          en: 'In the Next.js App Router, when do you keep a component a Server Component and when must you add `"use client"`? What happens if the boundary is placed wrongly?',
        },
        expectedKeyPoints: [
          {
            vi: "Server Component là mặc định; chỉ thêm use client khi cần state, effect, event handler hoặc API của trình duyệt",
            en: "Server Components are the default; add use client only for state, effects, event handlers, or browser APIs",
          },
          {
            vi: "use client đánh dấu ranh giới: mọi component con được import từ đó cũng vào bundle client",
            en: "use client marks a boundary: every component imported below it also enters the client bundle",
          },
          {
            vi: "Đặt use client quá cao trong cây khiến phần lớn ứng dụng mất lợi ích Server Component và tăng JS gửi xuống",
            en: "Placing it too high loses the Server Component benefit and ships far more JavaScript",
          },
          {
            vi: "Cách xử lý đúng là đẩy ranh giới xuống thấp nhất có thể, hoặc truyền Server Component qua children/props",
            en: "The fix is pushing the boundary as low as possible, or passing Server Components through children/props",
          },
          {
            vi: "Server Component có thể truy cập trực tiếp dữ liệu server mà không lộ secret ra client",
            en: "Server Components can reach server data directly without leaking secrets to the client",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: không phân biệt được hai loại. 4-6: phân biệt đúng nhưng không nêu tính lan truyền của ranh giới. 7-8: nêu đúng ranh giới và hậu quả bundle. 9-10: thêm kỹ thuật đẩy ranh giới xuống thấp hoặc truyền qua children.",
            en: "0-3: cannot tell the two apart. 4-6: distinguishes them but misses that the boundary propagates. 7-8: gets the boundary and the bundle consequence. 9-10: adds lowering the boundary or passing through children.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning:
            "Kiến thức cốt lõi của Next.js App Router — stack chính của dự án, đúng tầm Mid-level.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Bạn xây dựng một infinite scroll list, mỗi lần cuộn tới cuối sẽ fetch thêm item. Vấn đề gì có thể xảy ra, và bạn kiểm soát nó như thế nào (mà không dùng thư viện)?",
          en: "You build an infinite scroll list that fetches more items when scrolling near the bottom. What can go wrong, and how do you prevent it without a library?",
        },
        expectedKeyPoints: [
          {
            vi: "Vấn đề: fetch được trigger nhiều lần trong khi request vẫn chưa xong",
            en: "Issue: the fetch is triggered multiple times while the previous request is still pending",
          },
          {
            vi: "Kinh điển: race condition khi request A quay lại sau request B, thứ tự item bị lệch",
            en: "Classic: race condition if request A returns after B, items arrive out of order",
          },
          {
            vi: "Giải pháp: dùng flag `isLoading` để chặn fetch mới khi fetch đang chạy",
            en: "Solution: use an `isLoading` flag to prevent new fetches while one is pending",
          },
          {
            vi: "Nâng cao: dùng cleanup function hoặc AbortController để huỷ request cũ khi component unmount",
            en: "Advanced: use a cleanup function or AbortController to cancel old requests on unmount",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết nó fetch thêm. 5-7: nêu được vấn đề race condition. 8-10: nêu rõ vấn đề và cách kiểm soát bằng flag hoặc AbortController.",
            en: "0-4: barely describes the fetch. 5-7: names the race condition issue. 8-10: clearly states the issue and a control method with a flag or AbortController.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "Xử lý race condition là kỹ năng quan trọng cho Mid-level.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Trong React, hook nào phù hợp nhất để memo hoá kết quả của một phép tính tốn kém, tránh tính lại mỗi lần re-render nếu dependencies không đổi?",
          en: "In React, which hook best memoises the result of an expensive computation so it is not recalculated on every render when dependencies are unchanged?",
        },
        options: [
          { vi: "useEffect", en: "useEffect" },
          { vi: "useMemo", en: "useMemo" },
          { vi: "useCallback", en: "useCallback" },
          { vi: "useLayoutEffect", en: "useLayoutEffect" },
        ],
        correctOptionIndex: 1,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "Phân biệt đúng công dụng các hook tối ưu hoá trong React.",
        },
      },
      {
        type: "open",
        question: {
          vi: "CSS-in-JS (styled-components, Emotion) vs CSS Module vs Tailwind: khi nào dùng cái nào? Trade-off giữa chúng là gì?",
          en: "CSS-in-JS (styled-components, Emotion) vs CSS Modules vs Tailwind: when do you use which? What are the trade-offs?",
        },
        expectedKeyPoints: [
          {
            vi: "CSS-in-JS: thành phần và style gắn chặt, dễ xoá khi xoá component, nhưng phải parse CSS lúc runtime",
            en: "CSS-in-JS: components and styles are coupled, easy to delete together, but CSS is parsed at runtime",
          },
          {
            vi: "CSS Module: tách CSS/JS nhưng tránh naming conflict, nhưng cần xây dựng dự phòng CSS",
            en: "CSS Modules: separate CSS and JS, avoid name collisions, but require a build step",
          },
          {
            vi: "Tailwind: style trực tiếp trong HTML/JSX qua class, nhanh phát triển, nhưng HTML dài và khó dùng dynamic style",
            en: "Tailwind: style via classes inline, fast development, but markup bloat and hard to do dynamic styles",
          },
          {
            vi: "Chọn dựa trên quy mô dự án, team familiarity, và yêu cầu performance",
            en: "Choose based on project scale, team familiarity, and performance requirements",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ nêu một cách. 5-7: so sánh hai cách nhưng thiếu trade-off. 8-10: so sánh rõ với trade-off cụ thể.",
            en: "0-4: mentions only one approach. 5-7: compares two but misses the trade-offs. 8-10: compares all three with specific trade-offs.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "MEDIUM",
          reasoning: "Lựa chọn công cụ styling là quyết định kiến trúc hàng ngày.",
        },
        requiresPractice: false,
      },
    ],
    senior: [
      {
        type: "open",
        question: {
          vi: "Thiết kế state management cho một dashboard có nhiều widget độc lập, mỗi widget fetch dữ liệu riêng nhưng cần chia sẻ một số filter chung (khoảng thời gian, khu vực). Bạn sẽ tổ chức state ở đâu, dùng công cụ gì, và đánh đổi giữa Context API, Redux/Zustand, và server state (React Query) ra sao?",
          en: "Design state management for a dashboard of independent widgets, each fetching its own data but sharing some filters (date range, region). Where do you put state, what tools do you use, and how do you weigh Context, Redux/Zustand, and server state (React Query)?",
        },
        expectedKeyPoints: [
          {
            vi: "Tách bạch client state (filter dùng chung) và server state (dữ liệu từng widget)",
            en: "Separate client state (shared filters) from server state (per-widget data)",
          },
          {
            vi: "Đề xuất dùng React Query/SWR cho server state, tránh tự quản lý cache thủ công",
            en: "Use React Query/SWR for server state rather than hand-rolling a cache",
          },
          {
            vi: "Context hoặc store nhẹ (Zustand) cho filter dùng chung, tránh prop drilling",
            en: "Context or a light store (Zustand) for shared filters, avoiding prop drilling",
          },
          {
            vi: "Phân tích khi nào Redux là over-engineering cho bài toán này",
            en: "Explains when Redux is over-engineering for this problem",
          },
          {
            vi: "Đề cập tránh re-render toàn dashboard khi một filter đổi (selector pattern)",
            en: "Avoids re-rendering the whole dashboard when one filter changes (selector pattern)",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: đề xuất một giải pháp duy nhất không phân tích trade-off. 5-7: phân tách đúng client/server state. 8-10: phân tách rõ ràng, chọn công cụ hợp lý, có phân tích performance/re-render.",
            en: "0-4: one solution with no trade-off analysis. 5-7: separates client and server state correctly. 8-10: clean separation, sound tool choice, and re-render/performance analysis.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Yêu cầu tư duy kiến trúc, đánh đổi công cụ và performance ở quy mô nhiều component.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Một trang danh sách sản phẩm bị Largest Contentful Paint (LCP) chậm trên mobile. Bạn sẽ chẩn đoán nguyên nhân theo quy trình nào, và liệt kê 3 hướng tối ưu cụ thể cho Next.js App Router?",
          en: "A product list page has slow Largest Contentful Paint (LCP) on mobile. What diagnostic process do you follow, and what are three concrete optimisations for the Next.js App Router?",
        },
        expectedKeyPoints: [
          {
            vi: "Quy trình chẩn đoán: đo bằng Lighthouse/WebPageTest, xác định phần tử LCP cụ thể",
            en: "Diagnose by measuring with Lighthouse/WebPageTest and identifying the actual LCP element",
          },
          {
            vi: "Kiểm tra ảnh: dùng next/image, ưu tiên preload ảnh LCP, đúng định dạng/kích thước",
            en: "Check images: use next/image, preload the LCP image, correct format and dimensions",
          },
          {
            vi: "Kiểm tra render: Server Components để giảm JS gửi xuống client, tránh waterfall fetch",
            en: "Check rendering: Server Components to cut client JS, and avoid fetch waterfalls",
          },
          {
            vi: "Kiểm tra font: font-display swap, preconnect, tránh layout shift",
            en: "Check fonts: font-display swap, preconnect, and avoid layout shift",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ đoán nguyên nhân không có quy trình đo đạc. 5-7: có quy trình đo + 1-2 hướng tối ưu đúng. 8-10: quy trình rõ ràng kèm ít nhất 3 hướng tối ưu cụ thể, đúng ngữ cảnh Next.js.",
            en: "0-4: guesses with no measurement. 5-7: measures plus one or two valid optimisations. 8-10: a clear process with at least three concrete Next.js-specific optimisations.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Đòi hỏi kinh nghiệm thực chiến về performance profiling và tối ưu ở tầng framework.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Trang của bạn báo lỗi hydration mismatch trong production nhưng không tái hiện được ở local. Bạn khoanh vùng nguyên nhân thế nào, và vì sao loại lỗi này nguy hiểm hơn vẻ ngoài của nó?",
          en: "Your page reports a hydration mismatch in production but you cannot reproduce it locally. How do you isolate the cause, and why is this class of bug more dangerous than it looks?",
        },
        expectedKeyPoints: [
          {
            vi: "Nguyên nhân phổ biến: render phụ thuộc Date/timezone, Math.random, hoặc đọc localStorage/window ngay khi render",
            en: "Common causes: rendering from Date/timezone, Math.random, or reading localStorage/window during render",
          },
          {
            vi: "Khác biệt giữa dữ liệu lúc build/SSR và lúc client mount, ví dụ nội dung phụ thuộc user agent hoặc A/B flag",
            en: "A difference between build/SSR data and client mount, e.g. user-agent or A/B-flag dependent content",
          },
          {
            vi: "Nguy hiểm vì React có thể bỏ qua phần DOM không khớp, dẫn tới UI đúng nhưng event handler không gắn",
            en: "Dangerous because React may discard the mismatched DOM, leaving correct UI with no attached handlers",
          },
          {
            vi: "Cách xử lý: đẩy phần phụ thuộc client vào useEffect, hoặc dùng cờ mounted, hoặc suppressHydrationWarning đúng phạm vi hẹp",
            en: "Fix by moving client-dependent work into useEffect, using a mounted flag, or a tightly scoped suppressHydrationWarning",
          },
          {
            vi: "Tái hiện bằng cách chạy production build cục bộ thay vì dev server, vì dev có hành vi khác",
            en: "Reproduce with a local production build rather than the dev server, which behaves differently",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ biết đó là lỗi SSR. 4-6: nêu được một vài nguyên nhân phổ biến. 7-8: có quy trình khoanh vùng và cách xử lý đúng phạm vi. 9-10: giải thích được vì sao hậu quả nghiêm trọng hơn cảnh báo trên console.",
            en: "0-3: only knows it is an SSR error. 4-6: names a few common causes. 7-8: has an isolation process and a properly scoped fix. 9-10: explains why the consequence exceeds a console warning.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Lỗi SSR khó tái hiện, đòi hỏi hiểu sâu vòng đời hydration — tầm Senior.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Bundle JavaScript của ứng dụng đã lên 1.2MB gzip và tiếp tục tăng mỗi sprint. Bạn xây dựng chiến lược kiểm soát thế nào để nó không tăng trở lại sau khi đã tối ưu một lần?",
          en: "The app's JavaScript bundle has reached 1.2MB gzipped and grows every sprint. How do you build a strategy so it does not creep back after a single round of optimisation?",
        },
        expectedKeyPoints: [
          {
            vi: "Trước hết đo và quy trách nhiệm: dùng bundle analyzer để biết thư viện nào chiếm bao nhiêu",
            en: "Measure and attribute first: use a bundle analyzer to see which libraries cost what",
          },
          {
            vi: "Tách theo route và lazy-load các nhánh ít dùng thay vì tối ưu dàn trải",
            en: "Split by route and lazy-load rare branches instead of optimising uniformly",
          },
          {
            vi: "Thay thế hoặc loại bỏ thư viện nặng khi phần dùng đến rất nhỏ",
            en: "Replace or drop heavy libraries when only a sliver is used",
          },
          {
            vi: "Đặt performance budget và gắn kiểm tra tự động vào CI để PR làm vượt ngưỡng bị chặn",
            en: "Set a performance budget and enforce it in CI so a PR exceeding it is blocked",
          },
          {
            vi: "Theo dõi bằng số liệu người dùng thật (RUM) chứ không chỉ số liệu phòng thí nghiệm",
            en: "Track with real-user monitoring, not only lab metrics",
          },
          {
            vi: "Nhấn mạnh: nếu không có guardrail tự động thì bundle sẽ phình lại sau vài sprint",
            en: "Notes that without an automated guardrail the bundle regrows within a few sprints",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ liệt kê mẹo giảm bundle. 4-6: có đo đạc và code-splitting. 7-8: thêm performance budget. 9-10: có cơ chế tự động trong CI và theo dõi bằng dữ liệu người dùng thật.",
            en: "0-3: lists bundle-shrinking tips. 4-6: measures and code-splits. 7-8: adds a performance budget. 9-10: automates it in CI and tracks real-user data.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Yêu cầu chuyển từ tối ưu một lần sang cơ chế duy trì lâu dài — tư duy tầm Senior.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Quản lý complexity trong một component lớn: khi nào bạn chia nhỏ thành subcomponent, khi nào dùng custom hook, và khi nào dùng cả hai?",
          en: "Managing complexity in a large component: when do you split into subcomponents, when do you extract a custom hook, and when do you do both?",
        },
        expectedKeyPoints: [
          {
            vi: "Subcomponent: khi logic được nhóm lại với một phần UI riêng biệt, tách để tái sử dụng hoặc test",
            en: "Subcomponent: when logic is grouped with a distinct UI fragment, separated for reuse or testing",
          },
          {
            vi: "Custom hook: khi logic có thể tái sử dụng độc lập với UI (trích xuất state/effect)",
            en: "Custom hook: when stateful logic can be reused independently of UI (extract state and effects)",
          },
          {
            vi: "Cả hai: stateful logic trích thành hook, component trích để dùng hook đó và render UI riêng",
            en: "Both: extract stateful logic as a hook, extract component to use the hook and render its own UI",
          },
          {
            vi: "Dấu hiệu chia nhỏ: component khó test, render props ngoài khả năng hiểu được",
            en: "Signs to split: hard to test, render output becomes hard to follow",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ biết một cách chia nhỏ. 5-7: nêu được subcomponent và hook nhưng không rõ khi nào dùng. 8-10: phân biệt rõ ràng kèm ví dụ khi dùng cả hai.",
            en: "0-4: knows only one extraction approach. 5-7: names subcomponent and hook but unclear on when. 8-10: clear distinction with examples of when to use both.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Điều này là về thiết kế component, kỹ năng kiến trúc của Senior.",
        },
        requiresPractice: false,
      },
      {
        type: "multiple_choice",
        question: {
          vi: "Chỉ số Core Web Vitals nào đo mức độ ổn định của bố cục trang, tức là các phần tử nhảy vị trí ngoài ý muốn trong quá trình tải?",
          en: "Which Core Web Vitals metric measures visual stability — elements shifting position unexpectedly during load?",
        },
        options: [
          {
            vi: "LCP (Largest Contentful Paint)",
            en: "LCP (Largest Contentful Paint)",
          },
          {
            vi: "INP (Interaction to Next Paint)",
            en: "INP (Interaction to Next Paint)",
          },
          {
            vi: "CLS (Cumulative Layout Shift)",
            en: "CLS (Cumulative Layout Shift)",
          },
          { vi: "TTFB (Time To First Byte)", en: "TTFB (Time To First Byte)" },
        ],
        correctOptionIndex: 2,
        maxScore: 10,
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Phân biệt đúng các chỉ số Core Web Vitals là điều kiện cần để tối ưu có mục tiêu.",
        },
      },
      {
        type: "open",
        question: {
          vi: "Giải thích sự khác biệt giữa Progressive Enhancement và Graceful Degradation. Khi nào nên dùng cái nào, đặc biệt với JavaScript?",
          en: "Explain Progressive Enhancement vs Graceful Degradation. When should you use which, especially with JavaScript?",
        },
        expectedKeyPoints: [
          {
            vi: "Progressive Enhancement: xây dựng tính năng cơ bản trước (HTML), sau đó thêm JS để nâng cao",
            en: "Progressive Enhancement: build basic functionality first (HTML), then layer JS on top",
          },
          {
            vi: "Graceful Degradation: xây dựng cho trình duyệt hiện đại rồi lo cách fallback cho trình duyệt cũ",
            en: "Graceful Degradation: build for modern browsers, then add fallbacks for older ones",
          },
          {
            vi: "Progressive Enhancement: form còn hoạt động nếu JS bị block/lỗi, tốt hơn cho accessibility",
            en: "Progressive Enhancement: forms still work if JS fails or is blocked, better for accessibility",
          },
          {
            vi: "Graceful Degradation: dễ dàng hơn vì không cần cân nhắc trường hợp không JS",
            en: "Graceful Degradation: easier because no need to consider no-JS scenarios",
          },
          {
            vi: "Thực tế: Progressive Enhancement phù hợp hơn cho trang nội dung, Graceful Degradation cho ứng dụng web phức tạp",
            en: "In practice: PE fits content sites better, GD fits complex web apps",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: nhầm lẫn hai khái niệm. 5-7: phân biệt đúng nhưng không biết khi nào dùng. 8-10: phân biệt rõ ràng kèm trường hợp sử dụng phù hợp.",
            en: "0-4: confuses the two concepts. 5-7: distinguishes correctly but unsure when to use. 8-10: clear distinction with appropriate contexts.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Kiến thức về web fundamentals và tư duy design ở tầm Senior.",
        },
        requiresPractice: false,
      },
    ],
    staff: [
      {
        type: "open",
        question: {
          vi: "Bạn được giao dẫn dắt việc tách một monolith Next.js front-end (một team, một repo) thành kiến trúc module hoá cho nhiều team cùng phát triển song song mà không giẫm chân nhau. Bạn sẽ định nghĩa ranh giới module như thế nào, enforce nó ra sao (tooling/CI), và xử lý các phần dùng chung (design system, auth) thế nào để tránh trở thành nút thắt cổ chai?",
          en: "You are asked to lead splitting a Next.js front-end monolith (one team, one repo) into a modular architecture so several teams can work in parallel without colliding. How do you define module boundaries, enforce them (tooling/CI), and handle shared pieces (design system, auth) so they do not become a bottleneck?",
        },
        expectedKeyPoints: [
          {
            vi: "Định nghĩa ranh giới theo domain/nghiệp vụ, không theo layer kỹ thuật",
            en: "Draw boundaries by business domain, not by technical layer",
          },
          {
            vi: "Đề xuất enforce bằng lint rule (import boundaries) hoặc codeowners, không chỉ dựa vào quy ước",
            en: "Enforce with lint rules on imports or CODEOWNERS, not convention alone",
          },
          {
            vi: "Chiến lược versioning cho shared packages (design system) để không block các team khác",
            en: "A versioning strategy for shared packages so other teams are never blocked",
          },
          {
            vi: "Cân nhắc giữa monorepo (workspaces) và multi-repo, đánh đổi CI/CD",
            en: "Weighs monorepo workspaces against multi-repo, including the CI/CD trade-off",
          },
          {
            vi: "Kế hoạch di trú tăng dần (incremental migration), không big-bang rewrite",
            en: "An incremental migration plan rather than a big-bang rewrite",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-4: chỉ dừng ở tách file/folder. 5-7: có chiến lược ranh giới và shared code hợp lý. 8-10: thêm cơ chế enforce tự động và kế hoạch di trú an toàn.",
            en: "0-4: stops at moving files and folders. 5-7: a sound boundary and shared-code strategy. 8-10: adds automated enforcement and a safe migration plan.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Vấn đề tổ chức kiến trúc multi-team, vượt khỏi phạm vi kỹ thuật thuần tuý — tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Công ty có bốn team frontend, mỗi team đang tự dựng component riêng cho cùng những thứ như button, modal, form field. Bạn xây dựng design system dùng chung thế nào để nó thực sự được dùng, thay vì thành thư viện thứ năm không ai đụng tới?",
          en: "Four frontend teams are each building their own button, modal, and form field. How do you build a shared design system that actually gets adopted, rather than becoming a fifth library nobody touches?",
        },
        expectedKeyPoints: [
          {
            vi: "Bắt đầu từ nhu cầu có thật: trích xuất các component đã trùng lặp thay vì thiết kế trước rồi ép dùng",
            en: "Start from real demand: extract already-duplicated components rather than designing upfront and mandating use",
          },
          {
            vi: "Cho phép mở rộng: component phải nhận được style/behavior override, nếu quá cứng thì team sẽ tự fork",
            en: "Allow extension: components must accept style/behaviour overrides, or teams will fork them",
          },
          {
            vi: "Mô hình sở hữu rõ ràng, có đường đóng góp ngược để team không bị chặn khi thiếu component",
            en: "Clear ownership plus a contribution path so a missing component never blocks a team",
          },
          {
            vi: "Versioning và changelog để nâng cấp không phá vỡ ứng dụng đang chạy",
            en: "Versioning and a changelog so upgrades do not break running apps",
          },
          {
            vi: "Đo mức độ áp dụng bằng số liệu thật (tỷ lệ component dùng chung trên tổng số)",
            en: "Measure adoption with real numbers (share of shared components in use)",
          },
          {
            vi: "Chấp nhận rằng bắt buộc dùng bằng mệnh lệnh sẽ thất bại nếu trải nghiệm dùng kém hơn tự viết",
            en: "Accepts that mandating adoption fails if the experience is worse than writing it yourself",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ mô tả nội dung kỹ thuật của design system. 4-6: có mô hình sở hữu và versioning. 7-8: thêm đường đóng góp ngược và khả năng mở rộng. 9-10: có chiến lược áp dụng dựa trên số liệu và nhận ra rào cản tổ chức.",
            en: "0-3: only describes the design system's technical content. 4-6: has ownership and versioning. 7-8: adds a contribution path and extensibility. 9-10: has a data-driven adoption strategy and names the organisational barrier.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Bài toán quản trị nền tảng dùng chung nhiều team — đúng phạm vi Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Bạn muốn nâng cấp toàn bộ ứng dụng lên một phiên bản framework mới có breaking change, trong khi ba team vẫn đang ra tính năng liên tục. Kế hoạch của bạn là gì, và bạn thuyết phục ban lãnh đạo cấp thời gian cho việc này thế nào?",
          en: "You want to upgrade the whole application to a new framework major with breaking changes, while three teams keep shipping features. What is your plan, and how do you convince leadership to fund the time?",
        },
        expectedKeyPoints: [
          {
            vi: "Khảo sát mức độ ảnh hưởng bằng codemod hoặc quét tự động trước khi ước lượng thời gian",
            en: "Survey the blast radius with codemods or automated scanning before estimating",
          },
          {
            vi: "Nâng cấp tăng dần theo route/module, giữ hai phiên bản cùng tồn tại nếu framework cho phép",
            en: "Upgrade incrementally by route or module, running both versions side by side if the framework allows",
          },
          {
            vi: "Dùng codemod và lint rule để phần lớn thay đổi cơ học không tốn thời gian người",
            en: "Use codemods and lint rules so mechanical changes cost no human time",
          },
          {
            vi: "Có cổng an toàn: feature flag, canary release, và đường rollback rõ ràng",
            en: "Safety gates: feature flags, canary release, and a clear rollback path",
          },
          {
            vi: "Thuyết phục bằng ngôn ngữ rủi ro và chi phí (hết hạn hỗ trợ bảo mật, chi phí bảo trì tăng dần), không bằng lý do kỹ thuật thuần tuý",
            en: "Argue in risk and cost terms (security support ending, rising maintenance), not purely technical ones",
          },
          {
            vi: "Cam kết một mốc thời gian và cách đo tiến độ để lãnh đạo thấy được tiến triển",
            en: "Commit to a timeline and a progress measure leadership can actually see",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: đề xuất dừng phát triển để nâng cấp một lần. 4-6: có kế hoạch tăng dần nhưng thiếu tự động hoá. 7-8: dùng codemod và có đường rollback. 9-10: thêm cách trình bày rủi ro/chi phí phù hợp với ban lãnh đạo và cách đo tiến độ.",
            en: "0-3: proposes a feature freeze for one big upgrade. 4-6: incremental plan but no automation. 7-8: uses codemods and has rollback. 9-10: adds a leadership-appropriate risk/cost case and a progress measure.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Kết hợp kế hoạch kỹ thuật quy mô lớn với việc thuyết phục ngoài phạm vi kỹ thuật — tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Bạn được giao trách nhiệm xây dựng chiến lược learning path cho các frontend dev junior và mid, từ kiến thức nền tảng đến senior-level. Bạn sắp xếp như thế nào?",
          en: "You are asked to design a learning path for junior and mid-level frontend developers to reach seniority. How do you structure it?",
        },
        expectedKeyPoints: [
          {
            vi: "Junior: nền tảng HTML/CSS/JavaScript/React, hiểu component lifecycle, event handling",
            en: "Junior: HTML/CSS/JS fundamentals, component lifecycle, event handling",
          },
          {
            vi: "Mid: performance tuning, accessibility, testing (unit + integration), code patterns",
            en: "Mid: performance, accessibility, testing (unit and integration), design patterns",
          },
          {
            vi: "Senior: kiến trúc, mentoring, cross-platform thinking, system thinking",
            en: "Senior: architecture, mentoring others, cross-platform thinking, systems thinking",
          },
          {
            vi: "Không phải tuyến tính: mid cần hiểu accessibility/testing sớm, không chờ lên senior",
            en: "Not linear: mid should learn accessibility and testing early, not wait for senior",
          },
          {
            vi: "Dùng project thực tế làm bối cảnh học, không chỉ tutorial",
            en: "Use real projects as learning context, not just tutorials",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ liệt kê chủ đề. 4-6: phân chia ba tầm độ hợp lý. 7-8: có trình tự học tập phù hợp. 9-10: nêu rõ overlaps và dùng project thực tế.",
            en: "0-3: lists topics only. 4-6: divides the three levels sensibly. 7-8: has a learning progression. 9-10: explains overlaps and uses real projects.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning: "Thiết kế learning path là trách nhiệm mentorship ở tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Ban lãnh đạo muốn chuyển sang micro-frontend vì nghe nói nó giúp các team độc lập hơn. Bạn đánh giá đề xuất này thế nào, và cái giá kỹ thuật thật sự của nó là gì?",
          en: "Leadership wants to move to micro-frontends because they have heard it makes teams more independent. How do you evaluate that, and what is the real technical cost?",
        },
        expectedKeyPoints: [
          {
            vi: "Hỏi trước vấn đề cần giải quyết là gì: nếu nút thắt là quy trình release chứ không phải kiến trúc thì micro-frontend không chữa được",
            en: "Ask what problem this solves first: if the bottleneck is the release process, not architecture, micro-frontends will not fix it",
          },
          {
            vi: "Cái giá về hiệu năng: mỗi mảnh mang theo bản sao thư viện riêng, tổng dung lượng tải về tăng lên",
            en: "Performance cost: each fragment ships its own copy of shared libraries, so total download grows",
          },
          {
            vi: "Cái giá về trải nghiệm: khó giữ giao diện nhất quán khi mỗi team tự quyết định thành phần của mình",
            en: "Experience cost: keeping a consistent interface is hard when each team owns its own components",
          },
          {
            vi: "Cái giá về vận hành: gỡ lỗi xuyên nhiều mảnh và quản lý phiên bản của phần dùng chung phức tạp hơn hẳn",
            en: "Operational cost: debugging across fragments and versioning shared pieces gets markedly harder",
          },
          {
            vi: "Lựa chọn nhẹ hơn nên thử trước: tách theo route với ranh giới module rõ ràng trong cùng một ứng dụng",
            en: "Try the lighter option first: route-level splitting with clear module boundaries inside one application",
          },
          {
            vi: "Micro-frontend hợp lý khi các team thật sự khác nhau về nhịp phát hành và ít chia sẻ giao diện",
            en: "Micro-frontends fit when teams genuinely differ in release cadence and share little interface surface",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: đồng ý hoặc bác bỏ theo cảm tính. 4-6: nêu được vài chi phí kỹ thuật. 7-8: hỏi ngược lại vấn đề cần giải quyết và đề xuất lựa chọn nhẹ hơn. 9-10: nêu rõ điều kiện khi micro-frontend thật sự phù hợp.",
            en: "0-3: agrees or dismisses on instinct. 4-6: names some technical costs. 7-8: questions the underlying problem and offers a lighter option. 9-10: states the conditions under which micro-frontends genuinely fit.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Đánh giá một xu hướng kiến trúc theo nhu cầu tổ chức thay vì theo mức độ phổ biến — tầm Staff.",
        },
        requiresPractice: false,
      },
      {
        type: "open",
        question: {
          vi: "Sản phẩm của bạn bị khiếu nại về khả năng tiếp cận (accessibility) và cần đạt chuẩn trong sáu tháng. Bạn xây dựng chương trình này thế nào để nó không dừng lại ở một đợt sửa lỗi rồi tái diễn?",
          en: "Your product has received accessibility complaints and must reach compliance within six months. How do you build that programme so it does not end as a one-off fix that regresses?",
        },
        expectedKeyPoints: [
          {
            vi: "Kiểm toán trước để biết mức độ thật, phân loại theo mức ảnh hưởng tới người dùng chứ không theo số lượng lỗi",
            en: "Audit first to learn the real state, ranked by user impact rather than by defect count",
          },
          {
            vi: "Sửa từ lớp nền tảng: các thành phần dùng chung được sửa một lần sẽ lan ra toàn bộ sản phẩm",
            en: "Fix at the foundation: shared components fixed once propagate across the whole product",
          },
          {
            vi: "Đưa kiểm tra tự động vào quy trình để chặn lỗi mới, dù công cụ tự động chỉ bắt được một phần",
            en: "Add automated checks to the pipeline to block new regressions, while accepting tools catch only part",
          },
          {
            vi: "Kiểm thử thủ công bằng bàn phím và trình đọc màn hình cho các luồng quan trọng nhất",
            en: "Manually test the critical flows with keyboard only and with a screen reader",
          },
          {
            vi: "Đào tạo để đội ngũ hiểu lý do, vì sửa xong mà không đổi cách làm thì lỗi sẽ quay lại",
            en: "Train the team on the why, since fixing without changing practice lets the defects return",
          },
          {
            vi: "Tốt nhất là mời người dùng khuyết tật thật kiểm thử, vì tuân thủ chuẩn không đồng nghĩa với dùng được",
            en: "Best of all, involve disabled users in testing — meeting a standard is not the same as being usable",
          },
        ],
        rubric: {
          maxScore: 10,
          criteria: {
            vi: "0-3: chỉ chạy công cụ quét tự động và sửa cảnh báo. 4-6: có kiểm toán và ưu tiên hợp lý. 7-8: sửa ở lớp thành phần dùng chung kèm kiểm tra tự động. 9-10: thêm đào tạo và phân biệt được tuân thủ chuẩn với dùng được thật.",
            en: "0-3: runs an automated scanner and fixes the warnings. 4-6: audits and prioritises sensibly. 7-8: fixes at the shared-component layer with automated checks. 9-10: adds training and separates compliance from genuine usability.",
          },
        },
        difficulty_analysis: {
          suggestedLevel: "HARD",
          reasoning:
            "Chương trình chất lượng dài hạn có ràng buộc pháp lý và cần thay đổi thói quen đội ngũ — tầm Staff.",
        },
        requiresPractice: false,
      },
    ],
  },
};
