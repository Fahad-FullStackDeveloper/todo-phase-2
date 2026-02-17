# Implementation Plan: TodoFlow Phase 2 - Complete Application

<!--
Constitution Check:
- [x] SPEC-DRIVEN DEVELOPMENT: Plan references valid specs (overview.md + 16 feature specs)
- [x] MONOREPO ARCHITECTURE: Tasks respect frontend/backend layer separation
- [x] AGENTIC WORKFLOW: Tasks assigned to appropriate specialized agents
- [x] JWT AUTHENTICATION: All APIs enforce user isolation
- [x] PREMIUM SAAS UX: All UI components follow premium standards
-->

## Overview

This plan implements TodoFlow Phase 2: a complete premium SaaS todo application with 27 features (9 basic + 18 premium), following spec-driven development with specialized Claude Code agents.

**Scope:** Full-stack implementation from database to polished UI  
**Timeline:** 7 major phases  
**Total Features:** 27 (BF-01 to BF-09, PF-01 to PF-18)  
**Monetization:** 14-day trial, 3-tier pricing (Free, Premium $9.99/mo, Lifetime $199.99)

---

## Constitution Alignment

- **Spec References:**
  - `.specify/specs/overview.md` - Main project specification
  - `.specify/specs/features/*.md` - 16 feature specifications
  - `.specify/specs/features/premium-features.md` - Monetization & trial
- **Version:** Constitution v1.0.6
- **Date Format:** International standard (17 Feb 2026, 4:30 PM)
- **Principles Applied:**
  - Principle 1: Spec-Driven Development (no manual coding)
  - Principle 2: Monorepo Architecture (Next.js + FastAPI)
  - Principle 3: JWT Authentication & User Isolation
  - Principle 4: Neon Serverless PostgreSQL
  - Principle 5: Premium SaaS UX Standards
  - Principle 6: Agentic Workflow Compliance

---

## Technical Context

### Architecture
```
phase-2/
├── frontend/           # Next.js 16.1.6 App Router (src/ folder)
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/ # shadcn/ui + custom
│   │   ├── lib/       # API client, utils
│   │   └── hooks/     # React hooks
│   └── CLAUDE.md
├── backend/            # FastAPI + SQLModel
│   ├── main.py        # FastAPI app
│   ├── models.py      # SQLModel models
│   ├── routes/        # API endpoints
│   └── CLAUDE.md
├── .specify/          # Spec-Kit Plus specs
└── docker-compose.yml
```

### Technology Stack
- **Frontend:** Next.js 16.1.6 (App Router, Server Components)
- **Backend:** Python FastAPI
- **ORM:** SQLModel
- **Database:** Neon Serverless PostgreSQL
- **Auth:** Better Auth + JWT (shared secret)
- **UI:** shadcn/ui + Tailwind CSS
- **Animations:** Framer Motion
- **State:** TanStack Query
- **Date Display:** `17 Feb 2026, 4:30 PM` (Intl.DateTimeFormat)

### API Endpoints (All require JWT)
- Auth: `/api/auth/signup`, `/api/auth/signin`, `/api/auth/signout`
- Tasks: `/api/tasks` (CRUD + subtasks + completion)
- Projects: `/api/projects` (CRUD + stats)
- Labels: `/api/labels` (CRUD)
- Dashboard: `/api/dashboard/stats`, `/api/dashboard/weekly-activity`
- Pomodoro: `/api/pomodoro/sessions`, `/api/pomodoro/stats`

---

## Phase 1: Database Schema & Models

**Goal:** Complete database foundation with all tables, relationships, and indexes

### Sub-Tasks

1. **SQLModel Models Creation**
   - [ ] `User` model (Better Auth managed, minimal local fields)
   - [ ] `Task` model with all fields (title, description, priority, status, due_date, project_id, completed)
   - [ ] `Project` model (name, color, description, user_id)
   - [ ] `Subtask` model (title, task_id, completed, position)
   - [ ] `Label` model (name, color, user_id)
   - [ ] `TaskLabel` junction table (task_id, label_id)
   - [ ] `PomodoroSession` model (user_id, task_id, duration, session_date)

   **Agent:** `neon-db-architect`  
   **Skill:** `neon-db-patterns`, `task-model-rules`  
   **Specs:** `@specs/overview.md` (Database Schema section)

