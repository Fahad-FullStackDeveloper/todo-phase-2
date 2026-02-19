/**
 * API Client for TodoFlow Backend
 *
 * Handles all HTTP requests to the FastAPI backend with:
 * - Automatic JWT token attachment
 * - Error handling and 401 redirection
 * - Request/response typing
 * - Base URL configuration
 * - Retry logic with exponential backoff
 */

import Cookies from 'js-cookie';
import type {
  Task,
  Project,
  Label,
  Subtask,
  User,
  DashboardStats,
  PomodoroStats,
  AuthResponse,
  SignupData,
  SigninData,
  CreateTaskData,
  UpdateTaskData,
} from '@/types';
import { toast } from 'sonner';

// =============================================================================
// Configuration
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Cookie options for JWT
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

// =============================================================================
// Types
// =============================================================================

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  showToast?: boolean;
}

interface ApiError {
  success: false;
  error: string;
  message?: string;
  details?: Array<{
    field: string;
    message: string;
    type: string;
  }>;
  code?: string;
  status?: number;
}

// =============================================================================
// Token Management (using js-cookie for better cookie handling)
// =============================================================================

/**
 * Get JWT token from cookies
 * Falls back to localStorage for development
 */
function getToken(): string | null {
  // Try cookies first (for SSR and production)
  const cookieToken = Cookies.get('jwt_token');
  if (cookieToken) return cookieToken;

  // Fallback to localStorage for client-side only
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jwt_token');
}

/**
 * Store JWT token in both cookies and localStorage
 */
function setToken(token: string): void {
  // Store in cookies (for SSR)
  Cookies.set('jwt_token', token, COOKIE_OPTIONS);

  // Also store in localStorage (for client-side fallback)
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt_token', token);
  }
}

/**
 * Remove JWT token
 */
function removeToken(): void {
  // Remove from cookies
  Cookies.remove('jwt_token');

  // Also remove from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('auth_user');
  }
}

// =============================================================================
// Error Handling
// =============================================================================

function handleApiError(error: unknown, endpoint: string, showToast = true) {
  console.error(`API Error [${endpoint}]:`, error);

  if (error instanceof Error) {
    if (error.message === 'Unauthorized') {
      // 401 errors are handled by redirect
      return;
    }

    if (error.message.includes('Network') || error.message.includes('fetch')) {
      if (showToast) {
        toast.error('Connection Error', {
          description: 'Unable to connect to the server. Please check your connection.',
        });
      }
      return;
    }

    if (showToast) {
      toast.error('Error', {
        description: error.message,
      });
    }
  }
}

// =============================================================================
// API Client with Retry Logic
// =============================================================================

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = true, showToast = true, ...fetchOptions } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Attach JWT token if required
  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Retry logic with exponential backoff
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        removeToken();
        if (typeof window !== 'undefined') {
          // Don't redirect on auth endpoints
          if (!endpoint.includes('/auth/')) {
            window.location.href = '/signin';
          }
        }
        const error: ApiError = {
          success: false,
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          status: 401,
        };
        throw error;
      }

      // Handle other errors
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          success: false,
          error: 'Request failed',
          message: `HTTP ${response.status}`,
        }));

        const error: ApiError = {
          success: false,
          error: errorData.error || 'Request failed',
          message: errorData.message,
          code: errorData.code,
          status: response.status,
        };
        throw error;
      }

      // Parse response
      const data = await response.json();
      return data as T;
    } catch (error) {
      lastError = error as Error;

      // Don't retry on auth errors
      if ((error as ApiError).code === 'UNAUTHORIZED') {
        throw error;
      }

      // Don't retry on client errors (4xx)
      if ((error as ApiError).status && (error as ApiError).status! < 500) {
        throw error;
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = Math.min(1000 * 2 ** attempt, 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  handleApiError(lastError, endpoint, showToast);
  throw lastError;
}

// =============================================================================
// Auth API
// =============================================================================

export const auth = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    return request<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: false,
      showToast: false, // Handle errors in the form
    });
  },

  signin: async (data: SigninData): Promise<AuthResponse> => {
    const response = await request<AuthResponse>('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: false,
      showToast: false, // Handle errors in the form
    });

    // Store the access_token from the nested token object
    // Backend returns: { user, token: { access_token, refresh_token, ... } }
    if (response.token?.access_token) {
      setToken(response.token.access_token);
    }

    return response;
  },

  signout: async (): Promise<void> => {
    try {
      await request('/api/auth/signout', {
        method: 'POST',
        showToast: false,
      });
    } finally {
      removeToken();
    }
  },

  me: async (): Promise<{ user: User }> => {
    return request<{ user: User }>('/api/auth/me', {
      method: 'GET',
    });
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await request<{ token: string }>('/api/auth/refresh', {
      method: 'POST',
      showToast: false,
    });

    if (response.token) {
      setToken(response.token);
    }

    return response;
  },
};

// =============================================================================
// Tasks API
// =============================================================================

