/**
 * ShortcutHelpModal Component
 *
 * Displays all keyboard shortcuts in a searchable modal
 * Organized by category with visual key indicators
 */

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Keyboard, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { allShortcuts, formatShortcutKeys, getShortcutsByCategory } from '@/lib/shortcuts/config';
import { cn } from '@/lib/utils';

interface ShortcutHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryTitles: Record<string, string> = {
  global: 'Global Shortcuts',
  navigation: 'Navigation',
  task: 'Task List',
  priority: 'Priority',
};

const categoryDescriptions: Record<string, string> = {
  global: 'Always available (except when typing)',
  navigation: 'Press G then the shortcut key',
  task: 'When task list is focused',
  priority: 'When creating or editing tasks',
};

export function ShortcutHelpModal({ isOpen, onClose }: ShortcutHelpModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShortcuts = useMemo(() => {
    if (!searchQuery.trim()) {
      return allShortcuts;
    }

    const query = searchQuery.toLowerCase();
    return allShortcuts.filter(
      s =>
        s.description.toLowerCase().includes(query) ||
        s.keys.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const shortcutsByCategory = useMemo(() => {
    const categories = ['global', 'navigation', 'task', 'priority'] as const;
    const result: Record<string, typeof allShortcuts> = {};

    categories.forEach(category => {
      const categoryShortcuts = filteredShortcuts.filter(s => s.category === category);
      if (categoryShortcuts.length > 0) {
        result[category] = categoryShortcuts;
      }
    });

    return result;
  }, [filteredShortcuts]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Keyboard className="h-6 w-6" />
              <DialogTitle>Keyboard Shortcuts</DialogTitle>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <DialogDescription>
            Quick reference for all keyboard shortcuts
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search shortcuts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>

        {/* Shortcuts List */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin">
          {Object.entries(shortcutsByCategory).map(([category, shortcuts]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-3">
                <h3 className="text-sm font-semibold">{categoryTitles[category]}</h3>
                <p className="text-xs text-muted-foreground">
                  {categoryDescriptions[category]}
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.id}
                    className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50"
                  >
                    <span className="text-sm text-muted-foreground">
                      {shortcut.description}
                    </span>
                    <div className="flex gap-1">
                      {shortcut.keys.split(' ').map((key, index) => (
                        <kbd
                          key={index}
                          className={cn(
                            'flex min-h-[28px] min-w-[28px] items-center justify-center rounded-md border bg-muted px-2 text-xs font-medium shadow-sm',
                            index > 0 && 'ml-1'
                          )}
                        >
                          {formatShortcutKeys(key)}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {filteredShortcuts.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <p>No shortcuts found for &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="mt-4 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
          <span>Press <kbd className="rounded border bg-muted px-1.5 py-0.5">?</kbd> to open this help</span>
          <span>Press <kbd className="rounded border bg-muted px-1.5 py-0.5">Esc</kbd> to close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
