/**
 * LabelPicker Component
 *
 * Dropdown for selecting labels when creating/editing tasks
 * Features:
 * - Search/filter labels
 * - Multi-select
 * - Recently used labels
 * - Create new label option
 */

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Check, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import type { Label } from '@/types';
import { cn } from '@/lib/utils';

interface LabelPickerProps {
  labels: Label[];
  selectedLabels: string[];
  onChange: (labelIds: string[]) => void;
  onCreateLabel?: () => void;
  className?: string;
}

export function LabelPicker({
  labels,
  selectedLabels,
  onChange,
  onCreateLabel,
  className,
}: LabelPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter labels based on search
  const filteredLabels = useMemo(() => {
    if (!searchQuery.trim()) return labels;
    return labels.filter(l =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [labels, searchQuery]);

  // Toggle label selection
  const toggleLabel = (labelId: string) => {
    if (selectedLabels.includes(labelId)) {
      onChange(selectedLabels.filter(id => id !== labelId));
    } else {
      onChange([...selectedLabels, labelId]);
    }
  };

  const selectedLabelsData = labels.filter(l => selectedLabels.includes(l.id));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start gap-2 font-normal',
            !selectedLabels.length && 'text-muted-foreground',
            className
          )}
        >
          <Tag className="h-4 w-4" />
          {selectedLabels.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedLabelsData.slice(0, 3).map(label => (
                <span
                  key={label.id}
                  className="rounded px-1.5 py-0.5 text-xs text-white"
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                </span>
              ))}
              {selectedLabels.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{selectedLabels.length - 3}
                </span>
              )}
            </div>
          ) : (
            'Select labels...'
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="space-y-2 p-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search labels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
              autoFocus
            />
          </div>

          {/* Create New Label */}
          {onCreateLabel && !filteredLabels.some(l => l.name.toLowerCase() === searchQuery.toLowerCase()) && searchQuery.trim() && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-primary"
              onClick={() => {
                setOpen(false);
                onCreateLabel();
              }}
            >
              <Plus className="h-4 w-4" />
              Create &quot;{searchQuery}&quot;
            </Button>
          )}

          {/* Labels List */}
          <div className="max-h-[200px] overflow-y-auto space-y-1 scrollbar-thin">
            {filteredLabels.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No labels found
              </p>
            ) : (
              filteredLabels.map(label => (
                <motion.button
                  key={label.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => toggleLabel(label.id)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent',
                    selectedLabels.includes(label.id) && 'bg-accent'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: label.color }}
                    />
                    <span>{label.name}</span>
                  </div>
                  {selectedLabels.includes(label.id) && (
                    <Check className="h-4 w-4" />
                  )}
                </motion.button>
              ))
            )}
          </div>

          {/* Selected Labels Summary */}
          {selectedLabels.length > 0 && (
            <div className="border-t pt-2">
              <div className="flex flex-wrap gap-1">
                {selectedLabelsData.map(label => (
                  <Badge
                    key={label.id}
                    variant="secondary"
                    className="gap-1"
                    style={{ backgroundColor: `${label.color}20`, color: label.color }}
                  >
                    {label.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLabel(label.id);
                      }}
                      className="ml-1 hover:opacity-70"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
