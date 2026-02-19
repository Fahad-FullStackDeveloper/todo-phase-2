/**
 * Date Formatting Utilities for TodoFlow
 *
 * Provides locale-aware date formatting using Intl.DateTimeFormat
 * - Display format: "17 Feb 2026, 4:30 PM" (or 24-hour: "17 Feb 2026, 16:30")
 * - Relative dates: "Today at 4:30 PM", "Yesterday at 10:00 AM"
 * - Store ISO, display local time
 * - Timezone aware display
 * - Natural language parsing with chrono-node
 */

import { format, isToday, isTomorrow, isYesterday, isSameDay, parseISO } from 'date-fns';
import * as chrono from 'chrono-node';

// =============================================================================
// Configuration
// =============================================================================

/**
 * Get user's preferred hour cycle (12h or 24h)
 * Can be overridden via localStorage setting
 */
export function getHourCycle(): 'h12' | 'h23' {
  if (typeof window === 'undefined') return 'h12';
  
  const stored = localStorage.getItem('hour_cycle');
  if (stored === 'h23') return 'h23';
  if (stored === 'h12') return 'h12';
  
  // Detect from browser locale
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  const testDate = new Date(2026, 0, 1, 13, 0); // 1 PM
  const formatted = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).format(testDate);
  
  // If 1 PM shows as "1" it's 12h, if "13" it's 24h
  return formatted.includes('13') ? 'h23' : 'h12';
}

/**
 * Set hour cycle preference
 */
export function setHourCycle(cycle: 'h12' | 'h23'): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('hour_cycle', cycle);
  }
}

/**
 * Get user's timezone
 */
export function getUserTimezone(): string {
  if (typeof Intl === 'undefined') return 'UTC';
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// =============================================================================
// Core Formatting Functions
// =============================================================================

interface DateFormatOptions {
  hourCycle?: 'h12' | 'h23';
  timezone?: string;
  showTime?: boolean;
  showDate?: boolean;
}

/**
 * Format a date string or Date object to display format
 * 
 * Examples:
 * - "17 Feb 2026, 4:30 PM" (12-hour)
 * - "17 Feb 2026, 16:30" (24-hour)
 * - "17 Feb 2026" (date only)
 */
export function formatDate(
  date: string | Date | null | undefined,
  options?: DateFormatOptions
): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  
  const {
    hourCycle = getHourCycle(),
    timezone = getUserTimezone(),
    showTime = true,
    showDate = true,
  } = options || {};
  
  if (!showTime) {
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: timezone,
    }).format(dateObj);
  }
  
  if (!showDate) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: hourCycle === 'h12',
      timeZone: timezone,
    }).format(dateObj);
  }
  
  // Full format: "17 Feb 2026, 4:30 PM"
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: hourCycle === 'h12',
    timeZone: timezone,
  }).format(dateObj);
}

/**
 * Format date with relative display
 * 
 * Examples:
 * - "Today at 4:30 PM"
 * - "Tomorrow at 9:00 AM"
 * - "Yesterday at 10:00 AM"
 * - "17 Feb 2026, 4:30 PM" (for other dates)
 */
export function formatRelativeDate(
  date: string | Date | null | undefined,
  options?: Omit<DateFormatOptions, 'showDate'>
): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  
  const {
    hourCycle = getHourCycle(),
    timezone = getUserTimezone(),
  } = options || {};
  
  const now = new Date();
  
  // Check for today, tomorrow, yesterday
  if (isToday(dateObj)) {
    const timeStr = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: hourCycle === 'h12',
      timeZone: timezone,
    }).format(dateObj);
    return `Today at ${timeStr}`;
  }
  
  if (isTomorrow(dateObj)) {
    const timeStr = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: hourCycle === 'h12',
      timeZone: timezone,
    }).format(dateObj);
    return `Tomorrow at ${timeStr}`;
  }
  
  if (isYesterday(dateObj)) {
    const timeStr = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: hourCycle === 'h12',
      timeZone: timezone,
    }).format(dateObj);
    return `Yesterday at ${timeStr}`;
  }
  
  // For dates within the same week, show day name
  const diffDays = Math.floor((dateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays > 0 && diffDays <= 6) {
    const dayName = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      timeZone: timezone,
    }).format(dateObj);
    const timeStr = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: hourCycle === 'h12',
      timeZone: timezone,
    }).format(dateObj);
    return `${dayName} at ${timeStr}`;
  }
  
  // For other dates, use full format
  return formatDate(date, options);
}

