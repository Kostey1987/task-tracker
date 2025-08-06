import tasksUIReducer, {
  setPage,
  setStatus,
  setSearchInput,
  setSearch,
  setSortDeadline,
  setCreatingCard,
  setEditingId,
  resetFilters,
  updateSearchFromInput,
} from "./tasksUISlice";
import type { TaskStatus } from "../types/types-exports";

/**
 * Тесты для tasksUISlice редьюсера
 *
 * Этот файл содержит юнит-тесты для проверки логики управления UI состоянием:
 * - Пагинация (установка страницы)
 * - Фильтрация (статус, поиск, сортировка)
 * - Состояние создания/редактирования карточек
 * - Сброс фильтров
 * - Обновление поиска с debounce
 */
describe("tasksUISlice", () => {
  // Начальное состояние для тестов
  const initialState = {
    page: 1,
    status: null,
    searchInput: "",
    search: "",
    sortDeadline: "asc" as const,
    isCreatingCard: false,
    editingId: null,
    isSearching: false,
    lastUpdated: Date.now(),
  };

  /**
   * Тесты начального состояния
   * Проверяем, что редьюсер возвращает корректное начальное состояние
   */
  describe("initial state", () => {
    it("should return the initial state", () => {
      // Вызываем редьюсер с undefined state и неизвестным действием
      const state = tasksUIReducer(undefined, { type: "unknown" });

      // Проверяем все поля начального состояния
      expect(state.page).toBe(1);
      expect(state.status).toBeNull();
      expect(state.searchInput).toBe("");
      expect(state.search).toBe("");
      expect(state.sortDeadline).toBe("asc");
      expect(state.isCreatingCard).toBe(false);
      expect(state.editingId).toBeNull();
      expect(state.isSearching).toBe(false);
      expect(state.lastUpdated).toBeGreaterThan(0);
    });
  });

  /**
   * Тесты для действия setPage
   * Проверяем установку номера страницы и обновление временной метки
   */
  describe("setPage", () => {
    it("should set the page number", () => {
      // Вызываем редьюсер для установки страницы 3
      const state = tasksUIReducer(initialState, setPage(3));

      // Проверяем, что страница установлена и временная метка обновлена
      expect(state.page).toBe(3);
      expect(state.lastUpdated).toBeGreaterThan(0);
    });

    it("should update lastUpdated timestamp", () => {
      // Вызываем редьюсер для установки страницы 2
      const state = tasksUIReducer(initialState, setPage(2));

      // Проверяем, что временная метка обновлена
      expect(state.lastUpdated).toBeGreaterThan(0);
    });
  });

  /**
   * Тесты для действия setStatus
   * Проверяем установку статуса фильтра и сброс страницы
   */
  describe("setStatus", () => {
    it("should set status and reset page to 1", () => {
      // Вызываем редьюсер для установки статуса "completed"
      const state = tasksUIReducer(
        initialState,
        setStatus("completed" as TaskStatus)
      );

      // Проверяем, что статус установлен, страница сброшена и временная метка обновлена
      expect(state.status).toBe("completed");
      expect(state.page).toBe(1);
      expect(state.lastUpdated).toBeGreaterThan(0);
    });

    it("should handle null status", () => {
      // Подготавливаем состояние с существующим статусом и страницей
      const existingState = {
        ...initialState,
        status: "completed" as TaskStatus,
        page: 3,
      };

      // Вызываем редьюсер для сброса статуса
      const state = tasksUIReducer(existingState, setStatus(null));

      // Проверяем, что статус сброшен и страница установлена в 1
      expect(state.status).toBeNull();
      expect(state.page).toBe(1);
    });
  });

  /**
   * Тесты для действия setSearchInput
   * Проверяем установку поискового ввода и флага поиска
   */
  describe("setSearchInput", () => {
    it("should set search input and update isSearching flag", () => {
      // Вызываем редьюсер для установки поискового ввода
      const state = tasksUIReducer(initialState, setSearchInput("test search"));

      // Проверяем, что ввод установлен, флаг поиска активен и временная метка обновлена
      expect(state.searchInput).toBe("test search");
      expect(state.isSearching).toBe(true);
      expect(state.lastUpdated).toBeGreaterThan(0);
    });

    it("should set isSearching to false when input matches search", () => {
      // Подготавливаем состояние где ввод совпадает с поиском
      const existingState = {
        ...initialState,
        search: "test",
        searchInput: "test",
      };

      // Вызываем редьюсер с тем же значением
      const state = tasksUIReducer(existingState, setSearchInput("test"));

      // Проверяем, что флаг поиска отключен (нет изменений)
      expect(state.isSearching).toBe(false);
    });
  });

  /**
   * Тесты для действия setSearch
   * Проверяем установку поискового запроса и сброс страницы
   */
  describe("setSearch", () => {
    it("should set search and reset page to 1", () => {
      // Вызываем редьюсер для установки поискового запроса
      const state = tasksUIReducer(initialState, setSearch("new search"));

      // Проверяем, что поиск установлен, страница сброшена и временная метка обновлена
      expect(state.search).toBe("new search");
      expect(state.page).toBe(1);
      expect(state.lastUpdated).toBeGreaterThan(0);
    });
  });

  /**
   * Тесты для действия setSortDeadline
   * Проверяем установку сортировки по дедлайну и сброс страницы
   */
  describe("setSortDeadline", () => {
    it("should set sort deadline and reset page to 1", () => {
      // Вызываем редьюсер для установки сортировки по убыванию
      const state = tasksUIReducer(initialState, setSortDeadline("desc"));

      // Проверяем, что сортировка установлена, страница сброшена и временная метка обновлена
      expect(state.sortDeadline).toBe("desc");
      expect(state.page).toBe(1);
      expect(state.lastUpdated).toBeGreaterThan(0);
    });

    it("should handle asc sort", () => {
      // Подготавливаем состояние с сортировкой по убыванию
      const existingState = { ...initialState, sortDeadline: "desc" as const };

      // Вызываем редьюсер для изменения на сортировку по возрастанию
      const state = tasksUIReducer(existingState, setSortDeadline("asc"));

      // Проверяем, что сортировка изменена
      expect(state.sortDeadline).toBe("asc");
    });
  });

  /**
   * Тесты для действия setCreatingCard
   * Проверяем установку состояния создания карточки
   */
  describe("setCreatingCard", () => {
    it("should set creating card state", () => {
      // Вызываем редьюсер для включения режима создания карточки
      const state = tasksUIReducer(initialState, setCreatingCard(true));

      // Проверяем, что режим создания включен и временная метка обновлена
      expect(state.isCreatingCard).toBe(true);
      expect(state.lastUpdated).toBeGreaterThan(0);
    });

    it("should handle false value", () => {
      // Подготавливаем состояние с включенным режимом создания
      const existingState = { ...initialState, isCreatingCard: true };

      // Вызываем редьюсер для отключения режима создания
      const state = tasksUIReducer(existingState, setCreatingCard(false));

      // Проверяем, что режим создания отключен
      expect(state.isCreatingCard).toBe(false);
    });
  });

  /**
   * Тесты для действия setEditingId
   * Проверяем установку ID редактируемой карточки
   */
  describe("setEditingId", () => {
    it("should set editing ID", () => {
      // Вызываем редьюсер для установки ID редактирования
      const state = tasksUIReducer(initialState, setEditingId(123));

      // Проверяем, что ID установлен и временная метка обновлена
      expect(state.editingId).toBe(123);
      expect(state.lastUpdated).toBeGreaterThan(0);
    });

    it("should handle null editing ID", () => {
      // Подготавливаем состояние с активным ID редактирования
      const existingState = { ...initialState, editingId: 123 };

      // Вызываем редьюсер для сброса ID редактирования
      const state = tasksUIReducer(existingState, setEditingId(null));

      // Проверяем, что ID сброшен
      expect(state.editingId).toBeNull();
    });
  });

  /**
   * Тесты для действия resetFilters
   * Проверяем сброс всех фильтров к начальным значениям
   */
  describe("resetFilters", () => {
    it("should reset all filters to initial values", () => {
      // Подготавливаем состояние с измененными фильтрами
      const existingState = {
        ...initialState,
        page: 3,
        status: "completed" as TaskStatus,
        searchInput: "test input",
        search: "test search",
        sortDeadline: "desc" as const,
        isSearching: true,
      };

      // Вызываем редьюсер для сброса всех фильтров
      const state = tasksUIReducer(existingState, resetFilters());

      // Проверяем, что все фильтры сброшены к начальным значениям
      expect(state.page).toBe(1);
      expect(state.status).toBeNull();
      expect(state.searchInput).toBe("");
      expect(state.search).toBe("");
      expect(state.sortDeadline).toBe("asc");
      expect(state.isSearching).toBe(false);
      expect(state.lastUpdated).toBeGreaterThan(0);
    });
  });

  /**
   * Тесты для действия updateSearchFromInput
   * Проверяем обновление поиска из ввода (debounce логика)
   */
  describe("updateSearchFromInput", () => {
    it("should update search from input and reset page", () => {
      // Подготавливаем состояние с разными значениями ввода и поиска
      const existingState = {
        ...initialState,
        searchInput: "new input",
        search: "old search",
        isSearching: true,
        page: 3,
      };

      // Вызываем редьюсер для обновления поиска из ввода
      const state = tasksUIReducer(existingState, updateSearchFromInput());

      // Проверяем, что поиск обновлен, флаг поиска отключен, страница сброшена
      expect(state.search).toBe("new input");
      expect(state.isSearching).toBe(false);
      expect(state.page).toBe(1);
      expect(state.lastUpdated).toBeGreaterThan(0);
    });
  });

  /**
   * Тесты для неизвестных действий
   * Проверяем, что редьюсер корректно обрабатывает неизвестные действия
   */
  describe("unknown action", () => {
    it("should return the current state for unknown actions", () => {
      // Подготавливаем состояние с данными
      const existingState = { ...initialState, page: 5 };

      // Вызываем редьюсер с неизвестным действием
      const state = tasksUIReducer(existingState, { type: "unknown/action" });

      // Проверяем, что состояние не изменилось
      expect(state).toEqual(existingState);
    });
  });
});
