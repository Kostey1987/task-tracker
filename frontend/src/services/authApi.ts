import { api } from "./api";
import type {
  AuthResponse,
  User,
  RegisterInput,
  LoginInput,
} from "../types/types-exports";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginInput>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    register: builder.mutation<AuthResponse, RegisterInput>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Profile"],
    }),
    getProfile: builder.query<User, void>({
      query: () => "/auth/profile",
      providesTags: ["Profile"],
    }),
    updateUser: builder.mutation<{ message: string }, { newName: string }>({
      query: (body) => ({
        url: "/auth/update",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateUserMutation,
} = authApi;
