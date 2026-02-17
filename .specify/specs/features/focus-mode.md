# Feature: Focus Mode

**Feature ID:** PF-17
**Status:** `draft`
**Constitution Principles:**
- Principle 1: Spec-Driven Development
- Principle 3: JWT Authentication & User Isolation
- Principle 5: Premium SaaS UX Standards

---

## Overview

Focus Mode provides a distraction-free task view that hides navigation and chrome, allowing users to concentrate on a single task or task list. This specification covers sidebar hiding, single task focus mode, Pomodoro timer integration, escape to exit functionality, minimal UI chrome, and focus session tracking.

The implementation must deliver a serene, focused environment that rivals writing tools like iA Writer and focus features in apps like Forest and Freedom, enabling deep work sessions.

---

## User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-FM-01 | As a user, I can enter focus mode to hide distractions so that I can concentrate on my work | Must Have |
| US-FM-02 | As a user, I can focus on a single task with all details visible so that I can work without context switching | Must Have |
| US-FM-03 | As a user, I can start a Pomodoro timer in focus mode so that I can work in focused intervals | Should Have |
| US-FM-04 | As a user, I can exit focus mode with Escape so that I can quickly return to normal view | Must Have |
| US-FM-05 | As a user, the UI is minimal in focus mode so that nothing distracts me | Must Have |
| US-FM-06 | As a user, I can track my focus sessions so that I can see how much time I spend in deep work | Should Have |
| US-FM-07 | As a user, I can navigate between tasks in focus mode so that I can work through my list | Should Have |
| US-FM-08 | As a user, I can set a focus session goal so that I know what I'm working toward | Could Have |
| US-FM-09 | As a user, focus mode works offline so that I can focus anywhere | Should Have |
| US-FM-10 | As a user, I can customize what's visible in focus mode so that I have the right tools | Could Have |

---

## Acceptance Criteria

### Enter Focus Mode (US-FM-01)

- [ ] Focus mode accessible from task detail view
- [ ] Focus mode accessible from task list (focus on filtered view)
- [ ] Focus mode button/icon visible in task toolbar
- [ ] Focus mode keyboard shortcut: `F` or `Ctrl+F`
- [ ] Focus mode tooltip: "Enter focus mode"
- [ ] Transition to focus mode has smooth animation
- [ ] Focus mode state indicated visually

### Hide Distractions (US-FM-01 continued)

- [ ] Sidebar hidden in focus mode
- [ ] Header navigation hidden
- [ ] Footer hidden
- [ ] Notifications suppressed (except timer alerts)
- [ ] Only task content and essential controls visible
- [ ] Browser tabs still visible (cannot hide browser chrome)
- [ ] System taskbar still visible (cannot hide OS chrome)

### Single Task Focus (US-FM-02)

- [ ] Task title prominently displayed
- [ ] Task description in readable format (markdown rendered)
- [ ] Task metadata visible: due date, priority, project, labels
- [ ] Subtasks visible and interactive
- [ ] Completion toggle accessible
- [ ] Edit controls accessible but unobtrusive
- [ ] Task content centered for readability
- [ ] Max content width for comfortable reading (~70 characters)

### Pomodoro Integration (US-FM-03)

- [ ] Pomodoro timer accessible in focus mode
- [ ] Timer displays: minutes:seconds remaining
- [ ] Timer controls: Start, Pause, Reset
- [ ] Default session: 25 minutes
- [ ] Custom duration option (15, 25, 45, 60 minutes)
- [ ] Break timer option: 5 minutes
- [ ] Timer completion plays subtle sound
- [ ] Timer completion shows notification
- [ ] Timer visible but unobtrusive
- [ ] Timer can be minimized

### Exit Focus Mode (US-FM-04)

- [ ] Escape key exits focus mode
- [ ] Exit button visible in focus mode
- [ ] Exit confirmation if timer running: "Timer in progress. Exit anyway?"
- [ ] Exit has smooth transition animation
- [ ] Returns to previous view state
- [ ] Focus session saved on exit

### Minimal UI Chrome (US-FM-05)

- [ ] No sidebar in focus mode
- [ ] No header navigation
- [ ] Minimal toolbar: timer, exit, next/prev task
- [ ] Subtle background color (no patterns or gradients)
- [ ] Typography optimized for reading
- [ ] Generous whitespace
- [ ] No ads or promotional content (ever)
- [ ] No notification badges or counts

