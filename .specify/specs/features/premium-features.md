# Feature: Premium Features & Monetization

**Feature ID:** PF-ALL (PF-01 to PF-18)
**Status:** `draft`
**Constitution Principles:**
- Principle 1: Spec-Driven Development
- Principle 3: JWT Authentication & User Isolation
- Principle 5: Premium SaaS UX Standards

---

## Overview

This specification defines the premium monetization strategy for TodoFlow, including feature tiers, trial system, pricing models, and feature gating mechanisms. The premium features transform TodoFlow from a basic task manager into a comprehensive productivity platform that rivals industry leaders like Todoist, TickTick, and ClickUp.

The monetization model balances accessibility (free tier with core functionality) with premium value (advanced features that power users need), creating a sustainable SaaS business model.

---

## Premium Features Philosophy

### What Makes a Feature "Premium"?

Premium features are characterized by:

| Characteristic | Description | Example |
|----------------|-------------|---------|
| **Power User Value** | Features that significantly boost productivity for frequent users | Kanban board, Calendar view |
| **Organization Scale** | Features needed when managing large volumes of tasks | Unlimited projects, unlimited labels |
| **Advanced Insights** | Analytics that help users optimize their workflow | Dashboard stats, Pomodoro tracking |
| **UX Polish** | Enhancements that create delightful, habit-forming experiences | Dark mode, animations, celebrations |
| **Efficiency Tools** | Features that reduce friction for power users | Keyboard shortcuts, Quick add, Focus mode |

### Free vs Premium Boundary

**Free Tier Philosophy:**
- Core task management must be fully functional
- Users should be able to manage their daily tasks without friction
- Limitations should encourage upgrade, not block basic usage
- All user data is preserved regardless of tier

**Premium Tier Value Proposition:**
- Unlock advanced organization and visualization
- Gain insights into productivity patterns
- Access efficiency tools for power users
- Enjoy premium UX polish and customization
- Receive priority support

---

## Target Audience

### Free Tier Users

| Persona | Characteristics | Needs |
|---------|-----------------|-------|
| **Casual User** | Occasional task management, simple lists | Basic CRUD, simple organization |
| **Evaluator** | Testing the app before committing | Full feature access during trial |
| **Student** | Limited budget, basic task needs | Free tier with core functionality |
| **Light User** | <10 tasks/week, single project | Simple task management |

### Premium Tier Users

| Persona | Characteristics | Willing to Pay For |
|---------|-----------------|---------------------|
| **Professional** | Daily task management, multiple projects | Projects, calendar view, analytics |
| **Power User** | Heavy usage, efficiency-focused | Keyboard shortcuts, quick add, focus mode |
| **Manager** | Team coordination (future), complex workflows | Advanced organization, reporting |
| **Productivity Enthusiast** | Optimization-focused, habit tracking | Pomodoro, streaks, celebrations, insights |
| **Multi-Project User** | Juggling many contexts | Unlimited projects, labels, filtering |

---

## Premium Features Inventory

### Category 1: Productivity Power-Ups (PF-01 to PF-09)

These features provide advanced task organization and management capabilities.

| Feature ID | Feature Name | Description | Free Tier Limitation |
|------------|--------------|-------------|----------------------|
| **PF-01** | Kanban Board View | Drag-and-drop task management across status columns | List view only |
| **PF-02** | Calendar View | Visual calendar showing tasks with due dates | Calendar view hidden |
| **PF-03** | Projects/Groups | Organize tasks into projects or categories | Limited to 1 project |
| **PF-04** | Subtasks | Break tasks into smaller checkable items | Limited to 3 subtasks per task |
| **PF-05** | Labels/Tags | Color-coded labels for task categorization | Limited to 5 labels |
| **PF-06** | Task Priorities | Priority levels (Low, Medium, High, Urgent) | Medium priority only |
| **PF-07** | Due Dates & Reminders | Date/time picker with notification support | Due dates only, no reminders |
| **PF-08** | Rich Task Descriptions | Markdown support with attachments | Plain text only, no attachments |
| **PF-09** | Task Filtering & Sorting | Advanced filtering and smart lists | Basic sort only (created date) |

### Category 2: Analytics & Insights (PF-10 to PF-11)

