import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// Конфигурация Vite для сборки проекта
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        // Ручное разделение кода на чанки для оптимизации размера бандла
        manualChunks: {
          vendor: ["react", "react-dom"], // Основные React библиотеки
          mantine: [
            "@mantine/core",
            "@mantine/hooks",
            "@mantine/form",
            "@mantine/dates",
          ], // UI библиотека Mantine
          redux: ["@reduxjs/toolkit", "react-redux", "redux-persist"], // Redux и связанные библиотеки
          router: ["react-router-dom"], // Маршрутизация
          icons: ["react-icons"], // Иконки
          utils: ["dayjs", "react-hook-form", "@hookform/resolvers"], // Утилиты и формы
        },
      },
    },
  },
});
