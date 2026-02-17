/**
 * Better Auth Configuration
 *
 * Client-side authentication utilities using Better Auth
 * Integrates with backend JWT authentication
 */

import type { User, AuthResponse, SignupData, SigninData } from '@/types';
import type { AuthState, AuthError, AUTH_ERROR_CODES } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// =============================================================================
// Token Management
// =============================================================================

/**
 * Get JWT token from localStorage
 * Note: In production, tokens should be stored in httpOnly cookies
 * This is a client-side fallback for development
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jwt_token');
}

/**
 * Store JWT token
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('jwt_token', token);
}

/**
 * Remove JWT token
 */
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('auth_user');
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
 * Store current user
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
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
      throw new Error('Unauthorized') as AuthError;
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
    if (error instanceof Error && error.name === 'AuthError') {
      throw error;
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

  if (response.token) {
    setToken(response.token);
    setCurrentUser(response.user);
  }

  return response;
}

/**
 * Sign in an existing user
 */
export async function signin(data: SigninData): Promise<AuthResponse> {
  const response = await authRequest<AuthResponse>('/api/auth/signin', data);

  if (response.token) {
    setToken(response.token);
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
