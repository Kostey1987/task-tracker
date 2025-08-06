// Настройка тестового окружения
import "@testing-library/jest-dom";

// Мокаем import.meta для тестов
Object.defineProperty(window, "import", {
  value: {
    meta: {
      env: {
        VITE_API_URL: "http://localhost:3000",
        DEV: true,
        PROD: false,
        NODE_ENV: "test",
        VITE_APP_VERSION: "1.0.0",
      },
    },
  },
  writable: true,
});

// Мокаем dayjs
jest.mock("dayjs", () => {
  const originalModule = jest.requireActual("dayjs");
  return {
    ...originalModule,
    default: jest.fn((date) => ({
      format: jest.fn(() => "2024-01-01"),
      isValid: jest.fn(() => true),
      toDate: jest.fn(() => new Date("2024-01-01")),
    })),
  };
});
