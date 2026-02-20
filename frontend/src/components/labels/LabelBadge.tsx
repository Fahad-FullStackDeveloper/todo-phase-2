/**
 * LabelBadge Component
 *
 * Small badge displaying a label
 * Used in task cards and lists
 */

'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LabelBadgeProps {
  name: string;
  color: string;
  onRemove?: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function LabelBadge({
  name,
  color,
  onRemove,
  size = 'sm',
  className,
}: LabelBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
  };

  // Calculate text color based on background brightness
  const getTextColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  const textColor = getTextColor(color);

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className={cn(
        'inline-flex items-center gap-1 rounded font-medium',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: `${color}20`,
        color: textColor,
        border: `1px solid ${color}40`,
      }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      {name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 transition-colors"
          style={{ color: textColor }}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </motion.span>
  );
}

/**
 * LabelBadgesGroup - Display multiple labels
 */
interface LabelBadgesGroupProps {
  labels: Array<{ name: string; color: string }>;
  maxVisible?: number;
  onRemove?: (index: number) => void;
  className?: string;
}

export function LabelBadgesGroup({
  labels,
  maxVisible = 3,
  onRemove,
  className,
}: LabelBadgesGroupProps) {
  const visible = labels.slice(0, maxVisible);
  const remaining = labels.length - maxVisible;

  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {visible.map((label, index) => (
        <LabelBadge
          key={label.name + index}
          name={label.name}
          color={label.color}
          onRemove={onRemove ? () => onRemove(index) : undefined}
        />
      ))}
      {remaining > 0 && (
        <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
          +{remaining}
        </span>
      )}
    </div>
  );
}
