import { TextInput } from "@mantine/core";
import { useController } from "react-hook-form";
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

// minHeight для одной строки ошибки
const errorStyle = { minHeight: 20, color: "red", fontSize: 14, marginTop: 4 };

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  placeholder?: string;
  rules?: RegisterOptions<T>;
  autoComplete?: string;
};

export function TextInputField<T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  placeholder,
  rules,
  autoComplete,
}: Props<T>) {
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
