import { Button, Paper, Stack, Title, Flex } from "@mantine/core";
import { useForm } from "react-hook-form";
import type { SubmitHandler, RegisterOptions } from "react-hook-form";
import { TextInputField } from "../components/form/TextInputField";
import { useLoginMutation } from "../services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import type { LoginFormValues } from "../types/types-exports";

// Правила валидации для email
const emailRules: RegisterOptions<LoginFormValues> = {
  required: "Email обязателен",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Некорректный формат email",
  },
};

// Правила валидации для пароля
const passwordRules: RegisterOptions<LoginFormValues> = {
  required: "Пароль обязателен",
  minLength: {
    value: 6,
    message: "Пароль должен быть не менее 6 символов",
  },
};

// Страница входа в систему
export default function LoginPage() {
  // Форма входа с валидацией
  const { control, handleSubmit } = useForm<LoginFormValues>({
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Обработчик отправки формы входа
  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const result = await login(data).unwrap();
      // Сохраняем токены в Redux store
      dispatch(
        setCredentials({
          accessToken: result.token.accessToken,
          refreshToken: result.token.refreshToken,
        })
      );
      navigate("/tasks"); // Перенаправляем на страницу задач
    } catch (e) {
      // Обработка ошибки входа
    }
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
            <Button type="submit" fullWidth mt="md" loading={isLoading}>
              Войти
            </Button>
            {error && <div style={{ color: "red" }}>Ошибка входа</div>}
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <a
                href="/register"
                style={{ color: "#228be6", textDecoration: "none" }}
              >
                Нет аккаунта? Зарегистрироваться
              </a>
            </div>
          </Stack>
        </form>
      </Paper>
    </Flex>
  );
}
