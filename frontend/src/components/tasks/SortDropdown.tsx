'use client';

/**
 * SortDropdown Component
 *
 * Provides sorting options for tasks:
 * - Created Date (Newest, Oldest)
 * - Due Date (Earliest, Latest)
 * - Priority (Highest, Lowest)
 * - Title (A-Z, Z-A)
 */

import { ChevronDown, SortAsc } from 'lucide-react';
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
import type { SortConfig } from '@/types';

export interface SortDropdownProps {
  sort: SortConfig;
  onSortChange: (sort: SortConfig) => void;
  className?: string;
}

const sortOptions: Array<{
  field: SortConfig['field'];
  label: string;
  directions: Array<{ value: 'asc' | 'desc'; label: string }>;
}> = [
  {
    field: 'due_date',
    label: 'Due Date',
    directions: [
      { value: 'asc', label: 'Earliest first' },
      { value: 'desc', label: 'Latest first' },
    ],
  },
  {
    field: 'created',
    label: 'Created Date',
    directions: [
      { value: 'desc', label: 'Newest first' },
      { value: 'asc', label: 'Oldest first' },
    ],
  },
  {
    field: 'priority',
    label: 'Priority',
    directions: [
      { value: 'desc', label: 'Highest first' },
      { value: 'asc', label: 'Lowest first' },
    ],
  },
  {
    field: 'title',
    label: 'Title',
    directions: [
      { value: 'asc', label: 'A to Z' },
      { value: 'desc', label: 'Z to A' },
    ],
  },
];

export function SortDropdown({
  sort,
  onSortChange,
  className,
}: SortDropdownProps) {
  const currentOption = sortOptions.find((opt) => opt.field === sort.field);

  const handleFieldSelect = (field: SortConfig['field']) => {
    const option = sortOptions.find((opt) => opt.field === field);
    if (option) {
      onSortChange({
        field,
        direction: option.directions[0].value,
      });
    }
  };

  const handleDirectionSelect = (direction: 'asc' | 'desc') => {
    onSortChange({
      ...sort,
      direction,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn('gap-2', className)}
          aria-label="Sort tasks"
        >
          <SortAsc className="h-4 w-4" aria-hidden="true" />
          <span>Sort</span>
          {currentOption && (
            <span className="text-xs text-muted-foreground">
              {currentOption.label}
            </span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {sortOptions.map((option) => (
            <DropdownMenuGroup key={option.field}>
              <DropdownMenuItem
                onClick={() => handleFieldSelect(option.field)}
                className="flex items-center justify-between gap-2 cursor-pointer font-medium"
              >
                {option.label}
                {sort.field === option.field && (
                  <ChevronDown className="h-4 w-4 rotate-[-90deg]" aria-hidden="true" />
                )}
              </DropdownMenuItem>

              {sort.field === option.field && (
                <div className="pl-4 py-1 space-y-1">
                  {option.directions.map((dir) => (
                    <DropdownMenuItem
                      key={dir.value}
                      onClick={() => handleDirectionSelect(dir.value)}
                      className={cn(
                        'cursor-pointer text-sm',
                        sort.direction === dir.value &&
                          'bg-accent text-accent-foreground'
                      )}
                    >
                      {dir.label}
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </DropdownMenuGroup>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SortDropdown;
