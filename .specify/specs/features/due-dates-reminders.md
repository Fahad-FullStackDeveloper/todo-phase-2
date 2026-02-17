# Feature: Due Dates & Reminders

**Feature ID:** PF-07 (Detail)
**Status:** `draft`
**Constitution Principles:**
- Principle 1: Spec-Driven Development
- Principle 3: JWT Authentication & User Isolation
- Principle 4: Neon Serverless PostgreSQL Data Layer
- Principle 5: Premium SaaS UX Standards

---

## Overview

Due Dates & Reminders provide comprehensive date/time management for tasks, enabling users to schedule work with precision. This specification covers date picker functionality with natural language parsing, timezone awareness, overdue task highlighting, reminder configurations, browser notification permissions, and the foundation for recurring tasks.

The implementation must deliver an intuitive, flexible date management experience that rivals Todoist and TickTick, with smart parsing, clear visual feedback, and reliable notification delivery.

---

## User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-DD-01 | As a user, I can set due dates with date and time so that I can schedule tasks precisely | Must Have |
| US-DD-02 | As a user, I can use natural language parsing ("tomorrow at 3pm") so that I can add dates quickly | Must Have |
| US-DD-03 | As a user, my due dates respect my timezone so that reminders arrive at the right time | Must Have |
| US-DD-04 | As a user, I can see overdue tasks highlighted so that I know what needs attention | Must Have |
| US-DD-05 | As a user, I can set reminders before due dates so that I don't miss important deadlines | Should Have |
| US-DD-06 | As a user, I receive browser notifications for reminders so that I'm alerted even when not in the app | Should Have |
| US-DD-07 | As a user, I can choose reminder timing (15min, 1hr, 1day) so that I get notified when it matters | Should Have |
| US-DD-08 | As a user, I can clear or change due dates easily so that I can reschedule tasks | Must Have |
| US-DD-09 | As a user, I can see tasks due today/tomorrow in a quick view so that I can plan my day | Must Have |
| US-DD-10 | As a user, the system supports recurring task structure so that I can set up repeating tasks (foundation) | Could Have |

---

## Acceptance Criteria

### Due Date Setting (US-DD-01)

- [ ] Date picker accessible from task detail view
- [ ] Date picker shows calendar view with current month
- [ ] Time picker shows hour/minute selection (12h or 24h based on locale)
- [ ] "No due date" option clears existing due date
- [ ] Quick select options: Today, Tomorrow, Next Week, Next Month
- [ ] Selected date/time displays in readable format: "Feb 17, 2026 at 3:00 PM"
- [ ] Changes save on selection or explicit save button
- [ ] Due date reflects immediately in task list and calendar views

### Natural Language Parsing (US-DD-02)

- [ ] Date input field accepts natural language text
- [ ] Supported patterns:
  - "today", "tomorrow", "yesterday"
  - "next week", "next month", "next year"
  - "in 2 days", "in 3 weeks"
  - "monday", "next monday", "this friday"
  - "jan 15", "february 20", "mar 1"
  - "today at 3pm", "tomorrow at 9:00"
  - "next week at 2pm", "friday at 5"
  - "eod" (end of day = 5pm today)
  - "eo d" (end of day tomorrow)
- [ ] Parsed date displays as preview before confirming
- [ ] Unparseable input shows error: "Could not understand date. Please try a different format."
- [ ] Manual date picker available as fallback
- [ ] Parsing respects user's locale for date formats

### Timezone Awareness (US-DD-03)

- [ ] User timezone detected on signup/first visit
- [ ] Timezone stored in user profile
- [ ] All due dates stored in UTC in database
- [ ] Dates displayed in user's local timezone
- [ ] Timezone change updates display of all existing due dates
- [ ] Reminders trigger based on user's current timezone
- [ ] Travel across timezones: reminders adjust to new timezone
- [ ] Timezone shown in settings: "Your timezone: America/New_York (EST)"

### Overdue Task Highlighting (US-DD-04)

