'use client';

/**
 * TaskCardSkeleton Component
 *
 * Loading skeleton for TaskCard that matches the exact layout
 * Provides visual feedback during data fetching
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TaskCardSkeletonProps {
  count?: number;
  className?: string;
}

function SkeletonLine({ className, width }: { className?: string; width?: string }) {
  return (
    <div
      className={cn(
        'h-3 animate-pulse rounded bg-muted',
        width || 'w-full',
        className
      )}
    />
  );
}

function SkeletonCircle({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5',
    lg: 'h-8 w-8',
  };
  
  return (
    <div
      className={cn(
        'h-5 w-5 animate-pulse rounded-full bg-muted',
        sizes[size],
        className
      )}
    />
  );
}

export function TaskCardSkeletonItem({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn(
        'flex w-full items-start gap-3 rounded-lg border bg-card p-4 shadow-sm',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Checkbox skeleton */}
      <SkeletonCircle size="sm" className="mt-0.5" />

      {/* Content skeleton */}
      <div className="flex-1 space-y-3">
        {/* Title skeleton */}
        <SkeletonLine width="w-3/4" className="h-4" />

        {/* Metadata row skeleton */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Due date skeleton */}
          <div className="flex items-center gap-1.5">
            <SkeletonCircle size="sm" />
            <SkeletonLine width="w-20" />
          </div>

          {/* Priority skeleton */}
          <div className="flex items-center gap-1.5">
            <SkeletonCircle size="sm" />
            <SkeletonLine width="w-12" />
          </div>

          {/* Project skeleton */}
          <div className="flex items-center gap-1.5 rounded-full px-2 py-0.5">
            <SkeletonCircle size="sm" />
            <SkeletonLine width="w-16" />
          </div>
        </div>

        {/* Labels and subtasks skeleton */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Label skeletons */}
          <div className="flex items-center gap-1.5 rounded-full px-2 py-0.5">
            <SkeletonLine width="w-12" className="h-5" />
          </div>
          <div className="flex items-center gap-1.5 rounded-full px-2 py-0.5">
            <SkeletonLine width="w-16" className="h-5" />
          </div>

          {/* Subtask progress skeleton */}
          <div className="flex items-center gap-2">
            <SkeletonCircle size="sm" />
            <SkeletonLine width="w-24" className="h-1.5" />
          </div>
        </div>
      </div>

      {/* Actions skeleton */}
      <div className="flex items-center gap-1">
        <SkeletonCircle size="sm" className="h-8 w-8" />
        <SkeletonCircle size="sm" className="h-8 w-8" />
      </div>
    </motion.div>
  );
}

export function TaskCardSkeleton({ count = 3, className }: TaskCardSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <TaskCardSkeletonItem key={index} />
      ))}
    </div>
  );
}

export default TaskCardSkeleton;
