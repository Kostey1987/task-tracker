import { Button, Paper, Stack, Title, Flex } from "@mantine/core";
import { useForm } from "react-hook-form";
import type { SubmitHandler, RegisterOptions } from "react-hook-form";
import { TextInputField } from "../components/form/TextInputField";
import { useRegisterMutation } from "../services/authApi";
import { useNavigate } from "react-router-dom";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const { control, handleSubmit, watch } = useForm<RegisterFormValues>({
    mode: "onTouched",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });
  const [registerUser, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();
      navigate("/login");
    } catch (e) {
      // обработка ошибки
    }
  };

  const nameRules: RegisterOptions<RegisterFormValues> = {
    required: "Имя обязательно",
    minLength: { value: 2, message: "Имя слишком короткое" },
  };

  const emailRules: RegisterOptions<RegisterFormValues> = {
    required: "Email обязателен",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Некорректный формат email",
    },
  };

  const passwordRules: RegisterOptions<RegisterFormValues> = {
    required: "Пароль обязателен",
    minLength: {
      value: 6,
      message: "Пароль должен быть не менее 6 символов",
    },
  };

  const confirmPasswordRules: RegisterOptions<RegisterFormValues> = {
    required: "Подтверждение пароля обязательно",
    validate: (value) => value === watch("password") || "Пароли не совпадают",
  };

  return (
    <Flex justify="center" align="center" h="100vh">
      <Paper maw={400} w="100%" p="lg" shadow="md" radius="md">
        <Title order={2} style={{ textAlign: "center", marginBottom: 16 }}>
          Регистрация
        </Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <TextInputField
              name="name"
              control={control}
              label="Имя"
              placeholder="Введите имя"
              rules={nameRules}
            />
            <TextInputField
              name="email"
              control={control}
              label="Email"
              type="email"
              placeholder="Введите email"
              rules={emailRules}
            />
            <TextInputField
              name="password"
              control={control}
              label="Пароль"
              type="password"
              placeholder="Введите пароль"
              rules={passwordRules}
            />
            <TextInputField
              name="confirmPassword"
              control={control}
              label="Подтвердите пароль"
              type="password"
              placeholder="Повторите пароль"
              rules={confirmPasswordRules}
            />
            <Button type="submit" fullWidth mt="md" loading={isLoading}>
              Зарегистрироваться
            </Button>
            {error && <div style={{ color: "red" }}>Ошибка регистрации</div>}
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <a
                href="/login"
                style={{ color: "#228be6", textDecoration: "none" }}
              >
                Уже есть аккаунт? Войти
              </a>
            </div>
          </Stack>
        </form>
      </Paper>
    </Flex>
  );
}