### Focus Session Tracking (US-FM-06)

- [ ] Session start time recorded
- [ ] Session end time recorded
- [ ] Session duration calculated
- [ ] Task worked on recorded
- [ ] Sessions stored in user history
- [ ] Session count displayed: "Focus session #12"
- [ ] Total focus time displayed (session + historical)

### Task Navigation (US-FM-07)

- [ ] Next task button/shortcut in focus mode
- [ ] Previous task button/shortcut
- [ ] Navigation respects current filter context
- [ ] Navigation skips completed tasks (optional)
- [ ] Keyboard shortcuts: `J`/`K` or `N`/`P` for next/prev
- [ ] Navigation has smooth transition

### Focus Session Goal (US-FM-08)

- [ ] Optional: set goal before starting focus session
- [ ] Goal types: Complete X tasks, Work for X minutes, Complete this task
- [ ] Progress toward goal displayed
- [ ] Goal completion celebration
- [ ] Goal can be modified during session

### Offline Support (US-FM-09)

- [ ] Focus mode works without internet
- [ ] Timer continues working offline
- [ ] Session tracked locally
- [ ] Session syncs when connection restored
- [ ] Offline indicator visible but unobtrusive

### Customization (US-FM-10)

- [ ] Settings to customize focus mode:
  - Show/hide timer by default
  - Show/hide subtasks
  - Show/hide task metadata
  - Background color preference
  - Font size preference
- [ ] Settings persist across sessions
- [ ] Foundation: data structure for customization

---

## Technical Requirements

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/focus/sessions` | Yes | Start focus session |
| PATCH | `/api/focus/sessions/:id` | Yes | Update focus session |
| GET | `/api/focus/sessions` | Yes | Get user's focus sessions |
| GET | `/api/focus/stats` | Yes | Get focus statistics |

### Request/Response Schemas

#### POST /api/focus/sessions

**Request Body:**
```json
{
  "task_id": "uuid",
  "duration_minutes": 25,
  "goal": {
    "type": "complete_task",
    "target": "uuid"
  }
}
```

**Success Response (201):**
```json
{
  "session": {
    "id": "uuid",
    "user_id": "uuid",
    "task_id": "uuid",
    "started_at": "2026-02-17T10:30:00Z",
    "duration_minutes": 25,
    "status": "active",
    "goal": {
      "type": "complete_task",
      "target": "uuid"
    }
  }
}
```

#### GET /api/focus/stats

**Response (200):**
```json
{
  "totalSessions": 45,
  "totalMinutes": 1125,
  "averageSessionMinutes": 25,
  "longestStreak": 7,
  "currentStreak": 3,
  "thisWeek": {
    "sessions": 8,
    "minutes": 200
  },
  "thisMonth": {
    "sessions": 35,
    "minutes": 875
  }
}
```

### Database Models

#### Focus Sessions Table

```sql
CREATE TABLE focus_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ended_at TIMESTAMPTZ,
    duration_minutes INTEGER NOT NULL DEFAULT 25,
    actual_duration_minutes INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'active' 
        CHECK (status IN ('active', 'completed', 'abandoned')),
    goal_type VARCHAR(50),
    goal_target UUID,
    goal_completed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX idx_focus_sessions_task_id ON focus_sessions(task_id);
CREATE INDEX idx_focus_sessions_started_at ON focus_sessions(started_at);
CREATE INDEX idx_focus_sessions_status ON focus_sessions(status);
```

### Focus Mode State Management

```typescript
interface FocusModeState {
  isActive: boolean;
  taskId: string | null;
  sessionId: string | null;
  timer: {
    isActive: boolean;
    remainingSeconds: number;
    totalSeconds: number;
    isBreak: boolean;
  };
  session: {
    startedAt: Date;
    goal?: {
      type: 'complete_task' | 'time_duration' | 'task_count';
      target: string | number;
      progress: number;
    };
  };
  settings: {
    showTimer: boolean;
    showSubtasks: boolean;
    showMetadata: boolean;
    fontSize: 'small' | 'medium' | 'large';
    theme: 'light' | 'dark' | 'sepia';
  };
}
```

### Timer Logic

```typescript
// useFocusTimer.ts
import { useState, useEffect, useCallback } from 'react';

