import { Text, Textarea } from "@mantine/core";
import type { TaskCardDescriptionProps } from "../../types/types-exports";

export function TaskCardDescription({
  isEditing,
  isCreating,
  desc,
  setDesc,
  isMobile,
}: TaskCardDescriptionProps) {
  if (isCreating || isEditing) {
    return (
      <Textarea
        value={desc}
        onChange={(e) => setDesc(e.currentTarget.value)}
        autosize
        minRows={2}
        maxRows={6}
        placeholder="Введите описание задачи..."
        withAsterisk
      />
    );
  }
  return (
    <Text
      styles={{
        root: {
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
          maxHeight: 180,
          overflow: "auto",
        },
      }}
      size={isMobile ? "sm" : "md"}
    >
      {desc}
    </Text>
  );
}
