'use client';

/**
 * EmptyState Component
 *
 * Displays when no tasks match the current filters or when the task list is empty
 * Provides helpful messaging and call-to-action buttons
 */

import { motion } from 'framer-motion';
import { Inbox, Plus, Filter, Calendar, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  variant?: 'empty' | 'no-results' | 'loading';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  showFilters?: boolean;
  onClearFilters?: () => void;
  className?: string;
}

const variants = {
  empty: {
    icon: Inbox,
    defaultTitle: 'No tasks yet',
    defaultDescription: 'Get started by creating your first task',
  },
  'no-results': {
    icon: Filter,
    defaultTitle: 'No tasks match your filters',
    defaultDescription: 'Try adjusting your filters or create a new task',
  },
  loading: {
    icon: Calendar,
    defaultTitle: 'Loading tasks...',
    defaultDescription: 'Please wait while we fetch your tasks',
  },
};

export function EmptyState({
  variant = 'empty',
  title,
  description,
  actionLabel,
  onAction,
  showFilters = false,
  onClearFilters,
  className,
}: EmptyStateProps) {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <motion.div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 p-12 text-center',
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      role="status"
      aria-live="polite"
    >
      {/* Icon with animation */}
      <motion.div
        className="mb-4 rounded-full bg-muted p-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.1,
        }}
      >
        <Icon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </motion.div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        {title || config.defaultTitle}
      </h3>

      {/* Description */}
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {description || config.defaultDescription}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Primary action */}
        {actionLabel && onAction && (
          <Button onClick={onAction} className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {actionLabel}
          </Button>
        )}

        {/* Clear filters action */}
        {showFilters && onClearFilters && (
          <Button variant="outline" onClick={onClearFilters} className="gap-2">
            <Filter className="h-4 w-4" aria-hidden="true" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Additional hints */}
      {variant === 'empty' && (
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Press <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono font-medium">N</kbd> to quick add</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Folder className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Organize with projects</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Set due dates</span>
          </div>
        </motion.div>
      )}

      {/* No results hints */}
      {variant === 'no-results' && !showFilters && (
        <motion.div
          className="mt-6 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p>Tip: Use the filter bar to adjust your view</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default EmptyState;
