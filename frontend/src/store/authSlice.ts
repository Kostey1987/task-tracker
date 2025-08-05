import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "../types/types-exports";

// Начальное состояние аутентификации
const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
};

// Redux slice для управления состоянием аутентификации
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Действие для установки токенов аутентификации
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    // Действие для выхода из системы (очистка токенов)
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
