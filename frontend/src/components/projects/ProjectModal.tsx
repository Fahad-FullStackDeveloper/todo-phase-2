'use client';

/**
 * ProjectModal Component
 *
 * Create/edit project modal with:
 * - Name input (required)
 * - Color picker (12 preset colors)
 * - Description textarea (optional)
 * - Delete with confirmation (edit mode only)
 * - Keyboard shortcuts (Escape to close, Ctrl+S to save)
 */

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, Palette, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Project, CreateProjectData } from '@/types';
import { cn } from '@/lib/utils';
import { motionConfig } from '@/lib/motion';

// 12 preset colors as specified
export const PRESET_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#84cc16', // Lime
  '#22c55e', // Green
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#d946ef', // Fuchsia
  '#ec4899', // Pink
];

interface ProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null; // If provided, edit mode; otherwise create mode
  onSave: (data: CreateProjectData) => Promise<void>;
  onDelete?: (project: Project) => Promise<void>;
}

export function ProjectModal({
  open,
  onOpenChange,
  project,
  onSave,
  onDelete,
}: ProjectModalProps) {
  const isEditMode = !!project;
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[7]); // Default to blue
  const [errors, setErrors] = useState<{ name?: string }>({});

  // Reset form when modal opens/closes or project changes
  useEffect(() => {
    if (open) {
      if (project) {
        setName(project.name);
        setDescription(project.description || '');
        setColor(project.color);
      } else {
        setName('');
        setDescription('');
        setColor(PRESET_COLORS[7]);
      }
      setErrors({});
      setShowDeleteConfirm(false);

      // Focus name input after modal opens
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [open, project]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      // Escape to close
      if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange(false);
        return;
      }

      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, name, description, color]);

  const validate = () => {
    const newErrors: { name?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Project name must be at least 2 characters';
    } else if (name.trim().length > 100) {
      newErrors.name = 'Project name must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('Validation error', {
        description: 'Please fix the errors in the form',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave({
        name: name.trim(),
        description: description.trim() || undefined,
        color,
      });

      toast.success(isEditMode ? 'Project updated' : 'Project created', {
        description: isEditMode
          ? `"${name.trim()}" has been updated`
          : `"${name.trim()}" has been created`,
      });

      onOpenChange(false);
    } catch (error) {
      toast.error(isEditMode ? 'Update failed' : 'Create failed', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!project || !onDelete) return;

    setIsSubmitting(true);

    try {
      await onDelete(project);
      toast.success('Project deleted', {
        description: `"${project.name}" has been deleted`,
      });
      onOpenChange(false);
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error('Delete failed', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                Edit Project
              </>
            ) : (
              <>
                <Palette className="h-5 w-5" />
                Create New Project
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update your project details below'
              : 'Add a new project to organize your tasks'}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {showDeleteConfirm ? (
            <motion.div
              key="delete-confirm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-4"
            >
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-destructive">
                      Delete Project?
                    </h4>
                    <p className="text-sm text-destructive/80 mt-1">
                      This will permanently delete &quot;{project?.name}&quot;.
                      Tasks in this project will not be deleted but will no
                      longer be associated with it.
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Project
                </Button>
              </DialogFooter>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 py-4"
            >
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="project-name">
                  Project Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  ref={nameInputRef}
                  id="project-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Work, Personal, Learning"
                  className={cn(errors.name && 'border-destructive')}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Color Picker */}
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_COLORS.map((presetColor) => (
                    <motion.button
                      key={presetColor}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setColor(presetColor)}
                      className={cn(
                        'h-10 w-full rounded-lg border-2 transition-colors',
                        color === presetColor
                          ? 'border-foreground ring-2 ring-ring ring-offset-2'
                          : 'border-transparent hover:border-muted-foreground/30'
                      )}
                      style={{ backgroundColor: presetColor }}
                      aria-label={`Select color ${presetColor}`}
                      type="button"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">
                    Selected:
                  </span>
                  <div
                    className="h-4 w-4 rounded"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-mono text-muted-foreground">
                    {color}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="project-description">Description (optional)</Label>
                <Textarea
                  id="project-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description for your project..."
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              {/* Keyboard shortcuts hint */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>
                  <kbd className="rounded border bg-muted px-1.5 py-0.5">Ctrl+S</kbd> to save
                </span>
                <span>
                  <kbd className="rounded border bg-muted px-1.5 py-0.5">Esc</kbd> to close
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showDeleteConfirm && (
          <DialogFooter>
            {isEditMode && onDelete && (
              <Button
                variant="ghost"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Saving...'
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditMode ? 'Update' : 'Create'}
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
