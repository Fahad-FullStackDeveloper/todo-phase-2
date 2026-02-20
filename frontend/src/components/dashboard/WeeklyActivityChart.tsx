/**
 * WeeklyActivityChart Component
 *
 * Displays grouped bar chart showing tasks created vs completed
 * over the last 7 days using Recharts
 */

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { WeeklyActivity } from '@/types';
import { cn } from '@/lib/utils';
import { motionConfig } from '@/lib/motion';

interface WeeklyActivityChartProps {
  data?: WeeklyActivity;
  isLoading?: boolean;
  className?: string;
}

interface ChartData {
  date: string;
  day: string;
  created: number;
  completed: number;
}

function prepareData(activity: WeeklyActivity): ChartData[] {
  if (!activity?.days) return [];
  
  return activity.days.map((day) => ({
    date: day.date,
    day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    created: day.created,
    completed: day.completed,
  }));
}

export function WeeklyActivityChart({ data, isLoading, className }: WeeklyActivityChartProps) {
  const chartData = prepareData(data || { days: [] });

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (!data || chartData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
          <CardDescription>No activity data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionConfig.transition}
    >
      <Card className={className}>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
          <CardDescription>Tasks created vs completed over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="day" 
                  className="text-xs text-muted-foreground"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  className="text-xs text-muted-foreground"
                  tick={{ fill: 'currentColor' }}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Bar 
                  dataKey="created" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                  name="Created"
                />
                <Bar 
                  dataKey="completed" 
                  fill="hsl(var(--success))" 
                  radius={[4, 4, 0, 0]}
                  name="Completed"
                />
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
