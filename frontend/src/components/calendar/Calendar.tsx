'use client';

/**
 * Calendar Component
 *
 * Multi-view calendar with:
 * - Month view (grid layout)
 * - Week view (7-day columns with time slots)
 * - Day view (24-hour time blocks)
 * - Tasks displayed on due dates
 * - Priority color coding
 * - Click to view/add tasks
 * - Keyboard shortcuts support
 */

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfDay,
  endOfDay,
  eachHourOfInterval,
  parseISO,
} from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CalendarDays,
  CalendarRange,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Task } from '@/types';
import { getPriorityColor } from '@/lib/dateFormat';
import { useCalendarShortcuts, type CalendarViewMode } from '@/hooks/useCalendarShortcuts';
import { motionConfig } from '@/lib/motion';

export interface CalendarProps {
  tasks?: Task[];
  onDateClick?: (date: Date) => void;
  onTaskClick?: (task: Task) => void;
  onQuickAdd?: (date: Date) => void;
  viewMode?: CalendarViewMode;
  onViewChange?: (view: CalendarViewMode) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function Calendar({
  tasks = [],
  onDateClick,
  onTaskClick,
  onQuickAdd,
  viewMode: controlledViewMode,
  onViewChange,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [internalViewMode, setInternalViewMode] = useState<CalendarViewMode>('month');

  // Use controlled or internal view mode
  const viewMode = controlledViewMode || internalViewMode;
  const handleViewChange = useCallback(
    (view: CalendarViewMode) => {
      onViewChange?.(view);
      setInternalViewMode(view);
      if (typeof window !== 'undefined') {
        localStorage.setItem('calendar_view_mode', view);
      }
    },
    [onViewChange]
  );

  // Get tasks for a specific day
  const getTasksForDay = useCallback(
    (day: Date) => {
      return tasks.filter((task) => {
        if (!task.due_date) return false;
        return isSameDay(parseISO(task.due_date), day);
      });
    },
    [tasks]
  );

  // Get task by time slot for week/day views
  const getTaskForHour = useCallback(
    (day: Date, hour: number) => {
      return tasks.filter((task) => {
        if (!task.due_date) return false;
        const taskDate = parseISO(task.due_date);
        return (
          isSameDay(taskDate, day) &&
          taskDate.getHours() === hour
        );
      });
    },
    [tasks]
  );

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    setCurrentDate((prev) => {
      switch (viewMode) {
        case 'month':
          return subMonths(prev, 1);
        case 'week':
          return subWeeks(prev, 1);
        case 'day':
          return subDays(prev, 1);
        default:
          return prev;
      }
    });
  }, [viewMode]);

  const handleNext = useCallback(() => {
    setCurrentDate((prev) => {
      switch (viewMode) {
        case 'month':
          return addMonths(prev, 1);
        case 'week':
          return addWeeks(prev, 1);
        case 'day':
          return addDays(prev, 1);
        default:
          return prev;
      }
    });
  }, [viewMode]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Keyboard shortcuts
  useCalendarShortcuts({
    onViewChange: handleViewChange,
    onToday: handleToday,
    onPrevious: handlePrevious,
    onNext: handleNext,
    currentView: viewMode,
    enabled: true,
  });

  // Get header title based on view mode
  const headerTitle = useMemo(() => {
    switch (viewMode) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week':
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        if (isSameMonth(weekStart, weekEnd)) {
          return `${format(weekStart, 'MMMM d')} - ${format(weekEnd, 'd, yyyy')}`;
        }
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      default:
        return format(currentDate, 'MMMM yyyy');
    }
  }, [currentDate, viewMode]);

  // View mode toggle button
  const ViewModeToggle = () => (
    <div className="flex items-center gap-1 rounded-lg border bg-muted p-1">
      <Button
        variant={viewMode === 'month' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleViewChange('month')}
        className="h-8 gap-1.5 px-3"
        title="Month view (M)"
      >
        <CalendarRange className="h-4 w-4" />
        <span className="hidden sm:inline">Month</span>
      </Button>
      <Button
        variant={viewMode === 'week' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleViewChange('week')}
        className="h-8 gap-1.5 px-3"
        title="Week view (W)"
      >
        <CalendarDays className="h-4 w-4" />
        <span className="hidden sm:inline">Week</span>
      </Button>
      <Button
        variant={viewMode === 'day' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleViewChange('day')}
        className="h-8 gap-1.5 px-3"
        title="Day view (D)"
      >
        <Clock className="h-4 w-4" />
        <span className="hidden sm:inline">Day</span>
      </Button>
    </div>
  );

