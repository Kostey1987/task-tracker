import { useCallback } from "react";
import type { UseTaskCardActionsProps } from "../types/types-exports";

export function useTaskCardActions({
  taskId,
  desc,
  currentStatus,
  deadlineError,
  deadlineInput,
  isCreating,
  onChange,
  onCancelEdit,
  getFormattedDeadlineForApi,
}: UseTaskCardActionsProps) {
  const handleSave = useCallback(() => {
    const error = deadlineError;
    if (error) return;

    onChange?.({
      description: desc,
      status: currentStatus,
      deadline: getFormattedDeadlineForApi(),
    });
  }, [
    deadlineError,
    onChange,
    desc,
    currentStatus,
    getFormattedDeadlineForApi,
  ]);

  const handleCreate = useCallback(() => {
    const error = deadlineError;
    if (error || !desc.trim()) return;

    onChange?.({
      description: desc.trim(),
      status: currentStatus,
      deadline: deadlineInput ? getFormattedDeadlineForApi() : null,
    });
  }, [
    deadlineError,
    desc,
    onChange,
    currentStatus,
    deadlineInput,
    getFormattedDeadlineForApi,
  ]);

  const handleCancel = useCallback(() => {
    isCreating
      ? onChange?.({ description: "", status: "В работе" })
      : onCancelEdit?.();
  }, [isCreating, onChange, onCancelEdit]);

  return {
    handleSave,
    handleCreate,
    handleCancel,
  };
}
