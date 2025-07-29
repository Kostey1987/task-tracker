import { useCallback, useMemo } from "react";
import { TaskCard } from "../TaskCard";
import type { TaskStatus } from "../../types/index";
import type { TaskInput } from "../../types";

interface TaskCreationCardProps {
  isCreatingCard: boolean;
  handleCreate: (
    values: Partial<TaskInput> & { file?: File | null }
  ) => Promise<void>;
  handleCreateCardToggle: (value: boolean) => void;
  refetch: () => void;
}

export function TaskCreationCard({
  isCreatingCard,
  handleCreate,
  handleCreateCardToggle,
  refetch,
}: TaskCreationCardProps) {
  const handleCreateTask = useCallback(
    async (values: Partial<TaskInput> & { file?: File | null }) => {
      if (!values.description || values.description.trim() === "") {
        handleCreateCardToggle(false);
        return;
      }

      if (values.description && values.status) {
        await handleCreate(values);
        refetch();
        handleCreateCardToggle(false);
      }
    },
    [handleCreate, handleCreateCardToggle, refetch]
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
