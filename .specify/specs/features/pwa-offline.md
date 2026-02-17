# Feature: PWA & Offline Support

**Feature ID:** PF-14
**Status:** `draft`
**Constitution Principles:**
- Principle 1: Spec-Driven Development
- Principle 3: JWT Authentication & User Isolation
- Principle 5: Premium SaaS UX Standards

---

## Overview

Progressive Web App (PWA) support enables TodoFlow to function as an installable application with offline capabilities. This specification covers install prompts, offline task viewing, optimistic UI updates, sync on reconnect, service worker caching strategies, and app manifest configuration.

The implementation must deliver a seamless native-app-like experience that allows users to view and interact with tasks even without an internet connection, with automatic synchronization when connectivity is restored.

---

## User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-PW-01 | As a user, I can install the app on my device so that I can access it like a native application | Must Have |
| US-PW-02 | As a user, I can view my tasks offline so that I can stay productive without internet | Must Have |
| US-PW-03 | As a user, I can create and edit tasks offline so that I can capture ideas anytime | Must Have |
| US-PW-04 | As a user, my offline changes sync when I reconnect so that I don't lose any work | Must Have |
| US-PW-05 | As a user, I see optimistic UI updates so that the app feels responsive | Must Have |
| US-PW-06 | As a user, I'm notified when I'm offline so that I understand the app state | Must Have |
| US-PW-07 | As a user, I see sync status when reconnecting so that I know my changes are saved | Should Have |
| US-PW-08 | As a user, the app icon and splash screen look professional so that it feels like a real app | Should Have |
| US-PW-09 | As a user, I can use keyboard shortcuts in the installed app so that I'm productive | Should Have |
| US-PW-10 | As a user, push notifications work even when the app is closed so that I don't miss reminders | Could Have |

---

## Acceptance Criteria

### Install Prompt (US-PW-01)

- [ ] Install prompt appears on supported devices (desktop Chrome, Edge, Android)
- [ ] Prompt appears after user has visited app 2+ times
- [ ] Custom install banner matches app branding
- [ ] Install banner shows app icon, name, and benefits
- [ ] "Install" button triggers browser install flow
- [ ] "Not now" dismisses banner (can be shown again later)
- [ ] After install, banner doesn't show again
- [ ] iOS: Show instructions for "Add to Home Screen" via Safari share menu
- [ ] Installed app opens in standalone window (no browser chrome)

### Offline Task Viewing (US-PW-02)

- [ ] Cached tasks visible when offline
- [ ] Last synced data displayed with timestamp: "Last synced: 2 hours ago"
- [ ] Offline indicator visible in header when connection lost
- [ ] Cached data includes: tasks, projects, labels, user preferences
- [ ] Cache stores last 500 tasks per user (configurable)
- [ ] Search works offline with cached data
- [ ] Filter and sort work offline with cached data
- [ ] Calendar view works offline with cached data

### Offline Task Creation/Editing (US-PW-03)

- [ ] Create task button enabled when offline
- [ ] Edit task form enabled when offline
- [ ] Delete action enabled when offline
- [ ] Offline changes queued for sync
- [ ] Offline tasks show pending indicator (clock icon)
- [ ] Offline edits show pending indicator
- [ ] Offline deletions show as strikethrough with pending indicator
- [ ] Queue persists across browser restarts
- [ ] Maximum 100 pending operations (warn at 50)

### Sync on Reconnect (US-PW-04)

- [ ] Sync triggers automatically when connection restored
- [ ] Sync processes queued operations in order
- [ ] Successful syncs show confirmation: "All changes synced"
- [ ] Failed syncs show error with retry option
- [ ] Conflict detection: server changes vs local changes
- [ ] Conflict resolution: user prompted to choose (local vs server)
- [ ] Sync status visible: "Syncing...", "Synced", "Sync failed"
- [ ] Manual sync trigger available (pull-to-refresh or sync button)

### Optimistic UI Updates (US-PW-05)

- [ ] Task creation shows immediately in list
- [ ] Task updates reflect immediately
- [ ] Task deletion removes immediately from view
- [ ] Failed operations revert with error notification
- [ ] Undo option available for 5 seconds after destructive actions
- [ ] Loading states show during async operations
- [ ] Skeleton loaders match content layout

### Offline Notification (US-PW-06)

- [ ] Offline banner appears when connection lost
- [ ] Banner shows: "You're offline. Changes will sync when connected."
- [ ] Banner dismissible but reappears on new offline actions
- [ ] Connection status icon in header (wifi/wifi-off)
- [ ] Toast notification when going offline
- [ ] Toast notification when coming back online

### Sync Status Display (US-PW-07)

