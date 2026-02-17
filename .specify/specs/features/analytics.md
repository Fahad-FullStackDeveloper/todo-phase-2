# Feature: Analytics Dashboard

**Feature ID:** PF-10, PF-11  
**Status:** `draft`  
**Constitution Principles:**
- Principle 1: Spec-Driven Development
- Principle 3: JWT Authentication & User Isolation
- Principle 4: Neon Serverless PostgreSQL Data Layer
- Principle 5: Premium SaaS UX Standards

---

## Overview

The Analytics Dashboard provides users with actionable insights into their productivity patterns, task completion trends, and focus session statistics. This feature transforms raw task and pomodoro data into meaningful visualizations that motivate users and help them understand their work habits.

The dashboard includes overview statistics, completion metrics, streak tracking, task distribution analysis, and pomodoro timer statistics—all presented with premium visualizations and smooth animations.

---

## User Stories

### Dashboard Statistics

| ID | Story | Priority |
|----|-------|----------|
| US-AN-01 | As a user, I can view my total task count so that I understand my overall workload | Must Have |
| US-AN-02 | As a user, I can see how many tasks I completed today so that I feel a sense of accomplishment | Must Have |
| US-AN-03 | As a user, I can view my completion rate percentage so that I can track my productivity | Must Have |
| US-AN-04 | As a user, I can see my current streak so that I am motivated to maintain consistency | Must Have |
| US-AN-05 | As a user, I can view my longest streak record so that I am inspired to beat it | Should Have |
| US-AN-06 | As a user, I can see tasks distribution by priority so that I understand my workload balance | Should Have |
| US-AN-07 | As a user, I can see tasks distribution by project so that I understand where I spend my time | Should Have |
| US-AN-08 | As a user, I can view a weekly activity graph so that I can see my productivity trends | Must Have |

### Pomodoro Statistics

| ID | Story | Priority |
|----|-------|----------|
| US-AN-09 | As a user, I can view my total pomodoro sessions so that I track my focus time | Should Have |
| US-AN-10 | As a user, I can see my total focus minutes so that I understand my time investment | Should Have |
| US-AN-11 | As a user, I can view my average session length so that I can optimize my focus sessions | Could Have |
| US-AN-12 | As a user, I can see daily/weekly pomodoro trends so that I can identify my productive times | Could Have |

---

## Acceptance Criteria

### Total Tasks Count (US-AN-01)

- [ ] Display total number of tasks created by user (all time)
- [ ] Count includes all tasks regardless of completion status
- [ ] Count updates in real-time when tasks are created/deleted
- [ ] Display format: number with abbreviation for large counts (1.2K, 1.5M)
- [ ] Comparison indicator showing change from previous period (optional)
- [ ] Click on stat drills down to task list filtered to all tasks

### Completed Today Count (US-AN-02)

