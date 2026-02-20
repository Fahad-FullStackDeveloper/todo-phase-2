/**
 * SyncStatus Component
 *
 * Shows sync status indicator for offline operations
 */

'use client';

import { motion } from 'framer-motion';
import { Check, RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SyncStatusProps {
  status: 'synced' | 'syncing' | 'pending' | 'offline' | 'error';
  pendingCount?: number;
  className?: string;
}

const statusConfig: Record<SyncStatusProps['status'], {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
}> = {
  synced: {
    icon: Check,
    label: 'All synced',
    color: 'text-success-600',
  },
  syncing: {
    icon: RefreshCw,
    label: 'Syncing...',
    color: 'text-primary animate-spin',
  },
  pending: {
    icon: Clock,
    label: 'Pending sync',
    color: 'text-warning-600',
  },
  offline: {
    icon: WifiOff,
    label: 'Offline',
    color: 'text-muted-foreground',
  },
  error: {
    icon: Wifi,
    label: 'Sync failed',
    color: 'text-error-600',
  },
};

export function SyncStatus({ status, pendingCount, className }: SyncStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('flex items-center gap-2', className)}
    >
      <Icon className={cn('h-4 w-4', config.color)} />
      <span className="text-sm text-muted-foreground">
        {config.label}
        {pendingCount !== undefined && pendingCount > 0 && status === 'pending' && (
          <span className="ml-1">({pendingCount})</span>
        )}
      </span>
    </motion.div>
  );
}

/**
 * SyncStatusButton - Clickable sync trigger
 */
interface SyncStatusButtonProps {
  status: SyncStatusProps['status'];
  pendingCount?: number;
  onSync?: () => void;
  className?: string;
}

export function SyncStatusButton({ status, pendingCount, onSync, className }: SyncStatusButtonProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const isClickable = status === 'pending' || status === 'error';

  return (
    <button
      onClick={isClickable ? onSync : undefined}
      className={cn(
        'flex items-center gap-2 rounded-md px-2 py-1 transition-colors',
        isClickable && 'hover:bg-accent cursor-pointer',
        className
      )}
      title={config.label}
    >
      <Icon className={cn('h-4 w-4', config.color)} />
      {pendingCount !== undefined && pendingCount > 0 && (
        <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs">
          {pendingCount}
        </span>
      )}
    </button>
  );
}
