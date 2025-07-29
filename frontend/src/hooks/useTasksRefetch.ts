import { useCallback } from "react";

interface UseTasksRefetchProps {
  refetch: () => void;
  onSuccess?: () => void;
}

export function useTasksRefetch({ refetch, onSuccess }: UseTasksRefetchProps) {
  const refetchAndNotify = useCallback(() => {
    refetch();
    onSuccess?.();
  }, [refetch, onSuccess]);

  return { refetchAndNotify };
}
