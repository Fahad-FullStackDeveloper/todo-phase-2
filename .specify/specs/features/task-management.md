# Feature: Task Management

**Feature ID:** BF-04, BF-05, BF-06, BF-07, BF-08, PF-04, PF-06, PF-07, PF-08, PF-09  
**Status:** `draft`  
**Constitution Principles:** 
- Principle 1: Spec-Driven Development
- Principle 3: JWT Authentication & User Isolation
- Principle 4: Neon Serverless PostgreSQL Data Layer
- Principle 5: Premium SaaS UX Standards

---

## Overview

Task Management is the core functionality of TodoFlow, enabling users to create, view, update, delete, and organize tasks with rich metadata. This specification covers the complete task lifecycle including subtasks, priorities, due dates, filtering, and sorting capabilities.

The implementation must deliver a premium, responsive experience with optimistic UI updates, smooth animations, and comprehensive validation that rivals industry leaders like Todoist and TickTick.

---

## User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-TM-01 | As a user, I can create tasks with rich details (title, description, priority, due date, project, labels) so that I can capture all my work items with proper context | Must Have |
| US-TM-02 | As a user, I can view all my tasks with filtering and sorting options so that I can find and focus on what matters most | Must Have |
| US-TM-03 | As a user, I can update task properties including status, priority, and metadata so that I can keep my tasks current | Must Have |
| US-TM-04 | As a user, I can delete tasks with confirmation so that I can remove completed or irrelevant items | Must Have |
| US-TM-05 | As a user, I can toggle task completion status so that I can track my progress | Must Have |
| US-TM-06 | As a user, I can add and manage subtasks so that I can break complex tasks into manageable steps | Must Have |
| US-TM-07 | As a user, I can filter tasks by status, priority, project, labels, and date range so that I can create focused views | Must Have |
| US-TM-08 | As a user, I can sort tasks by created date, due date, priority, title, and completion status so that I can organize my view logically | Must Have |
| US-TM-09 | As a user, I can view task details in a rich markdown editor so that I can add formatted notes and documentation | Should Have |
| US-TM-10 | As a user, I can see visual indicators for overdue tasks so that I can prioritize time-sensitive work | Must Have |

---

## Acceptance Criteria

### Task Creation (US-TM-01)

- [ ] Task title is required and must be 1-200 characters
- [ ] Task description is optional and supports markdown up to 10,000 characters
- [ ] Priority defaults to "medium" if not specified
- [ ] Due date is optional and accepts date+time with timezone awareness
- [ ] Project assignment is optional (task can exist without a project)
- [ ] Labels can be assigned during creation (multiple labels allowed)
- [ ] New tasks default to status "todo" and completed: false
- [ ] Created task is immediately visible in the task list (optimistic update)
- [ ] Form validation shows inline errors for invalid inputs
- [ ] Empty title shows error: "Task title is required"
- [ ] Title exceeding 200 characters shows character count warning

### Task Viewing (US-TM-02)

- [ ] All tasks for authenticated user are displayed in list view
- [ ] Each task card shows: title, priority indicator, due date (if set), project badge, labels
- [ ] Completed tasks are visually distinguished (strikethrough title, muted colors)
- [ ] Overdue tasks show red/orange visual indicator
- [ ] Tasks due today show "Today" label with appropriate color
- [ ] Tasks due tomorrow show "Tomorrow" label
- [ ] Empty state displays helpful message with quick-add CTA when no tasks exist
- [ ] Loading state shows skeleton loaders matching task card layout
- [ ] Task count is displayed in view header

### Task Update (US-TM-03)

- [ ] All task fields are editable via inline edit or detail modal
- [ ] Changes are saved automatically on blur or via explicit save button
- [ ] Optimistic UI updates reflect changes immediately
- [ ] Failed updates show error toast and revert to previous state
- [ ] Updated timestamp is refreshed on each modification
- [ ] Concurrent edit conflicts are handled with last-write-wins strategy
- [ ] Validation rules from creation apply to updates

