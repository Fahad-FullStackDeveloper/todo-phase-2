# Feature: Completion Celebrations

**Feature ID:** PF-18
**Status:** `draft`
**Constitution Principles:**
- Principle 1: Spec-Driven Development
- Principle 3: JWT Authentication & User Isolation
- Principle 5: Premium SaaS UX Standards

---

## Overview

Completion Celebrations provide delightful micro-interactions and reward moments when users complete tasks and reach milestones. This specification covers confetti animations on task completion, streak milestone celebrations, progress bar animations, optional sound effects, achievement badges foundation, and celebration frequency capping to avoid overuse.

The implementation must deliver satisfying, meaningful celebrations that create positive reinforcement without becoming annoying—striking the same balance as Duolingo, Todoist, and Habitica.

---

## User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-CC-01 | As a user, I see a confetti animation when I complete a task so that I feel a sense of accomplishment | Must Have |
| US-CC-02 | As a user, I see celebrations for streak milestones so that I'm motivated to maintain consistency | Must Have |
| US-CC-03 | As a user, progress bars fill with satisfying animation so that completion feels tangible | Must Have |
| US-CC-04 | As a user, I can enable optional sound effects so that completion is more satisfying | Should Have |
| US-CC-05 | As a user, I can earn achievement badges so that I have long-term goals | Could Have |
| US-CC-06 | As a user, celebrations don't become annoying over time so that they remain meaningful | Must Have |
| US-CC-07 | As a user, I can customize celebration intensity so that it matches my preferences | Should Have |
| US-CC-08 | As a user, I see different celebrations for different achievement levels so that big wins feel bigger | Should Have |
| US-CC-09 | As a user, celebrations work offline so that I get feedback even without internet | Should Have |
| US-CC-10 | As a user, I can disable celebrations if I find them distracting so that I can work quietly | Must Have |

---

## Acceptance Criteria

### Confetti Animation (US-CC-01)

- [ ] Confetti triggers on task completion
- [ ] Confetti originates from completion point (checkbox/button)
- [ ] Confetti particles: 20-50 pieces
- [ ] Confetti colors: Match task priority or random festive colors
- [ ] Animation duration: 1-2 seconds
- [ ] Confetti falls with gravity simulation
- [ ] Confetti fades out at end of animation
- [ ] Performance: 60fps animation, no jank
- [ ] Respects `prefers-reduced-motion`: subtle fade instead

### Streak Milestone Celebrations (US-CC-02)

- [ ] Streak milestones: 3, 7, 14, 30, 60, 90, 100, 365 days
- [ ] Milestone celebration shows when completing task on milestone day
- [ ] Celebration includes: animation, message, milestone badge preview
- [ ] Messages vary by milestone:
  - 3 days: "Getting started! 🔥"
  - 7 days: "One week streak! 🔥🔥"
  - 14 days: "Two weeks strong! 🔥🔥🔥"
  - 30 days: "Monthly master! 🏆"
  - 60 days: "Two month titan! 🏆🏆"
  - 90 days: "Quarterly queen/king! 👑"
  - 100 days: "Century club! 💯"
  - 365 days: "Year of productivity! 🎉"
- [ ] Milestone celebration more elaborate than regular completion
- [ ] Milestone can be shared (copy text, social share - stretch goal)

### Progress Bar Animation (US-CC-03)

- [ ] Progress bar fills with smooth animation
- [ ] Animation duration: 300-500ms
- [ ] Easing: ease-out for satisfying deceleration
- [ ] Color transition as progress increases
- [ ] Percentage count-up animation (0% → 75%)
- [ ] Subtask progress bar animates on each subtask completion
- [ ] Project completion bar animates on task completion
- [ ] Bar "glows" or pulses briefly at 100%

### Sound Effects (US-CC-04)

- [ ] Sound effects disabled by default
- [ ] Setting to enable sounds: "Play sound effects on completion"
- [ ] Sound plays on task completion
- [ ] Sound plays on milestone achievement
- [ ] Volume control in settings
- [ ] Different sounds for different milestone levels
- [ ] Sounds respect system mute
- [ ] Sounds don't play during quiet hours (10pm-7am, configurable)

### Achievement Badges Foundation (US-CC-05)

- [ ] Database schema supports achievements
- [ ] Achievement types defined:
  - First Task: Complete first task
  - Week Warrior: 7-day streak
  - Month Master: 30-day streak
  - Century Club: 100 tasks completed
  - Early Bird: Complete 5 tasks before 9am
  - Night Owl: Complete 5 tasks after 9pm
  - Weekender: Complete tasks on weekend
  - Focus Fiend: 10 pomodoro sessions
- [ ] Badge icons designed for each achievement
- [ ] Badge display in profile (stub UI with "Coming Soon")
- [ ] API endpoints prepared for achievement tracking

