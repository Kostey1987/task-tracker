import { useCallback } from "react";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "../services/tasksApi";
import type { TaskInput, UseTasksActionsProps } from "../types";

export function useTasksActions({ onError }: UseTasksActionsProps = {}) {
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const handleCreate = useCallback(
    async (values: Partial<TaskInput> & { file?: File | null }) => {
      if (!values.description?.trim() || !values.status) return;

      try {
        const taskData: any = {
          description: values.description.trim(),
          status: values.status,
          deadline: values.deadline,
        };

        if (values.file) {
          taskData.file = values.file;
        } else if (values.image) {
          taskData.image = values.image;
        }

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
      values: Partial<TaskInput> & { file?: File | null },
      currentTask?: any
    ) => {
      if (!currentTask) return;

      const updateData: any = {
        description: values.description ?? currentTask.description,
        status: values.status ?? currentTask.status,
        deadline: values.deadline ?? currentTask.deadline,
      };

      if (values.file) {
        updateData.file = values.file;
      } else if (values.image) {
        updateData.image = values.image;
      }

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
