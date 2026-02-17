# TodoFlow - Premium SaaS Todo Application

## Project Overview

| Attribute | Value |
|-----------|-------|
| **Project Name** | TodoFlow |
| **Version** | 2.0.0 |
| **Current Phase** | Phase II: Full-Stack Web Application |
| **Architecture** | Monorepo (Frontend + Backend) |
| **Development Approach** | Spec-Driven Development with Claude Code |

### Vision & Purpose

TodoFlow is a premium SaaS todo/task management application designed to transcend basic CRUD operations. The application delivers productivity value through habit-forming, delightful experiences that justify premium positioning—rivaling industry leaders like Todoist, TickTick, and ClickUp.

**Core Mission:** Build a feature-complete, production-ready todo application that balances core task management with premium SaaS enhancements, creating an experience users love and return to daily.

---

## Technology Stack

### Frontend Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 16+ (App Router) | React framework with Server Components |
| **Language** | TypeScript | Type-safe frontend development |
| **UI Components** | shadcn/ui | Premium, accessible component library |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Animations** | Framer Motion | Smooth micro-interactions & transitions |
| **State Management** | TanStack Query | Server state management & caching |
| **Authentication** | Better Auth | JWT-based authentication |
| **PWA** | Next.js PWA Config | Offline support, install prompts |

### Backend Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Python FastAPI | High-performance REST API |
| **ORM** | SQLModel | Type-safe database ORM |
| **Database** | Neon Serverless PostgreSQL | Scalable cloud database |
| **Authentication** | JWT (Better Auth compatible) | Stateless token verification |
| **Validation** | Pydantic | Request/response validation |

### Infrastructure

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Monorepo** | pnpm workspaces | Unified frontend/backend codebase |
| **Containerization** | Docker + docker-compose | Local development environment |
| **Environment** | .env files | Configuration management |

---

## Core Features

### Basic Features (Phase 2 Requirements)

| Feature ID | Feature | Description | Acceptance Criteria |
|------------|---------|-------------|---------------------|
| **BF-01** | User Signup | New users can create accounts | Email/password required, unique email enforced, JWT issued on success |
| **BF-02** | User Signin | Existing users can log in | Valid credentials return JWT, invalid credentials return 401 |
| **BF-03** | User Signout | Users can log out | Token invalidated/removed, session cleared |
| **BF-04** | Task Creation | Create new tasks | Title required, optional description, user association enforced |
| **BF-05** | Task Viewing | View all user tasks | Only authenticated user's tasks displayed, list shows title/status/date |
| **BF-06** | Task Update | Edit existing tasks | Title/description/completion status editable, changes persisted |
| **BF-07** | Task Deletion | Remove tasks | Task permanently deleted, confirmation recommended |
| **BF-08** | Task Completion | Toggle task done state | Single action toggles completed boolean, visual feedback provided |
| **BF-09** | User Isolation | Data segregation | Each user sees ONLY their own tasks, enforced at API level |

### Premium SaaS Features

#### Task Management Enhancements