- [ ] Tasks past due date (and not completed) marked as overdue
- [ ] Overdue tasks show red/orange "Overdue" badge
- [ ] Overdue tasks highlighted with subtle red background tint in list
- [ ] Overdue count displayed in sidebar/filter
- [ ] "Overdue" quick filter shows all overdue tasks
- [ ] Overdue tasks sort to top when sorting by due date
- [ ] Days overdue shown on hover: "5 days overdue"
- [ ] Completed overdue tasks show "Completed X days late"

### Reminder Configuration (US-DD-05)

- [ ] Reminder options per task: None, 15 min before, 1 hour before, 1 day before, 1 week before, Custom
- [ ] Multiple reminders can be set per task
- [ ] Default reminder setting in user preferences
- [ ] Reminder time displays relative to due date: "Reminds 1 hour before - Feb 17, 2:00 PM"
- [ ] Reminders can be disabled per task
- [ ] Reminder changes save immediately
- [ ] Past reminders (setting reminder after due date passed) show warning

### Browser Notifications (US-DD-06)

- [ ] Notification permission requested on first reminder setup
- [ ] Permission request explains value: "Get notified about upcoming tasks"
- [ ] Permission can be granted/denied/dismissed
- [ ] Settings page shows notification status with option to change
- [ ] Notifications display: task title, due time, project/label indicators
- [ ] Clicking notification opens task detail view
- [ ] Notifications respect system Do Not Disturb mode
- [ ] Fallback: in-app notification banner if browser notifications denied

### Reminder Timing Options (US-DD-07)

- [ ] Preset options:
  - At time of due date
  - 15 minutes before
  - 30 minutes before
  - 1 hour before
  - 2 hours before
  - 1 day before
  - 2 days before
  - 1 week before
- [ ] Custom timing: X minutes/hours/days before
- [ ] Reminder time displayed clearly: "Reminds you at 2:00 PM on Feb 17"
- [ ] Multiple reminders supported: "Reminds 1 day before and 1 hour before"
- [ ] Reminder delivered even if app is closed (via service worker push)

### Due Date Clearing/Changing (US-DD-08)

- [ ] Clear due date via "Remove" button in date picker
- [ ] Change due date by selecting new date
- [ ] Drag to reschedule in calendar view (see calendar-view.md)
- [ ] Quick reschedule options: "Postpone 1 day", "Postpone 1 week"
- [ ] Undo option for 5 seconds after clearing/changing
- [ ] Confirmation if task is overdue: "This task is 5 days overdue. Reschedule anyway?"

### Quick Due Date Views (US-DD-09)

- [ ] "Today" view shows all tasks due today
- [ ] "Tomorrow" view shows all tasks due tomorrow
- [ ] "Upcoming" view shows next 7 days grouped by date
- [ ] "Overdue" view shows all overdue tasks
- [ ] "No date" view shows tasks without due dates
- [ ] Each view shows task count in header
- [ ] Quick views accessible from sidebar and keyboard shortcuts

### Recurring Task Foundation (US-DD-10)

- [ ] Database schema supports recurring fields (recurring, recurring_rule)
- [ ] UI shows "Repeat" option in due date picker (disabled with "Coming soon" tooltip)
- [ ] Recurring rule structure defined: frequency (daily, weekly, monthly, yearly)
- [ ] Recurring rule structure defined: interval (every N days/weeks/months)
- [ ] Recurring rule structure defined: end condition (never, after N occurrences, on date)
- [ ] API endpoints prepared for recurring task creation (stub implementation)
- [ ] Documentation notes recurring tasks as Phase 3 feature

---

