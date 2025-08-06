import authReducer, { setCredentials, logout } from "./authSlice";
import type { AuthState } from "../types/types-exports";

/**
 * Тесты для authSlice редьюсера
 *
 * Этот файл содержит юнит-тесты для проверки логики аутентификации:
 * - Установка учетных данных (токенов)
 * - Выход из системы (очистка токенов)
 * - Обработка начального состояния
 * - Обработка неизвестных действий
 */
describe("authSlice", () => {
  // Начальное состояние для тестов
  const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
  };

  /**
   * Тесты начального состояния
   * Проверяем, что редьюсер возвращает корректное начальное состояние
   */
  describe("initial state", () => {
    it("should return the initial state", () => {
      // Вызываем редьюсер с undefined state и неизвестным действием
      const state = authReducer(undefined, { type: "unknown" });
      // Проверяем, что вернулось начальное состояние
      expect(state).toEqual(initialState);
    });
  });

  /**
   * Тесты для действия setCredentials
   * Проверяем установку и обновление токенов аутентификации
   */
  describe("setCredentials", () => {
    it("should handle setting credentials", () => {
      // Подготавливаем тестовые данные
      const credentials = {
        accessToken: "test-access-token",
        refreshToken: "test-refresh-token",
      };

      // Вызываем редьюсер с действием setCredentials
      const state = authReducer(initialState, setCredentials(credentials));

      // Проверяем, что токены установлены корректно
      expect(state.accessToken).toBe(credentials.accessToken);
      expect(state.refreshToken).toBe(credentials.refreshToken);
    });

    it("should update existing credentials", () => {
      // Подготавливаем состояние с существующими токенами
      const existingState: AuthState = {
        accessToken: "old-access-token",
        refreshToken: "old-refresh-token",
      };

      // Новые токены для обновления
      const newCredentials = {
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      };

      // Вызываем редьюсер для обновления токенов
      const state = authReducer(existingState, setCredentials(newCredentials));

      // Проверяем, что токены обновлены
      expect(state.accessToken).toBe(newCredentials.accessToken);
      expect(state.refreshToken).toBe(newCredentials.refreshToken);
    });
  });

  /**
   * Тесты для действия logout
   * Проверяем очистку токенов при выходе из системы
   */
  describe("logout", () => {
    it("should clear all tokens on logout", () => {
      // Подготавливаем состояние с активными токенами
      const existingState: AuthState = {
        accessToken: "test-access-token",
        refreshToken: "test-refresh-token",
      };

      // Вызываем редьюсер с действием logout
      const state = authReducer(existingState, logout());

      // Проверяем, что все токены очищены
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
    });

    it("should handle logout when already logged out", () => {
      // Вызываем logout когда уже не авторизованы
      const state = authReducer(initialState, logout());

      // Проверяем, что токены остаются null
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
    });
  });

  /**
   * Тесты для неизвестных действий
   * Проверяем, что редьюсер корректно обрабатывает неизвестные действия
   */
  describe("unknown action", () => {
    it("should return the current state for unknown actions", () => {
      // Подготавливаем состояние с данными
      const existingState: AuthState = {
        accessToken: "test-token",
        refreshToken: "test-refresh",
      };

      // Вызываем редьюсер с неизвестным действием
      const state = authReducer(existingState, { type: "unknown/action" });

      // Проверяем, что состояние не изменилось
      expect(state).toEqual(existingState);
    });
  });
});