interface TimerState {
  isActive: boolean;
  remainingSeconds: number;
  totalSeconds: number;
  isBreak: boolean;
}

export function useFocusTimer(initialMinutes: number = 25) {
  const [timer, setTimer] = useState<TimerState>({
    isActive: false,
    remainingSeconds: initialMinutes * 60,
    totalSeconds: initialMinutes * 60,
    isBreak: false,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isActive && timer.remainingSeconds > 0) {
      interval = setInterval(() => {
        setTimer((prev) => ({
          ...prev,
          remainingSeconds: prev.remainingSeconds - 1,
        }));
      }, 1000);
    } else if (timer.remainingSeconds === 0) {
      // Timer completed
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [timer.isActive, timer.remainingSeconds]);

  const start = useCallback(() => {
    setTimer((prev) => ({ ...prev, isActive: true }));
  }, []);

  const pause = useCallback(() => {
    setTimer((prev) => ({ ...prev, isActive: false }));
  }, []);

  const reset = useCallback(() => {
    setTimer((prev) => ({
      ...prev,
      isActive: false,
      remainingSeconds: prev.totalSeconds,
    }));
  }, []);

  const setDuration = useCallback((minutes: number) => {
    setTimer((prev) => ({
      ...prev,
      totalSeconds: minutes * 60,
      remainingSeconds: minutes * 60,
    }));
  }, []);

  const startBreak = useCallback((breakMinutes: number = 5) => {
    setTimer((prev) => ({
      ...prev,
      isBreak: true,
      isActive: true,
      totalSeconds: breakMinutes * 60,
      remainingSeconds: breakMinutes * 60,
    }));
  }, []);

  const handleTimerComplete = useCallback(() => {
    // Play sound
    playCompletionSound();
    
    // Show notification
    if (timer.isBreak) {
      showNotification('Break complete! Ready to focus?');
    } else {
      showNotification('Focus session complete! Time for a break.');
      // Auto-start break timer option
    }
  }, [timer.isBreak]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timer,
    start,
    pause,
    reset,
    setDuration,
    startBreak,
    formatTime: () => formatTime(timer.remainingSeconds),
    progress: ((timer.totalSeconds - timer.remainingSeconds) / timer.totalSeconds) * 100,
  };
}
```

---

## UX Requirements

### Focus Mode Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    Focus Mode                               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │              Complete project proposal               │   │
│  │                                                      │   │
│  │  📅 Today at 5pm    🔴 Urgent    💼 Work            │   │
│  │                                                      │   │
│  │  ───────────────────────────────────────────────    │   │
│  │                                                      │   │
│  │  Description                                         │   │
│  │                                                      │   │
│  │  Need to finalize the Q2 project proposal with...   │   │
│  │                                                      │   │
│  │  ───────────────────────────────────────────────    │   │
│  │                                                      │   │
│  │  Subtasks (3/5)                                      │   │
│  │  ☑ Research competitors                             │   │
│  │  ☑ Define features                                  │   │
│  │  ☐ Create mockups                                   │   │
│  │  ☐ Write technical specs                            │   │
│  │  ☐ Get stakeholder approval                         │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│         [◀ Prev]   [✓ Complete]   [Next ▶]                 │
│                                                             │
│              🍅 23:45  [Pause]  [Exit]                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Focus Mode Entry

```
Task Detail View:
┌─────────────────────────────────────────┐
│  Task Title                    [🎯 Focus]│
├─────────────────────────────────────────┤
│  ...task content...                     │
└─────────────────────────────────────────┘

Transition Animation:
- Sidebar slides left
- Header fades up
- Task content centers and expands
- Duration: 300ms ease-in-out
```

### Timer Display

```
Active Timer:
┌─────────────────────────────────────────┐
│  🍅 23:45  ████████████░░░░  78%       │
│          [Pause]  [Reset]  [Exit]       │
└─────────────────────────────────────────┘

Paused Timer:
┌─────────────────────────────────────────┐
│  ⏸️ 23:45  (Paused)                     │
│          [Resume]  [Reset]  [Exit]      │
└─────────────────────────────────────────┘

Break Timer:
┌─────────────────────────────────────────┐
│  ☕ 4:30  (Break time!)                 │
│          [Skip Break]  [End Session]    │
└─────────────────────────────────────────┘
```

### Minimal Toolbar

```
┌─────────────────────────────────────────┐
│  [◀]  Task 3 of 12  [▶]    [✕ Exit]    │
└─────────────────────────────────────────┘
```

### Completion Celebration

```
Task Completed in Focus Mode:
┌─────────────────────────────────────────┐
│                                         │
│           ✓ Complete!                   │
│                                         │
│      Focus session: 25 minutes          │
│      Tasks completed today: 5           │
│                                         │
│      [Start Break]  [Next Task]         │
│                                         │
└─────────────────────────────────────────┘

With confetti animation (see completion-celebrations.md)
```

### Settings Panel

```
┌─────────────────────────────────────────┐
│  Focus Mode Settings                [X] │
├─────────────────────────────────────────┤
│                                         │
│  Timer                                  │
│  ☑ Show timer by default                │
│  Default duration: [25 minutes ▼]       │
│  Break duration: [5 minutes ▼]          │
│                                         │
│  Display                                │
│  ☑ Show subtasks                        │
│  ☑ Show metadata (due date, etc.)       │
│  Font size: [Medium ▼]                  │
│  Theme: [Default ▼]                     │
│                                         │
│  Behavior                               │
│  ☑ Auto-start break timer               │
│  ☑ Play completion sound                │
│  ☑ Suppress notifications               │
│                                         │
│  [Reset to Defaults]  [Save]            │
└─────────────────────────────────────────┘
```

### Animations (Framer Motion)

```typescript
// Focus mode enter
const focusEnter = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 },
};

