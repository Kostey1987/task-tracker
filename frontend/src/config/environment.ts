// Конфигурация окружений
export const ENV_CONFIG = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:5000",

  // Environment
  NODE_ENV: import.meta.env.NODE_ENV || "development",
  IS_DEVELOPMENT: import.meta.env.NODE_ENV === "development",
  IS_PRODUCTION: import.meta.env.NODE_ENV === "production",

  // App Configuration
  APP_NAME: "Task Tracker",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
} as const;

// Валидация конфигурации
export function validateConfig() {
  const requiredVars = ["VITE_API_URL"];
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
