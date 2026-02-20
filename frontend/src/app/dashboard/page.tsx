'use client';

/**
 * Dashboard Page - Phase 7 Implementation
 *
 * Main dashboard view with:
 * - Welcome message with user personalization
 * - Task statistics with real-time data
 * - Quick task input with keyboard shortcut
 * - Weekly activity chart
 * - Tasks by priority distribution
 * - Tasks by project breakdown
 * - Period selector for time range
 * - Loading and empty states
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare,
  Target,
  TrendingUp,
  Flame,
  Plus,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { useRequireAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { motionConfig } from '@/lib/motion';
import { useDashboard, formatNumber, getCompletionRateColor } from '@/hooks/useDashboard';
import {
  StatCard,
  WeeklyActivityChart,
  TasksByPriorityChart,
  TasksByProjectChart,
  PeriodSelector,
  DashboardSkeleton,
} from '@/components/dashboard';
import type { DashboardPeriod } from '@/hooks/useDashboard';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useRequireAuth('/signin');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [period, setPeriod] = useState<DashboardPeriod>('7d');

  // Fetch dashboard data
  const { stats, activity, streak, isLoading } = useDashboard({ period });

  // Show loading only during initial auth check
  if (authLoading) {
    return (
      <div className="flex min-h-screen">
        <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/5">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-lg font-medium text-foreground">Loading your dashboard...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    toast.success('Task created', {
      description: `"${newTaskTitle}" has been added to your tasks`,
    });
    setNewTaskTitle('');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Navigation */}
        <TopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Welcome Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={motionConfig.variants.slideUp}
              transition={motionConfig.transition}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold sm:text-3xl">
                    {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}! 👋
                  </h1>
                  <p className="mt-1 text-muted-foreground">
                    Here&apos;s what&apos;s happening with your tasks today.
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="Add a new task"]') as HTMLInputElement;
                    input?.focus();
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </div>
            </motion.div>

            {/* Quick Add Task */}
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleAddTask}
              className="flex gap-2"
            >
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add a new task... (Press Enter)"
                className="flex-1"
              />
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </motion.form>

            {/* Period Selector */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center justify-between"
            >
              <h2 className="text-lg font-semibold">Overview</h2>
              <PeriodSelector value={period} onChange={setPeriod} />
            </motion.div>

            {/* Statistics Cards */}
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                          <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                        </div>
                        <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                <StatCard
                  title="Total Tasks"
                  value={formatNumber(stats?.data?.totalTasks || 0)}
                  icon={CheckSquare}
                  trend="All your tasks"
                  color="primary"
                  delay={0}
                />
                <StatCard
                  title="Completed Today"
                  value={stats?.data?.completedToday || 0}
                  icon={Target}
                  trend={stats?.data?.completedToday && stats.data.completedToday > 0 ? 'Great job!' : 'Get started'}
                  color="success"
                  delay={0.1}
                />
                <StatCard
                  title="Completion Rate"
                  value={`${stats?.data?.completionRate || 0}%`}
                  icon={TrendingUp}
                  progress={stats?.data?.completionRate || 0}
                  color="primary"
                  delay={0.2}
                />
                <StatCard
                  title="Current Streak"
                  value={`${streak?.data?.currentStreak || 0}d`}
                  icon={Flame}
                  trend={streak?.data?.currentStreak && streak.data.currentStreak > 0 ? 'Keep it up!' : 'Start your streak'}
                  color="warning"
                  delay={0.3}
                  customIcon={(
                    <Flame className={cn('h-6 w-6', (streak?.data?.currentStreak || 0) > 0 ? 'animate-pulse text-orange-500' : '')} />
                  )}
                />
              </motion.div>
            )}

            {/* Weekly Activity Chart */}
            <WeeklyActivityChart 
              data={activity.data || undefined} 
              isLoading={isLoading}
              className="w-full"
            />

            {/* Priority & Project Charts */}
            <div className="grid gap-4 lg:grid-cols-2">
              <TasksByPriorityChart 
                stats={stats.data || undefined} 
                isLoading={isLoading}
              />
              <TasksByProjectChart 
                stats={stats.data || undefined} 
                isLoading={isLoading}
              />
            </div>

            {/* Longest Streak Info */}
            {!isLoading && streak?.data?.longestStreak && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Longest Streak</p>
                        <p className="text-2xl font-bold">{streak.data.longestStreak} days</p>
                        {streak.data.lastCompletedDate && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Last completed: {new Date(streak.data.lastCompletedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Flame className="h-12 w-12 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
