import { useCallback } from "react";
import { TaskCard } from "../TaskCard";
import type {
  TaskStatus,
  TaskCreationCardProps,
  TaskInput,
} from "../../types/types-exports";
import { useTasksRefetch, useTasksUI } from "../../hooks/hooks-exports";

export function TaskCreationCard({
  handleCreate,
  handleCreateCardToggle,
  refetch,
}: TaskCreationCardProps) {
  // Получаем состояние UI из Redux
  const { isCreatingCard } = useTasksUI();

  const { refetchAndNotify } = useTasksRefetch({
    refetch,
    onSuccess: () => {
      handleCreateCardToggle(false);
    },
  });

  const handleCreateTask = useCallback(
    async (values: Partial<TaskInput>) => {
      if (!values.description || values.description.trim() === "") {
        handleCreateCardToggle(false);
        return;
      }

      if (values.description && values.status) {
        await handleCreate(values);
        refetchAndNotify();
      }
    },
    [handleCreate, handleCreateCardToggle, refetchAndNotify]
  );

  if (!isCreatingCard) return null;

  return (
    <TaskCard
      task={{
        id: -1,
        description: "",
        status: "В работе" as TaskStatus,
        deadline: null,
        userId: 0,
      }}
      flags={{ isCreating: true }}
      callbacks={{
        onChange: handleCreateTask,
      }}
    />
  );
}
