<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.8 → 1.0.9 (Tasks refinement checklist created)
Modified principles: None
Added sections:
  - .specify/specs/checklists/tasks-refinement.md (60 items validating task quality)
Removed sections: None
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ aligned
  - .specify/templates/spec-template.md ✅ aligned
  - .specify/templates/tasks-template.md ✅ aligned
Follow-up TODOs:
  - TODO(CREATE_API_SPEC): Create rest-endpoints.md combining all API endpoints
  - TODO(CREATE_DB_SPEC): Create schema.md with SQLModel definitions
  - TODO(CREATE_UI_SPEC): Create components.md and pages.md
  - ✅ ALL FEATURE SPECS COMPLETE (16 files, 27 features + monetization)
  - ✅ DATE FORMAT UPDATED (International standard: 17 Feb 2026, 4:30 PM)
  - ✅ IMPLEMENTATION PLAN COMPLETE (7 phases)
  - ✅ TASKS GENERATED (225 tasks, 8 phases, MVP defined)
  - ✅ TASKS CHECKLIST CREATED (60 items, file path validation)
-->

# Project Constitution

**Project Name:** Phase 2 TODO Application
**Constitution Version:** 1.0.0
**Ratification Date:** 17 Feb 2026
**Last Amended Date:** 17 Feb 2026

---

## Principle 1: SPEC-DRIVEN DEVELOPMENT

**All development MUST follow the spec-driven workflow. No manual coding allowed.**

### Non-Negotiable Rules

- Every feature MUST have a written specification before implementation begins
- Specifications MUST be stored in `.specify/specs/` directory
- Claude Code agents MUST be used for all code generation
- Implementations MUST reference and adhere to their corresponding specs
- Specs MUST be updated if requirements change during implementation
- The workflow MUST follow: Write Spec → Generate Plan → Break into Tasks → Implement via Claude Code

### Rationale

Spec-driven development ensures traceability, consistency, and enables agentic workflows to operate with full context. Manual coding bypasses the specification layer and breaks the audit trail.

---

## Principle 2: MONOREPO ARCHITECTURE

**The project MUST maintain a monorepo structure with clear layer separation.**

### Non-Negotiable Rules

- Frontend (Next.js) and Backend (FastAPI) MUST coexist in a single repository
- A root `CLAUDE.md` MUST provide project-wide context and navigation guidance
- Each layer (frontend/, backend/) MUST have its own `CLAUDE.md` with layer-specific conventions
- Cross-cutting changes MUST be made with awareness of both layers
- The monorepo MUST support single-context development for Claude Code agents

### Rationale

A monorepo structure enables Claude Code to navigate and edit both frontend and backend code in a single context, simplifying cross-cutting changes and maintaining consistency across the stack.

---

## Principle 3: JWT AUTHENTICATION & USER ISOLATION

**All API endpoints MUST enforce JWT-based authentication with strict user isolation.**

### Non-Negotiable Rules

- Authentication MUST use Better Auth with JWT token issuance
- All API requests MUST include a valid JWT token in the `Authorization: Bearer <token>` header
- The FastAPI backend MUST verify JWT signatures using a shared secret key
- All database queries MUST filter by the authenticated user's ID
- Requests without valid tokens MUST receive 401 Unauthorized
- Task ownership MUST be enforced on every operation (create, read, update, delete)
- The same `BETTER_AUTH_SECRET` environment variable MUST be configured in both frontend and backend

### Rationale

JWT-based authentication with user isolation ensures that each user can only access their own data. Stateless verification allows the backend to operate independently while maintaining security guarantees.

---

## Principle 4: NEON SERVERLESS POSTGRESQL DATA LAYER

**All persistent data MUST be stored in Neon Serverless PostgreSQL using SQLModel ORM.**

### Non-Negotiable Rules

- Database connections MUST use the `DATABASE_URL` environment variable
- All database operations MUST use SQLModel ORM (no raw SQL unless absolutely necessary)
- Models MUST define proper relationships (e.g., User → Tasks one-to-many)
- Indexes MUST be created on frequently queried fields (e.g., `user_id`, `completed`)
- Migrations MUST be managed via Alembic
- Connection strings MUST never be hardcoded

### Rationale

