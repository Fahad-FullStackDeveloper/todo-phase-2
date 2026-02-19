'use client';

/**
 * PomodoroStats Component
 *
 * Displays Pomodoro statistics with:
 * - Daily session count
 * - Weekly total focus time
 * - Session history list
 * - Simple bar chart visualization
 * - Time range selector (Day/Week/Month)
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Flame,
  BarChart3,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motionConfig } from '@/lib/motion';
import { usePomodoro } from '@/hooks/usePomodoro';
import type { PomodoroStats as PomodoroStatsType } from '@/types';

// =============================================================================
// Types
// =============================================================================

export interface PomodoroStatsProps {
  className?: string;
  compact?: boolean;
}

type TimeRange = 'day' | 'week' | 'month';

// =============================================================================
// Sample Data (for demo until backend provides history)
// =============================================================================

const SAMPLE_WEEKLY_DATA = [
  { day: 'Mon', minutes: 95, sessions: 4 },
  { day: 'Tue', minutes: 120, sessions: 5 },
  { day: 'Wed', minutes: 75, sessions: 3 },
  { day: 'Thu', minutes: 150, sessions: 6 },
  { day: 'Fri', minutes: 100, sessions: 4 },
  { day: 'Sat', minutes: 50, sessions: 2 },
  { day: 'Sun', minutes: 80, sessions: 3 },
];

// =============================================================================
// Stat Card Component
// =============================================================================

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
  color?: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  delay = 0,
  color = 'text-primary',
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ...motionConfig.transition }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="mt-1 text-2xl font-bold">{value}</p>
              {trend && (
                <p
                  className={cn(
                    'mt-1 text-xs',
                    trendUp ? 'text-success-600' : 'text-destructive'
                  )}
                >
                  {trend}
                </p>
              )}
            </div>
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-full bg-primary/10', color)}>
              <Icon className={cn('h-6 w-6', color)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// =============================================================================
// Weekly Chart Component
// =============================================================================

interface WeeklyChartProps {
  data: typeof SAMPLE_WEEKLY_DATA;
}

function WeeklyChart({ data }: WeeklyChartProps) {
  const maxMinutes = Math.max(...data.map((d) => d.minutes));
  
  return (
    <div className="mt-4">
      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <div className="relative flex h-full w-full items-end">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                className="w-full rounded-t-md bg-gradient-to-t from-primary/80 to-primary"
              />
            </div>
            <span className="text-xs text-muted-foreground">{day.day}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Session History Item
// =============================================================================

interface SessionHistoryItem {
  id: string;
  date: string;
  duration: number;
  taskTitle?: string;
  completed: boolean;
}

const SAMPLE_HISTORY: SessionHistoryItem[] = [
  { id: '1', date: 'Today, 10:30 AM', duration: 25, taskTitle: 'Review Q4 planning', completed: true },
  { id: '2', date: 'Today, 9:00 AM', duration: 25, taskTitle: 'Code review', completed: true },
  { id: '3', date: 'Yesterday, 4:00 PM', duration: 25, taskTitle: 'Write documentation', completed: true },
  { id: '4', date: 'Yesterday, 2:00 PM', duration: 25, taskTitle: 'Bug fixes', completed: true },
  { id: '5', date: 'Yesterday, 10:00 AM', duration: 25, taskTitle: 'Team meeting prep', completed: false },
];

interface SessionHistoryProps {
  sessions: SessionHistoryItem[];
}

function SessionHistory({ sessions }: SessionHistoryProps) {
  return (
    <div className="space-y-3">
      {sessions.map((session, index) => (
        <motion.div
          key={session.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50"
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full',
                session.completed
                  ? 'bg-success-600/10 text-success-600'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {session.taskTitle || 'Untitled Session'}
              </p>
              <p className="text-xs text-muted-foreground">{session.date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{session.duration} min</p>
            <p
              className={cn(
                'text-xs',
                session.completed
                  ? 'text-success-600'
                  : 'text-muted-foreground'
              )}
            >
              {session.completed ? 'Completed' : 'Incomplete'}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function PomodoroStats({ className, compact = false }: PomodoroStatsProps) {
  const { stats, isLoadingStats } = usePomodoro();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  
  // Use API stats or fallback to sample data
  const displayStats: PomodoroStatsType = stats || {
    totalSessions: 27,
    totalMinutes: 675,
    avgSessionLength: 25,
  };
  
  const totalHours = (displayStats.totalMinutes / 60).toFixed(1);
  
  if (compact) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Focus Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Today</p>
              <p className="text-lg font-bold">{displayStats.totalSessions} sessions</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">This Week</p>
              <p className="text-lg font-bold">{totalHours}h focus</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Pomodoro Statistics</h2>
        </div>
        
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          {(['day', 'week', 'month'] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="h-8 text-xs"
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sessions"
          value={displayStats.totalSessions}
          icon={Target}
          trend="+12% from last week"
          trendUp={true}
          delay={0.1}
        />
        
        <StatCard
          title="Total Focus Time"
          value={`${totalHours}h`}
          icon={Clock}
          trend="+5.2h from last week"
          trendUp={true}
          delay={0.15}
          color="text-success-600"
        />
        
        <StatCard
          title="Avg Session"
          value={`${Math.round(displayStats.avgSessionLength)} min`}
          icon={TrendingUp}
          trend="On track"
          trendUp={true}
          delay={0.2}
          color="text-info-600"
        />
        
        <StatCard
          title="Current Streak"
          value="5 days"
          icon={Flame}
          trend="Keep it up!"
          trendUp={true}
          delay={0.25}
          color="text-warning-600"
        />
      </div>
      
      {/* Weekly Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly Activity</CardTitle>
          <CardDescription>
            Focus minutes per day over the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WeeklyChart data={SAMPLE_WEEKLY_DATA} />
          
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Focus Time</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Total: {SAMPLE_WEEKLY_DATA.reduce((acc, d) => acc + d.minutes, 0)} min
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Session History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Sessions</CardTitle>
              <CardDescription>Your latest focus sessions</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <SessionHistory sessions={SAMPLE_HISTORY} />
        </CardContent>
      </Card>
      
      {/* Achievements / Milestones */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Milestones</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">First Session</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-600/10">
                <Clock className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-sm font-medium">10 Hours Focus</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-600/10">
                <Flame className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-sm font-medium">7 Day Streak</p>
                <p className="text-xs text-muted-foreground">5/7 days</p>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PomodoroStats;
