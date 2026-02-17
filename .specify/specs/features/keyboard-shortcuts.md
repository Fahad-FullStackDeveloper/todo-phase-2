# Feature: Keyboard Shortcuts

**Feature ID:** PF-15
**Status:** `draft`
**Constitution Principles:**
- Principle 1: Spec-Driven Development
- Principle 3: JWT Authentication & User Isolation
- Principle 5: Premium SaaS UX Standards

---

## Overview

Keyboard Shortcuts provide power users with efficient keyboard-driven navigation and actions throughout the application. This specification covers global shortcuts, task list shortcuts, navigation shortcuts, the shortcut help modal, customizable shortcuts foundation, and keyboard focus management.

The implementation must deliver a comprehensive, discoverable keyboard shortcut system that rivals industry leaders like Linear, Todoist, and Notion, enabling users to accomplish tasks without touching the mouse.

---

## User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-KS-01 | As a user, I can use global shortcuts (N, /, T) so that I can perform common actions quickly | Must Have |
| US-KS-02 | As a user, I can navigate task lists with keyboard so that I can browse efficiently | Must Have |
| US-KS-03 | As a user, I can use task-specific shortcuts (complete, edit, delete) so that I can manage tasks quickly | Must Have |
| US-KS-04 | As a user, I can navigate between pages with keyboard so that I don't need to use the mouse | Must Have |
| US-KS-05 | As a user, I can view all shortcuts in a help modal so that I can discover and remember them | Must Have |
| US-KS-06 | As a user, I can customize shortcuts so that they match my preferences | Could Have |
| US-KS-07 | As a user, keyboard focus is managed properly so that I always know where I am | Must Have |
| US-KS-08 | As a user, shortcuts work consistently across pages so that I can build muscle memory | Must Have |
| US-KS-09 | As a user, I can disable shortcuts when typing in inputs so that I don't trigger actions accidentally | Must Have |
| US-KS-10 | As a user, I can see shortcut hints in the UI so that I can learn them organically | Should Have |

---

## Acceptance Criteria

### Global Shortcuts (US-KS-01)

- [ ] `N` - Create new task (opens quick-add modal)
- [ ] `/` - Focus search input
- [ ] `T` - Toggle theme (light/dark/system)
- [ ] `?` - Open shortcut help modal
- [ ] `G, T` - Go to Tasks view (press G then T)
- [ ] `G, C` - Go to Calendar view
- [ ] `G, P` - Go to Projects view
- [ ] `G, D` - Go to Dashboard view
- [ ] `G, S` - Go to Settings view
- [ ] `Escape` - Close modal / Cancel action / Clear filters
- [ ] `R` - Refresh/sync current view
- [ ] Shortcuts disabled when typing in inputs (except Escape)

### Task List Navigation (US-KS-02)

- [ ] `J` or `Down Arrow` - Move to next task
- [ ] `K` or `Up Arrow` - Move to previous task
- [ ] `Home` - Move to first task
- [ ] `End` - Move to last task
- [ ] `Ctrl+Home` or `G, G` - Go to top of list
- [ ] `Ctrl+End` or `G, E` - Go to end of list
- [ ] `Page Down` - Scroll down one page
- [ ] `Page Up` - Scroll up one page
- [ ] Focused task has visible highlight
- [ ] Focus wraps around at list boundaries (optional setting)

### Task Actions (US-KS-03)

- [ ] `Space` - Toggle task completion (when task focused)
- [ ] `Enter` - Open task detail view (when task focused)
- [ ] `E` - Edit task inline (when task focused)
- [ ] `Delete` or `Backspace` - Delete task (with confirmation)
- [ ] `C` - Copy task link/text to clipboard
- [ ] `D` - Set due date (opens date picker)
- [ ] `P` - Set priority (cycles through priorities)
- [ ] `L` - Add/edit labels (opens label picker)
- [ ] `!` - Set priority to Urgent
- [ ] `#` - Set priority to High
- [ ] `$` - Set priority to Medium
- [ ] `~` - Set priority to Low

