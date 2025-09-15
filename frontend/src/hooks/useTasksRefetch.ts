import { useCallback } from "react";
import type { UseTasksRefetchProps } from "../types/types-exports";

export function useTasksRefetch({ refetch, onSuccess }: UseTasksRefetchProps) {
  // Обёртка для единообразного refetch после операций
  // Позволяет дополнительно выполнить onSuccess (например, сбросить editingId)
  const refetchAndNotify = useCallback(() => {
    refetch();
    onSuccess?.();
  }, [refetch, onSuccess]);

  return { refetchAndNotify };
}
