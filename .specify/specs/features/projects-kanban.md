# Feature: Projects & Kanban Board

**Feature ID:** PF-01, PF-03  
**Status:** `draft`  
**Constitution Principles:**
- Principle 1: Spec-Driven Development
- Principle 3: JWT Authentication & User Isolation
- Principle 4: Neon Serverless PostgreSQL Data Layer
- Principle 5: Premium SaaS UX Standards

---

## Overview

This specification covers two interconnected features that enhance task organization and visual management:

**Projects** allow users to group related tasks into logical collections, providing structure and context for work items. Projects include color coding, descriptions, and statistics dashboards.

**Kanban Board** provides a visual drag-and-drop interface for managing tasks across status columns (Todo, In Progress, Done), enabling intuitive workflow management with smooth animations.

Both features work together to provide powerful organization and visualization capabilities that rival tools like Trello, ClickUp, and Todoist Projects.

---

## User Stories

### Projects

| ID | Story | Priority |
|----|-------|----------|
| US-PK-01 | As a user, I can create projects to organize related tasks so that I can group work by context or goal | Must Have |
| US-PK-02 | As a user, I can rename and delete projects so that I can keep my organization current | Must Have |
| US-PK-03 | As a user, I can assign colors to projects so that I can quickly identify them visually | Must Have |
| US-PK-04 | As a user, I can view project dashboards with task counts and statistics so that I can track progress | Must Have |
| US-PK-05 | As a user, I can assign tasks to projects so that I can categorize my work | Must Have |
| US-PK-06 | As a user, I can filter tasks by project so that I can focus on specific work areas | Must Have |
| US-PK-07 | As a user, I can view project completion rates so that I can measure progress toward goals | Should Have |

### Kanban Board

| ID | Story | Priority |
|----|-------|----------|
| US-PK-08 | As a user, I can view tasks in a Kanban board with Todo, In Progress, and Done columns so that I can visualize my workflow | Must Have |
| US-PK-09 | As a user, I can drag and drop tasks between columns so that I can update task status intuitively | Must Have |
| US-PK-10 | As a user, I can see task counts in each column so that I can understand my workload distribution | Must Have |
| US-PK-11 | As a user, I can view Kanban board filtered by project so that I can focus on specific project workflows | Should Have |
| US-PK-12 | As a user, I can see smooth animations when moving tasks so that the experience feels polished | Must Have |
| US-PK-13 | As a user, I can click on a task card to view/edit details so that I can manage tasks without leaving the board | Should Have |

---

## Acceptance Criteria

### Project Creation (US-PK-01)

