import { Button, Paper, Stack, Title, Flex } from "@mantine/core";
import { useForm } from "react-hook-form";
import type { SubmitHandler, RegisterOptions } from "react-hook-form";
import { TextInputField } from "../components/form/TextInputField";

interface LoginFormValues {
  email: string;
  password: string;
}

const emailRules: RegisterOptions<LoginFormValues> = {
  required: "Email обязателен",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Некорректный формат email",
  },
};

const passwordRules: RegisterOptions<LoginFormValues> = {
  required: "Пароль обязателен",
  minLength: {
    value: 6,
    message: "Пароль должен быть не менее 6 символов",
  },
};

export default function LoginPage() {
  const { control, handleSubmit } = useForm<LoginFormValues>({
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    // логика логина
    console.log(data);
  };

  return (
    <Flex justify="center" align="center" h="100vh">
      <Paper maw={400} w="100%" p="lg" shadow="md" radius="md">
        <Title order={2} style={{ textAlign: "center", marginBottom: 16 }}>
          Вход
        </Title>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="new-password">
          <Stack>
            <TextInputField
              name="email"
              control={control}
              label="Email"
              type="email"
              placeholder="Введите email"
              rules={emailRules}
              autoComplete="new-password"
            />
            <TextInputField
              name="password"
              control={control}
              label="Пароль"
              type="password"
              placeholder="Введите пароль"
              rules={passwordRules}
              autoComplete="new-password"
            />
            <Button type="submit" fullWidth mt="md">
              Войти
            </Button>
          </Stack>
        </form>
      </Paper>
    </Flex>
  );
}
