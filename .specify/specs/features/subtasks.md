# Feature: Subtasks

**Feature ID:** PF-04 (Detail)
**Status:** `draft`
**Constitution Principles:**
- Principle 1: Spec-Driven Development
- Principle 3: JWT Authentication & User Isolation
- Principle 4: Neon Serverless PostgreSQL Data Layer
- Principle 5: Premium SaaS UX Standards

---

## Overview

Subtasks enable users to break complex tasks into smaller, manageable steps. This specification provides a deep dive into subtask functionality including nested subtask creation, completion tracking with parent progress indicators, optional auto-complete behavior, reordering capabilities, and dedicated UI patterns.

The implementation must deliver a seamless, intuitive experience where subtasks feel like a natural extension of task management, with smooth animations and clear visual hierarchy that rivals Todoist and TickTick subtask implementations.

---

## User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-ST-01 | As a user, I can add unlimited subtasks to any task so that I can break complex work into manageable steps | Must Have |
| US-ST-02 | As a user, I can toggle subtask completion independently so that I can track progress on individual steps | Must Have |
| US-ST-03 | As a user, I can see parent task progress (e.g., "3/5 subtasks") so that I understand overall completion status | Must Have |
| US-ST-04 | As a user, I can optionally auto-complete the parent task when all subtasks are done so that I save time | Should Have |
| US-ST-05 | As a user, I can reorder subtasks via drag-and-drop so that I can prioritize steps logically | Should Have |
| US-ST-06 | As a user, I can edit subtask titles inline so that I can refine step descriptions | Must Have |
| US-ST-07 | As a user, I can delete subtasks individually so that I can remove unnecessary steps | Must Have |
| US-ST-08 | As a user, I can collapse/expand subtask lists so that I can reduce visual clutter | Should Have |
| US-ST-09 | As a user, I can add subtasks using keyboard shortcuts so that I can work efficiently | Should Have |
| US-ST-10 | As a user, I can see completed subtasks visually distinguished so that I can track what's done | Must Have |

---

## Acceptance Criteria

### Subtask Creation (US-ST-01)

- [ ] Add subtask via "+" button in subtask list section
- [ ] Add subtask via keyboard shortcut (Tab or Enter when subtask list focused)
- [ ] Subtask title input appears inline within parent task view
- [ ] Subtask title is required (1-200 characters)
- [ ] Empty title shows validation error: "Subtask title is required"
- [ ] Title exceeding 200 characters shows character count warning
- [ ] New subtask appears immediately at bottom of list (optimistic update)
- [ ] Input field clears after successful creation, remains focused for next entry
- [ ] Escape key cancels subtask creation
- [ ] Maximum 100 subtasks per task (soft limit with warning at 50)

### Subtask Completion Toggle (US-ST-02)

- [ ] Checkbox toggle for each subtask
- [ ] Single click/tap toggles completion state
- [ ] Completion triggers checkmark animation
- [ ] Completed subtask title shows strikethrough
- [ ] Completed subtask moves to bottom of list (optional setting)
- [ ] Keyboard shortcut (Space) toggles when subtask focused
- [ ] Completion state syncs across devices
- [ ] Failed toggle reverts with error notification

### Parent Progress Indicator (US-ST-03)

- [ ] Parent task displays subtask count: "X/Y subtasks"
- [ ] Progress bar shows visual completion percentage
- [ ] Progress bar fills with smooth animation on subtask change
- [ ] Progress percentage shown on hover: "60% complete"
- [ ] Task list view shows mini progress indicator on task cards
- [ ] Completed all subtasks shows "All subtasks complete" with checkmark
- [ ] No subtasks shows "No subtasks" with add prompt
- [ ] Progress indicator color changes: red (<50%), yellow (50-99%), green (100%)

### Auto-Complete Parent Setting (US-ST-04)

- [ ] Setting available in user preferences: "Auto-complete parent when all subtasks done"
- [ ] Default: OFF (parent remains open for additional subtasks)
- [ ] When ON: completing last subtask triggers parent completion
- [ ] Parent completion triggers standard celebration animation
- [ ] Confirmation toast: "Task completed! All subtasks done" with Undo option
- [ ] Setting persists across sessions (localStorage + user profile)
- [ ] Per-task override: toggle available in task detail view

### Subtask Reordering (US-ST-05)

