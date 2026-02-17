# Feature: Filtering & Sorting

**Feature ID:** PF-09 (Detail)
**Status:** `draft`
**Constitution Principles:**
- Principle 1: Spec-Driven Development
- Principle 3: JWT Authentication & User Isolation
- Principle 4: Neon Serverless PostgreSQL Data Layer
- Principle 5: Premium SaaS UX Standards

---

## Overview

Filtering & Sorting provides powerful task organization capabilities, enabling users to create focused views of their tasks based on multiple criteria. This specification covers advanced filtering by status, priority, project, labels, and date ranges; sorting by various fields; smart lists (saved filters); quick filters; filter combination logic; and filter persistence.

The implementation must deliver a flexible, intuitive filtering system with real-time updates and smart defaults that rivals Todoist Filters and TickTick Smart Lists.

---

## User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-FS-01 | As a user, I can filter tasks by status so that I can focus on active or completed items | Must Have |
| US-FS-02 | As a user, I can filter tasks by priority so that I can focus on what's most important | Must Have |
| US-FS-03 | As a user, I can filter tasks by project so that I can focus on specific work areas | Must Have |
| US-FS-04 | As a user, I can filter tasks by labels so that I can find related items | Must Have |
| US-FS-05 | As a user, I can filter tasks by date range so that I can see upcoming or past work | Must Have |
| US-FS-06 | As a user, I can sort tasks by created date, due date, priority, or title so that I can organize my view | Must Have |
| US-FS-07 | As a user, I can combine multiple filters so that I can create precise views | Must Have |
| US-FS-08 | As a user, I can save filter combinations as smart lists so that I can reuse them | Should Have |
| US-FS-09 | As a user, I can access quick filters (Today, This Week, Overdue) so that I can quickly see common views | Must Have |
| US-FS-10 | As a user, my filter preferences persist across sessions so that I don't lose my setup | Must Have |

---

## Acceptance Criteria

### Status Filtering (US-FS-01)

- [ ] Filter options: All, Todo, In Progress, Done
- [ ] Status filter accessible from filter panel and quick filter chips
- [ ] Default: All (or user preference)
- [ ] Status filter shows task count for each option
- [ ] Multiple status selection allowed (e.g., Todo + In Progress)
- [ ] Status filter combines with other filters using AND logic

### Priority Filtering (US-FS-02)

- [ ] Filter options: All, Urgent, High, Medium, Low
- [ ] Priority filter shows color indicators matching priority colors
- [ ] Priority filter shows task count for each option
- [ ] Multiple priority selection allowed
- [ ] Priority filter combines with other filters using AND logic

### Project Filtering (US-FS-03)

- [ ] Filter options: All Projects, plus list of user's projects
- [ ] Project filter shows project color indicators
- [ ] Project filter shows task count for each project
- [ ] "No Project" option shows unassigned tasks
- [ ] Multiple project selection allowed
- [ ] Project filter combines with other filters using AND logic

### Label Filtering (US-FS-04)

- [ ] Filter options: All Labels, plus list of user's labels
- [ ] Label filter shows label color indicators
- [ ] Label filter shows task count for each label
- [ ] Multiple label selection allowed
- [ ] Toggle between OR (any label) and AND (all labels) logic
- [ ] Default: OR logic (tasks with any selected label)

### Date Range Filtering (US-FS-05)

- [ ] Quick date options: Today, Tomorrow, Next 7 Days, Next 30 Days, This Month, Next Month
- [ ] Past date options: Overdue, Completed Today, Completed This Week, Completed This Month
- [ ] Custom date range picker with start and end dates
- [ ] "No Date" option shows tasks without due dates
- [ ] "Any Date" shows all tasks regardless of date
- [ ] Date filter shows approximate task count

### Sorting Options (US-FS-06)

