# VIBE CHECK - Project Context

## Overview
Dự án là nền tảng AI Mock Interview đa lĩnh vực (Multi-domain). 
Kiến trúc chính: Module-based với `modules/` folder. Mỗi domain (tech, marketing,...) có `index.ts`, `prompt.ts`, và `workspace.tsx`.

## Tech Stack
- Framework: Next.js 15 (App Router)
- Language: TypeScript
- UI: Tailwind CSS, Shadcn/UI
- AI: Vercel AI SDK, OpenAI
- State Management: React Hooks/Context

## Coding Guidelines
- Ưu tiên kiến trúc Module-based: Luôn luôn tách biệt Core (Chat) và Domain Workspace.
- Khi cần thêm domain mới: Chỉ cần thêm folder vào `modules/`, export ModuleDefinition từ `index.ts` và đăng ký vào `registry.ts`.
- Code sạch (Clean Code), có type đầy đủ (TypeScript).
- Component ưu tiên tính reusable và atomic.

## Project Structure
- `src/modules/`: Chứa các domain-specific logic.
- `src/lib/`: Chứa configuration dùng chung.