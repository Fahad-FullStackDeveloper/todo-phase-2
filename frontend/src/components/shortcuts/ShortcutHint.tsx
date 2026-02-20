/**
 * ShortcutHint Component
 *
 * Displays a small keyboard shortcut hint tooltip
 * Used inline with buttons and actions
 */

'use client';

import { formatShortcutKeys } from '@/lib/shortcuts/config';
import { cn } from '@/lib/utils';

interface ShortcutHintProps {
  keys: string;
  className?: string;
  showOnHover?: boolean;
}

export function ShortcutHint({ keys, className, showOnHover = false }: ShortcutHintProps) {
  const formattedKeys = formatShortcutKeys(keys);

  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-[20px] items-center justify-center rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground shadow-sm',
        showOnHover && 'opacity-0 group-hover:opacity-100 transition-opacity',
        className
      )}
      title={`Shortcut: ${formattedKeys}`}
    >
      {formattedKeys}
    </kbd>
  );
}

/**
 * ShortcutHintGroup - Multiple shortcut hints
 */
interface ShortcutHintGroupProps {
  shortcuts: string[];
  className?: string;
  separator?: string;
}

export function ShortcutHintGroup({
  shortcuts,
  className,
  separator = '/',
}: ShortcutHintGroupProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {shortcuts.map((key, index) => (
        <div key={key} className="flex items-center">
          <ShortcutHint keys={key} />
          {index < shortcuts.length - 1 && (
            <span className="text-xs text-muted-foreground">{separator}</span>
          )}
        </div>
      ))}
    </div>
  );
}
