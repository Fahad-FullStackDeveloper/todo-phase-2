'use client';

/**
 * TaskCard Component
 *
 * Displays a single task with:
 * - Checkbox for completion toggle with Framer Motion animation
 * - Title with strikethrough when completed
 * - Priority indicator with color coding
 * - Due date with overdue highlighting
 * - Project badge
 * - Labels
 * - Subtask progress indicator
 *
 * Follows WCAG 2.1 AA accessibility standards
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Flag, Calendar, Folder, ListChecks } from 'lucide-react';
import type { Task, Project, Label } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  formatRelativeDate,
  isOverdue,
  formatOverdue,
  getPriorityColor,
  getPriorityLabel,
} from '@/lib/dateFormat';

// =============================================================================
// Types
// =============================================================================

export interface TaskCardProps {
  task: Task;
  project?: Project | null;
  labels?: Label[];
  onToggleComplete?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  className?: string;
}

// =============================================================================
// Checkbox Component with Animation
// =============================================================================

interface TaskCheckboxProps {
  completed: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

function TaskCheckbox({ completed, onToggle, disabled }: TaskCheckboxProps) {
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={completed}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'relative flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        completed
          ? 'bg-primary border-primary'
          : 'bg-background border-border hover:border-primary/50',
        disabled && 'cursor-not-allowed opacity-50'
      )}
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -45 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// =============================================================================
// Priority Badge Component
// =============================================================================

interface PriorityBadgeProps {
  priority: Task['priority'];
  showLabel?: boolean;
}

function PriorityBadge({ priority, showLabel = false }: PriorityBadgeProps) {
  const color = getPriorityColor(priority);
  const label = getPriorityLabel(priority);

  return (
    <div className="flex items-center gap-1.5" title={`${label} priority`}>
      <motion.div
        className="flex items-center gap-1.5"
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.15 }}
      >
        <Flag
          className="h-3.5 w-3.5"
          style={{ color }}
          strokeWidth={2.5}
          aria-hidden="true"
        />
        {showLabel && (
          <span className="text-xs font-medium" style={{ color }}>
            {label}
          </span>
        )}
      </motion.div>
    </div>
  );
}

// =============================================================================
// Due Date Component
// =============================================================================

interface DueDateProps {
  dueDate: string | null;
  completed: boolean;
}

function DueDate({ dueDate, completed }: DueDateProps) {
  if (!dueDate) return null;

  const overdue = !completed && isOverdue(dueDate);
  const display = formatRelativeDate(dueDate);
  const overdueText = formatOverdue(dueDate);

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-xs',
        overdue
          ? 'text-destructive font-medium'
          : completed
          ? 'text-muted-foreground'
          : 'text-muted-foreground'
      )}
      title={overdue ? overdueText : undefined}
    >
      <Calendar
        className={cn('h-3.5 w-3.5', overdue && 'animate-pulse')}
        aria-hidden="true"
      />
      <span>{display}</span>
      {overdue && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive"
        >
          Overdue
        </motion.span>
      )}
    </div>
  );
}

// =============================================================================
// Project Badge Component
// =============================================================================

interface ProjectBadgeProps {
  project?: Project | null;
}

function ProjectBadge({ project }: ProjectBadgeProps) {
  if (!project) return null;

  return (
    <div
      className="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs"
      style={{
        backgroundColor: `${project.color}15`,
        color: project.color,
      }}
      title={project.name}
    >
      <Folder className="h-3 w-3" style={{ color: project.color }} aria-hidden="true" />
      <span className="max-w-[100px] truncate font-medium">{project.name}</span>
    </div>
  );
}

// =============================================================================
// Labels Component
// =============================================================================

interface TaskLabelsProps {
  labels?: Label[];
  maxDisplay?: number;
}

function TaskLabels({ labels, maxDisplay = 3 }: TaskLabelsProps) {
  if (!labels || labels.length === 0) return null;

  const visibleLabels = labels.slice(0, maxDisplay);
  const remainingCount = labels.length - maxDisplay;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visibleLabels.map((label) => (
        <motion.span
          key={label.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.1 }}
          className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
          style={{
            backgroundColor: `${label.color}15`,
            color: label.color,
          }}
          title={label.name}
        >
          <span className="font-medium">{label.name}</span>
        </motion.span>
      ))}
      {remainingCount > 0 && (
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          +{remainingCount}
        </span>
      )}
    </div>
  );
}

// =============================================================================
// Subtask Progress Component
// =============================================================================

interface SubtaskProgressProps {
  subtasks?: Task['subtasks'];
}

function SubtaskProgress({ subtasks }: SubtaskProgressProps) {
  if (!subtasks || subtasks.length === 0) return null;

  const completed = subtasks.filter((st) => st.completed).length;
  const total = subtasks.length;
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="flex items-center gap-2" title={`${completed}/${total} subtasks complete`}>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="font-medium">
          {completed}/{total}
        </span>
      </div>
      <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full',
            percentage === 100 ? 'bg-green-500' : 'bg-primary'
          )}
        />
      </div>
    </div>
  );
}

// =============================================================================
// Main TaskCard Component
// =============================================================================

export function TaskCard({
  task,
  project,
  labels,
  onToggleComplete,
  onEdit,
  onDelete,
  className,
}: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => {
    if (onToggleComplete) {
      onToggleComplete(task);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
    }
  };

  return (
    <motion.div
      className={cn(
        'group relative flex w-full items-start gap-3 rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md',
        task.completed && 'bg-muted/30',
        isOverdue(task.due_date) && !task.completed && 'border-destructive/30',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      layout
    >
      {/* Checkbox */}
      <div className="mt-0.5">
        <TaskCheckbox
          completed={task.completed}
          onToggle={handleToggle}
          disabled={false}
        />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2" role="article" aria-labelledby={`task-${task.id}-title`}>
        {/* Title */}
        <h3
          id={`task-${task.id}-title`}
          className={cn(
            'text-sm font-medium leading-none transition-colors',
            task.completed && 'text-muted-foreground line-through'
          )}
        >
          {task.title}
        </h3>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {/* Due Date */}
          <DueDate dueDate={task.due_date} completed={task.completed} />

          {/* Priority */}
          <PriorityBadge priority={task.priority} />

          {/* Project */}
          <ProjectBadge project={project || task.project} />
        </div>

        {/* Labels and Subtasks */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Labels */}
          <TaskLabels labels={labels || task.labels} />

          {/* Subtask Progress */}
          {task.subtasks && task.subtasks.length > 0 && (
            <SubtaskProgress subtasks={task.subtasks} />
          )}
        </div>
      </div>

      {/* Actions (visible on hover) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleEdit}
              aria-label="Edit task"
            >
              <span className="sr-only">Edit</span>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete?.(task)}
              aria-label="Delete task"
            >
              <span className="sr-only">Delete</span>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// =============================================================================
// Exports
// =============================================================================

export default TaskCard;
