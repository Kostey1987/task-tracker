import { api } from "./api";
import type {
  Task,
  TaskInput,
  GetTasksResponse,
  CreateTaskResponse,
  MessageResponse,
  GetTasksParams,
} from "../types/types-exports";

export const tasksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<GetTasksResponse, GetTasksParams | void>({
      query: (params) => {
        const p = params || {};
        const searchParams = new URLSearchParams();
        if (p.page) searchParams.set("page", String(p.page));
        if (p.limit) searchParams.set("limit", String(p.limit));
        if (p.status != null) searchParams.set("status", p.status);
        if (p.deadlineFrom) searchParams.set("deadlineFrom", p.deadlineFrom);
        if (p.deadlineTo) searchParams.set("deadlineTo", p.deadlineTo);
        if (p.sortDeadline) searchParams.set("sortDeadline", p.sortDeadline);
        if (p.search != null) searchParams.set("search", p.search);
        const query = searchParams.toString();
        return `/tasks${query ? `?${query}` : ""}`;
      },
      providesTags: ["Tasks"],
    }),
    getTask: builder.query<Task, number>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Tasks", id }],
    }),
    createTask: builder.mutation<CreateTaskResponse, TaskInput>({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTask: builder.mutation<
      MessageResponse,
      { id: number; data: Partial<TaskInput> }
    >({
      query: ({ id, data }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Tasks",
        { type: "Tasks", id },
      ],
    }),
    deleteTask: builder.mutation<MessageResponse, number>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Tasks",
        { type: "Tasks", id },
      ],
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
