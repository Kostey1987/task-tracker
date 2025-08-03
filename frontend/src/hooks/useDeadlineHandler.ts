import { useState, useEffect } from "react";
import dayjs from "dayjs";
import type { UseDeadlineHandlerProps } from "../types/types-exports";

export function useDeadlineHandler({
  initialDeadline,
  isEditing,
  isCreating,
  onDeadlineChange,
}: UseDeadlineHandlerProps) {
  // Для datetime-local input используем формат YYYY-MM-DDTHH:mm
  const [deadlineInput, setDeadlineInput] = useState(
    initialDeadline ? dayjs(initialDeadline).format("YYYY-MM-DDTHH:mm") : ""
  );
  const [deadlineError, setDeadlineError] = useState<string | null>(null);

  // Сброс дедлайна при изменении режима редактирования
  useEffect(() => {
    if (!isEditing && !isCreating) {
      setDeadlineInput(
        initialDeadline ? dayjs(initialDeadline).format("YYYY-MM-DDTHH:mm") : ""
      );
      setDeadlineError(null);
    }
  }, [initialDeadline, isEditing, isCreating]);

  const validateDeadline = (value: string): string | null => {
    if (!value.trim()) return "Дедлайн обязателен";
    const parsed = dayjs(value, "YYYY-MM-DDTHH:mm", true);
    if (!parsed.isValid())
      return "Неверный формат даты. Используйте формат: ГГГГ-ММ-ДД ЧЧ:ММ";
    return null;
  };

  const formatDeadlineForApi = (value: string): string | null => {
    const parsed = dayjs(value, "YYYY-MM-DDTHH:mm", true);
    return parsed.isValid() ? parsed.format("YYYY-MM-DDTHH:mm") : null;
  };

  const handleDeadlineChange = (value: string) => {
    setDeadlineInput(value);
    const error = validateDeadline(value);
    setDeadlineError(error);

    if (!error && value.trim()) {
      const formattedDeadline = formatDeadlineForApi(value);
      onDeadlineChange?.(formattedDeadline);
    } else if (!value.trim()) {
      onDeadlineChange?.(null);
    }
  };

  const resetDeadlineError = () => {
    setDeadlineError(null);
  };

  const getFormattedDeadlineForApi = (): string | null => {
    return formatDeadlineForApi(deadlineInput);
  };

  return {
    deadlineInput,
    deadlineError,
    handleDeadlineChange,
    resetDeadlineError,
    getFormattedDeadlineForApi,
    validateDeadline,
  };
}
