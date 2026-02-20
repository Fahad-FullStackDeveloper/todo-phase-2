/**
 * InstallPrompt Component
 *
 * Shows PWA install prompt banner
 * Appears after 2+ visits on supported browsers
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface InstallPromptProps {
  className?: string;
}

export function InstallPrompt({ className }: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if user dismissed before
    const dismissed = localStorage.getItem('pwa_install_dismissed');
    const dismissedDate = dismissed ? new Date(dismissed) : null;
    
    // Don't show if dismissed in last 7 days
    if (dismissedDate) {
      const daysSinceDismissal = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissal < 7) return;
    }

    // Check visit count
    const visitCount = parseInt(localStorage.getItem('pwa_visit_count') || '0', 10);
    localStorage.setItem('pwa_visit_count', (visitCount + 1).toString());

    // Show after 2+ visits
    if (visitCount >= 2) {
      // Listen for install prompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowPrompt(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
      localStorage.setItem('pwa_install_dismissed', new Date().toISOString());
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_install_dismissed', new Date().toISOString());
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className={cn('fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:w-96', className)}
        >
          <Card className="overflow-hidden shadow-lg">
            <div className="flex items-start gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Download className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-medium">Install TodoFlow</h3>
                <p className="text-sm text-muted-foreground">
                  Install our app for quick access and offline support
                </p>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={handleInstall}>
                    Install
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleDismiss}>
                    Not now
                  </Button>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="rounded p-1 hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Check if app is installed (running as PWA)
 */
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches;
}
