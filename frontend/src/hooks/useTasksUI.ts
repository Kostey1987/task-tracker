import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPage,
  setStatus,
  setSearchInput,
  setSortDeadline,
  setCreatingCard,
  setEditingId,
  updateSearchFromInput,
} from "../store/tasksUISlice";
import type { RootState, TaskStatus } from "../types/types-exports";

// Хук-адаптер между Redux-слайсом UI задач и компонентами.
// Возвращает снимок состояния UI и набор обработчиков, инкапсулируя dispatch.
export function useTasksUI() {
  const dispatch = useDispatch();
  const tasksUI = useSelector((state: RootState) => state.tasksUI);

  // Debounce для поиска: переносим значение из searchInput в search
  // (фиксируем запрос) спустя 500 мс бездействия; страница сбрасывается в слайсе
  useEffect(() => {
    const timer = setTimeout(() => {
      if (tasksUI.searchInput !== tasksUI.search) {
        dispatch(updateSearchFromInput());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [tasksUI.searchInput, tasksUI.search, dispatch]);

  // Смена статуса фильтра задач
  const handleStatusChange = useCallback(
    (newStatus: TaskStatus | null) => {
      dispatch(setStatus(newStatus));
    },
    [dispatch]
  );

  // Смена сортировки по дедлайну
  const handleSortChange = useCallback(
    (newSort: "asc" | "desc") => {
      dispatch(setSortDeadline(newSort));
    },
    [dispatch]
  );

  // Изменение текстового ввода поиска (debounce применится выше)
  const handleSearchChange = useCallback(
    (newSearch: string) => {
      dispatch(setSearchInput(newSearch));
    },
    [dispatch]
  );

  // Переход на другую страницу
  const handlePageChange = useCallback(
    (newPage: number) => {
      dispatch(setPage(newPage));
    },
    [dispatch]
  );

  // Включить/выключить режим создания карточки
  const handleCreateCardToggle = useCallback(
    (isCreating: boolean) => {
      dispatch(setCreatingCard(isCreating));
    },
    [dispatch]
  );

  // Установить id редактируемой карточки (или null, чтобы выйти из режима)
  const handleEditIdChange = useCallback(
    (id: number | null) => {
      dispatch(setEditingId(id));
    },
    [dispatch]
  );

  return {
    // Состояние UI задач из Redux
    page: tasksUI.page,
    status: tasksUI.status,
    searchInput: tasksUI.searchInput,
    search: tasksUI.search,
    sortDeadline: tasksUI.sortDeadline,
    isCreatingCard: tasksUI.isCreatingCard,
    editingId: tasksUI.editingId,
    isSearching: tasksUI.isSearching,
    lastUpdated: tasksUI.lastUpdated,

    // Обработчики действий UI
    handleStatusChange,
    handleSortChange,
    handleSearchChange,
    handlePageChange,
    handleCreateCardToggle,
    handleEditIdChange,
  };
}