### Navigation Shortcuts (US-KS-04)

- [ ] `G` followed by navigation key (see global shortcuts)
- [ ] `Tab` - Navigate forward through interactive elements
- [ ] `Shift+Tab` - Navigate backward through interactive elements
- [ ] `Alt+Left Arrow` - Go back in navigation history
- [ ] `Alt+Right Arrow` - Go forward in navigation history
- [ ] `Ctrl+B` - Toggle sidebar visibility
- [ ] `Ctrl+K` - Open command palette (stretch goal)

### Shortcut Help Modal (US-KS-05)

- [ ] Modal accessible via `?` shortcut
- [ ] Modal accessible via settings menu
- [ ] Modal organized by category: Global, Navigation, Task Actions, View
- [ ] Each shortcut shows key combination and description
- [ ] Modal searchable: type to filter shortcuts
- [ ] Modal dismissible via `Escape` or click outside
- [ ] Modal shows platform-specific keys (Cmd vs Ctrl)
- [ ] "Print shortcuts" option for reference

### Customizable Shortcuts (US-KS-06)

- [ ] Settings page has "Keyboard Shortcuts" section
- [ ] Each shortcut can be reassigned
- [ ] Conflict detection warns of duplicate assignments
- [ ] Reset to defaults option available
- [ ] Export/import shortcut configuration
- [ ] Custom shortcuts stored in user profile
- [ ] Foundation: data structure supports customization (full UI in Phase 3)

### Focus Management (US-KS-07)

- [ ] Focus visible on all interactive elements
- [ ] Focus indicator follows WCAG 2.1 guidelines
- [ ] Focus trapped in modals when open
- [ ] Focus returns to trigger element when modal closes
- [ ] Focus managed during list reordering
- [ ] Focus preserved during optimistic updates
- [ ] Skip link for keyboard users to jump to main content
- [ ] Focus announcement for screen readers

### Consistent Behavior (US-KS-08)

- [ ] Same shortcuts work across all pages
- [ ] Platform differences handled (Cmd vs Ctrl, Option vs Alt)
- [ ] Shortcuts work in installed PWA
- [ ] Shortcuts work offline
- [ ] Shortcut behavior documented and consistent

### Input Protection (US-KS-09)

- [ ] Shortcuts disabled when focus in text input
- [ ] Shortcuts disabled when focus in textarea
- [ ] Shortcuts disabled during markdown editing
- [ ] Escape always works to blur/cancel
- [ ] Clear visual indication when shortcuts are disabled
- [ ] Exception: Copy (Ctrl+C) and Paste (Ctrl+V) always work

### Shortcut Hints (US-KS-10)

- [ ] Tooltip hints on hover for buttons
- [ ] Hints show in UI: "New Task (N)"
- [ ] First-time user tutorial highlights shortcuts
- [ ] Hint display can be disabled in settings
- [ ] Hints adapt to user's platform (Cmd vs Ctrl)

---

## Technical Requirements

### Shortcut Configuration Structure

