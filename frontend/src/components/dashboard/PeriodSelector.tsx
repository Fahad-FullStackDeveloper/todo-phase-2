/**
 * PeriodSelector Component
 *
 * Time period selector for dashboard charts
 * Options: Last 7 days, Last 30 days, This month, All time
 */

'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DashboardPeriod } from '@/hooks/useDashboard';

interface PeriodSelectorProps {
  value: DashboardPeriod;
  onChange: (period: DashboardPeriod) => void;
  className?: string;
}

const periods: { value: DashboardPeriod; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: '7d', label: 'Last 7 days', icon: Clock },
  { value: '30d', label: 'Last 30 days', icon: Calendar },
  { value: 'month', label: 'This month', icon: TrendingUp },
  { value: 'all', label: 'All time', icon: Calendar },
];

export function PeriodSelector({ value, onChange, className }: PeriodSelectorProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {periods.map((period) => {
        const Icon = period.icon;
        const isActive = value === period.value;
        
        return (
          <Button
            key={period.value}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(period.value)}
            className={cn(
              'gap-2 transition-all',
              isActive && 'shadow-md'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{period.label}</span>
            <span className="sm:hidden">{period.value}</span>
          </Button>
        );
      })}
    </div>
  );
}
