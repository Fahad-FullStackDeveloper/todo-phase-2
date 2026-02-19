'use client';

/**
 * useAuth Hook
 *
 * Provides authentication state and methods using React Context
 * Integrates with Better Auth and TanStack Query
 *
 * AUTH FLOW:
 * 1. On mount: Check for existing token, fetch user if token exists
 * 2. On signup/signin: Store token → Update query cache → Redirect
 * 3. On signout: Clear token → Clear cache → Redirect
 */

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
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
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const hasInitialized = useRef(false);
  const isRedirecting = useRef(false);

  // Initial auth state
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Fetch current user on mount
  // This query will succeed if token exists in cookies/localStorage
  const { data: userData, isLoading, error } = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: getCurrentUserProfile,
    retry: false,
    staleTime: 5 * 60 * 1000,
    // Critical: Only fetch on mount, not on every render
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Update auth state when user data or loading changes
  useEffect(() => {
    const token = getToken();
    const user = userData?.user || null;
    const isAuthenticated = !!user && !!token;

    console.log('[AuthProvider] State update:', {
      hasUser: !!user,
      hasToken: !!token,
      isAuthenticated,
      isLoading,
      hasError: !!error,
    });

    setAuthState({
      user,
      token,
      isAuthenticated,
      isLoading,
    });
  }, [userData, isLoading, error]);

  // Initial load complete - prevent redirect loops
  useEffect(() => {
    if (!isLoading && !hasInitialized.current) {
      hasInitialized.current = true;
      console.log('[AuthProvider] Initial auth check complete');
    }
  }, [isLoading]);

  // Signin mutation
  const signinMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      console.log('[AuthProvider] Signing in...', credentials.email);
      const response = await signinApi(credentials);
      return response;
    },
    onSuccess: (data) => {
      console.log('[AuthProvider] Signin successful:', data.user.email);

      // 1. Update query cache with new user data
      queryClient.setQueryData(queryKeys.auth.me(), { user: data.user });

      // 2. Invalidate to ensure fresh data on next fetch
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });

      // 3. Show success toast
      toast.success('Welcome back!', {
        description: `Signed in as ${data.user.email}`,
      });

      // 4. Redirect to dashboard AFTER state updates
      // Use setTimeout to ensure React state updates propagate
      if (!isRedirecting.current) {
        isRedirecting.current = true;
        router.push('/dashboard');
      }
    },
    onError: (error: Error) => {
      console.error('[AuthProvider] Signin error:', error);
      toast.error('Sign in failed', {
        description: error.message,
      });
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async (data: { email: string; password: string; name: string }) => {
      console.log('[AuthProvider] Signing up...', data.email);
      const response = await signupApi(data);
      return response;
    },
    onSuccess: (data) => {
      console.log('[AuthProvider] Signup successful:', data.user.email);

      // 1. Update query cache with new user data
      queryClient.setQueryData(queryKeys.auth.me(), { user: data.user });

      // 2. Invalidate to ensure fresh data on next fetch
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });

      // 3. Show success toast
      toast.success('Account created!', {
        description: 'Welcome to TodoFlow',
      });

      // 4. Redirect to dashboard AFTER state updates
      if (!isRedirecting.current) {
        isRedirecting.current = true;
        router.push('/dashboard');
      }
    },
    onError: (error: Error) => {
      console.error('[AuthProvider] Signup error:', error);
      toast.error('Sign up failed', {
        description: error.message,
      });
    },
  });

  // Signout mutation
  const signoutMutation = useMutation({
    mutationFn: signoutApi,
    onSuccess: () => {
      console.log('[AuthProvider] Signed out');

      // Clear all query cache
      queryClient.clear();

      // Reset auth state
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });

      toast.success('Signed out successfully');

      // Redirect to signin
      router.push('/signin');
    },
    onError: (error) => {
      console.error('[AuthProvider] Signout error:', error);
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
      return signinMutation.mutateAsync({ email, password });
    },
    [signinMutation]
  );

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      return signupMutation.mutateAsync({ email, password, name });
    },
    [signupMutation]
  );

  const signout = useCallback(async () => {
    return signoutMutation.mutateAsync();
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
 *
 * CRITICAL FIX: This hook now checks for token in localStorage/cookies directly
 * to avoid race conditions with auth state updates.
 */
export function useRequireAuth(redirectTo = '/signin') {
  const auth = useAuth();
  const { isAuthenticated, isLoading, user } = auth;
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);
  
  // Check for token directly to avoid race condition
  const hasToken = typeof window !== 'undefined' 
    ? (localStorage.getItem('jwt_token') || document.cookie.includes('jwt_token='))
    : false;

  useEffect(() => {
    // Wait for loading to complete
    if (isLoading) return;
    
    // Check authentication: either from state OR from direct token check
    const isActuallyAuthenticated = isAuthenticated || hasToken;
    
    // Only redirect if:
    // 1. Auth check is complete (not loading)
    // 2. User is not authenticated (no state AND no token)
    // 3. We haven't already redirected (prevent loops)
    if (!isActuallyAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, hasToken, router, pathname, redirectTo]);

  return { ...auth, isAuthenticated: isAuthenticated || hasToken, isLoading, user };
}

// =============================================================================
// useOptionalAuth Hook
// =============================================================================

/**
 * Hook for routes that are accessible with or without auth
 * Redirects to dashboard if already authenticated
 *
 * CRITICAL FIX: Check for token directly to avoid race condition
 */
export function useOptionalAuth(redirectIfAuth = '/dashboard') {
  const auth = useAuth();
  const { isAuthenticated, isLoading } = auth;
  const router = useRouter();
  const hasRedirected = useRef(false);
  
  // Check for token directly
  const hasToken = typeof window !== 'undefined' 
    ? (localStorage.getItem('jwt_token') || document.cookie.includes('jwt_token='))
    : false;
  
  // Compute actual auth state
  const isActuallyAuthenticated = isAuthenticated || hasToken;

  useEffect(() => {
    // Wait for loading to complete
    if (isLoading) return;
    
    // Only redirect if:
    // 1. Auth check is complete (not loading)
    // 2. User is authenticated (has state OR has token)
    // 3. We haven't already redirected (prevent loops)
    if (isActuallyAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push(redirectIfAuth);
    }
  }, [isAuthenticated, isLoading, hasToken, isActuallyAuthenticated, router, redirectIfAuth]);

  return { ...auth, isAuthenticated: isActuallyAuthenticated, isLoading };
}
