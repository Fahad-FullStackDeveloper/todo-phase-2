/**
 * TasksByPriorityChart Component
 *
 * Displays donut chart showing task distribution by priority
 * using Recharts
 */

'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardStats } from '@/types';
import { cn } from '@/lib/utils';
import { motionConfig } from '@/lib/motion';

interface TasksByPriorityChartProps {
  stats?: DashboardStats;
  isLoading?: boolean;
  className?: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const priorityColors: Record<string, string> = {
  urgent: 'hsl(var(--error))',
  high: 'hsl(var(--warning))',
  medium: 'hsl(var(--primary))',
  low: 'hsl(var(--muted-foreground))',
};

function prepareData(stats: DashboardStats | undefined): ChartData[] {
  if (!stats?.tasksByPriority) return [];
  
  return [
    { name: 'Urgent', value: stats.tasksByPriority.urgent, color: priorityColors.urgent },
    { name: 'High', value: stats.tasksByPriority.high, color: priorityColors.high },
    { name: 'Medium', value: stats.tasksByPriority.medium, color: priorityColors.medium },
    { name: 'Low', value: stats.tasksByPriority.low, color: priorityColors.low },
  ].filter(d => d.value > 0);
}

export function TasksByPriorityChart({ stats, isLoading, className }: TasksByPriorityChartProps) {
  const chartData = prepareData(stats);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (!stats || chartData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Tasks by Priority</CardTitle>
          <CardDescription>No tasks to display</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionConfig.transition}
    >
      <Card className={className}>
        <CardHeader>
          <CardTitle>Tasks by Priority</CardTitle>
          <CardDescription>Distribution of {total} tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number | undefined) => [`${value || 0} tasks`, 'Count']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend with counts */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name}: <span className="font-medium text-foreground">{item.value}</span>
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}
