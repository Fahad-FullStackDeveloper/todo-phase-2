# Phase 2 TODO Application

**Constitution Version:** 1.0.0  
**Current Phase:** Phase II - Full-Stack Web Application  

---

## Project Overview

This is a monorepo using Spec-Kit Plus for spec-driven development with Claude Code agents. The project transforms a console-based TODO application into a premium, multi-user SaaS web application.

---

## Spec-Kit Structure

Specifications and governance are organized in `.specify/`:

| Directory | Purpose |
|-----------|---------|
| `.specify/memory/` | Project constitution and long-term memory |
| `.specify/templates/` | Templates for specs, plans, tasks, and commands |
| `.specify/scripts/` | Automation scripts (PHR creation, etc.) |
| `.specify/history/` | Prompt history records (PHR) |
| `.specify/specs/` | Feature, API, database, and UI specifications |

---

## Constitution Principles

All development MUST adhere to these principles:

1. **SPEC-DRIVEN DEVELOPMENT** - No manual coding; specs before implementation
2. **MONOREPO ARCHITECTURE** - Frontend and backend in single repository
3. **JWT AUTHENTICATION & USER ISOLATION** - Better Auth with strict user data isolation
4. **NEON SERVERLESS POSTGRESQL** - SQLModel ORM for all data persistence
5. **PREMIUM SAAS UX STANDARDS** - Next.js 16+, shadcn/ui, Framer Motion, dark mode
6. **AGENTIC WORKFLOW COMPLIANCE** - Specialized agents for each domain

See `.specify/memory/constitution.md` for full details.

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16+ (App Router) |
| Backend | Python FastAPI |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |
| Authentication | Better Auth with JWT |
| UI Components | shadcn/ui + Tailwind CSS |
| Animations | Framer Motion |
| State Management | TanStack Query |

---

## How to Use Specs

1. **Always read relevant spec before implementing**
2. **Reference specs with:** `@.specify/specs/<feature>.md`
3. **Update specs if requirements change**

---

## Project Structure

```
phase-2/
├── .specify/
│   ├── memory/constitution.md      # Project constitution
│   ├── templates/                   # Spec, plan, task templates
│   ├── scripts/bash/                # Automation scripts
│   └── history/prompts/             # Prompt history records
├── frontend/                        # Next.js 16+ application
├── backend/                         # FastAPI application
├── docker-compose.yml               # Container orchestration
└── README.md                        # This file
```

---

## Development Workflow

1. **Read/Create Spec:** `.specify/specs/<feature>.md`
2. **Generate Plan:** Use plan template
3. **Break into Tasks:** Use tasks template with agent assignments
4. **Implement via Claude Code:** Invoke appropriate specialized agents
5. **Test and Iterate:** Run QA validation

---

## Commands

### Frontend
```bash
cd frontend && npm run dev
```

### Backend
```bash
cd backend && uvicorn main:app --reload
```

### Both (Docker)
```bash
docker-compose up
```

### Create PHR
```bash
.specify/scripts/bash/create-phr.sh --title "My Task" --stage spec --feature my-feature
```

---

## API Endpoints

All endpoints require JWT authentication:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/{user_id}/tasks` | List all tasks |
| POST | `/api/{user_id}/tasks` | Create a new task |
| GET | `/api/{user_id}/tasks/{id}` | Get task details |
| PUT | `/api/{user_id}/tasks/{id}` | Update a task |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete a task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion |

---

## Agent Reference

| Agent | Purpose |
|-------|---------|
| `backend-master` | FastAPI backend with REST APIs, JWT auth |
| `fastapi-backend-master` | SaaS-focused FastAPI backend |
| `frontend-visionary` | Premium Next.js frontend |
| `integration-guardian` | Full-stack integration, CORS, JWT sync |
| `neon-db-architect` | Neon PostgreSQL schema design |
| `qa-polish-sentinel` | QA validation, testing, accessibility |
| `saas-product-architect` | Product vision, UX strategy |

---

## Getting Started

1. Read the constitution: `.specify/memory/constitution.md`
2. Review existing specs: `.specify/specs/`
3. Use `/sp.constitution` to update governance
4. Use `/sp.specify` to create feature specifications
