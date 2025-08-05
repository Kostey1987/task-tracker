// Типы для хуков

// useDeadlineHandler
/** Пропсы для хука обработки дедлайнов */
export interface UseDeadlineHandlerProps {
  initialDeadline: string | null;
  isEditing: boolean;
  isCreating: boolean;
  onDeadlineChange?: (deadline: string | null) => void;
}

// useTaskCardState
/** Пропсы для хука управления состоянием карточки задачи */
export interface UseTaskCardStateProps {
  initialDescription: string;
  initialStatus: TaskStatus;
  isEditing: boolean;
  isCreating: boolean;
  onStateChange?: (description: string, status: TaskStatus) => void;
}

// useTaskCardActions
/** Пропсы для хука действий карточки задачи */
export interface UseTaskCardActionsProps {
  taskId: number;
  desc: string;
  currentStatus: TaskStatus;
  deadlineError: string | null;
  deadlineInput: string;
  isCreating: boolean;
  onChange?: (data: Partial<Task>) => void;
  onCancelEdit?: () => void;
  getFormattedDeadlineForApi: () => string | null;
}

// useTasksActions
/** Пропсы для хука действий с задачами */
export interface UseTasksActionsProps {
  onError?: (error: unknown) => void;
}

// useTasksRefetch
/** Пропсы для хука обновления списка задач */
export interface UseTasksRefetchProps {
  refetch: () => void;
  onSuccess?: () => void;
}

// useTasksPageContent
/** Пропсы для хука контента страницы задач */
export interface UseTasksPageContentProps {
  data: GetTasksResponse;
  search: string | null;
}

// Импорты для типов
import type { Task, TaskStatus, GetTasksResponse } from "./apiTypes";
