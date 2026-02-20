/**
 * LabelModal Component
 *
 * Modal for creating and editing labels
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ColorPicker } from './ColorPicker';
import type { Label as LabelType } from '@/types';

interface LabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; color: string }) => void;
  initialData?: LabelType;
  isEditing?: boolean;
  isLoading?: boolean;
}

export function LabelModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  isLoading = false,
}: LabelModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [error, setError] = useState('');

  // Reset form when modal opens/closes or editing changes
  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setColor(initialData?.color || '#3B82F6');
      setError('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate name
    if (!name.trim()) {
      setError('Label name is required');
      return;
    }

    if (name.trim().length > 50) {
      setError('Label name must be 50 characters or less');
      return;
    }

    onSubmit({ name: name.trim(), color });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {isEditing ? 'Edit Label' : 'Create Label'}
            </DialogTitle>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-muted transition-colors"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <DialogDescription>
            {isEditing
              ? 'Update your label details'
              : 'Add a new label to organize your tasks'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Label Name */}
          <div className="space-y-2">
            <Label htmlFor="label-name">Name</Label>
            <Input
              id="label-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Work, Personal, Urgent"
              autoFocus
              maxLength={50}
            />
          </div>

          {/* Color Picker */}
          <ColorPicker value={color} onChange={setColor} />

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="flex items-center gap-2 rounded-lg border bg-muted p-3">
              <div
                className="h-6 w-6 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span
                className="rounded px-2 py-0.5 text-sm font-medium text-white"
                style={{ backgroundColor: color }}
              >
                {name || 'Label name'}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-error-600">{error}</p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
