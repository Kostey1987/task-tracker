import { Button, Group } from "@mantine/core";
import { IconCheck, IconEdit } from "@tabler/icons-react";

interface TaskCardActionsProps {
  isEditing: boolean;
  isCreating: boolean;
  isMobile: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEditClick?: () => void;
  saveDisabled?: boolean;
}

export function TaskCardActions({
  isEditing,
  isCreating,
  isMobile,
  onSave,
  onCancel,
  onEditClick,
  saveDisabled,
}: TaskCardActionsProps) {
  if (isCreating || isEditing) {
    return (
      <Group gap={isMobile ? "xs" : "md"}>
        <Button
          leftSection={<IconCheck size={16} />}
          onClick={onSave}
          disabled={saveDisabled}
          size={isMobile ? "sm" : "md"}
          fullWidth={isMobile}
        >
          {isCreating ? "Создать задачу" : "Сохранить"}
        </Button>
        <Button
          variant="light"
          onClick={onCancel}
          size={isMobile ? "sm" : "md"}
          fullWidth={isMobile}
        >
          Отмена
        </Button>
      </Group>
    );
  }
  return onEditClick ? (
    <Button
      variant="subtle"
      color="yellow"
      size={isMobile ? "xs" : "sm"}
      leftSection={<IconEdit size={isMobile ? 14 : 16} />}
      onClick={onEditClick}
    >
      {isMobile ? "Изменить" : "Редактировать"}
    </Button>
  ) : null;
}
