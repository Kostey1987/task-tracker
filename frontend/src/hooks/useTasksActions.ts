import { useCallback } from "react";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "../services/tasksApi";
import type { TaskInput, UseTasksActionsProps } from "../types/types-exports";

export function useTasksActions({ onError }: UseTasksActionsProps = {}) {
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const handleCreate = useCallback(
    async (values: Partial<TaskInput>) => {
      if (!values.description?.trim() || !values.status) return;

      try {
        const taskData = {
          description: values.description.trim(),
          status: values.status,
          deadline: values.deadline || null,
        };

        console.log("handleCreate: отправляемые данные:", taskData);
        await createTask(taskData).unwrap();
      } catch (error) {
        console.error("Ошибка создания задачи:", error);
        onError?.(error);
      }
    },
    [createTask, onError]
  );

  const handleEdit = useCallback(
    async (
      id: number,
      values: Partial<TaskInput>,
      currentTask?: any
    ) => {
      if (!currentTask) return;

      const updateData = {
        description: values.description ?? currentTask.description,
        status: values.status ?? currentTask.status,
        deadline: values.deadline ?? currentTask.deadline,
      };

      console.log("handleEdit: отправляемые данные:", updateData);

      try {
        await updateTask({
          id,
          data: updateData,
        }).unwrap();
      } catch (error) {
        console.error("Ошибка редактирования задачи:", error);
        onError?.(error);
      }
    },
    [updateTask, onError]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await deleteTask(id).unwrap();
      } catch (error) {
        console.error("Ошибка удаления задачи:", error);
        onError?.(error);
      }
    },
    [deleteTask, onError]
  );

  return {
    handleCreate,
    handleEdit,
    handleDelete,
    isCreating,
    isUpdating,
    isDeleting,
  };
}