- [ ] Display count of tasks completed on current day (midnight to midnight, user's timezone)
- [ ] Count resets at midnight
- [ ] Display format: number
- [ ] Visual indicator (icon, color) distinguishing from total count
- [ ] Comparison to daily average (optional, stretch goal)
- [ ] Click drills down to tasks completed today

### Completion Rate (US-AN-03)

- [ ] Calculate: (completed tasks / total tasks) * 100
- [ ] Time period selector: All time, Last 7 days, Last 30 days, This month
- [ ] Default period: All time
- [ ] Display as percentage with one decimal place (e.g., "73.5%")
- [ ] Visual progress bar or circular indicator
- [ ] Color coding: >80% green, 50-80% yellow, <50% red
- [ ] Trend indicator showing change from previous period

### Current Streak (US-AN-04)

- [ ] Streak defined as consecutive days with at least one task completion
- [ ] Current streak count displayed in days
- [ ] Streak broken if no tasks completed by end of day (user's timezone)
- [ ] Streak updates immediately when task is completed
- [ ] Visual indicator (fire icon, flame animation for active streak)
- [ ] Streak milestone celebrations at 7, 30, 100, 365 days
- [ ] Click shows streak history calendar

### Longest Streak Record (US-AN-05)

- [ ] Display user's all-time longest streak
- [ ] Show date range of longest streak (e.g., "05 Jan 2026 - 14 Feb 2026")
- [ ] Display streak length in days
- [ ] Highlight if current streak is approaching record
- [ ] Click shows detailed streak history

### Tasks by Priority Distribution (US-AN-06)

- [ ] Display count of tasks in each priority level
- [ ] Priorities: Urgent, High, Medium, Low
- [ ] Visual representation: Donut chart or horizontal bar chart
- [ ] Color coding matches priority colors (Urgent=red, High=orange, Medium=blue, Low=gray)
- [ ] Percentage shown for each priority
- [ ] Time period selector: All time, Last 30 days, This month
- [ ] Click on segment filters task list to that priority

### Tasks by Project Distribution (US-AN-07)

- [ ] Display count of tasks in each project
- [ ] Show top 5 projects by task count, group others as "Other"
- [ ] Include "No Project" for unassigned tasks
- [ ] Visual representation: Horizontal bar chart or pie chart
- [ ] Project colors match project color coding
- [ ] Percentage shown for each project
- [ ] Time period selector: All time, Last 30 days, This month
- [ ] Click on segment filters task list to that project

### Weekly Activity Graph (US-AN-08)

- [ ] Display last 7 days of activity
- [ ] Show both tasks created and tasks completed per day
- [ ] X-axis: Days (Mon, Tue, Wed, etc. or dates)
- [ ] Y-axis: Task count
- [ ] Dual-color bars: created (lighter) and completed (darker)
- [ ] Tooltip on hover showing exact counts
- [ ] Responsive design adapting to screen size
- [ ] Smooth animation on data update

### Total Pomodoro Sessions (US-AN-09)

- [ ] Display total number of pomodoro sessions completed
- [ ] Time period selector: All time, Last 7 days, Last 30 days, This month
- [ ] Count only completed sessions (not abandoned)
- [ ] Display format: number with abbreviation for large counts
- [ ] Trend indicator showing change from previous period

### Total Focus Minutes (US-AN-10)

- [ ] Display total minutes spent in pomodoro sessions
- [ ] Convert to hours for large values (e.g., "42h 30m")
- [ ] Time period selector matching other pomodoro stats
- [ ] Count only completed session time
- [ ] Comparison to previous period (optional)

### Average Session Length (US-AN-11)

- [ ] Calculate average duration of completed pomodoro sessions
- [ ] Display in minutes (e.g., "25 min")
- [ ] Exclude sessions shorter than 5 minutes (abandoned)
- [ ] Time period selector matching other pomodoro stats
- [ ] Comparison to standard 25-minute pomodoro

### Daily/Weekly Pomodoro Trends (US-AN-12)

- [ ] Display pomodoro sessions over time
- [ ] Daily view: sessions per day for last 7 days
- [ ] Weekly view: sessions per week for last 8 weeks
- [ ] Visual representation: Bar chart or line chart
- [ ] Tooltip showing exact session count and date
- [ ] Highlight most productive day/week

---

## Technical Requirements

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard/stats` | Yes | Get dashboard overview statistics |
| GET | `/api/dashboard/weekly-activity` | Yes | Get weekly activity data for graph |
| GET | `/api/dashboard/streak` | Get streak information |
| GET | `/api/dashboard/tasks-by-priority` | Yes | Get task distribution by priority |
| GET | `/api/dashboard/tasks-by-project` | Yes | Get task distribution by project |
| GET | `/api/pomodoro/stats` | Yes | Get pomodoro statistics |
| GET | `/api/pomodoro/sessions` | Yes | Get pomodoro session history |

### Response Schemas

#### GET /api/dashboard/stats

**Response (200):**
```json
{
  "totalTasks": 156,
  "completedToday": 8,
  "completionRate": 73.5,
  "currentStreak": 12,
  "longestStreak": 45,
  "lastCompletedDate": "17 Feb 2026",
  "period": "all_time",
  "updatedAt": "2026-02-17T14:30:00Z"
}
```

#### GET /api/dashboard/weekly-activity

**Response (200):**
```json
{
  "days": [
    {
      "date": "11 Feb 2026",
      "dayName": "Wednesday",
      "created": 5,
      "completed": 3
    },
    {
      "date": "12 Feb 2026",
      "dayName": "Thursday",
      "created": 8,
      "completed": 6
    },
    {
      "date": "13 Feb 2026",
      "dayName": "Friday",
      "created": 4,
      "completed": 5
    },
    {
      "date": "14 Feb 2026",
      "dayName": "Saturday",
      "created": 2,
      "completed": 4
    },
    {
      "date": "15 Feb 2026",
      "dayName": "Sunday",
      "created": 3,
      "completed": 2
    },
    {
      "date": "16 Feb 2026",
      "dayName": "Monday",
      "created": 7,
      "completed": 5
    },
    {
      "date": "17 Feb 2026",
      "dayName": "Tuesday",
      "created": 6,
      "completed": 8
    }
  ]
}
```

#### GET /api/dashboard/streak

**Response (200):**
```json
{
  "currentStreak": 12,
  "longestStreak": 45,
  "lastCompletedDate": "17 Feb 2026",
  "streakHistory": [
    {
      "startDate": "06 Feb 2026",
      "endDate": "17 Feb 2026",
      "days": 12,
      "isCurrent": true
    },
    {
      "startDate": "01 Dec 2025",
      "endDate": "14 Jan 2026",
      "days": 45,
      "isCurrent": false
    }
  ]
}
```

#### GET /api/dashboard/tasks-by-priority

**Response (200):**
```json
{
  "period": "all_time",
  "distribution": [
    { "priority": "urgent", "count": 12, "percentage": 7.7 },
    { "priority": "high", "count": 35, "percentage": 22.4 },
    { "priority": "medium", "count": 78, "percentage": 50.0 },
    { "priority": "low", "count": 31, "percentage": 19.9 }
  ],
  "totalTasks": 156
}
```

#### GET /api/dashboard/tasks-by-project

**Response (200):**
```json
{
  "period": "all_time",
  "distribution": [
    { "projectId": "uuid", "projectName": "Work", "color": "#3B82F6", "count": 45, "percentage": 28.8 },
    { "projectId": "uuid", "projectName": "Personal", "color": "#22C55E", "count": 38, "percentage": 24.4 },
    { "projectId": "uuid", "projectName": "Learning", "color": "#A855F7", "count": 25, "percentage": 16.0 },
    { "projectId": "uuid", "projectName": "Health", "color": "#EF4444", "count": 18, "percentage": 11.5 },
    { "projectId": "uuid", "projectName": "Finance", "color": "#F59E0B", "count": 12, "percentage": 7.7 },
    { "projectId": null, "projectName": "No Project", "color": "#6B7280", "count": 18, "percentage": 11.5 }
  ],
  "totalTasks": 156
}
```

#### GET /api/pomodoro/stats

**Response (200):**
```json
{
  "period": "all_time",
  "totalSessions": 142,
  "totalMinutes": 3550,
  "avgSessionLength": 25.0,
  "dailyAverage": 2.3,
  "mostProductiveDay": "Tuesday",
  "longestStreak": 15
}
```

### Database Queries

#### Dashboard Stats Query

```sql
-- Total tasks
SELECT COUNT(*) FROM tasks WHERE user_id = :user_id;

-- Completed today
SELECT COUNT(*) FROM tasks 
WHERE user_id = :user_id 
  AND completed = true 
  AND completed_at >= date_trunc('day', now());

-- Completion rate
SELECT 
  ROUND(
    COUNT(*) FILTER (WHERE completed = true) * 100.0 / COUNT(*), 
    1
  ) as completion_rate
FROM tasks WHERE user_id = :user_id;

-- Current streak (consecutive days with completions)
WITH completion_days AS (
  SELECT DISTINCT DATE(completed_at) as day
  FROM tasks
  WHERE user_id = :user_id AND completed = true
  ORDER BY day DESC
)
SELECT COUNT(*) as streak
FROM (
  SELECT day,
         day - (ROW_NUMBER() OVER (ORDER BY day DESC))::int as grp
  FROM completion_days
) sub
WHERE grp = (
  SELECT day - (ROW_NUMBER() OVER (ORDER BY day DESC))::int
  FROM completion_days
  LIMIT 1
);
```

#### Weekly Activity Query

```sql
SELECT 
  DATE(generate_series) as date,
  TO_CHAR(generate_series, 'Day') as day_name,
  COALESCE(created.count, 0) as created,
  COALESCE(completed.count, 0) as completed
FROM generate_series(
  date_trunc('day', now()) - interval '6 days',
  date_trunc('day', now()),
  interval '1 day'
)
LEFT JOIN (
  SELECT DATE(created_at) as day, COUNT(*) as count
  FROM tasks WHERE user_id = :user_id
  GROUP BY DATE(created_at)
) created ON DATE(generate_series) = created.day
LEFT JOIN (
  SELECT DATE(completed_at) as day, COUNT(*) as count
  FROM tasks 
  WHERE user_id = :user_id AND completed = true
  GROUP BY DATE(completed_at)
) completed ON DATE(generate_series) = completed.day
ORDER BY date;
```

### Validation Rules

| Parameter | Type | Constraints | Error Message |
|-----------|------|-------------|---------------|
| `period` | string | `all_time`, `last_7_days`, `last_30_days`, `this_month` | "Invalid period value" |
| `start_date` | date | Optional, ISO 8601 | "Invalid date format" |
| `end_date` | date | Optional, ISO 8601, >= start_date | "End date must be after start date" |

---

## UX Requirements

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Dashboard                               [Period: All Time ▼]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │  Total   │ │Completed │ │Completion│ │ Current  │          │
│  │  Tasks   │ │  Today   │ │   Rate   │ │  Streak  │          │
│  │   156    │ │    8     │ │  73.5%   │ │   12 🔥  │          │
│  │          │ │          │ │  ████░   │ │          │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                                 │
│  ┌─────────────────────────┐ ┌─────────────────────────┐       │
│  │   Weekly Activity       │ │   Tasks by Priority     │       │
│  │                         │ │                         │       │
│  │   ▓▓ ▓▓▓ ▓▓ ▓▓▓▓ ▓▓ ▓▓▓ │ │      ┌──────┐          │       │
│  │   ▒▒ ▒▒▒ ▒▒▒ ▒▒▒▒ ▒▒ ▒▒ │ │     ╱        ╲         │       │
│  │   Mo Tu We Th Fr Sa Su  │ │    │  Medium  │        │       │
│  │                         │ │     ╲        ╱         │       │
│  │                         │ │      └──────┘          │       │
│  └─────────────────────────┘ └─────────────────────────┘       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  Tasks by Project                       │   │
│  │                                                         │   │
│  │  Work      ████████████████████ 45 (28.8%)             │   │
│  │  Personal  █████████████████ 38 (24.4%)                │   │
│  │  Learning  ██████████ 25 (16.0%)                       │   │
│  │  Health    ███████ 18 (11.5%)                          │   │
│  │  Finance   █████ 12 (7.7%)                             │   │
│  │  Other     ███████ 18 (11.5%)                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────┐ ┌─────────────────────────┐       │
│  │   Pomodoro Stats        │ │   Longest Streak        │       │
│  │   142 sessions          │ │   45 days               │       │
│  │   3550 minutes (59h)    │ │   05 Jan 2026 - 14 Feb 2026  │       │
│  │   25 min avg            │ │                         │       │
│  └─────────────────────────┘ └─────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Stat Card Component

```
┌──────────────────────┐
│  📊 Total Tasks      │  <- Icon + Label
│                      │
│       156            │  <- Large value
│                      │
│   ↑ 12 from last     │  <- Trend indicator (optional)
│      period          │
└──────────────────────┘
```

- **Size**: Responsive, minimum 200x120px
- **Typography**: Large bold value, smaller label
- **Colors**: Card background with subtle shadow
- **Hover**: Slight elevation, cursor pointer
- **Click**: Navigate to filtered task list

### Charts Implementation

#### Weekly Activity Chart

- **Library**: Recharts or Chart.js
- **Type**: Grouped bar chart
- **Colors**: Created (lighter blue), Completed (darker blue)
- **X-axis**: Day names (Mon, Tue, etc.)
- **Y-axis**: Task count (auto-scaled)
- **Tooltip**: Show both created and completed counts
- **Animation**: Bars animate in on load
- **Responsive**: Adapts to container width

#### Priority Distribution Chart

- **Type**: Donut chart or horizontal bar chart
- **Colors**: Match priority colors
- **Labels**: Priority name, count, percentage
- **Legend**: Below or beside chart
- **Animation**: Smooth arc/bar transitions
- **Click**: Filter tasks by priority

#### Project Distribution Chart

- **Type**: Horizontal bar chart
- **Colors**: Match project colors
- **Labels**: Project name, count, percentage
- **Sort**: By count descending
- **Max items**: Show top 5, group rest as "Other"
- **Click**: Filter tasks by project

### Period Selector

```
Period: [All Time ▼]
        ┌─────────────┐
        │ All Time    │
        │ Last 7 Days │
        │ Last 30 Days│
        │ This Month  │
        │ This Year   │
        └─────────────┘
```

- **Position**: Top right of dashboard
- **Default**: All Time
- **Persistence**: Selected period saved to localStorage
- **Effect**: All stats update to reflect selected period

### Loading States

- **Skeleton Cards**: Placeholder cards matching stat card dimensions
- **Chart Skeletons**: Gray bars/blocks where charts will render
- **Staggered Loading**: Cards load first, then charts
- **Refresh Indicator**: Subtle spinner when refreshing data

### Empty States

- **No Tasks**: "No tasks yet. Start by creating your first task!" with CTA
- **No Completions**: "Complete some tasks to see your progress!"
- **No Pomodoro**: "Start a pomodoro session to track your focus time!"

### Animations (Framer Motion)

```typescript
// Stat card enter animation
const statCardAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

// Number count-up animation
const countAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 },
};