| Feature ID | Feature | Description | Acceptance Criteria |
|------------|---------|-------------|---------------------|
| **PF-01** | **Kanban Board View** | Drag-and-drop task management across status columns | 3 columns (Todo, In Progress, Done), drag tasks between columns, status updates on drop, smooth animations |
| **PF-02** | **Calendar View** | Visual calendar showing tasks with due dates | Monthly/weekly views, tasks displayed on due date, click to view/edit, color-coded by priority |
| **PF-03** | **Projects/Groups** | Organize tasks into projects or categories | Create/rename/delete projects, assign tasks to projects, project dashboard with stats, project color coding |
| **PF-04** | **Subtasks** | Break tasks into smaller checkable items | Add unlimited subtasks, checkbox completion, parent task progress indicator (e.g., "3/5 subtasks"), subtask completion optional auto-completes parent |
| **PF-05** | **Labels/Tags** | Color-coded labels for task categorization | Create custom labels with colors, assign multiple labels per task, filter by label, label suggestions |
| **PF-06** | **Task Priorities** | Priority levels for task importance | 4 levels (Low, Medium, High, Urgent), visual indicators (colors/icons), sort by priority, default to Medium |
| **PF-07** | **Due Dates & Reminders** | Date/time picker with notification support | Date+time selection, timezone aware, overdue highlighting, browser notifications (with permission), reminder options (15min/1hr/1day before) |
| **PF-08** | **Rich Task Descriptions** | Markdown support with attachments | Markdown editor with preview, code blocks, lists, links, file attachments (images/docs), attachment preview |
| **PF-09** | **Task Filtering & Sorting** | Advanced filtering and sorting options | Filter by: status, priority, date range, project, labels. Sort by: created date, due date, priority, title, completion. Save custom filters as smart lists |
| **PF-10** | **Dashboard with Stats** | Productivity analytics dashboard | Completed tasks count, completion rate %, current streak, tasks by project chart, weekly activity graph, productivity score |
| **PF-11** | **Pomodoro Timer** | Built-in focus timer for task work sessions | 25min work / 5min break cycles, custom durations, timer linked to specific task, session history logged, daily/weekly pomodoro stats |

#### UX & Platform Features

| Feature ID | Feature | Description | Acceptance Criteria |
|------------|---------|-------------|---------------------|
| **PF-12** | **Dark Mode** | Theme toggle with system preference detection | Light/Dark/System options, smooth transition animation, persistent preference, all components themed |
| **PF-13** | **Responsive Design** | Mobile, tablet, desktop support | Mobile-first breakpoints, touch-friendly targets, adaptive layouts, no horizontal scroll |
| **PF-14** | **PWA Support** | Offline capabilities, install prompt | Install prompt on supported devices, offline task viewing, optimistic UI updates, sync on reconnect |
| **PF-15** | **Keyboard Shortcuts** | Power user keyboard navigation | Global shortcuts (N=new task, / = search, T=toggle theme), task list shortcuts (Enter=edit, Delete=remove), shortcuts help modal |
| **PF-16** | **Quick Add Pattern** | Rapid task entry from anywhere | Floating action button, inline quick-add input, natural language date parsing ("tomorrow at 3pm"), minimal friction |
| **PF-17** | **Focus Mode** | Distraction-free task view | Hide sidebar/navigation, single task focus, timer integration, escape to exit |
| **PF-18** | **Completion Celebrations** | Delight moments on task completion | Confetti animation on task complete, streak milestone celebrations, progress bar fills, satisfying micro-interactions |

---

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|--------|----------|-------------|---------------|--------------|----------|
| POST | `/api/auth/signup` | Create new user account | No | `{ email, password, name }` | `{ user, token }` |
| POST | `/api/auth/signin` | Authenticate user | No | `{ email, password }` | `{ user, token }` |
| POST | `/api/auth/signout` | Logout user | Yes | - | `{ success: true }` |
| GET | `/api/auth/me` | Get current user | Yes | - | `{ user }` |
| POST | `/api/auth/refresh` | Refresh JWT token | Yes | - | `{ token }` |

### Task Endpoints

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|--------|----------|-------------|---------------|--------------|----------|
| GET | `/api/tasks` | List all user tasks | Yes | Query: `?status=&priority=&project=&labels=&sort=` | `Task[]` |
| POST | `/api/tasks` | Create new task | Yes | `{ title, description?, priority?, due_date?, project_id?, labels? }` | `Task` |
| GET | `/api/tasks/:id` | Get single task | Yes | - | `Task` |
| PUT | `/api/tasks/:id` | Update task | Yes | `{ title?, description?, priority?, due_date?, status?, project_id?, labels? }` | `Task` |
| PATCH | `/api/tasks/:id/complete` | Toggle completion | Yes | - | `Task` |
| DELETE | `/api/tasks/:id` | Delete task | Yes | - | `{ success: true }` |
| POST | `/api/tasks/:id/subtasks` | Add subtask | Yes | `{ title }` | `Subtask` |
| PATCH | `/api/tasks/:id/subtasks/:subtaskId` | Toggle subtask | Yes | - | `Subtask` |
| DELETE | `/api/tasks/:id/subtasks/:subtaskId` | Delete subtask | Yes | - | `{ success: true }` |

