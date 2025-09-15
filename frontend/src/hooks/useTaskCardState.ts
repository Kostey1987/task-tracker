import { useState, useEffect, useCallback } from "react";
import type { TaskStatus, UseTaskCardStateProps } from "../types/types-exports";

export function useTaskCardState({
  initialDescription,
  initialStatus,
  isEditing,
  isCreating,
  onStateChange,
}: UseTaskCardStateProps) {
  // Локальное, контролируемое состояние полей карточки (описание и статус)
  const [desc, setDesc] = useState(initialDescription);
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(initialStatus);

  // При выходе из режимов редактирования/создания — восстановить значения
  useEffect(() => {
    if (!isEditing && !isCreating) {
      setDesc(initialDescription);
      setCurrentStatus(initialStatus);
    }
  }, [initialDescription, initialStatus, isEditing, isCreating]);

  // Обновление описания
  const handleDescriptionChange = useCallback(
    (newDescription: string) => {
      setDesc(newDescription);
      onStateChange?.(newDescription, currentStatus);
    },
    [currentStatus, onStateChange]
  );

  // Обновление статуса
  const handleStatusChange = useCallback(
    (newStatus: TaskStatus) => {
      setCurrentStatus(newStatus);
      onStateChange?.(desc, newStatus);
    },
    [desc, onStateChange]
  );

  // Полный сброс к исходным значениям
  const resetState = useCallback(() => {
    setDesc(initialDescription);
    setCurrentStatus(initialStatus);
  }, [initialDescription, initialStatus]);

  return {
    desc,
    currentStatus,
    handleDescriptionChange,
    handleStatusChange,
    resetState,
  };
}
