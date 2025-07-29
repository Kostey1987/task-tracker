import { useMemo, useCallback } from "react";
import { useGetTasksQuery } from "../services/tasksApi";
import { TaskCard } from "../components/TaskCard";
import { TasksFilters } from "../components/TasksPage/TasksFilters";
import { TasksList } from "../components/TasksPage/TasksList";
import type { TaskStatus } from "../types/index";
import type { TaskInput } from "../types";
import {
  Stack,
  Title,
  Loader,
  Center,
  Alert,
  Button,
  Pagination,
  Text,
} from "@mantine/core";
import { IconAlertCircle, IconPlus } from "@tabler/icons-react";
import { useTasksPageState, useTasksActions } from "../hooks";
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

  // Обработчик создания задачи
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

  // Мемоизированная карточка создания
  const createCard = useMemo(() => {
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
  }, [isCreatingCard, handleCreateTask]);

  // Оптимизированные обработчики
  const handleEditWithTask = useCallback(
    async (id: number, values: Partial<TaskInput> & { file?: File | null }) => {
      const task = data?.tasks.find((t) => t.id === id);
      if (!task) return;

      await handleEdit(id, values, task);
      refetch();
      handleEditIdChange(null);
    },
    [handleEdit, data?.tasks, refetch, handleEditIdChange]
  );

  const handleDeleteWithRefetch = useCallback(
    async (id: number) => {
      await handleDelete(id);
      refetch();
    },
    [handleDelete, refetch]
  );

  const handleImageDeleted = useCallback(() => {
    refetch();
  }, [refetch]);

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
      <Title order={2} ta="center" mb="md">
        Список задач
      </Title>

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

      {createCard}

      {hasTasks ? (
        <TasksList
          tasks={data!.tasks}
          editingId={editingId}
          onEditClick={handleEditIdChange}
          onCancelEdit={() => handleEditIdChange(null)}
          onImageDeleted={handleImageDeleted}
          onEdit={handleEditWithTask}
          onDelete={handleDeleteWithRefetch}
        />
      ) : (
        <Center>
          <Text color="dimmed" size="lg">
            {emptyMessage}
          </Text>
        </Center>
      )}

      {showPagination && (
        <Pagination
          value={page}
          onChange={handlePageChange}
          total={data!.totalPages}
          mt="md"
        />
      )}
    </Stack>
  );
}

export default React.memo(TasksPageComponent);
