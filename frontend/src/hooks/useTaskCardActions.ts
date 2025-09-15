import { useCallback } from "react";
import { useDeleteTaskImageMutation } from "../services/tasksApi";
import type { UseTaskCardActionsProps } from "../types/types-exports";

// Хук уровня UI карточки задачи.
// Отвечает за подготовку payload для create/save, удаление изображения на сервере
// и корректную отмену с учётом режима (create/edit). Не вызывает CRUD напрямую, а
// делегирует сохранение наружу через onChange — это упрощает переиспользование и тестирование.
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

  // Сохранение изменений существующей задачи
  // Валидирует дедлайн и собирает данные для внешнего обработчика onChange
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

  // Создание новой задачи
  // Тримит описание, выставляет null для пустого дедлайна, отдаёт наружу payload
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

  // Удаление изображения с сервера и локальная синхронизация UI
  const handleRemoveImageFromServer = useCallback(async () => {
    try {
      await deleteTaskImage(taskId).unwrap();
      handleRemoveImage();
      onImageDeleted?.();
    } catch (error) {
      console.error("Ошибка удаления изображения:", error);
    }
  }, [deleteTaskImage, taskId, handleRemoveImage, onImageDeleted]);

  // Отмена: в режиме создания — сбросить поля, в режиме редактирования — выйти из edit
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
