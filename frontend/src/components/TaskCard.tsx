import { useState, useEffect } from "react";
import {
  Card,
  Text,
  Button,
  Select,
  Group,
  Stack,
  Textarea,
  Image,
  FileButton,
  Badge,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconEdit,
  IconCheck,
  IconPhoto,
  IconTrash,
  IconClock,
  IconCircleCheck,
  IconAlertTriangle,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useDeleteTaskImageMutation } from "../services/tasksApi";
import type { TaskStatus, TaskCardProps } from "../types/index";

export function TaskCard({
  id,
  description,
  status,
  deadline,
  image,
  onChange,
  isCreating = false,
  onDelete,
  isEditing = false,
  onEditClick,
  onCancelEdit,
  onImageDeleted,
}: TaskCardProps) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [desc, setDesc] = useState(description);
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(status);
  const [currentImage, setCurrentImage] = useState<string | undefined>(image);
  const [file, setFile] = useState<File | null>(null);
  const [deadlineInput, setDeadlineInput] = useState(
    deadline ? dayjs(deadline).format("DD.MM.YYYY HH:mm") : ""
  );
  const [deadlineError, setDeadlineError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [deleteTaskImage] = useDeleteTaskImageMutation();

  useEffect(() => {
    if (!isEditing && !isCreating) {
      setDesc(description);
      setCurrentStatus(status);
      if (image && image.startsWith("/uploads/")) {
        setCurrentImage(image);
      } else {
        setCurrentImage(undefined);
      }
      setDeadlineInput(
        deadline ? dayjs(deadline).format("DD.MM.YYYY HH:mm") : ""
      );
    }
  }, [description, status, image, deadline, isEditing, isCreating]);

  const validateDeadline = (value: string) => {
    if (!value) return "Дедлайн обязателен";
    const parsed = dayjs(value, "DD.MM.YYYY HH:mm", true);
    if (!parsed.isValid())
      return "Неверный формат даты. Пример: 31.12.2024 23:59";
    return null;
  };

  const formatDeadlineForApi = (value: string) => {
    const parsed = dayjs(value, "DD.MM.YYYY HH:mm", true);
    return parsed.isValid() ? parsed.format("YYYY-MM-DDTHH:mm") : undefined;
  };

  const handleSave = () => {
    const error = validateDeadline(deadlineInput);
    setDeadlineError(error);
    if (error) return;
    setImageError(null);
    onChange?.({
      description: desc,
      status: currentStatus,
      deadline: formatDeadlineForApi(deadlineInput),
      ...(file ? { file } : { image: currentImage }),
    });
  };

  const handleCreate = () => {
    const error = validateDeadline(deadlineInput);
    setDeadlineError(error);
    if (error) return;
    if (desc.trim()) {
      setImageError(null);
      onChange?.({
        description: desc.trim(),
        status: currentStatus,
        deadline: deadlineInput
          ? formatDeadlineForApi(deadlineInput)
          : undefined,
        ...(file ? { file } : { image: currentImage }),
      });
    }
  };

  const handleFileChange = (file: File | null) => {
    setImageError(null);
    if (!file) {
      setFile(null);
      setCurrentImage(undefined);
      return;
    }
    // Проверка типа
    if (!file.type.startsWith("image/")) {
      setImageError(
        "Можно загружать только изображения (jpeg, png, webp и др.)"
      );
      return;
    }
    // Проверка размера
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Максимальный размер изображения — 5 МБ");
      return;
    }
    // Проверка разрешения
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        if (img.width > 1920 || img.height > 1080) {
          setImageError("Максимальное разрешение — 1920x1080");
          setFile(null);
          setCurrentImage(undefined);
        } else {
          setFile(file);
          setCurrentImage(e.target?.result as string);
        }
      };
      img.onerror = () => {
        setImageError("Не удалось прочитать изображение");
        setFile(null);
        setCurrentImage(undefined);
      };
      if (typeof e.target?.result === "string") {
        img.src = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = async () => {
    if (isEditing && onImageDeleted && typeof onImageDeleted === "function") {
      // В режиме редактирования — удаляем на сервере
      if (id) {
        await deleteTaskImage(id);
        setCurrentImage(undefined);
        setFile(null);
        setImageError(null);
        onImageDeleted();
      }
    } else {
      setCurrentImage(undefined);
      setFile(null);
      setImageError(null);
    }
  };

  // Функция для определения стилей карточки в зависимости от статуса
  const getCardStyles = () => {
    switch (currentStatus) {
      case "Готово":
        return {
          borderColor: "var(--mantine-color-green-4)",
          borderWidth: 2,
          backgroundColor: "var(--mantine-color-green-0)",
        };
      case "Просрочено":
        return {
          borderColor: "var(--mantine-color-red-4)",
          borderWidth: 2,
          backgroundColor: "var(--mantine-color-red-0)",
        };
      case "В работе":
      default:
        return {
          borderColor: "var(--mantine-color-yellow-4)",
          borderWidth: 2,
          backgroundColor: "var(--mantine-color-yellow-0)",
        };
    }
  };

  // Функция для получения иконки статуса
  const getStatusIcon = () => {
    switch (currentStatus) {
      case "Готово":
        return <IconCircleCheck size={16} />;
      case "Просрочено":
        return <IconAlertTriangle size={16} />;
      case "В работе":
      default:
        return <IconClock size={16} />;
    }
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      pos="relative"
      style={{
        ...getCardStyles(),
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "var(--mantine-shadow-lg)",
        },
      }}
    >
      {onDelete && (
        <Button
          variant="subtle"
          color="red"
          size="xs"
          pos="absolute"
          top={8}
          right={8}
          style={{
            zIndex: 3,
            opacity: 0.7,
            transition: "opacity 0.2s ease",
            "&:hover": {
              opacity: 1,
            },
          }}
          onClick={onDelete}
        >
          <IconTrash size={18} />
        </Button>
      )}
      <Stack>
        <Group justify="space-between">
          <Badge
            color={
              currentStatus === "Готово"
                ? "green"
                : currentStatus === "Просрочено"
                ? "red"
                : "yellow"
            }
            leftSection={getStatusIcon()}
          >
            {currentStatus}
          </Badge>
          {(isCreating || isEditing) && (
            <Select
              data={["В работе", "Готово", "Просрочено"]}
              value={currentStatus}
              onChange={(value) => {
                if (value) setCurrentStatus(value as TaskStatus);
              }}
              allowDeselect={false}
              size="xs"
              w={130}
              mr={50}
            />
          )}
        </Group>
        {!(isCreating || isEditing) && (
          <Text
            color={
              currentStatus === "Просрочено"
                ? "red"
                : currentStatus === "Готово"
                ? "green"
                : "dimmed"
            }
            size="sm"
            fw={currentStatus === "Просрочено" ? 600 : 400}
          >
            Дедлайн:{" "}
            {deadline ? dayjs(deadline).format("DD.MM.YYYY HH:mm") : "-"}
          </Text>
        )}
        {(isCreating || isEditing) && (
          <TextInput
            label="Дедлайн"
            value={deadlineInput}
            onChange={(e) => setDeadlineInput(e.currentTarget.value)}
            placeholder="ДД.ММ.ГГГГ ЧЧ:ММ"
            error={deadlineError}
            withAsterisk={true}
          />
        )}
        {currentImage && (
          <Stack>
            <Image
              src={
                currentImage && currentImage.startsWith("/uploads/")
                  ? `http://localhost:5000${currentImage}`
                  : currentImage
              }
              alt="Task"
              radius="md"
              height={180}
              fit="contain"
            />
            {(isCreating || isEditing) && (
              <Button
                variant="light"
                color="red"
                size="xs"
                leftSection={<IconTrash size={16} />}
                onClick={handleRemoveImage}
              >
                Удалить изображение
              </Button>
            )}
            {imageError && (
              <Text color="red" size="sm">
                {imageError}
              </Text>
            )}
          </Stack>
        )}
        {!currentImage && (isCreating || isEditing) && imageError && (
          <Text color="red" size="sm" ta="center">
            {imageError}
          </Text>
        )}
        {(isCreating || isEditing) && (
          <FileButton onChange={handleFileChange} accept="image/*">
            {(props) => (
              <Button
                variant="light"
                {...props}
                leftSection={<IconPhoto size={16} />}
                onBlur={() => {
                  if (!isCreating && !isEditing) return;
                }}
              >
                {currentImage
                  ? "Заменить изображение"
                  : "Прикрепить изображение"}
              </Button>
            )}
          </FileButton>
        )}
        {isCreating || isEditing ? (
          <>
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.currentTarget.value)}
              autosize
              minRows={2}
              maxRows={6}
              placeholder="Введите описание задачи..."
            />
            <Group gap={isMobile ? "xs" : "md"}>
              <Button
                leftSection={<IconCheck size={16} />}
                onClick={isCreating ? handleCreate : handleSave}
                disabled={!desc.trim() || !!imageError}
                size={isMobile ? "sm" : "md"}
                fullWidth={isMobile}
              >
                {isCreating ? "Создать задачу" : "Сохранить"}
              </Button>
              <Button
                variant="light"
                onClick={() => {
                  setImageError(null);
                  if (isCreating) {
                    onChange?.({ description: "", status: "В работе" });
                  } else {
                    onCancelEdit && onCancelEdit();
                  }
                }}
                size={isMobile ? "sm" : "md"}
                fullWidth={isMobile}
              >
                Отмена
              </Button>
            </Group>
          </>
        ) : (
          <Group justify="space-between" gap={isMobile ? "xs" : "md"}>
            <Text
              styles={{
                root: {
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  maxHeight: 180,
                  overflow: "auto",
                },
              }}
              size={isMobile ? "sm" : "md"}
            >
              {desc}
            </Text>
            <Button
              variant="subtle"
              color={
                currentStatus === "Просрочено"
                  ? "red"
                  : currentStatus === "Готово"
                  ? "green"
                  : "yellow"
              }
              size={isMobile ? "xs" : "sm"}
              leftSection={<IconEdit size={isMobile ? 14 : 16} />}
              onClick={onEditClick}
            >
              {isMobile ? "Изменить" : "Редактировать"}
            </Button>
          </Group>
        )}
      </Stack>
    </Card>
  );
}