### Task Deletion (US-TM-04)

- [ ] Delete action requires confirmation via modal dialog
- [ ] Confirmation modal shows task title being deleted
- [ ] Deletion is permanent (soft delete not required for Phase 2)
- [ ] Deleted task is immediately removed from UI (optimistic update)
- [ ] Failed deletions show error and restore task in UI
- [ ] Deleting a task also deletes all associated subtasks
- [ ] Deleting a task removes all label associations

### Task Completion Toggle (US-TM-05)

- [ ] Single click/tap toggles completion status
- [ ] Completed tasks show strikethrough title and checkmark icon
- [ ] Completion triggers subtle animation (checkmark fill, color transition)
- [ ] `completed_at` timestamp is set when marking complete, cleared when unmarking
- [ ] Completion celebrations (confetti) trigger on task completion (see PF-18)
- [ ] Keyboard shortcut (Space or Enter) toggles completion when task is focused

### Subtask Management (US-TM-06)

- [ ] Users can add unlimited subtasks to any task
- [ ] Subtask title is required (1-200 characters)
- [ ] Each subtask has independent completion toggle
- [ ] Parent task shows progress indicator (e.g., "3/5 subtasks" or progress bar)
- [ ] Subtasks can be reordered via drag-and-drop
- [ ] Subtasks can be deleted independently
- [ ] Optional setting: auto-complete parent when all subtasks complete (default: off)
- [ ] Subtask completion triggers micro-animation
- [ ] Empty subtask list shows "No subtasks" message with add prompt

### Task Filtering (US-TM-07)

- [ ] Filter by status: all, todo, in_progress, done
- [ ] Filter by priority: all, low, medium, high, urgent
- [ ] Filter by project: all projects or specific project
- [ ] Filter by label: multiple labels can be selected (AND logic)
- [ ] Filter by date range: today, tomorrow, next 7 days, next 30 days, custom range, overdue
- [ ] Multiple filters can be combined (AND logic across filter types)
- [ ] Active filters are displayed as removable chips/badges
- [ ] Filter state persists across page refreshes (localStorage)
- [ ] Clear all filters button is available when filters are active
- [ ] Filter results update in real-time without page reload

### Task Sorting (US-TM-08)

- [ ] Sort by created date (newest first, oldest first)
- [ ] Sort by due date (earliest first, latest first, no date last)
- [ ] Sort by priority (highest first, lowest first)
- [ ] Sort by title (alphabetical A-Z, Z-A)
- [ ] Sort by completion status (incomplete first, complete first)
- [ ] Default sort: due date ascending, then priority descending
- [ ] Sort preference persists across sessions
- [ ] Manual sort order option for custom arrangement (drag-and-drop reordering)

### Rich Task Descriptions (US-TM-09)

- [ ] Markdown editor with live preview or toggle view
- [ ] Supported markdown: headers, bold, italic, lists, links, code blocks, blockquotes
- [ ] Toolbar provides quick-insert for common markdown syntax
- [ ] Code blocks support syntax highlighting
- [ ] Links open in new tab (external safety)
- [ ] Images in markdown render inline with lazy loading
- [ ] Empty description shows "Add description" placeholder

### Overdue Task Indicators (US-TM-10)

- [ ] Tasks past due date show red/orange "Overdue" badge
- [ ] Overdue tasks are highlighted in task list with subtle background tint
- [ ] Overdue count displayed in filter/sidebar
- [ ] Overdue tasks automatically sort to top when sorting by due date
- [ ] Browser notification option for overdue tasks (with permission)

---

