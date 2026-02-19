'use client';

/**
 * PomodoroTimer Component
 *
 * A beautiful, animated Pomodoro timer with:
 * - Circular progress ring
 * - MM:SS time display
 * - Start/Pause/Reset controls
 * - Mode indicator (Work/Break/Long Break)
 * - Session counter
 * - Configurable settings modal
 * - Smooth animations with Framer Motion
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motionConfig } from '@/lib/motion';
import { formatTime, usePomodoro, type TimerMode } from '@/hooks/usePomodoro';

// =============================================================================
// Types
// =============================================================================

export interface PomodoroTimerProps {
  taskId?: string;
  compact?: boolean;
  className?: string;
}

// =============================================================================
// Constants
// =============================================================================

const MODE_COLORS: Record<TimerMode, string> = {
  work: 'text-primary',
  break: 'text-success-600',
  longBreak: 'text-info-600',
};

const MODE_BG_COLORS: Record<TimerMode, string> = {
  work: 'bg-primary/10',
  break: 'bg-success-600/10',
  longBreak: 'bg-info-600/10',
};

const MODE_LABELS: Record<TimerMode, string> = {
  work: 'Focus Time',
  break: 'Short Break',
  longBreak: 'Long Break',
};

const MODE_EMOJIS: Record<TimerMode, string> = {
  work: '🎯',
  break: '☕',
  longBreak: '🌴',
};

// =============================================================================
// Progress Ring Component
// =============================================================================

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  mode: TimerMode;
}

function ProgressRing({
  progress,
  size = 280,
  strokeWidth = 8,
  children,
  mode,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const colorClasses: Record<TimerMode, string> = {
    work: 'stroke-primary',
    break: 'stroke-success-600',
    longBreak: 'stroke-info-600',
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-muted"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={cn('transition-colors duration-500', colorClasses[mode])}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// Settings Modal Component
// =============================================================================

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  settings: ReturnType<typeof usePomodoro>['settings'];
  updateSettings: ReturnType<typeof usePomodoro>['updateSettings'];
}

function SettingsModal({ open, onClose, settings, updateSettings }: SettingsModalProps) {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md rounded-lg border bg-background p-6 shadow-2xl">
              <div className="absolute right-4 top-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="mb-6 text-xl font-semibold pr-8">Timer Settings</h2>
            
            <div className="space-y-6">
              {/* Duration Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Durations (minutes)</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Focus</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={settings.workDuration}
                      onChange={(e) => updateSettings({ workDuration: parseInt(e.target.value) || 25 })}
                      className="w-full rounded-md border bg-background px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Short Break</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={settings.breakDuration}
                      onChange={(e) => updateSettings({ breakDuration: parseInt(e.target.value) || 5 })}
                      className="w-full rounded-md border bg-background px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Long Break</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={settings.longBreakDuration}
                      onChange={(e) => updateSettings({ longBreakDuration: parseInt(e.target.value) || 15 })}
                      className="w-full rounded-md border bg-background px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
              
              {/* Sessions before long break */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sessions before Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.sessionsBeforeLongBreak}
                  onChange={(e) => updateSettings({ sessionsBeforeLongBreak: parseInt(e.target.value) || 4 })}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              {/* Toggle Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Preferences</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Auto-start Breaks</span>
                  </div>
                  <button
                    onClick={() => updateSettings({ autoStartBreaks: !settings.autoStartBreaks })}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      settings.autoStartBreaks ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 h-4 w-4 rounded-full bg-background transition-transform',
                        settings.autoStartBreaks ? 'left-6' : 'left-1'
                      )}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Auto-start Work</span>
                  </div>
                  <button
                    onClick={() => updateSettings({ autoStartWork: !settings.autoStartWork })}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      settings.autoStartWork ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 h-4 w-4 rounded-full bg-background transition-transform',
                        settings.autoStartWork ? 'left-6' : 'left-1'
                      )}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {settings.soundEnabled ? (
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">Sound</span>
                  </div>
                  <button
                    onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      settings.soundEnabled ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 h-4 w-4 rounded-full bg-background transition-transform',
                        settings.soundEnabled ? 'left-6' : 'left-1'
                      )}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {settings.notificationsEnabled ? (
                      <Bell className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <BellOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">Notifications</span>
                  </div>
                  <button
                    onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      settings.notificationsEnabled ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 h-4 w-4 rounded-full bg-background transition-transform',
                        settings.notificationsEnabled ? 'left-6' : 'left-1'
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={onClose}>Done</Button>
            </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function PomodoroTimer({ taskId, compact = false, className }: PomodoroTimerProps) {
  const {
    mode,
    status,
    timeRemaining,
    currentSession,
    settings,
    updateSettings,
    start,
    pause,
    reset,
    skip,
    progress,
    formatTime: formatTimeFn,
  } = usePomodoro(taskId);
  
  const [showSettings, setShowSettings] = useState(false);
  
  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }
    
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        if (status === 'running') {
          pause();
        } else {
          start();
        }
        break;
      case 'KeyR':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          reset();
        }
        break;
      case 'KeyS':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          skip();
        }
        break;
    }
  }, [status, start, pause, reset, skip]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  const toggleTimer = () => {
    if (status === 'running') {
      pause();
    } else {
      start();
    }
  };
  
  if (compact) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{MODE_EMOJIS[mode]}</span>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{MODE_LABELS[mode]}</p>
                <p className="text-lg font-bold tabular-nums">{formatTime(timeRemaining)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant={status === 'running' ? 'secondary' : 'default'}
                size="icon"
                className="h-8 w-8"
                onClick={toggleTimer}
              >
                {status === 'running' ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      {/* Settings Modal */}
      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        updateSettings={updateSettings}
      />
      
      {/* Mode Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium',
          MODE_BG_COLORS[mode],
          MODE_COLORS[mode]
        )}
      >
        <span>{MODE_EMOJIS[mode]}</span>
        <span>{MODE_LABELS[mode]}</span>
        <span className="text-muted-foreground">•</span>
        <span>Session {currentSession}/{settings.sessionsBeforeLongBreak}</span>
      </motion.div>
      
      {/* Timer Display */}
      <ProgressRing
        progress={progress}
        mode={mode}
        size={compact ? 200 : 280}
        strokeWidth={8}
      >
        <div className="flex flex-col items-center">
          <motion.div
            key={timeRemaining}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className={cn(
              'text-6xl font-bold tabular-nums',
              MODE_COLORS[mode]
            )}
          >
            {formatTime(timeRemaining)}
          </motion.div>
          <p className="mt-2 text-sm text-muted-foreground">
            {status === 'running' ? 'Focusing...' : status === 'paused' ? 'Paused' : 'Ready'}
          </p>
        </div>
      </ProgressRing>
      
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 flex items-center gap-4"
      >
        <Button
          variant="outline"
          size="lg"
          onClick={reset}
          disabled={status === 'idle'}
          className="h-12 w-12 rounded-full p-0"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
        
        <Button
          variant={status === 'running' ? 'secondary' : 'default'}
          size="lg"
          onClick={toggleTimer}
          className="h-16 w-16 rounded-full p-0"
        >
          {status === 'running' ? (
            <Pause className="h-8 w-8" />
          ) : (
            <Play className="h-8 w-8 ml-1" />
          )}
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={skip}
          className="h-12 w-12 rounded-full p-0"
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </motion.div>
      
      {/* Settings Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(true)}
          className="gap-2"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </motion.div>
      
      {/* Keyboard Shortcuts Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 text-xs text-muted-foreground"
      >
        <kbd className="rounded bg-muted px-2 py-0.5">Space</kbd> to{' '}
        {status === 'running' ? 'pause' : 'start'} •{' '}
        <kbd className="rounded bg-muted px-2 py-0.5">Ctrl+R</kbd> to reset •{' '}
        <kbd className="rounded bg-muted px-2 py-0.5">Ctrl+S</kbd> to skip
      </motion.p>
    </div>
  );
}

export default PomodoroTimer;
