'use client';

/**
 * TanStack Query Configuration
 *
 * Centralized QueryClient setup with:
 * - Retry logic with exponential backoff
 * - Stale time configuration
 * - Error handling
 * - Optimistic update support
 */

import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query';

// Retry strategy with exponential backoff
function retryDelay(failureCount: number): number {
  // Exponential backoff: 1s, 2s, 4s, max 10s
  return Math.min(1000 * 2 ** failureCount, 10000);
}

// Determine if a query should be retried
function shouldRetry(failureCount: number, error: Error): boolean {
  // Don't retry on 401 (unauthorized) - redirect to signin instead
  if (error.message === 'Unauthorized') {
    return false;
  }
  
  // Retry up to 3 times
  return failureCount < 3;
}

// Create the QueryClient instance
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Retry configuration
        retry: shouldRetry,
        retryDelay,

        // Stale time - data is fresh for 5 minutes
        staleTime: 5 * 60 * 1000, // 5 minutes

        // Cache time - data is cached for 30 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)

        // Refetch on window focus (default true)
        refetchOnWindowFocus: true,

        // Refetch on reconnect (default true)
        refetchOnReconnect: true,

        // Don't refetch on mount by default
        refetchOnMount: false,

        // Network mode - always try to fetch
        networkMode: 'always',

        // Throw errors to error boundaries
        throwOnError: false,
      },
      mutations: {
        // Retry mutations once
        retry: 1,
        retryDelay,

        // Network mode
        networkMode: 'always',
      },
      dehydrate: {
        // Dehydrate all queries for SSR
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        // Default options for hydration
      },
    },
  });
};

// Export a singleton instance for client-side usage
// Note: In SSR, createQueryClient() should be called per request
export const queryClient = createQueryClient();

// Query key factories for consistent caching
export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // Task queries
  tasks: {
    all: ['tasks'] as const,
    lists: () => [...queryKeys.tasks.all, 'lists'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.tasks.lists(), filters] as const,
    details: () => [...queryKeys.tasks.all, 'details'] as const,
    detail: (id: string) => [...queryKeys.tasks.details(), id] as const,
  },

  // Project queries
  projects: {
    all: ['projects'] as const,
    lists: () => [...queryKeys.projects.all, 'lists'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.projects.lists(), filters] as const,
    details: () => [...queryKeys.projects.all, 'details'] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
    stats: (id: string) => [...queryKeys.projects.detail(id), 'stats'] as const,
  },

  // Label queries
  labels: {
    all: ['labels'] as const,
    lists: () => [...queryKeys.labels.all, 'lists'] as const,
  },

  // Dashboard queries
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
    weeklyActivity: () => [...queryKeys.dashboard.all, 'weekly-activity'] as const,
    streak: () => [...queryKeys.dashboard.all, 'streak'] as const,
  },

  // Pomodoro queries
  pomodoro: {
    all: ['pomodoro'] as const,
    stats: (range?: 'day' | 'week' | 'month') =>
      [...queryKeys.pomodoro.all, 'stats', range] as const,
  },
};
