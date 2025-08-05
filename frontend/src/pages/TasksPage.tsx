import { useCallback } from "react";
import { useGetTasksQuery } from "../services/tasksApi";
import {
  TasksFilters,
  TasksPageHeader,
  TasksPageContent,
} from "../components/TasksPage/tasks-page-exports";
import type { TaskInput, GetTasksResponse } from "../types/types-exports";
import { Stack, Loader, Center, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import {
  useTasksActions,
  useTasksRefetch,
  useTasksUI,
} from "../hooks/hooks-exports";
import React from "react";

function TasksPageComponent() {
  // Хук для управления состоянием UI из Redux
  const { page, status, search, sortDeadline, handleEditIdChange } =
    useTasksUI();

  // Хук для управления задачами
  const { handleCreate, handleEdit, handleDelete, isCreating } =
    useTasksActions({
      onError: (error) => {
        console.error("Ошибка операции с задачей:", error);
      },
    });

  // Запрос данных
  const { data, isLoading, error, refetch } = useGetTasksQuery({
    page,
    limit: 5,
    status: status || null,
    search: search || null,
    sortDeadline: sortDeadline,
  });

  // Хук для централизованного управления refetch
  const { refetchAndNotify } = useTasksRefetch({
    refetch,
    onSuccess: () => {
      handleEditIdChange(null);
    },
  });

  // Оптимизированные обработчики
  const handleEditWithTask = useCallback(
    async (id: number, values: Partial<TaskInput>) => {
      const task = data?.tasks.find((t) => t.id === id);
      if (!task) return;

      await handleEdit(id, values, task);
      refetchAndNotify();
    },
    [handleEdit, data?.tasks, refetchAndNotify]
  );

  const handleDeleteWithRefetch = useCallback(
    async (id: number) => {
      await handleDelete(id);
      refetchAndNotify();
    },
    [handleDelete, refetchAndNotify]
  );



  // Состояния загрузки
  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red">
        Ошибка загрузки задач
      </Alert>
    );
  }

  return (
    <Stack
      p="xl"
      maw={700}
      mx="auto"
      bg="var(--mantine-color-white)"
      style={{
        borderRadius: "var(--mantine-radius-md)",
        boxShadow: "var(--mantine-shadow-sm)",
      }}
    >
      <TasksPageHeader isCreating={isCreating} />

      <Center mb="md">
        <TasksFilters />
      </Center>

      <TasksPageContent
        data={data as GetTasksResponse}
        handleCreate={handleCreate}
        handleEditWithTask={handleEditWithTask}
        handleDeleteWithRefetch={handleDeleteWithRefetch}
        refetch={refetch}
      />
    </Stack>
  );
}

export default React.memo(TasksPageComponent);