These features provide visibility into productivity patterns and focus time.

| Feature ID | Feature Name | Description | Free Tier Limitation |
|------------|--------------|-------------|----------------------|
| **PF-10** | Dashboard with Stats | Productivity analytics dashboard | Dashboard hidden |
| **PF-11** | Pomodoro Timer | Built-in focus timer for work sessions | Timer disabled |

### Category 3: UX Enhancements (PF-12 to PF-18)

These features create a polished, delightful user experience.

| Feature ID | Feature Name | Description | Free Tier Limitation |
|------------|--------------|-------------|----------------------|
| **PF-12** | Dark Mode | Theme toggle with system preference detection | Light mode only |
| **PF-13** | Responsive Design | Mobile, tablet, desktop support | Always available (core requirement) |
| **PF-14** | PWA Support | Offline capabilities, install prompt | Always available (core requirement) |
| **PF-15** | Keyboard Shortcuts | Power user keyboard navigation | Shortcuts disabled |
| **PF-16** | Quick Add Pattern | Rapid task entry from anywhere | Standard add only |
| **PF-17** | Focus Mode | Distraction-free task view | Focus mode disabled |
| **PF-18** | Completion Celebrations | Delight moments on task completion | Animations disabled |

---

## Trial System Specification

### Free Trial Overview

| Attribute | Value |
|-----------|-------|
| **Trial Duration** | 14 days (2 weeks) |
| **Start Trigger** | Immediately on signup |
| **Credit Card Required** | No |
| **Feature Access** | All 18 premium features unlocked |
| **Data Limits** | Unlimited tasks, projects, labels |
| **Support Level** | Priority support |
| **Conversion Goal** | 25-35% trial-to-paid conversion |

### Trial Timeline

```
Day 0: User signs up → Trial starts automatically
       │
       ├─ Welcome email with trial info
       ├─ All premium features unlocked
       └─ Onboarding flow begins

Day 1-3: Onboarding emails
         ├─ Email 1: Getting started guide
         ├─ Email 2: Power features showcase
         └─ Email 3: Tips for productivity

Day 7: Mid-trial check-in
       ├─ Email 4: "Halfway through your trial"
       ├─ Usage summary (tasks created, projects, etc.)
       └─ Highlight unused premium features

Day 12: Trial ending soon reminder
        ├─ Email 5: "2 days left in your trial"
        ├─ Value recap
        └─ Upgrade CTA with pricing

Day 14: Trial expiration
        ├─ Final reminder email
        ├─ Premium features locked at end of day
        └─ Grace period begins (7 days)

Day 15-21: Grace period
           ├─ Premium features read-only
           ├─ Upgrade prompts on feature access
           └─ Data fully preserved

Day 22+: Post-grace period
         ├─ Free tier limits enforced
         ├─ Data remains intact
         └─ Upgrade always available
```

### Trial Feature Access

**During Trial (Days 0-14):**

| Feature Category | Access Level |
|------------------|--------------|
| Kanban Board | ✅ Full access |
| Calendar View | ✅ Full access |
| Projects | ✅ Unlimited projects |
| Subtasks | ✅ Unlimited subtasks |
| Labels | ✅ Unlimited labels |
| Priorities | ✅ All 4 priority levels |
| Due Dates & Reminders | ✅ Full reminder support |
| Rich Descriptions | ✅ Markdown + attachments |
| Filtering & Sorting | ✅ All filters + smart lists |
| Dashboard | ✅ Full analytics |
| Pomodoro Timer | ✅ Full timer + stats |
| Dark Mode | ✅ Full theme support |
| Keyboard Shortcuts | ✅ All shortcuts enabled |
| Quick Add | ✅ Natural language input |
| Focus Mode | ✅ Distraction-free view |
| Celebrations | ✅ All animations enabled |

### Trial Expiration Behavior

**When Trial Expires (Day 15):**

