/**
 * ColorPicker Component
 *
 * Color picker for labels with:
 * - 12 preset colors
 * - Custom hex input
 * - Validation
 */

'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, Palette } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { labelColors, isValidHexColor } from '@/hooks/useLabels';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(value);
  const [error, setError] = useState('');

  const handlePresetClick = useCallback((color: string) => {
    onChange(color);
    setCustomColor(color);
    setError('');
  }, [onChange]);

  const handleCustomColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);

    if (isValidHexColor(newColor)) {
      onChange(newColor);
      setError('');
    } else if (newColor.startsWith('#')) {
      setError('Invalid hex color. Use format #RRGGBB');
    } else {
      setError('');
    }
  }, [onChange]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Preset Colors */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          <Palette className="mr-1 inline h-4 w-4" />
          Choose a color
        </label>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
          {labelColors.map((color) => (
            <motion.button
              key={color}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePresetClick(color)}
              className={cn(
                'relative h-8 w-8 rounded-lg shadow-sm transition-shadow hover:shadow-md',
                value === color && 'ring-2 ring-offset-2 ring-primary'
              )}
              style={{ backgroundColor: color }}
              type="button"
            >
              {value === color && (
                <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow" />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom Color Input */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Or enter custom color
        </label>
        <div className="flex gap-2">
          <div className="relative">
            <Input
              type="text"
              value={customColor}
              onChange={handleCustomColorChange}
              placeholder="#000000"
              className={cn('w-32 font-mono', error && 'border-error-600')}
              maxLength={7}
            />
            <div
              className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 rounded border"
              style={{ backgroundColor: customColor }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (isValidHexColor(customColor)) {
                onChange(customColor);
                setError('');
              }
            }}
          >
            Apply
          </Button>
        </div>
        {error && (
          <p className="mt-1 text-sm text-error-600">{error}</p>
        )}
      </div>

      {/* Current Color Preview */}
      <div className="flex items-center gap-2 rounded-lg border bg-muted p-3">
        <div
          className="h-8 w-8 rounded"
          style={{ backgroundColor: value }}
        />
        <span className="text-sm text-muted-foreground font-mono">{value}</span>
      </div>
    </div>
  );
}
