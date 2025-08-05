import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

// Конфигурация ESLint для проверки качества кода
export default tseslint.config([
  globalIgnores(["dist"]), // Игнорируем папку сборки
  {
    files: ["**/*.{ts,tsx}"], // Применяем к TypeScript файлам
    extends: [
      js.configs.recommended, // Рекомендуемые правила JavaScript
      tseslint.configs.recommended, // Рекомендуемые правила TypeScript
      reactHooks.configs["recommended-latest"], // Правила для React Hooks
      reactRefresh.configs.vite, // Правила для Vite и React Refresh
    ],
    languageOptions: {
      ecmaVersion: 2020, // Версия ECMAScript
      globals: globals.browser, // Глобальные переменные браузера
    },
  },
]);
