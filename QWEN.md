# TodoFlow - Phase 2 Full-Stack Application

**Constitution Version:** 1.0.6
**Current Phase:** Phase 6 - Advanced Features (Complete)
**Current Version:** 1.7.0
**Project Status:** Full-stack application with 6 phases complete
**Build Status:** ✅ Deployment Ready (0 warnings)
**Last Updated:** 19 Feb 2026

---

## Project Overview

TodoFlow is a premium SaaS todo/task management application with 27 features (9 basic + 18 premium). This is Phase 2 of the hackathon, transforming a console app into a modern multi-user web application.

**Architecture:** Monorepo
- **Frontend:** Next.js 16.1.6 (App Router, src/ folder, Server Components)
- **Backend:** Python FastAPI with SQLModel ORM
- **Database:** Neon Serverless PostgreSQL (local: PostgreSQL 15)
- **Authentication:** Better Auth + JWT (shared secret)

---

## Quick Start

```bash
# Start all services (Docker - Recommended)
docker-compose up --build

# Access applications
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## Spec-Kit Plus Structure

Specifications are organized in `.specify/`:

| Directory | Purpose |
|-----------|---------|
| `.specify/memory/` | Project constitution and long-term memory |
| `.specify/specs/` | Feature, API, database, and UI specifications |
| `.specify/templates/` | Templates for specs, plans, tasks |
| `.specify/scripts/` | Automation scripts |
| `.specify/history/` | Prompt history records (PHR) |

### Key Specifications

- `@.specify/specs/overview.md` - Complete project overview
- `@.specify/specs/impl-plan.md` - Implementation plan (7 phases)
- `@.specify/specs/tasks.md` - All tasks (T001-T200+)
- `@.specify/specs/features/*.md` - 16 feature specifications
- `@.specify/memory/constitution.md` - Project constitution

---

## Project Structure

```
phase-2/
├── .specify/                    # Spec-Kit Plus specifications
│   ├── memory/constitution.md   # Project constitution
│   ├── specs/                   # All specifications
│   ├── templates/               # Spec/plan/task templates
│   └── scripts/                 # Automation scripts
├── backend/                     # FastAPI Backend
│   ├── main.py                  # FastAPI app entry point
│   ├── db.py                    # Database configuration
│   ├── models/                  # SQLModel models (7 models)
│   ├── routes/                  # API route handlers
│   ├── middleware/              # JWT auth middleware
│   ├── schemas/                 # Pydantic schemas
│   ├── tests/                   # Test suite
│   ├── alembic/                 # Database migrations
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Environment template
│   └── Dockerfile               # Backend container
├── frontend/                    # Next.js 16.1.6 Frontend
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   ├── components/          # React components
│   │   ├── lib/                 # Utilities (api.ts, auth.ts)
│   │   ├── hooks/               # Custom hooks (useAuth, useTheme)
│   │   ├── types/               # TypeScript types
│   │   └── proxy.ts             # Next.js middleware (auth proxy)
│   ├── public/                  # Static assets
│   ├── package.json             # Node dependencies
│   ├── next.config.js           # Next.js configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   ├── tsconfig.json            # TypeScript config
│   ├── .env.example             # Environment template
│   └── Dockerfile               # Frontend container
├── docker-compose.yml           # Container orchestration
├── .env.example                 # Root environment template
├── QWEN.md                      # This file
├── CLAUDE.md                    # Claude Code instructions
└── README.md                    # Setup instructions
```

---

## Technology Stack

### Frontend
| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.1.6 (App Router) |
| Language | TypeScript |
| UI Components | shadcn/ui + Tailwind CSS |
| Animations | Framer Motion |
| State Management | TanStack Query |
| Authentication | Better Auth + JWT |
| Date Handling | date-fns |
| Drag & Drop | @dnd-kit |
| Charts | recharts |

### Backend
| Layer | Technology |
|-------|------------|
| Framework | FastAPI |
| ORM | SQLModel |
| Database | PostgreSQL (Neon-compatible) |
| Migrations | Alembic |
| Authentication | JWT (python-jose) |
| Password Hashing | passlib + bcrypt |
| Validation | Pydantic |

---

## Development Workflow

### Spec-Driven Development Process

```
1. SPECIFICATION → Read/create spec in .specify/specs/
2. PLAN GENERATION → Generate implementation plan
3. TASK BREAKDOWN → Break into atomic tasks
4. IMPLEMENTATION → Implement via spec references
5. VALIDATION → Test against acceptance criteria
6. ITERATION → Refine spec if requirements change
```

### Commands

```bash
# Start all services (Docker)
docker-compose up --build

# Backend only (local development)
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend only (local development)
cd frontend
npm install
npm run dev

# Build verification
cd frontend && npm run build
cd backend && python -c "from main import app; print('OK')"

# View logs
docker-compose logs -f
```

---

## API Endpoints

All endpoints require JWT authentication (except auth endpoints):

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create user account |
| POST | `/api/auth/signin` | Authenticate user |
| POST | `/api/auth/signout` | Logout user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/refresh` | Refresh JWT token |
| GET | `/api/tasks` | List user tasks |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get task |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/complete` | Toggle completion |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create project |
| GET | `/api/labels` | List labels |
| POST | `/api/labels` | Create label |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/pomodoro/stats` | Pomodoro statistics |

---

## Environment Variables

### Shared Secret (Critical)
`BETTER_AUTH_SECRET` must be identical in both frontend and backend for JWT verification.

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/todoflow
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
FRONTEND_URL=http://localhost:3000
JWT_ALGORITHM=HS256
JWT_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
```

---

## Phase Completion Status

| Phase | Tasks | Status | Version |
|-------|-------|--------|---------|
| Phase 1: Setup | T001-T008 (8) | ✅ Complete | v1.3.0 |
| Phase 2: Database | T009-T023 (15) | ✅ Complete | v1.1.0 |
| Phase 3: Backend APIs | T024-T063 (35) | ✅ Complete | v1.2.0 |
| Phase 4: Frontend Auth | T064-T088 (25) | ✅ Complete | v1.4.0 |
| Phase 5: Task Views | T089-T120 (32) | ✅ **COMPLETE** | v1.6.0 |
| Phase 6: Advanced Features | T121-T153 (33) | ✅ **COMPLETE** | v1.7.0 |
| Phase 7: Premium UX | T154-T180 (27) | ⏳ Pending | - |
| Phase 8: Integration & QA | T181-T200 (17) | ⏳ Pending | - |

**Overall Progress:** 148/180+ tasks complete (82%+)

### ✅ Phase 5 Readiness Confirmed (19 Feb 2026)

**Authentication Verification:** 10/10 tests passed (100%)
- Backend healthy on port 8000 ✅
- Frontend healthy on port 3000 ✅
- User signup creates accounts ✅
- User signin returns JWT tokens ✅
- JWT validation working ✅
- Token refresh working ✅
- CORS properly configured ✅
- Protected routes enforced ✅
- User isolation verified ✅
- Frontend-backend connectivity ✅

**No blockers for Phase 5.** See `AUTH-PHASE5-VERIFICATION-REPORT.md` for full details.

---

## Current Phase Details

### Phase 4 (Complete) - Frontend Authentication UI

**Tasks Completed:** T064-T088 (25 tasks)

- [x] Next.js 16.1.6 configuration (shadcn/ui, Framer Motion, TanStack Query)
- [x] Authentication UI (signup, signin, signout pages)
- [x] Layout & Navigation (sidebar, top nav, dark mode toggle)
- [x] API Client Setup (JWT attachment, error handling, optimistic updates)
- [x] Middleware/Proxy for protected routes

**Files Created:**
- `frontend/src/app/layout.tsx` - Root layout with providers
- `frontend/src/app/page.tsx` - Landing page
- `frontend/src/app/signin/page.tsx` - Sign in page
- `frontend/src/app/signup/page.tsx` - Sign up page
- `frontend/src/app/dashboard/page.tsx` - Protected dashboard
- `frontend/src/components/Providers.tsx` - Client providers
- `frontend/src/components/ui/*` - shadcn/ui components
- `frontend/src/components/layout/*` - Sidebar, TopNav
- `frontend/src/hooks/useAuth.tsx` - Auth context & hooks
- `frontend/src/hooks/useTheme.ts` - Theme management
- `frontend/src/lib/api.ts` - API client with JWT
- `frontend/src/lib/auth.ts` - Better Auth integration
- `frontend/src/lib/query.ts` - TanStack Query client
- `frontend/src/proxy.ts` - Auth middleware

---

### Phase 5 (Complete) - Task Views & Editor

**Tasks Completed:** T089-T120 (32 tasks)

- [x] Task list page with infinite scroll/pagination
- [x] TaskCard component with priority, due date, labels
- [x] Completion checkbox with Framer Motion animation
- [x] Rich task editor modal (markdown, priority, due date, project, labels, subtasks)
- [x] QuickAddFAB for rapid task entry
- [x] Natural language date parsing (chrono-node)
- [x] Filter & sort dropdowns
- [x] Quick filters (Today, This Week, Overdue, Completed)
- [x] Filter chips with persistence
- [x] Date formatting utility (Intl.DateTimeFormat)
- [x] Empty states & skeleton loaders

**Files Created:**
- `frontend/src/app/tasks/page.tsx` - Main task list page
- `frontend/src/components/tasks/TaskCard.tsx` - Task display component
- `frontend/src/components/tasks/TaskEditor.tsx` - Rich task editor modal
- `frontend/src/components/tasks/QuickAddFAB.tsx` - Floating action button
- `frontend/src/components/tasks/FilterDropdown.tsx` - Filter UI
- `frontend/src/components/tasks/SortDropdown.tsx` - Sort UI
- `frontend/src/components/tasks/QuickFilters.tsx` - Quick filter buttons
- `frontend/src/components/tasks/FilterChips.tsx` - Active filters
- `frontend/src/components/tasks/EmptyState.tsx` - Empty state
- `frontend/src/components/tasks/TaskCardSkeleton.tsx` - Loading skeleton
- `frontend/src/components/ui/textarea.tsx` - Textarea component
- `frontend/src/hooks/useTasks.ts` - TanStack Query hooks
- `frontend/src/lib/dateFormat.ts` - Date formatting utility

**Dependencies Added:**
- `chrono-node` - Natural language date parsing

---

## Next Steps (Phase 7)

### Phase 6: Advanced Features (T121-T153) - ✅ COMPLETE

**Goal:** Premium features that differentiate TodoFlow

**Key Features:**
- ✅ Kanban board with drag-and-drop (@dnd-kit)
- ✅ Calendar view (monthly, weekly, daily)
- ✅ Projects dashboard with stats
- ✅ Focus mode (distraction-free)
- ✅ Pomodoro timer with session tracking
- ✅ Browser notifications and sound alerts

**Files Created:**
- `frontend/src/app/kanban/page.tsx` - Kanban board page
- `frontend/src/app/calendar/page.tsx` - Calendar page (Month/Week/Day)
- `frontend/src/app/projects/page.tsx` - Projects dashboard
- `frontend/src/app/projects/[id]/page.tsx` - Project detail
- `frontend/src/app/focus/page.tsx` - Focus mode
- `frontend/src/components/kanban/*` - Kanban components
- `frontend/src/components/calendar/*` - Calendar component
- `frontend/src/components/projects/*` - Project components
- `frontend/src/components/pomodoro/*` - Pomodoro timer & stats
- `frontend/src/hooks/usePomodoro.ts` - Timer hook
- `frontend/src/hooks/useCalendarShortcuts.ts` - Keyboard shortcuts

**Build Status:** ✅ Deployment Ready (0 errors, 0 warnings)

---

### Phase 7: Premium UX Polish (T154-T180) - ⏳ NEXT

**Goal:** Delight moments and power user features

**Key Features:**
- Dashboard with real stats (T154-T162)
- Completion celebrations (confetti, streaks) (T163-T169)
- Global keyboard shortcuts (T170-T176)
- Labels management UI (T177-T183)
- PWA support (offline, install prompt) (T184-T190)
- Responsive design polish (T191-T195)

---

## Testing Checklist

### Integration Testing (Before Phase 5)

- [ ] Start backend: `cd backend && uvicorn main:app --reload`
- [ ] Start frontend: `cd frontend && npm run dev`
- [ ] Test signup flow
- [ ] Test signin flow
- [ ] Test protected dashboard route
- [ ] Test signout flow
- [ ] Verify JWT token attachment to API requests
- [ ] Test user isolation (User A cannot see User B's tasks)

### Build Verification

```bash
# Frontend build
cd frontend && npm run build
# Expected: ✓ Compiled successfully, 0 errors

# Backend import test
cd backend && python -c "from main import app; print('OK')"
# Expected: FastAPI app: TodoFlow API, Total routes: 36
```

---

## Troubleshooting

### Frontend stuck on "Loading..."
- Ensure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in frontend/.env
- Verify database connection in backend

### Port already in use
```bash
# Windows - Kill process
netstat -ano | findstr :3000
taskkill /F /PID <PID>

netstat -ano | findstr :8000
taskkill /F /PID <PID>
```

### Middleware/Proxy issues
- Next.js 16.1.6 uses `proxy.ts` convention
- Function must be named `proxy()` not `middleware()`
- File location: `src/proxy.ts` or root `proxy.ts`

---

## Related Files

- `.specify/memory/constitution.md` - Project constitution
- `.specify/specs/overview.md` - Complete specification
- `.specify/specs/impl-plan.md` - Implementation plan
- `.specify/specs/tasks.md` - All tasks
- `README.md` - Detailed setup instructions
- `VERSION_HISTORY.md` - Version tracking
- `VERIFICATION-CHECKLIST.md` - Build verification
- `FRONTEND-ISSUES-FIXED.md` - Recent fixes
- `docker-compose.yml` - Container configuration

---

## Agent Reference (For Future Tasks)

| Agent | Purpose |
|-------|---------|
| `neon-db-architect` | Database schema, migrations |
| `fastapi-backend-master` | API endpoints, JWT auth |
| `frontend-visionary` | Next.js UI, premium UX |
| `integration-guardian` | End-to-end flow, CORS, JWT sync |
| `qa-polish-sentinel` | Testing, accessibility, performance |
| `saas-product-architect` | Feature planning, UX strategy |

---

*This project follows Constitution Principle 1 (Spec-Driven Development) and Principle 6 (Agentic Workflow Compliance). All implementations must reference relevant specs.*
