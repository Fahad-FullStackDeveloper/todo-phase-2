/**
 * API Client for TodoFlow Backend
 * 
 * Handles all HTTP requests to the FastAPI backend with:
 * - Automatic JWT token attachment
 * - Error handling and 401 redirection
 * - Request/response typing
 * - Base URL configuration
 */

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
} from '@/types';

// =============================================================================
// Configuration
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// =============================================================================
// Types
// =============================================================================

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
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
}

// =============================================================================
// Token Management
// =============================================================================

/**
 * Get JWT token from secure storage
 * In production, this should read from httpOnly cookies
 */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jwt_token');
}

/**
 * Store JWT token
 */
function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('jwt_token', token);
}

/**
 * Remove JWT token
 */
function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('jwt_token');
}

// =============================================================================
// API Client
// =============================================================================

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Attach JWT token if required
  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
      throw new Error('Unauthorized');
    }

    // Handle errors
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        success: false,
        error: 'Request failed',
      }));
      throw new Error(errorData.message || errorData.error);
    }

    // Parse response
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
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
    });
  },

  signin: async (data: SigninData): Promise<AuthResponse> => {
    const response = await request<AuthResponse>('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: false,
    });
    
    // Store token on successful signin
    if (response.token) {
      setToken(response.token);
    }
    
    return response;
  },

  signout: async (): Promise<void> => {
    try {
      await request('/api/auth/signout', {
        method: 'POST',
      });
    } finally {
      removeToken();
    }
  },

  me: async (): Promise<{ user: User }> => {
    return request<{ user: User }>('/api/auth/me');
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await request<{ token: string }>('/api/auth/refresh', {
      method: 'POST',
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
    return request<Task[]>(`/api/tasks${query ? `?${query}` : ''}`);
  },

  get: async (id: string): Promise<Task> => {
    return request<Task>(`/api/tasks/${id}`);
  },

  create: async (data: Partial<Task>): Promise<Task> => {
    return request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Task>): Promise<Task> => {
    return request<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
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
    return request<Project[]>('/api/projects');
  },

  get: async (id: string): Promise<Project> => {
    return request<Project>(`/api/projects/${id}`);
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
    return request(`/api/projects/${id}/stats`);
  },
};

// =============================================================================
// Labels API
// =============================================================================

export const labels = {
  list: async (): Promise<Label[]> => {
    return request<Label[]>('/api/labels');
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
    return request<DashboardStats>('/api/dashboard/stats');
  },

  weeklyActivity: async (): Promise<{ days: Array<{ date: string; completed: number; created: number }> }> => {
    return request('/api/dashboard/weekly-activity');
  },

  streak: async (): Promise<{ currentStreak: number; longestStreak: number; lastCompletedDate: string }> => {
    return request('/api/dashboard/streak');
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
    return request<PomodoroStats>(`/api/pomodoro/stats${query}`);
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
