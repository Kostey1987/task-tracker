import { useMemo } from "react";
import { Center, Text } from "@mantine/core";
import { TaskCard } from "../TaskCard";
import type {
  Task,
  TaskStatus,
  TasksListProps,
} from "../../types/types-exports";
import React from "react";

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