## Technical Requirements

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks` | Yes | List tasks with date range query params |
| PUT | `/api/tasks/:id` | Yes | Update task including due_date |
| PATCH | `/api/tasks/:id/due-date` | Yes | Update only due date |
| POST | `/api/tasks/:id/reminders` | Yes | Add reminder to task |
| DELETE | `/api/tasks/:id/reminders/:reminderId` | Yes | Remove reminder |
| GET | `/api/tasks/due/today` | Yes | Get tasks due today |
| GET | `/api/tasks/due/upcoming` | Yes | Get upcoming tasks (next 7 days) |
| GET | `/api/tasks/overdue` | Yes | Get overdue tasks |
| POST | `/api/notifications/permission` | Yes | Request notification permission |

### Request/Response Schemas

#### PATCH /api/tasks/:id/due-date

**Request Body:**
```json
{
  "due_date": "2026-02-17T15:00:00Z",
  "timezone": "America/New_York"
}
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "due_date": "2026-02-17T15:00:00Z",
  "due_date_display": "Feb 17, 2026 at 3:00 PM EST",
  "is_overdue": false,
  "updated_at": "2026-02-17T10:30:00Z"
}
```

#### POST /api/tasks/:id/reminders

**Request Body:**
```json
{
  "reminder_minutes_before": 60,
  "reminder_type": "browser_notification"
}
```

**Success Response (201):**
```json
{
  "id": "uuid",
  "task_id": "uuid",
  "reminder_minutes_before": 60,
  "reminder_time": "2026-02-17T14:00:00Z",
  "reminder_type": "browser_notification",
  "created_at": "2026-02-17T10:30:00Z"
}
```

### Database Models

#### Task Table (due_date field)

```sql
-- From task-management.md
due_date TIMESTAMPTZ,
completed BOOLEAN NOT NULL DEFAULT false,
completed_at TIMESTAMPTZ

-- Recurring task foundation fields
recurring BOOLEAN NOT NULL DEFAULT false,
recurring_rule JSONB,
-- Example recurring_rule:
-- {
--   "frequency": "weekly",
--   "interval": 1,
--   "by_day": ["MO"],
--   "end_type": "never",
--   "end_count": null,
--   "end_date": null
-- }
```

#### Reminders Table

```sql
CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reminder_minutes_before INTEGER NOT NULL,
    reminder_time TIMESTAMPTZ NOT NULL,
    reminder_type VARCHAR(50) NOT NULL DEFAULT 'browser_notification',
    delivered BOOLEAN NOT NULL DEFAULT false,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_reminders_task_id ON reminders(task_id);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_reminder_time ON reminders(reminder_time);
CREATE INDEX idx_reminders_delivered ON reminders(delivered);
```

#### User Preferences Table (for timezone and defaults)

```sql
-- Add to users table or separate preferences table
timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
default_reminder_minutes INTEGER DEFAULT 60,
notifications_enabled BOOLEAN NOT NULL DEFAULT true
```

### Validation Rules

| Field | Type | Constraints | Error Message |
|-------|------|-------------|---------------|
| `due_date` | datetime | Optional, ISO 8601 format | "Invalid date format" |
| `reminder_minutes_before` | integer | > 0, max 525600 (1 year) | "Reminder must be between 1 minute and 1 year" |
| `timezone` | string | Valid IANA timezone | "Invalid timezone" |
| `recurring_rule` | JSONB | Valid recurring rule structure | "Invalid recurring rule format" |

### Natural Language Parser

```python
import dateparser
from datetime import datetime, timedelta

def parse_natural_date(text: str, timezone: str = 'UTC') -> dict:
    """Parse natural language date string."""
    text = text.lower().strip()
    
    # Special cases
    if text == 'eod' or text == 'end of day':
        return {
            'date': datetime.now(timezone).replace(hour=17, minute=0, second=0),
            'confidence': 0.95
        }
    
    # Use dateparser for general parsing
    parsed = dateparser.parse(
        text,
        settings={
            'PREFER_DATES_FROM': 'future',
            'RETURN_AS_TIMEZONE_AWARE': True
        }
    )
    
    if parsed:
        return {
            'date': parsed,
            'confidence': 0.8,  # Lower confidence for general parsing
            'original': text
        }
    
    return {
        'error': 'Could not understand date format',
        'confidence': 0
    }