- [ ] Sort by: Created Date, Due Date, Priority, Title, Completion Date, Project
- [ ] Sort direction: Ascending, Descending
- [ ] Default sort: Due Date Ascending (earliest first), then Priority Descending
- [ ] "No Date" tasks sort to end when sorting by due date
- [ ] Sort preference persists per view (list, kanban, calendar)
- [ ] Manual sort order option for custom arrangement (drag-and-drop)

### Filter Combination (US-FS-07)

- [ ] Multiple filters can be active simultaneously
- [ ] Different filter types combine with AND logic
- [ ] Same filter type (e.g., multiple labels) can use OR or AND logic
- [ ] Active filters displayed as removable chips/badges
- [ ] Filter count shown: "5 filters, 12 tasks"
- [ ] Clear all filters button when multiple filters active
- [ ] Individual filter removal via X on chip

### Smart Lists (US-FS-08)

- [ ] Save current filter combination as smart list
- [ ] Smart list requires name (1-50 characters)
- [ ] Smart list optionally has icon/emoji
- [ ] Smart list appears in sidebar under "Smart Lists" section
- [ ] Smart list shows current task count
- [ ] Smart list can be edited (change filters)
- [ ] Smart list can be deleted with confirmation
- [ ] Smart list can be reordered via drag-and-drop
- [ ] Maximum 50 smart lists per user

### Quick Filters (US-FS-09)

- [ ] Quick filter chips always visible in filter bar:
  - Today
  - This Week
  - Overdue
  - Completed
- [ ] Click quick filter applies filter immediately
- [ ] Quick filter shows task count
- [ ] Quick filter toggles off when clicked again
- [ ] Quick filters work in combination with other filters
- [ ] Keyboard shortcuts for quick filters (see keyboard-shortcuts.md)

### Filter Persistence (US-FS-10)

- [ ] Active filters persist across page refreshes
- [ ] Filter state stored in localStorage
- [ ] Filter state syncs with URL query params for shareable links
- [ ] User can clear persisted filters
- [ ] Default filters can be set in user preferences
- [ ] Filter preferences sync across devices (via user profile)

---

