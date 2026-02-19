'use client';

/**
 * FilterDropdown Component
 *
 * Provides filtering options for tasks:
 * - Status (All, Todo, In Progress, Done)
 * - Priority (All, Urgent, High, Medium, Low)
 * - Project (All, plus user's projects)
 * - Labels (multi-select)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { TaskStatus, TaskPriority, Project, Label, FilterConfig } from '@/types';
import { getPriorityColor } from '@/lib/dateFormat';

export interface FilterDropdownProps {
  filters: FilterConfig;
  onFilterChange: (filters: FilterConfig) => void;
  projects?: Project[];
  labels?: Label[];
  className?: string;
}

export function FilterDropdown({
  filters,
  onFilterChange,
  projects = [],
  labels = [],
  className,
}: FilterDropdownProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const activeFilterCount = [
    filters.status ? 1 : 0,
    filters.priority ? 1 : 0,
    filters.project_id ? 1 : 0,
    filters.labels?.length || 0,
  ].reduce((a, b) => a + b, 0);

  const handleStatusToggle = (status: TaskStatus) => {
    onFilterChange({
      ...filters,
      status: filters.status === status ? undefined : status,
    });
  };

  const handlePriorityToggle = (priority: TaskPriority) => {
    onFilterChange({
      ...filters,
      priority: filters.priority === priority ? undefined : priority,
    });
  };

  const handleProjectSelect = (projectId: string | null) => {
    onFilterChange({
      ...filters,
      project_id: projectId === 'none' || projectId === null ? undefined : projectId,
    });
  };

  const handleLabelToggle = (labelId: string) => {
    const currentLabels = filters.labels || [];
    const newLabels = currentLabels.includes(labelId)
      ? currentLabels.filter((id) => id !== labelId)
      : [...currentLabels, labelId];

    onFilterChange({
      ...filters,
      labels: newLabels.length > 0 ? newLabels : undefined,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn('gap-2', className)}
          aria-label="Filter tasks"
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground"
            >
              {activeFilterCount}
            </motion.span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="start">
        {/* Header */}
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="font-semibold">Filters</DropdownMenuLabel>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={clearAllFilters}
            >
              Clear all
            </Button>
          )}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {/* Status Filter */}
          <div className="px-2 py-2">
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
              Status
            </DropdownMenuLabel>
            <div className="mt-2 space-y-1">
              {(['todo', 'in_progress', 'done'] as TaskStatus[]).map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusToggle(status)}
                  className="flex items-center justify-between gap-2 cursor-pointer"
                >
                  <span className="capitalize">
                    {status === 'in_progress' ? 'In Progress' : status}
                  </span>
                  {filters.status === status && (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Priority Filter */}
          <div className="px-2 py-2">
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
              Priority
            </DropdownMenuLabel>
            <div className="mt-2 space-y-1">
              {(['urgent', 'high', 'medium', 'low'] as TaskPriority[]).map((priority) => (
                <DropdownMenuItem
                  key={priority}
                  onClick={() => handlePriorityToggle(priority)}
                  className="flex items-center justify-between gap-2 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: getPriorityColor(priority) }}
                      aria-hidden="true"
                    />
                    <span className="capitalize">{priority}</span>
                  </div>
                  {filters.priority === priority && (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Project Filter */}
          {projects.length > 0 && (
            <div className="px-2 py-2">
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                Project
              </DropdownMenuLabel>
              <div className="mt-2 space-y-1">
                <DropdownMenuItem
                  onClick={() => handleProjectSelect(null)}
                  className="flex items-center justify-between gap-2 cursor-pointer"
                >
                  <span>All Projects</span>
                  {!filters.project_id && (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  )}
                </DropdownMenuItem>
                {projects.map((project) => (
                  <DropdownMenuItem
                    key={project.id}
                    onClick={() => handleProjectSelect(project.id)}
                    className="flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: project.color }}
                        aria-hidden="true"
                      />
                      <span className="truncate">{project.name}</span>
                    </div>
                    {filters.project_id === project.id && (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
            </div>
          )}

          <DropdownMenuSeparator />

          {/* Label Filter */}
          {labels.length > 0 && (
            <div className="px-2 py-2">
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                Labels
              </DropdownMenuLabel>
              <div className="mt-2 space-y-1">
                {labels.map((label) => {
                  const isSelected = (filters.labels || []).includes(label.id);
                  return (
                    <DropdownMenuItem
                      key={label.id}
                      onClick={() => handleLabelToggle(label.id)}
                      className="flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: label.color }}
                          aria-hidden="true"
                        />
                        <span className="truncate">{label.name}</span>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4" aria-hidden="true" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </div>
            </div>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default FilterDropdown;
