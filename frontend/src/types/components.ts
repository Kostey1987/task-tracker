// Типы для компонентов

// TaskCard и его подкомпоненты
export interface TaskCardProps {
  task: Task;
  flags?: {
    isEditing?: boolean;
    isCreating?: boolean;
  };
  callbacks?: {
    onChange?: (data: Partial<Task> & { file?: File | null }) => void;
    onDelete?: () => void;
    onEditClick?: () => void;
    onCancelEdit?: () => void;
    onImageDeleted?: () => void;
  };
}

export interface TaskCardImageProps {
  currentImage: string | null;
  isEditing: boolean;
  isCreating: boolean;
  onRemoveImage: () => void;
  onFileChange: (file: File | null) => void;
  imageError: string | null;
}

export interface TaskCardHeaderProps {
  currentStatus: TaskStatus;
  isEditing: boolean;
  isCreating: boolean;
  setCurrentStatus: (status: TaskStatus) => void;
  onDelete?: () => void;
}

export interface TaskCardDescriptionProps {
  isEditing: boolean;
  isCreating: boolean;
  desc: string;
  setDesc: (value: string) => void;
  isMobile: boolean;
}

export interface TaskCardDeadlineProps {
  isEditing: boolean;
  isCreating: boolean;
  deadlineInput: string;
  setDeadlineInput: (value: string) => void;
  deadlineError: string | null;
  deadlineLabel?: string;
}

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
export interface TasksPageHeaderProps {
  isCreating: boolean;
}

export interface TasksPageContentProps {
  data: GetTasksResponse;
  handleCreate: (
    values: Partial<TaskInput> & { file?: File | null }
  ) => Promise<void>;
  handleImageDeleted: () => void;
  handleEditWithTask: (
    id: number,
    values: Partial<TaskInput> & { file?: File | null }
  ) => Promise<void>;
  handleDeleteWithRefetch: (id: number) => Promise<void>;
  refetch: () => void;
}

export interface TasksListProps {
  tasks: Task[];
  onEditClick: (id: number) => void;
  onCancelEdit: () => void;
  onImageDeleted: () => void;
  onEdit: (
    id: number,
    values: Partial<TaskInput> & { file?: File | null }
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export interface TasksFiltersProps {}

export interface TaskCreationCardProps {
  handleCreate: (
    values: Partial<TaskInput> & { file?: File | null }
  ) => Promise<void>;
  handleCreateCardToggle: (value: boolean) => void;
  refetch: () => void;
}

// AuthDrawer
export interface AuthDrawerProps {
  opened: boolean;
  onClose: () => void;
}

// Routes
export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

// Form components
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

export interface ProfileFormValues {
  name: string;
}

// Импорты для типов
import type { Task, TaskStatus, TaskInput, GetTasksResponse } from "./api";
import type {
  FieldValues,
  Path,
  Control,
  RegisterOptions,
} from "react-hook-form";
