import { useState, useEffect } from "react";
import dayjs from "dayjs";

interface UseDeadlineHandlerProps {
  initialDeadline: string | null;
  isEditing: boolean;
  isCreating: boolean;
  onDeadlineChange?: (deadline: string | null) => void;
}

export function useDeadlineHandler({ 
  initialDeadline, 
  isEditing, 
  isCreating, 
  onDeadlineChange 
}: UseDeadlineHandlerProps) {
  const [deadlineInput, setDeadlineInput] = useState(
    initialDeadline ? dayjs(initialDeadline).format("DD.MM.YYYY HH:mm") : ""
  );
  const [deadlineError, setDeadlineError] = useState<string | null>(null);

  // Сброс дедлайна при изменении режима редактирования
  useEffect(() => {
    if (!isEditing && !isCreating) {
      setDeadlineInput(
        initialDeadline ? dayjs(initialDeadline).format("DD.MM.YYYY HH:mm") : ""
      );
      setDeadlineError(null);
    }
  }, [initialDeadline, isEditing, isCreating]);

  const validateDeadline = (value: string): string | null => {
    if (!value.trim()) return "Дедлайн обязателен";
    const parsed = dayjs(value, "DD.MM.YYYY HH:mm", true);
    if (!parsed.isValid())
      return "Неверный формат даты. Пример: 31.12.2024 23:59";
    return null;
  };

  const formatDeadlineForApi = (value: string): string | null => {
    const parsed = dayjs(value, "DD.MM.YYYY HH:mm", true);
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