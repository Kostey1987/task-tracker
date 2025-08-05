import { api } from "./api";
import type {
  AuthResponse,
  User,
  RegisterInput,
  LoginInput,
} from "../types/types-exports";

// API для аутентификации пользователей
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Вход в систему
    login: builder.mutation<AuthResponse, LoginInput>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"], // Инвалидируем кэш профиля после входа
    }),
    // Регистрация нового пользователя
    register: builder.mutation<AuthResponse, RegisterInput>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    // Обновление access токена
    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),
    // Выход из системы
    logout: builder.mutation<any, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Profile"], // Инвалидируем кэш профиля после выхода
    }),
    // Получение профиля пользователя
    getProfile: builder.query<User, void>({
      query: () => "/auth/profile",
      providesTags: ["Profile"], // Предоставляем тег для кэширования
    }),
    // Обновление имени пользователя
    updateUser: builder.mutation<{ message: string }, { newName: string }>({
      query: (body) => ({
        url: "/auth/update",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Profile"], // Инвалидируем кэш профиля после обновления
    }),
  }),
  overrideExisting: false,
});

// Экспорт хуков для использования в компонентах
export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateUserMutation,
} = authApi;