- [ ] Drag handle visible on hover for each subtask
- [ ] Drag-and-drop reordering within same parent task
- [ ] Visual indicator shows drop position (line highlight)
- [ ] Smooth animation as subtask moves to new position
- [ ] Position updates via API on drop
- [ ] Optimistic UI update reflects new order immediately
- [ ] Failed reorder reverts with error toast
- [ ] Touch devices: long-press to initiate drag
- [ ] Keyboard alternative: Arrow keys to move focused subtask up/down

### Subtask Editing (US-ST-06)

- [ ] Double-click or edit icon initiates inline edit
- [ ] Edit input pre-filled with current title
- [ ] Changes save on blur or Enter key
- [ ] Escape cancels edit, reverts to original
- [ ] Validation applies: 1-200 characters required
- [ ] Empty title shows error, prevents save
- [ ] Updated timestamp refreshes on modification
- [ ] Character count shown while editing (x/200)

### Subtask Deletion (US-ST-07)

- [ ] Delete icon/button visible on hover
- [ ] Delete requires confirmation for subtasks with content
- [ ] Confirmation via modal or inline: "Delete this subtask?"
- [ ] Deleted subtask removed immediately (optimistic update)
- [ ] Failed deletion restores subtask with error
- [ ] Keyboard shortcut: Delete/Backspace when subtask focused
- [ ] Undo option available for 5 seconds after deletion

### Collapse/Expand Subtask List (US-ST-08)

- [ ] Collapse/expand toggle in subtask section header
- [ ] Collapsed state shows subtask count: "5 subtasks"
- [ ] Collapsed state shows mini progress bar
- [ ] Expanded state shows full subtask list
- [ ] State persists per task (localStorage)
- [ ] Smooth animation on expand/collapse
- [ ] Keyboard shortcut: Arrow keys to toggle when parent focused

### Keyboard Shortcuts (US-ST-09)

- [ ] Tab: Add new subtask when subtask list focused
- [ ] Enter: Complete focused subtask
- [ ] Space: Toggle completion for focused subtask
- [ ] Delete/Backspace: Delete focused subtask
- [ ] E: Edit focused subtask
- [ ] Up/Down arrows: Navigate between subtasks
- [ ] Alt+Up/Down: Move focused subtask up/down (reorder)
- [ ] Escape: Cancel edit or close subtask input

### Completed Subtask Styling (US-ST-10)

- [ ] Completed subtasks show 50% opacity
- [ ] Title displays strikethrough text decoration
- [ ] Checkbox shows filled/checked state
- [ ] Completed section visually separated from active subtasks
- [ ] Option to hide completed subtasks (toggle in header)
- [ ] "X completed" summary when some are complete
- [ ] Completed subtasks sorted to bottom (optional setting)

---

## Technical Requirements

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/tasks/:id/subtasks` | Yes | Add subtask to task |
| GET | `/api/tasks/:id/subtasks` | Yes | Get all subtasks for task |
| PATCH | `/api/tasks/:id/subtasks/:subtaskId` | Yes | Toggle subtask completion |
| PUT | `/api/tasks/:id/subtasks/:subtaskId` | Yes | Update subtask title/position |
| DELETE | `/api/tasks/:id/subtasks/:subtaskId` | Yes | Delete subtask |
| PATCH | `/api/tasks/:id/subtasks/reorder` | Yes | Reorder multiple subtasks |

### Request/Response Schemas

#### POST /api/tasks/:id/subtasks

**Request Body:**
```json
{
  "title": "Research competitors",
  "position": 0
}
```

**Success Response (201):**
```json
{
  "id": "uuid",
  "task_id": "uuid",
  "title": "Research competitors",
  "completed": false,
  "position": 0,
  "created_at": "2026-02-17T10:30:00Z",
  "updated_at": "2026-02-17T10:30:00Z"
}
```

#### PATCH /api/tasks/:id/subtasks/:subtaskId

**Success Response (200):**
```json
{
  "id": "uuid",
  "task_id": "uuid",
  "title": "Research competitors",
  "completed": true,
  "position": 0,
  "completed_at": "2026-02-17T10:35:00Z",
  "created_at": "2026-02-17T10:30:00Z",
  "updated_at": "2026-02-17T10:35:00Z"
}
```

#### PATCH /api/tasks/:id/subtasks/reorder

**Request Body:**
```json
{
  "subtasks": [
    { "id": "uuid-1", "position": 0 },
    { "id": "uuid-2", "position": 1 },
    { "id": "uuid-3", "position": 2 }
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "updated_count": 3
}
```

### Database Models

#### Subtask Table Schema

```sql
CREATE TABLE subtasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);
CREATE INDEX idx_subtasks_task_position ON subtasks(task_id, position);
CREATE INDEX idx_subtasks_task_completed ON subtasks(task_id, completed);
```

### Validation Rules

| Field | Type | Constraints | Error Message |
|-------|------|-------------|---------------|
| `subtask.title` | string | Required, 1-200 chars, trimmed | "Subtask title is required (1-200 characters)" |
| `subtask.position` | integer | >= 0 | "Position must be non-negative" |
| `subtask.task_id` | UUID | Required, must exist | "Parent task not found" |

### Progress Calculation Logic

```python
def calculate_subtask_progress(task_id: UUID) -> dict:
    """Calculate subtask progress for a parent task."""
    total = count("SELECT id FROM subtasks WHERE task_id = :tid")
    completed = count("SELECT id FROM subtasks WHERE task_id = :tid AND completed = true")
    
    return {
        "total": total,
        "completed": completed,
        "percentage": round((completed / total * 100) if total > 0 else 0, 1),
        "all_complete": completed == total and total > 0
    }