- [ ] Sync status visible in header or status bar
- [ ] States: "Synced", "Syncing...", "Pending changes", "Sync failed"
- [ ] Pending changes count shown: "3 pending changes"
- [ ] Click status to view sync details
- [ ] Manual sync button when pending changes exist
- [ ] Last sync timestamp accessible

### App Icon & Splash Screen (US-PW-08)

- [ ] App icon: 512x512 PNG with app logo
- [ ] Maskable icon provided for Android
- [ ] Favicon: multiple sizes (16x16, 32x32, 180x180)
- [ ] Splash screen matches app branding
- [ ] Splash screen shows app logo and name
- [ ] Theme color matches app primary color
- [ ] Background color for splash screen defined

### Keyboard Shortcuts in PWA (US-PW-09)

- [ ] All global shortcuts work in installed app
- [ ] Shortcuts don't conflict with browser shortcuts
- [ ] Shortcut help modal accessible
- [ ] Shortcuts work offline

### Push Notifications (US-PW-10)

- [ ] Push notification permission requested
- [ ] Notifications work when app is closed
- [ ] Notifications work when device is locked
- [ ] Click notification opens app to relevant task
- [ ] Notifications respect system Do Not Disturb
- [ ] Notification preferences in settings
- [ ] Fallback to local notifications if push unavailable

---

## Technical Requirements

### App Manifest (manifest.json)

```json
{
  "name": "TodoFlow - Task Management",
  "short_name": "TodoFlow",
  "description": "Premium task management for productive teams",
  "start_url": "/tasks",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#3B82F6",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "categories": ["productivity", "utilities"],
  "screenshots": [
    {
      "src": "/screenshots/task-list.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile-view.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "shortcuts": [
    {
      "name": "New Task",
      "short_name": "New Task",
      "description": "Create a new task",
      "url": "/tasks?quick-add=true",
      "icons": [{ "src": "/icons/shortcut-new-task.png", "sizes": "96x96" }]
    },
    {
      "name": "Today's Tasks",
      "short_name": "Today",
      "description": "View tasks due today",
      "url": "/tasks?due=today",
      "icons": [{ "src": "/icons/shortcut-today.png", "sizes": "96x96" }]
    }
  ]
}
```

### Service Worker Registration

```typescript
// service-worker-registration.ts
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          '/sw.js',
          { scope: '/' }
        );

        console.log('SW registered:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available
                showUpdatePrompt();
              }
            });
          }
        });
      } catch (error) {
        console.error('SW registration failed:', error);
      }
    });
  }
}
```

### Service Worker Caching Strategy

```javascript
// sw.js - Service Worker
const CACHE_NAME = 'todoflow-v1';
const STATIC_CACHE = 'todoflow-static-v1';
const DATA_CACHE = 'todoflow-data-v1';

const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DATA_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first for API, cache first for static
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests - network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Static assets - cache first, fallback to network
  if (request.destination === 'image' || 
      request.destination === 'style' || 
      request.destination === 'script') {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Navigation - network first, fallback to offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Default - network first
  event.respondWith(networkFirstStrategy(request));
});

async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DATA_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    
    // Return offline response for GET requests
    if (request.method === 'GET') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

async function cacheFirstStrategy(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

// Background sync for offline mutations
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tasks') {
    event.waitUntil(syncTasks());
  }
});

async function syncTasks() {
  // Get pending operations from IndexedDB
  const pendingOps = await getPendingOperations();
  
  for (const op of pendingOps) {
    try {
      await fetch(op.url, {
        method: op.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(op.body),
      });
      await removePendingOperation(op.id);
    } catch (error) {
      // Keep operation in queue for retry
      console.error('Sync failed for operation:', op.id);
    }
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'TodoFlow', {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      data: { url: data.url || '/tasks' },
      tag: data.taskId,
    })
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const url = event.notification.data.url;
      
      // Focus existing window if open
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
```

### Offline Queue Management

```typescript
// offline-queue.ts
interface PendingOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entityType: 'task' | 'project' | 'label' | 'subtask';
  entityId?: string;
  url: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  createdAt: number;
  retryCount: number;
}

class OfflineQueue {
  private dbName = 'TodoFlowOffline';
  private storeName = 'pendingOperations';
  private db: IDBDatabase | null = null;

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
      
      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async add(operation: Omit<PendingOperation, 'id' | 'createdAt' | 'retryCount'>) {
    if (!this.db) await this.init();
    
    const newOp: PendingOperation = {
      ...operation,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      retryCount: 0,
    };
    
    return new Promise<void>((resolve, reject) => {
      const tx = this.db!.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      store.add(newOp);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getAll(): Promise<PendingOperation[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async remove(id: string) {
    if (!this.db) await this.init();
    
    return new Promise<void>((resolve, reject) => {
      const tx = this.db!.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async clear() {
    if (!this.db) await this.init();
    
    return new Promise<void>((resolve, reject) => {
      const tx = this.db!.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      store.clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getCount(): Promise<number> {
    const ops = await this.getAll();
    return ops.length;
  }
}

export const offlineQueue = new OfflineQueue();
```

