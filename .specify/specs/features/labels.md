# Feature: Labels & Tags

**Feature ID:** PF-05
**Status:** `draft`
**Constitution Principles:**
- Principle 1: Spec-Driven Development
- Principle 3: JWT Authentication & User Isolation
- Principle 4: Neon Serverless PostgreSQL Data Layer
- Principle 5: Premium SaaS UX Standards

---

## Overview

Labels provide a flexible tagging system for categorizing and filtering tasks across projects. Users can create custom labels with colors, assign multiple labels to tasks, filter by label combinations, and receive intelligent label suggestions based on usage patterns.

This specification covers the complete label lifecycle including creation, editing, deletion, color management, task assignment, filtering, and smart suggestions—delivering a premium experience comparable to Todoist Labels and TickTick Tags.

---

## User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-LB-01 | As a user, I can create custom labels with colors so that I can categorize tasks my way | Must Have |
| US-LB-02 | As a user, I can edit label names and colors so that I can keep my organization current | Must Have |
| US-LB-03 | As a user, I can delete labels so that I can remove unused categories | Must Have |
| US-LB-04 | As a user, I can assign multiple labels to a task so that I can add rich context | Must Have |
| US-LB-05 | As a user, I can filter tasks by label so that I can find related items | Must Have |
| US-LB-06 | As a user, I can combine multiple label filters so that I can create precise views | Should Have |
| US-LB-07 | As a user, I receive label suggestions based on usage so that I can tag consistently | Should Have |
| US-LB-08 | As a user, I can see label usage counts so that I understand which labels are active | Should Have |
| US-LB-09 | As a user, I can quickly select labels from a dropdown so that I can tag efficiently | Must Have |
| US-LB-10 | As a user, I can remove labels from tasks easily so that I can correct mistakes | Must Have |

---

## Acceptance Criteria

### Label Creation (US-LB-01)

