/**
 * Authentication Types
 *
 * Type definitions for authentication-related data structures
 */

import type { User } from '@/types';

// =============================================================================
// Auth State Types
// =============================================================================

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  signin: (email: string, password: string) => Promise<unknown>;
  signup: (email: string, password: string, name: string) => Promise<unknown>;
  signout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// =============================================================================
// Auth Form Types
// =============================================================================

export interface SigninFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms?: boolean;
}

// =============================================================================
// Auth API Response Types
// =============================================================================

export interface AuthTokenResponse {
  access_token: string;
  token_type: 'bearer';
  expires_in?: number;
  refresh_token?: string;
}

export interface AuthUserResponse {
  user: User;
  access_token?: string;
  token?: string;
}

// =============================================================================
// Cookie Options
// =============================================================================

export interface CookieOptions {
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  path?: string;
  domain?: string;
}

// Default cookie options for JWT
export const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

// =============================================================================
// Auth Error Types
// =============================================================================

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  INVALID_EMAIL: 'INVALID_EMAIL',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN: 'UNKNOWN',
} as const;

// =============================================================================
// Validation Types
// =============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}
