'use client';

/**
 * Keyboard Shortcuts Settings Page
 *
 * Allows users to view and customize keyboard shortcuts
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Keyboard, ToggleLeft, ToggleRight, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { ShortcutHelpModal, allShortcuts, formatShortcutKeys } from '@/components/shortcuts';
import { cn } from '@/lib/utils';

export default function KeyboardSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const toggleShortcuts = () => {
    setShortcutsEnabled(!shortcutsEnabled);
    localStorage.setItem('shortcuts_enabled', (!shortcutsEnabled).toString());
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    localStorage.setItem('sound_enabled', (!soundEnabled).toString());
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Navigation */}
        <TopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

        {/* Settings Content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <Keyboard className="h-8 w-8" />
                <div>
                  <h1 className="text-3xl font-bold">Keyboard Shortcuts</h1>
                  <p className="text-muted-foreground">
                    Customize and manage your keyboard shortcuts
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex gap-4"
            >
              <Button onClick={() => setShowHelpModal(true)}>
                <HelpCircle className="mr-2 h-4 w-4" />
                View All Shortcuts
              </Button>
            </motion.div>

            {/* Settings */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Configure keyboard shortcut behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable Keyboard Shortcuts</p>
                      <p className="text-sm text-muted-foreground">
                        Toggle all keyboard shortcuts on or off
                      </p>
                    </div>
                    <Switch
                      checked={shortcutsEnabled}
                      onCheckedChange={toggleShortcuts}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sound Effects</p>
                      <p className="text-sm text-muted-foreground">
                        Play sounds for actions and celebrations
                      </p>
                    </div>
                    <Switch
                      checked={soundEnabled}
                      onCheckedChange={toggleSound}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Shortcuts Reference */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Reference</CardTitle>
                  <CardDescription>
                    Most commonly used shortcuts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {allShortcuts.slice(0, 9).map((shortcut) => (
                      <div
                        key={shortcut.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <span className="text-sm text-muted-foreground">
                          {shortcut.description}
                        </span>
                        <kbd className="flex min-h-[28px] min-w-[28px] items-center justify-center rounded-md border bg-muted px-2 text-xs font-medium shadow-sm">
                          {formatShortcutKeys(shortcut.keys)}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Help Modal */}
      <ShortcutHelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </div>
  );
}
