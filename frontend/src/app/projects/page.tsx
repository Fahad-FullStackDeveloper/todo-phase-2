'use client';

/**
 * Projects Page
 *
 * Main projects dashboard with:
 * - Sidebar and TopNav layout
 * - List all projects with task counts
 * - Project cards with completion stats
 * - Add project creation button
 * - Empty state when no projects exist
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FolderKanban, Search, Grid, List as ListIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { ProjectCard, ProjectModal } from '@/components/projects';
import { useRequireAuth } from '@/hooks/useAuth';
import { useProjects, useTaskMutations } from '@/hooks/useTasks';
import { projects as projectsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { motionConfig } from '@/lib/motion';
import type { Project, CreateProjectData } from '@/types';

export default function ProjectsPage() {
  const { user, isLoading } = useRequireAuth('/signin');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Fetch projects
  const {
    data: projects,
    isLoading: isLoadingProjects,
    refetch,
  } = useProjects();

  // Ensure projects is always an array
  const projectsArray = Array.isArray(projects) ? projects : [];

  // Filter projects by search query
  const filteredProjects = projectsArray.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = async (data: CreateProjectData) => {
    try {
      await projectsApi.create(data);
      toast.success('Project created', {
        description: `"${data.name}" has been added to your projects`,
      });
      await refetch();
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error('Failed to create project', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
      throw error; // Re-throw so the modal knows it failed
    }
  };

  const handleUpdateProject = async (data: CreateProjectData) => {
    if (!editingProject) return;
    try {
      await projectsApi.update(editingProject.id, data);
      toast.success('Project updated', {
        description: `"${data.name}" has been updated`,
      });
      await refetch();
      setEditingProject(null);
    } catch (error) {
      console.error('Failed to update project:', error);
      toast.error('Failed to update project', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
      throw error;
    }
  };

  const handleDeleteProject = async (project: Project) => {
    try {
      await projectsApi.delete(project.id);
      toast.success('Project deleted', {
        description: `"${project.name}" has been removed`,
      });
      await refetch();
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
      throw error;
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Navigation */}
        <TopNav
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Projects Content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
                <p className="text-sm text-muted-foreground">
                  Organize your tasks into projects
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* View Toggle */}
                <div className="flex items-center rounded-lg border bg-background p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 px-2"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 px-2"
                  >
                    <ListIcon className="h-4 w-4" />
                  </Button>
                </div>

                {/* Create Button */}
                <Button onClick={openCreateModal} className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New Project</span>
                </Button>
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="pl-10"
                />
              </div>
            </motion.div>

            {/* Projects Grid/List */}
            {isLoadingProjects ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="mt-4 text-sm text-muted-foreground">Loading projects...</p>
                </div>
              </div>
            ) : filteredProjects && filteredProjects.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={cn(
                  'gap-4',
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'flex flex-col'
                )}
              >
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className={viewMode === 'list' ? 'max-w-2xl' : ''}
                    >
                      <ProjectCard
                        project={project}
                        onEdit={openEditModal}
                        onDelete={async (p) => {
                          if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
                            await handleDeleteProject(p);
                          }
                        }}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <FolderKanban className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">No projects found</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  {searchQuery
                    ? `No projects match "${searchQuery}". Try a different search term.`
                    : "You haven't created any projects yet. Create one to start organizing your tasks."}
                </p>
                {!searchQuery && (
                  <Button onClick={openCreateModal} className="mt-4 gap-2">
                    <Plus className="h-4 w-4" />
                    Create Your First Project
                  </Button>
                )}
              </motion.div>
            )}

            {/* Stats Summary */}
            {projects && projects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-lg border bg-card p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Total Projects</p>
                      <p className="text-2xl font-bold">{projects.length}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Total Tasks</p>
                      <p className="text-2xl font-bold">
                        {projects.reduce((acc, p) => acc + (p._count?.tasks ?? 0), 0)}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Click on a project to view its tasks
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Create/Edit Modal */}
      <ProjectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        project={editingProject}
        onSave={editingProject ? handleUpdateProject : handleCreateProject}
        onDelete={handleDeleteProject}
      />
    </div>
  );
}
