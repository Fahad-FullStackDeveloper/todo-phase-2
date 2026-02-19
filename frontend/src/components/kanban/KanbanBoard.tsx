'use client';

/**
 * KanbanBoard Component
 *
 * Main Kanban board with:
 * - 3 columns: Todo, In Progress, Done
 * - Drag-and-drop with @dnd-kit
 * - Task status updates on drop
 * - Responsive layout
 * - Integration with existing task management
 */

import { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, KeyboardSensor, closestCorners } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTaskManager } from '@/hooks/useTasks';
import { useTasks } from '@/hooks/useTasks';
import type { Task, FilterConfig, SortConfig } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanTaskCard } from './KanbanTaskCard';
import { TaskEditor } from '@/components/tasks/TaskEditor';

export interface KanbanBoardProps {
  onTaskEdit?: (task: Task) => void;
}

export function KanbanBoard({ onTaskEdit }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Fetch tasks with Kanban-appropriate sorting
  const {
    tasks: tasksFromHook,
    isLoadingTasks,
    projects: projectsFromHook,
    labels: labelsFromHook,
    updateTask,
    createTask,
  } = useTaskManager({
    sort: { field: 'created', direction: 'desc' },
  });

  // Ensure all data is always arrays
  const tasks = Array.isArray(tasksFromHook) ? tasksFromHook : [];
  const projects = Array.isArray(projectsFromHook) ? projectsFromHook : [];
  const labels = Array.isArray(labelsFromHook) ? labelsFromHook : [];

  // Setup drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle task click
  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsEditorOpen(true);
  }, []);

  // Handle add task
  const handleAddTask = useCallback(() => {
    setSelectedTask(null);
    setIsEditorOpen(true);
  }, []);

  // Handle editor save
  const handleEditorSave = useCallback(
    async (data: any) => {
      if (data.id && selectedTask) {
        await updateTask(data.id, data);
      } else {
        await createTask(data);
      }
      setIsEditorOpen(false);
      setSelectedTask(null);
    },
    [selectedTask, updateTask, createTask]
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) {
        setActiveTask(null);
        return;
      }

      const taskId = active.id as string;
      const newStatus = over.id as string;

      // Validate status
      const validStatuses = ['todo', 'in_progress', 'done'];
      if (!validStatuses.includes(newStatus)) {
        setActiveTask(null);
        return;
      }

      // Find the task
      const task = tasks.find((t) => t.id === taskId);
      if (!task || task.status === newStatus) {
        setActiveTask(null);
        return;
      }

      // Optimistic update
      setActiveTask(task);

      try {
        await updateTask(taskId, { status: newStatus as Task['status'] });
        toast.success('Task moved', {
          description: `Moved to ${newStatus === 'in_progress' ? 'In Progress' : newStatus}`,
        });
      } catch (error) {
        toast.error('Failed to move task', {
          description: 'Please try again',
        });
      } finally {
        setActiveTask(null);
      }
    },
    [tasks, updateTask]
  );

  // Loading state
  if (isLoadingTasks) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading Kanban board...</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={({ active }) => {
        const task = tasks.find((t) => t.id === active.id);
        if (task) setActiveTask(task);
      }}
      onDragEnd={handleDragEnd}
    >
      <div className="grid h-full grid-cols-3 gap-4">
        <KanbanColumn
          id="todo"
          title="Todo"
          tasks={tasks}
          projects={projects}
          labels={labels}
          onTaskClick={handleTaskClick}
          onAddTask={handleAddTask}
        />
        <KanbanColumn
          id="in_progress"
          title="In Progress"
          tasks={tasks}
          projects={projects}
          labels={labels}
          onTaskClick={handleTaskClick}
        />
        <KanbanColumn
          id="done"
          title="Done"
          tasks={tasks}
          projects={projects}
          labels={labels}
          onTaskClick={handleTaskClick}
        />
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask && (
          <div className="rotate-3 opacity-90">
            <KanbanTaskCard
              task={activeTask}
              project={projects.find((p) => p.id === activeTask.project_id)}
              labels={activeTask.labels}
            />
          </div>
        )}
      </DragOverlay>

      {/* Task Editor Modal */}
      <TaskEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSave={handleEditorSave}
        projects={projects}
        labels={labels}
      />
    </DndContext>
  );
}

export default KanbanBoard;
