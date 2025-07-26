import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";
import { setCredentials, logout } from "../store/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",
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
    // Защита от бесконечных циклов - проверяем, не является ли это уже запросом refresh
    const isRefreshRequest =
      typeof args === "object" && args.url === "/auth/refresh";

    if (!isRefreshRequest) {
      // Попытка обновить токен
      const refreshToken = (api.getState() as RootState).auth.refreshToken;

      console.log("Attempting to refresh token...", {
        refreshToken: refreshToken ? "exists" : "missing",
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

        console.log("Refresh result:", refreshResult);

        if (refreshResult.data) {
          const { accessToken, refreshToken: newRefreshToken } =
            refreshResult.data as any;
          console.log("Token refreshed successfully");
          api.dispatch(
            setCredentials({ accessToken, refreshToken: newRefreshToken })
          );
          // Повторяем исходный запрос
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh не удался - выходим из системы
          console.log("Refresh failed, logging out");
          api.dispatch(logout());
        }
      } else {
        // Нет refresh token - выходим из системы
        console.log("No refresh token, logging out");
        api.dispatch(logout());
      }
    } else {
      console.log("This is a refresh request, not attempting to refresh again");
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
