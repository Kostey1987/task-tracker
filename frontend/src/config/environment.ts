// Конфигурация окружений
// Определяем API URL в зависимости от окружения
function getApiUrl(): string {
  // Если указан VITE_API_URL, используем его
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // В development используем localhost
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }

  // В production используем относительный путь (тот же домен)
  return "/api";
}

export const ENV_CONFIG = {
  // API Configuration
  API_URL: getApiUrl(),

  // Environment
  NODE_ENV: import.meta.env.NODE_ENV || "development",
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,

  // App Configuration
  APP_NAME: "Task Tracker",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
} as const;

// Валидация конфигурации
export function validateConfig() {
  // VITE_API_URL не является обязательной, так как есть значение по умолчанию
  const requiredVars: string[] = [];
  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    console.warn(
      `Missing environment variables: ${missingVars.join(
        ", "
      )}. Using defaults.`
    );
  }
}

// Инициализация конфигурации
validateConfig();
