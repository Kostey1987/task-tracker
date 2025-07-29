import { useMemo } from "react";
import type { GetTasksResponse, TaskInput } from "../types";

interface UseTasksPageContentProps {
  data: GetTasksResponse;
  editingId: number | null;
  isCreatingCard: boolean;
  search: string | null;
  page: number;
  handleCreate: (
    values: Partial<TaskInput> & { file?: File | null }
  ) => Promise<void>;
  handleCreateCardToggle: (value: boolean) => void;
  handleEditIdChange: (id: number | null) => void;
  handleImageDeleted: () => void;
  handleEditWithTask: (
    id: number,
    values: Partial<TaskInput> & { file?: File | null }
  ) => Promise<void>;
  handleDeleteWithRefetch: (id: number) => Promise<void>;
  handlePageChange: (page: number) => void;
  refetch: () => void;
}

export function useTasksPageContent({
  data,
  editingId,
  isCreatingCard,
  search,
  page,
  handleCreate,
  handleCreateCardToggle,
  handleEditIdChange,
  handleImageDeleted,
  handleEditWithTask,
  handleDeleteWithRefetch,
  handlePageChange,
  refetch,
}: UseTasksPageContentProps) {
  const emptyMessage = useMemo(() => {
    if (search) {
      return `Задачи по запросу "${search}" не найдены`;
    }
    return "Нет задач";
  }, [search]);

  const hasTasks = useMemo(() => {
    return Boolean(data?.tasks.length);
  }, [data?.tasks.length]);

  const showPagination = useMemo(() => {
    return Boolean(data && data.totalPages > 1);
  }, [data?.totalPages]);

  return {
    emptyMessage,
    hasTasks,
    showPagination,
  };
}
