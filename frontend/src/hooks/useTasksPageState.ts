import { useState, useEffect, useCallback } from "react";
import type { TaskStatus } from "../types/index";

interface UseTasksPageStateProps {
  onFiltersChange?: (filters: {
    page: number;
    status: TaskStatus | null;
    search: string;
    sortDeadline: "asc" | "desc";
  }) => void;
}

export function useTasksPageState({
  onFiltersChange,
}: UseTasksPageStateProps = {}) {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortDeadline, setSortDeadline] = useState<"asc" | "desc">("asc");
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Debounce для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Сброс страницы при изменении поиска или фильтров
  useEffect(() => {
    setPage(1);
  }, [search, status, sortDeadline]);

  // Уведомление об изменении фильтров
  useEffect(() => {
    onFiltersChange?.({
      page,
      status,
      search,
      sortDeadline,
    });
  }, [page, status, search, sortDeadline, onFiltersChange]);

  const handleStatusChange = useCallback((newStatus: TaskStatus | null) => {
    setStatus(newStatus);
  }, []);

  const handleSortChange = useCallback((newSort: "asc" | "desc") => {
    setSortDeadline(newSort);
  }, []);

  const handleSearchChange = useCallback((newSearch: string) => {
    setSearchInput(newSearch);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleCreateCardToggle = useCallback((isCreating: boolean) => {
    setIsCreatingCard(isCreating);
  }, []);

  const handleEditIdChange = useCallback((id: number | null) => {
    setEditingId(id);
  }, []);

  const resetFilters = useCallback(() => {
    setStatus(null);
    setSearchInput("");
    setSearch("");
    setSortDeadline("asc");
    setPage(1);
  }, []);

  return {
    // Состояние
    page,
    limit,
    status,
    searchInput,
    search,
    sortDeadline,
    isCreatingCard,
    editingId,

    // Обработчики
    handleStatusChange,
    handleSortChange,
    handleSearchChange,
    handlePageChange,
    handleCreateCardToggle,
    handleEditIdChange,
    resetFilters,
  };
}
