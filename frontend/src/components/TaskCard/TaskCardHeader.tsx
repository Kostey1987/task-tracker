import { Badge, Button, Select, Group } from "@mantine/core";
import {
  IconTrash,
  IconCircleCheck,
  IconAlertTriangle,
  IconClock,
} from "@tabler/icons-react";
import type { TaskStatus } from "../../types/index";

interface TaskCardHeaderProps {
  currentStatus: TaskStatus;
  isEditing: boolean;
  isCreating: boolean;
  setCurrentStatus: (status: TaskStatus) => void;
  onDelete?: () => void;
}

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case "Готово":
      return <IconCircleCheck size={16} />;
    case "Просрочено":
      return <IconAlertTriangle size={16} />;
    case "В работе":
    default:
      return <IconClock size={16} />;
  }
};

export function TaskCardHeader({
  currentStatus,
  isEditing,
  isCreating,
  setCurrentStatus,
  onDelete,
}: TaskCardHeaderProps) {
  return (
    <Group justify="space-between">
      <Badge
        color={
          currentStatus === "Готово"
            ? "green"
            : currentStatus === "Просрочено"
            ? "red"
            : "yellow"
        }
        leftSection={getStatusIcon(currentStatus)}
      >
        {currentStatus}
      </Badge>
      {(isCreating || isEditing) && (
        <Select
          data={["В работе", "Готово", "Просрочено"]}
          value={currentStatus}
          onChange={(value) => value && setCurrentStatus(value as TaskStatus)}
          allowDeselect={false}
          size="xs"
          w={130}
          mr={50}
        />
      )}
      {onDelete && (
        <Button
          variant="subtle"
          color="red"
          size="xs"
          pos="absolute"
          top={8}
          right={8}
          style={{ zIndex: 3, opacity: 0.7, transition: "opacity 0.2s ease" }}
          onClick={onDelete}
        >
          <IconTrash size={18} />
        </Button>
      )}
    </Group>
  );
}
