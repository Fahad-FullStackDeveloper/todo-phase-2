/**
 * Labels Data Hook
 *
 * Fetches and manages labels using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Label, CreateLabelData } from '@/types';
import { toast } from 'sonner';

/**
 * Query key factory for labels
 */
export const labelsQueryKeys = {
  all: ['labels'] as const,
  list: () => [...labelsQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...labelsQueryKeys.all, 'detail', id] as const,
};

/**
 * Hook to fetch all labels
 */
export function useLabels() {
  return useQuery<Label[]>({
    queryKey: labelsQueryKeys.list(),
    queryFn: () => api.labels.list(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to create a label
 */
export function useCreateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLabelData) => api.labels.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: labelsQueryKeys.list() });
      toast.success('Label created');
    },
    onError: (error: Error) => {
      toast.error('Failed to create label', {
        description: error.message,
      });
    },
  });
}

/**
 * Hook to update a label
 */
export function useUpdateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Label> }) =>
      api.labels.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: labelsQueryKeys.list() });
      toast.success('Label updated');
    },
    onError: (error: Error) => {
      toast.error('Failed to update label', {
        description: error.message,
      });
    },
  });
}

/**
 * Hook to delete a label
 */
export function useDeleteLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.labels.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: labelsQueryKeys.list() });
      toast.success('Label deleted');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete label', {
        description: error.message,
      });
    },
  });
}

/**
 * Predefined label colors
 */
export const labelColors = [
  '#EF4444', // red
  '#F97316', // orange
  '#F59E0B', // amber
  '#84CC16', // lime
  '#10B981', // emerald
  '#14B8A6', // teal
  '#06B6D4', // cyan
  '#3B82F6', // blue
  '#6366F1', // indigo
  '#8B5CF6', // violet
  '#D946EF', // fuchsia
  '#EC4899', // pink
];

/**
 * Validate hex color format
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}
