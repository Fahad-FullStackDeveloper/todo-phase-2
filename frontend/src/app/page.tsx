'use client';

/**
 * Home Page (Landing)
 *
 * Redirects authenticated users to dashboard
 * Shows landing page for non-authenticated users
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckSquare, Zap, Calendar, Shield, ArrowRight, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { motionConfig } from '@/lib/motion';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state during auth check
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <CheckSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">TodoFlow</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={motionConfig.variants.staggerContainer}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div variants={motionConfig.variants.slideUp}>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Phase 4 Complete - Authentication Ready
              </div>
            </motion.div>

            <motion.h1
              variants={motionConfig.variants.slideUp}
              className="mt-8 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            >
              Manage Your Tasks{' '}
              <span className="text-primary">Like a Pro</span>
            </motion.h1>

            <motion.p
              variants={motionConfig.variants.slideUp}
              className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
            >
              TodoFlow is a premium task management application designed to boost
              your productivity. Organize tasks, track progress, and achieve your goals.
            </motion.p>

            <motion.div
              variants={motionConfig.variants.slideUp}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Start for Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/signin">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-24 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Built with Next.js 16 for optimal performance and smooth interactions."
            />
            <FeatureCard
              icon={Calendar}
              title="Smart Scheduling"
              description="Calendar view with drag-and-drop task management and reminders."
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Private"
              description="JWT authentication with httpOnly cookies keeps your data safe."
            />
            <FeatureCard
              icon={CheckSquare}
              title="Task Management"
              description="Organize tasks with projects, labels, priorities, and subtasks."
            />
            <FeatureCard
              icon={Sparkles}
              title="Premium UX"
              description="Beautiful animations, dark mode, and responsive design."
            />
            <FeatureCard
              icon={ArrowRight}
              title="And More..."
              description="Pomodoro timer, productivity stats, streaks, and habit tracking."
            />
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-muted/50 py-24">
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold"
            >
              Ready to boost your productivity?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-4 max-w-2xl text-muted-foreground"
            >
              Join thousands of users who manage their tasks with TodoFlow.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Get Started for Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <CheckSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">
                © 2024 TodoFlow. All rights reserved.
              </span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="pt-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
