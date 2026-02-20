# TodoFlow User Guide

**Version:** 1.9.0  
**Last Updated:** 20 Feb 2026

Welcome to TodoFlow! This guide will help you get the most out of the application.

---

## Getting Started

### Creating Your Account

1. Go to the signup page
2. Enter your email, name, and password
3. Click **Create Account**
4. You'll be automatically signed in

### First Steps

After signing up:
1. **Create your first project** - Organize tasks by category
2. **Add some labels** - Tag tasks for easy filtering
3. **Create your first task** - Click the + button or press `N`
4. **Explore the dashboard** - See your productivity stats

---

## Core Features

### Tasks

#### Creating Tasks

**Quick Add:**
- Press `N` anywhere in the app
- Click the + button in the task list
- Type task title and press Enter

**Detailed Task:**
- Click on any task to open the editor
- Add description, due date, priority, project, labels
- Add subtasks for breakdown

**Natural Language:**
Type naturally in quick add:
- "Meeting tomorrow at 3pm" → Sets due date
- "Call John next Friday" → Parses date
- "Submit report #work !high" → Adds label and priority

#### Task Properties

| Property | Description | Options |
|----------|-------------|---------|
| **Title** | Task name (required) | 1-200 characters |
| **Description** | Detailed notes | Markdown supported |
| **Priority** | Importance level | Low, Medium, High, Urgent |
| **Due Date** | When it's due | Any date/time |
| **Project** | Category | Your projects |
| **Labels** | Tags | Multiple allowed |
| **Subtasks** | Steps | Checklist items |

#### Completing Tasks

- Click the checkbox next to task
- Press `Space` when task is focused
- Swipe right on mobile
- Tasks move to "Completed" filter

#### Editing Tasks

- Click task to open editor
- Press `Enter` when task is focused
- Press `E` when task is focused
- Double-click task title

#### Deleting Tasks

- Open task editor, click Delete
- Select task, press `Delete` key
- Right-click → Delete

---

### Projects

Projects help you organize related tasks.

#### Creating Projects

1. Go to Projects page
2. Click **+ New Project**
3. Enter name and choose color
4. Click **Create**

#### Project Colors

Choose from 12 preset colors:
- 🔵 Blue (default)
- 🟢 Green
- 🟡 Yellow
- 🟠 Orange
- 🔴 Red
- 🟣 Purple
- And more...

#### Project Stats

Each project shows:
- Total tasks
- Completed tasks
- Completion rate
- Overdue tasks

---

### Labels

Labels are flexible tags for cross-project organization.

#### Creating Labels

1. Go to Labels page
2. Click **+ New Label**
3. Enter name (required)
4. Choose color (required)
5. Click **Create**

#### Using Labels

- Select in task editor
- Click label in sidebar to filter
- Type `#label` in quick add
- Multiple labels per task

#### Label Suggestions

The label picker shows:
- Recently used labels
- Frequently used labels
- All your labels (searchable)

---

### Subtasks

Break tasks into smaller steps.

#### Adding Subtasks

1. Open task editor
2. Scroll to Subtasks section
3. Click **Add subtask**
4. Enter subtask title
5. Press Enter

#### Completing Subtasks

- Click checkbox next to subtask
- Parent task shows progress (e.g., "3/5 subtasks")
- Optional: Auto-complete parent when all subtasks done

---

## Views

### Task List

The default view for managing tasks.

**Features:**
- Sort by created, due date, priority, title
- Filter by status, priority, project, labels
- Quick filters: Today, This Week, Overdue
- Infinite scroll pagination
- Drag to reorder (coming soon)

### Kanban Board

Visual board for workflow management.

**Columns:**
- **Todo** - Tasks to do
- **In Progress** - Currently working on
- **Done** - Completed tasks

**Usage:**
- Drag tasks between columns
- Updates task status automatically
- See work at a glance

### Calendar

Time-based view of tasks.

**Views:**
- **Month** - Overview of month
- **Week** - Weekly schedule
- **Day** - Hourly breakdown

**Features:**
- Click date to add task
- Click task to edit
- Color-coded by priority
- Keyboard shortcuts: M=Month, W=Week, D=Day

### Focus Mode

Distraction-free single task view.

**Features:**
- Hides sidebar and navigation
- Shows only task and timer
- Integrated Pomodoro timer
- Press `Escape` to exit

### Dashboard

Productivity insights and statistics.

**Stats:**
- Total tasks
- Completed today
- Completion rate
- Current streak
- Longest streak

**Charts:**
- Weekly activity graph
- Tasks by priority
- Tasks by project

---

## Premium Features

### Pomodoro Timer

Boost focus with timed work sessions.

**How to Use:**
1. Open Focus mode or Pomodoro component
2. Select task (optional)
3. Set duration (default: 25 min work, 5 min break)
4. Click Start
5. Take break when timer ends

**Stats:**
- Total sessions
- Total focus minutes
- Average session length
- Daily/weekly trends

### Completion Celebrations

Delightful moments for achievements.

**Celebrations:**
- **Confetti** - Bursts on task completion
- **Milestone Modal** - Streak celebrations
- **Progress Animation** - Smooth bar fills
- **Sound Effects** - Optional audio feedback

**Milestones:**
- 3 days: "Getting started! 🔥"
- 7 days: "One week streak! 🔥🔥"
- 14 days: "Two weeks strong! 🔥🔥🔥"
- 30 days: "Monthly master! 🏆"
- 100 days: "Century club! 💯"

