import { useState, useEffect } from "react";
import dayjs from "dayjs";
import type { UseDeadlineHandlerProps } from "../types/types-exports";

export function useDeadlineHandler({
  initialDeadline,
  isEditing,
  isCreating,
  onDeadlineChange,
}: UseDeadlineHandlerProps) {
  // Хранит ввод для <input type="datetime-local"> в формате YYYY-MM-DDTHH:mm
  const [deadlineInput, setDeadlineInput] = useState(
    initialDeadline ? dayjs(initialDeadline).format("YYYY-MM-DDTHH:mm") : ""
  );
  const [deadlineError, setDeadlineError] = useState<string | null>(null);

  // При выходе из режимов редактирования/создания — синхронизировать
  // локальное поле с исходным значением и очистить ошибки
  useEffect(() => {
    if (!isEditing && !isCreating) {
      setDeadlineInput(
        initialDeadline ? dayjs(initialDeadline).format("YYYY-MM-DDTHH:mm") : ""
      );
      setDeadlineError(null);
    }
  }, [initialDeadline, isEditing, isCreating]);

  // Проверка корректности формата и обязательности
  const validateDeadline = (value: string): string | null => {
    if (!value.trim()) return "Дедлайн обязателен";
    const parsed = dayjs(value, "YYYY-MM-DDTHH:mm", true);
    if (!parsed.isValid())
      return "Неверный формат даты. Используйте формат: ГГГГ-ММ-ДД ЧЧ:ММ";
    return null;
  };

  // Преобразование в строку для API при условии валидности
  const formatDeadlineForApi = (value: string): string | null => {
    const parsed = dayjs(value, "YYYY-MM-DDTHH:mm", true);
    return parsed.isValid() ? parsed.format("YYYY-MM-DDTHH:mm") : null;
  };

  // Изменение ввода: валидирует, хранит и уведомляет контейнер об изменении
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

  // Сброс сообщения об ошибке (например, при отмене)
  const resetDeadlineError = () => {
    setDeadlineError(null);
  };

  // Текущее валидное значение в формате API, либо null
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
