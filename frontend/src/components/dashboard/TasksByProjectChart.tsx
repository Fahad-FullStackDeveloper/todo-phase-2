/**
 * TasksByProjectChart Component
 *
 * Displays horizontal bar chart showing task distribution by project
 * Top 5 projects + "Other" category using Recharts
 */

'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardStats } from '@/types';
import { cn } from '@/lib/utils';
import { motionConfig } from '@/lib/motion';

interface TasksByProjectChartProps {
  stats?: DashboardStats;
  isLoading?: boolean;
  className?: string;
}

interface ChartData {
  name: string;
  count: number;
  color: string;
}

const projectColors = [
  'hsl(var(--primary))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(280, 70%, 50%)',
  'hsl(200, 70%, 50%)',
  'hsl(var(--muted-foreground))', // "Other" category
];

function prepareData(stats: DashboardStats | undefined): ChartData[] {
  if (!stats?.tasksByProject) return [];
  
  const sorted = [...stats.tasksByProject].sort((a, b) => b.count - a.count);
  const top5 = sorted.slice(0, 5);
  const other = sorted.slice(5);
  
  const result: ChartData[] = top5.map((p, i) => ({
    name: p.project_name || 'Unnamed',
    count: p.count,
    color: projectColors[i % 5],
  }));
  
  if (other.length > 0) {
    const otherCount = other.reduce((sum, p) => sum + p.count, 0);
    result.push({
      name: 'Other',
      count: otherCount,
      color: projectColors[5],
    });
  }
  
  return result;
}

export function TasksByProjectChart({ stats, isLoading, className }: TasksByProjectChartProps) {
  const chartData = prepareData(stats);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (!stats || chartData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Tasks by Project</CardTitle>
          <CardDescription>No projects to display</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const total = chartData.reduce((sum, d) => sum + d.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionConfig.transition}
    >
      <Card className={className}>
        <CardHeader>
          <CardTitle>Tasks by Project</CardTitle>
          <CardDescription>Top projects with {total} total tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                layout="vertical"
                margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
              >
                <XAxis 
                  type="number" 
                  className="text-xs text-muted-foreground"
                  tick={{ fill: 'currentColor' }}
                  allowDecimals={false}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={80}
                  className="text-sm font-medium"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number | undefined) => [`${value || 0} tasks`, 'Count']}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