- [ ] Create project via "+" button in project sidebar or dedicated "New Project" action
- [ ] Project name is required (1-100 characters)
- [ ] Project description is optional (max 1000 characters)
- [ ] Color picker provides 12 preset colors plus custom hex input
- [ ] Default color is blue (#3B82F6) if not specified
- [ ] New project appears immediately in project list (optimistic update)
- [ ] Empty state shows when no projects exist with creation prompt
- [ ] Project list is sorted alphabetically by default

### Project Rename & Delete (US-PK-02)

- [ ] Rename via context menu, inline edit, or project settings
- [ ] Delete requires confirmation modal showing project name and task count
- [ ] Delete confirmation warns about task impact: "X tasks will become unassigned"
- [ ] Deleted project is removed from UI immediately
- [ ] Tasks from deleted projects become unassigned (project_id = NULL)
- [ ] Cannot delete project while viewing its Kanban board (redirect to all tasks)

### Project Color Coding (US-PK-03)

- [ ] 12 preset colors available: Red, Orange, Amber, Yellow, Lime, Green, Emerald, Teal, Cyan, Blue, Indigo, Purple
- [ ] Custom hex color input accepts #RRGGBB format with validation
- [ ] Color preview shows before applying
- [ ] Color is displayed as badge/background in project list
- [ ] Color is used in task cards assigned to project
- [ ] Color is used in charts and visualizations

### Project Dashboard (US-PK-04)

- [ ] Dashboard accessible via project card click or "View Dashboard" action
- [ ] Shows total task count for project
- [ ] Shows completed task count
- [ ] Shows completion rate percentage with progress bar
- [ ] Shows tasks by priority distribution (pie chart or bar)
- [ ] Shows overdue task count with warning indicator
- [ ] Shows recent activity (tasks completed this week)
- [ ] Shows project creation date and last updated date

### Task Assignment to Projects (US-PK-05)

- [ ] Assign project during task creation via dropdown
- [ ] Assign project when editing existing task
- [ ] Bulk assign multiple tasks to project via selection + action
- [ ] Remove project assignment (set to no project)
- [ ] Project badge appears on task card when assigned
- [ ] Clicking project badge filters to show all tasks in that project

### Project Filtering (US-PK-06)

- [ ] Click project in sidebar to filter task list to that project
- [ ] Project filter works in combination with other filters
- [ ] Active project filter shown as chip/badge with clear option
- [ ] "All Projects" option shows tasks from all projects plus unassigned
- [ ] Project filter persists across sessions

### Project Statistics (US-PK-07)

- [ ] Completion rate calculated: (completed / total) * 100
- [ ] Completion rate displayed as percentage with visual progress bar
- [ ] Tasks by priority shown as horizontal bar chart or donut chart
- [ ] Weekly completion trend shown as sparkline or mini chart
- [ ] Statistics update in real-time as tasks change

### Kanban Board View (US-PK-08)

- [ ] Board displays 3 columns: Todo, In Progress, Done
- [ ] Each column shows status header with task count badge
- [ ] Tasks displayed as cards within columns
- [ ] Task cards show: title, priority indicator, due date, project badge, labels
- [ ] Columns are horizontally scrollable on smaller screens
- [ ] Column widths are equal and responsive
- [ ] Empty columns show "No tasks" placeholder with add task CTA
- [ ] Board view toggle accessible from main navigation

### Drag and Drop (US-PK-09)

- [ ] Tasks can be dragged from any column to any other column
- [ ] Drag preview follows cursor with slight elevation shadow
- [ ] Drop zone highlights when dragging over valid column
- [ ] Dropping task updates its status to match column
- [ ] Status update API call triggered on drop
- [ ] Optimistic UI update reflects new column immediately
- [ ] Failed updates revert task to original column with error toast
- [ ] Drag handle visible on hover (or entire card is draggable)
- [ ] Touch devices support long-press to initiate drag

### Column Task Counts (US-PK-10)

- [ ] Each column header displays count of tasks in that column
- [ ] Count updates in real-time as tasks are moved
- [ ] Count reflects current filter state (e.g., project filter)
- [ ] Count badge uses color coding (e.g., urgent tasks highlighted)

### Project-Filtered Kanban (US-PK-11)

- [ ] Project dropdown/filter at top of Kanban board
- [ ] Selecting project shows only tasks from that project
- [ ] "All Projects" option shows all tasks
- [ ] Project filter persists while in Kanban view
- [ ] Statistics per column update based on filter

### Kanban Animations (US-PK-12)

- [ ] Framer Motion used for all animations
- [ ] Task cards animate when entering/leaving columns
- [ ] Smooth transition animation during drag (follow cursor)
- [ ] Column reflow animation when tasks are added/removed
- [ ] Subtle scale effect on hover
- [ ] Drop animation eases task into new position
- [ ] Animations respect `prefers-reduced-motion` setting

### Task Card Interaction (US-PK-13)

- [ ] Click on task card opens task detail modal or side panel
- [ ] Modal/panel allows editing all task properties
- [ ] Changes save and reflect in board immediately
- [ ] Close modal returns to board view
- [ ] Keyboard navigation: Escape closes modal
- [ ] Quick complete checkbox visible on card without opening modal

---

## Technical Requirements

### API Endpoints

#### Projects

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects` | Yes | List all user projects |
| POST | `/api/projects` | Yes | Create new project |
| GET | `/api/projects/:id` | Yes | Get project with tasks |
| PUT | `/api/projects/:id` | Yes | Update project |
| DELETE | `/api/projects/:id` | Yes | Delete project |
| GET | `/api/projects/:id/stats` | Yes | Get project statistics |

#### Kanban

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks?status=todo,in_progress,done` | Yes | Get tasks for Kanban columns |
| PATCH | `/api/tasks/:id` | Yes | Update task status (on drop) |
| GET | `/api/kanban/summary` | Yes | Get column counts and summary |

### Database Models

#### Project Table Schema

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) NOT NULL DEFAULT '#3B82F6' CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_user_position ON projects(user_id, position);
```

#### Task Table (status field for Kanban)

```sql
-- Status enum values: 'todo', 'in_progress', 'done'
-- See task-management.md for full schema