- [ ] Create label via "+" button in labels sidebar or settings
- [ ] Label name is required (1-50 characters)
- [ ] Color picker provides 12 preset colors plus custom hex input
- [ ] Default color is blue (#3B82F6) if not specified
- [ ] Name validation: alphanumeric, spaces, hyphens, underscores allowed
- [ ] Duplicate name warning: "A label with this name already exists"
- [ ] New label appears immediately in label list (optimistic update)
- [ ] Label list sorted alphabetically by default
- [ ] Maximum 100 labels per user (soft limit with warning at 50)

### Label Editing (US-LB-02)

- [ ] Edit via context menu, inline edit, or label settings
- [ ] Name change validates: 1-50 characters, no special chars except -_
- [ ] Color change updates immediately in UI
- [ ] Changes save on blur or explicit save button
- [ ] Updated label reflects on all tagged tasks immediately
- [ ] Failed update reverts with error notification
- [ ] Editable by double-click or edit icon

### Label Deletion (US-LB-03)

- [ ] Delete via context menu or label settings
- [ ] Delete requires confirmation modal
- [ ] Confirmation shows label name and task count: "Delete 'Work' label? This will remove it from 12 tasks."
- [ ] Deleted label removed from UI immediately
- [ ] Label associations removed from all tasks (not cascade delete tasks)
- [ ] Undo option available for 5 seconds after deletion
- [ ] Cannot delete label while filtered to it (redirect to all tasks)

### Multiple Label Assignment (US-LB-04)

- [ ] Assign labels via label picker in task detail view
- [ ] Label picker shows all user labels with color indicators
- [ ] Search/filter labels in picker for quick selection
- [ ] Multiple labels can be selected (checkbox or toggle)
- [ ] Selected labels appear as colored badges on task
- [ ] Remove label by clicking X on badge
- [ ] Keyboard navigation in label picker (arrow keys, Enter, Space)
- [ ] Recently used labels shown at top of picker

### Label Filtering (US-LB-05)

- [ ] Click label in sidebar to filter task list
- [ ] Label filter works in combination with other filters
- [ ] Active label filter shown as chip/badge with clear option
- [ ] Filter shows tasks with ANY of selected labels (OR logic by default)
- [ ] Option to switch to AND logic (tasks with ALL selected labels)
- [ ] Label filter persists across sessions
- [ ] URL updates with label filter for shareable links

### Combined Label Filters (US-LB-06)

- [ ] Select multiple labels via multi-select in filter panel
- [ ] Toggle between OR (any label) and AND (all labels) logic
- [ ] OR logic: shows tasks with at least one selected label
- [ ] AND logic: shows tasks with all selected labels
- [ ] Active filters displayed as removable chips
- [ ] Clear all filters button available
- [ ] Filter combination count shown: "5 labels, 23 tasks"

### Label Suggestions (US-LB-07)

- [ ] Suggestions appear in label picker based on usage frequency
- [ ] "Recently used" section shows last 5 used labels
- [ ] "Frequently used" section shows top 5 most-used labels
- [ ] Contextual suggestions based on task title keywords (stretch goal)
- [ ] Suggestions section collapsible
- [ ] Click suggestion applies label immediately

### Label Usage Counts (US-LB-08)

- [ ] Label list shows task count badge next to each label
- [ ] Count updates in real-time as labels are assigned/removed
- [ ] Zero-count labels shown in muted style
- [ ] Count reflects current filter state
- [ ] Hover shows tooltip: "X tasks with this label"

### Quick Label Selection (US-LB-09)

- [ ] Label picker accessible via keyboard shortcut (L when task focused)
- [ ] Picker appears as dropdown or popover near trigger
- [ ] Type-ahead search filters labels as user types
- [ ] Arrow keys navigate, Enter selects, Escape closes
- [ ] Recently used labels shown at top for quick access
- [ ] Color indicators visible for each label
- [ ] Multi-select mode indicated visually

### Label Removal from Tasks (US-LB-10)

- [ ] Remove label by clicking X badge on task card
- [ ] Remove via label picker (uncheck)
- [ ] Bulk remove: select multiple tasks, remove label from all
- [ ] Confirmation for bulk removal if 5+ tasks affected
- [ ] Removal reflects immediately in UI
- [ ] Undo option for 5 seconds after removal

---

## Technical Requirements

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/labels` | Yes | List all user labels |
| POST | `/api/labels` | Yes | Create new label |
| PUT | `/api/labels/:id` | Yes | Update label |
| DELETE | `/api/labels/:id` | Yes | Delete label |
| GET | `/api/labels/:id/tasks` | Yes | Get tasks with label |
| POST | `/api/tasks/:id/labels` | Yes | Add label to task |
| DELETE | `/api/tasks/:id/labels/:labelId` | Yes | Remove label from task |
| PATCH | `/api/tasks/:id/labels` | Yes | Update all labels on task |

### Request/Response Schemas

#### POST /api/labels

**Request Body:**
```json
{
  "name": "Work",
  "color": "#3B82F6"
}
```

**Success Response (201):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Work",
  "color": "#3B82F6",
  "task_count": 0,
  "created_at": "2026-02-17T10:30:00Z"
}
```

#### POST /api/tasks/:id/labels

**Request Body:**
```json
{
  "label_id": "uuid"
}
```

**Success Response (201):**
```json
{
  "task_id": "uuid",
  "label_id": "uuid",
  "created_at": "2026-02-17T10:30:00Z"
}
```

#### GET /api/labels Response

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Work",
    "color": "#3B82F6",
    "task_count": 12,
    "created_at": "2026-02-17T10:30:00Z"
  },
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Personal",
    "color": "#22C55E",
    "task_count": 8,
    "created_at": "2026-02-17T10:30:00Z"
  }
]
```

### Database Models

#### Label Table Schema

```sql
CREATE TABLE labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) NOT NULL CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, name)
);

-- Indexes
CREATE INDEX idx_labels_user_id ON labels(user_id);
CREATE INDEX idx_labels_user_name ON labels(user_id, name);
```

#### Task Labels Junction Table

```sql
CREATE TABLE task_labels (
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    label_id UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (task_id, label_id)
);