// Chart bar animation
const barAnimation = {
  initial: { height: 0 },
  animate: { height: `${value}%` },
  transition: { duration: 0.5, delay: index * 0.1 },
};

// Streak flame animation
const flameAnimation = {
  scale: [1, 1.1, 1],
  rotate: [-2, 2, -2],
  transition: { duration: 2, repeat: Infinity },
};
```

### Responsive Behavior

- **Desktop (>1024px)**: Full dashboard with all charts visible
- **Tablet (768-1024px)**: 2-column stat cards, stacked charts
- **Mobile (<768px)**: Single column stat cards, simplified charts

### Accessibility

- All charts have text alternatives (data tables)
- Color is not the only means of conveying information
- Screen reader announcements for stat updates
- Keyboard navigation through interactive elements
- Focus visible on all clickable elements
- Color contrast meets WCAG 2.1 AA

---

## Dependencies

| Feature | Dependency Type | Description |
|---------|-----------------|-------------|
| `task-management.md` | Required | Task data for statistics |
| `auth-jwt.md` | Required | JWT authentication for all endpoints |
| `pomodoro.md` | Required | Pomodoro session data |

---

## Related Specifications

- `@specs/overview.md` - Project overview with API endpoint definitions
- `@specs/features/task-management.md` - Task management core features
- `@specs/features/auth-jwt.md` - JWT authentication requirements
- `@specs/database/schema.md` - Database schema definitions

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Dashboard Load Time | <2s | Time to render all stats and charts |
| Dashboard Adoption | >50% of users view weekly | Page view analytics |
| Data Accuracy | 100% | Stats match raw data queries |
| Chart Interaction Rate | >30% click on charts | Interaction analytics |

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| User has no tasks | Show empty state with creation CTA, all stats display 0 |
| User has no completions | Completion rate shows 0%, streak shows 0 |
| Very large task counts | Abbreviate numbers (1.2K, 1.5M) |
| Timezone changes | Recalculate daily stats based on new timezone |
| Concurrent task updates | Stats update via TanStack Query refetch |
| Network failure loading stats | Show cached data with stale indicator, retry option |
| Division by zero (completion rate) | Display 0% when no tasks exist |
| Streak calculation at midnight | Use user's timezone for day boundary |
| Chart data exceeds display | Truncate labels, show tooltip on hover |

---

## Performance Considerations

- **Caching**: TanStack Query caches dashboard stats for 5 minutes
- **Background Refresh**: Silent refresh when cache expires
- **Query Optimization**: Use database indexes for aggregation queries
- **Incremental Updates**: Update individual stats on task changes vs full refetch
- **Chart Rendering**: Virtualize large datasets, limit data points

---

*This specification follows the principles of the Phase 2 Constitution. Implementation must align with documented requirements, technology stack, and UX standards.*