export const tasks = {
  list: async (params?: {
    status?: 'todo' | 'in_progress' | 'done';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    project_id?: string;
    labels?: string[];
    sort?: 'created' | 'due_date' | 'priority' | 'title';
  }): Promise<Task[]> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
    }
    const query = searchParams.toString();
    return request<Task[]>(`/api/tasks${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },

  get: async (id: string): Promise<Task> => {
    return request<Task>(`/api/tasks/${id}`, {
      method: 'GET',
    });
  },

  create: async (data: CreateTaskData): Promise<Task> => {
    // Convert frontend priority string to backend priority integer
    const priorityMap: Record<string, number> = {
      'urgent': 1,
      'high': 2,
      'medium': 3,
      'low': 4,
    };
    
    const backendData: Record<string, any> = {
      title: data.title,
      description: data.description,
      status: 'todo', // Default status for new tasks
      priority: data.priority ? priorityMap[data.priority] : 3, // Default to Medium (3)
      due_date: data.due_date,
      project_id: data.project_id,
      position: 0,
    };
    
    // Convert labels to label_ids
    if (data.labels && data.labels.length > 0) {
      backendData.label_ids = data.labels;
    }
    
    return request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  },

  update: async (id: string, data: UpdateTaskData): Promise<Task> => {
    // Convert frontend priority string to backend priority integer
    const priorityMap: Record<string, number> = {
      'urgent': 1,
      'high': 2,
      'medium': 3,
      'low': 4,
    };
    
    const backendData: Record<string, any> = {};
    
    if (data.title !== undefined) backendData.title = data.title;
    if (data.description !== undefined) backendData.description = data.description;
    if (data.status !== undefined) backendData.status = data.status;
    if (data.priority !== undefined) backendData.priority = priorityMap[data.priority];
    if (data.due_date !== undefined) backendData.due_date = data.due_date;
    if (data.project_id !== undefined) backendData.project_id = data.project_id;
    if (data.completed !== undefined) backendData.completed = data.completed;
    
    return request<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendData),
    });
  },

  complete: async (id: string): Promise<Task> => {
    return request<Task>(`/api/tasks/${id}/complete`, {
      method: 'PATCH',
    });
  },

  delete: async (id: string): Promise<void> => {
    await request(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

// =============================================================================
// Subtasks API
// =============================================================================

export const subtasks = {
  create: async (taskId: string, title: string): Promise<Subtask> => {
    return request<Subtask>(`/api/tasks/${taskId}/subtasks`, {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  },

  toggle: async (taskId: string, subtaskId: string): Promise<Subtask> => {
    return request<Subtask>(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: 'PATCH',
    });
  },

  delete: async (taskId: string, subtaskId: string): Promise<void> => {
    await request(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: 'DELETE',
    });
  },
};

// =============================================================================
// Projects API
// =============================================================================

export const projects = {
  list: async (): Promise<Project[]> => {
    return request<Project[]>('/api/projects', {
      method: 'GET',
    });
  },

  get: async (id: string): Promise<Project> => {
    return request<Project>(`/api/projects/${id}`, {
      method: 'GET',
    });
  },

  create: async (data: Partial<Project>): Promise<Project> => {
    return request<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Project>): Promise<Project> => {
    return request<Project>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    await request(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  },

  stats: async (id: string): Promise<{ totalTasks: number; completedTasks: number; completionRate: number }> => {
    return request(`/api/projects/${id}/stats`, {
      method: 'GET',
    });
  },
};

// =============================================================================
// Labels API
// =============================================================================

export const labels = {
  list: async (): Promise<Label[]> => {
    return request<Label[]>('/api/labels', {
      method: 'GET',
    });
  },

  create: async (data: Partial<Label>): Promise<Label> => {
    return request<Label>('/api/labels', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Label>): Promise<Label> => {
    return request<Label>(`/api/labels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    await request(`/api/labels/${id}`, {
      method: 'DELETE',
    });
  },
};

// =============================================================================
// Dashboard API
// =============================================================================

export const dashboard = {
  stats: async (): Promise<DashboardStats> => {
    return request<DashboardStats>('/api/dashboard/stats', {
      method: 'GET',
    });
  },

  weeklyActivity: async (): Promise<{ days: Array<{ date: string; completed: number; created: number }> }> => {
    return request('/api/dashboard/weekly-activity', {
      method: 'GET',
    });
  },

  streak: async (): Promise<{ currentStreak: number; longestStreak: number; lastCompletedDate: string }> => {
    return request('/api/dashboard/streak', {
      method: 'GET',
    });
  },
};

// =============================================================================
// Pomodoro API
// =============================================================================

export const pomodoro = {
  logSession: async (data: { task_id?: string; duration: number; completed: boolean }): Promise<PomodoroStats> => {
    return request<PomodoroStats>('/api/pomodoro/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  stats: async (range?: 'day' | 'week' | 'month'): Promise<PomodoroStats> => {
    const query = range ? `?range=${range}` : '';
    return request<PomodoroStats>(`/api/pomodoro/stats${query}`, {
      method: 'GET',
    });
  },
};

// =============================================================================
// Exports
// =============================================================================

export const api = {
  auth,
  tasks,
  subtasks,
  projects,
  labels,
  dashboard,
  pomodoro,
};

export { getToken, setToken, removeToken };
export default api;
