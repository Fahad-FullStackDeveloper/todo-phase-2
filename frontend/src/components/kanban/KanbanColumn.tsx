'use client';

/**
 * KanbanColumn Component
 *
 * Column component for Kanban board with:
 * - Status header with task count
 * - Droppable zone for @dnd-kit
 * - Task list with smooth animations
 * - Empty state with add task CTA
 */

import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Task, Project, Label } from '@/types';
import { KanbanTaskCard } from './KanbanTaskCard';

export interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  projects?: Project[];
  labels?: Label[];
  onTaskClick?: (task: Task) => void;
  onAddTask?: () => void;
}

const statusColors = {
  todo: 'bg-muted-foreground',
  in_progress: 'bg-primary',
  done: 'bg-success-600',
};

export function KanbanColumn({
  id,
  title,
  tasks,
  projects = [],
  labels = [],
  onTaskClick,
  onAddTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const statusMap: Record<string, string> = {
    todo: 'todo',
    in_progress: 'in_progress',
    done: 'done',
  };

  const columnTasks = tasks.filter(
    (task) => task.status === statusMap[id]
  );

  return (
    <div className="flex min-h-[500px] flex-col rounded-lg bg-muted/30">
      {/* Column Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'h-3 w-3 rounded-full',
              statusColors[id as keyof typeof statusColors] || 'bg-muted-foreground'
            )}
          />
          <h2 className="text-sm font-semibold">
            {title === 'in_progress' ? 'In Progress' : title.charAt(0).toUpperCase() + title.slice(1)}
          </h2>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
            {columnTasks.length}
          </span>
        </div>
        {id === 'todo' && onAddTask && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onAddTask}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Column Body - Droppable Zone */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 space-y-2 overflow-y-auto p-3 scrollbar-thin',
          isOver && 'bg-primary/5'
        )}
      >
        <AnimatePresence mode="popLayout">
          {columnTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex h-32 flex-col items-center justify-center text-center text-muted-foreground"
            >
              <p className="text-sm">No tasks</p>
              {id === 'todo' && onAddTask && (
                <Button
                  variant="link"
                  size="sm"
                  className="mt-1 h-auto p-0 text-xs"
                  onClick={onAddTask}
                >
                  Add one
                </Button>
              )}
            </motion.div>
          ) : (
            columnTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <KanbanTaskCard
                  task={task}
                  project={projects.find((p) => p.id === task.project_id)}
                  labels={task.labels}
                  onClick={() => onTaskClick?.(task)}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default KanbanColumn;
