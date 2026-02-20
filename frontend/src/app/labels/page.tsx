'use client';

/**
 * Labels Management Page
 *
 * Full CRUD interface for managing labels:
 * - View all labels with task counts
 * - Create new labels
 * - Edit existing labels
 * - Delete labels with confirmation
 * - Search and filter
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Tag } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import {
  LabelCard,
  LabelCardSkeleton,
  LabelModal,
} from '@/components/labels';
import { useLabels, useCreateLabel, useUpdateLabel, useDeleteLabel } from '@/hooks/useLabels';
import type { Label } from '@/types';

export default function LabelsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const [deletingLabel, setDeletingLabel] = useState<Label | null>(null);

  // Fetch labels
  const { data: labels, isLoading } = useLabels();

  // Mutations
  const createLabel = useCreateLabel();
  const updateLabel = useUpdateLabel();
  const deleteLabel = useDeleteLabel();

  // Filter labels
  const filteredLabels = labels?.filter((label: Label) =>
    label.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle create
  const handleCreate = (data: { name: string; color: string }) => {
    createLabel.mutate(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
      },
    });
  };

  // Handle update
  const handleUpdate = (data: { name: string; color: string }) => {
    if (!editingLabel) return;
    updateLabel.mutate(
      { id: editingLabel.id, data },
      {
        onSuccess: () => {
          setEditingLabel(null);
        },
      }
    );
  };

  // Handle delete
  const handleDelete = () => {
    if (!deletingLabel) return;
    deleteLabel.mutate(deletingLabel.id, {
      onSuccess: () => {
        setDeletingLabel(null);
      },
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Navigation */}
        <TopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

        {/* Labels Content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="mx-auto max-w-5xl space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <Tag className="h-8 w-8" />
                <div>
                  <h1 className="text-3xl font-bold">Labels</h1>
                  <p className="text-muted-foreground">
                    Organize your tasks with custom labels
                  </p>
                </div>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Label
              </Button>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search labels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </motion.div>

            {/* Labels Grid */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <LabelCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredLabels?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Tag className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No labels found</h3>
                  <p className="mt-1 text-muted-foreground">
                    {searchQuery
                      ? 'Try a different search term'
                      : 'Create your first label to organize tasks'}
                  </p>
                  {!searchQuery && (
                    <Button
                      className="mt-4"
                      onClick={() => setIsCreateModalOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Label
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredLabels?.map((label: Label) => (
                    <LabelCard
                      key={label.id}
                      label={label}
                      onEdit={setEditingLabel}
                      onDelete={setDeletingLabel}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Create Label Modal */}
      <LabelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={createLabel.isPending}
      />

      {/* Edit Label Modal */}
      <LabelModal
        isOpen={!!editingLabel}
        onClose={() => setEditingLabel(null)}
        onSubmit={handleUpdate}
        initialData={editingLabel || undefined}
        isEditing
        isLoading={updateLabel.isPending}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deletingLabel} onOpenChange={() => setDeletingLabel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Label</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingLabel?.name}&quot;?
              {deletingLabel && (deletingLabel._count?.tasks || 0) > 0 && (
                <span className="mt-2 block text-warning-600">
                  This label is used by {deletingLabel._count?.tasks} tasks.
                  They will remain but lose this label.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingLabel(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLabel.isPending}
            >
              {deleteLabel.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