**Settings:**
- Celebration intensity: Full, Reduced, Minimal, Off
- Sound effects: On/Off
- Quiet hours: 10pm-7am (configurable)

### Keyboard Shortcuts

Power user features for efficiency.

#### Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `N` | New task |
| `/` | Focus search |
| `T` | Toggle theme |
| `?` | Show shortcuts help |
| `Escape` | Close modal/cancel |

#### Navigation

| Shortcut | Action |
|----------|--------|
| `G, T` | Go to Tasks |
| `G, C` | Go to Calendar |
| `G, P` | Go to Projects |
| `G, D` | Go to Dashboard |

#### Task Actions

| Shortcut | Action |
|----------|--------|
| `J` | Next task |
| `K` | Previous task |
| `Space` | Toggle complete |
| `Enter` | Edit task |
| `Delete` | Delete task |
| `D` | Set due date |
| `P` | Set priority |
| `L` | Add labels |

#### Priority Shortcuts

| Shortcut | Priority |
|----------|----------|
| `!` | Urgent |
| `#` | High |
| `$` | Medium |
| `~` | Low |

### PWA & Offline

Install and use offline.

**Install:**
1. Use app 2+ times
2. Install prompt appears
3. Click **Install**
4. App appears in home screen/app launcher

**Offline Features:**
- View cached tasks
- Create/edit/delete tasks
- Changes sync when online
- Offline indicator shows status

---

## Tips & Tricks

### Productivity Tips

1. **Start with MITs** - Identify 3 Most Important Tasks each morning
2. **Time blocking** - Schedule tasks on calendar
3. **Two-minute rule** - If it takes <2 min, do it now
4. **Pomodoro technique** - 25 min focus, 5 min break
5. **Weekly review** - Clean up completed, plan next week

### Keyboard Power User

1. **Learn the basics** - `N`, `/`, `Space`, `J/K`
2. **Use G-key chords** - Navigate without mouse
3. **Priority shortcuts** - Quick priority setting
4. **Custom shortcuts** - Remap in settings (coming soon)

### Organization Strategies

1. **Projects by area** - Work, Personal, Health, Learning
2. **Labels by context** - @computer, @phone, @errand
3. **Priorities by urgency** - Urgent=do today, High=this week
4. **Subtasks for complex** - Break into actionable steps

### Dashboard Insights

1. **Check daily** - Morning review of stats
2. **Maintain streak** - Complete at least one task daily
3. **Watch completion rate** - Aim for 70%+
4. **Review weekly activity** - Identify productive days

---

## Settings & Preferences

### Theme

Choose your appearance:
- **Light** - Bright theme
- **Dark** - Dark theme
- **System** - Follows OS setting

Toggle with `T` shortcut or click theme icon.

### Date Format

Choose date display:
- **12-hour** - 4:30 PM
- **24-hour** - 16:30

### Notifications

Configure browser notifications:
- Due date reminders
- Streak reminders
- Daily digest

### Celebrations

Customize celebrations:
- Intensity level
- Sound effects
- Quiet hours

---

## Troubleshooting

### Common Issues

**Can't sign in:**
- Check email and password
- Clear browser cache
- Try incognito mode
- Contact support if persists

**Tasks not loading:**
- Check internet connection
- Refresh page
- Check browser console for errors
- Try different browser

**Offline mode not working:**
- Ensure you've used app while online first
- Check if install prompt appeared
- Try installing PWA
- Clear cache and reload

**Celebrations not showing:**
- Check celebration settings
- Ensure not in quiet hours
- Check browser permissions for sound
- Try different intensity level

### Getting Help

- **Documentation** - This user guide
- **Keyboard Shortcuts** - Press `?` in app
- **Troubleshooting Guide** - See TROUBLESHOOTING-GUIDE.md
- **Bug Reports** - Create issue in repository

---

## Keyboard Shortcuts Reference

### Quick Reference Card

```
GLOBAL
  N         New task
  /         Search
  T         Toggle theme
  ?         Show help
  Escape    Close modal

NAVIGATION
  G, T      Tasks
  G, C      Calendar
  G, P      Projects
  G, D      Dashboard

TASK LIST
  J         Next task
  K         Previous task
  Space     Toggle complete
  Enter     Edit task
  Delete    Delete task

TASK EDITOR
  D         Set due date
  P         Set priority
  L         Add labels
  !         Set urgent
  #         Set high
  $         Set medium
  ~         Set low

CALENDAR
  M         Month view
  W         Week view
  D         Day view
  T         Today
```

---

## Best Practices

### Daily Routine

**Morning (5 min):**
1. Check dashboard
2. Review today's tasks
3. Set 3 MITs (Most Important Tasks)
4. Start first Pomodoro

**Evening (5 min):**
1. Complete any remaining tasks
2. Review completion rate
3. Plan tomorrow's tasks
4. Maintain streak!

### Weekly Review (30 min)

1. Review completed tasks
2. Clean up old tasks
3. Update project priorities
4. Plan next week
5. Check streak history

### Monthly Goals

1. Set monthly objectives
2. Break into projects
3. Schedule on calendar
4. Track progress weekly
5. Celebrate achievements

---

## Feature Requests

Have an idea? We'd love to hear it!

**Submit feedback:**
- Create issue in repository
- Describe feature and use case
- Include examples if possible

---

*User Guide v1.9.0 | Last Updated: 20 Feb 2026*
