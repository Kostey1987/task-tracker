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
  accessToken: string;
  refreshToken: string;
  user: User;
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