2. **Alembic Migrations**
   - [ ] Initialize Alembic in backend/
   - [ ] Create migration for all tables
   - [ ] Add indexes: user_id, status, priority, due_date, project_id, completed
   - [ ] Test migration rollback/forward

   **Agent:** `neon-db-architect`  
   **Skill:** `neon-db-patterns`

3. **Database Relationships**
   - [ ] User → Tasks (one-to-many)
   - [ ] User → Projects (one-to-many)
   - [ ] User → Labels (one-to-many)
   - [ ] Task → Subtasks (one-to-many)
   - [ ] Task ↔ Labels (many-to-many via junction)
   - [ ] Project → Tasks (one-to-many)

   **Agent:** `neon-db-architect`

### Deliverables
- `backend/models.py` - All SQLModel models
- `backend/alembic/versions/` - Initial migration
- Database with 7 tables + indexes

---

## Phase 2: Backend Authentication & Core APIs

**Goal:** Secure REST API with JWT authentication and user isolation

### Sub-Tasks

1. **JWT Authentication Setup**
   - [ ] Configure Better Auth JWT plugin (frontend)
   - [ ] Set `BETTER_AUTH_SECRET` environment variable (shared secret)
   - [ ] Create JWT verification middleware (backend)
   - [ ] Implement token extraction from `Authorization: Bearer <token>`
   - [ ] Add 401 Unauthorized response for invalid tokens
   - [ ] Token expiry: 15min access, 7-day refresh (30-day remember me)

   **Agent:** `fastapi-backend-master`  
   **Skill:** `fastapi-jwt-security`  
   **Specs:** `@specs/features/auth-jwt.md`

2. **Auth Endpoints**
   - [ ] `POST /api/auth/signup` - Create user, issue JWT
   - [ ] `POST /api/auth/signin` - Authenticate, issue JWT
   - [ ] `POST /api/auth/signout` - Invalidate token
   - [ ] `GET /api/auth/me` - Get current user from JWT
   - [ ] `POST /api/auth/refresh` - Refresh JWT token

   **Agent:** `fastapi-backend-master`  
   **Skill:** `fastapi-jwt-security`

3. **Task CRUD Endpoints**
   - [ ] `GET /api/tasks` - List all user tasks (with filters: status, priority, project, labels, date range)
   - [ ] `POST /api/tasks` - Create task (title required, 1-200 chars)
   - [ ] `GET /api/tasks/:id` - Get single task
   - [ ] `PUT /api/tasks/:id` - Update task
   - [ ] `PATCH /api/tasks/:id/complete` - Toggle completion
   - [ ] `DELETE /api/tasks/:id` - Delete task
   - [ ] **User Isolation:** Filter ALL queries by `user_id` from JWT

   **Agent:** `fastapi-backend-master`  
   **Skill:** `fastapi-jwt-security`, `task-model-rules`  
   **Specs:** `@specs/features/task-management.md`

4. **Subtask Endpoints**
   - [ ] `POST /api/tasks/:id/subtasks` - Add subtask
   - [ ] `PATCH /api/tasks/:id/subtasks/:subtaskId` - Toggle subtask
   - [ ] `DELETE /api/tasks/:id/subtasks/:subtaskId` - Delete subtask

   **Agent:** `fastapi-backend-master`

5. **Project Endpoints**
   - [ ] `GET /api/projects` - List all user projects
   - [ ] `POST /api/projects` - Create project (name required, color optional)
   - [ ] `GET /api/projects/:id` - Get project with tasks
   - [ ] `PUT /api/projects/:id` - Update project
   - [ ] `DELETE /api/projects/:id` - Delete project
   - [ ] `GET /api/projects/:id/stats` - Project statistics (total, completed, completion rate)

   **Agent:** `fastapi-backend-master`  
   **Specs:** `@specs/features/projects-kanban.md`

6. **Label Endpoints**
   - [ ] `GET /api/labels` - List all user labels
   - [ ] `POST /api/labels` - Create label (name, color hex)
   - [ ] `PUT /api/labels/:id` - Update label
   - [ ] `DELETE /api/labels/:id` - Delete label

   **Agent:** `fastapi-backend-master`  
   **Specs:** `@specs/features/labels.md`