| Feature | Post-Trial Behavior |
|---------|---------------------|
| Kanban Board | Switches to list view, board data preserved |
| Calendar View | View hidden, due dates still visible in list |
| Projects | Limited to 1 project, excess projects archived (not deleted) |
| Subtasks | Limited to 3 per task, excess hidden but preserved |
| Labels | Limited to 5 labels, excess preserved but unassignable |
| Priorities | All tasks set to "medium", priority selection disabled |
| Reminders | Reminders disabled, due dates preserved |
| Rich Descriptions | Markdown renders as plain text, attachments hidden |
| Smart Filters | Custom filters preserved but inactive |
| Dashboard | Dashboard hidden, stats preserved |
| Pomodoro | Timer disabled, session history preserved |
| Dark Mode | Forced to light mode, preference saved |
| Keyboard Shortcuts | Shortcuts disabled |
| Quick Add | Standard input only |
| Focus Mode | Feature disabled |
| Celebrations | Animations disabled |

**Data Preservation Guarantee:**
- ALL user data is preserved indefinitely
- No data is ever deleted due to tier downgrade
- Upgrading restores full access to all data immediately

---

## Pricing Tiers

### Free Tier

| Attribute | Value |
|-----------|-------|
| **Price** | $0 (forever) |
| **Target** | Casual users, evaluators, students |
| **Task Limit** | Unlimited |
| **Project Limit** | 1 project |
| **Label Limit** | 5 labels |
| **Subtask Limit** | 3 per task |
| **Priority Levels** | Medium only |
| **Due Dates** | Yes (no reminders) |
| **Description Format** | Plain text only |
| **Attachments** | Not included |
| **Views** | List view only |
| **Analytics** | Not included |
| **Pomodoro** | Not included |
| **Dark Mode** | Not included |
| **Keyboard Shortcuts** | Not included |
| **Quick Add** | Standard input only |
| **Focus Mode** | Not included |
| **Celebrations** | Not included |
| **Support** | Community support |
| **Data Export** | Yes (CSV) |

### Premium Monthly

| Attribute | Value |
|-----------|-------|
| **Price** | $9.99/month |
| **Billing** | Recurring monthly |
| **Trial** | 14-day free trial |
| **Cancellation** | Anytime, access until period end |
| **Task Limit** | Unlimited |
| **Project Limit** | Unlimited |
| **Label Limit** | Unlimited |
| **Subtask Limit** | Unlimited |
| **Priority Levels** | All 4 levels |
| **Due Dates & Reminders** | Full support |
| **Description Format** | Markdown + attachments (10MB/file, 100MB total) |
| **Views** | List, Kanban, Calendar |
| **Analytics** | Full dashboard |
| **Pomodoro** | Full timer + stats |
| **Dark Mode** | Full theme support |
| **Keyboard Shortcuts** | All shortcuts |
| **Quick Add** | Natural language input |
| **Focus Mode** | Enabled |
| **Celebrations** | All animations |
| **Support** | Priority email support |
| **Data Export** | Yes (CSV, JSON) |
| **API Access** | Full API access |

### Premium Yearly

| Attribute | Value |
|-----------|-------|
| **Price** | $99.99/year |
| **Savings** | 17% vs monthly ($20 saved) |
| **Effective Monthly** | $8.33/month |
| **Billing** | Recurring annually |
| **Trial** | 14-day free trial |
| **Cancellation** | Anytime, access until period end |
| **All Premium Features** | ✅ Included |
| **Early Adopter Badge** | ✅ Profile badge for yearly subscribers |
| **Priority Support** | ✅ 24-hour response guarantee |
| **Feature Requests** | ✅ Priority consideration |
| **Beta Access** | ✅ Early access to new features |

### Lifetime Access (Limited)

| Attribute | Value |
|-----------|-------|
| **Price** | $199.99 (one-time) |
| **Availability** | Limited launch offer |
| **All Premium Features** | ✅ Lifetime access |
| **Future Updates** | ✅ All Phase 2 features |
| **Major Version Upgrades** | ❌ Phase 3+ may require upgrade |
| **Transferable** | ❌ Non-transferable license |
| **Refund Policy** | 30-day money-back guarantee |

---

## Feature Unlock Conditions

### Unlock Matrix

