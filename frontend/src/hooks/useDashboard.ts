/**
 * Dashboard Data Hook
 *
 * Fetches and manages dashboard statistics using TanStack Query
 * - Total tasks, completed today, completion rate, streaks
 * - Weekly activity data
 * - Tasks by priority and project
 */

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { DashboardStats, WeeklyActivity, StreakData } from '@/types';

export type DashboardPeriod = '7d' | '30d' | 'month' | 'all';

interface UseDashboardOptions {
  period?: DashboardPeriod;
  enabled?: boolean;
}

/**
 * Query key factory for dashboard data
 */
export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  stats: (period?: DashboardPeriod) => [...dashboardQueryKeys.all, 'stats', period] as const,
  weeklyActivity: (period?: DashboardPeriod) => [...dashboardQueryKeys.all, 'weeklyActivity', period] as const,
  streak: () => [...dashboardQueryKeys.all, 'streak'] as const,
};

/**
 * Hook to fetch dashboard statistics
 */
export function useDashboardStats(period: DashboardPeriod = '7d') {
  return useQuery<DashboardStats>({
    queryKey: dashboardQueryKeys.stats(period),
    queryFn: () => api.dashboard.stats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
  });
}

/**
 * Hook to fetch weekly activity data
 */
export function useWeeklyActivity(period: DashboardPeriod = '7d') {
  return useQuery<WeeklyActivity>({
    queryKey: dashboardQueryKeys.weeklyActivity(period),
    queryFn: () => api.dashboard.weeklyActivity(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Hook to fetch streak data
 */
export function useStreak() {
  return useQuery<StreakData>({
    queryKey: dashboardQueryKeys.streak(),
    queryFn: () => api.dashboard.streak(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Combined dashboard hook - fetches all dashboard data
 */
export function useDashboard(options: UseDashboardOptions = {}) {
  const { period = '7d', enabled = true } = options;

  const statsQuery = useDashboardStats(period);
  const activityQuery = useWeeklyActivity(period);
  const streakQuery = useStreak();

  return {
    stats: statsQuery,
    activity: activityQuery,
    streak: streakQuery,
    isLoading: statsQuery.isLoading || activityQuery.isLoading || streakQuery.isLoading,
    isError: statsQuery.isError || activityQuery.isError || streakQuery.isError,
    error: statsQuery.error || activityQuery.error || streakQuery.error,
  };
}

/**
 * Format large numbers with abbreviations (1.2K, 1.5M)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Get completion rate color based on percentage
 */
export function getCompletionRateColor(rate: number): string {
  if (rate >= 80) return 'text-success-600';
  if (rate >= 60) return 'text-warning-600';
  if (rate >= 40) return 'text-primary';
  return 'text-muted-foreground';
}
