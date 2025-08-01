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

    const HOST = process.env.HOST || "0.0.0.0";

    app.listen(PORT, HOST, () => {
      const isDev = process.env.NODE_ENV !== "production";
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
