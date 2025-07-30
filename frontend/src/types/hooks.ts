// Типы для хуков

// useDeadlineHandler
export interface UseDeadlineHandlerProps {
  initialDeadline: string | null;
  isEditing: boolean;
  isCreating: boolean;
  onDeadlineChange?: (deadline: string | null) => void;
}

// useImageHandler
export interface UseImageHandlerProps {
  initialImage: string | null;
  onImageChange?: (file: File | null, image: string | null) => void;
}

// useTaskCardState
export interface UseTaskCardStateProps {
  initialDescription: string;
  initialStatus: TaskStatus;
  isEditing: boolean;
  isCreating: boolean;
  onStateChange?: (description: string, status: TaskStatus) => void;
}

// useTaskCardActions
export interface UseTaskCardActionsProps {
  taskId: number;
  desc: string;
  currentStatus: TaskStatus;
  deadlineError: string | null;
  file: File | null;
  currentImage: string | null;
  deadlineInput: string;
  isCreating: boolean;
  onChange?: (data: Partial<Task> & { file?: File | null }) => void;
  onImageDeleted?: () => void;
  onCancelEdit?: () => void;
  getFormattedDeadlineForApi: () => string | null;
  handleRemoveImage: () => void;
}

// useTasksActions
export interface UseTasksActionsProps {
  onError?: (error: unknown) => void;
}

// useTasksRefetch
export interface UseTasksRefetchProps {
  refetch: () => void;
  onSuccess?: () => void;
}

// useTasksPageContent
export interface UseTasksPageContentProps {
  data: GetTasksResponse;
  search: string | null;
}

// Импорты для типов
import type { Task, TaskStatus, TaskInput, GetTasksResponse } from "./api";
