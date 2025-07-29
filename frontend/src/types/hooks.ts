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

// useTasksPageState
export interface UseTasksPageStateProps {
  onFiltersChange?: (filters: {
    page: number;
    status: TaskStatus | null;
    search: string;
    sortDeadline: "asc" | "desc";
  }) => void;
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
  editingId: number | null;
  isCreatingCard: boolean;
  search: string | null;
  page: number;
  handleCreate: (values: Partial<TaskInput> & { file?: File | null }) => Promise<void>;
  handleCreateCardToggle: (value: boolean) => void;
  handleEditIdChange: (id: number | null) => void;
  handleImageDeleted: () => void;
  handleEditWithTask: (id: number, values: Partial<TaskInput> & { file?: File | null }) => Promise<void>;
  handleDeleteWithRefetch: (id: number) => Promise<void>;
  handlePageChange: (page: number) => void;
  refetch: () => void;
}

// Импорты для типов
import type { Task, TaskStatus, TaskInput, GetTasksResponse } from "./api"; 