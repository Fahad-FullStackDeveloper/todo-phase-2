'use client';

/**
 * QuickFilters Component
 *
 * Provides quick filter buttons for common date-based views:
 * - Today
 * - This Week
 * - Overdue
 * - Completed
 *
 * Shows task counts and active state
 */

import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Task, FilterConfig } from '@/types';
import { getDateRange, formatDateRange } from '@/lib/dateFormat';

export interface QuickFiltersProps {
  tasks: Task[];
  filters: FilterConfig;
  onFilterChange: (filters: FilterConfig) => void;
  className?: string;
}

const quickFilterTypes = [
  {
    id: 'today',
    label: 'Today',
    icon: Calendar,
    getFilter: (): FilterConfig => {
      const range = getDateRange('today');
      return {
        status: 'todo',
        // Note: Backend should support date range filtering
      };
    },
    test: (task: Task) => {
      if (!task.due_date || task.completed) return false;
      const dueDate = new Date(task.due_date);
      const today = new Date();
      return (
        dueDate.getDate() === today.getDate() &&
        dueDate.getMonth() === today.getMonth() &&
        dueDate.getFullYear() === today.getFullYear()
      );
    },
  },
  {
    id: 'thisWeek',
    label: 'This Week',
    icon: Clock,
    getFilter: (): FilterConfig => ({
      status: 'todo',
    }),
    test: (task: Task) => {
      if (!task.due_date || task.completed) return false;
      const dueDate = new Date(task.due_date);
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return dueDate >= now && dueDate <= weekFromNow;
    },
  },
  {
    id: 'overdue',
    label: 'Overdue',
    icon: AlertCircle,
    getFilter: (): FilterConfig => ({
      status: 'todo',
    }),
    test: (task: Task) => {
      if (!task.due_date || task.completed) return false;
      return new Date(task.due_date) < new Date();
    },
  },
  {
    id: 'completed',
    label: 'Completed',
    icon: CheckCircle,
    getFilter: (): FilterConfig => ({
      status: 'done',
    }),
    test: (task: Task) => task.completed,
  },
] as const;

export function QuickFilters({
  tasks,
  filters,
  onFilterChange,
  className,
}: QuickFiltersProps) {
  const getTaskCount = (filterType: (typeof quickFilterTypes)[number]) => {
    return tasks.filter(filterType.test).length;
  };

  const isActive = (filterId: string) => {
    if (filterId === 'today' && filters.status === 'todo') {
      // Simplified check - in production would check date range too
      return true;
    }
    if (filterId === 'overdue' && filters.status === 'todo') {
      return true;
    }
    if (filterId === 'completed' && filters.status === 'done') {
      return true;
    }
    return false;
  };

  const handleQuickFilter = (filterType: (typeof quickFilterTypes)[number]) => {
    const newFilter = filterType.getFilter();

    // Toggle off if already active
    if (
      (filterType.id === 'completed' && filters.status === 'done') ||
      (filterType.id !== 'completed' && filters.status === 'todo')
    ) {
      onFilterChange({});
    } else {
      onFilterChange(newFilter);
    }
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {quickFilterTypes.map((filterType) => {
        const count = getTaskCount(filterType);
        const active = isActive(filterType.id);
        const Icon = filterType.icon;

        return (
          <motion.div
            key={filterType.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={active ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleQuickFilter(filterType)}
              className={cn(
                'gap-2 min-w-[100px]',
                active && 'bg-primary hover:bg-primary/90'
              )}
              aria-pressed={active}
              aria-label={`Filter by ${filterType.label}`}
            >
              <Icon
                className={cn(
                  'h-4 w-4',
                  active && 'text-primary-foreground',
                  filterType.id === 'overdue' && !active && 'text-destructive'
                )}
                aria-hidden="true"
              />
              <span>{filterType.label}</span>
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    'flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-medium',
                    active
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {count}
                </motion.span>
              )}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}

export default QuickFilters;