  return (
    <div className="flex h-full flex-col rounded-lg border bg-card">
      {/* Calendar Header */}
      <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">{headerTitle}</h2>
        </div>

        <div className="flex items-center gap-2">
          <ViewModeToggle />

          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === 'month' && (
            <MonthView
              key="month"
              currentDate={currentDate}
              tasks={tasks}
              getTasksForDay={getTasksForDay}
              onDateClick={onDateClick}
              onTaskClick={onTaskClick}
              onQuickAdd={onQuickAdd}
            />
          )}
          {viewMode === 'week' && (
            <WeekView
              key="week"
              currentDate={currentDate}
              tasks={tasks}
              getTasksForDay={getTasksForDay}
              getTaskForHour={getTaskForHour}
              onDateClick={onDateClick}
              onTaskClick={onTaskClick}
              onQuickAdd={onQuickAdd}
            />
          )}
          {viewMode === 'day' && (
            <DayView
              key="day"
              currentDate={currentDate}
              tasks={tasks}
              getTaskForHour={getTaskForHour}
              onDateClick={onDateClick}
              onTaskClick={onTaskClick}
              onQuickAdd={onQuickAdd}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">M</kbd> Month
          </span>
          <span>
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">W</kbd> Week
          </span>
          <span>
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">D</kbd> Day
          </span>
          <span>
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">T</kbd> Today
          </span>
        </div>
        <span className="hidden sm:inline">Use arrow keys to navigate</span>
      </div>
    </div>
  );
}

// =============================================================================
// Month View Component
// =============================================================================

interface MonthViewProps {
  currentDate: Date;
  tasks: Task[];
  getTasksForDay: (day: Date) => Task[];
  onDateClick?: (date: Date) => void;
  onTaskClick?: (task: Task) => void;
  onQuickAdd?: (date: Date) => void;
}

function MonthView({
  currentDate,
  getTasksForDay,
  onDateClick,
  onTaskClick,
}: MonthViewProps) {
  // Calendar calculations
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={motionConfig.transition}
      className="flex h-full flex-col"
    >
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b">
        {WEEKDAYS_SHORT.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-px overflow-y-auto p-px scrollbar-thin">
        {calendarDays.map((day, index) => {
          const dayTasks = getTasksForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(index * 0.01, 0.3) }}
              className={cn(
                'relative flex min-h-[100px] flex-col p-2 transition-colors hover:bg-accent/50',
                !isCurrentMonth && 'bg-muted/30 text-muted-foreground'
              )}
              onClick={() => onDateClick?.(day)}
            >
              {/* Day Number */}
              <div className="mb-1 flex items-center justify-between">
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-sm',
                    isTodayDate &&
                      'bg-primary text-primary-foreground font-semibold',
                    !isTodayDate && !isCurrentMonth && 'text-muted-foreground'
                  )}
                >
                  {format(day, 'd')}
                </span>

                {/* Add Task Button (hover) */}
                <button
                  className="rounded p-1 opacity-0 transition-opacity hover:bg-accent hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDateClick?.(day);
                  }}
                  aria-label={`Add task for ${format(day, 'MMM d')}`}
                >
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {/* Tasks for Day */}
              <div className="flex-1 space-y-1 overflow-y-auto scrollbar-thin">
                {dayTasks.slice(0, 4).map((task) => (
                  <button
                    key={task.id}
                    className={cn(
                      'w-full truncate rounded px-1.5 py-0.5 text-left text-xs text-white transition-transform hover:scale-[1.02]',
                      task.priority === 'urgent' && 'bg-error-600',
                      task.priority === 'high' && 'bg-warning-600',
                      task.priority === 'medium' && 'bg-primary',
                      task.priority === 'low' && 'bg-muted-foreground'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick?.(task);
                    }}
                    title={task.title}
                  >
                    {task.title}
                  </button>
                ))}
                {dayTasks.length > 4 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayTasks.length - 4} more
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// =============================================================================
// Week View Component
// =============================================================================

interface WeekViewProps {
  currentDate: Date;
  tasks: Task[];
  getTasksForDay: (day: Date) => Task[];
  getTaskForHour: (day: Date, hour: number) => Task[];
  onDateClick?: (date: Date) => void;
  onTaskClick?: (task: Task) => void;
  onQuickAdd?: (date: Date) => void;
}