| Feature | Free Tier | Trial | Premium Monthly | Premium Yearly | Lifetime |
|---------|-----------|-------|-----------------|----------------|----------|
| PF-01: Kanban | ❌ | ✅ | ✅ | ✅ | ✅ |
| PF-02: Calendar | ❌ | ✅ | ✅ | ✅ | ✅ |
| PF-03: Projects (unlimited) | ❌ (1) | ✅ | ✅ | ✅ | ✅ |
| PF-04: Subtasks (unlimited) | ❌ (3) | ✅ | ✅ | ✅ | ✅ |
| PF-05: Labels (unlimited) | ❌ (5) | ✅ | ✅ | ✅ | ✅ |
| PF-06: Priorities (all) | ❌ (medium) | ✅ | ✅ | ✅ | ✅ |
| PF-07: Reminders | ❌ | ✅ | ✅ | ✅ | ✅ |
| PF-08: Rich descriptions | ❌ | ✅ | ✅ | ✅ | ✅ |
| PF-09: Smart filters | ❌ | ✅ | ✅ | ✅ | ✅ |
| PF-10: Dashboard | ❌ | ✅ | ✅ | ✅ | ✅ |
| PF-11: Pomodoro | ❌ | ✅ | ✅ | ✅ | ✅ |
| PF-12: Dark mode | ❌ | ✅ | ✅ | ✅ | ✅ |
| PF-13: Responsive | ✅ | ✅ | ✅ | ✅ | ✅ |
| PF-14: PWA | ✅ | ✅ | ✅ | ✅ | ✅ |
| PF-15: Shortcuts | ❌ | ✅ | ✅ | ✅ | ✅ |
| PF-16: Quick add | ❌ | ✅ | ✅ | ✅ | ✅ |
| PF-17: Focus mode | ❌ | ✅ | ✅ | ✅ | ✅ |
| PF-18: Celebrations | ❌ | ✅ | ✅ | ✅ | ✅ |

### Unlock Triggers

| Trigger | Action |
|---------|--------|
| **User Signup** | Trial starts automatically, all features unlocked for 14 days |
| **Trial Expiration** | Features locked according to free tier limits |
| **Upgrade Purchase** | Immediate unlock of all premium features |
| **Subscription Renewal** | Continued access, billing processed |
| **Subscription Cancellation** | Access until period end, then downgrade |
| **Payment Failure** | 7-day grace period, then downgrade |
| **Reactivation** | Immediate unlock, pro-rated billing |

---

## Trial Conversion Flow

### Conversion Funnel

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TRIAL CONVERSION FUNNEL                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  SIGNUP                                                              │
│  └─→ Trial starts (Day 0)                                           │
│       └─→ Welcome email                                              │
│            └─→ Onboarding flow                                       │
│                 └─→ Feature discovery                                │
│                                                                      │
│  ENGAGEMENT (Days 1-13)                                              │
│  ├─→ Email 1: Getting started (Day 1)                               │
│  ├─→ Email 2: Power features (Day 3)                                │
│  ├─→ Email 3: Productivity tips (Day 5)                             │
│  ├─→ In-app tooltips on premium features                            │
│  └─→ Usage milestones celebrated                                    │
│                                                                      │
│  CONVERSION PUSH (Days 12-14)                                        │
│  ├─→ Email 4: "2 days left" (Day 12)                                │
│  ├─→ Email 5: "Last day" (Day 14)                                   │
│  ├─→ In-app upgrade banners                                         │
│  └─→ Special offer: 20% off first year (optional)                   │
│                                                                      │
│  EXPIRATION (Day 15)                                                 │
│  ├─→ Premium features locked                                        │
│  ├─→ Grace period begins (7 days)                                   │
│  └─→ Upgrade prompt on feature access                               │
│                                                                      │
│  POST-EXPIRATION (Days 15-21)                                        │
│  ├─→ Email 6: "We miss you" (Day 17)                                │
│  ├─→ Email 7: "Come back" offer (Day 20)                            │
│  └─→ Continued upgrade prompts                                      │
│                                                                      │
│  LONG-TAIL (Day 22+)                                                 │
│  ├─→ Monthly re-engagement emails                                   │
│  ├─→ Feature update announcements                                   │
│  └─→ Seasonal offers                                                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Email Sequence

