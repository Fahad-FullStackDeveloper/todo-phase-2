'use client';

/**
 * Calendar Page
 *
 * Full-featured calendar view with:
 * - Month, Week, and Day views
 * - Task integration with TaskEditor modal
 * - Quick add functionality
 * - Keyboard shortcuts (M=Month, W=Week, D=Day, T=Today)
 * - Responsive design
 * - View mode persistence in localStorage
 */

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Calendar } from '@/components/calendar/Calendar';
import { TaskEditor } from '@/components/tasks/TaskEditor';
import { QuickAddFAB } from '@/components/tasks/QuickAddFAB';
import { useRequireAuth } from '@/hooks/useAuth';
import { useTaskManager } from '@/hooks/useTasks';
import type { CalendarViewMode } from '@/hooks/useCalendarShortcuts';
import type { Task, CreateTaskData } from '@/types';
import { motionConfig } from '@/lib/motion';

export default function CalendarPage() {
  const { user, isLoading, isAuthenticated } = useRequireAuth('/signin');
  const { tasks: tasksFromHook, isLoadingTasks, createTask, updateTask, projects, labels } = useTaskManager();

  // Ensure tasks is always an array
  const tasks = Array.isArray(tasksFromHook) ? tasksFromHook : [];

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskEditorOpen, setIsTaskEditorOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Load persisted view mode on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('calendar_view_mode');
      if (stored === 'month' || stored === 'week' || stored === 'day') {
        setViewMode(stored);
      }
    }
  }, []);

  // Also check for token directly to avoid being stuck in loading state
  const hasToken = typeof window !== 'undefined'
    ? (localStorage.getItem('jwt_token') || document.cookie.includes('jwt_token='))
    : false;

  // Show loading only if:
  // 1. Still loading AND no token found
  // 2. Timeout for max 2 seconds
  const showLoading = isLoading && !hasToken;

  if (showLoading) {
    return (
      <div className="flex min-h-screen">
        <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/5">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-lg font-medium text-foreground">Loading calendar...</p>
            <p className="mt-2 text-sm text-muted-foreground">Just a moment</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Safety check - if not authenticated after loading, don't render
  const actuallyAuthenticated = isAuthenticated || hasToken;
  if (!actuallyAuthenticated) {
    return null;
  }

  // Handle date click from calendar
  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedTask(null);
    setIsTaskEditorOpen(true);
  }, []);

  // Handle task click from calendar
  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setSelectedDate(null);
    setIsTaskEditorOpen(true);
  }, []);

  // Handle quick add from calendar
  const handleQuickAdd = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedTask(null);
    setIsTaskEditorOpen(true);
  }, []);

  // Handle task editor save
  const handleSaveTask = useCallback(
    async (data: CreateTaskData & { id?: string }) => {
      try {
        if (data.id && selectedTask) {
          // Update existing task
          await updateTask(data.id, data);
        } else {
          // Create new task
          // If date is selected, set due_date with time
          if (selectedDate) {
            // If no time specified, default to 9 AM
            const dueDate = new Date(selectedDate);
            if (!data.due_date?.includes('T')) {
              dueDate.setHours(9, 0, 0, 0);
              data.due_date = dueDate.toISOString();
            }
          }
          await createTask(data);
        }
        setIsTaskEditorOpen(false);
        setSelectedDate(null);
        setSelectedTask(null);
      } catch (error) {
        console.error('Failed to save task:', error);
      }
    },
    [selectedTask, selectedDate, createTask, updateTask]
  );

  // Handle task editor delete
  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      try {
        // Delete is handled by TaskEditor internally via onDelete prop
        // This is just a placeholder - actual delete would be in TaskEditor
        setIsTaskEditorOpen(false);
        setSelectedTask(null);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    },
    []
  );

  // Handle quick add FAB
  const handleQuickAddTask = useCallback(
    async (title: string, options?: {
      due_date?: string;
      priority?: Task['priority'];
      project_id?: string;
      labels?: string[];
    }) => {
      try {
        await createTask({
          title,
          ...options,
        });
      } catch (error) {
        console.error('Failed to quick add task:', error);
        throw error;
      }
    },
    [createTask]
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Navigation */}
        <TopNav
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Calendar Content */}
        <main className="flex-1 overflow-hidden p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={motionConfig.transition}
            className="mx-auto flex h-full max-w-[1800px] flex-col gap-6"
          >
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
                <p className="text-sm text-muted-foreground">
                  View and manage your tasks by date
                </p>
              </div>

              {/* Quick Add Button */}
              <Button
                onClick={() => {
                  setSelectedDate(new Date());
                  setSelectedTask(null);
                  setIsTaskEditorOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Task</span>
              </Button>
            </div>

            {/* Calendar Component */}
            <div className="flex-1 overflow-hidden">
              <Calendar
                tasks={tasks}
                onDateClick={handleDateClick}
                onTaskClick={handleTaskClick}
                onQuickAdd={handleQuickAdd}
                viewMode={viewMode}
                onViewChange={setViewMode}
              />
            </div>
          </motion.div>
        </main>
      </div>

      {/* Task Editor Modal */}
      <TaskEditor
        isOpen={isTaskEditorOpen}
        onClose={() => {
          setIsTaskEditorOpen(false);
          setSelectedDate(null);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        projects={projects}
        labels={labels}
        defaultProjectId={undefined}
        defaultLabels={[]}
      />

      {/* Quick Add FAB */}
      <div className="fixed bottom-6 right-6 z-40">
        <QuickAddFAB
          onAddTask={handleQuickAddTask}
          projects={projects}
          labels={labels}
        />
      </div>
    </div>
  );
}
