import { Center, Text, Pagination } from "@mantine/core";
import { TasksList } from "./TasksList";
import { TaskCreationCard } from "./TaskCreationCard";
import type { GetTasksResponse, TaskInput } from "../../types";
import { useTasksPageContent } from "../../hooks";

interface TasksPageContentProps {
  data: GetTasksResponse;
  editingId: number | null;
  isCreatingCard: boolean;
  search: string | null;
  page: number;
  handleCreate: (
    values: Partial<TaskInput> & { file?: File | null }
  ) => Promise<void>;
  handleCreateCardToggle: (value: boolean) => void;
  handleEditIdChange: (id: number | null) => void;
  handleImageDeleted: () => void;
  handleEditWithTask: (
    id: number,
    values: Partial<TaskInput> & { file?: File | null }
  ) => Promise<void>;
  handleDeleteWithRefetch: (id: number) => Promise<void>;
  handlePageChange: (page: number) => void;
  refetch: () => void;
}

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
