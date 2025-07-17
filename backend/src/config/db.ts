import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

// Подключение к базе данных
export async function getDb() {
  return open({
    filename: path.resolve(__dirname, "../../database.db"),
    driver: sqlite3.Database,
  });
}

// Инициализация таблиц
export async function initDb() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      refresh_token TEXT
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      status TEXT CHECK(status IN ('В работе', 'Готово', 'Просрочено')) DEFAULT 'В работе',
      deadline TEXT,
      image TEXT,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);
}