/**
 * Format date as relative time ago
 * 
 * Examples:
 * - "just now"
 * - "5 minutes ago"
 * - "2 hours ago"
 * - "3 days ago"
 * - "17 Feb 2026" (older than a week)
 */
export function formatTimeAgo(
  date: string | Date | null | undefined,
  options?: { timezone?: string }
): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  
  const { timezone = getUserTimezone() } = options || {};
  const now = new Date();
  const targetDate = new Date(dateObj.toLocaleString('en-US', { timeZone: timezone }));
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  
  return formatDate(date, { showTime: false });
}

/**
 * Check if a date is overdue
 */
export function isOverdue(date: string | Date | null | undefined): boolean {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (isNaN(dateObj.getTime())) return false;
  
  return dateObj < new Date();
}

/**
 * Get days overdue (negative if in future)
 */
export function getDaysOverdue(date: string | Date | null | undefined): number {
  if (!date) return 0;
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (isNaN(dateObj.getTime())) return 0;
  
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Format overdue display
 * 
 * Examples:
 * - "5 days overdue"
 * - "1 day overdue"
 * - "Overdue"
 */
export function formatOverdue(date: string | Date | null | undefined): string {
  if (!date || !isOverdue(date)) return '';
  
  const days = getDaysOverdue(date);
  if (days === 0) return 'Overdue';
  if (days === 1) return '1 day overdue';
  return `${days} days overdue`;
}

/**
 * Format date for input field (YYYY-MM-DDTHH:mm)
 */
export function formatForInput(date: string | Date | null | undefined): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  
  return format(dateObj, "yyyy-MM-dd'T'HH:mm");
}

/**
 * Parse input date to ISO string
 */
export function parseInputDate(input: string): string | null {
  if (!input) return null;
  
  try {
    const dateObj = parseISO(input);
    if (isNaN(dateObj.getTime())) return null;
    return dateObj.toISOString();
  } catch {
    return null;
  }
}

// =============================================================================
// Date Range Utilities
// =============================================================================

/**
 * Get date range for quick filters
 */
export function getDateRange(range: 'today' | 'tomorrow' | 'thisWeek' | 'nextWeek' | 'thisMonth' | 'nextMonth' | 'overdue'): {
  start: Date;
  end: Date;
} {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (range) {
    case 'today':
      return {
        start: startOfDay,
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
      };
      
    case 'tomorrow':
      const tomorrow = new Date(startOfDay);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return {
        start: tomorrow,
        end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 23, 59, 59),
      };
      
    case 'thisWeek':
      const dayOfWeek = now.getDay();
      const startOfWeek = new Date(startOfDay);
      startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59);
      return {
        start: startOfWeek,
        end: endOfWeek,
      };
      
    case 'nextWeek':
      const startOfNextWeek = new Date(startOfDay);
      startOfNextWeek.setDate(startOfNextWeek.getDate() + (7 - now.getDay()));
      const endOfNextWeek = new Date(startOfNextWeek);
      endOfNextWeek.setDate(endOfNextWeek.getDate() + 6);
      endOfNextWeek.setHours(23, 59, 59);
      return {
        start: startOfNextWeek,
        end: endOfNextWeek,
      };
      
    case 'thisMonth':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
      };
      
    case 'nextMonth':
      return {
        start: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        end: new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59),
      };
      
    case 'overdue':
      return {
        start: new Date(0), // Beginning of time
        end: now,
      };
  }
}

