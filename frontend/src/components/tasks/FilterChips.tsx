'use client';

/**
 * FilterChips Component
 *
 * Displays active filters as removable chips/badges
 * Provides visual feedback for applied filters
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { FilterConfig, TaskPriority, TaskStatus, Project, Label } from '@/types';
import { getPriorityColor, getPriorityLabel } from '@/lib/dateFormat';

export interface FilterChipsProps {
  filters: FilterConfig;
  onFilterChange: (filters: FilterConfig) => void;
  projects?: Project[];
  labels?: Label[];
  className?: string;
}

export function FilterChips({
  filters,
  onFilterChange,
  projects = [],
  labels = [],
  className,
}: FilterChipsProps) {
  const chips: Array<{
    id: string;
    label: string;
    color?: string;
    onRemove: () => void;
  }> = [];

  // Status filter chip
  if (filters.status) {
    const statusLabels: Record<TaskStatus, string> = {
      todo: 'To Do',
      in_progress: 'In Progress',
      done: 'Done',
    };
    chips.push({
      id: 'status',
      label: `Status: ${statusLabels[filters.status]}`,
      onRemove: () => onFilterChange({ ...filters, status: undefined }),
    });
  }

  // Priority filter chip
  if (filters.priority) {
    chips.push({
      id: 'priority',
      label: `Priority: ${getPriorityLabel(filters.priority)}`,
      color: getPriorityColor(filters.priority),
      onRemove: () => onFilterChange({ ...filters, priority: undefined }),
    });
  }

  // Project filter chip
  if (filters.project_id) {
    const project = projects.find((p) => p.id === filters.project_id);
    if (project) {
      chips.push({
        id: `project-${project.id}`,
        label: `Project: ${project.name}`,
        color: project.color,
        onRemove: () => onFilterChange({ ...filters, project_id: undefined }),
      });
    }
  }

  // Label filter chips
  if (filters.labels && filters.labels.length > 0) {
    filters.labels.forEach((labelId) => {
      const label = labels.find((l) => l.id === labelId);
      if (label) {
        chips.push({
          id: `label-${label.id}`,
          label: `Label: ${label.name}`,
          color: label.color,
          onRemove: () => {
            const newLabels = filters.labels?.filter((id) => id !== labelId) || [];
            onFilterChange({
              ...filters,
              labels: newLabels.length > 0 ? newLabels : undefined,
            });
          },
        });
      }
    });
  }

  if (chips.length === 0) return null;

  const clearAllFilters = () => {
    onFilterChange({});
  };

  return (
    <motion.div
      className={cn('flex flex-wrap items-center gap-2', className)}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <AnimatePresence mode="popLayout">
        {chips.map((chip) => (
          <motion.div
            key={chip.id}
            layout
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
                chip.color
                  ? 'text-foreground'
                  : 'bg-muted text-muted-foreground border-muted'
              )}
              style={
                chip.color
                  ? {
                      backgroundColor: `${chip.color}10`,
                      borderColor: `${chip.color}30`,
                    }
                  : {}
              }
            >
              {chip.color && (
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: chip.color }}
                  aria-hidden="true"
                />
              )}
              <span>{chip.label}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 rounded-full hover:bg-destructive/20"
                onClick={chip.onRemove}
                aria-label={`Remove ${chip.label} filter`}
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Clear All Button */}
      {chips.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default FilterChips;
