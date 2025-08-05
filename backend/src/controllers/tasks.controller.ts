import {
  Task,
  createTask as createTaskModel,
  getTasks as getTasksModel,
  updateTask as updateTaskModel,
  deleteTask as deleteTaskModel,
} from "../models/task.model";

export const createTask = async (task: Task) => {
  return createTaskModel(task);
};

export const getTasks = async (
  userId: number,
  page: number,
  limit: number,
  status?: string | null,
  deadlineFrom?: string | null,
  deadlineTo?: string | null,
  sortDeadline?: "asc" | "desc" | null,
  search?: string | null
) => {
  return getTasksModel(
    userId,
    page,
    limit,
    status || null,
    deadlineFrom || null,
    deadlineTo || null,
    sortDeadline || null,
    search
  );
};

export const updateTask = async (taskId: number, updates: Partial<Task>) => {
  return updateTaskModel(taskId, updates);
};

export const deleteTask = async (taskId: number) => {
  return deleteTaskModel(taskId);
};