### Project Endpoints

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|--------|----------|-------------|---------------|--------------|----------|
| GET | `/api/projects` | List all user projects | Yes | - | `Project[]` |
| POST | `/api/projects` | Create project | Yes | `{ name, color?, description? }` | `Project` |
| GET | `/api/projects/:id` | Get project with tasks | Yes | - | `Project` |
| PUT | `/api/projects/:id` | Update project | Yes | `{ name?, color?, description? }` | `Project` |
| DELETE | `/api/projects/:id` | Delete project | Yes | - | `{ success: true }` |
| GET | `/api/projects/:id/stats` | Get project statistics | Yes | - | `{ totalTasks, completedTasks, completionRate }` |

### Label Endpoints

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|--------|----------|-------------|---------------|--------------|----------|
| GET | `/api/labels` | List all user labels | Yes | - | `Label[]` |
| POST | `/api/labels` | Create label | Yes | `{ name, color }` | `Label` |
| PUT | `/api/labels/:id` | Update label | Yes | `{ name?, color? }` | `Label` |
| DELETE | `/api/labels/:id` | Delete label | Yes | - | `{ success: true }` |

### Dashboard/Stats Endpoints

| Method | Endpoint | Description | Auth Required | Response |
|--------|----------|-------------|---------------|----------|
| GET | `/api/dashboard/stats` | Get dashboard statistics | Yes | `{ totalTasks, completedToday, completionRate, currentStreak, tasksByPriority, tasksByProject }` |
| GET | `/api/dashboard/weekly-activity` | Get weekly activity data | Yes | `{ days: [{ date, completed, created }] }` |
| GET | `/api/dashboard/streak` | Get streak information | Yes | `{ currentStreak, longestStreak, lastCompletedDate }` |

### Pomodoro Endpoints

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|--------|----------|-------------|---------------|--------------|----------|
| POST | `/api/pomodoro/sessions` | Log pomodoro session | Yes | `{ task_id?, duration, completed }` | `PomodoroSession` |
| GET | `/api/pomodoro/stats` | Get pomodoro statistics | Yes | Query: `?range=day|week|month` | `{ totalSessions, totalMinutes, avgSessionLength }` |

---

## Database Schema Overview

### Core Tables

#### `users` (Managed by Better Auth)
```
- id: UUID (Primary Key)
- email: VARCHAR (Unique, Not Null)
- name: VARCHAR
- password_hash: VARCHAR (Not Null)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `tasks`
```
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key → users.id, Not Null)
- title: VARCHAR(200) (Not Null)
- description: TEXT (Nullable)
- status: ENUM('todo', 'in_progress', 'done') (Default: 'todo')
- priority: ENUM('low', 'medium', 'high', 'urgent') (Default: 'medium')
- due_date: TIMESTAMP (Nullable)
- project_id: UUID (Foreign Key → projects.id, Nullable)
- completed: BOOLEAN (Default: false)
- completed_at: TIMESTAMP (Nullable)
- created_at: TIMESTAMP (Default: now())
- updated_at: TIMESTAMP (Default: now())
```

#### `projects`
```
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key → users.id, Not Null)
- name: VARCHAR(100) (Not Null)
- description: TEXT (Nullable)
- color: VARCHAR(7) (Hex color, Default: '#3B82F6')
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `subtasks`
```
- id: UUID (Primary Key)
- task_id: UUID (Foreign Key → tasks.id, Not Null)
- title: VARCHAR(200) (Not Null)
- completed: BOOLEAN (Default: false)
- position: INTEGER (For ordering)
- created_at: TIMESTAMP
```

