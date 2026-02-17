# Feature: Calendar View

**Feature ID:** PF-02  
**Status:** `draft`  
**Constitution Principles:**
- Principle 1: Spec-Driven Development
- Principle 3: JWT Authentication & User Isolation
- Principle 4: Neon Serverless PostgreSQL Data Layer
- Principle 5: Premium SaaS UX Standards

---

## Overview

Calendar View provides a visual time-based representation of tasks with due dates, enabling users to understand their workload distribution across days, weeks, and months. The feature includes three view modes (Monthly, Weekly, Daily) with interactive capabilities to view, edit, and create tasks directly from the calendar interface.

This specification ensures a premium calendar experience comparable to Google Calendar, Todoist Calendar View, and TickTick Calendar, with smooth animations, intuitive interactions, and seamless integration with the task management system.

---

## User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-CV-01 | As a user, I can view my tasks in a monthly calendar so that I can see my workload distribution at a glance | Must Have |
| US-CV-02 | As a user, I can switch to weekly view to see time-blocked tasks so that I can plan my week in detail | Should Have |
| US-CV-03 | As a user, I can view daily schedule with hourly time blocks so that I can plan my day precisely | Should Have |
| US-CV-04 | As a user, I can click on a task to view or edit its details so that I can manage tasks without leaving calendar | Should Have |
| US-CV-05 | As a user, I can see tasks color-coded by priority or project so that I can quickly identify task types | Must Have |
| US-CV-06 | As a user, I can quickly add a task from a specific calendar date so that I can schedule new items efficiently | Must Have |
| US-CV-07 | As a user, I can navigate between months/weeks/days so that I can view past and future schedules | Must Have |
| US-CV-08 | As a user, I can filter calendar tasks by project or label so that I can focus on specific work | Should Have |
| US-CV-09 | As a user, I can see overdue tasks highlighted so that I can identify items needing attention | Must Have |
| US-CV-10 | As a user, I can drag tasks to reschedule due dates so that I can quickly adjust my schedule | Could Have |

---

## Acceptance Criteria

### Monthly View (US-CV-01)

- [ ] Calendar displays current month by default on first load
- [ ] Grid shows 7 columns (Sunday-Saturday or Monday-Sunday based on locale)
- [ ] Grid shows 5-6 rows to accommodate all days in month
- [ ] Previous/next month days shown in muted/grayed style
- [ ] Today's date highlighted with distinct visual indicator
- [ ] Days with tasks show task count badge or dot indicators
- [ ] Task indicators use color coding (priority or project)
- [ ] Hovering over a day shows task preview tooltip
- [ ] Clicking a day opens day detail panel or filters task list
- [ ] Days with overdue tasks show warning indicator (red dot)
- [ ] Month header shows current month/year with navigation arrows
- [ ] "Today" button returns to current month view

### Weekly View (US-CV-02)

- [ ] Week view shows 7 days (Sunday-Saturday or based on locale setting)
- [ ] Time axis shows hours (default: 6 AM - 10 PM, configurable)
- [ ] Tasks with due dates displayed on their respective day column
- [ ] Tasks without specific time shown at top of day column
- [ ] Tasks with time shown at appropriate hour position
- [ ] Current time indicator (horizontal line) shows in current day column
- [ ] Week navigation: previous/next week buttons
- [ ] "This Week" button returns to current week
- [ ] Week number displayed in header (ISO week numbers)
- [ ] All-day tasks shown in dedicated section at top

### Daily View (US-CV-03)

- [ ] Day view shows 24-hour timeline (configurable start/end)
- [ ] Time slots displayed in 30-minute or 1-hour increments
- [ ] Tasks displayed as blocks at their scheduled time
- [ ] Task blocks show title and duration (if estimated)
- [ ] Current time indicator (horizontal line) moves in real-time
- [ ] Day navigation: previous/next day buttons
- [ ] "Today" button returns to current day
- [ ] Date header shows full date with day of week
- [ ] Day view includes task list sidebar for unscheduled tasks
- [ ] Click on time slot initiates quick-add task for that time

