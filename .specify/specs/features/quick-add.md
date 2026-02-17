# Feature: Quick Add

**Feature ID:** PF-16
**Status:** `draft`
**Constitution Principles:**
- Principle 1: Spec-Driven Development
- Principle 3: JWT Authentication & User Isolation
- Principle 5: Premium SaaS UX Standards

---

## Overview

Quick Add provides rapid, frictionless task entry patterns enabling users to capture tasks instantly from anywhere in the application. This specification covers the floating action button (FAB), inline quick-add input, natural language date parsing, minimal friction single-field entry, smart defaults based on context, and quick-add availability from any page.

The implementation must deliver a seamless, fast task capture experience that rivals Todoist Quick Add and Things Quick Entry, minimizing the time between thought and captured task.

---

## User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-QA-01 | As a user, I can access quick-add from anywhere so that I can capture tasks immediately | Must Have |
| US-QA-02 | As a user, I can add a task with just a title so that entry is fast | Must Have |
| US-QA-03 | As a user, I can use natural language for dates ("tomorrow at 3pm") so that I don't need to pick dates manually | Must Have |
| US-QA-04 | As a user, quick-add smartly assigns context based on where I am so that I don't have to specify it | Should Have |
| US-QA-05 | As a user, I can expand quick-add to add more details so that I can add complete tasks when needed | Must Have |
| US-QA-06 | As a user, I can use keyboard shortcut to open quick-add so that I can capture without mouse | Must Have |
| US-QA-07 | As a user, I can add multiple tasks in sequence so that I can brain dump efficiently | Should Have |
| US-QA-08 | As a user, quick-add remembers my last settings so that repetitive entry is faster | Should Have |
| US-QA-09 | As a user, I see suggestions as I type so that I can reuse existing projects/labels | Should Have |
| US-QA-10 | As a user, quick-add works offline so that I can capture tasks anytime | Must Have |

---

## Acceptance Criteria

### Universal Access (US-QA-01)

- [ ] Floating Action Button (FAB) visible on all pages
- [ ] FAB positioned bottom-right on desktop, bottom-center on mobile
- [ ] FAB accessible via keyboard (Tab navigation)
- [ ] FAB shows tooltip: "Quick add (N)"
- [ ] FAB animates on scroll (hide on scroll down, show on scroll up)
- [ ] FAB size: minimum 56x56px touch target
- [ ] FAB icon: Plus (+) symbol
- [ ] FAB visible on all pages: Tasks, Calendar, Projects, Dashboard, Settings

### Minimal Entry (US-QA-02)

- [ ] Single input field for task title
- [ ] Title is only required field
- [ ] Placeholder: "Add a task..."
- [ ] Input auto-focused when quick-add opens
- [ ] Enter key creates task and closes quick-add
- [ ] Task created with default settings (medium priority, no due date, no project)
- [ ] Creation is immediate (optimistic update)
- [ ] Success feedback: brief toast or animation

### Natural Language Dates (US-QA-03)

- [ ] Input parses natural language in title
- [ ] Supported patterns:
  - "tomorrow", "next week", "next month"
  - "today at 3pm", "tomorrow at 9am"
  - "friday at 5", "monday at 2pm"
  - "15 jan", "20 february"
  - "in 2 days", "in 3 weeks"
  - "eod" (end of day)
- [ ] Parsed date shown as preview below input
- [ ] Date can be removed by clicking X on preview
- [ ] Unparseable text remains as part of title
- [ ] Multiple date mentions: first one is used

### Smart Defaults (US-QA-04)

- [ ] On Tasks page: no specific defaults
- [ ] On Project page: auto-assign to that project
- [ ] On Label filter: auto-assign to that label
- [ ] On Calendar day: auto-set due date to that day
- [ ] On Calendar week: auto-set due date to selected day
- [ ] Smart defaults shown in expanded view
- [ ] Smart defaults can be overridden

### Expanded Mode (US-QA-05)

- [ ] Expand button reveals additional fields
- [ ] Additional fields: Description, Due Date, Priority, Project, Labels
- [ ] Expanded mode has smooth animation
- [ ] All fields optional except title
- [ ] Expanded mode remembers last state
- [ ] Collapse button returns to minimal mode
- [ ] Enter in any field creates task

### Keyboard Shortcut (US-QA-06)

- [ ] `N` key opens quick-add from anywhere
- [ ] Shortcut works when not typing in input
- [ ] Escape closes quick-add
- [ ] Shortcut hint visible on FAB tooltip
- [ ] Shortcut works in installed PWA

### Multiple Task Entry (US-QA-07)

