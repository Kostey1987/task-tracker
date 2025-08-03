import app from "./app";
import { initDb } from "./config/db";
import dotenv from "dotenv";

// Загрузка переменных окружения
dotenv.config();

const PORT = parseInt(process.env.PORT || "5000", 10);

// Инициализация и запуск сервера
async function startServer() {
  try {
    await initDb();
    console.log("Database initialized");

    // Для локальной разработки всегда используем localhost, независимо от NODE_ENV
    const isDev = !process.env.PORT || process.env.PORT === "5000";
    const HOST = isDev ? "localhost" : process.env.HOST || "0.0.0.0";

    app.listen(PORT, HOST, () => {
      const localUrl = `http://localhost:${PORT}`;
      const serverUrl = isDev ? localUrl : `http://${HOST}:${PORT}`;

      console.log(`🚀 Server running on ${serverUrl}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