## Technical Requirements

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks` | Yes | List all user tasks with query params for filtering/sorting |
| POST | `/api/tasks` | Yes | Create new task |
| GET | `/api/tasks/:id` | Yes | Get single task with full details |
| PUT | `/api/tasks/:id` | Yes | Update task (full update) |
| PATCH | `/api/tasks/:id` | Yes | Update task (partial update) |
| PATCH | `/api/tasks/:id/complete` | Yes | Toggle task completion |
| DELETE | `/api/tasks/:id` | Yes | Delete task |
| POST | `/api/tasks/:id/subtasks` | Yes | Add subtask to task |
| PATCH | `/api/tasks/:id/subtasks/:subtaskId` | Yes | Toggle subtask completion |
| PUT | `/api/tasks/:id/subtasks/:subtaskId` | Yes | Update subtask |
| DELETE | `/api/tasks/:id/subtasks/:subtaskId` | Yes | Delete subtask |

### Query Parameters for GET /api/tasks

| Parameter | Type | Values | Description |
|-----------|------|--------|-------------|
| `status` | string | `todo`, `in_progress`, `done` | Filter by status |
| `priority` | string | `low`, `medium`, `high`, `urgent` | Filter by priority |
| `project_id` | UUID | - | Filter by project |
| `labels` | string[] | - | Filter by label IDs (comma-separated) |
| `due_date_from` | date | ISO 8601 | Filter tasks due from this date |
| `due_date_to` | date | ISO 8601 | Filter tasks due until this date |
| `overdue` | boolean | `true`, `false` | Filter overdue tasks only |
| `completed` | boolean | `true`, `false` | Filter by completion status |
| `sort_by` | string | `created_at`, `due_date`, `priority`, `title`, `completed_at` | Sort field |
| `sort_order` | string | `asc`, `desc` | Sort direction |
| `page` | integer | - | Page number for pagination |
| `limit` | integer | 1-100 | Items per page (default: 50) |

### Database Models

#### Task Table Schema

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date TIMESTAMPTZ,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX idx_tasks_user_due_date ON tasks(user_id, due_date);
```

#### Subtask Table Schema

```sql
CREATE TABLE subtasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);
CREATE INDEX idx_subtasks_task_position ON subtasks(task_id, position);
```

### Validation Rules

| Field | Type | Constraints | Error Message |
|-------|------|-------------|---------------|
| `title` | string | Required, 1-200 chars, trimmed | "Title is required (1-200 characters)" |
| `description` | string | Optional, max 10,000 chars | "Description exceeds maximum length" |
| `status` | enum | `todo`, `in_progress`, `done` | "Invalid status value" |
| `priority` | enum | `low`, `medium`, `high`, `urgent` | "Invalid priority value" |
| `due_date` | datetime | Optional, ISO 8601 format | "Invalid date format" |
| `project_id` | UUID | Optional, must exist | "Project not found" |
| `labels` | UUID[] | Optional, must exist | "One or more labels not found" |
| `subtask.title` | string | Required, 1-200 chars | "Subtask title is required" |

### Authentication & Authorization

- All endpoints require valid JWT token in `Authorization: Bearer <token>` header
- User isolation enforced at database query level: `WHERE user_id = :authenticated_user_id`
- Task ownership verified on read/update/delete: task must belong to authenticated user
- 401 Unauthorized returned for missing/invalid tokens
- 403 Forbidden returned when accessing another user's task
- 404 Not Found returned when task doesn't exist (to avoid information leakage)

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Task validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

---

## UX Requirements

### Form Validation Patterns

- **Inline Validation**: Real-time validation on blur for all form fields
- **Character Count**: Display character count for title (x/200) and description (x/10000)
- **Required Field Indicators**: Asterisk (*) or visual indicator for required fields
- **Error Display**: Red text below field with icon, clear and actionable messages
- **Success Feedback**: Green checkmark or subtle animation on successful save

### Loading States

- **List Loading**: Skeleton loaders matching task card dimensions and layout
- **Card Loading**: Individual task cards show loading shimmer during updates
- **Action Loading**: Buttons show spinner and disable during async operations
- **Optimistic Updates**: UI updates immediately, reverts on failure

### Error Handling

