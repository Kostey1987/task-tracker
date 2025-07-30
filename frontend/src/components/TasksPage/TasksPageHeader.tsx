import { Title, Center, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import type { TasksPageHeaderProps } from "../../types/types-exports";
import { useTasksUI } from "../../hooks/hooks-exports";

export function TasksPageHeader({ isCreating }: TasksPageHeaderProps) {
  // Получаем состояние UI из Redux
  const { isCreatingCard, handleCreateCardToggle } = useTasksUI();

  return (
    <>
      <Title order={2} ta="center" mb="md">
        Список задач
      </Title>

      <Center mb="md">
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => handleCreateCardToggle(true)}
          disabled={isCreatingCard || isCreating}
          loading={isCreating}
        >
          Новая задача
        </Button>
      </Center>
    </>
  );
}
