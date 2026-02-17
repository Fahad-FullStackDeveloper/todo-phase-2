# TodoFlow - Phase 2 Full-Stack Application

**Constitution Version:** 1.0.6
**Current Phase:** Phase 4 - Frontend Authentication UI (Complete)
**Current Version:** 1.4.1
**Project Status:** Full-stack application with working authentication
**Build Status:** ✅ Deployment Ready (0 warnings)

---

## Project Overview

TodoFlow is a premium SaaS todo/task management application with 27 features (9 basic + 18 premium). This is Phase 2 of the hackathon, transforming a console app into a modern multi-user web application.

**Architecture:** Monorepo
- **Frontend:** Next.js 16.1.6 (App Router, src/ folder, Server Components)
- **Backend:** Python FastAPI with SQLModel ORM
- **Database:** Neon Serverless PostgreSQL (local: PostgreSQL 15)
- **Authentication:** Better Auth + JWT (shared secret)

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
│   │   ├── lib/                 # Utilities (api.ts)
│   │   ├── hooks/               # Custom hooks
│   │   ├── types/               # TypeScript types
│   │   └── config/              # Configuration
│   ├── public/                  # Static assets
│   ├── package.json             # Node dependencies
│   ├── next.config.js           # Next.js configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   ├── tsconfig.json            # TypeScript config
│   ├── .env.example             # Environment template
│   └── Dockerfile               # Frontend container
├── docker-compose.yml           # Container orchestration
├── .env.example                 # Root environment template
├── CLAUDE.md                    # This file
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

## How to Use Specs

1. **Always read relevant spec before implementing**
2. **Reference specs with:** `@.specify/specs/<feature>.md`
3. **Update specs if requirements change**

### Referencing Specs in Claude Code

```
# Implement a feature
You: @.specify/specs/features/task-management.md implement the create task feature

# Implement API
You: @.specify/specs/overview.md implement the GET /api/tasks endpoint

# Update database
You: @.specify/specs/overview.md add due_date field to tasks
```

---

## Development Workflow

### Spec-Driven Development Process

```
1. SPECIFICATION → Read/create spec in .specify/specs/
2. PLAN GENERATION → Generate implementation plan
3. TASK BREAKDOWN → Break into atomic tasks
4. CLAUDE CODE IMPLEMENTATION → Agents implement via spec references
5. VALIDATION → Test against acceptance criteria
6. ITERATION → Refine spec if requirements change
```

### Commands

```bash
# Start all services (Docker)
docker-compose up

# Start all services with rebuild
docker-compose up --build

# Backend only (local development)
cd backend && python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend only (local development)
cd frontend && npm install
npm run dev

# View logs
docker-compose logs -f

# Access containers
docker-compose exec backend bash
docker-compose exec frontend bash
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
```
DATABASE_URL=postgresql://user:pass@localhost:5432/todoflow
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

---

## Agent Reference

| Agent | Purpose |
|-------|---------|
| `neon-db-architect` | Database schema, migrations |
| `fastapi-backend-master` | API endpoints, JWT auth |
| `frontend-visionary` | Next.js UI, premium UX |
| `integration-guardian` | End-to-end flow, CORS, JWT sync |
| `qa-polish-sentinel` | Testing, accessibility, performance |

---

## Phase 4 Completion Checklist

### Phase 1-3 (Complete)
- [x] T001-T008: Project structure & setup
- [x] T009-T023: Database schema & migrations
- [x] T024-T063: Backend APIs with JWT auth

### Phase 4 (Complete)
- [x] T064-T069: Next.js configuration (shadcn/ui, Framer Motion, TanStack Query)
- [x] T070-T076: Authentication UI (signup, signin, signout)
- [x] T077-T083: Layout & Navigation (sidebar, top nav, dark mode)
- [x] T084-T088: API Client Setup (JWT attachment, error handling, optimistic updates)

---

## Getting Started

1. **Copy environment files:**
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. **Generate secure secret:**
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

3. **Start with Docker:**
   ```bash
   docker-compose up --build
   ```

4. **Access applications:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

---

## Related Files

- `.specify/memory/constitution.md` - Project constitution
- `.specify/specs/overview.md` - Complete specification
- `.specify/specs/impl-plan.md` - Implementation plan
- `.specify/specs/tasks.md` - All tasks
- `README.md` - Detailed setup instructions
- `docker-compose.yml` - Container configuration

---

*This project follows Constitution Principle 1 (Spec-Driven Development) and Principle 6 (Agentic Workflow Compliance). All implementations must reference relevant specs.*
