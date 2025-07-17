import app from "./app";
import { initDb } from "./config/db";
import dotenv from "dotenv";

// Загрузка переменных окружения
dotenv.config();

const PORT = process.env.PORT || 5000;

// Инициализация и запуск сервера
async function startServer() {
  try {
    await initDb();
    console.log("Database initialized");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
