'use client';

/**
 * useAuth Hook
 *
 * Provides authentication state and methods using React Context
 * Integrates with Better Auth and TanStack Query
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from '@/types';
import type { AuthContextType, AuthState } from '@/types/auth';
import {
  getToken,
  removeToken,
  signin as signinApi,
  signout as signoutApi,
  signup as signupApi,
  getCurrentUserProfile,
} from '@/lib/auth';
import { queryKeys } from '@/lib/query';
import { toast } from 'sonner';

// =============================================================================
// Auth Context
// =============================================================================

const AuthContext = createContext<AuthContextType | null>(null);

// =============================================================================
// Auth Provider Component
// =============================================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  // Fetch current user on mount
  const { data: userData, isLoading } = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: getCurrentUserProfile,
    enabled: !!getToken(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // Update auth state when user data changes
  useEffect(() => {
    const token = getToken();
    setAuthState({
      user: userData?.user || null,
      token,
      isAuthenticated: !!userData?.user && !!token,
      isLoading,
    });
  }, [userData, isLoading]);

  // Signin mutation
  const signinMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await signinApi(credentials);
      return response;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.me(), { user: data.user });
      toast.success('Welcome back!', {
        description: `Signed in as ${data.user.email}`,
      });
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      toast.error('Sign in failed', {
        description: error.message,
      });
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async (data: { email: string; password: string; name: string }) => {
      const response = await signupApi(data);
      return response;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.me(), { user: data.user });
      toast.success('Account created!', {
        description: 'Welcome to TodoFlow',
      });
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      toast.error('Sign up failed', {
        description: error.message,
      });
    },
  });

  // Signout mutation
  const signoutMutation = useMutation({
    mutationFn: signoutApi,
    onSuccess: () => {
      queryClient.clear();
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      toast.success('Signed out successfully');
      router.push('/signin');
    },
    onError: () => {
      // Still clear local state even if API call fails
      queryClient.clear();
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      router.push('/signin');
    },
  });

  // Auth methods
  const signin = useCallback(
    async (email: string, password: string) => {
      await signinMutation.mutateAsync({ email, password });
    },
    [signinMutation]
  );

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      await signupMutation.mutateAsync({ email, password, name });
    },
    [signupMutation]
  );

  const signout = useCallback(async () => {
    await signoutMutation.mutateAsync();
  }, [signoutMutation]);

  const refreshUser = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
  }, [queryClient]);

  const value: AuthContextType = {
    ...authState,
    signin,
    signup,
    signout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// =============================================================================
// useAuth Hook
// =============================================================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// =============================================================================
// useRequireAuth Hook
// =============================================================================

/**
 * Hook to protect routes - redirects to signin if not authenticated
 */
export function useRequireAuth(redirectTo = '/signin') {
  const auth = useAuth();
  const { isAuthenticated, isLoading, user } = auth;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname, redirectTo]);

  return { ...auth, isAuthenticated, isLoading, user };
}

// =============================================================================
// useOptionalAuth Hook
// =============================================================================

/**
 * Hook for routes that are accessible with or without auth
 * Redirects to dashboard if already authenticated
 */
export function useOptionalAuth(redirectIfAuth = '/dashboard') {
  const auth = useAuth();
  const { isAuthenticated, isLoading } = auth;
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectIfAuth);
    }
  }, [isAuthenticated, isLoading, router, redirectIfAuth]);

  return { ...auth, isAuthenticated, isLoading };
}
