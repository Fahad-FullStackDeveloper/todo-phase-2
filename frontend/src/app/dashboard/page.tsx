'use client';

/**
 * Dashboard Page
 *
 * Main dashboard view with:
 * - Welcome message
 * - Task statistics
 * - Quick task input
 * - Today's tasks
 * - Recent activity
 * - Productivity metrics
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  Clock,
  TrendingUp,
  Target,
  Plus,
  Calendar as CalendarIcon,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { useAuth } from '@/hooks/useAuth';
import { useRequireAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { motionConfig } from '@/lib/motion';

// Sample stats data (will be replaced with API data)
const sampleStats = {
  totalTasks: 42,
  completedToday: 5,
  completionRate: 78,
  currentStreak: 7,
  tasksByPriority: {
    low: 12,
    medium: 18,
    high: 8,
    urgent: 4,
  },
};

// Sample today's tasks
const sampleTodayTasks = [
  { id: '1', title: 'Review Q4 planning document', priority: 'high', completed: false },
  { id: '2', title: 'Team standup meeting', priority: 'medium', completed: true },
  { id: '3', title: 'Update project documentation', priority: 'low', completed: false },
  { id: '4', title: 'Code review for PR #123', priority: 'high', completed: false },
  { id: '5', title: 'Prepare presentation slides', priority: 'urgent', completed: false },
];

export default function DashboardPage() {
  const { user, isLoading } = useRequireAuth('/signin');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Don't render during auth check
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
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

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Navigation */}
        <TopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Welcome Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={motionConfig.variants.slideUp}
              transition={motionConfig.transition}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold">
                    Good morning, {user?.name || 'User'}! 👋
                  </h1>
                  <p className="mt-1 text-muted-foreground">
                    Here&apos;s what&apos;s happening with your tasks today.
                  </p>
                </div>
                <Button onClick={() => toast.info('Quick Add', { description: 'Press "N" to create a task' })}>
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

            {/* Statistics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <StatCard
                title="Total Tasks"
                value={sampleStats.totalTasks}
                icon={CheckSquare}
                trend="+12% from last week"
                trendUp={true}
              />
              <StatCard
                title="Completed Today"
                value={sampleStats.completedToday}
                icon={Target}
                trend="Great job!"
                trendUp={true}
              />
              <StatCard
                title="Completion Rate"
                value={`${sampleStats.completionRate}%`}
                icon={TrendingUp}
                trend="+5% from last week"
                trendUp={true}
              />
              <StatCard
                title="Current Streak"
                value={`${sampleStats.currentStreak} days`}
                icon={Clock}
                trend="Keep it up!"
                trendUp={true}
              />
            </motion.div>

            {/* Today's Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        Today&apos;s Tasks
                      </CardTitle>
                      <CardDescription>
                        You have {sampleTodayTasks.filter(t => !t.completed).length} pending tasks today
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sampleTodayTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + index * 0.05 }}
                        className={cn(
                          'flex items-center gap-3 rounded-lg border p-3 transition-colors',
                          task.completed
                            ? 'bg-muted/50'
                            : 'hover:bg-accent/50'
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {
                            toast.success(
                              task.completed ? 'Task marked as incomplete' : 'Task completed!',
                              { description: task.title }
                            );
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span
                          className={cn(
                            'flex-1 text-sm',
                            task.completed && 'text-muted-foreground line-through'
                          )}
                        >
                          {task.title}
                        </span>
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-xs font-medium',
                            getPriorityColor(task.priority)
                          )}
                        >
                          {task.priority}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Priority Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {Object.entries(sampleStats.tasksByPriority).map(([priority, count], index) => (
                <motion.div
                  key={priority}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                >
                  <Card className={cn(
                    'border-l-4',
                    priority === 'urgent' && 'border-l-error-600',
                    priority === 'high' && 'border-l-warning-600',
                    priority === 'medium' && 'border-l-primary',
                    priority === 'low' && 'border-l-muted-foreground'
                  )}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground capitalize">
                            {priority}
                          </p>
                          <p className="text-2xl font-bold">{count}</p>
                        </div>
                        <AlertCircle className={cn(
                          'h-8 w-8',
                          priority === 'urgent' && 'text-error-600',
                          priority === 'high' && 'text-warning-600',
                          priority === 'medium' && 'text-primary',
                          priority === 'low' && 'text-muted-foreground'
                        )} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className={cn(
              'mt-1 text-xs',
              trendUp ? 'text-success-600' : 'text-destructive'
            )}>
              {trend}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
