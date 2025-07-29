import { useState, useEffect, useCallback } from "react";
import type { TaskStatus, UseTaskCardStateProps } from "../types/types-exports";

export function useTaskCardState({
  initialDescription,
  initialStatus,
  isEditing,
  isCreating,
  onStateChange,
}: UseTaskCardStateProps) {
  const [desc, setDesc] = useState(initialDescription);
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(initialStatus);

  // Сброс состояния при изменении режима редактирования
  useEffect(() => {
    if (!isEditing && !isCreating) {
      setDesc(initialDescription);
      setCurrentStatus(initialStatus);
    }
  }, [initialDescription, initialStatus, isEditing, isCreating]);

  const handleDescriptionChange = useCallback(
    (newDescription: string) => {
      setDesc(newDescription);
      onStateChange?.(newDescription, currentStatus);
    },
    [currentStatus, onStateChange]
  );

  const handleStatusChange = useCallback(
    (newStatus: TaskStatus) => {
      setCurrentStatus(newStatus);
      onStateChange?.(desc, newStatus);
    },
    [desc, onStateChange]
  );

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