def get_quick_date(option: str, timezone: str = 'UTC') -> datetime:
    """Get quick date options."""
    now = datetime.now(timezone)
    
    quick_dates = {
        'today': now.replace(hour=17, minute=0, second=0),
        'tomorrow': (now + timedelta(days=1)).replace(hour=17, minute=0),
        'next_week': (now + timedelta(weeks=1)).replace(hour=17, minute=0),
        'next_month': (now.replace(day=1) + timedelta(days=32)).replace(day=1, hour=17),
        'no_date': None
    }
    
    return quick_dates.get(option)
```

### Overdue Detection

```python
def get_overdue_tasks(user_id: UUID) -> list:
    """Get all overdue tasks for user."""
    return db.query("""
        SELECT t.*, 
               EXTRACT(EPOCH FROM (now() - t.due_date)) / 86400 as days_overdue
        FROM tasks t
        WHERE t.user_id = :uid
          AND t.due_date < now()
          AND t.completed = false
        ORDER BY t.due_date ASC
    """, user_id=user_id)

def is_overdue(task) -> bool:
    """Check if task is overdue."""
    return task.due_date < datetime.now() and not task.completed
```

### Reminder Scheduling

```python
from celery import Celery
from datetime import timedelta

@celery.task
def schedule_reminder(reminder_id: UUID):
    """Schedule a reminder to be sent."""
    reminder = db.get_reminder(reminder_id)
    if not reminder or reminder.delivered:
        return
    
    # Calculate delay
    now = datetime.now()
    delay = (reminder.reminder_time - now).total_seconds()
    
    if delay > 0:
        # Schedule for future
        send_reminder.apply_async(args=[reminder_id], countdown=delay)
    else:
        # Send immediately (reminder time passed)
        send_reminder.delay(reminder_id)

@celery.task
def send_reminder(reminder_id: UUID):
    """Send reminder notification."""
    reminder = db.get_reminder(reminder_id)
    task = db.get_task(reminder.task_id)
    user = db.get_user(reminder.user_id)
    
    if user.notifications_enabled:
        send_browser_notification(
            user_id=user.id,
            title=f"Reminder: {task.title}",
            body=f"Due {format_due_date(task.due_date)}",
            data={'task_id': task.id}
        )
    
    reminder.delivered = True
    reminder.delivered_at = datetime.now()
    db.save(reminder)
```

---

## UX Requirements

### Date Picker Component

```
┌─────────────────────────────────────────┐
│  Due Date                               │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │ Feb 2026                        │   │
│  │  Su  Mo  Tu  We  Th  Fr  Sa     │   │
│  │                      1   2      │   │
│  │   3   4   5   6   7   8   9     │   │
│  │  10  11  12  13  14  15  16     │   │
│  │  17  18  19  20  21  22  23     │   │
│  │  24  25  26  27  28             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Time: [03:00] [PM]                     │
│                                         │
│  Quick: [Today] [Tomorrow] [Next Week] │
│                                         │
│  Natural: "tomorrow at 3pm" → Feb 18   │
│                                         │
│  [Remove Due Date]          [Save]     │
└─────────────────────────────────────────┘
```

### Natural Language Input

```
┌─────────────────────────────────────────┐
│  When is this due?                      │
│  ┌─────────────────────────────────┐   │
│  │ tomorrow at 3pm                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Preview: 📅 Wednesday, Feb 18 at 3:00 PM
│                                         │
│  Or pick a date: [Calendar Icon]        │
└─────────────────────────────────────────┘
```

### Overdue Task Styling

```
Normal Task:
┌─────────────────────────────────────────┐
│  ☐ Task Title                           │
│     Due: Feb 17 at 3:00 PM              │
└─────────────────────────────────────────┘

