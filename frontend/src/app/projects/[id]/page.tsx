'use client';

/**
 * Project Detail Page
 *
 * Project-specific task view with:
 * - Filter tasks by project
 * - Project stats display
 * - Edit/delete project actions
 * - Back to projects list button
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { ProjectModal } from '@/components/projects';
import { useRequireAuth } from '@/hooks/useAuth';
import { useTasks, useProjects } from '@/hooks/useTasks';
import { projects as projectsApi, tasks as tasksApi } from '@/lib/api';
import { cn, formatDate } from '@/lib/utils';
import { motionConfig } from '@/lib/motion';
import type { Project, CreateProjectData, TaskPriority } from '@/types';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { user, isLoading: authLoading } = useRequireAuth('/signin');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Fetch project
  const {
    data: project,
    isLoading: isLoadingProject,
    refetch: refetchProject,
  } = useProjects();

  const currentProject = project?.find((p) => p.id === projectId);

  // Fetch tasks filtered by project
  const {
    data: allTasks,
    isLoading: isLoadingTasks,
    refetch: refetchTasks,
  } = useTasks({
    filters: { project_id: projectId },
    enabled: !!projectId,
  });

  // Filter tasks
  const filteredTasks = allTasks?.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate stats
  const totalTasks = allTasks?.length ?? 0;
  const completedTasks = allTasks?.filter((t) => t.completed).length ?? 0;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleEditProject = () => {
    if (currentProject) {
      setEditingProject(currentProject);
      setModalOpen(true);
    }
  };

  const handleUpdateProject = async (data: CreateProjectData) => {
    if (!currentProject) return;
    await projectsApi.update(currentProject.id, data);
    await refetchProject();
    toast.success('Project updated', {
      description: `"${data.name}" has been updated`,
    });
  };

  const handleDeleteProject = async (project: Project) => {
    await projectsApi.delete(project.id);
    toast.success('Project deleted', {
      description: `"${project.name}" has been deleted`,
    });
    router.push('/projects');
  };

  const handleToggleTask = async (task: { id: string; completed: boolean; title: string }) => {
    try {
      await tasksApi.complete(task.id);
      await refetchTasks();
      toast.success(
        task.completed ? 'Task marked as incomplete' : 'Task completed! 🎉',
        { description: task.title }
      );
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${taskTitle}"?`)) return;
    try {
      await tasksApi.delete(taskId);
      await refetchTasks();
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return 'text-error-600 bg-error/10 border-error/20';
      case 'high':
        return 'text-warning-600 bg-warning/10 border-warning/20';
      case 'medium':
        return 'text-primary bg-primary/10 border-primary/20';
      default:
        return 'text-muted-foreground bg-muted border-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'text-success-600 bg-success/10';
      case 'in_progress':
        return 'text-primary bg-primary/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  if (authLoading || isLoadingProject) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="flex min-h-screen flex-col">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-1 flex-col">
          <TopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Project not found</h1>
              <p className="mt-2 text-muted-foreground">
                The project you&apos;re looking for doesn&apos;t exist or has been deleted.
              </p>
              <Button onClick={() => router.push('/projects')} className="mt-4 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Navigation */}
        <TopNav
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Project Detail Content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="mx-auto max-w-6xl space-y-6">
            {/* Project Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Back button and actions */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/projects')}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Projects
                </Button>

                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleEditProject} className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit Project
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${currentProject.name}"?`)) {
                            handleDeleteProject(currentProject);
                          }
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Project info card */}
              <Card className="border-l-4" style={{ borderLeftColor: currentProject.color }}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: currentProject.color }}
                    />
                    <CardTitle className="text-2xl">{currentProject.name}</CardTitle>
                  </div>
                  {currentProject.description && (
                    <CardDescription className="text-base mt-2">
                      {currentProject.description}
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>

              {/* Stats cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Total Tasks"
                  value={totalTasks}
                  icon={Circle}
                  color="text-muted-foreground"
                />
                <StatCard
                  title="Completed"
                  value={completedTasks}
                  icon={CheckCircle2}
                  color="text-success-600"
                />
                <StatCard
                  title="Pending"
                  value={pendingTasks}
                  icon={Clock}
                  color="text-primary"
                />
                <StatCard
                  title="Completion Rate"
                  value={`${completionRate.toFixed(0)}%`}
                  icon={AlertCircle}
                  color="text-warning-600"
                />
              </div>
            </motion.div>

            {/* Tasks Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle>Tasks</CardTitle>
                      <CardDescription>
                        {filteredTasks?.length ?? 0} of {totalTasks} tasks shown
                      </CardDescription>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search tasks..."
                          className="w-48 pl-8"
                        />
                      </div>

                      {/* Status Filter */}
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="all">All Status</option>
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>

                      {/* Priority Filter */}
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value as typeof priorityFilter)}
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="all">All Priority</option>
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {isLoadingTasks ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                  ) : filteredTasks && filteredTasks.length > 0 ? (
                    <div className="space-y-2">
                      <AnimatePresence mode="popLayout">
                        {filteredTasks.map((task, index) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.03 }}
                            className={cn(
                              'flex items-center gap-3 rounded-lg border p-3 transition-colors',
                              task.completed
                                ? 'bg-muted/50'
                                : 'hover:bg-accent/50'
                            )}
                          >
                            <button
                              onClick={() => handleToggleTask(task)}
                              className="flex-shrink-0"
                            >
                              {task.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-success-600" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              <p
                                className={cn(
                                  'font-medium truncate',
                                  task.completed && 'text-muted-foreground line-through'
                                )}
                              >
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-sm text-muted-foreground truncate">
                                  {task.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Priority badge */}
                              <span
                                className={cn(
                                  'rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
                                  getPriorityColor(task.priority)
                                )}
                              >
                                {task.priority}
                              </span>

                              {/* Status badge */}
                              <span
                                className={cn(
                                  'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                                  getStatusColor(task.status)
                                )}
                              >
                                {task.status.replace('_', ' ')}
                              </span>

                              {/* Due date */}
                              {task.due_date && (
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(task.due_date)}
                                </span>
                              )}

                              {/* Delete button */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDeleteTask(task.id, task.title)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Circle className="h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-4 font-semibold">No tasks found</h3>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                          ? 'Try adjusting your filters'
                          : 'Add your first task to this project'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Edit Project Modal */}
      <ProjectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        project={editingProject}
        onSave={handleUpdateProject}
        onDelete={handleDeleteProject}
      />
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-full bg-muted', color)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