Neon Serverless PostgreSQL provides scalable, serverless database infrastructure. SQLModel provides type-safe ORM capabilities that integrate with FastAPI's Pydantic models, ensuring consistency and reducing boilerplate.

---

## Principle 5: PREMIUM SAAS UX STANDARDS

**The frontend MUST deliver a premium, production-ready SaaS user experience.**

### Non-Negotiable Rules

- The UI MUST be built with Next.js 16+ using the App Router
- Server Components MUST be used by default; Client Components only when interactivity is required
- The UI MUST include Kanban and Calendar views for task management
- Projects/grouping functionality MUST be implemented for task organization
- Rich task features (descriptions, due dates, priorities, labels) MUST be supported
- The design MUST follow shadcn/ui component patterns with Tailwind CSS
- Animations MUST use Framer Motion for smooth transitions
- Dark mode MUST be supported
- The application MUST be fully responsive and accessible (WCAG 2.1 AA)
- State management MUST use TanStack Query for server state
- PWA support SHOULD be implemented for offline capabilities

### Rationale

Premium UX differentiates the product and ensures user adoption. Modern Next.js patterns (Server Components, Server Actions) improve performance and SEO while reducing client-side complexity.

---

## Principle 6: AGENTIC WORKFLOW COMPLIANCE

**All development MUST leverage specialized agents for their domain expertise.**

### Non-Negotiable Rules

- Backend development MUST use `backend-master` or `fastapi-backend-master` agents
- Frontend development MUST use `frontend-visionary` agent
- Database schema changes MUST use `neon-db-architect` agent
- Integration issues MUST use `integration-guardian` agent
- QA and testing MUST use `qa-polish-sentinel` agent
- Product/feature planning MUST use `saas-product-architect` agent
- Agents MUST be invoked via the `task` tool with appropriate subagent_type
- Agent prompts MUST include detailed task descriptions and expected outcomes

### Rationale

Specialized agents encode domain-specific best practices and ensure consistent, high-quality implementations across different layers of the application.

---

## Governance

### Amendment Procedure

This constitution MAY be amended by:

1. Proposing the change via `/sp.constitution` command with justification
2. Incrementing the version according to semantic versioning rules
3. Updating the `LAST_AMENDED_DATE` to the current date
4. Running the consistency propagation checklist (see below)
5. Recording the change in the SYNC IMPACT REPORT comment at the top of this file

### Versioning Policy

Constitution versions follow semantic versioning (`MAJOR.MINOR.PATCH`):

- **MAJOR**: Backward-incompatible changes (principle removals, fundamental redefinitions)
- **MINOR**: New principles added, existing principles materially expanded
- **PATCH**: Clarifications, wording improvements, typo fixes

### Compliance Review

All specifications, plans, and implementations MUST be reviewed for constitution compliance:

- New feature specs MUST be validated against relevant principles
- Agent prompts SHOULD reference applicable principles
- The `qa-polish-sentinel` agent MUST check for constitution adherence during QA reviews

### Consistency Propagation Checklist

When amending this constitution, the following MUST be validated:

- [ ] `.specify/templates/plan-template.md` — Ensure "Constitution Check" aligns with principles
- [ ] `.specify/templates/spec-template.md` — Update if new mandatory sections/constraints added
- [ ] `.specify/templates/tasks-template.md` — Ensure task categorization reflects principle-driven types
- [ ] `.specify/templates/commands/*.md` — Verify no outdated references remain
- [ ] `CLAUDE.md` files — Update if constitution changes affect project navigation
- [ ] `README.md` or docs — Update references to changed principles

---

## Appendix: Technology Stack Reference

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
| Spec-Driven | Claude Code + Spec-Kit Plus |

---

## Appendix: API Endpoint Requirements

All REST API endpoints MUST follow these conventions:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/{user_id}/tasks` | List all tasks | YES |
| POST | `/api/{user_id}/tasks` | Create a new task | YES |
| GET | `/api/{user_id}/tasks/{id}` | Get task details | YES |
| PUT | `/api/{user_id}/tasks/{id}` | Update a task | YES |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete a task | YES |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion | YES |

All endpoints MUST enforce JWT authentication and filter by authenticated user ID.
