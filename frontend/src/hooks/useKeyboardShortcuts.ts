/**
 * Keyboard Shortcuts Hook
 *
 * Manages global keyboard shortcuts with:
 * - Input detection (disable shortcuts when typing)
 * - G-key chord navigation
 * - Focus management
 * - Customizable shortcuts
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

import {
  globalShortcuts,
  navigationShortcuts,
  taskShortcuts,
  isTypingInInput,
  normalizeKey,
  formatShortcutKeys,
} from '@/lib/shortcuts/config';

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  onNewTask?: () => void;
  onSearch?: () => void;
  onHelp?: () => void;
  onTaskAction?: (action: string) => void;
}

interface ShortcutHandlers {
  [key: string]: () => void;
}

export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions = {}) {
  const {
    enabled = true,
    onNewTask,
    onSearch,
    onHelp,
    onTaskAction,
  } = options;

  const router = useRouter();
  const { setTheme, theme } = useTheme();
  
  // Track G-key chord state
  const gKeyPressedRef = useRef(false);
  const gKeyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track last keys for chord detection
  const keySequenceRef = useRef<string[]>([]);

  /**
   * Handle navigation shortcuts
   */
  const handleNavigation = useCallback((key: string) => {
    const routes: Record<string, string> = {
      't': '/tasks',
      'c': '/calendar',
      'p': '/projects',
      'd': '/dashboard',
      'k': '/kanban',
      'f': '/focus',
    };

    const route = routes[key.toLowerCase()];
    if (route) {
      router.push(route);
      toast.success('Navigated', { description: `Going to ${route}` });
    }
  }, [router]);

  /**
   * Handle priority shortcuts
   */
  const handlePriorityShortcut = useCallback((key: string) => {
    const priorityMap: Record<string, string> = {
      '!': 'urgent',
      '#': 'high',
      '$': 'medium',
      '~': 'low',
    };

    const priority = priorityMap[key];
    if (priority && onTaskAction) {
      onTaskAction(`set-priority-${priority}`);
      toast.success('Priority set', { description: `Priority: ${priority}` });
    }
  }, [onTaskAction]);

  /**
   * Main keyboard event handler
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const key = normalizeKey(event.key);
    const isInput = isTypingInInput();

    // Always allow Escape to close modals
    if (key === 'escape') {
      if (onTaskAction) {
        onTaskAction('close');
      }
      return;
    }

    // Skip most shortcuts when typing in inputs
    if (isInput) {
      return;
    }

    // Handle G-key chords for navigation
    if (key === 'g') {
      gKeyPressedRef.current = true;
      
      // Clear existing timeout
      if (gKeyTimeoutRef.current) {
        clearTimeout(gKeyTimeoutRef.current);
      }
      
      // Set timeout to reset G key state
      gKeyTimeoutRef.current = setTimeout(() => {
        gKeyPressedRef.current = false;
        keySequenceRef.current = [];
      }, 800);
      
      return;
    }

    // Check for G-key chord navigation
    if (gKeyPressedRef.current) {
      handleNavigation(key);
      gKeyPressedRef.current = false;
      if (gKeyTimeoutRef.current) {
        clearTimeout(gKeyTimeoutRef.current);
      }
      return;
    }

    // Handle global shortcuts
    const globalShortcut = globalShortcuts.find(s => s.keys === key && !s.disabled);
    if (globalShortcut) {
      event.preventDefault();
      
      switch (globalShortcut.id) {
        case 'new-task':
          if (onNewTask) {
            onNewTask();
          } else {
            toast.info('New Task', { description: 'Press "N" to create a task' });
          }
          break;
        case 'search':
          if (onSearch) {
            onSearch();
          } else {
            toast.info('Search', { description: 'Press "/" to search' });
          }
          break;
        case 'toggle-theme':
          setTheme(theme === 'dark' ? 'light' : 'dark');
          toast.success('Theme toggled');
          break;
        case 'help':
          if (onHelp) {
            onHelp();
          }
          break;
      }
      return;
    }

    // Handle task shortcuts
    const taskShortcut = taskShortcuts.find(s => s.keys === key && !s.disabled);
    if (taskShortcut && onTaskAction) {
      event.preventDefault();
      onTaskAction(taskShortcut.id);
      return;
    }

    // Handle priority shortcuts
    handlePriorityShortcut(key);
  }, [enabled, handleNavigation, handlePriorityShortcut, onNewTask, onSearch, onHelp, onTaskAction, setTheme, theme]);

  /**
   * Set up keyboard listener
   */
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gKeyTimeoutRef.current) {
        clearTimeout(gKeyTimeoutRef.current);
      }
    };
  }, [handleKeyDown, enabled]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (gKeyTimeoutRef.current) {
        clearTimeout(gKeyTimeoutRef.current);
      }
    };
  }, []);
}

/**
 * Hook for G-key navigation specifically
 */
export function useGKeyNavigation() {
  const router = useRouter();
  const gKeyPressedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingInInput()) return;

      const key = normalizeKey(event.key);

      if (key === 'g') {
        gKeyPressedRef.current = true;
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          gKeyPressedRef.current = false;
        }, 800);
        return;
      }

      if (gKeyPressedRef.current) {
        const routes: Record<string, string> = {
          't': '/tasks',
          'c': '/calendar',
          'p': '/projects',
          'd': '/dashboard',
          'k': '/kanban',
          'f': '/focus',
        };

        const route = routes[key.toLowerCase()];
        if (route) {
          router.push(route);
          gKeyPressedRef.current = false;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [router]);
}
