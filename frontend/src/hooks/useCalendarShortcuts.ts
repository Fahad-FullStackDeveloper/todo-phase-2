'use client';

/**
 * useCalendarShortcuts Hook
 *
 * Keyboard shortcuts for calendar navigation:
 * - M = Month view
 * - W = Week view
 * - D = Day view
 * - T = Today (navigate to current date)
 * - ← = Previous period
 * - → = Next period
 *
 * Prevents shortcuts when typing in input fields
 */

import { useEffect, useCallback } from 'react';

export type CalendarViewMode = 'month' | 'week' | 'day';

export interface UseCalendarShortcutsOptions {
  onViewChange?: (view: CalendarViewMode) => void;
  onToday?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  currentDate?: Date;
  currentView?: CalendarViewMode;
  enabled?: boolean;
}

export function useCalendarShortcuts({
  onViewChange,
  onToday,
  onPrevious,
  onNext,
  currentView = 'month',
  enabled = true,
}: UseCalendarShortcutsOptions = {}) {
  // Check if user is typing in an input/textarea
  const isTyping = useCallback(() => {
    const activeElement = document.activeElement;
    if (!activeElement) return false;

    const tagName = activeElement.tagName.toLowerCase();
    const isEditable =
      tagName === 'input' ||
      tagName === 'textarea' ||
      activeElement.getAttribute('contenteditable') === 'true';

    return isEditable;
  }, []);

  // Handle keyboard events
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (isTyping()) return;

      // Ignore if modifier keys are pressed (to avoid conflicts with browser shortcuts)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toLowerCase();

      switch (key) {
        case 'm':
          e.preventDefault();
          onViewChange?.('month');
          break;

        case 'w':
          e.preventDefault();
          onViewChange?.('week');
          break;

        case 'd':
          e.preventDefault();
          onViewChange?.('day');
          break;

        case 't':
          e.preventDefault();
          onToday?.();
          break;

        case 'arrowleft':
          e.preventDefault();
          onPrevious?.();
          break;

        case 'arrowright':
          e.preventDefault();
          onNext?.();
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, isTyping, onViewChange, onToday, onPrevious, onNext]);

  // Persist view mode to localStorage
  const setViewMode = useCallback(
    (view: CalendarViewMode) => {
      onViewChange?.(view);
      if (typeof window !== 'undefined') {
        localStorage.setItem('calendar_view_mode', view);
      }
    },
    [onViewChange]
  );

  // Get persisted view mode from localStorage
  const getPersistedViewMode = useCallback((): CalendarViewMode => {
    if (typeof window === 'undefined') return 'month';
    const stored = localStorage.getItem('calendar_view_mode');
    if (stored === 'month' || stored === 'week' || stored === 'day') {
      return stored;
    }
    return 'month';
  }, []);

  return {
    setViewMode,
    getPersistedViewMode,
    currentView,
  };
}

export default useCalendarShortcuts;