### Task Click Interaction (US-CV-04)

- [ ] Click on task opens task detail modal or side panel
- [ ] Modal displays all task properties (title, description, priority, etc.)
- [ ] Task can be edited directly from modal
- [ ] Changes save and reflect in calendar immediately
- [ ] Modal can be closed with X button or Escape key
- [ ] Delete action available with confirmation
- [ ] Quick complete toggle available in modal
- [ ] Modal shows navigation to previous/next task (if multiple on day)

### Color Coding (US-CV-05)

- [ ] Tasks color-coded by priority (default) or by project (user preference)
- [ ] Priority colors: Urgent=Red (#EF4444), High=Orange (#F97316), Medium=Blue (#3B82F6), Low=Gray (#6B7280)
- [ ] Project colors use project's assigned color
- [ ] Color legend/toggle available to switch between coding modes
- [ ] Completed tasks shown with muted/strikethrough styling
- [ ] Overdue tasks shown with red border or background tint
- [ ] Color contrast meets WCAG 2.1 AA standards

### Quick Add from Calendar (US-CV-06)

- [ ] Click on empty day/date opens quick-add task modal
- [ ] Due date pre-filled with selected date
- [ ] If time slot clicked, due time pre-filled
- [ ] Quick-add form includes: title (required), description, priority, project, labels
- [ ] Modal positioned near click location
- [ ] Keyboard shortcut: Enter to save, Escape to cancel
- [ ] New task appears in calendar immediately after creation
- [ ] Option to add more tasks without closing modal

### Calendar Navigation (US-CV-07)

- [ ] Previous/Next arrows navigate by current view unit (month/week/day)
- [ ] Keyboard shortcuts: Left/Right arrows navigate, Up/Down change view
- [ ] Date picker in header allows jumping to specific date
- [ ] Mini-calendar in sidebar for quick date selection
- [ ] Breadcrumb shows current view range (e.g., "Feb 2026", "Week 8", "Tuesday, 17 Feb 2026")
- [ ] Navigation updates URL query params for shareable links
- [ ] Browser back/forward navigates calendar history

### Calendar Filtering (US-CV-08)

- [ ] Filter dropdown to select project(s)
- [ ] Filter by label(s) with multi-select
- [ ] Filter by priority level
- [ ] Toggle to show/hide completed tasks
- [ ] Active filters displayed as removable chips
- [ ] "Clear all filters" button when filters active
- [ ] Filter state persists across sessions
- [ ] Calendar updates in real-time when filters change

### Overdue Task Indicators (US-CV-09)

- [ ] Overdue tasks (past due date, not completed) shown with red indicator
- [ ] Overdue tasks displayed on their original due date with warning badge
- [ ] Option to show overdue tasks on current day (floating)
- [ ] Overdue count shown in month view day cell
- [ ] Overdue tasks listed in day detail panel with priority
- [ ] Tooltip on overdue indicator shows "X days overdue"

### Drag to Reschedule (US-CV-10)

- [ ] Tasks can be dragged from one day to another
- [ ] Drag preview follows cursor with task info
- [ ] Drop target day highlights on hover
- [ ] Dropping task updates its due date
- [ ] Confirmation toast with "Undo" option after reschedule
- [ ] Failed updates revert to original date with error message
- [ ] Touch devices: long-press to initiate drag
- [ ] Keyboard alternative: select task, use arrow keys to change date

---

## Technical Requirements

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks` | Yes | Get tasks with date range query params |
| GET | `/api/calendar/tasks` | Yes | Get calendar-specific task data |
| PATCH | `/api/tasks/:id` | Yes | Update task (for drag-to-reschedule) |
| GET | `/api/calendar/summary` | Yes | Get task counts per day for month view |

### Query Parameters for Calendar Tasks

| Parameter | Type | Values | Description |
|-----------|------|--------|-------------|
| `date_from` | date | ISO 8601 | Start of date range (required) |
| `date_to` | date | ISO 8601 | End of date range (required) |
| `project_id` | UUID[] | - | Filter by project(s) |
| `labels` | UUID[] | - | Filter by label(s) |
| `priority` | string[] | `low`, `medium`, `high`, `urgent` | Filter by priority |
| `include_completed` | boolean | `true`, `false` | Include completed tasks |

### Database Models

#### Task Table (due_date field)

```sql
-- Due date field from task-management.md
due_date TIMESTAMPTZ

-- Indexes for calendar queries
CREATE INDEX idx_tasks_due_date_range ON tasks(user_id, due_date);
CREATE INDEX idx_tasks_user_due_completed ON tasks(user_id, due_date, completed);
```

### Date Range Calculations

```python
# Monthly view: get tasks for visible days
def get_month_tasks(user_id: UUID, year: int, month: int) -> list:
    # Include previous/next month days shown in grid
    start_date = first_day_of_month(year, month).replace(day=1)
    # Adjust to start on correct weekday (Sunday or Monday)
    while start_date.weekday() != 6:  # Sunday
        start_date -= timedelta(days=1)
    
    end_date = last_day_of_month(year, month)
    # Adjust to end on Saturday
    while end_date.weekday() != 5:  # Saturday
        end_date += timedelta(days=1)
    
    return get_tasks_in_range(user_id, start_date, end_date)

# Weekly view
def get_week_tasks(user_id: UUID, year: int, week: int) -> list:
    start_date = date_from_iso_week(year, week)
    end_date = start_date + timedelta(days=6)
    return get_tasks_in_range(user_id, start_date, end_date)

# Daily view
def get_day_tasks(user_id: UUID, year: int, month: int, day: int) -> list:
    date = datetime(year, month, day)
    return get_tasks_in_range(user_id, date, date + timedelta(days=1))
```

### Validation Rules

| Field | Type | Constraints | Error Message |
|-------|------|-------------|---------------|
| `date_from` | date | Required, ISO 8601 | "Start date is required" |
| `date_to` | date | Required, ISO 8601, >= date_from | "End date must be after start date" |
| `due_date` (task) | datetime | Optional, ISO 8601 | "Invalid date format" |

### Calendar Summary Endpoint Response

```json
{
  "month": "2026-02",
  "days": [
    {
      "date": "2026-02-17",
      "taskCount": 5,
      "completedCount": 2,
      "overdueCount": 1,
      "priorities": {
        "urgent": 1,
        "high": 2,
        "medium": 1,
        "low": 1
      },
      "projects": [
        { "id": "uuid", "name": "Work", "count": 3 },
        { "id": "uuid", "name": "Personal", "count": 2 }
      ]
    }
  ]
}
```

---

## UX Requirements

### Calendar Component Layout

```
┌────────────────────────────────────────────────────────────┐
│  [<]  Feb 2026  [>]    [Today]  [Month▼]  [Filter▼]   │
├────────────────────────────────────────────────────────────┤
│  Sun   Mon   Tue   Wed   Thu   Fri   Sat                   │
├───────┬───────┬───────┬───────┬───────┬───────┬───────┤
│       │   1   │   2   │   3   │   4   │   5   │   6   │
│       │  ●●   │  ●●●  │  ●    │  ●●   │  ●●●  │  ●    │
├───────┼───────┼───────┼───────┼───────┼───────┼───────┤
│   7   │   8   │   9   │  10   │  11   │  12   │  13   │
│  ●●   │  ●●●  │  ●    │  ●●   │  ●●●  │  ●    │  ●●   │
├───────┼───────┼───────┼───────┼───────┼───────┼───────┤
│  14   │  15   │  16   │ [17]  │  18   │  19   │  20   │
│  ●●●  │  ●    │  ●●   │  ●●●● │  ●●   │  ●    │  ●●   │
└───────┴───────┴───────┴───────┴───────┴───────┴───────┘
```

### Day Cell Design (Monthly View)

- **Date Number**: Large, prominent, centered
- **Today Indicator**: Circle background or border highlight
- **Task Dots**: Small colored dots below date number (max 4 visible, then "+N")
- **Overdue Indicator**: Red dot or exclamation icon
- **Hover State**: Subtle background highlight, task preview tooltip
- **Click State**: Brief highlight, then open day panel

### Task Dot Color Coding

| Priority | Color | Hex |
|----------|-------|-----|
| Urgent | Red | #EF4444 |
| High | Orange | #F97316 |
| Medium | Blue | #3B82F6 |
| Low | Gray | #6B7280 |

### Week View Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [<]  Week 8 (16-22 Feb 2026)  [>]    [This Week]  [View▼]    │
├──────┬─────────┬─────────┬─────────┬─────────┬─────────┬───────┤
│ Time │   Sun   │   Mon   │   Tue   │   Wed   │   Thu   │ ...   │
├──────┼─────────┼─────────┼─────────┼─────────┼─────────┼───────┤
│ 6 AM │         │         │         │         │         │       │
├──────┼─────────┼─────────┼─────────┼─────────┼─────────┼───────┤
│ 7 AM │         │  Task A │         │         │         │       │
├──────┼─────────┼─────────┼─────────┼─────────┼─────────┼───────┤
│ 8 AM │         │  ████   │  Task C │         │  Task E │       │
├──────┼─────────┼─────────┼─────────┼─────────┼─────────┼───────┤
│ ...  │         │         │         │         │         │       │
└──────┴─────────┴─────────┴─────────┴─────────┴─────────┴───────┘
```

### Day View Layout

```
┌────────────────────────────────────────────────────────────┐
│  [<]  Tuesday, 17 Feb 2026  [>]    [Today]  [View▼]  │
├──────────────┬─────────────────────────────────────────────┤
│    Time      │            Tasks                            │
├──────────────┼─────────────────────────────────────────────┤
│    6 AM      │                                             │
├──────────────┼─────────────────────────────────────────────┤
│    7 AM      │  ┌─────────────────────────────────┐        │
├──────────────┤  │  Team Standup                   │        │
│    8 AM      │  │  8:00 AM - 9:00 AM  [Work]     │        │
├──────────────┤  └─────────────────────────────────┘        │
│    9 AM      │  ┌─────────────────────────────────┐        │
├──────────────┤  │  Complete project proposal      │        │
│   10 AM      │  │  9:30 AM - 11:00 AM  [Urgent]  │        │
├──────────────┤  └─────────────────────────────────┘        │
│    ...       │                                             │
└──────────────┴─────────────────────────────────────────────┘
```

### View Switcher

- **Options**: Month, Week, Day
- **Current View**: Highlighted/selected state
- **Keyboard Shortcut**: `M` = Month, `W` = Week, `D` = Day
- **Smooth Transition**: Fade animation between views

### Task Detail Modal (from Calendar)

- **Header**: Task title (editable), close button, quick actions
- **Body**: All task properties (description, priority, due date, project, labels, subtasks)
- **Footer**: Save, Delete, Complete buttons
- **Navigation**: Previous/Next task arrows (if multiple tasks on day)
- **Size**: Responsive, max-width 600px
- **Animation**: Slide up from click location or fade in

### Quick Add Modal

- **Trigger**: Click on day cell or time slot
- **Position**: Near click location or centered
- **Pre-filled**: Due date (and time if applicable)
- **Fields**: Title (auto-focused), priority, project, labels
- **Actions**: Add (Enter), Cancel (Escape), Add Another (checkbox)
- **Size**: Compact, minimal friction

### Drag to Reschedule UX

- **Drag Handle**: Entire task card or specific drag icon
- **Preview**: Card follows cursor with elevation shadow
- **Drop Target**: Day cell highlights with color
- **Feedback**: Show new date in tooltip during drag
- **Confirmation**: Toast with "Task moved to [date]" + Undo button
- **Animation**: Smooth transition to new position

### Responsive Behavior

- **Desktop (>1024px)**: Full calendar with sidebar, all views available
- **Tablet (768-1024px)**: Calendar fills width, sidebar collapses, week view optimized
- **Mobile (<768px)**: Single view at a time, swipe to navigate, day view default

### Animations (Framer Motion)

```typescript
// Month transition
const monthTransition = {
  initial: (direction: number) => ({ x: direction * 100, opacity: 0 }),
  animate: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction * -100, opacity: 0 }),
  transition: { duration: 0.3, ease: "easeInOut" },
};

// Task card hover
const taskHover = {
  scale: 1.02,
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  transition: { duration: 0.15 },
};

// Modal open
const modalOpen = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { type: "spring", stiffness: 300, damping: 25 },
};
```

### Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `M` | Switch to Month view | Global in calendar |
| `W` | Switch to Week view | Global in calendar |
| `D` | Switch to Day view | Global in calendar |
| `Left` / `Right` | Navigate previous/next | Global in calendar |
| `Up` / `Down` | Navigate week/month | Global in calendar |
| `T` | Go to Today | Global in calendar |
| `N` | New task on selected date | Date focused |
| `Enter` | Open selected day/task | Date/task focused |
| `Escape` | Close modal / Cancel drag | Modal open / dragging |

### Accessibility

- All calendar cells have `role="gridcell"` with aria-label
- Keyboard navigation through calendar grid (arrow keys)
- Focus visible on all interactive elements
- Screen reader announcements for date navigation
- ARIA live regions for task count updates
- Color contrast meets WCAG 2.1 AA
- Reduced motion support via `prefers-reduced-motion`

---

## Dependencies

| Feature | Dependency Type | Description |
|---------|-----------------|-------------|
| `task-management.md` | Required | Task data and CRUD operations |
| `auth-jwt.md` | Required | JWT authentication for all operations |
| `projects-kanban.md` | Optional | Project filtering in calendar |

---

## Related Specifications

- `@specs/overview.md` - Project overview with API endpoint definitions
- `@specs/features/task-management.md` - Task management core features
- `@specs/features/projects-kanban.md` - Project and Kanban features
- `@specs/features/auth-jwt.md` - JWT authentication requirements
- `@specs/database/schema.md` - Database schema definitions

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Calendar View Adoption | >35% of users use calendar weekly | View analytics |
| Month Load Time | <1s | Time to render month grid |
| Task Click-Through Rate | >20% of calendar users click tasks | Interaction analytics |
| Quick Add Conversion | >15% of calendar clicks create tasks | Creation analytics |
| Drag-to-Reschedule Success | >95% | Successful drags / attempts |

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| User has 100+ tasks in a month | Virtual scrolling, aggregate view, "View all" link |
| Timezone changes affecting due dates | Store UTC, display in user's current timezone |
| Task with no due date in calendar view | Not shown (calendar only shows dated tasks) |
| All-day tasks vs timed tasks | All-day tasks shown at top, timed tasks in time slots |
| Overlapping tasks in week/day view | Stacked or side-by-side display with visual distinction |
| Dragging task while offline | Queue update, show offline indicator, sync on reconnect |
| Very long task titles in calendar | Truncate with ellipsis, full title on hover |
| Color blindness | Provide pattern/texture alternatives, not just color |
| Locale differences (week start day) | Respect user's locale setting for week start (Sunday/Monday) |
| February leap year | Correctly display 29 days when applicable |

---

*This specification follows the principles of the Phase 2 Constitution. Implementation must align with documented requirements, technology stack, and UX standards.*
