'use client';

/**
 * Focus Mode Page
 *
 * Distraction-free single task view with:
 * - Minimal UI (no sidebar, reduced top nav)
 * - Prominent task title display
 * - Integrated Pomodoro timer
 * - Quick complete task button
 * - Escape key to exit focus mode
 * - Optional full-screen mode
 * - Task details panel (optional toggle)
 */

import { useState, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Maximize2,
  Minimize2,
  Info,
  ChevronRight,
  Clock,
  Tag,
  Calendar,
  Flag,
  ArrowLeft,
  Play,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer';
import { useRequireAuth } from '@/hooks/useAuth';
import { useTaskManager } from '@/hooks/useTasks';
import { cn } from '@/lib/utils';
import { motionConfig } from '@/lib/motion';
import type { Task } from '@/types';

// =============================================================================
// Types
// =============================================================================

interface TaskDetailPanelProps {
  task: Task;
  onClose: () => void;
}

// =============================================================================
// Sample Task Data (until we have task selection)
// =============================================================================

const SAMPLE_TASK: Task = {
  id: 'focus-task-1',
  user_id: 'user-1',
  title: 'Complete Q4 Planning Document',
  description: `## Overview

This is a comprehensive planning document for Q4 initiatives. 

## Key Areas

- **Revenue Targets**: Achieve 120% of Q3 performance
- **Product Launches**: Ship the new mobile app
- **Team Growth**: Hire 3 senior engineers
- **Process Improvements**: Implement agile methodologies

## Action Items

1. Review current metrics
2. Schedule stakeholder meetings
3. Draft initial proposal
4. Get feedback from leadership
5. Finalize and present

## Resources

- Q3 performance report
- Market analysis
- Competitor research

> "Success is where preparation and opportunity meet."

Let's make this quarter count! 🚀`,
  status: 'in_progress',
  priority: 'high',
  due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  project_id: 'project-1',
  completed: false,
  completed_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  subtasks: [
    { id: '1', task_id: 'focus-task-1', title: 'Review Q3 metrics', completed: true, position: 0, created_at: new Date().toISOString() },
    { id: '2', task_id: 'focus-task-1', title: 'Draft initial outline', completed: true, position: 1, created_at: new Date().toISOString() },
    { id: '3', task_id: 'focus-task-1', title: 'Schedule stakeholder meetings', completed: false, position: 2, created_at: new Date().toISOString() },
    { id: '4', task_id: 'focus-task-1', title: 'Get leadership feedback', completed: false, position: 3, created_at: new Date().toISOString() },
  ],
  labels: [
    { id: 'label-1', user_id: 'user-1', name: 'Planning', color: '#3b82f6', created_at: new Date().toISOString() },
    { id: 'label-2', user_id: 'user-1', name: 'Q4', color: '#8b5cf6', created_at: new Date().toISOString() },
  ],
  project: {
    id: 'project-1',
    user_id: 'user-1',
    name: 'Work Projects',
    description: 'Professional projects and initiatives',
    color: '#3b82f6',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

// =============================================================================
// Task Detail Panel Component
// =============================================================================

function TaskDetailPanel({ task, onClose }: TaskDetailPanelProps) {
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-error-600 bg-error/10';
      case 'high':
        return 'text-warning-600 bg-warning/10';
      case 'medium':
        return 'text-primary bg-primary/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 z-40 h-full w-full max-w-md overflow-y-auto border-l bg-background shadow-lg scrollbar-thin"
    >
      <div className="sticky top-0 flex items-center justify-between border-b bg-background/95 backdrop-blur p-4">
        <h2 className="text-lg font-semibold">Task Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6 p-4">
        {/* Subtasks Progress */}
        {totalSubtasks > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Subtasks</span>
              <span className="text-muted-foreground">
                {completedSubtasks}/{totalSubtasks}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-primary"
              />
            </div>
            <div className="space-y-2">
              {task.subtasks?.map((subtask) => (
                <div
                  key={subtask.id}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border p-3',
                    subtask.completed && 'bg-muted/50'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    readOnly
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span
                    className={cn(
                      'text-sm',
                      subtask.completed && 'text-muted-foreground line-through'
                    )}
                  >
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Task Metadata */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Flag className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Priority</p>
              <span
                className={cn(
                  'inline-block rounded-full px-2 py-1 text-xs font-medium capitalize',
                  getPriorityColor(task.priority)
                )}
              >
                {task.priority}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Due Date</p>
              <p className="text-sm font-medium">{formatDate(task.due_date)}</p>
            </div>
          </div>

          {task.project && (
            <div className="flex items-center gap-3">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Project</p>
                <p className="text-sm font-medium">{task.project.name}</p>
              </div>
            </div>
          )}

          {task.labels && task.labels.length > 0 && (
            <div className="flex items-center gap-3">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {task.labels.map((label) => (
                  <Badge
                    key={label.id}
                    className="rounded-full px-2 py-1 text-xs"
                    style={{
                      backgroundColor: `${label.color}20`,
                      color: label.color,
                    }}
                  >
                    {label.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Description</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none rounded-lg border bg-muted/50 p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {task.description}
              </pre>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// =============================================================================
// Focus Mode Content Component
// =============================================================================

function FocusModeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useRequireAuth('/signin');
  const { tasks: tasksFromHook, toggleComplete } = useTaskManager();

  // Ensure tasks is always an array
  const tasks = Array.isArray(tasksFromHook) ? tasksFromHook : [];

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);

  // Get task ID from URL or use sample
  const taskId = searchParams.get('taskId');
  const task = tasks.find((t) => t.id === taskId) || SAMPLE_TASK;

  // Handle escape key to exit
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showDetails) {
          setShowDetails(false);
        } else if (isFullscreen) {
          document.exitFullscreen().catch(console.error);
        } else {
          router.push('/dashboard');
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showDetails, isFullscreen, router]);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, []);

  // Handle task completion
  const handleCompleteTask = useCallback(async () => {
    try {
      if (task.id !== SAMPLE_TASK.id) {
        await toggleComplete(task.id);
      }
      setTaskCompleted(true);
      toast.success('Task completed! 🎉', {
        description: 'Great job staying focused!',
      });
      
      // Auto-exit after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      toast.error('Failed to complete task');
    }
  }, [task.id, toggleComplete, router]);

  // Exit focus mode
  const exitFocusMode = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-error-600';
      case 'high':
        return 'text-warning-600';
      case 'medium':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    if (days < 0) return `Overdue by ${Math.abs(days)} days`;
    return `Due in ${days} days`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Task Detail Panel */}
      <AnimatePresence>
        {showDetails && <TaskDetailPanel task={task} onClose={() => setShowDetails(false)} />}
      </AnimatePresence>

      {/* Minimal Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/80 backdrop-blur px-6 py-4"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={exitFocusMode}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-xs text-muted-foreground">Focus Mode</p>
            <p className="text-sm font-medium">{task.project?.name || 'No Project'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDetails(true)}
            className="h-10 w-10"
            title="View details"
          >
            <Info className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="hidden h-10 w-10 sm:inline-flex"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          {/* Task Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 text-center"
          >
            <div className="mb-4 flex items-center justify-center gap-2">
              <span
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium capitalize',
                  getPriorityColor(task.priority),
                  `${getPriorityColor(task.priority)}/10`
                )}
              >
                {task.priority}
              </span>
              {task.due_date && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDate(task.due_date)}
                </span>
              )}
            </div>
            
            <h1
              className={cn(
                'text-3xl font-bold sm:text-4xl md:text-5xl',
                taskCompleted && 'text-muted-foreground line-through'
              )}
            >
              {task.title}
            </h1>
          </motion.div>

          {/* Pomodoro Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 w-full max-w-md"
          >
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-lg">
              <CardContent className="p-6">
                <PomodoroTimer taskId={task.id} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Complete Task Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              size="lg"
              onClick={handleCompleteTask}
              disabled={taskCompleted}
              className={cn(
                'h-14 px-8 text-lg',
                taskCompleted
                  ? 'bg-success-600 hover:bg-success-600'
                  : 'bg-primary hover:bg-primary/90'
              )}
            >
              {taskCompleted ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Completed!
                </>
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Complete Task
                </>
              )}
            </Button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid w-full max-w-2xl grid-cols-3 gap-4"
          >
            <div className="rounded-lg border bg-card p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {task.subtasks?.filter((s) => s.completed).length || 0}/{task.subtasks?.length || 0}
              </p>
              <p className="text-xs text-muted-foreground">Subtasks Done</p>
            </div>
            <div className="rounded-lg border bg-card p-4 text-center">
              <p className="text-2xl font-bold text-success-600">25m</p>
              <p className="text-xs text-muted-foreground">Focus Session</p>
            </div>
            <div className="rounded-lg border bg-card p-4 text-center">
              <p className="text-2xl font-bold text-warning-600">1</p>
              <p className="text-xs text-muted-foreground">Session Today</p>
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 max-w-md text-center"
          >
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Stay focused on this single task. 
              Close other tabs and notifications. You&apos;ve got this!
            </p>
          </motion.div>
        </div>
      </main>

      {/* Completion Overlay */}
      <AnimatePresence>
        {taskCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="rounded-lg bg-background p-8 text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success-600/20"
              >
                <Check className="h-10 w-10 text-success-600" />
              </motion.div>
              <h2 className="text-2xl font-bold">Task Completed!</h2>
              <p className="mt-2 text-muted-foreground">
                Great job staying focused. Redirecting...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// Main Page Component
// =============================================================================

export default function FocusPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-lg font-medium">Entering Focus Mode...</p>
          </div>
        </div>
      }
    >
      <FocusModeContent />
    </Suspense>
  );
}
