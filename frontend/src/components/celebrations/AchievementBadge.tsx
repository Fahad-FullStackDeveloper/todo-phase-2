/**
 * AchievementBadge Component
 *
 * Displays achievement badges for milestones and accomplishments
 */

'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, Flame, Zap, Crown, Heart, Target, Clock, Award, Medal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motionConfig } from '@/lib/motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGradient: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  category: 'streak' | 'productivity' | 'completion' | 'special';
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  className?: string;
  onClick?: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Star,
  Flame,
  Zap,
  Crown,
  Heart,
  Target,
  Clock,
  Award,
  Medal,
};

const sizeClasses = {
  sm: 'h-12 w-12',
  md: 'h-16 w-16',
  lg: 'h-24 w-24',
};

export function AchievementBadge({
  achievement,
  size = 'md',
  showProgress = false,
  className,
  onClick,
}: AchievementBadgeProps) {
  const Icon = iconMap[achievement.icon.name as keyof typeof iconMap] || Trophy;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={motionConfig.transition}
      whileHover={onClick ? { scale: 1.05 } : {}}
      onClick={onClick}
    >
      <Card
        className={cn(
          'overflow-hidden transition-all',
          !achievement.unlocked && 'opacity-50 grayscale',
          achievement.unlocked && 'hover:shadow-lg cursor-pointer',
          className
        )}
      >
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center">
            <div
              className={cn(
                'mb-3 flex items-center justify-center rounded-full bg-gradient-to-br',
                achievement.unlocked ? achievement.bgGradient : 'bg-muted',
                sizeClasses[size]
              )}
            >
              <Icon
                className={cn(
                  sizeClasses[size].replace('h-', 'h-').replace('w-', 'w-').replace('12', '6').replace('16', '8').replace('24', '12'),
                  achievement.unlocked ? achievement.color : 'text-muted-foreground'
                )}
              />
            </div>

            <h3 className={cn(
              'font-semibold',
              size === 'sm' && 'text-xs',
              size === 'md' && 'text-sm',
              size === 'lg' && 'text-base'
            )}>
              {achievement.title}
            </h3>

            <p className={cn(
              'mt-1 text-muted-foreground',
              size === 'sm' && 'text-xs',
              size === 'md' && 'text-xs',
              size === 'lg' && 'text-sm'
            )}>
              {achievement.description}
            </p>

            {showProgress && achievement.progress !== undefined && achievement.maxProgress && (
              <div className="mt-2 w-full">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className={cn('h-full', achievement.color.replace('text-', 'bg-'))}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {achievement.progress} / {achievement.maxProgress}
                </p>
              </div>
            )}

            {!achievement.unlocked && (
              <span className="mt-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                Locked
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Predefined achievements
 */
export const predefinedAchievements: Achievement[] = [
  {
    id: 'streak-3',
    title: 'Getting Started',
    description: 'Complete a 3-day streak',
    icon: Star,
    color: 'text-yellow-500',
    bgGradient: 'from-yellow-500/20 to-orange-500/20',
    unlocked: false,
    category: 'streak',
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Complete a 7-day streak',
    icon: Flame,
    color: 'text-orange-500',
    bgGradient: 'from-orange-500/20 to-red-500/20',
    unlocked: false,
    category: 'streak',
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: 'Complete a 30-day streak',
    icon: Trophy,
    color: 'text-purple-500',
    bgGradient: 'from-purple-500/20 to-pink-500/20',
    unlocked: false,
    category: 'streak',
  },
  {
    id: 'streak-100',
    title: 'Century Club',
    description: 'Complete a 100-day streak',
    icon: Crown,
    color: 'text-amber-500',
    bgGradient: 'from-amber-500/20 to-orange-500/20',
    unlocked: false,
    category: 'streak',
  },
  {
    id: 'streak-365',
    title: 'Yearly Legend',
    description: 'Complete a 365-day streak',
    icon: Heart,
    color: 'text-rose-500',
    bgGradient: 'from-rose-500/20 to-pink-500/20',
    unlocked: false,
    category: 'streak',
  },
  {
    id: 'productivity-100',
    title: 'Task Master',
    description: 'Complete 100 tasks',
    icon: Target,
    color: 'text-blue-500',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    unlocked: false,
    category: 'productivity',
  },
  {
    id: 'productivity-500',
    title: 'Productivity Pro',
    description: 'Complete 500 tasks',
    icon: Zap,
    color: 'text-green-500',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
    unlocked: false,
    category: 'productivity',
  },
  {
    id: 'completion-90',
    title: 'Perfectionist',
    description: 'Achieve 90% completion rate',
    icon: Award,
    color: 'text-indigo-500',
    bgGradient: 'from-indigo-500/20 to-purple-500/20',
    unlocked: false,
    category: 'completion',
  },
  {
    id: 'pomodoro-50',
    title: 'Focus Champion',
    description: 'Complete 50 Pomodoro sessions',
    icon: Clock,
    color: 'text-teal-500',
    bgGradient: 'from-teal-500/20 to-cyan-500/20',
    unlocked: false,
    category: 'special',
  },
  {
    id: 'special-early',
    title: 'Early Adopter',
    description: 'Used TodoFlow in Phase 2',
    icon: Medal,
    color: 'text-amber-600',
    bgGradient: 'from-amber-600/20 to-yellow-600/20',
    unlocked: false,
    category: 'special',
  },
];

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return predefinedAchievements.filter(a => a.category === category);
}