## Technical Requirements

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks` | Yes | List tasks with filter/sort query params |
| GET | `/api/tasks/filters` | Yes | Get available filter options with counts |
| POST | `/api/smart-lists` | Yes | Create smart list |
| GET | `/api/smart-lists` | Yes | List user's smart lists |
| PUT | `/api/smart-lists/:id` | Yes | Update smart list |
| DELETE | `/api/smart-lists/:id` | Yes | Delete smart list |
| GET | `/api/smart-lists/:id/tasks` | Yes | Get tasks for smart list |

### Query Parameters for GET /api/tasks

```
?status=todo,in_progress
&priority=urgent,high
&project_id=uuid1,uuid2
&labels=uuid1,uuid2
&label_logic=or
&due_date_from=2026-02-17
&due_date_to=2026-02-24
&overdue=true
&completed=false
&sort_by=due_date
&sort_order=asc
&page=1
&limit=50
```

### Filter Query Parameter Details

| Parameter | Type | Values | Description |
|-----------|------|--------|-------------|
| `status` | string[] | `todo`, `in_progress`, `done` | Filter by status (comma-separated) |
| `priority` | string[] | `low`, `medium`, `high`, `urgent` | Filter by priority |
| `project_id` | UUID[] | - | Filter by project IDs |
| `labels` | UUID[] | - | Filter by label IDs |
| `label_logic` | string | `or`, `and` | Logic for multiple labels |
| `due_date_from` | date | ISO 8601 | Filter tasks due from this date |
| `due_date_to` | date | ISO 8601 | Filter tasks due until this date |
| `overdue` | boolean | `true`, `false` | Filter overdue tasks only |
| `completed` | boolean | `true`, `false` | Filter by completion status |
| `completed_from` | date | ISO 8601 | Filter tasks completed from this date |
| `completed_to` | date | ISO 8601 | Filter tasks completed until this date |
| `sort_by` | string | `created_at`, `due_date`, `priority`, `title`, `completed_at`, `project` | Sort field |
| `sort_order` | string | `asc`, `desc` | Sort direction |
| `manual_order` | boolean | `true`, `false` | Use manual sort order |

### Database Models

#### Smart Lists Table

```sql
CREATE TABLE smart_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    filters JSONB NOT NULL,
    -- Example filters:
    -- {
    --   "status": ["todo", "in_progress"],
    --   "priority": ["urgent", "high"],
    --   "project_ids": ["uuid"],
    --   "label_ids": ["uuid"],
    --   "label_logic": "or",
    --   "due_date_from": "2026-02-17",
    --   "due_date_to": "2026-02-24",
    --   "overdue": false,
    --   "completed": false
    -- }
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_smart_lists_user_id ON smart_lists(user_id);
CREATE INDEX idx_smart_lists_user_position ON smart_lists(user_id, position);
```

### Validation Rules

| Field | Type | Constraints | Error Message |
|-------|------|-------------|---------------|
| `smart_list.name` | string | Required, 1-50 chars | "Smart list name is required (1-50 characters)" |
| `smart_list.icon` | string | Optional, emoji or icon name | "Invalid icon" |
| `smart_list.filters` | JSONB | Valid filter structure | "Invalid filter structure" |
| `sort_by` | string | Valid sort field | "Invalid sort field" |
| `sort_order` | string | `asc`, `desc` | "Invalid sort order" |
| `label_logic` | string | `or`, `and` | "Invalid label logic" |

### Filter Query Builder

```python
def build_task_query(user_id: UUID, filters: dict) -> str:
    """Build SQL query from filter parameters."""
    base_query = "SELECT * FROM tasks WHERE user_id = :user_id"
    params = {"user_id": user_id}
    
    # Status filter
    if filters.get("status"):
        status = filters["status"]
        base_query += " AND status = ANY(:status)"
        params["status"] = status
    
    # Priority filter
    if filters.get("priority"):
        priority = filters["priority"]
        base_query += " AND priority = ANY(:priority)"
        params["priority"] = priority
    
    # Project filter
    if filters.get("project_ids"):
        project_ids = filters["project_ids"]
        if None in project_ids:
            # Include "No Project" tasks
            base_query += " AND (project_id = ANY(:project_ids) OR project_id IS NULL)"
        else:
            base_query += " AND project_id = ANY(:project_ids)"
        params["project_ids"] = [p for p in project_ids if p]
    
    # Label filter
    if filters.get("label_ids"):
        label_ids = filters["label_ids"]
        logic = filters.get("label_logic", "or")
        
        if logic == "and":
            # Tasks with ALL labels
            base_query += """
                AND task_id IN (
                    SELECT task_id FROM task_labels 
                    WHERE label_id = ANY(:label_ids)
                    GROUP BY task_id 
                    HAVING COUNT(DISTINCT label_id) = :label_count
                )
            """
            params["label_ids"] = label_ids
            params["label_count"] = len(label_ids)
        else:
            # Tasks with ANY label
            base_query += """
                AND task_id IN (
                    SELECT task_id FROM task_labels 
                    WHERE label_id = ANY(:label_ids)
                )
            """
            params["label_ids"] = label_ids
    
    # Date range filter
    if filters.get("due_date_from"):
        base_query += " AND due_date >= :due_date_from"
        params["due_date_from"] = filters["due_date_from"]
    
    if filters.get("due_date_to"):
        base_query += " AND due_date <= :due_date_to"
        params["due_date_to"] = filters["due_date_to"]
    
    # Overdue filter
    if filters.get("overdue"):
        base_query += " AND due_date < now() AND completed = false"
    
    # Completion filter
    if filters.get("completed") is not None:
        base_query += " AND completed = :completed"
        params["completed"] = filters["completed"]
    
    # Sorting
    sort_by = filters.get("sort_by", "due_date")
    sort_order = filters.get("sort_order", "asc")
    base_query += f" ORDER BY {sort_by} {sort_order}"
    
    return base_query, params