#### `labels`
```
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key → users.id, Not Null)
- name: VARCHAR(50) (Not Null)
- color: VARCHAR(7) (Hex color, Not Null)
- created_at: TIMESTAMP
```

#### `task_labels` (Junction Table)
```
- task_id: UUID (Foreign Key → tasks.id, Not Null)
- label_id: UUID (Foreign Key → labels.id, Not Null)
- PRIMARY KEY (task_id, label_id)
```

#### `pomodoro_sessions`
```
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key → users.id, Not Null)
- task_id: UUID (Foreign Key → tasks.id, Nullable)
- duration_minutes: INTEGER (Not Null)
- completed: BOOLEAN (Default: true)
- session_date: TIMESTAMP (Not Null)
- created_at: TIMESTAMP
```

### Indexes

| Table | Column(s) | Purpose |
|-------|-----------|---------|
| tasks | user_id | Filter tasks by user |
| tasks | status | Filter by status |
| tasks | priority | Sort by priority |
| tasks | due_date | Sort/filter by date |
| tasks | project_id | Filter by project |
| tasks | completed | Filter completion status |
| subtasks | task_id | Get subtasks for task |
| task_labels | task_id, label_id | Junction lookups |
| pomodoro_sessions | user_id, session_date | User stats by date |

---

## UX Requirements

### Component Architecture

| Principle | Implementation |
|-----------|----------------|
| **Server Components Default** | All pages and layouts use Server Components unless interactivity required |
| **Client Components When Needed** | Add `'use client'` directive only for: forms, drag-and-drop, animations, stateful interactions |
| **shadcn/ui Patterns** | Use shadcn component library as base, extend with custom variants |
| **Framer Motion** | All animations use Framer Motion for consistency and performance |
| **TanStack Query** | All server state managed via TanStack Query hooks |

### Design System

| Aspect | Requirement |
|--------|-------------|
| **Color Palette** | Primary brand color + semantic colors (success, warning, error, info) |
| **Typography** | System font stack, consistent scale (xs, sm, base, lg, xl, 2xl, 3xl) |
| **Spacing** | Tailwind spacing scale (4px base unit) |
| **Border Radius** | Consistent rounded-md for cards, rounded-lg for buttons |
| **Shadows** | Subtle shadows for elevation (shadow-sm, shadow, shadow-md, shadow-lg) |
| **Transitions** | 150-300ms ease-in-out for all interactive elements |

### Accessibility (WCAG 2.1 AA)

| Requirement | Implementation |
|-------------|----------------|
| **Keyboard Navigation** | All interactive elements focusable, visible focus states, logical tab order |
| **Screen Reader Support** | Semantic HTML, ARIA labels where needed, live regions for dynamic content |
| **Color Contrast** | Minimum 4.5:1 contrast ratio for text, 3:1 for UI components |
| **Reduced Motion** | Respect `prefers-reduced-motion` media query |
| **Form Labels** | All inputs have associated labels or aria-label |

### Dark Mode Implementation

| Requirement | Implementation |
|-------------|----------------|
| **Theme Toggle** | Toggle in header/settings, persists to localStorage |
| **System Detection** | Default to system preference on first visit |
| **Smooth Transition** | 300ms color transition on theme change |
| **Full Coverage** | All components, modals, dropdowns themed for dark mode |
| **Icon Updates** | Sun/moon icons reflect current theme |

### Responsive Breakpoints

| Breakpoint | Width | Target Device |
|------------|-------|---------------|
| **sm** | 640px | Large phones |
| **md** | 768px | Tablets |
| **lg** | 1024px | Small laptops |
| **xl** | 1280px | Desktops |
| **2xl** | 1536px | Large screens |

### PWA Capabilities

| Feature | Implementation |
|---------|----------------|
| **Install Prompt** | Custom install banner on supported devices |
| **Offline Support** | Cache shell + recent tasks, optimistic UI for mutations |
| **App Manifest** | Proper icons, theme colors, display mode |
| **Service Worker** | Cache strategies for assets and API responses |