// Sidebar exit
const sidebarExit = {
  x: 0,
  exit: { x: -300, opacity: 0 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};

// Timer pulse
const timerPulse = {
  scale: [1, 1.02, 1],
  transition: { duration: 1, repeat: Infinity },
};

// Task complete celebration
const celebrate = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: 400, damping: 15 },
};
```

### Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `F` or `Ctrl+F` | Toggle focus mode | Global |
| `Escape` | Exit focus mode | Focus mode active |
| `Space` | Start/Pause timer | Focus mode active |
| `R` | Reset timer | Focus mode active |
| `J` / `K` | Next/Prev task | Focus mode active |
| `C` | Complete task | Focus mode active |
| `B` | Start break | Timer complete |

### Accessibility

- Focus mode announces state change to screen readers
- Timer updates announced periodically (optional)
- All controls accessible via keyboard
- Focus trapped appropriately in focus mode
- High contrast mode supported
- Reduced motion respected

### Responsive Behavior

- **Desktop**: Full focus mode with all features
- **Tablet**: Adapted layout, timer always visible
- **Mobile**: Full-screen focus, simplified controls

---

## Dependencies

| Feature | Dependency Type | Description |
|---------|-----------------|-------------|
| `task-management.md` | Required | Task data and completion |
| `analytics.md` | Consumer | Focus session tracking |
| `completion-celebrations.md` | Consumer | Task completion celebration |
| `keyboard-shortcuts.md` | Consumer | Focus mode shortcuts |

---

## Related Specifications

- `@specs/overview.md` - Project overview
- `@specs/features/task-management.md` - Task management
- `@specs/features/analytics.md` - Analytics dashboard
- `@specs/features/completion-celebrations.md` - Completion celebrations
- `@specs/features/keyboard-shortcuts.md` - Keyboard shortcuts

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Focus Mode Adoption | >30% of users use focus mode weekly | Analytics tracking |
| Average Session Duration | 25+ minutes | Session analytics |
| Session Completion Rate | >70% complete full session | Session analytics |
| Timer Usage | >60% use timer in focus mode | Feature analytics |
| User Retention | Focus users 2x more likely to return | Cohort analysis |

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Timer running when closing tab | Save session state, resume on return |
| Network failure during session | Track locally, sync when connected |
| Multiple tabs open | Focus mode only active in one tab |
| System sleep during timer | Resume timer on wake, adjust for elapsed time |
| Incoming call/notification | Suppress during focus (optional) |
| Timer completion sound muted | Visual notification fallback |
| Very long focus session | Suggest break after 90 minutes |
| Task deleted during focus | Show message, offer to select new task |

---

*This specification follows the principles of the Phase 2 Constitution. Implementation must align with documented requirements, technology stack, and UX standards.*
