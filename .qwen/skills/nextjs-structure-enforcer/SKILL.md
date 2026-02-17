---

name: nextjs-structure-enforcer

description: Enforces Next.js 16.1.6+ App Router, src/ folder, Server Components default, and consistent monorepo patterns

---



\# Next.js Structure \& Conventions Skill



When working on frontend:



\- ALWAYS use src/ folder structure

\- App Router only: src/app/ contains layouts, pages, route groups ((auth), (app))

\- Server Components by default

\- 'use client' ONLY for interactivity (forms, drag-drop, timers, modals, stateful hooks)

\- Use server actions for mutations when possible

\- Data fetching: prefer TanStack Query in client components + server components for initial data

\- API calls: ALWAYS go through src/lib/api.ts (JWT authenticated fetch/axios wrapper)

\- Components organization:

&nbsp; - src/components/ui/ → shadcn components

&nbsp; - src/components/ → custom (TaskCard.tsx, KanbanBoard.tsx, etc.)

\- Styling: Tailwind + cva + clsx/tailwind-merge only, no inline styles

\- Accessibility: add ARIA roles/labels, focus management, keyboard navigation

\- Dark mode: next-themes provider in root layout

\- Keyboard shortcuts: cmdk or custom global listener (Cmd+K search, N new task, etc.)

\- Never use Pages Router, client-side only fetching without Query, or class components



Reference versions:

\- Next.js ^16.1.6

\- React ^19.0.0

\- Tailwind ^4.1.18

\- shadcn/ui @latest (~3.8.x)



Do not deviate unless explicitly told to break these rules.