```

### Smart List Filter Structure

```json
{
  "id": "uuid",
  "name": "High Priority This Week",
  "icon": "🔥",
  "filters": {
    "status": ["todo", "in_progress"],
    "priority": ["urgent", "high"],
    "due_date_from": "2026-02-17",
    "due_date_to": "2026-02-23",
    "completed": false
  },
  "task_count": 12,
  "created_at": "2026-02-17T10:30:00Z"
}
```

---

## UX Requirements

### Filter Panel Component

```
┌─────────────────────────────────────────┐
│  Filters                                │
├─────────────────────────────────────────┤
│  Status                                 │
│  ☑ Todo (15)  ☑ In Progress (5)        │
│  ☐ Done (23)                            │
├─────────────────────────────────────────┤
│  Priority                               │
│  ☑ Urgent (3)  ☑ High (8)              │
│  ☐ Medium (12) ☐ Low (5)               │
├─────────────────────────────────────────┤
│  Project                                │
│  ☑ Work (10)                            │
│  ☐ Personal (8)                         │
│  ☐ No Project (5)                       │
├─────────────────────────────────────────┤
│  Labels                                 │
│  ☑ Urgent (5)  [AND/OR toggle]         │
│  ☑ Important (3)                        │
├─────────────────────────────────────────┤
│  Due Date                               │
│  From: [Feb 17, 2026]                   │
│  To:   [Feb 24, 2026]                   │
│                                         │
│  Quick: [Today] [This Week] [Overdue]  │
├─────────────────────────────────────────┤
│  Sort By: [Due Date ▼] [Ascending ▼]   │
├─────────────────────────────────────────┤
│  Active Filters:                        │
│  [Status: Todo, In Progress ✕]         │
│  [Priority: Urgent, High ✕]            │
│  [Labels: Urgent ✕]                    │
│                                         │
│  [Clear All Filters]  [Save as Smart List]
└─────────────────────────────────────────┘
```

### Quick Filter Chips

```
┌─────────────────────────────────────────┐
│  [All] [Today 8] [This Week 23]        │
│  [Overdue 3 ⚠️] [Completed 45]          │
└─────────────────────────────────────────┘
```

- **Style**: Pill-shaped buttons with count badge
- **Active State**: Filled background, white text
- **Inactive State**: Outlined, subtle background
- **Hover**: Slight elevation, count badge animates

### Filter Chips (Active Filters)

```
Active Filters:
┌─────────────────────────────────────────┐
│  Status: Todo, In Progress  ✕           │
│  Priority: Urgent, High  ✕              │
│  Project: Work  ✕                       │
│  Labels: Urgent  ✕                      │
│  Due: Feb 17-24, 2026  ✕                │
│                                         │
│  Showing 12 tasks  [Clear All]          │
└─────────────────────────────────────────┘
```

- **Style**: Rounded rectangles with color indicators
- **Remove**: X button on right side
- **Clear All**: Text button at bottom

### Smart List Sidebar

```
┌─────────────────────────────────────────┐
│  Smart Lists                 [+] Add    │
├─────────────────────────────────────────┤
│  🔥 High Priority This Week    12       │
│  📅 Due Today                   8       │
│  🏷️ Work Urgent                 5       │
│  📋 Review Needed               3       │
│  ⭐ Important                  7        │
└─────────────────────────────────────────┘
```

### Save Smart List Modal

```
┌─────────────────────────────────────────┐
│  Save as Smart List                 [X] │
├─────────────────────────────────────────┤
│                                         │
│  Name *                                 │
│  ┌─────────────────────────────────┐   │
│  │ High Priority This Week         │   │
│  └─────────────────────────────────┘   │
│                              27/50      │
│                                         │
│  Icon (optional)                        │
│  [😀] [🔥] [📅] [🏷️] [⭐] [📋] [Custom] │
│                                         │
│  Current Filters:                       │
│  • Status: Todo, In Progress            │
│  • Priority: Urgent, High               │
│  • Due: Next 7 days                     │
│                                         │
│  [Cancel]  [Save Smart List]            │
└─────────────────────────────────────────┘
```

### Empty States

- **No Filter Results**:
  ```
  ┌─────────────────────────────────────────┐
  │                                         │
  │     🔍 No tasks match your filters      │
  │                                         │
  │     Try adjusting your filters or       │
  │     create a new task                   │
  │                                         │
  │     [Clear Filters]  [+ New Task]       │
  │                                         │
  └─────────────────────────────────────────┘
  ```

- **No Smart Lists**:
  ```
  ┌─────────────────────────────────────────┐
  │                                         │
  │     📋 No smart lists yet               │
  │     Save filter combinations for        │
  │     quick access                        │
  │                                         │
  │     [+ Create your first smart list]    │
  │                                         │
  └─────────────────────────────────────────┘
  ```

### Animations (Framer Motion)

```typescript
// Filter chip enter
const filterChipEnter = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
  transition: { type: "spring", stiffness: 400, damping: 25 },
};

