/**
 * LabelCard Component
 *
 * Displays a label with color preview and task count
 * Used in labels management page
 */

'use client';

import { motion } from 'framer-motion';
import { MoreVertical, Edit, Trash2, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Label } from '@/types';
import { cn } from '@/lib/utils';

interface LabelCardProps {
  label: Label;
  onEdit?: (label: Label) => void;
  onDelete?: (label: Label) => void;
  className?: string;
}

export function LabelCard({ label, onEdit, onDelete, className }: LabelCardProps) {
  const taskCount = label._count?.tasks || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn('overflow-hidden transition-shadow hover:shadow-md', className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Color Preview */}
              <div
                className="h-10 w-10 rounded-lg shadow-sm"
                style={{ backgroundColor: label.color }}
              />
              
              {/* Label Info */}
              <div>
                <h3 className="font-medium">{label.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(label)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(label)}
                  className="text-error-600 focus:text-error-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * LabelCardSkeleton - Loading state
 */
export function LabelCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
