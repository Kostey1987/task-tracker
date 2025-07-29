import { useCallback } from "react";
import type { UseTasksRefetchProps } from "../types/types-exports";

export function useTasksRefetch({ refetch, onSuccess }: UseTasksRefetchProps) {
  const refetchAndNotify = useCallback(() => {
    refetch();
    onSuccess?.();
  }, [refetch, onSuccess]);

  return { refetchAndNotify };
}