```typescript
interface Shortcut {
  id: string;
  name: string;
  description: string;
  keys: string[]; // e.g., ['n'], ['g', 't'], ['ctrl', 'k']
  category: 'global' | 'navigation' | 'task' | 'view';
  defaultKeys: string[];
  context?: 'global' | 'taskList' | 'taskDetail' | 'modal';
}

interface ShortcutConfig {
  [shortcutId: string]: string[];
}

const defaultShortcuts: Shortcut[] = [
  // Global
  { id: 'new-task', name: 'New Task', description: 'Create a new task', keys: ['n'], category: 'global' },
  { id: 'search', name: 'Search', description: 'Focus search input', keys: ['/'], category: 'global' },
  { id: 'toggle-theme', name: 'Toggle Theme', description: 'Switch between light/dark mode', keys: ['t'], category: 'global' },
  { id: 'help', name: 'Help', description: 'Open shortcut help', keys: ['?'], category: 'global' },
  { id: 'escape', name: 'Escape', description: 'Close modal / Cancel', keys: ['escape'], category: 'global' },
  
  // Navigation (G + key)
  { id: 'go-tasks', name: 'Go to Tasks', description: 'Navigate to Tasks view', keys: ['g', 't'], category: 'navigation' },
  { id: 'go-calendar', name: 'Go to Calendar', description: 'Navigate to Calendar view', keys: ['g', 'c'], category: 'navigation' },
  { id: 'go-projects', name: 'Go to Projects', description: 'Navigate to Projects view', keys: ['g', 'p'], category: 'navigation' },
  { id: 'go-dashboard', name: 'Go to Dashboard', description: 'Navigate to Dashboard', keys: ['g', 'd'], category: 'navigation' },
  { id: 'go-settings', name: 'Go to Settings', description: 'Navigate to Settings', keys: ['g', 's'], category: 'navigation' },
  
  // Task List
  { id: 'next-task', name: 'Next Task', description: 'Move to next task', keys: ['j'], category: 'task' },
  { id: 'prev-task', name: 'Previous Task', description: 'Move to previous task', keys: ['k'], category: 'task' },
  { id: 'toggle-complete', name: 'Toggle Complete', description: 'Mark task as done/not done', keys: ['space'], category: 'task', context: 'taskList' },
  { id: 'open-task', name: 'Open Task', description: 'Open task detail view', keys: ['enter'], category: 'task', context: 'taskList' },
  { id: 'edit-task', name: 'Edit Task', description: 'Edit task inline', keys: ['e'], category: 'task', context: 'taskList' },
  { id: 'delete-task', name: 'Delete Task', description: 'Delete the task', keys: ['delete', 'backspace'], category: 'task', context: 'taskList' },
  { id: 'set-due-date', name: 'Set Due Date', description: 'Open date picker', keys: ['d'], category: 'task', context: 'taskList' },
  { id: 'set-priority', name: 'Set Priority', description: 'Cycle through priorities', keys: ['p'], category: 'task', context: 'taskList' },
  { id: 'add-labels', name: 'Add Labels', description: 'Open label picker', keys: ['l'], category: 'task', context: 'taskList' },
  
  // Priority shortcuts
  { id: 'priority-urgent', name: 'Priority: Urgent', description: 'Set priority to urgent', keys: ['!'], category: 'task' },
  { id: 'priority-high', name: 'Priority: High', description: 'Set priority to high', keys: ['#'], category: 'task' },
  { id: 'priority-medium', name: 'Priority: Medium', description: 'Set priority to medium', keys: ['$'], category: 'task' },
  { id: 'priority-low', name: 'Priority: Low', description: 'Set priority to low', keys: ['~'], category: 'task' },
];
```

### Keyboard Hook

```typescript
// useKeyboardShortcuts.ts
import { useEffect, useCallback, useRef } from 'react';

interface ShortcutHandler {
  keys: string[];
  callback: () => void;
  context?: 'global' | 'taskList' | 'taskDetail' | 'modal';
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(handlers: ShortcutHandler[]) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const isInputElement = useCallback((element: Element): boolean => {
    const tagName = element.tagName.toLowerCase();
    return (
      tagName === 'input' ||
      tagName === 'textarea' ||
      tagName === 'select' ||
      element.isContentEditable
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as Element;
      
      // Allow Escape in inputs
      if (event.key === 'Escape') {
        handlersRef.current.forEach(handler => {
          if (handler.keys.includes('escape')) {
            handler.callback();
            event.preventDefault();
          }
        });
        return;
      }

      // Disable shortcuts in input elements
      if (isInputElement(target)) {
        return;
      }

      // Build key combination string
      const parts = [];
      if (event.ctrlKey) parts.push('ctrl');
      if (event.metaKey) parts.push('meta');
      if (event.shiftKey) parts.push('shift');
      if (event.altKey) parts.push('alt');
      parts.push(event.key.toLowerCase());
      
      const keyString = parts.join('+');

      // Find matching handler
      for (const handler of handlersRef.current) {
        if (handler.keys.includes(event.key.toLowerCase()) ||
            handler.keys.includes(keyString)) {
          if (handler.preventDefault !== false) {
            event.preventDefault();
          }
          handler.callback();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInputElement]);
}
```

