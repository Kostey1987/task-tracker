import { useMemo, useCallback } from "react";
import { useGetTasksQuery } from "../services/tasksApi";
import {
  TasksFilters,
  TasksPageHeader,
  TasksPageContent,
} from "../components/TasksPage";
import type { TaskInput } from "../types";
import { Stack, Loader, Center, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useTasksPageState, useTasksActions, useTasksRefetch } from "../hooks";
import React from "react";

function TasksPageComponent() {
  // Хук для управления состоянием страницы
  const {
    page,
    limit,
    status,
    searchInput,
    search,
    sortDeadline,
    isCreatingCard,
    editingId,
    handleStatusChange,
    handleSortChange,
    handleSearchChange,
    handlePageChange,
    handleCreateCardToggle,
    handleEditIdChange,
  } = useTasksPageState();

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
    limit,
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
    async (id: number, values: Partial<TaskInput> & { file?: File | null }) => {
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

  const handleImageDeleted = useCallback(() => {
    refetchAndNotify();
  }, [refetchAndNotify]);

  // Мемоизированные вычисления
  const isSearching = useMemo(() => {
    return searchInput !== search;
  }, [searchInput, search]);

  const emptyMessage = useMemo(() => {
    if (search) {
      return `Задачи по запросу "${search}" не найдены`;
    }
    return "Нет задач";
  }, [search]);

  const hasTasks = useMemo(() => {
    return Boolean(data?.tasks.length);
  }, [data?.tasks.length]);

  const showPagination = useMemo(() => {
    return Boolean(data && data.totalPages > 1);
  }, [data?.totalPages]);

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
      <TasksPageHeader
        isCreatingCard={isCreatingCard}
        isCreating={isCreating}
        onCreateClick={() => handleCreateCardToggle(true)}
      />

      <Center mb="md">
        <TasksFilters
          status={status}
          searchInput={searchInput}
          sortDeadline={sortDeadline}
          onStatusChange={handleStatusChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          isSearching={isSearching}
        />
      </Center>

      <TasksPageContent
        data={data!}
        editingId={editingId}
        isCreatingCard={isCreatingCard}
        hasTasks={hasTasks}
        showPagination={showPagination}
        page={page}
        emptyMessage={emptyMessage}
        handleCreate={handleCreate}
        handleCreateCardToggle={handleCreateCardToggle}
        handleEditIdChange={handleEditIdChange}
        handleImageDeleted={handleImageDeleted}
        handleEditWithTask={handleEditWithTask}
        handleDeleteWithRefetch={handleDeleteWithRefetch}
        handlePageChange={handlePageChange}
        refetch={refetch}
      />
    </Stack>
  );
}

export default React.memo(TasksPageComponent);
