import { useMemo } from "react";
import type { UseTasksPageContentProps } from "../types/types-exports";

export function useTasksPageContent({
  data,
  search,
}: UseTasksPageContentProps) {
  // Сообщение для пустого списка в зависимости от наличия поискового запроса
  const emptyMessage = useMemo(() => {
    if (search) {
      return `Задачи по запросу "${search}" не найдены`;
    }
    return "Нет задач";
  }, [search]);

  // Быстрые производные флаги для рендера контента и пагинации
  const hasTasks = useMemo(() => {
    return Boolean(data?.tasks.length);
  }, [data?.tasks.length]);

  const showPagination = useMemo(() => {
    return Boolean(data && data.totalPages > 1);
  }, [data?.totalPages]);

  return {
    emptyMessage,
    hasTasks,
    showPagination,
  };
}
