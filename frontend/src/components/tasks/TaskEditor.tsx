'use client';

/**
 * TaskEditor Modal Component
 *
 * Rich task editor with:
 * - Title input with validation (1-200 chars)
 * - Markdown description with preview
 * - Priority selector with colors
 * - Due date picker with natural language parsing
 * - Project assignment dropdown
 * - Label multi-select
 * - Subtasks section
 * - Delete with confirmation
 *
 * Supports both create and edit modes
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Flag,
  Folder,
  Tags,
  ListChecks,
  Trash2,
  Save,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Code,
  Quote,
  Paperclip,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Task, Project, Label as LabelType, TaskPriority, CreateTaskData } from '@/types';
import {
  formatRelativeDate,
  parseNaturalLanguageDate,
  getPriorityColor,
  getPriorityLabel,
  formatForInput,
} from '@/lib/dateFormat';

export interface TaskEditorProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  onSave: (data: CreateTaskData & { id?: string }) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
  projects?: Project[];
  labels?: LabelType[];
  defaultProjectId?: string;
  defaultLabels?: string[];
}

const PRIORITY_OPTIONS: Array<{ value: TaskPriority; label: string }> = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export function TaskEditor({
  isOpen,
  onClose,
  task,
  onSave,
  onDelete,
  projects = [],
  labels = [],
  defaultProjectId,
  defaultLabels = [],
}: TaskEditorProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [dueDateDisplay, setDueDateDisplay] = useState('');
  const [projectId, setProjectId] = useState<string>('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [subtasks, setSubtasks] = useState<Array<{ id: string; title: string; completed: boolean }>>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // UI state
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form from task or defaults
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setDueDate(task.due_date ? formatForInput(task.due_date) : '');
      setDueDateDisplay(task.due_date ? formatRelativeDate(task.due_date) : '');
      setProjectId(task.project_id || '');
      setSelectedLabels(task.labels?.map((l) => l.id) || []);
      setSubtasks(
        task.subtasks?.map((st) => ({
          id: st.id,
          title: st.title,
          completed: st.completed,
        })) || []
      );
    } else {
      // New task defaults
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setDueDateDisplay('');
      setProjectId(defaultProjectId || '');
      // Only update labels if not editing - use functional update to avoid stale closure
      setSelectedLabels((prev) => (defaultLabels?.length > 0 ? defaultLabels : prev));
      setSubtasks([]);
    }
    setTitleError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, isOpen, defaultProjectId]);

  // Handle natural language date parsing
  const handleDueDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDueDate(value);

    // Try to parse natural language
    if (value && !value.includes('T')) {
      const parsed = parseNaturalLanguageDate(value);
      if (parsed.date) {
        setDueDate(formatForInput(parsed.date.toISOString()));
        setDueDateDisplay(parsed.display || '');
      } else if (parsed.error) {
        setDueDateDisplay('');
      }
    } else if (value) {
      // Standard date input
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setDueDateDisplay(formatRelativeDate(date));
      }
    } else {
      setDueDateDisplay('');
    }
  }, []);

  // Validate title
  const validateTitle = useCallback((value: string): boolean => {
    if (!value.trim()) {
      setTitleError('Task title is required');
      return false;
    }
    if (value.length > 200) {
      setTitleError('Title must be 200 characters or less');
      return false;
    }
    setTitleError('');
    return true;
  }, []);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!validateTitle(title)) return;

    setIsSaving(true);

    try {
      const data: CreateTaskData & { id?: string } = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        due_date: dueDate || undefined,
        project_id: projectId || undefined,
        labels: selectedLabels.length > 0 ? selectedLabels : undefined,
      };

      if (task?.id) {
        data.id = task.id;
      }

      await onSave(data);
      handleClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setIsSaving(false);
    }
  }, [title, description, priority, dueDate, projectId, selectedLabels, task?.id, onSave, validateTitle]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!task?.id || !onDelete) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"? This action cannot be undone.`
    );

    if (confirmed) {
      await onDelete(task.id);
      handleClose();
    }
  }, [task?.id, onDelete]);

  // Handle close
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close
      if (e.key === 'Escape') {
        handleClose();
      }
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose, handleSave]);

  // Subtask handlers
  const handleAddSubtask = useCallback(() => {
    if (!newSubtaskTitle.trim()) return;

    setSubtasks((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        title: newSubtaskTitle.trim(),
        completed: false,
      },
    ]);
    setNewSubtaskTitle('');
  }, [newSubtaskTitle]);

  const handleToggleSubtask = useCallback((subtaskId: string) => {
    setSubtasks((prev) =>
      prev.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )
    );
  }, []);

  const handleDeleteSubtask = useCallback((subtaskId: string) => {
    setSubtasks((prev) => prev.filter((st) => st.id !== subtaskId));
  }, []);

  // Label handlers
  const handleToggleLabel = useCallback((labelId: string) => {
    setSelectedLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId]
    );
  }, []);

  // Markdown toolbar insert
  const insertMarkdown = useCallback((before: string, after: string = '') => {
    const textarea = document.getElementById('description-input') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = description.substring(start, end);

    const newText =
      description.substring(0, start) +
      before +
      selectedText +
      after +
      description.substring(end);

    setDescription(newText);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  }, [description]);

  if (!isOpen) return null;

  const isEditing = !!task?.id;
  const subtaskProgress = subtasks.filter((st) => st.completed).length;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-editor-title"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* Modal */}
        <motion.div
          className="relative z-10 flex h-full max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-card shadow-xl"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 id="task-editor-title" className="text-lg font-semibold">
              {isEditing ? 'Edit Task' : 'New Task'}
            </h2>
            <div className="flex items-center gap-2">
              {isEditing && onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive"
                  aria-label="Delete task"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                aria-label="Close editor"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="task-title" className="text-sm font-medium">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="task-title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (titleError) validateTitle(e.target.value);
                  }}
                  onBlur={() => validateTitle(title)}
                  placeholder="What needs to be done?"
                  className={cn('mt-1.5', titleError && 'border-destructive')}
                  maxLength={200}
                  autoFocus
                />
                <div className="mt-1 flex items-center justify-between">
                  {titleError ? (
                    <span className="text-xs text-destructive">{titleError}</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Required field
                    </span>
                  )}
                  <span
                    className={cn(
                      'text-xs',
                      title.length > 180 ? 'text-destructive' : 'text-muted-foreground'
                    )}
                  >
                    {title.length}/200
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="description-input" className="text-sm font-medium">
                    Description
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="h-7 text-xs"
                    >
                      {isDescriptionExpanded ? 'Collapse' : 'Expand'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                      className="h-7 text-xs"
                    >
                      {showMarkdownPreview ? 'Edit' : 'Preview'}
                    </Button>
                  </div>
                </div>

                {isDescriptionExpanded ? (
                  <div className="mt-1.5 space-y-2">
                    {/* Markdown Toolbar */}
                    {!showMarkdownPreview && (
                      <div className="flex flex-wrap items-center gap-1 rounded-md border bg-muted p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => insertMarkdown('**', '**')}
                          aria-label="Bold"
                        >
                          <Bold className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => insertMarkdown('*', '*')}
                          aria-label="Italic"
                        >
                          <Italic className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => insertMarkdown('\n- ')}
                          aria-label="List"
                        >
                          <List className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => insertMarkdown('[', '](url)')}
                          aria-label="Link"
                        >
                          <LinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => insertMarkdown('\n```\n', '\n```')}
                          aria-label="Code"
                        >
                          <Code className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => insertMarkdown('\n> ')}
                          aria-label="Quote"
                        >
                          <Quote className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                      </div>
                    )}

                    {/* Textarea or Preview */}
                    {showMarkdownPreview ? (
                      <div className="min-h-[200px] rounded-md border bg-card p-4 prose prose-sm dark:prose-invert">
                        {description ? (
                          <ReactMarkdown>{description}</ReactMarkdown>
                        ) : (
                          <span className="text-muted-foreground">
                            Nothing to preview
                          </span>
                        )}
                      </div>
                    ) : (
                      <textarea
                        id="description-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add more details (markdown supported)..."
                        className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        maxLength={10000}
                      />
                    )}

                    <span className="block text-xs text-muted-foreground">
                      {description.length}/10,000 characters
                    </span>
                  </div>
                ) : (
                  <div
                    className="mt-1.5 cursor-pointer rounded-md border border-dashed p-3 text-sm text-muted-foreground hover:border-primary hover:text-primary"
                    onClick={() => setIsDescriptionExpanded(true)}
                  >
                    {description ? (
                      <div className="line-clamp-2">
                        <ReactMarkdown>{description}</ReactMarkdown>
                      </div>
                    ) : (
                      <span>Add a description...</span>
                    )}
                  </div>
                )}
              </div>

              {/* Metadata Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Priority */}
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {PRIORITY_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        variant={priority === option.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPriority(option.value)}
                        className={cn(
                          'gap-1.5',
                          priority === option.value &&
                            'text-primary-foreground'
                        )}
                        style={
                          priority === option.value
                            ? { backgroundColor: getPriorityColor(option.value) }
                            : {}
                        }
                      >
                        <Flag className="h-3.5 w-3.5" aria-hidden="true" />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <Label htmlFor="due-date" className="text-sm font-medium">
                    Due Date
                  </Label>
                  <div className="mt-1.5 space-y-2">
                    <Input
                      id="due-date"
                      type="datetime-local"
                      value={dueDate}
                      onChange={handleDueDateChange}
                      className="w-full"
                    />
                    <Input
                      placeholder="Or type 'tomorrow at 3pm'..."
                      value={dueDateDisplay || ''}
                      onChange={handleDueDateChange}
                      className="w-full"
                    />
                    {dueDateDisplay && !dueDate.includes('T') && (
                      <span className="text-xs text-muted-foreground">
                        Parsed: {dueDateDisplay}
                      </span>
                    )}
                  </div>
                </div>

                {/* Project */}
                <div>
                  <Label className="text-sm font-medium">Project</Label>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    <Button
                      variant={!projectId ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setProjectId('')}
                      className={!projectId ? 'bg-muted text-foreground' : ''}
                    >
                      No Project
                    </Button>
                    {projects.map((project) => (
                      <Button
                        key={project.id}
                        variant={projectId === project.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setProjectId(project.id)}
                        className={cn(
                          'gap-1.5',
                          projectId === project.id && 'text-primary-foreground'
                        )}
                        style={
                          projectId === project.id
                            ? { backgroundColor: project.color }
                            : {}
                        }
                      >
                        <Folder className="h-3.5 w-3.5" aria-hidden="true" />
                        {project.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Labels */}
                <div>
                  <Label className="text-sm font-medium">
                    <div className="flex items-center justify-between">
                      <span>Labels</span>
                      <span className="text-xs text-muted-foreground">(Optional)</span>
                    </div>
                  </Label>
                  <div className="mt-1.5 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLabelPicker(!showLabelPicker)}
                      className="w-full justify-start gap-2"
                    >
                      <Tags className="h-3.5 w-3.5" aria-hidden="true" />
                      {selectedLabels.length > 0
                        ? `${selectedLabels.length} label${selectedLabels.length > 1 ? 's' : ''} selected`
                        : 'Select labels (optional)'}
                    </Button>

                    <AnimatePresence>
                      {showLabelPicker && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-2 rounded-md border bg-card p-3">
                            {labels.length === 0 ? (
                              <div className="w-full space-y-2">
                                <p className="text-sm text-muted-foreground">No labels yet</p>
                                <p className="text-xs text-muted-foreground">
                                  Labels help you categorize tasks. You can create them from the Labels page.
                                </p>
                              </div>
                            ) : (
                              labels.map((label) => (
                                <Button
                                  key={label.id}
                                  variant={
                                    selectedLabels.includes(label.id)
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size="sm"
                                  onClick={() => handleToggleLabel(label.id)}
                                  className={cn(
                                    'gap-1.5',
                                    selectedLabels.includes(label.id) &&
                                      'text-primary-foreground'
                                  )}
                                  style={
                                    selectedLabels.includes(label.id)
                                      ? { backgroundColor: label.color }
                                      : {}
                                  }
                                >
                                  {label.name}
                                </Button>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Subtasks */}
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <ListChecks className="h-4 w-4" aria-hidden="true" />
                      Subtasks
                      {subtasks.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          ({subtaskProgress}/{subtasks.length} complete)
                        </span>
                      )}
                    </div>
                  </Label>
                </div>

                <div className="mt-1.5 space-y-2">
                  {/* Subtask List */}
                  {subtasks.length > 0 && (
                    <div className="space-y-1">
                      {subtasks.map((subtask) => (
                        <motion.div
                          key={subtask.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-center gap-2"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              'h-6 w-6 shrink-0 rounded',
                              subtask.completed && 'text-muted-foreground'
                            )}
                            onClick={() => handleToggleSubtask(subtask.id)}
                          >
                            {subtask.completed ? (
                              <svg
                                className="h-4 w-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <div className="h-4 w-4 rounded border border-current" />
                            )}
                          </Button>
                          <span
                            className={cn(
                              'flex-1 text-sm',
                              subtask.completed &&
                                'text-muted-foreground line-through'
                            )}
                          >
                            {subtask.title}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteSubtask(subtask.id)}
                          >
                            <X className="h-3.5 w-3.5" aria-hidden="true" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Add Subtask Input */}
                  <div className="flex items-center gap-2">
                    <Input
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddSubtask();
                        }
                      }}
                      placeholder="Add subtask..."
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddSubtask}
                      disabled={!newSubtaskTitle.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Attachments (Coming Soon) */}
              <div>
                <Label className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4" aria-hidden="true" />
                    Attachments
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                      Coming Soon
                    </span>
                  </div>
                </Label>
                <div className="mt-1.5 rounded-md border border-dashed bg-muted/30 p-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-full bg-muted p-3">
                      <Paperclip className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">File uploads coming soon</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        You'll be able to attach files, images, and documents to your tasks
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-xs text-muted-foreground">
              <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">Ctrl+S</kbd> to
              save · <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">Esc</kbd> to
              close
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || !title.trim()}
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" aria-hidden="true" />
                    {isEditing ? 'Save Changes' : 'Create Task'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default TaskEditor;
