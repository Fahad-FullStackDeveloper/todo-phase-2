'use client';

/**
 * Tasks Page
 *
 * Main task list view with:
 * - Filter and sort controls
 * - Quick filters (Today, This Week, Overdue, Completed)
 * - Task cards with completion toggle
 * - QuickAdd FAB for rapid entry
 * - TaskEditor modal for create/edit
 * - Loading and empty states
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ListFilter } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useAuth';
import { useTaskManager } from '@/hooks/useTasks';
import type { Task, FilterConfig, SortConfig, CreateTaskData } from '@/types';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskCardSkeleton } from '@/components/tasks/TaskCardSkeleton';
import { EmptyState } from '@/components/tasks/EmptyState';
import { TaskEditor } from '@/components/tasks/TaskEditor';
import { QuickAddFAB } from '@/components/tasks/QuickAddFAB';
import { FilterDropdown } from '@/components/tasks/FilterDropdown';
import { SortDropdown } from '@/components/tasks/SortDropdown';
import { QuickFilters } from '@/components/tasks/QuickFilters';
import { FilterChips } from '@/components/tasks/FilterChips';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { taskQueryKeys } from '@/hooks/useTasks';

export default function TasksPage() {
  // Auth check
  const { user, isLoading: authLoading } = useRequireAuth('/signin');
  const queryClient = useQueryClient();

  // State
  const [filters, setFilters] = useState<FilterConfig>({});
  const [sort, setSort] = useState<SortConfig>({ field: 'due_date', direction: 'asc' });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Fetch tasks, projects, labels
  const {
    tasks: tasksFromHook,
    isLoadingTasks,
    isFetchingTasks,
    projects: projectsFromHook,
    labels: labelsFromHook,
    createTask: createTaskHook,
    updateTask: updateTaskHook,
    deleteTask: deleteTaskHook,
    toggleComplete: toggleCompleteHook,
    refetchTasks,
  } = useTaskManager({ filters, sort });

  // Ensure tasks, projects, labels are always arrays
  const tasks = Array.isArray(tasksFromHook) ? tasksFromHook : [];
  const projects = Array.isArray(projectsFromHook) ? projectsFromHook : [];
  const labels = Array.isArray(labelsFromHook) ? labelsFromHook : [];

  // Load persisted filters from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFilters = localStorage.getItem('task_filters');
      const savedSort = localStorage.getItem('task_sort');

      if (savedFilters) {
        try {
          setFilters(JSON.parse(savedFilters));
        } catch (e) {
          console.error('Failed to parse saved filters:', e);
        }
      }

      if (savedSort) {
        try {
          setSort(JSON.parse(savedSort));
        } catch (e) {
          console.error('Failed to parse saved sort:', e);
        }
      }
    }
  }, []);

  // Persist filters to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('task_filters', JSON.stringify(filters));
    }
  }, [filters]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('task_sort', JSON.stringify(sort));
    }
  }, [sort]);

  // Handle task toggle
  const handleToggleComplete = useCallback(
    async (task: Task) => {
      try {
        await toggleCompleteHook(task.id);
      } catch (error) {
        console.error('Failed to toggle task:', error);
      }
    },
    [toggleCompleteHook]
  );

  // Handle task edit
  const handleEditTask = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsEditorOpen(true);
  }, []);

  // Handle task delete
  const handleDeleteTask = useCallback(
    async (task: Task) => {
      try {
        await deleteTaskHook(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    },
    [deleteTaskHook]
  );

  // Handle create new task
  const handleCreateTask = useCallback(() => {
    setSelectedTask(null);
    setIsEditorOpen(true);
  }, []);

  // Handle quick add
  const handleQuickAdd = useCallback(
    async (
      title: string,
      options?: {
        due_date?: string;
        priority?: Task['priority'];
        project_id?: string;
        labels?: string[];
      }
    ) => {
      await createTaskHook({
        title,
        ...options,
      });
    },
    [createTaskHook]
  );

  // Handle editor save
  const handleEditorSave = useCallback(
    async (data: CreateTaskData & { id?: string }) => {
      if (data.id && selectedTask) {
        await updateTaskHook(data.id, data);
      } else {
        await createTaskHook(data);
      }
      setIsEditorOpen(false);
      setSelectedTask(null);
    },
    [selectedTask, updateTaskHook, createTaskHook]
  );

  // Handle editor delete
  const handleEditorDelete = useCallback(
    async (taskId: string) => {
      await deleteTaskHook(taskId);
      setIsEditorOpen(false);
      setSelectedTask(null);
    },
    [deleteTaskHook]
  );

  // Clear filters
  const handleClearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Filter tasks client-side for quick filters
  const getFilteredTasks = () => {
    let filtered = tasks.slice(); // Use slice() to create a copy

    // Apply status filter
    if (filters.status) {
      if (filters.status === 'done') {
        filtered = filtered.filter((t) => t.completed);
      } else {
        filtered = filtered.filter((t) => !t.completed && t.status === filters.status);
      }
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter((t) => t.priority === filters.priority);
    }

    // Apply project filter
    if (filters.project_id) {
      filtered = filtered.filter((t) => t.project_id === filters.project_id);
    }

    // Apply label filter
    if (filters.labels && filters.labels.length > 0) {
      filtered = filtered.filter((t) =>
        t.labels?.some((l) => filters.labels?.includes(l.id))
      );
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  // Loading state during auth check
  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="flex min-h-screen w-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
              <p className="text-sm text-muted-foreground">
                {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                {filters.status && ` · ${filters.status === 'done' ? 'Completed' : filters.status.replace('_', ' ')}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <FilterDropdown
                filters={filters}
                onFilterChange={setFilters}
                projects={projects}
                labels={labels}
              />
              <SortDropdown sort={sort} onSortChange={setSort} />
              <Button onClick={handleCreateTask} className="gap-2">
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">New Task</span>
              </Button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mt-4">
            <QuickFilters
              tasks={tasks}
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>

          {/* Active Filter Chips */}
          <AnimatePresence>
            {(filters.status || filters.priority || filters.project_id || (filters.labels && filters.labels.length > 0)) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <FilterChips
                  filters={filters}
                  onFilterChange={setFilters}
                  projects={projects}
                  labels={labels}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Loading State */}
          {isLoadingTasks && (
            <TaskCardSkeleton count={5} />
          )}

          {/* Empty State */}
          {!isLoadingTasks && filteredTasks.length === 0 && (
            <EmptyState
              variant={tasks.length === 0 ? 'empty' : 'no-results'}
              actionLabel="Create your first task"
              onAction={handleCreateTask}
              showFilters={Object.keys(filters).length > 0}
              onClearFilters={handleClearFilters}
            />
          )}

          {/* Task List */}
          {!isLoadingTasks && filteredTasks.length > 0 && (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    project={projects.find((p) => p.id === task.project_id)}
                    labels={task.labels}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Fetching Indicator */}
          {isFetchingTasks && !isLoadingTasks && (
            <div className="mt-4 flex justify-center">
              <div className="h-1 w-32 animate-pulse rounded-full bg-muted" />
            </div>
          )}
        </div>
      </main>

      {/* Task Editor Modal */}
      <TaskEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSave={handleEditorSave}
        onDelete={handleEditorDelete}
        projects={projects}
        labels={labels}
        defaultProjectId={filters.project_id}
        defaultLabels={filters.labels}
      />

      {/* Quick Add FAB */}
      <div className="fixed bottom-6 right-6 z-40">
        <QuickAddFAB
          onAddTask={handleQuickAdd}
          projects={projects}
          labels={labels}
          defaultProjectId={filters.project_id}
          defaultLabels={filters.labels}
        />
      </div>
    </div>
  );
}
