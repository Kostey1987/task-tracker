import { api } from "./api";
import type { Task, TaskInput } from "../types";

export const tasksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => "/tasks",
    }),
    getTask: builder.query<Task, number>({
      query: (id) => `/tasks/${id}`,
    }),
    createTask: builder.mutation<Task, TaskInput>({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        body,
      }),
    }),
    updateTask: builder.mutation<
      Task,
      { id: number; data: Partial<TaskInput> }
    >({
      query: ({ id, data }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteTask: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