-- Indexes
CREATE INDEX idx_task_labels_task_id ON task_labels(task_id);
CREATE INDEX idx_task_labels_label_id ON task_labels(label_id);
```

### Validation Rules

| Field | Type | Constraints | Error Message |
|-------|------|-------------|---------------|
| `label.name` | string | Required, 1-50 chars, alphanumeric + -_ | "Label name is required (1-50 characters)" |
| `label.color` | string | Hex color format #RRGGBB | "Invalid color format. Use #RRGGBB" |
| `label.name` | string | Unique per user | "A label with this name already exists" |
| `task_label.task_id` | UUID | Required, must exist | "Task not found" |
| `task_label.label_id` | UUID | Required, must exist | "Label not found" |
| `task_label` | composite | Unique (task_id, label_id) | "Label already assigned to task" |

### Label Suggestion Algorithm

```python
def get_label_suggestions(user_id: UUID, limit: int = 10) -> list:
    """Get label suggestions based on usage patterns."""
    # Recently used (last 7 days)
    recent = db.query("""
        SELECT l.*, COUNT(*) as recent_count
        FROM labels l
        JOIN task_labels tl ON l.id = tl.label_id
        JOIN tasks t ON tl.task_id = t.id
        WHERE l.user_id = :uid AND t.created_at > now() - INTERVAL '7 days'
        GROUP BY l.id
        ORDER BY recent_count DESC
        LIMIT :limit
    """, user_id=user_id, limit=limit)
    
    # Frequently used (all time)
    frequent = db.query("""
        SELECT l.*, COUNT(tl.task_id) as total_count
        FROM labels l
        LEFT JOIN task_labels tl ON l.id = tl.label_id
        WHERE l.user_id = :uid
        GROUP BY l.id
        ORDER BY total_count DESC
        LIMIT :limit
    """, user_id=user_id, limit=limit)
    
    return {
        "recently_used": recent,
        "frequently_used": frequent
    }
```

### Color Preset Palette

| Color Name | Hex | Usage Suggestion |
|------------|-----|------------------|
| Red | #EF4444 | Urgent, Critical |
| Orange | #F97316 | High Priority |
| Amber | #F59E0B | Warning, Review |
| Yellow | #EAB308 | Ideas, Someday |
| Lime | #84CC16 | Growth, Learning |
| Green | #22C55E | Personal, Health |
| Emerald | #10B981 | Success, Done |
| Teal | #14B8A6 | Creative, Design |
| Cyan | #06B6D4 | Tech, Development |
| Blue | #3B82F6 | Work, Default |
| Indigo | #6366F1 | Strategic, Planning |
| Purple | #A855F7 | Personal, Hobby |

---

## UX Requirements

### Label List Component

```
┌─────────────────────────────────────────┐
│  Labels                      [+] Add    │
├─────────────────────────────────────────┤
│  🔵 Work          ██████  12 tasks      │
│  🟢 Personal      ████    8 tasks       │
│  🟡 Ideas         ██      4 tasks       │
│  🔴 Urgent        █       2 tasks       │
│  ⚪ Archive       ░       0 tasks       │
└─────────────────────────────────────────┘
```

### Label Badge Design

```
Task Card Labels:
┌─────────────────────────────────────────┐
│  Task Title                             │
│                                         │
│  [🔵 Work] [🟡 Ideas] [🔴 Urgent]      │
└─────────────────────────────────────────┘

