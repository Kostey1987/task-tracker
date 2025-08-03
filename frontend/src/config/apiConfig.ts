import { ENV_CONFIG } from "./environment";

// Конфигурация API
export const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API_URL,
} as const;

// Функция для получения полного URL изображения
export function getImageUrl(imagePath: string): string {
  if (!imagePath) return "";

  // Если путь уже полный URL, возвращаем как есть
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Если путь начинается с /uploads/, добавляем базовый URL
  if (imagePath.startsWith("/uploads/")) {
    return `${API_CONFIG.BASE_URL}${imagePath}`;
  }

  // В остальных случаях возвращаем как есть
  return imagePath;
}
