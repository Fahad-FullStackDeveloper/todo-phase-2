# Feature: Dark Mode

**Feature ID:** PF-12
**Status:** `draft`
**Constitution Principles:**
- Principle 1: Spec-Driven Development
- Principle 3: JWT Authentication & User Isolation
- Principle 5: Premium SaaS UX Standards

---

## Overview

Dark Mode provides a complete theme toggle system allowing users to switch between light, dark, and system-preference themes. This specification covers theme options, smooth transitions, persistent preferences, comprehensive component theming, system preference detection, and the theme toggle UI pattern.

The implementation must deliver a polished, accessible dark mode experience that rivals industry leaders like Todoist, TickTick, and Linear, with careful attention to color contrast, visual hierarchy, and smooth transitions.

---

## User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-DM-01 | As a user, I can toggle between light and dark themes so that I can use the app comfortably in any lighting | Must Have |
| US-DM-02 | As a user, I can set theme to "System" to follow my device preference so that I don't have to manually switch | Must Have |
| US-DM-03 | As a user, theme changes transition smoothly so that the experience feels polished | Must Have |
| US-DM-04 | As a user, my theme preference persists across sessions so that I don't have to reselect it | Must Have |
| US-DM-05 | As a user, all components are properly themed so that there are no visual inconsistencies | Must Have |
| US-DM-06 | As a user, I can access the theme toggle easily so that I can switch themes quickly | Must Have |
| US-DM-07 | As a user, the app respects my system preference on first visit so that it feels native | Should Have |
| US-DM-08 | As a user, images and media adapt to dark mode so that they don't appear jarring | Should Have |
| US-DM-09 | As a user, charts and visualizations are readable in both themes so that data is always clear | Should Have |
| US-DM-10 | As a user with light sensitivity, I can use dark mode comfortably so that I can work longer | Must Have |

---

## Acceptance Criteria

### Theme Toggle (US-DM-01)

- [ ] Theme toggle accessible from header/user menu
- [ ] Toggle shows current theme with icon (Sun for light, Moon for dark)
- [ ] Click toggle cycles: Light → Dark → System → Light
- [ ] Toggle has accessible label: "Toggle theme, current: [theme]"
- [ ] Keyboard shortcut available (T for toggle, see keyboard-shortcuts.md)
- [ ] Theme change applies immediately across entire app

### Theme Options (US-DM-02)

- [ ] Three theme options: Light, Dark, System
- [ ] Theme selector available in settings page
- [ ] Current theme highlighted/selected in selector
- [ ] Each option shows preview icon
- [ ] System option shows detected system theme: "System (currently Dark)"
- [ ] Selection persists immediately

### Smooth Transitions (US-DM-03)

- [ ] Theme change triggers 300ms color transition
- [ ] All color properties transition: background, text, borders, shadows
- [ ] Transition uses ease-in-out timing function
- [ ] No flash or flicker during transition
- [ ] Transition respects `prefers-reduced-motion`: instant change if enabled
- [ ] Loading states maintain during transition

### Persistent Preference (US-DM-04)

- [ ] Theme preference stored in localStorage
- [ ] Theme preference synced to user profile (for cross-device)
- [ ] Preference loads on app initialization
- [ ] Preference survives browser restart
- [ ] Preference survives logout/login
- [ ] Clear cache resets to system preference

### Component Theming (US-DM-05)

- [ ] All pages themed: Tasks, Calendar, Projects, Dashboard, Settings
- [ ] All components themed: Cards, Modals, Dropdowns, Inputs, Buttons
- [ ] All states themed: Hover, Focus, Active, Disabled
- [ ] All feedback themed: Success, Error, Warning, Info toasts
- [ ] All overlays themed: Modals, Popovers, Tooltips, Context menus
- [ ] All charts themed: Colors adapt for dark background
- [ ] All icons themed: Appropriate contrast in both themes

### Theme Toggle UI (US-DM-06)

- [ ] Toggle visible in header navigation
- [ ] Toggle accessible via keyboard (Tab navigation)
- [ ] Toggle shows tooltip: "Toggle theme (T)"
- [ ] Toggle icon animates on change (sun/moon rotation)
- [ ] Toggle size: minimum 44x44px touch target
- [ ] Toggle visible on all pages

