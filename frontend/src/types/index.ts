/**
 * TodoFlow TypeScript Types
 * 
 * Type definitions for all entities and API responses
 */

// =============================================================================
// User Types
// =============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// =============================================================================
// Task Types
// =============================================================================

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  project_id: string | null;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  subtasks?: Subtask[];
  labels?: Label[];
  project?: Project;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
  project_id?: string;
  labels?: string[];
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  status?: TaskStatus;
  completed?: boolean;
}

// =============================================================================
// Subtask Types
// =============================================================================

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  position: number;
  created_at: string;
}

export interface CreateSubtaskData {
  title: string;
}

// =============================================================================
// Project Types
// =============================================================================

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
  _count?: {
    tasks: number;
  };
}

export interface CreateProjectData {
  name: string;
  description?: string;
  color?: string;
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
}

// =============================================================================
// Label Types
// =============================================================================

export interface Label {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  _count?: {
    tasks: number;
  };
}

export interface CreateLabelData {
  name: string;
  color: string;
}

// =============================================================================
// Dashboard Types
// =============================================================================

export interface DashboardStats {
  totalTasks: number;
  completedToday: number;
  completionRate: number;
  currentStreak: number;
  tasksByPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  tasksByProject: Array<{
    project_id: string;
    project_name: string;
    count: number;
  }>;
}

export interface WeeklyActivity {
  days: Array<{
    date: string;
    completed: number;
    created: number;
  }>;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string;
}

// =============================================================================
// Pomodoro Types
// =============================================================================

export interface PomodoroSession {
  id: string;
  user_id: string;
  task_id: string | null;
  duration_minutes: number;
  completed: boolean;
  session_date: string;
  created_at: string;
}

export interface PomodoroStats {
  totalSessions: number;
  totalMinutes: number;
  avgSessionLength: number;
}

export interface CreatePomodoroSessionData {
  task_id?: string;
  duration: number;
  completed: boolean;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// =============================================================================
// UI Types
// =============================================================================

export interface ThemeConfig {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export interface FilterConfig {
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id?: string;
  labels?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface SortConfig {
  field: 'created' | 'due_date' | 'priority' | 'title' | 'completion';
  direction: 'asc' | 'desc';
}

// =============================================================================
// Form Types
// =============================================================================

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  due_date: string;
  project_id: string;
  labels: string[];
}

export interface ProjectFormData {
  name: string;
  description: string;
  color: string;
}

export interface LabelFormData {
  name: string;
  color: string;
}