def check_auto_complete_parent(task_id: UUID, user_id: UUID) -> bool:
    """Check if parent should auto-complete based on user setting."""
    user_setting = get_user_setting(user_id, "auto_complete_parent")
    if not user_setting:
        return False
    
    progress = calculate_subtask_progress(task_id)
    if progress["all_complete"]:
        # Update parent task
        update_task(task_id, {"completed": True, "completed_at": now()})
        return True
    return False
```

### Authentication & Authorization

- All endpoints require valid JWT token
- Subtask ownership verified via parent task ownership
- 403 Forbidden when accessing another user's task subtasks
- 404 Not Found when task or subtask doesn't exist

---

## UX Requirements

### Subtask List Component

```
┌─────────────────────────────────────────┐
│  Subtasks                    [+] Add    │
├─────────────────────────────────────────┤
│  ☐ Research competitors                 │
│  ☐ Analyze feature set                 │
│  ☑ Define requirements         ← done  │
│  ☐ Create mockups                       │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━  25%      │
│  1/4 subtasks complete                  │
└─────────────────────────────────────────┘
```

### Subtask Item Design

- **Checkbox**: Left-aligned, 20x20px touch target
- **Title**: Inline text, editable on double-click
- **Hover State**: Subtle background highlight, action buttons appear
- **Completed State**: 50% opacity, strikethrough title, muted colors
- **Drag Handle**: Visible on hover, 6-dot grip icon
- **Actions**: Edit (pencil), Delete (trash) - appear on hover

### Progress Bar Design

```
Active Subtasks:
┌─────────────────────────────────────────┐
│  ████████░░░░░░░░░░░░░░░░  33%         │
│  2/6 subtasks                          │
└─────────────────────────────────────────┘

Completed:
┌─────────────────────────────────────────┐
│  ████████████████████████  100% ✓      │
│  All subtasks complete!                 │
└─────────────────────────────────────────┘
```

- **Height**: 8px for full bar, 4px for mini indicator
- **Colors**: Red (#EF4444) <50%, Yellow (#EAB308) 50-99%, Green (#22C55E) 100%
- **Animation**: Smooth fill transition (300ms ease-out)
- **Border Radius**: 4px rounded ends

### Inline Input Pattern

```
Before:
┌─────────────────────────────────────────┐
│  ☐ Subtask title                        │
└─────────────────────────────────────────┘

During Edit:
┌─────────────────────────────────────────┐
│  ┌─────────────────────────────────┐   │
│  │ Subtask title              [💾] │   │
│  └─────────────────────────────────┘   │
│                              15/200    │
└─────────────────────────────────────────┘

Adding New:
┌─────────────────────────────────────────┐
│  [+] ┌─────────────────────────────┐   │
│      │ New subtask...          ✓ ✗ │   │
│      └─────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Drag-and-Drop UX

- **Drag Preview**: Subtask card follows cursor with elevation shadow
- **Drop Indicator**: Horizontal line showing insertion point
- **Reorder Animation**: Smooth slide as other subtasks make room
- **Touch**: Long-press (500ms) initiates drag, haptic feedback

### Empty States

