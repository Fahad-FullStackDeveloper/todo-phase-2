/**
 * Keyboard Shortcuts Configuration
 *
 * Defines all keyboard shortcuts for the application
 */

export interface Shortcut {
  id: string;
  keys: string;
  description: string;
  category: 'global' | 'navigation' | 'task' | 'priority';
  action?: () => void;
  disabled?: boolean;
}

/**
 * Global shortcuts (always active except in inputs)
 */
export const globalShortcuts: Shortcut[] = [
  {
    id: 'new-task',
    keys: 'n',
    description: 'Create new task',
    category: 'global',
  },
  {
    id: 'search',
    keys: '/',
    description: 'Open search',
    category: 'global',
  },
  {
    id: 'toggle-theme',
    keys: 't',
    description: 'Toggle theme',
    category: 'global',
  },
  {
    id: 'help',
    keys: '?',
    description: 'Show keyboard shortcuts help',
    category: 'global',
  },
  {
    id: 'close',
    keys: 'escape',
    description: 'Close modal/dropdown',
    category: 'global',
  },
];

/**
 * Navigation shortcuts (G + key chords)
 */
export const navigationShortcuts: Shortcut[] = [
  {
    id: 'go-tasks',
    keys: 'g t',
    description: 'Go to Tasks',
    category: 'navigation',
  },
  {
    id: 'go-calendar',
    keys: 'g c',
    description: 'Go to Calendar',
    category: 'navigation',
  },
  {
    id: 'go-projects',
    keys: 'g p',
    description: 'Go to Projects',
    category: 'navigation',
  },
  {
    id: 'go-dashboard',
    keys: 'g d',
    description: 'Go to Dashboard',
    category: 'navigation',
  },
  {
    id: 'go-kanban',
    keys: 'g k',
    description: 'Go to Kanban',
    category: 'navigation',
  },
  {
    id: 'go-focus',
    keys: 'g f',
    description: 'Go to Focus Mode',
    category: 'navigation',
  },
];

/**
 * Task list shortcuts (active when task list is focused)
 */
export const taskShortcuts: Shortcut[] = [
  {
    id: 'next-task',
    keys: 'j',
    description: 'Next task',
    category: 'task',
  },
  {
    id: 'prev-task',
    keys: 'k',
    description: 'Previous task',
    category: 'task',
  },
  {
    id: 'toggle-complete',
    keys: 'space',
    description: 'Toggle task complete',
    category: 'task',
  },
  {
    id: 'edit-task',
    keys: 'enter',
    description: 'Edit task',
    category: 'task',
  },
  {
    id: 'delete-task',
    keys: 'delete',
    description: 'Delete task',
    category: 'task',
  },
  {
    id: 'open-labels',
    keys: 'l',
    description: 'Open labels picker',
    category: 'task',
  },
];

/**
 * Priority shortcuts (when creating/editing tasks)
 */
export const priorityShortcuts: Shortcut[] = [
  {
    id: 'priority-urgent',
    keys: '!',
    description: 'Set priority to Urgent',
    category: 'priority',
  },
  {
    id: 'priority-high',
    keys: '#',
    description: 'Set priority to High',
    category: 'priority',
  },
  {
    id: 'priority-medium',
    keys: '$',
    description: 'Set priority to Medium',
    category: 'priority',
  },
  {
    id: 'priority-low',
    keys: '~',
    description: 'Set priority to Low',
    category: 'priority',
  },
];

/**
 * All shortcuts combined
 */
export const allShortcuts: Shortcut[] = [
  ...globalShortcuts,
  ...navigationShortcuts,
  ...taskShortcuts,
  ...priorityShortcuts,
];

/**
 * Get shortcuts by category
 */
export function getShortcutsByCategory(category: Shortcut['category']): Shortcut[] {
  return allShortcuts.filter(s => s.category === category);
}

/**
 * Format shortcut keys for display
 */
export function formatShortcutKeys(keys: string): string {
  return keys
    .split(' ')
    .map(key => {
      const keyMap: Record<string, string> = {
        'escape': 'Esc',
        'delete': 'Del',
        'backspace': '⌫',
        'enter': '↵',
        'space': 'Space',
        'arrowup': '↑',
        'arrowdown': '↓',
        'arrowleft': '←',
        'arrowright': '→',
      };
      return keyMap[key.toLowerCase()] || key.toUpperCase();
    })
    .join(' + ');
}

/**
 * Check if user is typing in an input element
 */
export function isTypingInInput(): boolean {
  if (typeof document === 'undefined') return false;
  
  const activeElement = document.activeElement;
  if (!activeElement) return false;
  
  const tagName = activeElement.tagName.toLowerCase();
  const isInput = tagName === 'input' || tagName === 'textarea';
  const isContentEditable = activeElement.getAttribute('contenteditable') === 'true';
  
  return isInput || isContentEditable;
}

/**
 * Normalize key for comparison
 */
export function normalizeKey(key: string): string {
  return key.toLowerCase().replace('key', '');
}
