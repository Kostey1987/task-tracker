import { Text, TextInput } from "@mantine/core";
import type { TaskCardDeadlineProps } from "../../types";

export function TaskCardDeadline({
  isEditing,
  isCreating,
  deadlineInput,
  setDeadlineInput,
  deadlineError,
  deadlineLabel = "Дедлайн",
}: TaskCardDeadlineProps) {
  if (isCreating || isEditing) {
    return (
      <TextInput
        label={deadlineLabel}
        value={deadlineInput}
        onChange={(e) => setDeadlineInput(e.currentTarget.value)}
        placeholder="ДД.ММ.ГГГГ ЧЧ:ММ"
        error={deadlineError}
        withAsterisk
      />
    );
  }
  return (
    <Text
      color={deadlineError ? "red" : undefined}
      size="sm"
      fw={deadlineError ? 600 : 400}
    >
      {deadlineLabel}: {deadlineInput || "-"}
    </Text>
  );
}