- [ ] "Add another" checkbox keeps quick-add open after creation
- [ ] Each task created shows brief success indicator
- [ ] Input clears after each creation
- [ ] Counter shows tasks created in session: "3 tasks added"
- [ ] Close button or Escape ends session
- [ ] Session count resets when quick-add closes

### Setting Persistence (US-QA-08)

- [ ] Last used project remembered
- [ ] Last used priority remembered
- [ ] "Add another" preference remembered
- [ ] Expanded/collapsed state remembered
- [ ] Settings stored in localStorage
- [ ] Settings sync to user profile (optional)

### Type-ahead Suggestions (US-QA-09)

- [ ] Project suggestions appear as user types
- [ ] Label suggestions appear as user types
- [ ] Suggestions based on: recent use, frequent use, name match
- [ ] Suggestions shown in dropdown below input
- [ ] Arrow keys navigate suggestions
- [ ] Enter selects suggestion
- [ ] Click selects suggestion
- [ ] Maximum 5 suggestions shown

### Offline Support (US-QA-10)

- [ ] Quick-add works when offline
- [ ] Tasks created offline queued for sync
- [ ] Offline tasks show pending indicator
- [ ] Sync occurs when connection restored
- [ ] Failed sync shows error with retry
- [ ] Offline mode indicated in quick-add

---

## Technical Requirements

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/tasks` | Yes | Create new task |
| POST | `/api/tasks/quick-add` | Yes | Create task with natural language parsing |
| GET | `/api/suggestions/projects` | Yes | Get project suggestions |
| GET | `/api/suggestions/labels` | Yes | Get label suggestions |

### Request/Response Schemas

#### POST /api/tasks/quick-add

**Request Body:**
```json
{
  "title": "Meeting tomorrow at 3pm",
  "project_id": "uuid",
  "label_ids": ["uuid"],
  "priority": "medium",
  "context": {
    "current_page": "projects",
    "current_project_id": "uuid",
    "current_date": "2026-02-17"
  }
}
```

**Success Response (201):**
```json
{
  "task": {
    "id": "uuid",
    "title": "Meeting",
    "description": "",
    "due_date": "2026-02-18T15:00:00Z",
    "priority": "medium",
    "project_id": "uuid",
    "label_ids": [],
    "status": "todo",
    "completed": false,
    "created_at": "2026-02-17T10:30:00Z"
  },
  "parsed": {
    "due_date": "2026-02-18T15:00:00Z",
    "due_date_display": "Tomorrow at 3:00 PM"
  }
}
```

### Natural Language Parser

```typescript
// natural-language-parser.ts
interface ParsedResult {
  title: string;
  dueDate?: Date;
  dueDateDisplay?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  project?: string;
}