// Filter panel slide
const filterPanel = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  transition: { duration: 0.2 },
};

// Task list update (when filters change)
const taskListUpdate = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.15 },
};
```

### Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `F` | Open filter panel | Global |
| `S` | Open sort menu | Global |
| `/` | Focus filter search | Filter panel open |
| `Escape` | Close filter panel | Panel open |
| `1-5` | Apply quick filter 1-5 | Global |
| `G, S` | Go to Smart Lists | Global (see keyboard-shortcuts.md) |

### Accessibility

- All filter checkboxes have associated labels
- Filter counts announced to screen readers
- Keyboard navigation through all filter options
- Focus visible on all interactive elements
- ARIA live region announces filter changes
- Color contrast meets WCAG 2.1 AA

### Responsive Behavior

- **Desktop**: Full filter sidebar with all options
- **Tablet**: Collapsible filter panel
- **Mobile**: Filter as bottom sheet or modal

---

## Dependencies

| Feature | Dependency Type | Description |
|---------|-----------------|-------------|
| `task-management.md` | Required | Task data and CRUD operations |
| `auth-jwt.md` | Required | JWT authentication |
| `labels.md` | Required | Label filtering |
| `projects-kanban.md` | Required | Project filtering |

---

## Related Specifications

- `@specs/overview.md` - Project overview with API endpoint definitions
- `@specs/features/task-management.md` - Task management core features
- `@specs/features/labels.md` - Label system
- `@specs/features/projects-kanban.md` - Project features
- `@specs/features/keyboard-shortcuts.md` - Keyboard shortcuts
- `@specs/database/schema.md` - Database schema definitions

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Filter Usage Rate | >70% of users use filters weekly | Analytics tracking |
| Smart List Creation | >40% of users create 1+ smart list | Analytics tracking |
| Filter Load Time | <200ms | Time to render filter options |
| Quick Filter Adoption | >50% use quick filters daily | Interaction analytics |
| Filter Persistence Rate | >80% filters persist across sessions | Storage analytics |

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Filter with no results | Show empty state with clear filters option |
| Very large task count | Show "1000+" instead of exact count |
| Conflicting filters (e.g., overdue + completed) | Show results (completed overdue tasks) |
| Filter while offline | Use cached data, sync when online |
| Smart list with deleted project/label | Show warning, filter still works with remaining criteria |
| URL with invalid filter params | Ignore invalid params, show default view |
| Concurrent filter changes | Last-write-wins for persisted filters |
| Timezone affecting date filters | Use user's timezone for date calculations |

---

*This specification follows the principles of the Phase 2 Constitution. Implementation must align with documented requirements, technology stack, and UX standards.*
