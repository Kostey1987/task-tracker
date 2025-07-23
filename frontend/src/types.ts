// Типы для пользователя
export interface User {
  id?: number;
  name: string;
  email: string;
}

// Типы для задачи
export interface Task {
  id?: number;
  description: string;
  status?: string;
  deadline?: string;
  image?: string;
  userId: number;
}

// Ответ авторизации/refresh
export interface AuthResponse {
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

// Входные данные для задач
export interface TaskInput {
  description: string;
  status?: string;
  deadline?: string;
  image?: string;
}

// Входные данные для регистрации
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

// Входные данные для логина
export interface LoginInput {
  email: string;
  password: string;
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