export function parseQuickAddInput(input: string): ParsedResult {
  let title = input;
  let dueDate: Date | undefined;
  let dueDateDisplay: string | undefined;
  let priority: ParsedResult['priority'] | undefined;

  // Priority patterns
  const priorityPatterns = [
    { pattern: /\b(urgent|!!!)\b/i, priority: 'urgent' as const },
    { pattern: /\b(high|!!)\b/i, priority: 'high' as const },
    { pattern: /\b(medium|!)\b/i, priority: 'medium' as const },
    { pattern: /\b(low)\b/i, priority: 'low' as const },
  ];

  for (const { pattern, priority: p } of priorityPatterns) {
    if (pattern.test(title)) {
      priority = p;
      title = title.replace(pattern, '');
      break;
    }
  }

  // Date patterns
  const datePatterns = [
    { pattern: /\btomorrow\b/i, offset: 1 },
    { pattern: /\bnext week\b/i, offset: 7 },
    { pattern: /\bnext month\b/i, offset: 30 },
    { pattern: /\bin (\d+) days?\b/i, offsetFn: (m: number) => m },
    { pattern: /\bin (\d+) weeks?\b/i, offsetFn: (m: number) => m * 7 },
  ];

  const now = new Date();

  for (const { pattern, offset, offsetFn } of datePatterns) {
    const match = title.match(pattern);
    if (match) {
      let daysOffset = offset || 0;
      if (offsetFn && match[1]) {
        daysOffset = offsetFn(parseInt(match[1]));
      }
      dueDate = new Date(now.getTime() + daysOffset * 24 * 60 * 60 * 1000);
      dueDate.setHours(17, 0, 0, 0); // Default to 5 PM
      title = title.replace(pattern, '');
      break;
    }
  }

  // Time patterns
  const timePattern = /\bat (\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i;
  const timeMatch = title.match(timePattern);
  if (timeMatch && dueDate) {
    const hour = parseInt(timeMatch[1]);
    const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const ampm = timeMatch[3]?.toLowerCase();

    let finalHour = hour;
    if (ampm === 'pm' && hour < 12) finalHour += 12;
    if (ampm === 'am' && hour === 12) finalHour = 0;

    dueDate.setHours(finalHour, minute, 0, 0);
    title = title.replace(timePattern, '');
  }

  // "at 3pm" without date - assume today or tomorrow
  if (timeMatch && !dueDate) {
    dueDate = new Date();
    const hour = parseInt(timeMatch[1]);
    const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const ampm = timeMatch[3]?.toLowerCase();

    let finalHour = hour;
    if (ampm === 'pm' && hour < 12) finalHour += 12;
    if (ampm === 'am' && hour === 12) finalHour = 0;

    // If time has passed today, use tomorrow
    if (dueDate.getHours() > finalHour || 
        (dueDate.getHours() === finalHour && dueDate.getMinutes() > minute)) {
      dueDate.setDate(dueDate.getDate() + 1);
    }
    dueDate.setHours(finalHour, minute, 0, 0);
    title = title.replace(timePattern, '');
  }

  // Format display
  if (dueDate) {
    dueDateDisplay = formatDueDateDisplay(dueDate);
  }

  return {
    title: title.trim(),
    dueDate,
    dueDateDisplay,
    priority,
  };
}

function formatDueDateDisplay(date: Date): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (isSameDay(date, now)) {
    return `Today at ${formatTime(date)}`;
  } else if (isSameDay(date, tomorrow)) {
    return `Tomorrow at ${formatTime(date)}`;
  } else {
    return `${formatDate(date)} at ${formatTime(date)}`;
  }
}
```

### Quick Add Component State

```typescript
interface QuickAddState {
  isOpen: boolean;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  projectId: string | null;
  labelIds: string[];
  isExpanded: boolean;
  addAnother: boolean;
  isSubmitting: boolean;
  suggestions: Array<{
    type: 'project' | 'label';
    id: string;
    name: string;
    color?: string;
  }>;
  parsedPreview: {
    dueDate?: Date;
    dueDateDisplay?: string;
    priority?: string;
  } | null;
}
```

### Smart Defaults Logic

```typescript
function getSmartDefaults(context: {
  page: string;
  projectId?: string;
  labelId?: string;
  selectedDate?: Date;
}): Partial<QuickAddState> {
  const defaults: Partial<QuickAddState> = {};

  // Project context
  if (context.page === 'project' && context.projectId) {
    defaults.projectId = context.projectId;
  }

  // Label context
  if (context.page === 'label' && context.labelId) {
    defaults.labelIds = [context.labelId];
  }

  // Calendar context
  if (context.page === 'calendar' && context.selectedDate) {
    defaults.dueDate = context.selectedDate;
  }

  // Load persisted defaults
  const persisted = loadPersistedDefaults();
  if (persisted.priority) defaults.priority = persisted.priority;
  if (persisted.projectId && !defaults.projectId) {
    defaults.projectId = persisted.projectId;
  }

  return defaults;
}
```

---

## UX Requirements

### Floating Action Button

```
Desktop (bottom-right):
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│                                         │
│                              ┌───────┐  │
│  Page content...             │   +   │  │
│                              └───────┘  │
│                              Quick add  │
└─────────────────────────────────────────┘

Mobile (bottom-center):
┌─────────────────────────────────────────┐
│                                         │
│  Page content...                        │
│                                         │
│              ┌───────────┐              │
│              │     +     │              │
│              └───────────┘              │
└─────────────────────────────────────────┘

FAB States:
- Default: Blue circle with white plus
- Hover: Slightly larger, elevated shadow
- Active: Pressed down effect
- Loading: Spinner animation
- Scroll hide: Slide down out of view
```

### Quick Add Modal

```
Minimal Mode:
┌─────────────────────────────────────────┐
│  Quick Add Task                     [X] │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Meeting tomorrow at 3pm         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📅 Tomorrow at 3:00 PM          [✕]   │
│                                         │
│  [Expand]              [Add Task]       │
└─────────────────────────────────────────┘

