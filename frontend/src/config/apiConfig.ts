import { ENV_CONFIG } from "./environment";

// Конфигурация API
export const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API_URL,
} as const;