Overdue Task:
┌─────────────────────────────────────────┐
│  ☐ Task Title                    ⚠️    │
│     Due: Feb 10 at 3:00 PM (7 days)     │
│     ███████████████████████████  OVERDUE
└─────────────────────────────────────────┘
```

### Reminder Selector

```
┌─────────────────────────────────────────┐
│  Remind Me                              │
├─────────────────────────────────────────┤
│  ☐ No reminder                          │
│  ☑ 15 minutes before                    │
│  ☐ 1 hour before                        │
│  ☐ 1 day before                         │
│  ☐ 1 week before                        │
│  ☐ Custom...                            │
├─────────────────────────────────────────┤
│  Current: Reminds at 2:45 PM (15 min)  │
└─────────────────────────────────────────┘
```

### Browser Notification Permission

```
┌─────────────────────────────────────────┐
│  🔔 Stay on Top of Your Tasks           │
│                                         │
│  Get browser notifications for          │
│  upcoming tasks and reminders.          │
│                                         │
│  [Allow Notifications]  [Not Now]       │
│                                         │
│  You can change this in settings.       │
└─────────────────────────────────────────┘
```

### Quick Date Views (Sidebar)

```
┌─────────────────────────────────────────┐
│  When                                   │
├─────────────────────────────────────────┤
│  📅 Today          8 tasks              │
│  📅 Tomorrow       5 tasks              │
│  📅 This Week      23 tasks             │
│  📅 Overdue        3 tasks  ⚠️          │
│  📅 No Date        12 tasks             │
└─────────────────────────────────────────┘
```

### Animations (Framer Motion)

```typescript
// Date picker open
const datePickerOpen = {
  initial: { opacity: 0, scale: 0.95, y: -10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -10 },
  transition: { duration: 0.15 },
};

// Overdue highlight pulse
const overduePulse = {
  backgroundColor: ['#fef2f2', '#fee2e2', '#fef2f2'],
  transition: { duration: 2, repeat: Infinity },
};

// Reminder toast slide in
const reminderToast = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 25 },
};
```

### Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `D` | Open due date picker | Task focused |
| `T` | Set due date to today | Task focused |
| `M` | Set due date to tomorrow | Task focused |
| `W` | Set due date to next week | Task focused |
| `N` | Clear due date | Task focused |
| `R` | Open reminder settings | Task focused |

### Accessibility

- Date picker has proper ARIA labels for calendar grid
- Screen reader announcements for date selection
- Keyboard navigation through calendar (arrow keys)
- Focus management when picker opens/closes
- Time input accessible via keyboard
- Color contrast meets WCAG 2.1 AA

### Responsive Behavior

- **Desktop**: Full calendar picker with time selection
- **Tablet**: Compact calendar, stacked time selection
- **Mobile**: Native date/time pickers, bottom sheet presentation

---

## Dependencies

| Feature | Dependency Type | Description |
|---------|-----------------|-------------|
| `task-management.md` | Required | Task data and CRUD operations |
| `auth-jwt.md` | Required | JWT authentication |
| `calendar-view.md` | Consumer | Due date visualization |
| `pwa-offline.md` | Consumer | Push notification support |

---

## Related Specifications

- `@specs/overview.md` - Project overview with API endpoint definitions
- `@specs/features/task-management.md` - Task management core features
- `@specs/features/calendar-view.md` - Calendar view for due dates
- `@specs/features/pwa-offline.md` - PWA and notification support
- `@specs/database/schema.md` - Database schema definitions

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Due Date Assignment Rate | >60% of tasks have due dates | Task analytics |
| Natural Language Parse Success | >90% successful parses | Parser analytics |
| Reminder Setup Rate | >40% of dated tasks have reminders | Reminder analytics |
| Notification Permission Grant | >50% of users grant permission | Permission analytics |
| Overdue Task Completion | >70% of overdue tasks completed within 3 days | Completion analytics |

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Setting due date while offline | Queue for sync, optimistic UI, sync on reconnect |
| Timezone change after setting due date | Display updates, reminder times adjust |
| Reminder during Do Not Disturb | Queue notification, deliver when DND ends |
| Browser notifications blocked | Show in-app notification banner |
| Natural language parse failure | Show error, suggest manual picker |
| Past due date selection | Allow with warning: "This date is in the past" |
| Multiple reminders same time | Deduplicate, show single notification |
| Daylight saving time change | Adjust reminder times automatically |
| Very long task titles in notifications | Truncate with ellipsis |

---

*This specification follows the principles of the Phase 2 Constitution. Implementation must align with documented requirements, technology stack, and UX standards.*