- **Network Errors**: Toast notification with retry option
- **Validation Errors**: Inline field errors, form-level error summary
- **Conflict Errors**: "This task was modified elsewhere. Refresh to see latest." with refresh option
- **Permission Errors**: "You don't have permission to access this task" with redirect
- **Not Found**: "Task not found" with option to return to list

### Empty States

- **No Tasks**: Illustration + "No tasks yet" + "Create your first task" CTA
- **No Filter Results**: "No tasks match your filters" + "Clear filters" button
- **No Subtasks**: "No subtasks" + inline add button
- **No Description**: "Add a description" placeholder in edit mode

### Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `N` | Create new task | Global |
| `Enter` | Toggle completion / Open task | Task focused |
| `Space` | Toggle completion | Task focused |
| `Delete` / `Backspace` | Delete task (with confirmation) | Task focused |
| `E` | Edit task | Task focused |
| `Escape` | Close modal / Cancel edit | Modal open |
| `Ctrl/Cmd + S` | Save task | Edit mode |
| `/` | Focus search | Global |

### Responsive Behavior

- **Mobile**: Single column task list, full-screen task detail modal
- **Tablet**: Two-column layout with list and detail side-by-side
- **Desktop**: Multi-column with sidebar filters, main list, and optional detail pane
- **Touch Targets**: Minimum 44x44px for all interactive elements

### Animations & Micro-interactions

- **Task Creation**: Slide-in animation from top
- **Task Completion**: Checkmark fill animation + subtle scale pulse
- **Task Deletion**: Fade out + collapse animation
- **Drag & Drop**: Smooth跟随 animation with elevation shadow
- **Filter Changes**: Fade transition between filtered states
- **Completion Celebration**: Confetti burst (configurable, see PF-18)

### Accessibility (WCAG 2.1 AA)

- All interactive elements have visible focus states
- Screen reader announcements for task creation, completion, deletion
- ARIA labels for icon-only buttons
- Keyboard navigation through all task actions
- Color contrast ratio minimum 4.5:1 for text
- Reduced motion support via `prefers-reduced-motion`

---

## Dependencies

| Feature | Dependency Type | Description |
|---------|-----------------|-------------|
| `auth-jwt.md` | Required | JWT authentication for all task operations |
| `projects-kanban.md` | Optional | Project assignment for tasks |
| `calendar-view.md` | Optional | Due date visualization in calendar |
| `analytics.md` | Consumer | Task data feeds analytics dashboard |

---

## Related Specifications

- `@specs/overview.md` - Project overview with API endpoint definitions
- `@specs/features/auth-jwt.md` - JWT authentication requirements
- `@specs/features/projects-kanban.md` - Project and Kanban board features
- `@specs/features/calendar-view.md` - Calendar view for due dates
- `@specs/features/analytics.md` - Analytics dashboard consuming task data
- `@specs/database/schema.md` - Database schema definitions

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Task Creation Success Rate | >99% | API success responses / total attempts |
| Page Load Time (tasks) | <1.5s | Time to first task rendered |
| Interaction Latency | <100ms | Click to visual feedback |
| Error Rate | <1% | Failed operations / total operations |
| User Retention (Daily) | >60% | Users returning within 24 hours |

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Creating task with network offline | Queue for sync, show offline indicator, optimistic UI |
| Updating task while another device modifies it | Last-write-wins, show conflict notification |
| Deleting project with assigned tasks | Tasks become unassigned (project_id = NULL) |
| Setting due date to past date | Allow with warning indicator |
| Creating task with very long title | Truncate display with ellipsis, full title in tooltip |
| Rapid completion toggling | Debounce API calls, queue state changes |
| Timezone changes affecting due date | Store UTC, display in user's timezone |
| Subtask count exceeds display space | Show "5+ subtasks" with expand option |

---

*This specification follows the principles of the Phase 2 Constitution. Implementation must align with documented requirements, technology stack, and UX standards.*
