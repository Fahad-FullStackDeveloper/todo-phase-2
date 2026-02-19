'use client';

/**
 * Sidebar Component
 *
 * Main navigation sidebar with:
 * - Logo and branding
 * - Navigation links
 * - Project list
 * - Collapsible on mobile
 * - Active state indicators
 */

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar,
  Settings,
  Plus,
  ChevronDown,
  ChevronRight,
  Hash,
  Star,
  Clock,
  Inbox,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motionConfig } from '@/lib/motion';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface Project {
  id: string;
  name: string;
  color: string;
  taskCount?: number;
}

const mainNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'My Tasks', href: '/tasks', icon: CheckSquare },
  { title: 'Kanban', href: '/kanban', icon: FolderKanban },
  { title: 'Calendar', href: '/calendar', icon: Calendar },
  { title: 'Projects', href: '/projects', icon: FolderKanban },
  { title: 'Focus Mode', href: '/focus', icon: Clock },
];

const filterNavItems: NavItem[] = [
  { title: 'Inbox', href: '/tasks?filter=inbox', icon: Inbox },
  { title: 'Today', href: '/tasks?filter=today', icon: Clock },
  { title: 'Upcoming', href: '/tasks?filter=upcoming', icon: Calendar },
  { title: 'Someday', href: '/tasks?filter=someday', icon: Star },
];

const sampleProjects: Project[] = [
  { id: '1', name: 'Personal', color: '#3b82f6', taskCount: 12 },
  { id: '2', name: 'Work', color: '#8b5cf6', taskCount: 8 },
  { id: '3', name: 'Learning', color: '#10b981', taskCount: 5 },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href.split('?')[0]);
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -280,
          width: isOpen ? 280 : 0,
        }}
        transition={motionConfig.transition}
        className={cn(
          'fixed left-0 top-0 z-50 h-full border-r bg-background lg:static lg:z-auto',
          !isOpen && 'lg:hidden'
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <CheckSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">TodoFlow</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            {/* Main Navigation */}
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.button
                    whileHover={{ x: 4 }}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </motion.button>
                </Link>
              ))}
            </div>

            {/* Filters Section */}
            <div className="mt-6">
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Filters
              </h3>
              <div className="space-y-1">
                {filterNavItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <motion.button
                      whileHover={{ x: 4 }}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive(item.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </motion.button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between px-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Projects
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setProjectsExpanded(!projectsExpanded)}
                >
                  {projectsExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
              </div>

              <AnimatePresence>
                {projectsExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1 pt-2">
                      {sampleProjects.map((project) => (
                        <Link
                          key={project.id}
                          href={`/projects/${project.id}`}
                        >
                          <motion.button
                            whileHover={{ x: 4 }}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                              isActive(`/projects/${project.id}`)
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )}
                          >
                            <Hash
                              className="h-4 w-4"
                              style={{ color: project.color }}
                            />
                            <span className="flex-1 truncate">{project.name}</span>
                            {project.taskCount !== undefined && (
                              <span className="text-xs text-muted-foreground">
                                {project.taskCount}
                              </span>
                            )}
                          </motion.button>
                        </Link>
                      ))}

                      {/* Add Project Button */}
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-muted-foreground hover:text-accent-foreground"
                      >
                        <Plus className="h-4 w-4" />
                        Add Project
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Settings Link */}
          <div className="border-t p-4">
            <Link href="/settings">
              <motion.button
                whileHover={{ x: 4 }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive('/settings')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Settings className="h-4 w-4" />
                Settings
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
