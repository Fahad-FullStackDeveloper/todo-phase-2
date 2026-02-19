'use client';

/**
 * QuickAddFAB Component
 *
 * Floating Action Button for rapid task entry with:
 * - Natural language date parsing
 * - Smart defaults based on context
 * - Expandable inline input
 * - Keyboard shortcut (N key)
 * - Multi-add support
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Check, Calendar, Flag, Folder, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseNaturalLanguageDate, getPriorityColor } from '@/lib/dateFormat';
import type { TaskPriority, Project, Label } from '@/types';

export interface QuickAddFABProps {
  onAddTask: (title: string, options?: {
    due_date?: string;
    priority?: TaskPriority;
    project_id?: string;
    labels?: string[];
  }) => Promise<void>;
  projects?: Project[];
  labels?: Label[];
  defaultProjectId?: string;
  defaultLabels?: string[];
  className?: string;
}

export function QuickAddFAB({
  onAddTask,
  projects = [],
  labels = [],
  defaultProjectId,
  defaultLabels = [],
  className,
}: QuickAddFABProps) {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [parsedDate, setParsedDate] = useState<{ date: Date; display: string } | null>(null);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [projectId, setProjectId] = useState<string>('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [tasksAdded, setTasksAdded] = useState(0);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Open with 'N' key (when not in input)
      if (event.key === 'n' || event.key === 'N') {
        const target = event.target as HTMLElement;
        const isInput =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable;

        if (!isInput && !isOpen) {
          event.preventDefault();
          setIsOpen(true);
          setIsExpanded(false);
        }
      }

      // Submit on Enter
      if (event.key === 'Enter' && isOpen && title.trim()) {
        event.preventDefault();
        handleSubmit();
      }

      // Close on Escape
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, title]);

  // Parse natural language in title
  useEffect(() => {
    if (!title) {
      setParsedDate(null);
      return;
    }

    // Check for date patterns in title
    const datePatterns = [
      /\b(today|tomorrow|yesterday|next week|next month)\b/i,
      /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
      /^\d{1,2}\s+\w+$/, // "15 feb"
      /\bat\s+\d{1,2}(:\d{2})?\s*(am|pm)?\b/i,
    ];

    const hasDatePattern = datePatterns.some((pattern) => pattern.test(title));

    if (hasDatePattern) {
      const parsed = parseNaturalLanguageDate(title);
      if (parsed.date && parsed.display) {
        setParsedDate({ date: parsed.date, display: parsed.display });
      } else {
        setParsedDate(null);
      }
    } else {
      setParsedDate(null);
    }
  }, [title]);

  // Initialize defaults when opened
  useEffect(() => {
    if (isOpen) {
      setProjectId(defaultProjectId || '');
      setSelectedLabels(defaultLabels || []);
      setPriority('medium');
      setTasksAdded(0);
    }
  }, [isOpen, defaultProjectId, defaultLabels]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsExpanded(false);
    setTitle('');
    setParsedDate(null);
    setTasksAdded(0);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Extract title without date pattern
      let cleanTitle = title;
      if (parsedDate) {
        // Remove the date portion from title
        cleanTitle = title.replace(
          /\b(today|tomorrow|yesterday|next week|next month|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
          ''
        ).replace(/\s+/g, ' ').trim();
      }

      await onAddTask(cleanTitle || title, {
        due_date: parsedDate?.date.toISOString(),
        priority,
        project_id: projectId || undefined,
        labels: selectedLabels.length > 0 ? selectedLabels : undefined,
      });

      setTasksAdded((prev) => prev + 1);
      setTitle('');
      setParsedDate(null);

      if (!addAnother) {
        handleClose();
      } else {
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, parsedDate, priority, projectId, selectedLabels, addAnother, onAddTask, handleClose, isSubmitting]);

  const toggleLabel = useCallback((labelId: string) => {
    setSelectedLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId]
    );
  }, []);

  const clearParsedDate = useCallback(() => {
    // Remove date pattern from title
    const withoutDate = title
      .replace(
        /\b(today|tomorrow|yesterday|next week|next month|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
        ''
      )
      .replace(/\bat\s+\d{1,2}(:\d{2})?\s*(am|pm)?\b/i, '')
      .replace(/\s+/g, ' ')
      .trim();
    setTitle(withoutDate);
    setParsedDate(null);
  }, [title]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <AnimatePresence>
        {isOpen ? (
          /* Expanded Input */
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute bottom-full right-0 mb-4 w-full max-w-md"
          >
            <div className="overflow-hidden rounded-lg border bg-card shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
                  >
                    {tasksAdded > 0 ? tasksAdded : <Plus className="h-3.5 w-3.5" />}
                  </motion.div>
                  <span className="text-sm font-medium">
                    {tasksAdded > 0 ? `${tasksAdded} task${tasksAdded > 1 ? 's' : ''} added` : 'Quick Add Task'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              {/* Input */}
              <div className="p-4">
                <Input
                  ref={inputRef}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="text-base"
                  disabled={isSubmitting}
                />

                {/* Parsed Date Preview */}
                <AnimatePresence>
                  {parsedDate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                        <span>{parsedDate.display}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={clearParsedDate}
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expanded Options */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-4 overflow-hidden"
                    >
                      {/* Priority */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">
                          Priority
                        </label>
                        <div className="mt-2 flex gap-2">
                          {(['low', 'medium', 'high', 'urgent'] as TaskPriority[]).map(
                            (p) => (
                              <Button
                                key={p}
                                variant={priority === p ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setPriority(p)}
                                className={cn(
                                  'h-8 capitalize',
                                  priority === p && 'text-primary-foreground'
                                )}
                                style={
                                  priority === p
                                    ? { backgroundColor: getPriorityColor(p) }
                                    : {}
                                }
                              >
                                {p}
                              </Button>
                            )
                          )}
                        </div>
                      </div>

                      {/* Project */}
                      {projects.length > 0 && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">
                            Project
                          </label>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Button
                              variant={!projectId ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setProjectId('')}
                              className={cn(
                                'h-8',
                                !projectId && 'bg-muted text-foreground'
                              )}
                            >
                              <Folder className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                              No Project
                            </Button>
                            {projects.map((project) => (
                              <Button
                                key={project.id}
                                variant={projectId === project.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setProjectId(project.id)}
                                className={cn(
                                  'h-8',
                                  projectId === project.id && 'text-primary-foreground'
                                )}
                                style={
                                  projectId === project.id
                                    ? { backgroundColor: project.color }
                                    : {}
                                }
                              >
                                <Folder className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                                {project.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Labels */}
                      {labels.length > 0 && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">
                            Labels
                          </label>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {labels.map((label) => (
                              <Button
                                key={label.id}
                                variant={
                                  selectedLabels.includes(label.id)
                                    ? 'default'
                                    : 'outline'
                                }
                                size="sm"
                                onClick={() => toggleLabel(label.id)}
                                className={cn(
                                  'h-8',
                                  selectedLabels.includes(label.id) &&
                                    'text-primary-foreground'
                                )}
                                style={
                                  selectedLabels.includes(label.id)
                                    ? { backgroundColor: label.color }
                                    : {}
                                }
                              >
                                <Tag className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                                {label.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add Another */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="add-another"
                          checked={addAnother}
                          onChange={(e) => setAddAnother(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label
                          htmlFor="add-another"
                          className="text-sm text-muted-foreground"
                        >
                          Add another task after this
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="mt-4 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs"
                  >
                    {isExpanded ? 'Less' : 'More'} options
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleClose}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!title.trim() || isSubmitting}
                      className="gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
                          />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" aria-hidden="true" />
                          {addAnother ? 'Add & Continue' : 'Add Task'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.div
        initial={false}
        animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Button
          size="lg"
          className={cn(
            'h-14 w-14 rounded-full shadow-lg',
            'hover:shadow-xl hover:scale-105',
            'transition-shadow'
          )}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close quick add' : 'Quick add task'}
          aria-expanded={isOpen}
        >
          <Plus className="h-6 w-6" aria-hidden="true" />
        </Button>
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute bottom-full right-full mb-2 mr-2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md"
          >
            Quick add <kbd className="rounded bg-muted px-1 font-mono">N</kbd>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default QuickAddFAB;
