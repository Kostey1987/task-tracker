import { useCallback } from "react";
import { TaskCard } from "../TaskCard";
import type { TaskStatus, TaskCreationCardProps } from "../../types";
import { useTasksRefetch } from "../../hooks";

export function TaskCreationCard({
  isCreatingCard,
  handleCreate,
  handleCreateCardToggle,
  refetch,
}: TaskCreationCardProps) {
  const { refetchAndNotify } = useTasksRefetch({
    refetch,
    onSuccess: () => {
      handleCreateCardToggle(false);
    },
  });

  const handleCreateTask = useCallback(
    async (values: Partial<TaskInput> & { file?: File | null }) => {
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
        image: null,
        userId: 0,
      }}
      flags={{ isCreating: true }}
      callbacks={{
        onChange: handleCreateTask,
      }}
    />
  );
}
