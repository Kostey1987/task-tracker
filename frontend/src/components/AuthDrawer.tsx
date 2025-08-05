import React, { useState } from "react";
import {
  Drawer,
  Button,
  Paper,
  Stack,
  Text,
  Flex,
  Center,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import type { SubmitHandler, RegisterOptions } from "react-hook-form";
import { TextInputField } from "./form/TextInputField";
import { useRegisterMutation, useLoginMutation } from "../services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { api } from "../services/api";
import type {
  AuthDrawerProps,
  RegisterFormValues,
  LoginFormValues,
} from "../types/types-exports";

export default function AuthDrawer({ opened, onClose }: AuthDrawerProps) {
  const [isLogin, setIsLogin] = useState(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Форма регистрации
  const registerForm = useForm<RegisterFormValues>({
    mode: "onTouched",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  // Форма входа
  const loginForm = useForm<LoginFormValues>({
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  // Сброс форм при открытии drawer
  React.useEffect(() => {
    if (opened) {
      registerForm.reset();
      loginForm.reset();
    }
  }, [opened, registerForm, loginForm]);

  const [registerUser, { isLoading: isRegisterLoading, error: registerError }] =
    useRegisterMutation();
  const [login, { isLoading: isLoginLoading, error: loginError }] =
    useLoginMutation();

  // Правила валидации для регистрации
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
    validate: (value) =>
      value === registerForm.watch("password") || "Пароли не совпадают",
  };

  // Правила валидации для входа
  const loginEmailRules: RegisterOptions<LoginFormValues> = {
    required: "Email обязателен",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Некорректный формат email",
    },
  };

  const loginPasswordRules: RegisterOptions<LoginFormValues> = {
    required: "Пароль обязателен",
    minLength: {
      value: 6,
      message: "Пароль должен быть не менее 6 символов",
    },
  };

  // Обработчик регистрации
  const onRegisterSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();
      setIsLogin(true);
      registerForm.reset();
    } catch (e) {
      // Обработка ошибки
    }
  };

  // Обработчик входа
  const onLoginSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const result = await login(data).unwrap();
      dispatch(
        setCredentials({
          accessToken: result.token.accessToken,
          refreshToken: result.token.refreshToken,
        })
      );
      // Инвалидируем кэш задач после успешного входа
      dispatch(api.util.invalidateTags(["Tasks"]));
      onClose();
      navigate("/tasks");
    } catch (e) {
      // Обработка ошибки
    }
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    registerForm.reset();
    loginForm.reset();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position={isMobile ? "top" : "left"}
      size={isMobile ? "100%" : 400}
      overlayProps={{ opacity: 0.5, blur: 4 }}
      title={
        <Text size={isMobile ? "lg" : "xl"} fw={600} ta="center">
          {isLogin ? "Вход" : "Регистрация"}
        </Text>
      }
      bg="var(--mantine-color-white)"
      styles={{
        header: {
          backgroundColor: "var(--mantine-color-white)",
          borderBottom: "1px solid var(--mantine-color-gray-3)",
        },
        body: {
          padding: isMobile ? theme.spacing.sm : theme.spacing.md,
          backgroundColor: "var(--mantine-color-white)",
        },
      }}
    >
      <Flex justify="center" align="center" h="100%">
        <Paper
          w="100%"
          p={isMobile ? "md" : "lg"}
          shadow="sm"
          radius="md"
          bg="var(--mantine-color-white)"
          style={{
            maxWidth: isMobile ? "100%" : 350,
          }}
        >
          {isLogin ? (
            // Форма входа
            <form
              key="login-form"
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
            >
              <Stack>
                <TextInputField
                  name="email"
                  control={loginForm.control}
                  label="Email"
                  type="email"
                  placeholder="Введите email"
                  rules={loginEmailRules}
                  autoComplete="new-password"
                />
                <TextInputField
                  name="password"
                  control={loginForm.control}
                  label="Пароль"
                  type="password"
                  placeholder="Введите пароль"
                  rules={loginPasswordRules}
                  autoComplete="new-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  mt="md"
                  loading={isLoginLoading}
                >
                  Войти
                </Button>
                {loginError && (
                  <Text c="red" ta="center">
                    Ошибка входа
                  </Text>
                )}
                <Center mt="md">
                  <Button
                    variant="subtle"
                    onClick={handleSwitchMode}
                    color="blue"
                  >
                    Нет аккаунта? Зарегистрироваться
                  </Button>
                </Center>
              </Stack>
            </form>
          ) : (
            // Форма регистрации
            <form
              key="register-form"
              onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
            >
              <Stack>
                <TextInputField
                  name="name"
                  control={registerForm.control}
                  label="Имя"
                  placeholder="Введите имя"
                  rules={nameRules}
                />
                <TextInputField
                  name="email"
                  control={registerForm.control}
                  label="Email"
                  type="email"
                  placeholder="Введите email"
                  rules={emailRules}
                />
                <TextInputField
                  name="password"
                  control={registerForm.control}
                  label="Пароль"
                  type="password"
                  placeholder="Введите пароль"
                  rules={passwordRules}
                />
                <TextInputField
                  name="confirmPassword"
                  control={registerForm.control}
                  label="Подтвердите пароль"
                  type="password"
                  placeholder="Повторите пароль"
                  rules={confirmPasswordRules}
                />
                <Button
                  type="submit"
                  fullWidth
                  mt="md"
                  loading={isRegisterLoading}
                >
                  Зарегистрироваться
                </Button>
                {registerError && (
                  <Text c="red" ta="center">
                    Ошибка регистрации
                  </Text>
                )}
                <Center mt="md">
                  <Button
                    variant="subtle"
                    onClick={handleSwitchMode}
                    color="blue"
                  >
                    Уже есть аккаунт? Войти
                  </Button>
                </Center>
              </Stack>
            </form>
          )}
        </Paper>
      </Flex>
    </Drawer>
  );
}