### G-Key Navigation (Chord Shortcuts)

```typescript
// useGKeyNavigation.ts
import { useState, useEffect } from 'react';

export function useGKeyNavigation() {
  const [waitingForGKey, setWaitingForGKey] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === 'g') {
        setWaitingForGKey(true);
        timeoutRef.current = setTimeout(() => {
          setWaitingForGKey(false);
        }, 800); // 800ms window to press second key
        return;
      }

      if (waitingForGKey) {
        clearTimeout(timeoutRef.current);
        setWaitingForGKey(false);

        switch (key) {
          case 't':
            // Navigate to tasks
            window.location.href = '/tasks';
            break;
          case 'c':
            // Navigate to calendar
            window.location.href = '/calendar';
            break;
          case 'p':
            // Navigate to projects
            window.location.href = '/projects';
            break;
          case 'd':
            // Navigate to dashboard
            window.location.href = '/dashboard';
            break;
          case 's':
            // Navigate to settings
            window.location.href = '/settings';
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [waitingForGKey]);

  return { waitingForGKey };
}
```

### Shortcut Help Modal Data

```typescript
const shortcutCategories = {
  global: {
    title: 'Global',
    shortcuts: [
      { keys: ['N'], description: 'New task' },
      { keys: ['/'], description: 'Search' },
      { keys: ['T'], description: 'Toggle theme' },
      { keys: ['?'], description: 'Show help' },
      { keys: ['Escape'], description: 'Close modal / Cancel' },
    ],
  },
  navigation: {
    title: 'Navigation',
    shortcuts: [
      { keys: ['G', 'T'], description: 'Go to Tasks' },
      { keys: ['G', 'C'], description: 'Go to Calendar' },
      { keys: ['G', 'P'], description: 'Go to Projects' },
      { keys: ['G', 'D'], description: 'Go to Dashboard' },
      { keys: ['G', 'S'], description: 'Go to Settings' },
      { keys: ['J'], description: 'Next task' },
      { keys: ['K'], description: 'Previous task' },
    ],
  },
  task: {
    title: 'Task Actions',
    shortcuts: [
      { keys: ['Space'], description: 'Toggle complete' },
      { keys: ['Enter'], description: 'Open task' },
      { keys: ['E'], description: 'Edit task' },
      { keys: ['Delete'], description: 'Delete task' },
      { keys: ['D'], description: 'Set due date' },
      { keys: ['P'], description: 'Set priority' },
      { keys: ['L'], description: 'Add labels' },
      { keys: ['!'], description: 'Priority: Urgent' },
      { keys: ['#'], description: 'Priority: High' },
      { keys: ['$'], description: 'Priority: Medium' },
      { keys: ['~'], description: 'Priority: Low' },
    ],
  },
  view: {
    title: 'View',
    shortcuts: [
      { keys: ['Ctrl+B'], description: 'Toggle sidebar' },
      { keys: ['R'], description: 'Refresh view' },
      { keys: ['Ctrl+Home'], description: 'Go to top' },
      { keys: ['Ctrl+End'], description: 'Go to bottom' },
    ],
  },
};
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/preferences` | Yes | Get user preferences including shortcuts |
| PUT | `/api/users/preferences` | Yes | Update user preferences including shortcuts |

---

## UX Requirements

### Shortcut Help Modal