ALTER TABLE tasks ADD CONSTRAINT chk_status 
    CHECK (status IN ('todo', 'in_progress', 'done'));
```

### Validation Rules

| Field | Type | Constraints | Error Message |
|-------|------|-------------|---------------|
| `project.name` | string | Required, 1-100 chars, trimmed | "Project name is required (1-100 characters)" |
| `project.description` | string | Optional, max 1000 chars | "Description exceeds maximum length" |
| `project.color` | string | Hex color format #RRGGBB | "Invalid color format" |
| `task.status` | enum | `todo`, `in_progress`, `done` | "Invalid status value" |

### Project Statistics Calculation

```python
# Example calculation logic
def get_project_stats(project_id: UUID, user_id: UUID) -> dict:
    total = count("SELECT id FROM tasks WHERE project_id = :pid AND user_id = :uid")
    completed = count("SELECT id FROM tasks WHERE project_id = :pid AND user_id = :uid AND completed = true")
    overdue = count("SELECT id FROM tasks WHERE project_id = :pid AND user_id = :uid AND due_date < now() AND completed = false")
    
    by_priority = {
        "urgent": count("... AND priority = 'urgent'"),
        "high": count("... AND priority = 'high'"),
        "medium": count("... AND priority = 'medium'"),
        "low": count("... AND priority = 'low'"),
    }
    
    return {
        "totalTasks": total,
        "completedTasks": completed,
        "completionRate": round((completed / total * 100) if total > 0 else 0, 1),
        "overdueTasks": overdue,
        "tasksByPriority": by_priority,
    }