Expanded Mode:
┌─────────────────────────────────────────┐
│  Quick Add Task                     [X] │
├─────────────────────────────────────────┤
│                                         │
│  Title *                                │
│  ┌─────────────────────────────────┐   │
│  │ Meeting tomorrow at 3pm         │   │
│  └─────────────────────────────────┘   │
│                              25/200     │
│                                         │
│  Description                            │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Due Date        Priority    Project    │
│  [Tomorrow ▼]   [Medium ▼]  [Work ▼]   │
│                                         │
│  Labels                                 │
│  [+ Add labels]                         │
│                                         │
│  ☐ Add another task                     │
│                                         │
│  [Collapse]            [Add Task]       │
└─────────────────────────────────────────┘
```

### Suggestions Dropdown

```
┌─────────────────────────────────────────┐
│  Team meeting                          │
├─────────────────────────────────────────┤
│  Projects                               │
│  💼 Work                                │
│  🏠 Home                                │
│  Labels                                 │
│  🔵 Meeting                             │
│  🔴 Urgent                              │
└─────────────────────────────────────────┘
```

### Success Feedback

```
Toast notification:
┌─────────────────────────────────────────┐
│  ✓ Task created                         │
│    Meeting tomorrow at 3pm              │
│                              [Undo]     │
└─────────────────────────────────────────┘

Or inline animation:
- Task briefly highlights in list
- Checkmark animation
- Fade in effect
```

### Offline Indicator

```
┌─────────────────────────────────────────┐
│  Quick Add Task                     [X] │
├─────────────────────────────────────────┤
│                                         │
│  ⚠️ Offline - will sync when connected │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Task title...                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Add Task]                             │
└─────────────────────────────────────────┘
```

### Animations (Framer Motion)

```typescript
// FAB hover
const fabHover = {
  scale: 1.1,
  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
  transition: { duration: 0.15 },
};

// Modal open
const modalOpen = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 20, scale: 0.95 },
  transition: { type: 'spring', stiffness: 400, damping: 30 },
};

// Expand animation
const expand = {
  collapsed: { height: 'auto' },
  expanded: { height: 'auto' },
  transition: { duration: 0.2 },
};

// Success checkmark
const checkmark = {
  initial: { scale: 0, rotate: -45 },
  animate: { scale: 1, rotate: 0 },
  transition: { type: 'spring', stiffness: 400, damping: 10 },
};
```

### Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `N` | Open quick-add | Global |
| `Escape` | Close quick-add | Quick-add open |
| `Enter` | Create task | Quick-add open |
| `Tab` | Navigate fields | Quick-add open |
| `Down` | Select suggestion | Suggestions open |
| `Up` | Select previous suggestion | Suggestions open |

### Accessibility

- Quick-add modal has proper ARIA labels
- Focus trapped in modal when open
- Screen reader announces when quick-add opens
- All fields have associated labels
- Keyboard navigation through all elements
- Focus returns to FAB when modal closes

### Responsive Behavior

- **Desktop**: Modal centered, expanded by default for power users
- **Tablet**: Modal with adjusted width
- **Mobile**: Bottom sheet presentation, full width

---

## Dependencies

| Feature | Dependency Type | Description |
|---------|-----------------|-------------|
| `task-management.md` | Required | Task creation API |
| `auth-jwt.md` | Required | Authentication |
| `due-dates-reminders.md` | Consumer | Natural language date parsing |
| `labels.md` | Consumer | Label suggestions |
| `projects-kanban.md` | Consumer | Project suggestions |
| `pwa-offline.md` | Consumer | Offline support |

---

## Related Specifications

- `@specs/overview.md` - Project overview
- `@specs/features/task-management.md` - Task management
- `@specs/features/due-dates-reminders.md` - Due dates and natural language parsing
- `@specs/features/labels.md` - Labels system
- `@specs/features/projects-kanban.md` - Projects
- `@specs/features/keyboard-shortcuts.md` - Keyboard shortcuts

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Quick Add Usage | >70% of users use quick-add weekly | Analytics tracking |
| Task Creation Speed | <5 seconds average | Time from open to create |
| Natural Language Parse Success | >85% successful parses | Parser analytics |
| FAB Click Rate | >50% of task creations via FAB | Interaction analytics |
| Add Another Usage | >20% use multi-add feature | Feature analytics |

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Empty title on submit | Show validation error, focus input |
| Network failure during create | Queue for sync, show offline indicator |
| Very long title | Truncate display, full title saved |
| Duplicate task detection | Show warning if similar task exists |
| Quick-add during sync | Queue operation, show pending status |
| Multiple rapid submissions | Debounce, show loading state |
| Suggestions API fails | Show empty suggestions, continue |
| Natural language parse error | Keep text as title, no date set |
| Input with only date ("tomorrow") | Use "Tomorrow" as title with due date |

---

*This specification follows the principles of the Phase 2 Constitution. Implementation must align with documented requirements, technology stack, and UX standards.*
