// API типы

// Базовые типы
export type TaskStatus = "В работе" | "Готово" | "Просрочено";

export interface User {
  id?: number;
  name: string;
  email: string;
}

export interface Task {
  id: number;
  description: string;
  status: TaskStatus;
  deadline: string | null;
  image: string | null;
  userId: number;
}

// Входные данные
export interface TaskInput {
  description: string;
  status?: TaskStatus;
  deadline: string | null;
  image: string | null;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// API ответы
export interface AuthResponse {
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface GetTasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateTaskResponse {
  id: number;
}

export interface MessageResponse {
  message: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  tasks: T[];
  totalPages: number;
  currentPage: number;
  totalTasks: number;
}

// Параметры запросов
export interface GetTasksParams {
  page?: number;
  limit?: number;
  status?: string | null;
  deadlineFrom?: string;
  deadlineTo?: string;
  sortDeadline?: "asc" | "desc";
  search?: string | null;
}

// Состояние аутентификации
export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

// Профиль пользователя
export interface UserProfile {
  id: number;
  name: string;
  email: string;
} 