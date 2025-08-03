import { Text, TextInput } from "@mantine/core";
import dayjs from "dayjs";
import type { TaskCardDeadlineProps } from "../../types/types-exports";

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
        type="datetime-local"
        label={deadlineLabel}
        value={deadlineInput}
        onChange={(e) => setDeadlineInput(e.currentTarget.value)}
        placeholder="ГГГГ-ММ-ДД ЧЧ:ММ"
        error={deadlineError}
        withAsterisk
      />
    );
  }

  // Для отображения в режиме просмотра форматируем дату в читаемый вид
  const displayDeadline = deadlineInput
    ? dayjs(deadlineInput, "YYYY-MM-DDTHH:mm").format("DD.MM.YYYY HH:mm")
    : "-";

  return (
    <Text
      color={deadlineError ? "red" : undefined}
      size="sm"
      fw={deadlineError ? 600 : 400}
    >
      {deadlineLabel}: {displayDeadline}
    </Text>
  );
}
