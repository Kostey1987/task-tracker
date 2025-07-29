import { Title, Center, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import type { TasksPageHeaderProps } from "../../types/types-exports";

export function TasksPageHeader({
  isCreatingCard,
  isCreating,
  onCreateClick,
}: TasksPageHeaderProps) {
  return (
    <>
      <Title order={2} ta="center" mb="md">
        Список задач
      </Title>

      <Center mb="md">
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={onCreateClick}
          disabled={isCreatingCard || isCreating}
          loading={isCreating}
        >
          Новая задача
        </Button>
      </Center>
    </>
  );
}