### Frequency Capping (US-CC-06)

- [ ] Full confetti only on first 5 completions per session
- [ ] After cap: subtle checkmark animation only
- [ ] Cap resets after 1 hour break
- [ ] Milestone celebrations never capped
- [ ] First completion of day always celebrates
- [ ] User can manually trigger celebration replay
- [ ] Celebrations don't stack (queue if completing rapidly)

### Customization Settings (US-CC-07)

- [ ] Settings panel for celebrations:
  - Celebration intensity: Full, Reduced, Minimal, Off
  - Sound effects: On/Off
  - Sound volume: Slider
  - Quiet hours: Start/End time
  - Confetti colors: Colorful, Monochrome, Task priority
- [ ] Settings persist in user profile
- [ ] Settings sync across devices

### Tiered Celebrations (US-CC-08)

- [ ] Regular task: Standard confetti
- [ ] High/Urgent priority task: Enhanced confetti (more particles)
- [ ] Task with subtasks: Extra celebration when all subtasks done
- [ ] Overdue task: Special "finally done" celebration
- [ ] Project completion: Full celebration (confetti + message + sound)
- [ ] Streak milestone: Unique animation per milestone tier

### Offline Support (US-CC-09)

- [ ] Celebrations trigger when offline
- [ ] Animations work without network
- [ ] Sounds play from cached assets
- [ ] Milestone tracking works offline
- [ ] Sync celebration data when reconnected

### Disable Option (US-CC-10)

- [ ] Setting to disable all celebrations
- [ ] "Reduce animations" option for sensitive users
- [ ] Quick toggle in settings
- [ ] Disabled state persists
- [ ] Even when disabled: subtle visual feedback remains (checkmark fill)

---

## Technical Requirements

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/achievements` | Yes | Get user's achievements |
| POST | `/api/users/achievements/check` | Yes | Check for new achievements |
| GET | `/api/users/streak` | Yes | Get streak information |
| POST | `/api/tasks/:id/complete` | Yes | Complete task (triggers celebration) |

### Request/Response Schemas

#### GET /api/users/achievements

**Response (200):**
```json
{
  "achievements": [
    {
      "id": "first-task",
      "name": "First Steps",
      "description": "Complete your first task",
      "icon": "🌟",
      "unlocked": true,
      "unlockedAt": "2026-02-17T10:30:00Z"
    },
    {
      "id": "week-warrior",
      "name": "Week Warrior",
      "description": "Maintain a 7-day streak",
      "icon": "🔥",
      "unlocked": true,
      "unlockedAt": "2026-02-24T10:30:00Z"
    },
    {
      "id": "month-master",
      "name": "Month Master",
      "description": "Maintain a 30-day streak",
      "icon": "🏆",
      "unlocked": false,
      "progress": 17,
      "target": 30
    }
  ],
  "stats": {
    "totalUnlocked": 5,
    "totalAchievements": 15,
    "completionRate": 33.3
  }
}
```

### Database Models

#### Achievements Table

```sql
CREATE TABLE achievements (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10),
    category VARCHAR(50) NOT NULL,
    -- Categories: streak, completion, special, time, focus
    target_value INTEGER,
    target_type VARCHAR(20) NOT NULL,
    -- Types: count, streak, duration
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(50) NOT NULL REFERENCES achievements(id),
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    progress INTEGER NOT NULL DEFAULT 0,
    UNIQUE (user_id, achievement_id)
);

