import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TaskStatus } from "../types/types-exports";

interface TasksUIState {
  // Фильтры и поиск
  page: number;
  status: TaskStatus | null;
  searchInput: string;
  search: string;
  sortDeadline: "asc" | "desc";

  // Состояние UI
  isCreatingCard: boolean;
  editingId: number | null;

  // Вычисляемые состояния
  isSearching: boolean;

  // Метаданные
  lastUpdated: number;
}

const initialState: TasksUIState = {
  page: 1,
  status: null,
  searchInput: "",
  search: "",
  sortDeadline: "asc",
  isCreatingCard: false,
  editingId: null,
  isSearching: false,
  lastUpdated: Date.now(),
};

const tasksUISlice = createSlice({
  name: "tasksUI",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
      state.lastUpdated = Date.now();
    },
    setStatus: (state, action: PayloadAction<TaskStatus | null>) => {
      state.status = action.payload;
      state.page = 1; // Сброс страницы при изменении фильтра
      state.lastUpdated = Date.now();
    },
    setSearchInput: (state, action: PayloadAction<string>) => {
      state.searchInput = action.payload;
      state.isSearching = state.searchInput !== state.search;
      state.lastUpdated = Date.now();
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1; // Сброс страницы при изменении поиска
      state.lastUpdated = Date.now();
    },
    setSortDeadline: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortDeadline = action.payload;
      state.page = 1; // Сброс страницы при изменении сортировки
      state.lastUpdated = Date.now();
    },
    setCreatingCard: (state, action: PayloadAction<boolean>) => {
      state.isCreatingCard = action.payload;
      state.lastUpdated = Date.now();
    },
    setEditingId: (state, action: PayloadAction<number | null>) => {
      state.editingId = action.payload;
      state.lastUpdated = Date.now();
    },
    resetFilters: (state) => {
      state.status = null;
      state.searchInput = "";
      state.search = "";
      state.sortDeadline = "asc";
      state.page = 1;
      state.isSearching = false;
      state.lastUpdated = Date.now();
    },
    // Действие для debounce поиска
    updateSearchFromInput: (state) => {
      state.search = state.searchInput;
      state.isSearching = false;
      state.page = 1;
      state.lastUpdated = Date.now();
    },
  },
});

export const {
  setPage,
  setStatus,
  setSearchInput,
  setSearch,
  setSortDeadline,
  setCreatingCard,
  setEditingId,
  resetFilters,
  updateSearchFromInput,
} = tasksUISlice.actions;

export default tasksUISlice.reducer;
