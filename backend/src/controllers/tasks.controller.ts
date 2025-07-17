import {
  Task,
  createTask as createTaskModel,
  getTasks as getTasksModel,
  updateTask as updateTaskModel,
  deleteTask as deleteTaskModel,
  removeTaskImage as removeTaskImageModel,
} from "../models/task.model";
import fs from "fs";

export const createTask = async (task: Task) => {
  return createTaskModel(task);
};

export const getTasks = async (
  userId: number,
  page: number,
  limit: number,
  status?: string
) => {
  return getTasksModel(userId, page, limit, status);
};

export const updateTask = async (taskId: number, updates: Partial<Task>) => {
  return updateTaskModel(taskId, updates);
};

export const deleteTask = async (taskId: number) => {
  return deleteTaskModel(taskId);
};

export const removeTaskImage = async (taskId: number) => {
  const imagePath = await removeTaskImageModel(taskId);
  if (imagePath) {
    const absPath = `backend${imagePath.replace("/", "\\")}`;
    if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
  }
};

export const updateTaskImage = async (taskId: number, newImagePath: string) => {
  // Удалить старое изображение, если есть
  const oldImage = await removeTaskImageModel(taskId);
  if (oldImage) {
    const absPath = `backend${oldImage.replace("/", "\\")}`;
    if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
  }
  // Обновить поле image новым путём
  const db = await (await import("../config/db")).getDb();
  await db.run("UPDATE tasks SET image = ? WHERE id = ?", [
    newImagePath,
    taskId,
  ]);
};
