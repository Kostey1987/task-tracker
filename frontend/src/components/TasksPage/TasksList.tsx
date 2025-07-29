import { useMemo } from "react";
import { Center, Text } from "@mantine/core";
import { TaskCard } from "../TaskCard";
import type { Task, TaskStatus } from "../../types/index";
import type { TaskInput } from "../../types";
import React from "react";

interface TasksListProps {
  tasks: Task[];
  editingId: number | null;
  onEditClick: (id: number) => void;
  onCancelEdit: () => void;
  onImageDeleted: () => void;
  onEdit: (
    id: number,
    values: Partial<TaskInput> & { file?: File | null }
  ) => void;
  onDelete: (id: number) => void;
}

function TasksListComponent({
  tasks,
  editingId,
  onEditClick,
  onCancelEdit,
  onImageDeleted,
  onEdit,
  onDelete,
}: TasksListProps) {
  // Мемоизированный список задач
  const taskCards = useMemo(() => {
    return tasks.map((task) => (
      <TaskCard
        key={task.id}
        task={{
          ...task,
          status: task.status as TaskStatus,
        }}
        flags={{ isEditing: editingId === task.id }}
        callbacks={{
          onEditClick: () => onEditClick(task.id!),
          onCancelEdit,
          onImageDeleted,
          onChange:
            editingId === task.id
              ? async (values) => {
                  await onEdit(task.id!, values);
                }
              : undefined,
          onDelete: () => onDelete(task.id!),
        }}
      />
    ));
  }, [
    tasks,
    editingId,
    onEditClick,
    onCancelEdit,
    onImageDeleted,
    onEdit,
    onDelete,
  ]);

  if (tasks.length === 0) {
    return (
      <Center>
        <Text color="dimmed" size="lg">
          Нет задач
        </Text>
      </Center>
    );
  }

  return <>{taskCards}</>;
}

export const TasksList = React.memo(TasksListComponent);