### Connection Status Hook

```typescript
// useConnectionStatus.ts
import { useState, useEffect } from 'react';

export function useConnectionStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
}
```

### Install Prompt Hook

```typescript
// useInstallPrompt.ts
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = 
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return { isInstallable, promptInstall };
}
```

---

## UX Requirements

### Offline Banner

```
┌─────────────────────────────────────────┐
│  ⚠️  You're offline. Changes will sync  │
│     when connected.              [✕]    │
└─────────────────────────────────────────┘
```

- **Position**: Top of app, below header
- **Style**: Warning color background (amber/yellow)
- **Dismissible**: X button to hide temporarily
- **Reappears**: On new offline actions

### Connection Status Icon

```
Header Status:
Online:  📶 (wifi icon, green)
Offline: 📶̷ (wifi-off icon, gray)
Syncing: 🔄 (spinner animation)
```

### Sync Status Indicator

```
┌─────────────────────────────────────────┐
│  ✓ All changes synced                   │
│  or                                     │
│  🔄 Syncing... (3 items)                │
│  or                                     │
│  ⏳ 3 pending changes      [Sync Now]   │
│  or                                     │
│  ⚠️ Sync failed            [Retry]      │
└─────────────────────────────────────────┘
```

### Install Banner

```
┌─────────────────────────────────────────┐
│  📲 Install TodoFlow                    │
│                                         │
│  Access your tasks faster with our      │
│  desktop app. Works offline!            │
│                                         │
│  [Install]  [Not Now]                   │
└─────────────────────────────────────────┘
```

### Pending Changes Indicator

```
Task with pending changes:
┌─────────────────────────────────────────┐
│  ☐ Task Title                    🕐    │
│     (Pending sync)                      │
└─────────────────────────────────────────┘
```

### Empty States

- **Offline with No Cache**:
  ```
  ┌─────────────────────────────────────────┐
  │                                         │
  │     📶 You're Offline                   │
  │                                         │
  │     No cached data available.           │
  │     Connect to the internet to load     │
  │     your tasks.                         │
  │                                         │
  │     [Retry Connection]                  │
  │                                         │
  └─────────────────────────────────────────┘
  ```

### Animations (Framer Motion)

```typescript
// Offline banner slide in
const offlineBanner = {
  initial: { y: -100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -100, opacity: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 25 },
};

// Sync status pulse
const syncPulse = {
  scale: [1, 1.05, 1],
  opacity: [1, 0.7, 1],
  transition: { duration: 1.5, repeat: Infinity },
};

// Install banner slide up
const installBanner = {
  initial: { y: '100%', opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: '100%', opacity: 0 },
  transition: { duration: 0.3 },
};
```

### Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `R` | Retry sync | When sync failed |
| `S` | Manual sync | Global |

### Accessibility

- Offline status announced to screen readers
- Sync status changes announced via ARIA live regions
- Install prompt accessible via keyboard
- All status icons have text alternatives
- Color not sole means of conveying status

### Responsive Behavior

- **Desktop**: Install prompt as banner
- **Mobile**: Install prompt as bottom sheet
- **Tablet**: Adaptive based on OS

---

## Dependencies

| Feature | Dependency Type | Description |
|---------|-----------------|-------------|
| `auth-jwt.md` | Required | Authentication for API calls |
| `task-management.md` | Required | Task data caching |
| `due-dates-reminders.md` | Consumer | Push notifications for reminders |

---

## Related Specifications

- `@specs/overview.md` - Project overview
- `@specs/features/task-management.md` - Task management
- `@specs/features/due-dates-reminders.md` - Reminders and notifications
- `@specs/features/keyboard-shortcuts.md` - Keyboard shortcuts

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| PWA Install Rate | >20% of eligible users install | Install analytics |
| Offline Usage | >30% of users use offline mode | Usage analytics |
| Sync Success Rate | >99% of syncs succeed | Sync analytics |
| Cache Hit Rate | >80% for offline viewing | Service worker analytics |
| Install Banner Dismissal | <50% dismiss without installing | Banner analytics |

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| No storage space for cache | Clear oldest cached data, keep recent |
| Very large offline queue | Process in batches, show progress |
| Conflicting changes during sync | Show conflict resolution UI |
| Service worker update fails | Continue with current version, retry later |
| Push notification permission denied | Fall back to local notifications |
| iOS install (no PWA prompt) | Show manual instructions |
| App opened while syncing | Show sync progress, allow interaction |
| Token expired while offline | Queue requests, prompt login on reconnect |

---

*This specification follows the principles of the Phase 2 Constitution. Implementation must align with documented requirements, technology stack, and UX standards.*
