'use client';

/**
 * ProjectCard Component
 *
 * Displays project information with:
 * - Project name with color bar
 * - Task count (total, completed)
 * - Completion rate percentage
 * - Progress bar visualization
 * - Click to view project tasks
 * - Edit/delete actions on hover
 */

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Pencil,
  Trash2,
  FolderOpen,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Project, ProjectStats } from '@/types';
import { cn } from '@/lib/utils';
import { motionConfig } from '@/lib/motion';

interface ProjectCardProps {
  project: Project & { stats?: ProjectStats };
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);

  const totalTasks = project._count?.tasks ?? project.stats?.totalTasks ?? 0;
  const completedTasks = project.stats?.completedTasks ?? 0;
  const completionRate = project.stats?.completionRate ?? 0;

  const handleClick = () => {
    router.push(`/projects/${project.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(project);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(project);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={motionConfig.variants.scale}
      transition={motionConfig.transition}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className="group relative"
    >
      <Card
        onClick={handleClick}
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
          'border-l-4'
        )}
        style={{ borderLeftColor: project.color }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Color indicator */}
              <div
                className="h-3 w-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: project.color }}
              />
              
              {/* Project name */}
              <h3 className="font-semibold text-lg truncate flex-1">
                {project.name}
              </h3>
            </div>

            {/* Actions menu */}
            <div
              className={cn(
                'transition-opacity duration-200',
                showActions ? 'opacity-100' : 'opacity-0 lg:opacity-0'
              )}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {project.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Task counts */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Circle className="h-4 w-4" />
                {totalTasks} total
              </span>
              <span className="flex items-center gap-1.5 text-success-600">
                <CheckCircle2 className="h-4 w-4" />
                {completedTasks} done
              </span>
            </div>
            <span className="font-semibold text-primary">
              {completionRate.toFixed(0)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ backgroundColor: project.color }}
            />
          </div>

          {/* View tasks button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={handleClick}
          >
            <FolderOpen className="h-4 w-4" />
            View Tasks
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
