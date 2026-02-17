---
name: neon-db-patterns
description: Enforces best practices for Neon Serverless PostgreSQL + SQLModel
---

# Neon DB & Query Patterns Skill

Database & query rules:

- Connection: asyncpg driver → postgresql+asyncpg://...
- Use async sessions everywhere (async with get_db())
- Indexes (add these):
  - tasks: user_id, completed, due_date, priority
  - projects: user_id
  - task_labels: task_id, label_id
- Full-text search: use pg_trgm extension + ilike or trigram index on title/description when implementing search
- Pagination: offset/limit + count query for total
- Common patterns:
  - List tasks: select().where(Task.user_id == user_id).order_by(...)
  - Filter: .where(Task.completed == False), .where(Task.due_date <= end_date)
  - Eager loading: selectinload for relationships when needed
- Migrations: ALWAYS use alembic --autogenerate
- SSL: enforce sslmode=require in prod DATABASE_URL
- Connection pooling: let Neon handle it (no manual pool_size tweaks unless issues)
- Avoid N+1: use joinedload/selectinload for related data

Never write blocking sync queries. Always filter by user_id.