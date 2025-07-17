import { getDb } from "../config/db";

export interface Task {
  id?: number;
  description: string;
  status?: string;
  deadline?: string;
  image?: string;
  userId: number;
}

export async function createTask(task: Task): Promise<number> {
  const db = await getDb();
  const result = await db.run(
    "INSERT INTO tasks (description, deadline, status, image, user_id) VALUES (?, ?, ?, ?, ?)",
    [
      task.description,
      task.deadline || null,
      task.status || "В работе",
      task.image || null,
      task.userId,
    ]
  );
  return result.lastID!;
}

export async function getTasks(
  userId: number,
  page: number,
  limit: number,
  status?: string
) {
  const db = await getDb();
  const offset = (page - 1) * limit;
  let query = "SELECT * FROM tasks WHERE user_id = ?";
  const params: any[] = [userId];
  if (status) {
    query += " AND status = ?";
    params.push(status);
  }
  query += " LIMIT ? OFFSET ?";
  params.push(limit, offset);
  const tasks = await db.all(query, params);
  const total = await db.get(
    "SELECT COUNT(*) as count FROM tasks WHERE user_id = ?",
    [userId]
  );
  return {
    tasks,
    total: total.count,
    page,
    totalPages: Math.ceil(total.count / limit),
  };
}

export async function updateTask(taskId: number, updates: Partial<Task>) {
  const db = await getDb();
  const fields = [];
  const values = [];
  if (updates.description) {
    fields.push("description = ?");
    values.push(updates.description);
  }
  if (updates.status) {
    fields.push("status = ?");
    values.push(updates.status);
  }
  if (updates.deadline) {
    fields.push("deadline = ?");
    values.push(updates.deadline);
  }
  if (fields.length === 0) throw new Error("No fields to update");
  values.push(taskId);
  await db.run(`UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`, values);
}

export async function deleteTask(taskId: number) {
  const db = await getDb();
  await db.run("DELETE FROM tasks WHERE id = ?", [taskId]);
}

export async function removeTaskImage(taskId: number): Promise<string | null> {
  const db = await getDb();
  const task = await db.get("SELECT image FROM tasks WHERE id = ?", [taskId]);
  if (!task || !task.image) return null;
  await db.run("UPDATE tasks SET image = NULL WHERE id = ?", [taskId]);
  return task.image;
}