---

## Development Workflow

### Spec-Driven Development Process

```
1. SPECIFICATION → Write/update spec in .specify/specs/
2. PLAN GENERATION → Generate implementation plan from spec
3. TASK BREAKDOWN → Break into atomic implementation tasks
4. CLAUDE CODE IMPLEMENTATION → Agents implement via spec references
5. VALIDATION → Test against acceptance criteria
6. ITERATION → Refine spec if requirements change
```

### Agent Workflow

| Agent | Responsibility |
|-------|----------------|
| **saas-product-architect** | Product vision, feature specs, UX strategy |
| **frontend-agent** | Next.js components, pages, client logic |
| **backend-agent** | FastAPI routes, models, database operations |
| **database-agent** | Schema design, migrations, queries |
| **ux-polish-agent** | Animations, micro-interactions, accessibility |

### Spec Referencing

Reference specifications in Claude Code using:
- `@specs/overview.md` - Project overview
- `@specs/features/[feature-name].md` - Feature specifications
- `@specs/api/rest-endpoints.md` - API specifications
- `@specs/database/schema.md` - Database schema
- `@specs/ui/components.md` - UI component specs

### CLAUDE.md Files

| Location | Purpose |
|----------|---------|
| `/CLAUDE.md` | Root project context and workflow |
| `/frontend/CLAUDE.md` | Frontend-specific patterns and conventions |
| `/backend/CLAUDE.md` | Backend-specific patterns and conventions |

---

## Success Metrics

### Feature Completion

| Metric | Target |
|--------|--------|
| Basic Features (BF-01 to BF-09) | 100% implemented and tested |
| Premium Features (PF-01 to PF-18) | 90%+ implemented |
| API Endpoint Coverage | 100% of documented endpoints |
| Database Schema | All tables and indexes created |

### Quality Metrics

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 90+ |
| Lighthouse Accessibility | 95+ |
| Lighthouse Best Practices | 95+ |
| Lighthouse SEO | 90+ |
| Lighthouse PWA | Pass |

### UX Metrics

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3.5s |
| Input Latency | < 100ms |
| Animation Frame Rate | 60fps |

---

## Phase 2 Scope Boundaries

### In Scope (Phase 2)

✅ All Basic Features (BF-01 to BF-09)
✅ All Premium Features (PF-01 to PF-18)
✅ Complete API endpoint coverage
✅ Full database schema implementation
✅ Dark mode and responsive design
✅ PWA support with offline capabilities
✅ Authentication with JWT user isolation

### Out of Scope (Future Phases)

❌ AI-powered task suggestions
❌ Team collaboration features
❌ Third-party integrations (Slack, Google Calendar, etc.)
❌ Mobile native apps
❌ Advanced analytics and reporting
❌ Custom themes beyond dark/light
❌ Voice input for tasks
❌ Recurring tasks (stretch goal if time permits)

---

## Related Specifications

| Spec File | Description |
|-----------|-------------|
| `@specs/features/authentication.md` | User signup/signin flow |
| `@specs/features/task-management.md` | Task CRUD operations |
| `@specs/features/kanban-board.md` | Drag-and-drop board view |
| `@specs/features/calendar-view.md` | Calendar visualization |
| `@specs/features/projects.md` | Project organization |
| `@specs/features/subtasks.md` | Subtask functionality |
| `@specs/features/labels.md` | Label system |
| `@specs/features/dashboard.md` | Analytics dashboard |
| `@specs/features/pomodoro.md` | Focus timer |
| `@specs/api/rest-endpoints.md` | Complete API reference |
| `@specs/database/schema.md` | Detailed schema definitions |
| `@specs/ui/components.md` | Component library |
| `@specs/ui/pages.md` | Page layouts and flows |

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-17 | Initial Phase 2 overview specification |

---

*This specification follows the principles of the Phase 2 Constitution. All implementations must align with the documented requirements, technology stack, and UX standards.*