### System Preference Detection (US-DM-07)

- [ ] First visit: detect system preference via `prefers-color-scheme`
- [ ] System preference used as default theme
- [ ] System theme change detected in real-time (when in System mode)
- [ ] System detection works on all major browsers
- [ ] Fallback to light theme if detection unavailable
- [ ] Welcome message mentions theme: "We've set your theme to match your system"

### Image & Media Adaptation (US-DM-08)

- [ ] Images reduce brightness slightly in dark mode (90%)
- [ ] Images add subtle dark overlay in dark mode
- [ ] SVG icons use theme-appropriate colors
- [ ] Avatar images maintain natural appearance
- [ ] Embedded content (iframes) themed when possible
- [ ] Code blocks use dark-friendly syntax highlighting

### Chart & Visualization Theming (US-DM-09)

- [ ] Chart backgrounds adapt to theme
- [ ] Chart text colors maintain contrast
- [ ] Chart grid lines subtle in both themes
- [ ] Data colors adjusted for dark background (slightly desaturated)
- [ ] Legend text readable in both themes
- [ ] Tooltip backgrounds themed appropriately

### Accessibility (US-DM-10)

- [ ] Dark mode maintains WCAG 2.1 AA contrast ratios
- [ ] Text contrast minimum 4.5:1 in dark mode
- [ ] UI component contrast minimum 3:1 in dark mode
- [ ] No pure black (#000) backgrounds (use #1A1A1A or similar)
- [ ] No pure white (#FFF) text on dark (use #E5E5E5 or similar)
- [ ] Reduced glare design: muted backgrounds, soft shadows

---

## Technical Requirements

### Theme Configuration

```typescript
// Theme types
type Theme = 'light' | 'dark' | 'system';

// Theme context structure
interface ThemeContext {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
```

### CSS Variables (Light Theme)

```css
:root[data-theme='light'] {
  /* Backgrounds */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;
  --bg-tertiary: #F3F4F6;
  --bg-elevated: #FFFFFF;
  
  /* Text */
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --text-tertiary: #9CA3AF;
  --text-inverse: #FFFFFF;
  
  /* Borders */
  --border-primary: #E5E7EB;
  --border-secondary: #F3F4F6;
  
  /* Interactive */
  --interactive-hover: #F3F4F6;
  --interactive-active: #E5E7EB;
  --interactive-focus: #3B82F6;
  
  /* Semantic Colors */
  --success-bg: #DCFCE7;
  --success-text: #166534;
  --error-bg: #FEE2E2;
  --error-text: #991B1B;
  --warning-bg: #FEF3C7;
  --warning-text: #92400E;
  --info-bg: #DBEAFE;
  --info-text: #1E40AF;
  
  /* Priority Colors */
  --priority-urgent: #EF4444;
  --priority-high: #F97316;
  --priority-medium: #3B82F6;
  --priority-low: #6B7280;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Overlays */
  --overlay-bg: rgba(0, 0, 0, 0.5);
  --backdrop-blur: blur(4px);
}
```

### CSS Variables (Dark Theme)

```css
:root[data-theme='dark'] {
  /* Backgrounds */
  --bg-primary: #1A1A1A;
  --bg-secondary: #242424;
  --bg-tertiary: #2D2D2D;
  --bg-elevated: #333333;
  
  /* Text */
  --text-primary: #E5E5E5;
  --text-secondary: #A3A3A3;
  --text-tertiary: #737373;
  --text-inverse: #111827;
  
  /* Borders */
  --border-primary: #404040;
  --border-secondary: #2D2D2D;
  
  /* Interactive */
  --interactive-hover: #2D2D2D;
  --interactive-active: #404040;
  --interactive-focus: #60A5FA;
  
  /* Semantic Colors */
  --success-bg: #14532D;
  --success-text: #86EFAC;
  --error-bg: #7F1D1D;
  --error-text: #FCA5A5;
  --warning-bg: #78350F;
  --warning-text: #FCD34D;
  --info-bg: #1E3A5F;
  --info-text: #93C5FD;
  
  /* Priority Colors (adjusted for dark) */
  --priority-urgent: #F87171;
  --priority-high: #FB923C;
  --priority-medium: #60A5FA;
  --priority-low: #A3A3A3;
  
  /* Shadows (lighter for dark mode) */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  
  /* Overlays */
  --overlay-bg: rgba(0, 0, 0, 0.7);
  --backdrop-blur: blur(8px);
  
  /* Image adjustments */
  --image-brightness: 0.9;
  --image-contrast: 1.1;
}
```

### Theme Transition CSS

```css
/* Apply transition to all themeable properties */
:root {
  --theme-transition: background-color 300ms ease-in-out,
                      color 300ms ease-in-out,
                      border-color 300ms ease-in-out,
                      box-shadow 300ms ease-in-out;
}

/* Apply to all elements */
*, *::before, *::after {
  transition: var(--theme-transition);
}

/* Exclude elements that shouldn't transition */
.no-theme-transition,
.no-theme-transition *,
img,
video,
canvas {
  transition: none;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  :root {
    --theme-transition: none;
  }
}
```

### Theme Detection Hook

```typescript
// useTheme.ts
import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

const THEME_KEY = 'todoflow-theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored;
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Resolve system preference
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  }, []);

  // Update resolved theme
  useEffect(() => {
    if (theme === 'system') {
      setResolvedTheme(getSystemTheme());
    } else {
      setResolvedTheme(theme);
    }
  }, [theme, getSystemTheme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  // Listen for system changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  // Sync to user profile (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      // API call to sync theme preference
      // syncThemeToProfile(theme);
    }, 1000);

    return () => clearTimeout(timer);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, []);

  return { theme, resolvedTheme, setTheme, toggleTheme };
}
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/api/users/preferences` | Yes | Update user preferences including theme |
| GET | `/api/users/preferences` | Yes | Get user preferences |

### Request/Response Schemas

#### PUT /api/users/preferences

**Request Body:**
```json
{
  "theme": "dark"
}
```

**Success Response (200):**
```json
{
  "preferences": {
    "theme": "dark",
    "timezone": "America/New_York",
    "locale": "en-US",
    "notifications_enabled": true
  }
}
```

---

## UX Requirements

### Theme Toggle Component

```
Header Toggle:
┌─────────────────────────────────────────┐
│  [Logo]  Tasks  Calendar  ...   [🌙] 👤 │
│                                    ▲    │
│                              Theme toggle
└─────────────────────────────────────────┘

Toggle States:
Light:  ☀️ (sun icon)
Dark:   🌙 (moon icon)
System: 💻 (monitor icon with auto indicator)
```

### Theme Selector (Settings)

```
┌─────────────────────────────────────────┐
│  Theme                                  │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┐ ┌─────────────┐       │
│  │      ☀️     │ │      🌙     │       │
│  │   Light     │ │    Dark     │       │
│  │             │ │             │       │
│  │  Preview    │ │  Preview    │       │
│  │  of light   │ │  of dark    │       │
│  │  theme      │ │  theme      │       │
│  └─────────────┘ └─────────────┘       │
│                                         │
│  ┌─────────────┐                        │
│  │     💻      │                        │
│  │   System    │                        │
│  │             │                        │
│  │  Follows    │                        │
│  │  your       │                        │
│  │  device     │                        │
│  │  Currently: Dark                      │
│  └─────────────┘                        │
│                                         │
│  Current selection: [Dark] ✓            │
└─────────────────────────────────────────┘
```

### Icon Animation

```typescript
// Framer Motion animation for theme toggle
const iconAnimation = {
  light: { rotate: 0, scale: 1 },
  dark: { rotate: 180, scale: 1 },
  system: { rotate: 360, scale: [1, 0.8, 1] },
  transition: { duration: 0.3, ease: 'easeInOut' },
};
```

### Component Theming Examples

#### Card Component

```css
/* Light */
.card-light {
  background: var(--bg-elevated);
  border: 1px solid var(--border-primary);
  box-shadow: var(--shadow-md);
}

/* Dark */
.card-dark {
  background: var(--bg-elevated); /* #333333 */
  border: 1px solid var(--border-primary); /* #404040 */
  box-shadow: var(--shadow-md);
}
```

#### Input Component

```css
/* Light */
.input-light {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
}

.input-light::placeholder {
  color: var(--text-tertiary);
}

/* Dark */
.input-dark {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
}

.input-dark::placeholder {
  color: var(--text-tertiary);
}
```

#### Modal Component

```css
/* Light */
.modal-light {
  background: var(--bg-elevated);
  box-shadow: var(--shadow-lg);
}

.modal-overlay-light {
  background: var(--overlay-bg); /* rgba(0,0,0,0.5) */
  backdrop-filter: var(--backdrop-blur);
}

/* Dark */
.modal-dark {
  background: var(--bg-elevated); /* #333333 */
  box-shadow: var(--shadow-lg);
}

.modal-overlay-dark {
  background: var(--overlay-bg); /* rgba(0,0,0,0.7) */
  backdrop-filter: var(--backdrop-blur);
}
```

### Image Adjustments

```css
/* Dark mode image adjustments */
[data-theme='dark'] img,
[data-theme='dark'] video {
  filter: brightness(var(--image-brightness)) contrast(var(--image-contrast));
}

/* Avatar exception - maintain natural colors */
[data-theme='dark'] img.avatar {
  filter: none;
}
```

### Chart Theming

```typescript
// Chart.js theme configuration
const getChartColors = (theme: 'light' | 'dark') => ({
  textColor: theme === 'dark' ? '#A3A3A3' : '#6B7280',
  gridColor: theme === 'dark' ? '#404040' : '#E5E7EB',
  backgroundColor: theme === 'dark' ? '#242424' : '#FFFFFF',
  tooltip: {
    backgroundColor: theme === 'dark' ? '#333333' : '#FFFFFF',
    titleColor: theme === 'dark' ? '#E5E5E5' : '#111827',
    bodyColor: theme === 'dark' ? '#A3A3A3' : '#6B7280',
    borderColor: theme === 'dark' ? '#404040' : '#E5E7EB',
  },
});
```

### Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `T` | Toggle theme | Global |
| `D` | Switch to dark | Global |
| `L` | Switch to light | Global |
| `S` | Switch to system | Global |

### Accessibility

- Theme toggle has accessible name and current state
- Screen reader announces theme change
- All interactive elements maintain focus visibility in both themes
- Color contrast meets WCAG 2.1 AA in both themes
- Reduced motion respected for theme transitions
- Keyboard navigation works in both themes

### Responsive Behavior

- Theme toggle visible on all screen sizes
- Mobile: Toggle in header or settings menu
- Tablet/Desktop: Toggle always visible in header

---

## Dependencies

| Feature | Dependency Type | Description |
|---------|-----------------|-------------|
| `auth-jwt.md` | Required | User preference storage |
| `keyboard-shortcuts.md` | Consumer | Theme toggle shortcut |

---

## Related Specifications

- `@specs/overview.md` - Project overview
- `@specs/features/auth-jwt.md` - JWT authentication
- `@specs/features/keyboard-shortcuts.md` - Keyboard shortcuts
- `@specs/ui/components.md` - Component library

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Dark Mode Adoption | >40% of users use dark mode | Theme analytics |
| Theme Toggle Usage | >60% of users toggle at least once | Interaction analytics |
| System Theme Usage | >30% use system theme | Theme analytics |
| Theme Load Time | <50ms | Time to apply theme on load |
| Contrast Compliance | 100% WCAG 2.1 AA | Automated testing |

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| First visit with no system preference | Default to light theme |
| System theme changes while using app | Update immediately if in System mode |
| LocalStorage unavailable | Fall back to system detection |
| User profile sync fails | Use localStorage, retry on next session |
| Old browser without CSS variables | Provide fallback styles |
| Reduced motion enabled | Instant theme change, no transition |
| Third-party content (iframes) | Cannot theme, add border/warning |
| Printed content | Force light theme for print media |

---

*This specification follows the principles of the Phase 2 Constitution. Implementation must align with documented requirements, technology stack, and UX standards.*