```
┌─────────────────────────────────────────────────────────┐
│  Keyboard Shortcuts                                 [X] │
├─────────────────────────────────────────────────────────┤
│  🔍 Search shortcuts...                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  GLOBAL                                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │  N              New task                        │   │
│  │  /              Search                          │   │
│  │  T              Toggle theme                    │   │
│  │  ?              Show this help                  │   │
│  │  Escape         Close modal / Cancel            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  NAVIGATION                                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │  G then T       Go to Tasks                     │   │
│  │  G then C       Go to Calendar                  │   │
│  │  G then P       Go to Projects                  │   │
│  │  J              Next task                       │   │
│  │  K              Previous task                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  TASK ACTIONS                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Space          Toggle complete                 │   │
│  │  Enter          Open task                       │   │
│  │  E              Edit task                       │   │
│  │  Delete         Delete task                     │   │
│  │  D              Set due date                    │   │
│  │  P              Set priority                    │   │
│  │  L              Add labels                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Print Shortcuts]  [Customize in Settings]            │
└─────────────────────────────────────────────────────────┘
```

### Shortcut Hints in UI

```
Button with hint:
┌──────────────────────┐
│  + New Task     (N)  │
└──────────────────────┘

Tooltip on hover:
┌──────────────────────┐
│  New Task            │
│  Keyboard: N         │
└──────────────────────┘
```

### Focus Indicator

```css
/* Focus visible styles */
:focus-visible {
  outline: 2px solid var(--interactive-focus);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Task focus highlight */
.task-focused {
  background: var(--interactive-hover);
  box-shadow: 0 0 0 2px var(--interactive-focus);
}
```

### G-Key Visual Feedback

```
When G is pressed, show overlay:
┌─────────────────────────────────────────┐
│                                         │
│         Go to...                        │
│         [T]asks  [C]alendar             │
│         [P]rojects  [D]ashboard         │
│         [S]ettings                      │
│                                         │
└─────────────────────────────────────────┘
```

### Animations (Framer Motion)

```typescript
// Modal open
const modalAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.15 },
};

// Focus highlight
const focusHighlight = {
  initial: { boxShadow: '0 0 0 0px rgba(59, 130, 246, 0)' },
  animate: { boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)' },
  transition: { duration: 0.1 },
};

// G-key overlay
const gKeyOverlay = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.1 },
};
```

### Accessibility

- All shortcuts documented and discoverable
- Screen reader announces shortcut hints
- Focus management follows WCAG 2.1 guidelines
- Keyboard trap avoided (can always exit)
- Reduced motion respected

### Responsive Behavior

- Shortcuts work on all screen sizes
- Mobile: Shortcuts may be limited due to virtual keyboard
- Tablet: Full shortcut support with external keyboard

---

## Dependencies

| Feature | Dependency Type | Description |
|---------|-----------------|-------------|
| `dark-mode.md` | Consumer | Theme toggle shortcut |
| `task-management.md` | Consumer | Task action shortcuts |

---

## Related Specifications

- `@specs/overview.md` - Project overview
- `@specs/features/dark-mode.md` - Dark mode feature
- `@specs/features/task-management.md` - Task management
- `@specs/ui/components.md` - Component library

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Shortcut Usage Rate | >50% of users use shortcuts weekly | Analytics tracking |
| Help Modal Opens | >30% of users view help modal | Interaction analytics |
| Customization Adoption | >10% customize shortcuts | Settings analytics |
| Task Completion Speed | 20% faster for keyboard users | User testing |
| Shortcut Discovery | >60% learn 5+ shortcuts in first week | Onboarding analytics |

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Shortcut conflicts with browser | Warn user, suggest alternative |
| Non-Latin keyboard layouts | Support key codes, not just characters |
| Virtual keyboard on mobile | Disable conflicting shortcuts |
| Screen reader interference | Announce shortcuts, don't block |
| Rapid G-key presses | Reset timer, show visual feedback |
| Shortcut during async operation | Queue action or show loading |
| Multiple tabs open | Shortcuts apply to active tab only |
| PWA installed | Shortcuts work, don't conflict with OS |

---

*This specification follows the principles of the Phase 2 Constitution. Implementation must align with documented requirements, technology stack, and UX standards.*
