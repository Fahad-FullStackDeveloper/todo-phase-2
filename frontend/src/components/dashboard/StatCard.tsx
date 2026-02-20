/**
 * StatCard Component
 *
 * Displays a single dashboard statistic with:
 * - Title and value
 * - Icon with colored background
 * - Trend indicator
 * - Optional progress bar
 */

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motionConfig } from '@/lib/motion';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ComponentType<{ className?: string }>;
  customIcon?: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  trendValue?: number;
  progress?: number;
  color?: 'primary' | 'success' | 'warning' | 'error';
  delay?: number;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  customIcon,
  trend,
  trendUp,
  trendValue,
  progress,
  color = 'primary',
  delay = 0,
  className,
}: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success-600',
    warning: 'bg-warning/10 text-warning-600',
    error: 'bg-error/10 text-error-600',
  };

  const trendColor = trendUp ? 'text-success-600' : 'text-error-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...motionConfig.transition, delay }}
    >
      <Card className={cn('overflow-hidden transition-shadow hover:shadow-lg', className)}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              
              {(trend || trendValue !== undefined) && (
                <div className={cn('flex items-center gap-1 text-xs', trendColor)}>
                  {trendUp === true ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : trendUp === false ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : null}
                  {trendValue && <span>{trendValue > 0 ? '+' : ''}{trendValue}%</span>}
                  {trend && <span>{trend}</span>}
                </div>
              )}
            </div>
            
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', colorClasses[color])}>
              {customIcon || (Icon && <Icon className="h-6 w-6" />)}
            </div>
          </div>

          {progress !== undefined && (
            <div className="mt-4">
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={cn('h-full rounded-full', colorClasses[color].split(' ')[1])}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{progress}% complete</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
