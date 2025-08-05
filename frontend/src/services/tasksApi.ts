import { api } from "./api";
import type {
  Task,
  TaskInput,
  GetTasksResponse,
  CreateTaskResponse,
  MessageResponse,
  GetTasksParams,
} from "../types/types-exports";

// API для работы с задачами
export const tasksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получение списка задач с фильтрацией и пагинацией
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
      providesTags: ["Tasks"], // Предоставляем тег для кэширования
    }),
    // Получение одной задачи по ID
    getTask: builder.query<Task, number>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Tasks", id }], // Кэширование по ID
    }),
    // Создание новой задачи
    createTask: builder.mutation<
      CreateTaskResponse,
      TaskInput & { file?: File }
    >({
      query: (body) => {
        if (body.file) {
          // Если есть файл, отправляем как FormData
          const formData = new FormData();
          formData.append("description", body.description);
          if (body.status) formData.append("status", body.status);
          if (body.deadline) formData.append("deadline", body.deadline);
          formData.append("image", body.file);
          return {
            url: "/tasks",
            method: "POST",
            body: formData,
          };
        }
        // Иначе отправляем как JSON
        return {
          url: "/tasks",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Tasks"], // Инвалидируем кэш задач после создания
    }),
    // Обновление задачи
    updateTask: builder.mutation<
      MessageResponse,
      { id: number; data: Partial<TaskInput> & { file?: File } }
    >({
      query: ({ id, data }) => {
        if (data.file) {
          // Если есть файл, отправляем как FormData
          const formData = new FormData();
          if (data.description)
            formData.append("description", data.description);
          if (data.status) formData.append("status", data.status);
          if (data.deadline) formData.append("deadline", data.deadline);
          formData.append("image", data.file);
          return {
            url: `/tasks/${id}`,
            method: "PATCH",
            body: formData,
          };
        }
        // Иначе отправляем как JSON
        return {
          url: `/tasks/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        "Tasks", // Инвалидируем общий список
        { type: "Tasks", id }, // И конкретную задачу
      ],
    }),
    // Удаление задачи
    deleteTask: builder.mutation<MessageResponse, number>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Tasks", // Инвалидируем общий список
        { type: "Tasks", id }, // И конкретную задачу
      ],
    }),
    // Удаление изображения задачи
    deleteTaskImage: builder.mutation<MessageResponse, number>({
      query: (id) => ({
        url: `/tasks/${id}/image`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Tasks", // Инвалидируем общий список
        { type: "Tasks", id }, // И конкретную задачу
      ],
    }),
  }),
  overrideExisting: false,
});

// Экспорт хуков для использования в компонентах
export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useDeleteTaskImageMutation,
} = tasksApi;