| Email # | Trigger | Subject Line | Goal |
|---------|---------|--------------|------|
| 1 | Day 0 (signup) | "Welcome to TodoFlow! Your 14-day trial starts now" | Onboard, set expectations |
| 2 | Day 1 | "Get the most out of TodoFlow" | Feature education |
| 3 | Day 3 | "Unlock your productivity potential" | Power features showcase |
| 4 | Day 5 | "Tips from power users" | Social proof, tips |
| 5 | Day 7 | "Halfway through your trial" | Usage summary, engagement |
| 6 | Day 12 | "2 days left in your trial" | Urgency, value recap |
| 7 | Day 14 | "Last chance for premium features" | Final conversion push |
| 8 | Day 17 | "We miss you! Here's 20% off" | Win-back offer |
| 9 | Day 20 | "Your data is waiting" | Data preservation reminder |
| 10 | Day 30 | "New features you'll love" | Re-engagement |

### In-App Conversion Touchpoints

| Touchpoint | Trigger | Message | Action |
|------------|---------|---------|--------|
| Welcome Banner | First login | "Explore premium features during your 14-day trial" | Link to features page |
| Feature Tooltip | First access to premium feature | "Premium feature: [feature name]. Try it free for X more days!" | Continue using |
| Trial Countdown | Days 12-14 | "X days left in your trial" in header | Link to upgrade |
| Upgrade Modal | Clicking locked feature (post-trial) | "Upgrade to unlock [feature]" | Pricing display |
| Exit Intent | User navigating away during trial | "Wait! Don't lose access to premium features" | Special offer |

---

## Feature Gating Implementation

### Gating Rules by Feature

#### PF-01: Kanban Board View

| Tier | Behavior |
|------|----------|
| Free | View switcher shows "List" only, Kanban option hidden |
| Trial/Premium | Full Kanban access |
| Post-Trial Downgrade | Auto-switch to List view, board state preserved |

**Implementation:**
```typescript
// View switcher component
const ViewSwitcher = () => {
  const { isPremium, isTrial } = useSubscription();
  const canUseKanban = isPremium || isTrial;
  
  return (
    <Dropdown>
      <Option selected>List</Option>
      {canUseKanban && <Option>Kanban</Option>}
      {canUseKanban && <Option>Calendar</Option>}
      {!canUseKanban && (
        <Option disabled onClick={showUpgradeModal}>
          Kanban 🔒
        </Option>
      )}
    </Dropdown>
  );
};
```

#### PF-02: Calendar View

| Tier | Behavior |
|------|----------|
| Free | Calendar view hidden, due dates shown in list |
| Trial/Premium | Full calendar access (month/week/day) |
| Post-Trial Downgrade | View hidden, data preserved |

#### PF-03: Projects/Groups

| Tier | Behavior |
|------|----------|
| Free | 1 project max, "Add Project" button shows limit |
| Trial/Premium | Unlimited projects |
| Post-Trial Downgrade | Excess projects archived (not deleted), restore on upgrade |

**Implementation:**
```typescript
// Project creation
const createProject = async (data) => {
  const { projectCount, isPremium, isTrial } = useSubscription();
  const maxProjects = isPremium || isTrial ? Infinity : 1;
  
  if (projectCount >= maxProjects) {
    showUpgradeModal({ feature: 'unlimited-projects' });
    return;
  }
  
  await api.projects.create(data);
};
```

#### PF-04: Subtasks

| Tier | Behavior |
|------|----------|
| Free | 3 subtasks per task max |
| Trial/Premium | Unlimited subtasks |
| Post-Trial Downgrade | Excess subtasks hidden, preserved |

#### PF-05: Labels/Tags

| Tier | Behavior |
|------|----------|
| Free | 5 labels max |
| Trial/Premium | Unlimited labels |
| Post-Trial Downgrade | Excess labels preserved but unassignable |

#### PF-06: Task Priorities

| Tier | Behavior |
|------|----------|
| Free | All tasks default to "medium", priority selector disabled |
| Trial/Premium | All 4 priority levels available |
| Post-Trial Downgrade | All tasks set to "medium", priority data preserved |

#### PF-07: Due Dates & Reminders

| Tier | Behavior |
|------|----------|
| Free | Due dates available, reminders disabled |
| Trial/Premium | Full reminder support (15min/1hr/1day before) |
| Post-Trial Downgrade | Reminders disabled, due dates preserved |

