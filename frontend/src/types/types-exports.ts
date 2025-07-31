// Главный файл типов - экспортирует все типы из проекта

// API типы
export * from "./api";

// Типы компонентов
export * from "./components";

// Типы хуков
export * from "./hooks";

// Store типы
/** Тип корневого состояния Redux store */
export type RootState = ReturnType<
  typeof import("../store/store").store.getState
>;
/** Тип dispatch функции Redux store */
export type AppDispatch = typeof import("../store/store").store.dispatch;
