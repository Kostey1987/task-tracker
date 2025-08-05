import { getDb } from "../config/db";

export interface Task {
  id?: number;
  description: string;
  status?: string;
  /**
   * Дата и время дедлайна в формате YYYY-MM-DDTHH:mm (ISO 8601, без секунд)
   */
  deadline?: string;
  userId: number;
}

export async function createTask(task: Task): Promise<number> {
  const db = await getDb();
  const result = await db.run(
    "INSERT INTO tasks (description, deadline, status, user_id) VALUES (?, ?, ?, ?)",
    [
      task.description,
      task.deadline || null,
      task.status || "В работе",
      task.userId,
    ]
  );
  return result.lastID!;
}

export async function getTasks(
  userId: number,
  page: number,
  limit: number,
  status?: string | null,
  deadlineFrom?: string | null,
  deadlineTo?: string | null,
  sortDeadline?: "asc" | "desc" | null,
  search?: string | null
) {
  const db = await getDb();
  const offset = (page - 1) * limit;
  let query = "SELECT * FROM tasks WHERE user_id = ?";
  const params: any[] = [userId];
  if (status != null) {
    query += " AND status = ?";
    params.push(status);
  }
  if (deadlineFrom != null) {
    query += " AND deadline >= ?";
    params.push(deadlineFrom);
  }
  if (deadlineTo != null) {
    query += " AND deadline <= ?";
    params.push(deadlineTo);
  }
  if (search != null) {
    query += " AND description LIKE ?";
    params.push(`%${search}%`);
  }
  if (sortDeadline === "asc") {
    query += " ORDER BY deadline ASC";
  } else if (sortDeadline === "desc") {
    query += " ORDER BY deadline DESC";
  }
  query += " LIMIT ? OFFSET ?";
  params.push(limit, offset);
  const tasks = await db.all(query, params);

  // Для корректного total учитываем фильтры
  let countQuery = "SELECT COUNT(*) as count FROM tasks WHERE user_id = ?";
  const countParams: any[] = [userId];
  if (status != null) {
    countQuery += " AND status = ?";
    countParams.push(status);
  }
  if (deadlineFrom != null) {
    countQuery += " AND deadline >= ?";
    countParams.push(deadlineFrom);
  }
  if (deadlineTo != null) {
    countQuery += " AND deadline <= ?";
    countParams.push(deadlineTo);
  }
  if (search != null) {
    countQuery += " AND description LIKE ?";
    countParams.push(`%${search}%`);
  }
  const total = await db.get(countQuery, countParams);
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
