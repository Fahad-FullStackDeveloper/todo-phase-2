---
name: task-model-rules
description: Enforces consistent task, project, label, subtask schema and business rules
---

# Task, Project & Related Model Rules

When defining models or endpoints:

Core fields EVERY Task MUST have:
- title: str (required, 1–200 chars)
- description: str | None (Markdown supported)
- completed: bool (default False)
- due_date: datetime | None
- priority: int (1–4, 1 = highest)
- created_at: datetime (auto)
- updated_at: datetime (auto)
- user_id: str (FK to users.id, NOT NULL)

Additional important fields (add when relevant):
- recurring: bool (default False)
- recurring_rule: str | None (e.g. "DAILY", "WEEKLY_MON")
- labels: relationship to Label (many-to-many)
- subtasks: relationship to Subtask (one-to-many)
- attachments: list[str] | JSON (paths or URLs)

Project model:
- name: str (required)
- description: str | None
- user_id: str (FK)
- tasks: relationship to Task

Label model:
- name: str
- color: str (hex)
- user_id: str

Business rules:
- Title cannot be empty
- Due date validation: not in past unless allowed
- Subtasks inherit completion status logic
- When completing task → optionally complete subtasks
- Filter ALL list endpoints by user_id + optional project_id

Always include created_at/updated_at timestamps using server_default and onupdate.