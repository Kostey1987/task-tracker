// API типы

// Базовые типы
/** Статус задачи - возможные значения */
export type TaskStatus = "В работе" | "Готово" | "Просрочено";

/** Пользователь системы */
export interface User {
  id?: number;
  name: string;
  email: string;
}

/** Задача в системе */
export interface Task {
  id: number;
  description: string;
  status: TaskStatus;
  deadline: string | null;
  image: string | null;
  userId: number;
}

// Входные данные для API
/** Данные для создания/обновления задачи */
export interface TaskInput {
  description: string;
  status?: TaskStatus;
  deadline: string | null;
  image: string | null;
}

/** Данные для регистрации пользователя */
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

/** Данные для входа пользователя */
export interface LoginInput {
  email: string;
  password: string;
}

// API ответы
/** Ответ на аутентификацию (логин/регистрация) */
export interface AuthResponse {
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

/** Ответ на запрос списка задач с пагинацией */
export interface GetTasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  totalPages: number;
}

/** Ответ на создание задачи */
export interface CreateTaskResponse {
  id: number;
}

/** Общий ответ с сообщением */
export interface MessageResponse {
  message: string;
}

// Параметры запросов
/** Параметры для получения списка задач */
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
/** Состояние аутентификации в Redux store */
export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

// Профиль пользователя
/** Профиль пользователя */
export interface UserProfile {
  id: number;
  name: string;
  email: string;
}
