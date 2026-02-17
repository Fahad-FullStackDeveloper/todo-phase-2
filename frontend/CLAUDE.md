# TodoFlow Frontend Guidelines

**Stack:** Next.js 16.1.6 + TypeScript + Tailwind CSS + Framer Motion
**Phase:** Phase 1 Complete - Setup & Project Initialization

---

## Project Structure

```
frontend/
├── src/
│   ├── app/                     # App Router pages
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── globals.css          # Global styles
│   │   ├── signin/              # Sign in page
│   │   ├── signup/              # Sign up page
│   │   ├── tasks/               # Task list page
│   │   ├── projects/            # Projects page
│   │   ├── labels/              # Labels page
│   │   ├── calendar/            # Calendar view
│   │   ├── kanban/              # Kanban board
│   │   ├── dashboard/           # Analytics dashboard
│   │   └── focus/               # Focus mode
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── layout/              # Layout components
│   │   ├── tasks/               # Task components
│   │   ├── projects/            # Project components
│   │   └── shared/              # Shared components
│   ├── lib/                     # Utilities
│   │   ├── api.ts               # API client
│   │   ├── utils.ts             # Helper functions
│   │   └── dateFormats.ts       # Date formatting
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts           # Authentication hook
│   │   ├── useTasks.ts          # Task operations
│   │   └── useTheme.ts          # Theme management
│   ├── types/                   # TypeScript types
│   │   └── index.ts             # All type definitions
│   └── config/                  # Configuration
│       └── site.ts              # Site configuration
├── public/                      # Static assets
│   ├── icons/                   # PWA icons
│   └── manifest.json            # PWA manifest
├── package.json                 # Dependencies
├── next.config.js               # Next.js config
├── tailwind.config.js           # Tailwind config
├── tsconfig.json                # TypeScript config
├── postcss.config.js            # PostCSS config
├── .env.example                 # Environment template
└── Dockerfile                   # Container config
```

---

## Patterns

### Server Components Default
All pages and layouts use Server Components by default. Add `'use client'` only when needed:

```tsx
// Server Component (default)
export default async function TasksPage() {
  const tasks = await fetchTasks();
  return <TaskList tasks={tasks} />;
}

// Client Component (when interactivity needed)
'use client';

export function TaskCard({ task }: { task: Task }) {
  const [completed, setCompleted] = useState(task.completed);
  return <button onClick={() => setCompleted(!completed)}>...</button>;
}
```

### API Client Pattern
All backend calls go through `@/lib/api.ts`:

```tsx
import { api } from '@/lib/api';

// In Server Component
const tasks = await api.tasks.list();

// In Client Component
const { data: tasks } = useQuery({
  queryKey: ['tasks'],
  queryFn: () => api.tasks.list(),
});
```

### Component Structure
```tsx
// /src/components/tasks/TaskCard.tsx
'use client';

import { Task } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { PriorityBadge } from './PriorityBadge';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
}

export function TaskCard({ task, onToggle }: TaskCardProps) {
  return (
    <div className="task-card">
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
      />
      <span className={task.completed ? 'line-through' : ''}>
        {task.title}
      </span>
      <PriorityBadge priority={task.priority} />
    </div>
  );
}
```

---

## Styling

### Tailwind CSS
Use Tailwind utility classes. No inline styles.

```tsx
// ✅ Good
<div className="flex items-center gap-2 p-4 bg-card rounded-lg shadow-sm">

// ❌ Avoid
<div style={{ display: 'flex', padding: '1rem' }}>
```

### Custom Components
Extend shadcn/ui components with Tailwind:

```tsx
// Primary button variant
<button className="btn-primary">
  Create Task
</button>

// Task card with priority
<div className="task-card priority-high">
```

### Dark Mode
All components support dark mode via CSS variables:

```tsx
// Uses CSS variables from globals.css
<div className="bg-background text-foreground">
```

---

## State Management

### TanStack Query
Use for server state:

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useTasks() {
  const queryClient = useQueryClient();
  
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.tasks.list(),
  });
  
  const createMutation = useMutation({
    mutationFn: (data: CreateTaskData) => api.tasks.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
  
  return { tasks, isLoading, createTask: createMutation.mutate };
}
```

### Local State
Use React hooks for UI state:

```tsx
const [isOpen, setIsOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
```

---

## Authentication

### JWT Token Handling
Tokens stored in localStorage (httpOnly cookies in production):

```tsx
// Get token
import { getToken } from '@/lib/api';

const token = getToken();

// Attach to requests (automatic via api.ts)
const tasks = await api.tasks.list();
```

### Protected Routes
```tsx
// middleware/auth.ts
import { getToken } from '@/lib/api';
import { redirect } from 'next/navigation';

export function requireAuth() {
  const token = getToken();
  if (!token) {
    redirect('/signin');
  }
}
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | http://localhost:8000 |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Better Auth URL | http://localhost:3000 |
| `NEXT_PUBLIC_ENABLE_PWA` | Enable PWA features | true |

---

## Running the Frontend

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Docker
```bash
docker-compose up frontend
```

---

## Date/Time Display

Use `Intl.DateTimeFormat` for locale-aware formatting:

```tsx
// Format: "17 Feb 2026, 4:30 PM"
function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

// Relative: "Today at 4:30 PM"
function formatRelative(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  
  if (isToday) {
    return `Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  return formatDate(date);
}
```

---

## Animations

### Framer Motion
All animations use Framer Motion:

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
>
  Task Card
</motion.div>
```

### Completion Celebration
```tsx
import confetti from 'canvas-confetti';

function celebrate() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}
```

---

## Spec References

- `@.specify/specs/overview.md` - Complete specification
- `@.specify/specs/features/auth-jwt.md` - Authentication UI
- `@.specify/specs/features/task-management.md` - Task UI
- `@.specify/specs/features/dark-mode.md` - Dark mode
- `@.specify/specs/features/pwa-offline.md` - PWA support

---

## Skills Integration

This frontend uses the following skills:
- `nextjs-structure-enforcer` - Next.js 16+ App Router patterns
- `nextjs-app-router-enforcer` - Server Components default
- `premium-ux-polish` - SaaS-level UX, animations

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 401 on API calls | Check token in localStorage, verify BETTER_AUTH_SECRET |
| Hydration mismatch | Ensure server/client render match, use suppressHydrationWarning |
| CORS errors | Verify NEXT_PUBLIC_API_URL and backend CORS config |
| Theme flicker | Use next-themes with ThemeProvider in layout |
| PWA not installing | Check manifest.json, service worker registration |

---

*Follow Constitution Principle 2 (Monorepo Architecture) and Principle 5 (Premium SaaS UX Standards).*