- **No Subtasks**:
  ```
  ┌─────────────────────────────────────────┐
  │                                         │
  │     📝 No subtasks yet                  │
  │     Break this task into smaller steps  │
  │                                         │
  │     [+ Add your first subtask]          │
  │                                         │
  └─────────────────────────────────────────┘
  ```

- **All Complete**:
  ```
  ┌─────────────────────────────────────────┐
  │  ✓ All subtasks complete!               │
  │                                         │
  │  [+ Add more subtasks]                  │
  └─────────────────────────────────────────┘
  ```

### Collapsed State

```
┌─────────────────────────────────────────┐
│  ▼ 5 subtasks  ████████░░░░░░  40%     │
└─────────────────────────────────────────┘
```

### Animations (Framer Motion)

```typescript
// Subtask enter (creation)
const subtaskEnter = {
  initial: { opacity: 0, height: 0, y: -10 },
  animate: { opacity: 1, height: "auto", y: 0 },
  exit: { opacity: 0, height: 0, y: -10 },
  transition: { duration: 0.2, ease: "easeOut" },
};

// Checkbox toggle
const checkboxToggle = {
  unchecked: { scale: 1 },
  checked: { scale: [1, 1.2, 1], transition: { duration: 0.2 } },
};

// Progress bar fill
const progressFill = {
  initial: { width: "0%" },
  animate: { width: `${percentage}%` },
  transition: { duration: 0.3, ease: "easeOut" },
};

// Drag animation
const dragAnimation = {
  drag: { scale: 1.02, zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
  drop: { scale: 1, zIndex: 1, boxShadow: "none" },
};
```

### Keyboard Navigation

| Key | Action | Context |
|-----|--------|---------|
| `Tab` | Add new subtask | Subtask list focused |
| `Enter` | Complete focused subtask | Subtask focused |
| `Space` | Toggle completion | Subtask focused |
| `E` | Edit subtask | Subtask focused |
| `Delete` | Delete subtask | Subtask focused |
| `Up/Down` | Navigate subtasks | Subtask list focused |
| `Alt+Up/Down` | Reorder subtask | Subtask focused |
| `Escape` | Cancel edit/input | Editing or adding |

### Accessibility

- All checkboxes have associated labels
- Progress bar has `role="progressbar"` with aria-valuenow/aria-valuemin/aria-valuemax
- Screen reader announcements for subtask add/complete/delete
- Keyboard focus visible on all interactive elements
- Drag-and-drop has keyboard alternative (reorder buttons)
- Color contrast meets WCAG 2.1 AA

### Responsive Behavior

- **Desktop**: Full subtask list with hover actions
- **Tablet**: Compact layout, actions in overflow menu
- **Mobile**: Swipe actions for complete/delete, tap to edit

---

## Dependencies

| Feature | Dependency Type | Description |
|---------|-----------------|-------------|
| `task-management.md` | Required | Parent task management |
| `auth-jwt.md` | Required | JWT authentication |
| `completion-celebrations.md` | Optional | Celebration on all subtasks complete |

---

## Related Specifications

- `@specs/overview.md` - Project overview with API endpoint definitions
- `@specs/features/task-management.md` - Task management core features
- `@specs/features/auth-jwt.md` - JWT authentication requirements
- `@specs/features/completion-celebrations.md` - Celebration animations
- `@specs/database/schema.md` - Database schema definitions

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Subtask Creation Rate | >40% of tasks have subtasks | Analytics tracking |
| Subtask Completion Rate | >70% of subtasks completed | Completion analytics |
| Reorder Usage | >15% of users reorder subtasks | Interaction analytics |
| Auto-Complete Adoption | >25% enable auto-complete setting | Setting analytics |
| Subtask Load Time | <100ms | Time to render subtask list |

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Creating subtask while offline | Queue for sync, optimistic UI, sync on reconnect |
| Parent task deleted | All subtasks cascade deleted |
| Concurrent subtask updates | Last-write-wins, show conflict notification |
| Very long subtask titles | Truncate display with ellipsis, full title on hover |
| 100+ subtasks in a task | Virtual scrolling, show "Show more" pagination |
| Rapid completion toggling | Debounce API calls, queue state changes |
| Reorder during network failure | Revert to original order, show error with retry |
| Auto-complete triggers unexpectedly | Show undo toast, allow reversal |
| Timezone affecting completion date | Store UTC, display in user's timezone |

---

*This specification follows the principles of the Phase 2 Constitution. Implementation must align with documented requirements, technology stack, and UX standards.*
