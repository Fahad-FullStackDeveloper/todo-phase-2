<!--
PHR: Prompt History Record
ID: 20260217-181551
Stage: plan
Title: Create implementation plan
Feature: overview
-->

# Create implementation plan

**ID:** `20260217-181551`  
**Stage:** `plan`  
**Date:** 17 Feb 2026, 6:15 PM  
**Feature:** overview  

---

## Prompt

/sp.plan @specs/overview.md

Using full Phase 2 documentation (monorepo structure with specs/ organized by type, frontend Next.js 16.1.6 App Router src/ folder, backend FastAPI + SQLModel + Neon Postgres, Better Auth + JWT with shared secret, REST endpoints under /api/, user isolation, premium SaaS features beyond basic CRUD: Kanban board, Calendar view, Projects/workspaces, rich task editor with subtasks/labels/priority/due/recurring/attachments/comments, productivity tools like Pomodoro/Focus Mode/Habit Tracker/dashboard stats, global search/filters, dark mode, animations, keyboard shortcuts).

Follow constitution: spec-driven only, no manual code, use agents and skills, premium UX polish.

Incorporate date/time display best practices for international SaaS:
- Store in ISO 8601 (YYYY-MM-DDTHH:mm:ssZ) in DB/API
- Display in UI: Month as text + short day + year + time, e.g. "17 Feb 2026, 4:30 PM" or "17 Feb 2026, 16:30" (locale-aware via Intl.DateTimeFormat, default to short month text like 'Feb', fallback to full 'February' if space allows; support 12/24-hour toggle; relative like "Today at 4:30 PM" for recent dates)

Generate a detailed, phased implementation plan broken into major steps/phases (e.g., 1. Database schema, 2. Backend auth + core APIs, 3. Frontend setup + auth, 4. Task views & editor, 5. Advanced features like Kanban/Calendar/Projects, 6. Integration & QA, 7. Polish & testing).

For each phase, list key sub-tasks, which agent to use (e.g. @agents/database-oracle for schema, @agents/backend-master for APIs, @agents/frontend-visionary for UI), which skills to apply (e.g. nextjs-structure-enforcer, fastapi-jwt-security, premium-ux-polish, task-model-rules, neon-db-patterns), and reference relevant specs files (e.g. @specs/database/schema.md, @specs/features/task-management.md).

Output the plan in clear numbered phases with bullet-point sub-tasks. and /features/

---

## Response Summary

Created comprehensive 7-phase implementation plan (`.specify/specs/impl-plan.md`) for complete TodoFlow Phase 2 application:

**Plan Structure:**
- 7 major phases with 100+ sub-tasks
- Agent assignments for each phase
- Skill references (neon-db-patterns, fastapi-jwt-security, premium-ux-polish, etc.)
- Spec references for all features
- Risk assessment with mitigations
- Definition of Done

**Phase 1: Database Schema & Models**
- 7 tables: users, tasks, projects, subtasks, labels, task_labels, pomodoro_sessions
- SQLModel models with relationships
- Alembic migrations with indexes
- Agent: neon-db-architect

**Phase 2: Backend Authentication & Core APIs**
- JWT authentication with Better Auth integration
- 29 API endpoints across 6 categories
- User isolation enforced on every endpoint
- Agent: fastapi-backend-master

**Phase 3: Frontend Setup & Authentication**
- Next.js 16.1.6 App Router with src/ folder
- Authentication UI (signup, signin, signout)
- Layout with sidebar, navigation, dark mode toggle
- Agent: frontend-visionary

**Phase 4: Task Views & Editor**
- Task list view with infinite scroll
- Rich task editor (markdown, subtasks, labels, priority, due date)
- Quick add FAB with natural language parsing
- Advanced filtering & sorting
- Date/time display: "17 Feb 2026, 4:30 PM" (Intl.DateTimeFormat)
- Agent: frontend-visionary

**Phase 5: Advanced Features**
- Kanban board (drag-and-drop with @dnd-kit)
- Calendar view (monthly/weekly/daily)
- Projects dashboard with stats
- Focus mode (distraction-free)
- Pomodoro timer
- Agent: frontend-visionary

**Phase 6: Premium UX Polish**
- Analytics dashboard with charts
- Completion celebrations (confetti, streaks)
- Keyboard shortcuts (global, task list, navigation)
- Labels management
- PWA support (offline, install prompt)
- Responsive design (mobile-first)
- Agent: frontend-visionary

**Phase 7: Integration, QA & Testing**
- End-to-end integration testing
- QA validation (security, accessibility, performance)
- Premium polish (animations, dark mode, micro-interactions)
- Documentation (README, API docs, deployment guide)
- Performance optimization
- Agents: integration-guardian, qa-polish-sentinel

**Key Features:**
- Date/time format: International standard (17 Feb 2026, 4:30 PM)
- ISO 8601 storage, locale-aware display
- 12/24-hour toggle support
- Relative dates for recent items

**Agent & Skill Matrix:**
- neon-db-architect + neon-db-patterns (Phase 1)
- fastapi-backend-master + fastapi-jwt-security (Phase 2)
- frontend-visionary + premium-ux-polish (Phase 3-6)
- integration-guardian, qa-polish-sentinel (Phase 7)

---

## Artifacts Created

- [x] `.specify/specs/impl-plan.md` - 7-phase implementation plan (~2000 lines)
- [x] `.specify/memory/constitution.md` - Updated sync report (v1.0.6 → v1.0.7)
- [x] `.specify/history/prompts/overview/20260217-181551-create-implementation-plan.md` - This PHR

---

## Follow-up

- [ ] Begin Phase 1 implementation (database schema)
- [ ] Create task breakdown using /sp.tasks command
- [ ] Generate implementation agents for each phase
- [ ] Track progress against plan
