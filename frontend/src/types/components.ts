// Типы для компонентов

// TaskCard и его подкомпоненты
/** Пропсы для компонента карточки задачи */
export interface TaskCardProps {
  task: Task;
  flags?: {
    isEditing?: boolean;
    isCreating?: boolean;
  };
  callbacks?: {
    onChange?: (data: Partial<Task>) => void;
    onDelete?: () => void;
    onEditClick?: () => void;
    onCancelEdit?: () => void;
  };
}

/** Пропсы для заголовка карточки задачи */
export interface TaskCardHeaderProps {
  currentStatus: TaskStatus;
  isEditing: boolean;
  isCreating: boolean;
  setCurrentStatus: (status: TaskStatus) => void;
  onDelete?: () => void;
}

/** Пропсы для описания в карточке задачи */
export interface TaskCardDescriptionProps {
  isEditing: boolean;
  isCreating: boolean;
  desc: string;
  setDesc: (value: string) => void;
  isMobile: boolean;
}

/** Пропсы для дедлайна в карточке задачи */
export interface TaskCardDeadlineProps {
  isEditing: boolean;
  isCreating: boolean;
  deadlineInput: string;
  setDeadlineInput: (value: string) => void;
  deadlineError: string | null;
  deadlineLabel?: string;
}

/** Пропсы для действий в карточке задачи */
export interface TaskCardActionsProps {
  isEditing: boolean;
  isCreating: boolean;
  isMobile: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEditClick?: () => void;
  saveDisabled?: boolean;
}

// TasksPage и его подкомпоненты
/** Пропсы для заголовка страницы задач */
export interface TasksPageHeaderProps {
  isCreating: boolean;
}

/** Пропсы для основного контента страницы задач */
export interface TasksPageContentProps {
  data: GetTasksResponse;
  handleCreate: (values: Partial<TaskInput>) => Promise<void>;
  handleEditWithTask: (id: number, values: Partial<TaskInput>) => Promise<void>;
  handleDeleteWithRefetch: (id: number) => Promise<void>;
  refetch: () => void;
}

/** Пропсы для списка задач */
export interface TasksListProps {
  tasks: Task[];
  onEditClick: (id: number) => void;
  onCancelEdit: () => void;
  onEdit: (id: number, values: Partial<TaskInput>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

/** Пропсы для карточки создания задачи */
export interface TaskCreationCardProps {
  handleCreate: (values: Partial<TaskInput>) => Promise<void>;
  handleCreateCardToggle: (value: boolean) => void;
  refetch: () => void;
}

// AuthDrawer
/** Пропсы для модального окна аутентификации */
export interface AuthDrawerProps {
  opened: boolean;
  onClose: () => void;
}

// Routes
/** Пропсы для защищенного маршрута (требует аутентификации) */
export interface ProtectedRouteProps {
  children: React.ReactNode;
}

/** Пропсы для публичного маршрута (только для неавторизованных) */
export interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

// Form components
/** Пропсы для текстового поля формы */
export interface TextInputFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  placeholder?: string;
  rules?: RegisterOptions<T>;
  autoComplete?: string;
}

// Pages
/** Значения формы входа */
export interface LoginFormValues {
  email: string;
  password: string;
}

/** Значения формы регистрации */
export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** Значения формы профиля */
export interface ProfileFormValues {
  name: string;
}

// Импорты для типов
import type { Task, TaskStatus, TaskInput, GetTasksResponse } from "./apiTypes";
import type {
  FieldValues,
  Path,
  Control,
  RegisterOptions,
} from "react-hook-form";
