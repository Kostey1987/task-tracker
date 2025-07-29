import { Center, Text, Pagination } from "@mantine/core";
import { TasksList } from "./TasksList";
import { TaskCreationCard } from "./TaskCreationCard";
import type { TasksPageContentProps } from "../../types";
import { useTasksPageContent } from "../../hooks";

export function TasksPageContent({
  data,
  editingId,
  isCreatingCard,
  search,
  page,
  handleCreate,
  handleCreateCardToggle,
  handleEditIdChange,
  handleImageDeleted,
  handleEditWithTask,
  handleDeleteWithRefetch,
  handlePageChange,
  refetch,
}: TasksPageContentProps) {
  const { emptyMessage, hasTasks, showPagination } = useTasksPageContent({
    data,
    search,
  });

  return (
    <>
      <TaskCreationCard
        isCreatingCard={isCreatingCard}
        handleCreate={handleCreate}
        handleCreateCardToggle={handleCreateCardToggle}
        refetch={refetch}
      />

      {hasTasks ? (
        <TasksList
          tasks={data.tasks}
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
          total={data.totalPages}
          mt="md"
        />
      )}
    </>
  );
}