7. **Dashboard/Analytics Endpoints**
   - [ ] `GET /api/dashboard/stats` - Total tasks, completed today, completion rate, current streak
   - [ ] `GET /api/dashboard/weekly-activity` - Last 7 days activity
   - [ ] `GET /api/dashboard/streak` - Current streak, longest streak, last completed date

   **Agent:** `fastapi-backend-master`  
   **Specs:** `@specs/features/analytics.md`

8. **Pomodoro Endpoints**
   - [ ] `POST /api/pomodoro/sessions` - Log pomodoro session
   - [ ] `GET /api/pomodoro/stats` - Total sessions, total minutes, avg length

   **Agent:** `fastapi-backend-master`

### Deliverables
- `backend/main.py` - FastAPI app with JWT middleware
- `backend/routes/` - All API route handlers
- All 29 endpoints implemented and tested
- User isolation enforced on every endpoint

---

## Phase 3: Frontend Setup & Authentication

**Goal:** Next.js app with authentication flow and premium UI foundation

### Sub-Tasks

1. **Next.js 16.1.6 Setup**
   - [ ] Initialize Next.js 16.1.6 with App Router
   - [ ] Configure `src/` folder structure
   - [ ] Set up TypeScript config
   - [ ] Configure Tailwind CSS
   - [ ] Install shadcn/ui components
   - [ ] Set up Framer Motion
   - [ ] Install TanStack Query

   **Agent:** `frontend-visionary`  
   **Skill:** `nextjs-structure-enforcer`, `nextjs-app-router-enforcer`

2. **Authentication UI**
   - [ ] Signup page (`/signup`) - email, password, name
   - [ ] Signin page (`/signin`) - email, password
   - [ ] Better Auth integration (JWT token handling)
   - [ ] Store JWT in httpOnly cookie
   - [ ] Attach JWT to all API requests (`Authorization: Bearer <token>`)
   - [ ] Protected route wrapper (redirect if no auth)
   - [ ] Signout functionality

   **Agent:** `frontend-visionary`  
   **Skill:** `fastapi-jwt-security`  
   **Specs:** `@specs/features/auth-jwt.md`

3. **Layout & Navigation**
   - [ ] Root layout with sidebar (projects, labels, filters)
   - [ ] Top navigation (search, theme toggle, user menu)
   - [ ] Responsive mobile menu
   - [ ] Dark mode toggle (Light/Dark/System)
   - [ ] Smooth theme transitions (300ms)

   **Agent:** `frontend-visionary`  
   **Skill:** `premium-ux-polish`  
   **Specs:** `@specs/features/dark-mode.md`

4. **API Client Setup**
   - [ ] Create `lib/api.ts` - centralized API client
   - [ ] JWT token attachment to all requests
   - [ ] Error handling (401 redirect, network errors)
   - [ ] Optimistic updates configuration
   - [ ] TanStack Query setup with retry logic

   **Agent:** `frontend-visionary`  
   **Skill:** `premium-ux-polish`

### Deliverables
- `frontend/src/app/` - App Router pages
- `frontend/src/components/` - shadcn/ui + custom components
- `frontend/src/lib/api.ts` - API client
- Authentication flow working end-to-end
- Dark mode functional

---

## Phase 4: Task Views & Editor

**Goal:** Core task management UI with list view and rich task editor

### Sub-Tasks

1. **Task List View**
   - [ ] Main task list page (`/tasks`)
   - [ ] Task card component (title, priority indicator, due date, labels)
   - [ ] Checkbox for completion toggle (Framer Motion animation)
   - [ ] Infinite scroll / pagination
   - [ ] Empty state (no tasks)
   - [ ] Loading states (skeleton loaders)

   **Agent:** `frontend-visionary`  
   **Skill:** `premium-ux-polish`, `task-model-rules`  
   **Specs:** `@specs/features/task-management.md`

