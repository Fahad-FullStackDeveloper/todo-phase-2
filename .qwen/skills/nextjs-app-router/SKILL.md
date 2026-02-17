---

name: nextjs-app-router-enforcer

description: Always use Next.js 16+ App Router patterns, src/ folder, Server Components by default, and 'use client' only when needed. Prefer Server Actions over client-side fetching.

---



\# Instructions for this skill



When implementing frontend features:

\- Enforce src/ folder structure

\- Use App Router (app/ directory)

\- Server Components default; mark 'use client' strictly for interactivity

\- Use server actions for mutations

\- Integrate with TanStack Query for client-side data

\- Reference shadcn/ui components via npx shadcn@latest add ...

\- Always add keyboard shortcuts and accessibility (ARIA)



Examples:

\- For a new page: create src/app/dashboard/page.tsx

\- For forms: use server actions + zod validation



Do NOT use Pages Router or client-heavy patterns unless explicitly asked.