-- Indexes
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_unlocked ON user_achievements(unlocked_at);
```

#### Celebration Preferences Table

```sql
-- Add to user_preferences or separate table
CREATE TABLE user_celebration_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    celebration_intensity VARCHAR(20) NOT NULL DEFAULT 'full'
        CHECK (intensity IN ('full', 'reduced', 'minimal', 'off')),
    sound_enabled BOOLEAN NOT NULL DEFAULT false,
    sound_volume INTEGER NOT NULL DEFAULT 50,
    quiet_hours_start TIME NOT NULL DEFAULT '22:00',
    quiet_hours_end TIME NOT NULL DEFAULT '07:00',
    confetti_style VARCHAR(20) NOT NULL DEFAULT 'colorful'
        CHECK (style IN ('colorful', 'monochrome', 'priority')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Confetti Animation Implementation

```typescript
// Confetti component using Framer Motion or canvas
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

export function Confetti({ 
  origin, 
  colors, 
  particleCount = 30,
  duration = 2000 
}: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Initialize particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: origin.x,
        y: origin.y,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * -10 - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }
    setParticles(newParticles);

    // Animate with requestAnimationFrame
    const animate = () => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.5, // Gravity
        rotation: p.rotation + p.rotationSpeed,
      })));
    };

    const frameId = requestAnimationFrame(animate);
    const timeoutId = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
    };
  }, [origin, colors, particleCount, duration]);

  return (
    <div className="confetti-container">
      {particles.map((p, i) => (
        <div
          key={i}
          className="confetti-particle"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
```

### Celebration Logic

```typescript
// useCelebration.ts
import { useState, useCallback } from 'react';

interface CelebrationConfig {
  intensity: 'full' | 'reduced' | 'minimal' | 'off';
  soundEnabled: boolean;
  sessionCompletions: number;
  lastCompletionTime: Date | null;
}

export function useCelebration(config: CelebrationConfig) {
  const [isCelebrating, setIsCelebrating] = useState(false);

  const shouldCelebrate = useCallback((task: Task, isMilestone: boolean): boolean => {
    if (config.intensity === 'off') return false;
    if (isMilestone) return true; // Milestones always celebrate
    
    // First completion of day
    if (!config.lastCompletionTime || 
        isDifferentDay(config.lastCompletionTime, new Date())) {
      return true;
    }
    
    // Within cap
    if (config.sessionCompletions < 5) {
      return true;
    }
    
    // Cap exceeded - reduced celebration
    return config.intensity !== 'minimal';
  }, [config]);

  const getCelebrationType = useCallback((task: Task, isMilestone: boolean): CelebrationType => {
    if (isMilestone) return 'milestone';
    if (task.priority === 'urgent') return 'enhanced';
    if (task.isOverdue) return 'relief';
    if (config.sessionCompletions >= 5) return 'subtle';
    return 'standard';
  }, [config]);

  const triggerCelebration = useCallback((task: Task, isMilestone: boolean) => {
    if (!shouldCelebrate(task, isMilestone)) return;
    
    const type = getCelebrationType(task, isMilestone);
    setIsCelebrating(true);
    
    // Play sound if enabled
    if (config.soundEnabled && !isQuietHours()) {
      playCelebrationSound(type);
    }
    
    // Reset after animation
    setTimeout(() => {
      setIsCelebrating(false);
    }, getAnimationDuration(type));
  }, [shouldCelebrate, getCelebrationType, config]);

  return {
    isCelebrating,
    triggerCelebration,
    shouldCelebrate,
  };
}
```

### Milestone Detection

```typescript
function checkStreakMilestone(currentStreak: number, previousStreak: number): number | null {
  const milestones = [3, 7, 14, 30, 60, 90, 100, 365];
  
  // Check if we just hit a milestone
  for (const milestone of milestones) {
    if (previousStreak < milestone && currentStreak >= milestone) {
      return milestone;
    }
  }
  
  return null;
}

function getMilestoneMessage(milestone: number): string {
  const messages: Record<number, string> = {
    3: "Getting started! 🔥",
    7: "One week streak! 🔥🔥",
    14: "Two weeks strong! 🔥🔥🔥",
    30: "Monthly master! 🏆",
    60: "Two month titan! 🏆🏆",
    90: "Quarterly champion! 👑",
    100: "Century club! 💯",
    365: "Year of productivity! 🎉",
  };
  
  return messages[milestone] || `Milestone reached!`;
}
```

---

## UX Requirements

### Confetti Animation

```
Task Completion:
┌─────────────────────────────────────────┐
│                                         │
│     ☑ Task completed!                   │
│         *confetti bursts from checkbox* │
│                                         │
│    ✨ 🎊 ✨ 🎉 ✨ 🎊 ✨ 🎉              │
│      ✨ 🎊 ✨ 🎉 ✨ 🎊 ✨               │
│        ✨ 🎊 ✨ 🎉 ✨                    │
│                                         │
└─────────────────────────────────────────┘

Particle colors:
- Standard: Blue, Green, Yellow, Purple, Pink
- Priority-based: Match task priority color
- Monochrome: Gray/silver tones
```

### Milestone Celebration Modal

```
┌─────────────────────────────────────────┐
│                                         │
│              🏆 🏆 🏆                    │
│                                         │
│         Month Master!                   │
│                                         │
│    You've maintained a 30-day streak!   │
│                                         │
│    That's 30 days of productivity!      │
│    Keep up the amazing work!            │
│                                         │
│         [Continue] [Share]              │
│                                         │
└─────────────────────────────────────────┘

With animated trophy and confetti background
```

### Progress Bar States

```
Animating:
Before: ████████░░░░░░░░░░ 50%
After:  ██████████████░░░░ 70%
        *smooth fill animation*

Complete:
████████████████████████ 100% ✓
*pulse glow effect*
```

### Settings Panel

```
┌─────────────────────────────────────────┐
│  Celebrations & Rewards             [X] │
├─────────────────────────────────────────┤
│                                         │
│  Celebration Intensity                  │
│  ○ Full - All animations and effects    │
│  ● Reduced - Subtle animations          │
│  ○ Minimal - Just essential feedback    │
│  ○ Off - Disable celebrations           │
│                                         │
│  Sound Effects                          │
│  ☐ Play sounds on completion            │
│  Volume: [██████░░░░] 60%               │
│                                         │
│  Quiet Hours                            │
│  From: [10:00 PM ▼]  To: [7:00 AM ▼]   │
│                                         │
│  Confetti Style                         │
│  ○ Colorful - Multi-colored particles   │
│  ○ Monochrome - Elegant gray tones      │
│  ○ Priority-based - Match task color    │
│                                         │
│  [Preview]  [Reset]  [Save]             │
└─────────────────────────────────────────┘
```

### Achievement Badge Display

```
┌─────────────────────────────────────────┐
│  Achievements (5/15)                    │
├─────────────────────────────────────────┤
│  🌟 🏆 🔥 ⭐ 🎯  🔒 🔒 🔒 🔒 🔒        │
│                                         │
│  Recent:                                │
│  🏆 Month Master                        │
│     30-day streak                       │
│     17 Feb 2026                        │
│                                         │
│  In Progress:                           │
│  👑 Quarterly Champion    ████████░░    │
│     60/90 days                          │
│                                         │
│  [View All Achievements]                │
└─────────────────────────────────────────┘
```

### Animations (Framer Motion)

```typescript
// Confetti burst
const confettiBurst = {
  initial: { scale: 0, opacity: 1 },
  animate: { 
    scale: [0, 1.5, 1],
    opacity: [1, 1, 0],
  },
  transition: { duration: 1.5 },
};

// Checkmark fill
const checkmarkFill = {
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: 0.3, ease: "easeInOut" },
};

// Progress bar fill
const progressFill = {
  initial: { width: "0%" },
  animate: { width: `${percentage}%` },
  transition: { duration: 0.4, ease: "easeOut" },
};

// Milestone modal pop
const milestonePop = {
  initial: { scale: 0.5, opacity: 0, rotate: -10 },
  animate: { 
    scale: 1, 
    opacity: 1, 
    rotate: 0,
  },
  transition: { 
    type: "spring", 
    stiffness: 200, 
    damping: 15,
  },
};

// Trophy bounce
const trophyBounce = {
  y: [0, -10, 0],
  rotate: [0, -5, 5, 0],
  transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 },
};
```

### Sound Effects

```
Sound files needed:
- completion-standard.mp3 (subtle chime)
- completion-enhanced.mp3 (brighter chime)
- milestone.mp3 (fanfare)
- achievement.mp3 (triumph sound)

Audio specs:
- Duration: 0.5-2 seconds
- Format: MP3 and OGG for compatibility
- Volume: Normalized to -6dB
- Loop: No
```

### Accessibility

- Celebrations don't interfere with screen readers
- Reduced motion option for sensitive users
- Visual feedback always present (not just sound)
- Animations respect `prefers-reduced-motion`
- Sound can be disabled independently

### Responsive Behavior

- **Desktop**: Full celebration effects
- **Tablet**: Slightly reduced particle count
- **Mobile**: Optimized for performance, fewer particles

---

## Dependencies

| Feature | Dependency Type | Description |
|---------|-----------------|-------------|
| `task-management.md` | Required | Task completion trigger |
| `subtasks.md` | Consumer | Subtask completion celebration |
| `analytics.md` | Consumer | Streak tracking |
| `focus-mode.md` | Consumer | Focus session celebration |

---

## Related Specifications

- `@specs/overview.md` - Project overview
- `@specs/features/task-management.md` - Task management
- `@specs/features/subtasks.md` - Subtasks
- `@specs/features/analytics.md` - Analytics dashboard
- `@specs/features/focus-mode.md` - Focus mode

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Celebration Engagement | >80% users keep celebrations enabled | Settings analytics |
| Sound Adoption | >30% enable sound effects | Settings analytics |
| Streak Improvement | Users with celebrations have 20% longer streaks | Cohort analysis |
| Animation Performance | 60fps on all devices | Performance monitoring |
| User Satisfaction | >4/5 rating for celebration feature | User surveys |

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Rapid task completion | Queue celebrations, don't stack |
| Completing 100 tasks at once | Cap at 5 full celebrations, rest subtle |
| Sound during meeting | Respect quiet hours, system mute |
| Low battery device | Reduce particle count automatically |
| Animation causes nausea | Respect prefers-reduced-motion |
| Offline milestone detection | Track locally, sync when online |
| Timezone affecting streak | Use user's timezone for day boundary |
| Celebration during focus mode | Subtle celebration only |

---

*This specification follows the principles of the Phase 2 Constitution. Implementation must align with documented requirements, technology stack, and UX standards.*