Badge Style:
┌──────────────┐
│ 🔵 Work   ✕  │  <- Color dot + name + remove X
└──────────────┘
```

- **Height**: 24px
- **Padding**: 4px 8px
- **Border Radius**: 12px (fully rounded)
- **Font Size**: 12px
- **Background**: 20% opacity of label color
- **Text Color**: 100% label color
- **Hover**: Full color background, white text

### Color Picker Component

```
┌─────────────────────────────────────────┐
│  Select Color                           │
├─────────────────────────────────────────┤
│  🔴 🟠 🟡 🟢 🔵 🟣                      │
│  #EF4444 #F97316 #EAB308 #22C55E ...   │
│                                         │
│  Custom: ┌──────────┐ #3B82F6          │
│          │  Preview │                  │
│          └──────────┘                  │
└─────────────────────────────────────────┘
```

- **Preset Grid**: 3x4 or 4x3 color options
- **Custom Input**: Hex input with validation
- **Preview**: Shows selected color
- **Validation**: Real-time hex format check

### Label Picker Dropdown

```
┌─────────────────────────────────────────┐
│  Search labels...                       │
├─────────────────────────────────────────┤
│  Recently Used                          │
│  ☑ 🔵 Work                             │
│  ☐ 🟢 Personal                         │
│  ☐ 🔴 Urgent                           │
├─────────────────────────────────────────┤
│  All Labels                             │
│  ☐ 🟡 Ideas                            │
│  ☐ 🟣 Creative                         │
│  ☐ ⚪ Archive                          │
├─────────────────────────────────────────┤
│  [+ Create new label "Meeting"]         │
└─────────────────────────────────────────┘
```

- **Search**: Type-ahead filtering
- **Sections**: Recently used, All labels
- **Checkboxes**: Multi-select indication
- **Create Option**: Quick-create from search

### Label Management Modal

```
┌─────────────────────────────────────────┐
│  Manage Labels                      [X] │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🔵 Work              12  [✎][🗑]│   │
│  ├─────────────────────────────────┤   │
│  │ 🟢 Personal           8  [✎][🗑]│   │
│  ├─────────────────────────────────┤   │
│  │ ...                             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [+ Add New Label]                      │
└─────────────────────────────────────────┘
```

### Empty States

- **No Labels**:
  ```
  ┌─────────────────────────────────────────┐
  │                                         │
  │     🏷️ No labels yet                   │
  │     Organize tasks with custom labels   │
  │                                         │
  │     [+ Create your first label]         │
  │                                         │
  └─────────────────────────────────────────┘
  ```

### Animations (Framer Motion)

```typescript
// Label badge enter
const badgeEnter = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
  transition: { type: "spring", stiffness: 400, damping: 25 },
};

// Color picker selection
const colorSelect = {
  scale: [1, 1.2, 1],
  transition: { duration: 0.2 },
};

// Label list reorder
const labelReorder = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2 },
};
```

### Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `L` | Open label picker | Task focused |
| `Enter` | Select focused label | Label picker open |
| `Escape` | Close label picker | Picker open |
| `Space` | Toggle label selection | Label picker open |
| `Arrow keys` | Navigate labels | Label picker open |
| `/` | Focus search in picker | Picker open |

### Accessibility

- All labels have accessible names including color
- Color is not the only means of identification (name + color)
- Screen reader announcements for label add/remove
- Keyboard navigation through all label interactions
- Focus visible on all interactive elements
- Color contrast meets WCAG 2.1 AA

### Responsive Behavior

- **Desktop**: Full label sidebar with counts
- **Tablet**: Collapsible label panel
- **Mobile**: Label picker as bottom sheet

---

## Dependencies

| Feature | Dependency Type | Description |
|---------|-----------------|-------------|
| `task-management.md` | Required | Task data and CRUD operations |
| `auth-jwt.md` | Required | JWT authentication |
| `filtering-sorting.md` | Consumer | Label filtering integration |

---

## Related Specifications

- `@specs/overview.md` - Project overview with API endpoint definitions
- `@specs/features/task-management.md` - Task management core features
- `@specs/features/filtering-sorting.md` - Filtering and sorting features
- `@specs/features/auth-jwt.md` - JWT authentication requirements
- `@specs/database/schema.md` - Database schema definitions

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Label Creation Rate | >60% of users create 3+ labels | Analytics tracking |
| Label Assignment Rate | >50% of tasks have labels | Task analytics |
| Label Filter Usage | >30% of users filter by label weekly | Filter analytics |
| Label Picker Load Time | <100ms | Time to render picker |
| Suggestion Click Rate | >20% of suggestions clicked | Interaction analytics |

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Creating label with existing name | Show error: "A label with this name already exists" |
| Deleting label with many tasks | Show count in confirmation, provide undo |
| Assigning label while offline | Queue for sync, optimistic UI, sync on reconnect |
| Very long label names | Truncate display with ellipsis, full name on hover |
| Color blindness | Provide pattern alternatives, not just color |
| 100+ labels | Search/filter, virtual scrolling |
| Concurrent label updates | Last-write-wins, show conflict notification |
| Invalid hex color | Real-time validation, prevent save |
| Special characters in name | Sanitize input, allow only safe characters |

---

*This specification follows the principles of the Phase 2 Constitution. Implementation must align with documented requirements, technology stack, and UX standards.*
