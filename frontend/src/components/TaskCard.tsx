import { useMemo } from "react";
import { Card, Stack, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { Task, TaskCardProps } from "../types/types-exports";
import { TaskCardHeader } from "./TaskCard/TaskCardHeader";
import { TaskCardImage } from "./TaskCard/TaskCardImage";
import { TaskCardDeadline } from "./TaskCard/TaskCardDeadline";
import { TaskCardDescription } from "./TaskCard/TaskCardDescription";
import { TaskCardActions } from "./TaskCard/TaskCardActions";
import {
  useImageHandler,
  useDeadlineHandler,
  useTaskCardState,
  useTaskCardActions,
} from "../hooks/hooks-exports";
import React from "react";

function TaskCardComponent({
  task,
  flags = {},
  callbacks = {},
}: TaskCardProps) {
  const {
    id,
    description = "",
    status = "В работе",
    deadline = null,
    image = null,
  } = task;
  const { isEditing = false, isCreating = false } = flags;
  const { onChange, onDelete, onEditClick, onCancelEdit, onImageDeleted } =
    callbacks;

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  // Хук для управления состоянием карточки
  const { desc, currentStatus, handleDescriptionChange, handleStatusChange } =
    useTaskCardState({
      initialDescription: description,
      initialStatus: status,
      isEditing,
      isCreating,
    });

  // Хук для обработки изображений
  const {
    currentImage,
    file,
    imageError,
    handleFileChange,
    handleRemoveImage,
    resetImageError,
  } = useImageHandler({
    initialImage: image,
  });

  // Хук для обработки дедлайнов
  const {
    deadlineInput,
    deadlineError,
    handleDeadlineChange,
    resetDeadlineError,
    getFormattedDeadlineForApi,
  } = useDeadlineHandler({
    initialDeadline: deadline,
    isEditing,
    isCreating,
  });

  // Хук для обработки действий
  const {
    handleSave,
    handleCreate,
    handleRemoveImageFromServer,
    handleCancel,
  } = useTaskCardActions({
    taskId: id,
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
  });

  // Мемоизированные стили карточки
  const cardStyles = useMemo(() => {
    const baseStyles = {
      transition: "all 0.2s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "var(--mantine-shadow-lg)",
      },
    };

    switch (currentStatus) {
      case "Готово":
        return {
          ...baseStyles,
          borderColor: "var(--mantine-color-green-4)",
          borderWidth: 2,
          backgroundColor: "var(--mantine-color-green-0)",
        };
      case "Просрочено":
        return {
          ...baseStyles,
          borderColor: "var(--mantine-color-red-4)",
          borderWidth: 2,
          backgroundColor: "var(--mantine-color-red-0)",
        };
      case "В работе":
      default:
        return {
          ...baseStyles,
          borderColor: "var(--mantine-color-yellow-4)",
          borderWidth: 2,
          backgroundColor: "var(--mantine-color-yellow-0)",
        };
    }
  }, [currentStatus]);

  // Мемоизированное состояние для кнопки сохранения
  const isSaveDisabled = useMemo(() => {
    return !desc.trim() || !!deadlineError;
  }, [desc, deadlineError]);

  // Мемоизированный обработчик отмены с сбросом ошибок
  const handleCancelWithReset = useMemo(() => {
    return () => {
      resetImageError();
      resetDeadlineError();
      handleCancel();
    };
  }, [resetImageError, resetDeadlineError, handleCancel]);

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      pos="relative"
      style={cardStyles}
    >
      <TaskCardHeader
        currentStatus={currentStatus}
        isEditing={isEditing}
        isCreating={isCreating}
        setCurrentStatus={handleStatusChange}
        onDelete={onDelete}
      />
      <Stack>
        <TaskCardDeadline
          isEditing={isEditing}
          isCreating={isCreating}
          deadlineInput={deadlineInput}
          setDeadlineInput={handleDeadlineChange}
          deadlineError={deadlineError}
        />
        <TaskCardImage
          currentImage={currentImage}
          isEditing={isEditing}
          isCreating={isCreating}
          onRemoveImage={handleRemoveImageFromServer}
          onFileChange={handleFileChange}
          imageError={imageError}
        />
        <TaskCardDescription
          isEditing={isEditing}
          isCreating={isCreating}
          desc={desc}
          setDesc={handleDescriptionChange}
          isMobile={isMobile}
        />
        <TaskCardActions
          isEditing={isEditing}
          isCreating={isCreating}
          isMobile={isMobile}
          onSave={isCreating ? handleCreate : handleSave}
          onCancel={handleCancelWithReset}
          onEditClick={onEditClick}
          saveDisabled={isSaveDisabled}
        />
      </Stack>
    </Card>
  );
}

// Мемоизация компонента
export const TaskCard = React.memo(TaskCardComponent);