#### PF-08: Rich Task Descriptions

| Tier | Behavior |
|------|----------|
| Free | Plain text editor, no attachments |
| Trial/Premium | Markdown editor, attachments (10MB/file, 100MB total) |
| Post-Trial Downgrade | Markdown renders as plain text, attachments hidden |

#### PF-09: Task Filtering & Sorting

| Tier | Behavior |
|------|----------|
| Free | Basic sort by created date only |
| Trial/Premium | All filters + smart lists |
| Post-Trial Downgrade | Custom filters preserved but inactive |

#### PF-10: Dashboard with Stats

| Tier | Behavior |
|------|----------|
| Free | Dashboard menu item hidden |
| Trial/Premium | Full dashboard access |
| Post-Trial Downgrade | Dashboard hidden, data preserved |

#### PF-11: Pomodoro Timer

| Tier | Behavior |
|------|----------|
| Free | Timer feature hidden/disabled |
| Trial/Premium | Full timer + statistics |
| Post-Trial Downgrade | Timer disabled, session history preserved |

#### PF-12: Dark Mode

| Tier | Behavior |
|------|----------|
| Free | Light mode only, theme toggle shows "Premium" lock |
| Trial/Premium | Full theme support (Light/Dark/System) |
| Post-Trial Downgrade | Forced to light mode, preference saved |

#### PF-15: Keyboard Shortcuts

| Tier | Behavior |
|------|----------|
| Free | Shortcuts disabled, help modal shows "Premium" |
| Trial/Premium | All shortcuts enabled |
| Post-Trial Downgrade | Shortcuts disabled |

#### PF-16: Quick Add Pattern

| Tier | Behavior |
|------|----------|
| Free | Standard add button only |
| Trial/Premium | FAB + natural language input |
| Post-Trial Downgrade | FAB hidden, standard input only |

#### PF-17: Focus Mode

| Tier | Behavior |
|------|----------|
| Free | Focus mode button hidden |
| Trial/Premium | Full focus mode |
| Post-Trial Downgrade | Feature disabled |

#### PF-18: Completion Celebrations

| Tier | Behavior |
|------|----------|
| Free | No animations on completion |
| Trial/Premium | Confetti, streak celebrations |
| Post-Trial Downgrade | Animations disabled |

---

## Reactivation Rules

### Upgrade Flow

**When User Upgrades:**

| Step | Action |
|------|--------|
| 1 | Payment processed successfully |
| 2 | Subscription status updated to "active" |
| 3 | All premium features immediately unlocked |
| 4 | Welcome back email sent |
| 5 | All preserved data becomes accessible |
| 6 | Pro-rated billing applied if mid-cycle |

**Pro-Rated Billing:**

```
Scenario: User upgrades on Day 20 of monthly cycle
- Days remaining in cycle: 10
- Daily rate: $9.99 / 30 = $0.33/day
- Pro-rated charge: 10 × $0.33 = $3.33
- Next full billing: $9.99 on regular billing date
```

### Cancellation Flow

**When User Cancels:**

| Step | Action |
|------|--------|
| 1 | Cancellation confirmed |
| 2 | Access continues until period end |
| 3 | Confirmation email sent |
| 4 | Reminder 3 days before period end |
| 5 | Downgrade at period end |
| 6 | Data preserved, features gated |

**Downgrade Behavior:**

| Feature | Downgrade Handling |
|---------|-------------------|
| Projects | Excess projects archived |
| Labels | Excess labels preserved but unassignable |
| Subtasks | Excess subtasks hidden |
| Priorities | All tasks set to medium |
| Attachments | Hidden but preserved |
| All other features | Disabled, data preserved |

### Payment Failure Handling

| Failure Stage | Action |
|---------------|--------|
| First failure | Retry in 3 days, email notification |
| Second failure | Retry in 5 days, warning email |
| Third failure | Grace period begins (7 days) |
| Grace period end | Downgrade to free tier |

### Data Retention Policy

| Tier | Data Retention |
|------|----------------|
| Active (any) | Indefinite |
| Free tier | Indefinite |
| Inactive (no login >1 year) | Email warning, then 30 days to respond |
| Account deletion | 30-day recovery window, then permanent deletion |

