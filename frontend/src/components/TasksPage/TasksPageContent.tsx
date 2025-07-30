import { Center, Text, Pagination } from "@mantine/core";
import { TasksList } from "./TasksList";
import { TaskCreationCard } from "./TaskCreationCard";
import type { TasksPageContentProps } from "../../types/types-exports";
import { useTasksPageContent, useTasksUI } from "../../hooks/hooks-exports";

export function TasksPageContent({
  data,
  handleCreate,
  handleImageDeleted,
  handleEditWithTask,
  handleDeleteWithRefetch,
  refetch,
}: TasksPageContentProps) {
  // Получаем состояние UI из Redux
  const {
    search,
    page,
    handlePageChange,
    handleCreateCardToggle,
    handleEditIdChange,
  } = useTasksUI();

  const { emptyMessage, hasTasks, showPagination } = useTasksPageContent({
    data,
    search,
  });

  return (
    <>
      <TaskCreationCard
        handleCreate={handleCreate}
        handleCreateCardToggle={handleCreateCardToggle}
        refetch={refetch}
      />

      {hasTasks ? (
        <TasksList
          tasks={data.tasks}
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
          total={data.totalPages}
          mt="md"
        />
      )}
    </>
  );
}
