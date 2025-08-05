import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../types/types-exports";
import { setCredentials, logout } from "../store/authSlice";
import { API_CONFIG } from "../config/apiConfig";

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_CONFIG.BASE_URL}/api`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Защита от бесконечных циклов - проверяем, не является ли это уже запросом обновления токена
    const isRefreshRequest =
      typeof args === "object" && args.url === "/auth/refresh";

    if (!isRefreshRequest) {
      // Попытка обновить токен
      const refreshToken = (api.getState() as RootState).auth.refreshToken;

      console.log("Попытка обновить токен...", {
        refreshToken: refreshToken ? "существует" : "отсутствует",
      });

      if (refreshToken) {
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        console.log("Результат обновления:", refreshResult);

        if (refreshResult.data) {
          const { accessToken, refreshToken: newRefreshToken } =
            refreshResult.data as {
              accessToken: string;
              refreshToken: string;
            };
          console.log("Токен успешно обновлен");
          api.dispatch(
            setCredentials({ accessToken, refreshToken: newRefreshToken })
          );
          // Повторяем исходный запрос
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Обновление не удалось - выходим из системы
          console.log("Обновление не удалось, выход из системы");
          api.dispatch(logout());
        }
      } else {
        // Нет refresh token - выходим из системы
        console.log("Нет refresh token, выход из системы");
        api.dispatch(logout());
      }
    } else {
      console.log("Это запрос обновления, не пытаемся обновить снова");
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile", "Tasks"],
  endpoints: () => ({}), // endpoints будут добавляться через injectEndpoints
});
