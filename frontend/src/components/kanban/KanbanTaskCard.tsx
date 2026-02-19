'use client';

/**
 * KanbanTaskCard Component
 *
 * Compact task card for Kanban board with:
 * - Title with priority indicator
 * - Due date with overdue highlighting
 * - Project badge with color
 * - Labels as colored dots
 * - Subtask progress bar
 * - Drag handle for @dnd-kit
 */

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Calendar, Flag, Hash, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeDate, getPriorityColor } from '@/lib/dateFormat';
import type { Task, Project, Label } from '@/types';

export interface KanbanTaskCardProps {
  task: Task;
  project?: Project;
  labels?: Label[];
  onClick?: () => void;
}

export function KanbanTaskCard({
  task,
  project,
  labels = [],
  onClick,
}: KanbanTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const subtaskProgress = task.subtasks?.length
    ? Math.round(
        (task.subtasks.filter((st) => st.completed).length /
          task.subtasks.length) *
          100
      )
    : 0;

  const isOverdue =
    task.due_date &&
    !task.completed &&
    new Date(task.due_date) < new Date();

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        'group relative cursor-grab rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md',
        isDragging && 'z-50 shadow-xl'
      )}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Priority Indicator */}
      <div
        className={cn(
          'absolute left-0 top-0 h-full w-1 rounded-l-lg',
          task.priority === 'urgent' && 'bg-error-600',
          task.priority === 'high' && 'bg-warning-600',
          task.priority === 'medium' && 'bg-primary',
          task.priority === 'low' && 'bg-muted-foreground'
        )}
      />

      {/* Task Content */}
      <div className="pl-2">
        {/* Title */}
        <h3 className="mb-2 text-sm font-medium leading-tight line-clamp-2">
          {task.title}
        </h3>

        {/* Metadata */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {/* Due Date */}
          {task.due_date && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs',
                isOverdue ? 'text-error-600' : 'text-muted-foreground'
              )}
            >
              <Calendar className="h-3 w-3" />
              <span>{formatRelativeDate(task.due_date)}</span>
            </div>
          )}

          {/* Priority Badge */}
          <div
            className={cn(
              'flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium',
              task.priority === 'urgent' && 'bg-error/10 text-error-600',
              task.priority === 'high' && 'bg-warning/10 text-warning-600',
              task.priority === 'medium' && 'bg-primary/10 text-primary',
              task.priority === 'low' && 'bg-muted text-muted-foreground'
            )}
          >
            <Flag className="h-3 w-3" />
            <span className="capitalize">{task.priority}</span>
          </div>
        </div>

        {/* Project & Labels */}
        {(project || labels.length > 0) && (
          <div className="mb-2 flex items-center gap-2">
            {/* Project Badge */}
            {project && (
              <div
                className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs"
                style={{
                  backgroundColor: `${project.color}20`,
                  color: project.color,
                }}
              >
                <Hash className="h-3 w-3" />
                <span className="truncate max-w-[80px]">{project.name}</span>
              </div>
            )}

            {/* Labels */}
            {labels.length > 0 && (
              <div className="flex items-center gap-1">
                {labels.slice(0, 3).map((label) => (
                  <div
                    key={label.id}
                    className="h-4 w-4 rounded-full border-2 border-background"
                    style={{ backgroundColor: label.color }}
                    title={label.name}
                  />
                ))}
                {labels.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{labels.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Subtask Progress */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {task.subtasks.filter((st) => st.completed).length}/
                {task.subtasks.length} subtasks
              </span>
              <span>{subtaskProgress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${subtaskProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default KanbanTaskCard;
