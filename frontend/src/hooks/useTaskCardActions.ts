import { useCallback } from "react";
import { useDeleteTaskImageMutation } from "../services/tasksApi";
import type { Task, TaskStatus } from "../types/index";

interface UseTaskCardActionsProps {
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

export function useTaskCardActions({
  taskId,
  desc,
  currentStatus,
  deadlineError,
  file,
  currentImage,
  deadlineInput,
  isCreating,
  onChange,
  onImageDeleted,
  onCancelEdit,
  getFormattedDeadlineForApi,
  handleRemoveImage,
}: UseTaskCardActionsProps) {
  const [deleteTaskImage] = useDeleteTaskImageMutation();

  const handleSave = useCallback(() => {
    const error = deadlineError;
    if (error) return;

    onChange?.({
      description: desc,
      status: currentStatus,
      deadline: getFormattedDeadlineForApi(),
      ...(file ? { file } : currentImage ? { image: currentImage } : {}),
    });
  }, [
    deadlineError,
    onChange,
    desc,
    currentStatus,
    getFormattedDeadlineForApi,
    file,
    currentImage,
  ]);

  const handleCreate = useCallback(() => {
    const error = deadlineError;
    if (error || !desc.trim()) return;

    onChange?.({
      description: desc.trim(),
      status: currentStatus,
      deadline: deadlineInput ? getFormattedDeadlineForApi() : null,
      ...(file ? { file } : {}),
    });
  }, [
    deadlineError,
    desc,
    onChange,
    currentStatus,
    deadlineInput,
    getFormattedDeadlineForApi,
    file,
  ]);

  const handleRemoveImageFromServer = useCallback(async () => {
    try {
      await deleteTaskImage(taskId).unwrap();
      handleRemoveImage();
      onImageDeleted?.();
    } catch (error) {
      console.error("Ошибка удаления изображения:", error);
    }
  }, [deleteTaskImage, taskId, handleRemoveImage, onImageDeleted]);

  const handleCancel = useCallback(() => {
    isCreating
      ? onChange?.({ description: "", status: "В работе" })
      : onCancelEdit?.();
  }, [isCreating, onChange, onCancelEdit]);

  return {
    handleSave,
    handleCreate,
    handleRemoveImageFromServer,
    handleCancel,
  };
}
