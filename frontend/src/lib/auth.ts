/**
 * Better Auth Configuration
 *
 * Client-side authentication utilities using Better Auth
 * Integrates with backend JWT authentication
 *
 * IMPORTANT: This module uses js-cookie for token management
 * to match the api.ts implementation exactly.
 * Both cookies AND localStorage are used for maximum compatibility.
 */

import Cookies from 'js-cookie';
import type { User, AuthResponse, SignupData, SigninData } from '@/types';
import type { AuthState, AuthError, AUTH_ERROR_CODES } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Cookie options for JWT - MUST match api.ts
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

// =============================================================================
// Token Management (using js-cookie for consistency with api.ts)
// =============================================================================

/**
 * Get JWT token from cookies (primary) with localStorage fallback
 * This matches the implementation in api.ts exactly
 */
export function getToken(): string | null {
  // Try cookies first (for SSR and production)
  const cookieToken = Cookies.get('jwt_token');
  if (cookieToken) return cookieToken;

  // Fallback to localStorage for client-side only
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jwt_token');
}

/**
 * Store JWT token in BOTH cookies and localStorage
 * This ensures consistency across all auth modules
 */
export function setToken(token: string): void {
  // Store in cookies (for SSR)
  Cookies.set('jwt_token', token, COOKIE_OPTIONS);

  // Also store in localStorage (for client-side fallback)
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt_token', token);
  }
}

/**
 * Remove JWT token from BOTH cookies and localStorage
 */
export function removeToken(): void {
  // Remove from cookies
  Cookies.remove('jwt_token');

  // Also remove from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('auth_user');
  }
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('auth_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Store current user in localStorage
 */
export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_user', JSON.stringify(user));
}

// =============================================================================
// Auth API Calls
// =============================================================================

async function authRequest<T>(
  endpoint: string,
  data?: unknown,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST'
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  // Attach token if available
  const token = getToken();
  if (token && endpoint !== '/api/auth/signin' && endpoint !== '/api/auth/signup') {
    (options.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, options);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      removeToken();
      // Don't redirect here - let the hooks handle it
      const error = new Error('Unauthorized') as AuthError;
      error.code = 'UNAUTHORIZED';
      error.status = 401;
      throw error;
    }

    // Handle errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Request failed',
      }));
      const error = new Error(
        errorData.message || errorData.error || 'Authentication failed'
      ) as AuthError;
      error.code = errorData.code || 'UNKNOWN';
      error.status = response.status;
      throw error;
    }

    return response.json();
  } catch (error) {
    // Re-throw AuthErrors as-is
    if (error instanceof Error) {
      if ((error as AuthError).code === 'UNAUTHORIZED') {
        throw error;
      }
      if ((error as AuthError).name === 'AuthError') {
        throw error;
      }
    }

    // Network error
    const networkError = new Error('Network error. Please check your connection.') as AuthError;
    networkError.code = 'NETWORK_ERROR';
    throw networkError;
  }
}

// =============================================================================
// Auth Functions
// =============================================================================

/**
 * Sign up a new user
 */
export async function signup(data: SignupData): Promise<AuthResponse> {
  const response = await authRequest<AuthResponse>('/api/auth/signup', data);

  // Extract access_token from nested token object
  // Backend returns: { user, token: { access_token, refresh_token, ... } }
  if (response.token?.access_token) {
    setToken(response.token.access_token);
    setCurrentUser(response.user);
  }

  return response;
}

/**
 * Sign in an existing user
 */
export async function signin(data: SigninData): Promise<AuthResponse> {
  const response = await authRequest<AuthResponse>('/api/auth/signin', data);

  // Extract access_token from nested token object
  if (response.token?.access_token) {
    setToken(response.token.access_token);
    setCurrentUser(response.user);
  }

  return response;
}

/**
 * Sign out the current user
 */
export async function signout(): Promise<void> {
  try {
    await authRequest('/api/auth/signout', undefined, 'POST');
  } finally {
    removeToken();
  }
}

/**
 * Get current user profile
 */
export async function getCurrentUserProfile(): Promise<{ user: User }> {
  return authRequest<{ user: User }>('/api/auth/me', undefined, 'GET');
}

/**
 * Refresh the authentication state
 */
export async function refreshAuth(): Promise<AuthState> {
  const token = getToken();

  if (!token) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    };
  }

  try {
    const { user } = await getCurrentUserProfile();
    return {
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    };
  } catch {
    removeToken();
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    };
  }
}

// =============================================================================
// Validation Helpers
// =============================================================================

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  return { valid: true };
}

// =============================================================================
// Better Auth Hook Factory
// =============================================================================

export function createBetterAuth() {
  return {
    signup,
    signin,
    signout,
    getToken,
    getCurrentUser,
    getCurrentUserProfile,
    refreshAuth,
  };
}

export type BetterAuth = ReturnType<typeof createBetterAuth>;
