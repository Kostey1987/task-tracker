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

export function useTasksUI() {
  const dispatch = useDispatch();
  const tasksUI = useSelector((state: RootState) => state.tasksUI);

  // Debounce для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      if (tasksUI.searchInput !== tasksUI.search) {
        dispatch(updateSearchFromInput());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [tasksUI.searchInput, tasksUI.search, dispatch]);

  const handleStatusChange = useCallback(
    (newStatus: TaskStatus | null) => {
      dispatch(setStatus(newStatus));
    },
    [dispatch]
  );

  const handleSortChange = useCallback(
    (newSort: "asc" | "desc") => {
      dispatch(setSortDeadline(newSort));
    },
    [dispatch]
  );

  const handleSearchChange = useCallback(
    (newSearch: string) => {
      dispatch(setSearchInput(newSearch));
    },
    [dispatch]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      dispatch(setPage(newPage));
    },
    [dispatch]
  );

  const handleCreateCardToggle = useCallback(
    (isCreating: boolean) => {
      dispatch(setCreatingCard(isCreating));
    },
    [dispatch]
  );

  const handleEditIdChange = useCallback(
    (id: number | null) => {
      dispatch(setEditingId(id));
    },
    [dispatch]
  );

  return {
    // Состояние
    page: tasksUI.page,
    status: tasksUI.status,
    searchInput: tasksUI.searchInput,
    search: tasksUI.search,
    sortDeadline: tasksUI.sortDeadline,
    isCreatingCard: tasksUI.isCreatingCard,
    editingId: tasksUI.editingId,
    isSearching: tasksUI.isSearching,
    lastUpdated: tasksUI.lastUpdated,

    // Обработчики
    handleStatusChange,
    handleSortChange,
    handleSearchChange,
    handlePageChange,
    handleCreateCardToggle,
    handleEditIdChange,
  };
}