```

### Drag and Drop Implementation

- Use `@dnd-kit/core` and `@dnd-kit/sortable` for React drag-and-drop
- Implement `DndContext` provider at board level
- Each column is a `Droppable` zone
- Each task card is a `Draggable` component
- On `onDragEnd`, extract task ID and target column (status)
- Call PATCH `/api/tasks/:id` with `{ status: new_status }`
- Optimistic update before API confirmation
- Revert on API failure

---

## UX Requirements

### Project List Component

- **Layout**: Vertical list in sidebar or dedicated projects page
- **Item Display**: Color indicator dot + name + task count badge
- **Hover State**: Subtle background highlight, action buttons appear
- **Actions**: Edit, Delete, View Dashboard (via context menu or hover)
- **Empty State**: Illustration + "No projects yet" + "Create Project" CTA
- **Loading**: Skeleton loaders matching project item dimensions

### Kanban Board Component

- **Layout**: Horizontal flex container with 3 equal-width columns
- **Column Header**: Status name + count badge + add task button
- **Column Body**: Scrollable task list (vertical scroll within column)
- **Task Card**: Compact view with essential info, expandable on hover
- **Drag Preview**: Elevated card with shadow, slightly scaled up
- **Drop Indicator**: Line or highlight showing drop position

### Task Card Design (Kanban)

```
┌─────────────────────────────────┐
│ [Priority] Task Title           │
│                                 │
│ [Due Date] [Project] [Labels]   │
│                                 │
│ ▤▤▤▤░░░░ 60% subtasks (if any)  │
└─────────────────────────────────┘
```

- **Priority Indicator**: Colored left border or icon (urgent=red, high=orange, medium=blue, low=gray)
- **Title**: Truncated with ellipsis if too long, full title on hover tooltip
- **Due Date**: Icon + date, red if overdue, green if today
- **Project**: Small badge with project color
- **Labels**: Small colored dots for assigned labels
- **Subtasks**: Progress bar if subtasks exist

### Color Palette (Projects)

| Color | Hex | Usage |
|-------|-----|-------|
| Red | #EF4444 | High priority projects |
| Orange | #F97316 | Active projects |
| Amber | #F59E0B | Warning projects |
| Yellow | #EAB308 | Standard projects |
| Lime | #84CC16 | Growth projects |
| Green | #22C55E | Completed projects |
| Emerald | #10B981 | Success projects |
| Teal | #14B8A6 | Creative projects |
| Cyan | #06B6D4 | Tech projects |
| Blue | #3B82F6 | Default projects |
| Indigo | #6366F1 | Strategic projects |
| Purple | #A855F7 | Personal projects |

### Animations (Framer Motion)

```typescript
// Card drag animation
const dragAnimation = {
  drag: { scale: 1.02, boxShadow: "0 10px 40px rgba(0,0,0,0.15)" },
  drop: { scale: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
};

// Column enter/exit
const columnAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Task card enter (when dropped)
const cardEnter = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: "spring", stiffness: 300, damping: 25 },
};
```

### Responsive Behavior

- **Desktop (>1024px)**: 3-column Kanban, full sidebar with projects
- **Tablet (768-1024px)**: 3-column Kanban (compressed), collapsible sidebar
- **Mobile (<768px)**: Single column view with status tabs, bottom nav for projects

### Accessibility

- Drag-and-drop has keyboard alternative (move via dropdown menu)
- All interactive elements have visible focus states
- Screen reader announcements for task moves
- ARIA labels for columns ("Todo column, 5 tasks")
- Color contrast meets WCAG 2.1 AA
- Reduced motion support

### Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `B` | Toggle Kanban/List view | Global |
| `1`, `2`, `3` | Move task to column 1/2/3 | Task focused in Kanban |
| `P` | Open project selector | Task focused |
| `Escape` | Cancel drag / Close modal | During drag or modal open |

---

## Dependencies

| Feature | Dependency Type | Description |
|---------|-----------------|-------------|
| `task-management.md` | Required | Task CRUD operations and schema |
| `auth-jwt.md` | Required | JWT authentication for all operations |
| `calendar-view.md` | Optional | Due date visualization integration |

---

## Related Specifications

- `@specs/overview.md` - Project overview with API endpoint definitions
- `@specs/features/task-management.md` - Task management core features
- `@specs/features/auth-jwt.md` - JWT authentication requirements
- `@specs/features/calendar-view.md` - Calendar view for due dates
- `@specs/database/schema.md` - Database schema definitions

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Project Creation Rate | >50% of users create 1+ project | Analytics tracking |
| Kanban Adoption | >40% of users use Kanban view weekly | View analytics |
| Drag-Drop Success Rate | >98% | Successful drops / total attempts |
| Board Load Time | <2s | Time to render all columns |
| Task Move Latency | <150ms | Drop to visual update |

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Moving task while offline | Queue status change, show offline indicator, sync on reconnect |
| Project deleted while viewing its Kanban | Redirect to "All Tasks" Kanban with notification |
| Task count exceeds column display | Virtual scrolling for columns with 50+ tasks |
| Color blindness | Provide pattern/texture alternatives to color coding |
| Very long project names | Truncate with ellipsis, full name on hover tooltip |
| Concurrent status updates | Last-write-wins, show conflict notification |
| Dragging task to same column | No-op, no API call triggered |
| Network failure on status update | Revert task to original column, show error toast with retry |

---

*This specification follows the principles of the Phase 2 Constitution. Implementation must align with documented requirements, technology stack, and UX standards.*
