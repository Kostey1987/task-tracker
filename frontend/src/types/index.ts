// Типы для задач
export type TaskStatus = "В работе" | "Готово" | "Просрочено";

export interface Task {
  id?: number;
  description: string;
  status: TaskStatus;
  deadline?: string;
  image?: string;
}

export interface TaskCardProps {
  id?: number;
  description: string;
  status: TaskStatus;
  deadline?: string;
  image?: string;
  onChange?: (
    data: Partial<{
      description: string;
      status: TaskStatus;
      image?: string;
      deadline?: string;
      file?: File | null;
    }>
  ) => void;
  isCreating?: boolean;
  onDelete?: () => void;
  isEditing?: boolean;
  onEditClick?: () => void;
  onCancelEdit?: () => void;
  onImageDeleted?: () => void;
}

// Типы для аутентификации
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

// Типы для API
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

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Типы для пользователя
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
}