/**
 * Format date range for display
 */
export function formatDateRange(range: 'today' | 'tomorrow' | 'thisWeek' | 'nextWeek' | 'thisMonth' | 'nextMonth' | 'overdue'): string {
  const labels = {
    today: 'Today',
    tomorrow: 'Tomorrow',
    thisWeek: 'This Week',
    nextWeek: 'Next Week',
    thisMonth: 'This Month',
    nextMonth: 'Next Month',
    overdue: 'Overdue',
  };
  return labels[range];
}

// =============================================================================
// Natural Language Date Parsing
// =============================================================================

/**
 * Parse natural language date string using chrono-node
 * 
 * Supported patterns (via chrono-node):
 * - "today", "tomorrow", "yesterday"
 * - "next week", "next month"
 * - "in 2 days", "in 3 weeks"
 * - "monday", "next monday"
 * - "15 feb", "20 february"
 * - "today at 3pm", "tomorrow at 9:00"
 * - "eod" (end of day = 5pm today)
 * - And many more natural language formats
 */
export function parseNaturalLanguageDate(input: string): {
  date?: Date;
  display?: string;
  error?: string;
} {
  if (!input || typeof input !== 'string') {
    return { error: 'Invalid input' };
  }
  
  const text = input.trim();
  const now = new Date();
  
  // Helper to set time to end of day
  const setEndOfDay = (d: Date): Date => {
    const result = new Date(d);
    result.setHours(17, 0, 0, 0);
    return result;
  };
  
  // Helper to format result
  const formatResult = (d: Date): { date: Date; display: string } => ({
    date: d,
    display: formatRelativeDate(d),
  });
  
  // Special: "eod" (end of day)
  if (text.toLowerCase() === 'eod' || text.toLowerCase() === 'end of day') {
    return formatResult(setEndOfDay(now));
  }
  
  // Special: "eod tomorrow"
  if (text.toLowerCase() === 'eod tomorrow' || text.toLowerCase() === 'end of day tomorrow') {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatResult(setEndOfDay(tomorrow));
  }
  
  // Use chrono-node for parsing
  const parsed = chrono.parseDate(text, now, {
    forwardDate: true, // Prefer future dates for ambiguous cases
  });
  
  if (parsed) {
    // If chrono parsed a date but no time was specified, set to end of day
    const hasTime = /\b(at\s+\d|am|pm|\d{1,2}:\d{2})\b/i.test(text);
    if (!hasTime) {
      parsed.setHours(17, 0, 0, 0);
    }
    return formatResult(parsed);
  }
  
  // Fallback to manual parsing for edge cases
  const lowerText = text.toLowerCase();
  
  // Today/Tomorrow without time
  if (lowerText === 'today') return formatResult(setEndOfDay(now));
  if (lowerText === 'tomorrow') {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatResult(setEndOfDay(tomorrow));
  }
  
  return { error: 'Could not understand date format' };
}

// =============================================================================
// Priority & Status Helpers
// =============================================================================

/**
 * Get priority color
 */
export function getPriorityColor(priority: 'low' | 'medium' | 'high' | 'urgent' | null | undefined): string {
  const colors = {
    low: '#8b5cf6', // violet
    medium: '#3b82f6', // blue
    high: '#f97316', // orange
    urgent: '#ef4444', // red
  };
  return colors[priority || 'medium'];
}

/**
 * Get priority label
 */
export function getPriorityLabel(priority: 'low' | 'medium' | 'high' | 'urgent' | null | undefined): string {
  const labels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
  };
  return labels[priority || 'medium'];
}

/**
 * Get status label
 */
export function getStatusLabel(status: 'todo' | 'in_progress' | 'done' | null | undefined): string {
  const labels = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
  };
  return labels[status || 'todo'];
}
