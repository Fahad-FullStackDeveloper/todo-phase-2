'use client';

/**
 * useTasks Hook
 *
 * TanStack Query hooks for task management with:
 * - useQuery for fetching tasks
 * - useMutation for create/update/delete
 * - Optimistic updates
 * - Proper error handling
 * - Query key factories for consistent caching
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tasks as tasksApi, projects as projectsApi, labels as labelsApi } from '@/lib/api';
import { queryKeys } from '@/lib/query';
import type { Task, Project, Label, CreateTaskData, UpdateTaskData, FilterConfig, SortConfig } from '@/types';

// =============================================================================
// Types
// =============================================================================

export interface UseTasksOptions {
  filters?: FilterConfig;
  sort?: SortConfig;
  enabled?: boolean;
  staleTime?: number;
}

export interface UseTaskMutationsResult {
  createTask: (data: CreateTaskData) => Promise<Task>;
  updateTask: (id: string, data: UpdateTaskData) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<Task>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

// =============================================================================
// Query Key Factory
// =============================================================================

export const taskQueryKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskQueryKeys.all, 'list'] as const,
  list: (filters: FilterConfig & SortConfig) =>
    [...taskQueryKeys.lists(), filters] as const,
  details: () => [...taskQueryKeys.all, 'details'] as const,
  detail: (id: string) => [...taskQueryKeys.details(), id] as const,
  projects: ['projects'] as const,
  labels: ['labels'] as const,
};

// =============================================================================
// useTasks Query Hook
// =============================================================================

export function useTasks(options: UseTasksOptions = {}) {
  const {
    filters = {},
    sort = { field: 'due_date', direction: 'asc' },
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
  } = options;

  const queryKey = [
    ...taskQueryKeys.lists(),
    { ...filters, sort },
  ];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const params: Record<string, string | string[]> = {};

      // Map filters to API params
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.project_id) params.project_id = filters.project_id;
      if (filters.labels && filters.labels.length > 0) {
        params.labels = filters.labels;
      }

      // Map sort to API params
      if (sort?.field) params.sort_by = sort.field;
      if (sort?.direction) params.sort_order = sort.direction;

      return tasksApi.list(params);
    },
    staleTime,
    enabled,
    retry: 2,
  });

  return query;
}

// =============================================================================
// useTaskDetail Query Hook
// =============================================================================

export function useTaskDetail(taskId: string | null, enabled = true) {
  return useQuery({
    queryKey: taskId ? taskQueryKeys.detail(taskId) : ['task', 'disabled'],
    queryFn: async () => {
      if (!taskId) throw new Error('Task ID required');
      return tasksApi.get(taskId);
    },
    enabled: !!taskId && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// =============================================================================
// useProjects Query Hook
// =============================================================================

export function useProjects() {
  return useQuery({
    queryKey: taskQueryKeys.projects,
    queryFn: projectsApi.list,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// =============================================================================
// useLabels Query Hook
// =============================================================================

export function useLabels() {
  return useQuery({
    queryKey: taskQueryKeys.labels,
    queryFn: labelsApi.list,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// =============================================================================
// useTaskMutations Hook
// =============================================================================

export function useTaskMutations(): UseTaskMutationsResult {
  const queryClient = useQueryClient();

  // Create task mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateTaskData) => {
      return tasksApi.create(data);
    },
    onMutate: async (newTask) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: taskQueryKeys.lists() });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(taskQueryKeys.lists()) || [];

      // Optimistically add the new task
      const optimisticTask: Task = {
        id: `temp-${Date.now()}`,
        user_id: 'temp',
        title: newTask.title,
        description: newTask.description || null,
        status: 'todo',
        priority: newTask.priority || 'medium',
        due_date: newTask.due_date || null,
        project_id: newTask.project_id || null,
        completed: false,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        labels: newTask.labels ? newTask.labels.map((id) => ({ id, name: '', color: '#000', user_id: '', created_at: '' } as Label)) : [],
      };

      queryClient.setQueryData<Task[]>(taskQueryKeys.lists(), (old) => [
        ...(old || []),
        optimisticTask,
      ]);

      return { previousTasks, optimisticTask };
    },
    onError: (err, newTask, context) => {
      // Revert to previous tasks on error
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(taskQueryKeys.lists(), context.previousTasks);
      }
      toast.error('Failed to create task', {
        description: 'Please try again',
      });
    },
    onSuccess: (newTask) => {
      // Update with the real task from server
      queryClient.setQueryData<Task[]>(taskQueryKeys.lists(), (old) =>
        (old || []).map((t) => (t.id.startsWith('temp-') ? newTask : t))
      );
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
      toast.success('Task created', {
        description: `"${newTask.title}" has been added`,
      });
    },
  });

  // Update task mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTaskData }) => {
      return tasksApi.update(id, data);
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: taskQueryKeys.lists() });
      const previousTasks = queryClient.getQueryData<Task[]>(taskQueryKeys.lists()) || [];

      queryClient.setQueryData<Task[]>(taskQueryKeys.lists(), (old) =>
        (old || []).map((t) =>
          t.id === id ? { ...t, ...data, updated_at: new Date().toISOString() } as Task : t
        )
      );

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(taskQueryKeys.lists(), context.previousTasks);
      }
      toast.error('Failed to update task', {
        description: 'Please try again',
      });
    },
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.detail(updatedTask.id) });
      toast.success('Task updated', {
        description: `"${updatedTask.title}" has been updated`,
      });
    },
  });

  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return tasksApi.delete(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskQueryKeys.lists() });
      const previousTasks = queryClient.getQueryData<Task[]>(taskQueryKeys.lists()) || [];

      queryClient.setQueryData<Task[]>(taskQueryKeys.lists(), (old) =>
        (old || []).filter((t) => t.id !== id)
      );

      return { previousTasks };
    },
    onError: (err, id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(taskQueryKeys.lists(), context.previousTasks);
      }
      toast.error('Failed to delete task', {
        description: 'Please try again',
      });
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
      toast.success('Task deleted');
    },
  });

  // Toggle complete mutation
  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      return tasksApi.complete(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskQueryKeys.lists() });
      const previousTasks = queryClient.getQueryData<Task[]>(taskQueryKeys.lists()) || [];

      queryClient.setQueryData<Task[]>(taskQueryKeys.lists(), (old) =>
        (old || []).map((t) =>
          t.id === id
            ? {
                ...t,
                completed: !t.completed,
                completed_at: !t.completed ? new Date().toISOString() : null,
                updated_at: new Date().toISOString(),
              }
            : t
        )
      );

      return { previousTasks };
    },
    onError: (err, id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(taskQueryKeys.lists(), context.previousTasks);
      }
      toast.error('Failed to update task', {
        description: 'Please try again',
      });
    },
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.detail(updatedTask.id) });
      if (updatedTask.completed) {
        toast.success('Task completed! 🎉', {
          description: `"${updatedTask.title}" is done`,
        });
      }
    },
  });

  return {
    createTask: createMutation.mutateAsync,
    updateTask: async (id: string, data: UpdateTaskData) => {
      return updateMutation.mutateAsync({ id, data });
    },
    deleteTask: deleteMutation.mutateAsync,
    toggleComplete: toggleMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// =============================================================================
// Combined Hook for Task Management
// =============================================================================

export function useTaskManager(options: UseTasksOptions = {}) {
  const tasksQuery = useTasks(options);
  const projectsQuery = useProjects();
  const labelsQuery = useLabels();
  const mutations = useTaskMutations();

  return {
    // Queries
    tasks: tasksQuery.data || [],
    isLoadingTasks: tasksQuery.isLoading,
    isFetchingTasks: tasksQuery.isFetching,
    isErrorTasks: tasksQuery.isError,
    errorTasks: tasksQuery.error,

    projects: projectsQuery.data || [],
    isLoadingProjects: projectsQuery.isLoading,

    labels: labelsQuery.data || [],
    isLoadingLabels: labelsQuery.isLoading,

    // Mutations
    ...mutations,

    // Refetch
    refetchTasks: tasksQuery.refetch,
  };
}

// =============================================================================
// Exports
// =============================================================================

export default useTasks;
