---
name: premium-ux-polish
description: Enforces SaaS-level UX polish, animations, feedback, accessibility
---

# Premium UX & Polish Skill

Frontend UI/UX rules:

- Loading states: use skeletons (shadcn/ui Skeleton) everywhere
- Success/error feedback: sonner toasts (toast.success, toast.error)
- Animations: Framer Motion for:
  - task add/remove (fade + scale)
  - drag feedback
  - modal open/close
  - list reordering
- Hover & focus: subtle scale (1.02), ring, background change
- Mobile: touch-friendly, vaul drawers for modals on small screens
- Accessibility:
  - ARIA labels/roles on interactive elements
  - Keyboard navigation (focus trap in modals)
  - High contrast mode support
  - Screen reader friendly (no visually-hidden text abuse)
- Delight moments:
  - Confetti on task completion streak (optional)
  - Smooth progress indicators (Pomodoro timer)
  - Cmd+K command palette for quick actions
- Theme: dark/light/system via next-themes, respect system preference
- Error states: friendly messages + retry buttons
- Performance: suspense boundaries, lazy load heavy components

Always prefer micro-interactions that feel premium and responsive.