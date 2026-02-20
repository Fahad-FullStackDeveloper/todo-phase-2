/**
 * MilestoneModal Component
 *
 * Celebrates streak milestones with animated modal
 * Milestones: 3, 7, 14, 30, 60, 90, 100, 365 days
 */

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Star, Zap, Crown, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  milestone?: number;
}

interface MilestoneConfig {
  days: number;
  title: string;
  message: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGradient: string;
}

const milestones: MilestoneConfig[] = [
  {
    days: 3,
    title: 'Getting Started!',
    message: 'You\'re building a great habit! Keep going!',
    icon: Star,
    color: 'text-yellow-500',
    bgGradient: 'from-yellow-500/20 to-orange-500/20',
  },
  {
    days: 7,
    title: 'Week Warrior!',
    message: 'A full week of consistency! You\'re on fire!',
    icon: Flame,
    color: 'text-orange-500',
    bgGradient: 'from-orange-500/20 to-red-500/20',
  },
  {
    days: 14,
    title: 'Two Week Streak!',
    message: 'Half a month of dedication! Amazing!',
    icon: Zap,
    color: 'text-blue-500',
    bgGradient: 'from-blue-500/20 to-purple-500/20',
  },
  {
    days: 30,
    title: 'Monthly Master!',
    message: 'A full month! Your consistency is inspiring!',
    icon: Trophy,
    color: 'text-purple-500',
    bgGradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    days: 60,
    title: 'Double Champion!',
    message: 'Two months strong! You\'re unstoppable!',
    icon: Star,
    color: 'text-green-500',
    bgGradient: 'from-green-500/20 to-blue-500/20',
  },
  {
    days: 90,
    title: 'Quarterly Queen/King!',
    message: 'Three months! That\'s true dedication!',
    icon: Crown,
    color: 'text-indigo-500',
    bgGradient: 'from-indigo-500/20 to-purple-500/20',
  },
  {
    days: 100,
    title: 'Century Club!',
    message: '100 days! You\'re in the elite club!',
    icon: Trophy,
    color: 'text-amber-500',
    bgGradient: 'from-amber-500/20 to-orange-500/20',
  },
  {
    days: 365,
    title: 'Yearly Legend!',
    message: 'A FULL YEAR! You\'re absolutely legendary!',
    icon: Heart,
    color: 'text-rose-500',
    bgGradient: 'from-rose-500/20 to-pink-500/20',
  },
];

function getMilestone(streak: number): MilestoneConfig | undefined {
  return milestones.find(m => m.days === streak);
}

export function MilestoneModal({ isOpen, onClose, streak, milestone: explicitMilestone }: MilestoneModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  
  const milestone = explicitMilestone ? getMilestone(explicitMilestone) : getMilestone(streak);
  
  useEffect(() => {
    if (isOpen && milestone) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, milestone]);

  if (!milestone) return null;

  const Icon = milestone.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className={cn(
                  'mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br',
                  milestone.bgGradient
                )}
              >
                <Icon className={cn('h-12 w-12', milestone.color)} />
              </motion.div>
              
              <DialogTitle className="text-center text-2xl">
                {milestone.title}
              </DialogTitle>
              <DialogDescription className="text-center text-base">
                {milestone.message}
              </DialogDescription>
            </DialogHeader>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="py-4 text-center"
            >
              <div className="text-6xl font-bold">{streak}</div>
              <div className="text-sm text-muted-foreground">day streak</div>
            </motion.div>

            <div className="flex justify-center gap-2">
              <Button onClick={onClose} className="w-full sm:w-auto">
                Keep Going! 🚀
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

/**
 * Check if a streak is a milestone
 */
export function isMilestone(streak: number): boolean {
  return milestones.some(m => m.days === streak);
}

/**
 * Get the next milestone
 */
export function getNextMilestone(streak: number): MilestoneConfig | null {
  const next = milestones.find(m => m.days > streak);
  return next || null;
}
