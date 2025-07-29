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
  description = "",
  status = "В работе",
  deadline = null,
  image = null,
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
  const [currentImage, setCurrentImage] = useState<string | null>(image);
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
      setCurrentImage(image);
      setDeadlineInput(
        deadline ? dayjs(deadline).format("DD.MM.YYYY HH:mm") : ""
      );
    }
  }, [description, status, image, deadline, isEditing, isCreating]);

  const validateDeadline = (value: string): string | null => {
    if (!value.trim()) return "Дедлайн обязателен";
    const parsed = dayjs(value, "DD.MM.YYYY HH:mm", true);
    if (!parsed.isValid())
      return "Неверный формат даты. Пример: 31.12.2024 23:59";
    return null;
  };

  const formatDeadlineForApi = (value: string): string | undefined => {
    const parsed = dayjs(value, "DD.MM.YYYY HH:mm", true);
    return parsed.isValid() ? parsed.format("YYYY-MM-DDTHH:mm") : undefined;
  };

  const handleSave = () => {
    const error = validateDeadline(deadlineInput);
    setDeadlineError(error);
    if (error) return;

    onChange?.({
      description: desc,
      status: currentStatus,
      deadline: formatDeadlineForApi(deadlineInput),
      ...(file ? { file } : currentImage ? { image: currentImage } : {}),
    });
  };

  const handleCreate = () => {
    const error = validateDeadline(deadlineInput);
    setDeadlineError(error);
    if (error || !desc.trim()) return;

    onChange?.({
      description: desc.trim(),
      status: currentStatus,
      deadline: deadlineInput ? formatDeadlineForApi(deadlineInput) : undefined,
      ...(file ? { file } : {}),
    });
  };

  const handleFileChange = (newFile: File | null) => {
    setImageError(null);

    if (!newFile) {
      setFile(null);
      setCurrentImage(null);
      return;
    }

    if (!newFile.type.startsWith("image/")) {
      setImageError(
        "Можно загружать только изображения (jpeg, png, webp и др.)"
      );
      return;
    }

    if (newFile.size > 5 * 1024 * 1024) {
      setImageError("Максимальный размер изображения — 5 МБ");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        if (img.width > 1920 || img.height > 1080) {
          setImageError("Максимальное разрешение — 1920x1080");
        } else {
          setFile(newFile);
          setCurrentImage(e.target?.result as string);
        }
      };
      img.onerror = () => {
        setImageError("Не удалось прочитать изображение");
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(newFile);
  };

  const handleRemoveImage = async () => {
    if (isEditing && id && onImageDeleted) {
      try {
        await deleteTaskImage(id);
        setCurrentImage(null);
        setFile(null);
        onImageDeleted();
      } catch (error) {
        setImageError("Ошибка при удалении изображения");
      }
    } else {
      setCurrentImage(null);
      setFile(null);
    }
    setImageError(null);
  };

  const getCardStyles = () => {
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
  };

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
      style={getCardStyles()}
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
            "&:hover": { opacity: 1 },
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
              onChange={(value) =>
                value && setCurrentStatus(value as TaskStatus)
              }
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
            Дедлайн: {deadlineInput || "-"}
          </Text>
        )}

        {(isCreating || isEditing) && (
          <TextInput
            label="Дедлайн"
            value={deadlineInput}
            onChange={(e) => setDeadlineInput(e.currentTarget.value)}
            placeholder="ДД.ММ.ГГГГ ЧЧ:ММ"
            error={deadlineError}
            withAsterisk
          />
        )}

        {currentImage && (
          <Stack>
            <Image
              src={
                currentImage.startsWith("/uploads/")
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
          </Stack>
        )}

        {imageError && (
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
              withAsterisk
            />

            <Group gap={isMobile ? "xs" : "md"}>
              <Button
                leftSection={<IconCheck size={16} />}
                onClick={isCreating ? handleCreate : handleSave}
                disabled={!desc.trim() || !!deadlineError}
                size={isMobile ? "sm" : "md"}
                fullWidth={isMobile}
              >
                {isCreating ? "Создать задачу" : "Сохранить"}
              </Button>

              <Button
                variant="light"
                onClick={() => {
                  setImageError(null);
                  isCreating
                    ? onChange?.({ description: "", status: "В работе" })
                    : onCancelEdit?.();
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

            {onEditClick && (
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
            )}
          </Group>
        )}
      </Stack>
    </Card>
  );
}