2. **Task Editor (Rich)**
   - [ ] Modal/slide-over editor
   - [ ] Title input (required, 1-200 chars validation)
   - [ ] Markdown description editor with preview
   - [ ] Priority selector (Low/Medium/High/Urgent with colors)
   - [ ] Due date picker (natural language: "tomorrow at 3pm")
   - [ ] Project assignment dropdown
   - [ ] Label multi-select with color picker
   - [ ] Subtasks section (add, toggle, reorder, delete)
   - [ ] Attachments upload & preview
   - [ ] Delete task with confirmation

   **Agent:** `frontend-visionary`  
   **Skill:** `premium-ux-polish`, `task-model-rules`  
   **Specs:** `@specs/features/task-management.md`, `@specs/features/subtasks.md`

3. **Quick Add Pattern**
   - [ ] Floating action button (FAB)
   - [ ] Inline quick-add input
   - [ ] Natural language date parsing ("tomorrow at 3pm")
   - [ ] Smart defaults (auto-assign based on context)
   - [ ] Multi-add support (add multiple tasks rapidly)

   **Agent:** `frontend-visionary`  
   **Specs:** `@specs/features/quick-add.md`

4. **Filtering & Sorting**
   - [ ] Filter dropdown (status, priority, project, labels, date range)
   - [ ] Sort dropdown (created, due, priority, title, completion)
   - [ ] Quick filters (Today, This Week, Overdue, Completed)
   - [ ] Smart lists (save custom filters)
   - [ ] Filter chips (active filters display)
   - [ ] Filter persistence (localStorage)

   **Agent:** `frontend-visionary`  
   **Specs:** `@specs/features/filtering-sorting.md`

5. **Date/Time Display**
   - [ ] Use `Intl.DateTimeFormat` for locale-aware formatting
   - [ ] Display format: `17 Feb 2026, 4:30 PM` (or 24-hour: `17 Feb 2026, 16:30`)
   - [ ] Relative dates for recent: "Today at 4:30 PM", "Yesterday at 10:00 AM"
   - [ ] Full month name if space allows: "17 February 2026"
   - [ ] 12/24-hour toggle in settings
   - [ ] Timezone aware (store ISO, display local)

   **Agent:** `frontend-visionary`  
   **Skill:** `premium-ux-polish`

### Deliverables
- Task list view with all interactions
- Rich task editor modal
- Quick add FAB
- Advanced filtering & sorting
- Date/time properly formatted

---

## Phase 5: Advanced Features (Kanban, Calendar, Projects, Focus)

**Goal:** Premium features that differentiate TodoFlow

### Sub-Tasks

1. **Kanban Board View**
   - [ ] 3 columns: Todo, In Progress, Done
   - [ ] Drag-and-drop tasks between columns (@dnd-kit)
   - [ ] Status update on drop (API call)
   - [ ] Column task counts
   - [ ] Smooth Framer Motion animations
   - [ ] Responsive behavior (mobile: horizontal scroll)

   **Agent:** `frontend-visionary`  
   **Specs:** `@specs/features/projects-kanban.md`

2. **Calendar View**
   - [ ] Monthly view (grid with tasks on due dates)
   - [ ] Weekly view (time blocks)
   - [ ] Daily view (hourly schedule)
   - [ ] Color coding by priority (Red=Urgent, Orange=High, Blue=Medium, Gray=Low)
   - [ ] Click to view/edit task from calendar
   - [ ] Quick add from calendar date
   - [ ] Keyboard shortcuts: M=Month, W=Week, D=Day, T=Today

   **Agent:** `frontend-visionary`  
   **Specs:** `@specs/features/calendar-view.md`

3. **Projects Dashboard**
   - [ ] Projects list with task counts
   - [ ] Project color coding (12 preset colors)
   - [ ] Project creation modal
   - [ ] Project stats (completion rate, total tasks)
   - [ ] Project-specific task view
   - [ ] Project deletion with confirmation

   **Agent:** `frontend-visionary`  
   **Specs:** `@specs/features/projects-kanban.md`

4. **Focus Mode**
   - [ ] Distraction-free single task view
   - [ ] Hide sidebar/navigation
   - [ ] Pomodoro timer integration
   - [ ] Escape key to exit
   - [ ] Minimal UI chrome
   - [ ] Focus session tracking

   **Agent:** `frontend-visionary`  
   **Specs:** `@specs/features/focus-mode.md`