function WeekView({
  currentDate,
  getTasksForDay,
  getTaskForHour,
  onDateClick,
  onTaskClick,
  onQuickAdd,
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate);
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(currentDate),
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={motionConfig.transition}
      className="flex h-full flex-col overflow-hidden"
    >
      {/* Week Days Header */}
      <div className="grid grid-cols-8 border-b">
        {/* Time column header */}
        <div className="border-r p-2" />

        {/* Day headers */}
        {weekDays.map((day, index) => {
          const isTodayDate = isToday(day);
          return (
            <div
              key={index}
              className={cn(
                'border-r p-2 text-center last:border-r-0',
                isTodayDate && 'bg-primary/10'
              )}
            >
              <div className="text-xs font-medium text-muted-foreground">
                {WEEKDAYS_SHORT[day.getDay()]}
              </div>
              <div
                className={cn(
                  'mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-lg',
                  isTodayDate
                    ? 'bg-primary text-primary-foreground font-bold'
                    : 'font-semibold'
                )}
              >
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Week Grid with Time Slots */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="grid grid-cols-8">
          {/* Time labels column */}
          <div className="border-r">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="flex h-16 items-start justify-center border-b border-r pr-2 text-xs text-muted-foreground"
              >
                <span className="-mt-2 bg-card px-1">
                  {format(new Date(2026, 0, 1, hour), 'h a')}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => {
            const isTodayDate = isToday(day);
            const dayTasks = getTasksForDay(day);

            return (
              <div
                key={dayIndex}
                className={cn(
                  'border-r last:border-r-0',
                  isTodayDate && 'bg-primary/[0.03]'
                )}
              >
                {/* Hour slots */}
                {HOURS.map((hour) => {
                  const hourTasks = getTaskForHour(day, hour);

                  return (
                    <div
                      key={hour}
                      className={cn(
                        'relative flex h-16 flex-col border-b p-1 transition-colors hover:bg-accent/30',
                        !hourTasks.length && 'cursor-pointer'
                      )}
                      onClick={() => {
                        const clickDate = new Date(day);
                        clickDate.setHours(hour, 0, 0, 0);
                        onQuickAdd?.(clickDate) || onDateClick?.(clickDate);
                      }}
                    >
                      {/* Tasks for this hour */}
                      {hourTasks.map((task) => (
                        <button
                          key={task.id}
                          className={cn(
                            'mb-1 w-full truncate rounded px-1.5 py-1 text-left text-xs text-white transition-transform hover:scale-[1.02]',
                            task.priority === 'urgent' && 'bg-error-600',
                            task.priority === 'high' && 'bg-warning-600',
                            task.priority === 'medium' && 'bg-primary',
                            task.priority === 'low' && 'bg-muted-foreground'
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskClick?.(task);
                          }}
                          title={`${task.title} - ${format(parseISO(task.due_date!), 'h:mm a')}`}
                        >
                          {task.title}
                        </button>
                      ))}
                    </div>
                  );
                })}

                {/* All-day tasks section */}
                {dayTasks.filter((t) => !t.due_date?.includes('T')).length > 0 && (
                  <div className="border-t p-1">
                    <div className="mb-1 text-xs font-medium text-muted-foreground">
                      All day
                    </div>
                    {dayTasks
                      .filter((t) => !t.due_date?.includes('T'))
                      .slice(0, 3)
                      .map((task) => (
                        <button
                          key={task.id}
                          className={cn(
                            'mb-1 w-full truncate rounded px-1.5 py-0.5 text-left text-xs text-white',
                            task.priority === 'urgent' && 'bg-error-600',
                            task.priority === 'high' && 'bg-warning-600',
                            task.priority === 'medium' && 'bg-primary',
                            task.priority === 'low' && 'bg-muted-foreground'
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskClick?.(task);
                          }}
                        >
                          {task.title}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// Day View Component
// =============================================================================

interface DayViewProps {
  currentDate: Date;
  tasks: Task[];
  getTaskForHour: (day: Date, hour: number) => Task[];
  onDateClick?: (date: Date) => void;
  onTaskClick?: (task: Task) => void;
  onQuickAdd?: (date: Date) => void;
}

function DayView({
  currentDate,
  tasks,
  getTaskForHour,
  onDateClick,
  onTaskClick,
  onQuickAdd,
}: DayViewProps) {
  const isTodayDate = isToday(currentDate);

  // Get all tasks for this day
  const allDayTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (!task.due_date) return false;
      const taskDate = parseISO(task.due_date);
      return isSameDay(taskDate, currentDate);
    });
  }, [tasks, currentDate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={motionConfig.transition}
      className="flex h-full flex-col overflow-hidden"
    >
      {/* Day Header */}
      <div className="border-b p-4 text-center">
        <div className="text-sm font-medium text-muted-foreground">
          {WEEKDAYS_FULL[currentDate.getDay()]}
        </div>
        <div
          className={cn(
            'mx-auto mt-1 flex h-12 w-12 items-center justify-center rounded-full text-2xl',
            isTodayDate
              ? 'bg-primary text-primary-foreground font-bold'
              : 'font-semibold'
          )}
        >
          {format(currentDate, 'd')}
        </div>
      </div>

      {/* Day Grid with Time Slots */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="grid grid-cols-[60px_1fr]">
          {/* Time labels column */}
          <div className="border-r">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="flex h-20 items-start justify-center border-b pr-2 text-xs text-muted-foreground"
              >
                <span className="-mt-3 bg-card px-1">
                  {format(new Date(2026, 0, 1, hour), 'h a')}
                </span>
              </div>
            ))}
          </div>

          {/* Day content */}
          <div
            className="relative"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const y = e.clientY - rect.top;
              const hour = Math.floor(y / 80); // 80px per hour
              if (hour >= 0 && hour < 24) {
                const clickDate = new Date(currentDate);
                clickDate.setHours(hour, 0, 0, 0);
                onQuickAdd?.(clickDate) || onDateClick?.(clickDate);
              }
            }}
          >
            {/* Hour slots */}
            {HOURS.map((hour) => {
              const hourTasks = getTaskForHour(currentDate, hour);

              return (
                <div
                  key={hour}
                  className="flex h-20 flex-col border-b p-2 transition-colors hover:bg-accent/30"
                >
                  {/* Tasks for this hour */}
                  {hourTasks.map((task) => (
                    <button
                      key={task.id}
                      className={cn(
                        'mb-2 w-full truncate rounded px-2 py-1.5 text-left text-sm text-white transition-transform hover:scale-[1.02]',
                        task.priority === 'urgent' && 'bg-error-600',
                        task.priority === 'high' && 'bg-warning-600',
                        task.priority === 'medium' && 'bg-primary',
                        task.priority === 'low' && 'bg-muted-foreground'
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick?.(task);
                      }}
                      title={`${task.title} - ${format(parseISO(task.due_date!), 'h:mm a')}`}
                    >
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs opacity-80">
                        {format(parseISO(task.due_date!), 'h:mm a')}
                      </div>
                    </button>
                  ))}

                  {/* Empty state hint */}
                  {!hourTasks.length && (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground opacity-0 transition-opacity hover:opacity-100">
                      <Plus className="mr-1 h-3 w-3" />
                      Click to add
                    </div>
                  )}
                </div>
              );
            })}

            {/* Current time indicator */}
            {isTodayDate && (
              <div
                className="absolute left-0 right-0 flex items-center"
                style={{
                  top: `${(new Date().getHours() * 60 + new Date().getMinutes()) * (80 / 60)}px`,
                }}
              >
                <div className="h-0.5 flex-1 bg-error-500" />
                <div className="h-2 w-2 -ml-1 rounded-full bg-error-500" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All-day tasks section */}
      {allDayTasks.filter((t) => !t.due_date?.includes('T')).length > 0 && (
        <div className="border-t p-4">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            All-day tasks
          </div>
          <div className="flex flex-wrap gap-2">
            {allDayTasks
              .filter((t) => !t.due_date?.includes('T'))
              .map((task) => (
                <button
                  key={task.id}
                  className={cn(
                    'truncate rounded px-3 py-1.5 text-left text-sm text-white transition-transform hover:scale-[1.02]',
                    task.priority === 'urgent' && 'bg-error-600',
                    task.priority === 'high' && 'bg-warning-600',
                    task.priority === 'medium' && 'bg-primary',
                    task.priority === 'low' && 'bg-muted-foreground'
                  )}
                  onClick={() => onTaskClick?.(task)}
                >
                  {task.title}
                </button>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Calendar;