---

## Technical Implementation

### Subscription Schema

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier VARCHAR(20) NOT NULL DEFAULT 'free' 
        CHECK (tier IN ('free', 'premium_monthly', 'premium_yearly', 'lifetime')),
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'cancelled', 'expired', 'trial', 'grace_period')),
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    payment_method_id UUID REFERENCES payment_methods(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_trial_end ON subscriptions(trial_end);
```

### Subscription Check Utility

```typescript
// utils/subscription.ts
interface SubscriptionStatus {
  tier: 'free' | 'premium_monthly' | 'premium_yearly' | 'lifetime';
  status: 'active' | 'trial' | 'grace_period' | 'expired';
  isPremium: boolean;
  isTrial: boolean;
  trialDaysRemaining: number;
  features: FeatureAccess;
}

export function getSubscriptionStatus(user: User): SubscriptionStatus {
  const subscription = user.subscription;
  
  if (!subscription || subscription.tier === 'free') {
    return {
      tier: 'free',
      status: 'active',
      isPremium: false,
      isTrial: false,
      trialDaysRemaining: 0,
      features: FREE_TIER_FEATURES,
    };
  }
  
  const now = new Date();
  const trialEnd = subscription.trial_end ? new Date(subscription.trial_end) : null;
  
  if (trialEnd && now < trialEnd && subscription.status === 'trial') {
    return {
      tier: subscription.tier,
      status: 'trial',
      isPremium: true,
      isTrial: true,
      trialDaysRemaining: Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      features: PREMIUM_FEATURES,
    };
  }
  
  return {
    tier: subscription.tier,
    status: subscription.status,
    isPremium: true,
    isTrial: false,
    trialDaysRemaining: 0,
    features: PREMIUM_FEATURES,
  };
}

export const FREE_TIER_FEATURES = {
  kanban: false,
  calendar: false,
  unlimitedProjects: false,
  maxProjects: 1,
  unlimitedSubtasks: false,
  maxSubtasksPerTask: 3,
  unlimitedLabels: false,
  maxLabels: 5,
  allPriorities: false,
  reminders: false,
  richDescriptions: false,
  smartFilters: false,
  dashboard: false,
  pomodoro: false,
  darkMode: false,
  keyboardShortcuts: false,
  quickAdd: false,
  focusMode: false,
  celebrations: false,
};

export const PREMIUM_FEATURES = {
  kanban: true,
  calendar: true,
  unlimitedProjects: true,
  maxProjects: Infinity,
  unlimitedSubtasks: true,
  maxSubtasksPerTask: Infinity,
  unlimitedLabels: true,
  maxLabels: Infinity,
  allPriorities: true,
  reminders: true,
  richDescriptions: true,
  smartFilters: true,
  dashboard: true,
  pomodoro: true,
  darkMode: true,
  keyboardShortcuts: true,
  quickAdd: true,
  focusMode: true,
  celebrations: true,
};
```

### Feature Gate Component

```typescript
// components/FeatureGate.tsx
interface FeatureGateProps {
  feature: PremiumFeature;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { features, isTrial, trialDaysRemaining } = useSubscription();
  
  if (features[feature]) {
    return <>{children}</>;
  }
  
  if (fallback) {
    return <>{fallback}</>;
  }
  
  return (
    <LockedFeatureOverlay
      feature={feature}
      isTrial={isTrial}
      trialDaysRemaining={trialDaysRemaining}
    />
  );
}

function LockedFeatureOverlay({ feature, isTrial, trialDaysRemaining }) {
  const message = isTrial
    ? `This premium feature will be locked in ${trialDaysRemaining} days`
    : 'Upgrade to unlock this feature';
  
  return (
    <div className="feature-locked-overlay">
      <LockIcon className="w-8 h-8" />
      <p>{message}</p>
      <Button onClick={showUpgradeModal}>
        {isTrial ? 'Start Trial' : 'Upgrade to Premium'}
      </Button>
    </div>
  );
}
```

### API Middleware

```python
# backend/middleware/subscription.py
from fastapi import HTTPException, Request
from datetime import datetime

class SubscriptionMiddleware:
    def __init__(self):
        self.premium_features = {
            'kanban', 'calendar', 'unlimited_projects', 'unlimited_subtasks',
            'unlimited_labels', 'all_priorities', 'reminders', 'rich_descriptions',
            'smart_filters', 'dashboard', 'pomodoro', 'dark_mode',
            'keyboard_shortcuts', 'quick_add', 'focus_mode', 'celebrations'
        }
    
    async def check_feature_access(self, request: Request, feature: str):
        user = request.state.user
        subscription = await self.get_subscription(user.id)
        
        if not subscription or subscription.tier == 'free':
            raise HTTPException(
                status_code=403,
                detail={
                    'code': 'PREMIUM_FEATURE_REQUIRED',
                    'message': f'{feature} requires premium subscription',
                    'feature': feature
                }
            )
        
        if subscription.status == 'trial':
            trial_end = subscription.trial_end
            if datetime.utcnow() > trial_end:
                # Trial expired, update status
                await self.expire_trial(subscription.id)
                raise HTTPException(
                    status_code=403,
                    detail={
                        'code': 'TRIAL_EXPIRED',
                        'message': 'Your trial has expired. Upgrade to continue.',
                        'feature': feature
                    }
                )
        
        return True
```

---

## Success Metrics

### Trial Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Trial Signup Rate | >80% of new users | Users starting trial / total signups |
| Trial Activation Rate | >70% | Users completing onboarding / trial starts |
| Trial-to-Paid Conversion | 25-35% | Upgrades / trial completions |
| Trial Retention (Day 7) | >60% | Active on Day 7 / trial starts |
| Trial Retention (Day 14) | >45% | Active on Day 14 / trial starts |

### Revenue Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Monthly Recurring Revenue (MRR) | Growth trajectory | Sum of monthly subscription revenue |
| Annual Recurring Revenue (ARR) | Growth trajectory | MRR × 12 |
| Average Revenue Per User (ARPU) | $3-5/month | Total revenue / total users |
| Customer Lifetime Value (LTV) | >$100 | ARPU × average retention months |
| Churn Rate | <5% monthly | Cancellations / active subscriptions |

### Feature Adoption Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Kanban Adoption | >40% of premium users | Users using Kanban / premium users |
| Calendar Adoption | >30% of premium users | Users using Calendar / premium users |
| Dashboard Usage | >50% weekly active | Users viewing dashboard weekly |
| Pomodoro Usage | >25% of premium users | Users completing sessions |
| Dark Mode Usage | >60% of premium users | Users with dark mode enabled |

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| User signs up multiple times | Prevent trial abuse via email/device fingerprinting |
| Timezone changes affecting trial end | Store trial end as UTC, display in user's timezone |
| Payment failure during trial | Trial continues, payment retry on next attempt |
| User cancels then re-subscribes | New trial not granted, immediate premium access |
| Lifetime purchase during trial | Trial converted to lifetime, pro-rated credit if applicable |
| Feature used at exact trial expiration | Grace period allows completion, save on next action |
| Concurrent subscription changes | Last-write-wins with audit log |
| Refund request | Admin approval, subscription revoked, data preserved |
| Account deletion during trial | Standard deletion flow, no refund needed |
| Upgrade mid-trial | Trial ends, paid subscription begins immediately |

---

## Dependencies

| Feature | Dependency Type | Description |
|---------|-----------------|-------------|
| `auth-jwt.md` | Required | User authentication for subscription checks |
| `task-management.md` | Consumer | Task features gated by subscription |
| `projects-kanban.md` | Consumer | Project/Kanban features gated |
| `analytics.md` | Consumer | Dashboard access gated |
| `pomodoro.md` | Consumer | Timer access gated |
| `dark-mode.md` | Consumer | Theme toggle gated |

---

## Related Specifications

- `@specs/overview.md` - Project overview
- `@specs/features/auth-jwt.md` - Authentication requirements
- `@specs/features/task-management.md` - Core task features
- `@specs/features/projects-kanban.md` - Project and Kanban features
- `@specs/features/analytics.md` - Dashboard and analytics

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 17 Feb 2026 | Initial premium features monetization specification |

---

*This specification follows the principles of the Phase 2 Constitution. Implementation must align with documented requirements, technology stack, and UX standards.*