5. **Pomodoro Timer**
   - [ ] 25min work / 5min break cycles
   - [ ] Custom duration settings
   - [ ] Timer linked to specific task
   - [ ] Session logging to backend
   - [ ] Daily/weekly pomodoro stats
   - [ ] Timer notifications (browser notifications API)

   **Agent:** `frontend-visionary`  
   **Specs:** `@specs/features/analytics.md`

### Deliverables
- Kanban board with drag-and-drop
- Calendar view (3 modes)
- Projects dashboard
- Focus mode
- Pomodoro timer

---

## Phase 6: Premium UX Polish & Productivity Tools

**Goal:** Delight moments and power user features

### Sub-Tasks

1. **Dashboard with Stats**
   - [ ] Total tasks count
   - [ ] Completed today count
   - [ ] Completion rate percentage
   - [ ] Current streak (days with completions)
   - [ ] Longest streak record
   - [ ] Tasks by priority chart (pie/bar)
   - [ ] Tasks by project chart
   - [ ] Weekly activity graph (last 7 days)

   **Agent:** `frontend-visionary`  
   **Specs:** `@specs/features/analytics.md`

2. **Completion Celebrations**
   - [ ] Confetti animation on task complete (canvas-confetti)
   - [ ] Streak milestone celebrations (7, 30, 100 days)
   - [ ] Progress bar fills with animation
   - [ ] Optional sound effects (muted by default)
   - [ ] Achievement badges foundation
   - [ ] Celebration frequency capping

   **Agent:** `frontend-visionary`  
   **Skill:** `premium-ux-polish`  
   **Specs:** `@specs/features/completion-celebrations.md`

3. **Keyboard Shortcuts**
   - [ ] Global: N=new task, /=search, T=toggle theme, ?=help
   - [ ] Task list: Enter=edit, Delete=remove, Space=toggle complete
   - [ ] Navigation: G+T=tasks, G+C=calendar, G+P=projects
   - [ ] Shortcut help modal
   - [ ] Customizable shortcuts foundation
   - [ ] Keyboard focus management

   **Agent:** `frontend-visionary`  
   **Specs:** `@specs/features/keyboard-shortcuts.md`

4. **Labels Management**
   - [ ] Labels list with color preview
   - [ ] Label creation modal with color picker (hex validation)
   - [ ] Label editing
   - [ ] Label deletion with confirmation
   - [ ] Label suggestions based on usage
   - [ ] Smart label filtering

   **Agent:** `frontend-visionary`  
   **Specs:** `@specs/features/labels.md`

5. **PWA Support**
   - [ ] Install prompt on supported devices
   - [ ] Offline task viewing (cached data)
   - [ ] Optimistic UI updates
   - [ ] Sync on reconnect
   - [ ] Service worker caching strategies
   - [ ] App manifest configuration

   **Agent:** `frontend-visionary`  
   **Specs:** `@specs/features/pwa-offline.md`

6. **Responsive Design**
   - [ ] Mobile-first breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px)
   - [ ] Touch-friendly targets (min 44px)
   - [ ] Adaptive layouts
   - [ ] No horizontal scroll
   - [ ] Mobile-optimized menus

   **Agent:** `frontend-visionary`  
   **Skill:** `premium-ux-polish`

### Deliverables
- Analytics dashboard with charts
- Completion celebrations
- Keyboard shortcuts
- Labels management UI
- PWA capabilities
- Fully responsive design

---

## Phase 7: Integration, QA & Testing

**Goal:** End-to-end validation and premium polish

### Sub-Tasks

