import { TextInput } from "@mantine/core";
import { useController, type FieldValues } from "react-hook-form";
import type { TextInputFieldProps } from "../../types/types-exports";

// Стили для отображения ошибок валидации
const errorStyle = { minHeight: 20, color: "red", fontSize: 14, marginTop: 4 };

// Переиспользуемый компонент текстового поля с интеграцией React Hook Form
export function TextInputField<T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  placeholder,
  rules,
  autoComplete,
}: TextInputFieldProps<T>) {
  // Интеграция с React Hook Form для управления состоянием и валидацией
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  return (
    <div>
      <TextInput
        {...field}
        label={label}
        type={type}
        placeholder={placeholder}
        error={!!error}
        withAsterisk={!!rules?.required} // Показываем звездочку для обязательных полей
        autoComplete={autoComplete}
      />
      {/* Отображение ошибки валидации */}
      <div style={errorStyle}>{error?.message || ""}</div>
    </div>
  );
}
