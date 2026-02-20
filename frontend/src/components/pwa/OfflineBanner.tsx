/**
 * OfflineBanner Component
 *
 * Shows banner when connection is lost
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OfflineBannerProps {
  isOffline: boolean;
  onRetry?: () => void;
  className?: string;
}

export function OfflineBanner({ isOffline, onRetry, className }: OfflineBannerProps) {
  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={cn(
            'fixed left-0 right-0 top-0 z-50 bg-warning-600 px-4 py-2 text-white shadow-lg',
            className
          )}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-2">
              <WifiOff className="h-5 w-5" />
              <span className="text-sm font-medium">
                You&apos;re offline. Changes will sync when reconnected.
              </span>
            </div>
            {onRetry && (
              <Button
                size="sm"
                variant="secondary"
                onClick={onRetry}
                className="gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
