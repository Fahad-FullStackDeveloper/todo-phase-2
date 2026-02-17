'use client';

/**
 * Providers Component
 *
 * Wraps the app with all necessary providers:
 * - ThemeProvider (next-themes)
 * - QueryClientProvider (TanStack Query)
 * - AuthProvider (Authentication)
 */

import { ThemeProvider } from 'next-themes';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ReactNode } from 'react';

import { createQueryClient } from '@/lib/query';
import { AuthProvider } from '@/hooks/useAuth';

// Create query client (client-side only)
const queryClient = createQueryClient();

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryClientProvider>

      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          classNames: {
            toast: 'border shadow-lg',
            success: 'border-success-600',
            error: 'border-destructive',
            warning: 'border-warning-600',
            info: 'border-primary',
          },
        }}
      />
    </ThemeProvider>
  );
}