1. **Integration Testing**
   - [ ] Verify JWT flow end-to-end (signup → signin → API calls → signout)
   - [ ] Test user isolation (User A cannot see User B's tasks)
   - [ ] Test all CRUD operations
   - [ ] Test subtask completion inheritance
   - [ ] Test filter combinations
   - [ ] Test Kanban drag-and-drop → API update
   - [ ] Test calendar view → task edit flow
   - [ ] Test Pomodoro timer → session logging

   **Agent:** `integration-guardian`

2. **QA Validation**
   - [ ] Generate tests for all API endpoints
   - [ ] UX review against specs
   - [ ] Security checks (JWT validation, SQL injection, XSS)
   - [ ] Accessibility audit (WCAG 2.1 AA)
   - [ ] Performance testing (Lighthouse scores: 90+ Performance, 95+ Accessibility)
   - [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

   **Agent:** `qa-polish-sentinel`

3. **Premium Polish**
   - [ ] All animations smooth (Framer Motion)
   - [ ] Loading states on all async actions
   - [ ] Error messages user-friendly
   - [ ] Empty states helpful
   - [ ] Dark mode fully themed (all components)
   - [ ] Micro-interactions on buttons, cards

   **Agent:** `qa-polish-sentinel`  
   **Skill:** `premium-ux-polish`

4. **Documentation**
   - [ ] Update README.md with setup instructions
   - [ ] API documentation (OpenAPI/Swagger)
   - [ ] Environment variables documentation
   - [ ] Deployment guide
   - [ ] User guide (features walkthrough)

   **Agent:** `integration-guardian`

5. **Performance Optimization**
   - [ ] Database query optimization (indexes, N+1 fixes)
   - [ ] Frontend bundle size optimization
   - [ ] Image optimization
   - [ ] API response time < 200ms
   - [ ] First Contentful Paint < 1.5s
   - [ ] Time to Interactive < 3.5s

   **Agent:** `qa-polish-sentinel`

### Deliverables
- All tests passing
- Lighthouse scores met
- Accessibility compliant
- Documentation complete
- Production-ready application

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| JWT token leakage | High | Use httpOnly cookies, HTTPS only, short expiry |
| User data isolation failure | Critical | Middleware enforces user_id on ALL queries, comprehensive tests |
| Drag-and-drop performance | Medium | Virtual scrolling for large boards, @dnd-kit optimizations |
| PWA offline sync conflicts | Medium | Optimistic UI, last-write-wins, conflict resolution UI |
| Date/time timezone bugs | Medium | Store ISO, display local via Intl.DateTimeFormat |
| Premium feature gating complexity | Medium | Centralized feature flag service, clear trial logic |

---

## Definition of Done

- [ ] All 7 phases completed
- [ ] All 27 features implemented (9 basic + 18 premium)
- [ ] All 29 API endpoints working with JWT auth
- [ ] User isolation verified on every endpoint
- [ ] Premium UX polish applied (animations, dark mode, celebrations)
- [ ] Tests passing (backend + frontend + E2E)
- [ ] Lighthouse scores: 90+ Performance, 95+ Accessibility
- [ ] Constitution compliance verified
- [ ] Documentation complete
- [ ] PHR records created for all phases

---

## Agent & Skill Reference

| Agent | Purpose | Phases |
|-------|---------|--------|
| `neon-db-architect` | Database schema, migrations | Phase 1 |
| `fastapi-backend-master` | API endpoints, JWT auth | Phase 2 |
| `frontend-visionary` | Next.js UI, premium UX | Phase 3-6 |
| `integration-guardian` | End-to-end flow, docs | Phase 7 |
| `qa-polish-sentinel` | Testing, accessibility, performance | Phase 7 |

| Skill | Purpose |
|-------|---------|
| `neon-db-patterns` | Neon PostgreSQL best practices |
| `fastapi-jwt-security` | JWT authentication enforcement |
| `nextjs-structure-enforcer` | Next.js 16+ App Router patterns |
| `nextjs-app-router-enforcer` | Server Components default |
| `premium-ux-polish` | SaaS-level UX, animations |
| `task-model-rules` | Consistent task schema |

---

## Related Specifications

- `@specs/overview.md` - Complete project overview
- `@specs/features/task-management.md` - Task CRUD
- `@specs/features/auth-jwt.md` - Authentication
- `@specs/features/projects-kanban.md` - Projects & Kanban
- `@specs/features/calendar-view.md` - Calendar
- `@specs/features/analytics.md` - Dashboard & Pomodoro
- `@specs/features/premium-features.md` - Monetization & trial
- All 16 feature specs in `.specify/specs/features/`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 17 Feb 2026 | Initial implementation plan |

---

*This plan follows Constitution Principle 1 (Spec-Driven Development) and Principle 6 (Agentic Workflow Compliance). All implementations must reference this plan and relevant feature specs.*
