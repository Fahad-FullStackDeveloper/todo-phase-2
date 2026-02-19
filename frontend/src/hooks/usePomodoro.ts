'use client';

/**
 * usePomodoro Hook
 *
 * Manages Pomodoro timer state with:
 * - Timer countdown logic
 * - Session logging to backend
 * - Settings persistence (localStorage)
 * - Browser notifications
 * - Sound notifications (optional)
 *
 * Features:
 * - 25min work / 5min break cycles (configurable)
 * - Long break after 4 sessions
 * - Auto-start options
 * - Visual and audio feedback
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { pomodoro as pomodoroApi } from '@/lib/api';
import { queryKeys } from '@/lib/query';
import type { PomodoroStats, CreatePomodoroSessionData } from '@/types';

// =============================================================================
// Types
// =============================================================================

export type TimerMode = 'work' | 'break' | 'longBreak';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface PomodoroSettings {
  workDuration: number; // minutes
  breakDuration: number; // minutes
  longBreakDuration: number; // minutes
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface UsePomodoroReturn {
  // Timer state
  mode: TimerMode;
  status: TimerStatus;
  timeRemaining: number; // seconds
  currentSession: number;
  
  // Settings
  settings: PomodoroSettings;
  updateSettings: (settings: Partial<PomodoroSettings>) => void;
  
  // Controls
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  
  // Stats
  stats: PomodoroStats | undefined;
  isLoadingStats: boolean;
  
  // Helpers
  formatTime: (seconds: number) => string;
  progress: number; // 0-100
}

// =============================================================================
// Constants
// =============================================================================

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  autoStartBreaks: false,
  autoStartWork: false,
  soundEnabled: false,
  notificationsEnabled: false,
};

const STORAGE_KEY = 'pomodoro_settings';

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get duration in seconds based on mode and settings
 */
function getDurationSeconds(mode: TimerMode, settings: PomodoroSettings): number {
  switch (mode) {
    case 'work':
      return settings.workDuration * 60;
    case 'break':
      return settings.breakDuration * 60;
    case 'longBreak':
      return settings.longBreakDuration * 60;
  }
}

/**
 * Load settings from localStorage
 */
function loadSettings(): PomodoroSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    
    const parsed = JSON.parse(stored);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save settings to localStorage
 */
function saveSettings(settings: PomodoroSettings): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('[usePomodoro] Failed to save settings:', error);
  }
}

/**
 * Format seconds to MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Request browser notification permission
 */
async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

/**
 * Show browser notification
 */
function showNotification(title: string, body: string): void {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }
  
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
    });
  }
}

/**
 * Play notification sound
 */
function playSound(): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.error('[usePomodoro] Failed to play sound:', error);
  }
}

// =============================================================================
// usePomodoro Hook
// =============================================================================

export function usePomodoro(taskId?: string): UsePomodoroReturn {
  // Settings state
  const [settings, setSettings] = useState<PomodoroSettings>(loadSettings);
  
  // Timer state
  const [mode, setMode] = useState<TimerMode>('work');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [timeRemaining, setTimeRemaining] = useState<number>(settings.workDuration * 60);
  const [currentSession, setCurrentSession] = useState<number>(1);
  
  // Refs for interval and tracking
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef<number>(0);
  
  // Fetch pomodoro stats
  const { data: stats, isLoading: isLoadingStats } = useQuery<PomodoroStats>({
    queryKey: queryKeys.pomodoro.stats(),
    queryFn: () => pomodoroApi.stats(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  
  // Log session mutation
  const logSessionMutation = useMutation({
    mutationFn: async (data: CreatePomodoroSessionData) => {
      return pomodoroApi.logSession(data);
    },
    onSuccess: () => {
      toast.success('Session logged', {
        description: 'Your focus session has been recorded',
      });
    },
    onError: (error) => {
      console.error('[usePomodoro] Failed to log session:', error);
      // Don't show error toast - session logging is not critical
    },
  });
  
  // Update settings and persist to localStorage
  const updateSettings = useCallback((newSettings: Partial<PomodoroSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  }, []);
  
  // Get duration for current mode
  const getDuration = useCallback(() => {
    return getDurationSeconds(mode, settings);
  }, [mode, settings]);
  
  // Calculate progress percentage
  const progress = useCallback(() => {
    const duration = getDuration();
    return ((duration - timeRemaining) / duration) * 100;
  }, [timeRemaining, getDuration]);
  
  // Handle timer completion
  const handleComplete = useCallback(() => {
    // Play sound if enabled
    if (settings.soundEnabled) {
      playSound();
    }
    
    // Show notification if enabled
    if (settings.notificationsEnabled) {
      if (mode === 'work') {
        showNotification('Focus Session Complete! 🎉', 'Time for a break!');
      } else {
        showNotification('Break Over! 💪', 'Ready to focus again?');
      }
    }
    
    // Log work session to backend
    if (mode === 'work') {
      const durationMinutes = settings.workDuration;
      logSessionMutation.mutate({
        task_id: taskId,
        duration: durationMinutes,
        completed: true,
      });
      
      // Move to next session or long break
      if (currentSession >= settings.sessionsBeforeLongBreak) {
        setMode('longBreak');
        setTimeRemaining(settings.longBreakDuration * 60);
        setCurrentSession(1);
      } else {
        setMode('break');
        setTimeRemaining(settings.breakDuration * 60);
        setCurrentSession((prev) => prev + 1);
      }
      
      // Auto-start break if enabled
      if (settings.autoStartBreaks) {
        setStatus('running');
      } else {
        setStatus('completed');
      }
    } else {
      // Break completed, back to work
      setMode('work');
      setTimeRemaining(settings.workDuration * 60);
      
      // Auto-start work if enabled
      if (settings.autoStartWork) {
        setStatus('running');
      } else {
        setStatus('completed');
      }
    }
  }, [mode, settings, currentSession, taskId, logSessionMutation]);
  
  // Timer effect
  useEffect(() => {
    if (status === 'running') {
      startTimeRef.current = Date.now();
      
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer completed
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status, handleComplete]);
  
  // Start timer
  const start = useCallback(() => {
    // Request notification permission on first start
    if (settings.notificationsEnabled && status === 'idle') {
      requestNotificationPermission();
    }
    
    setStatus('running');
  }, [settings.notificationsEnabled, status]);
  
  // Pause timer
  const pause = useCallback(() => {
    setStatus('paused');
  }, []);
  
  // Reset timer
  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setStatus('idle');
    setMode('work');
    setCurrentSession(1);
    setTimeRemaining(settings.workDuration * 60);
  }, [settings.workDuration]);
  
  // Skip to next phase
  const skip = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (mode === 'work') {
      // Skip work session - don't log it
      if (currentSession >= settings.sessionsBeforeLongBreak) {
        setMode('longBreak');
        setTimeRemaining(settings.longBreakDuration * 60);
        setCurrentSession(1);
      } else {
        setMode('break');
        setTimeRemaining(settings.breakDuration * 60);
        setCurrentSession((prev) => prev + 1);
      }
    } else {
      // Skip break
      setMode('work');
      setTimeRemaining(settings.workDuration * 60);
    }
    
    setStatus('idle');
  }, [mode, currentSession, settings]);
  
  return {
    // Timer state
    mode,
    status,
    timeRemaining,
    currentSession,
    
    // Settings
    settings,
    updateSettings,
    
    // Controls
    start,
    pause,
    reset,
    skip,
    
    // Stats
    stats,
    isLoadingStats,
    
    // Helpers
    formatTime,
    progress: progress(),
  };
}

// =============================================================================
// Exports
// =============================================================================

export default usePomodoro;
