import { TextInput } from "@mantine/core";
import { useController } from "react-hook-form";
import type { TextInputFieldProps } from "../../types/types-exports";

// minHeight для одной строки ошибки
const errorStyle = { minHeight: 20, color: "red", fontSize: 14, marginTop: 4 };

export function TextInputField<T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  placeholder,
  rules,
  autoComplete,
}: TextInputFieldProps<T>) {
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
        withAsterisk={!!rules?.required}
        autoComplete={autoComplete}
      />
      <div style={errorStyle}>{error?.message || ""}</div>
    </div>
  );
}
