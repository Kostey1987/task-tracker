import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  AppShell,
  Button,
  Group,
  Title,
  Container,
  Center,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { logout } from "./store/authSlice";
import { api } from "./services/api";
import UserProfilePage from "./pages/UserProfilePage";
import TasksPage from "./pages/TasksPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AuthDrawer from "./components/AuthDrawer";

function App() {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [authDrawerOpened, setAuthDrawerOpened] = useState(false);
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    // Инвалидируем кэш задач при выходе
    dispatch(api.util.invalidateTags(["Tasks"]));
  };

  const AppHeader = () => {
    const isVerySmall = useMediaQuery(`(max-width: 480px)`);

    return (
      <Container h="100%" p={isMobile ? "sm" : "md"}>
        <Group justify="space-between" h="100%" gap={isMobile ? "xs" : "md"}>
          <Title order={isMobile ? 4 : 3} size={isVerySmall ? "sm" : undefined}>
            {isVerySmall ? "TT" : "Task Tracker"}
          </Title>
          <Group
            gap={isVerySmall ? "xs" : isMobile ? "xs" : "md"}
            wrap="nowrap"
          >
            {accessToken ? (
              <>
                <Button
                  variant="light"
                  component="a"
                  href="/tasks"
                  size={isVerySmall ? "xs" : isMobile ? "xs" : "sm"}
                  px={isVerySmall ? "xs" : undefined}
                >
                  {isVerySmall ? "Задачи" : "Задачи"}
                </Button>
                <Button
                  variant="light"
                  component="a"
                  href="/userProfile"
                  size={isVerySmall ? "xs" : isMobile ? "xs" : "sm"}
                  px={isVerySmall ? "xs" : undefined}
                >
                  {isVerySmall ? "Профиль" : "Профиль"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  size={isVerySmall ? "xs" : isMobile ? "xs" : "sm"}
                  px={isVerySmall ? "xs" : undefined}
                >
                  {isVerySmall ? "Выйти" : "Выйти"}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setAuthDrawerOpened(true)}
                size={isVerySmall ? "xs" : isMobile ? "sm" : "md"}
                px={isVerySmall ? "xs" : undefined}
              >
                {isVerySmall
                  ? "Войти"
                  : isMobile
                  ? "Войти"
                  : "Войти / Регистрация"}
              </Button>
            )}
          </Group>
        </Group>
      </Container>
    );
  };

  return (
    <Router>
      <AppShell
        header={{ height: 60 }}
        padding="md"
        style={{ overflow: "hidden" }}
      >
        <AppShell.Header>
          <AppHeader />
        </AppShell.Header>

        <AppShell.Main style={{ overflow: "hidden" }}>
          <Routes>
            <Route
              path="/userProfile"
              element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <TasksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                accessToken ? (
                  <Navigate to="/tasks" replace />
                ) : (
                  <Center style={{ minHeight: "80vh" }}>
                    <Stack align="center" gap={isMobile ? "md" : "lg"}>
                      <Title order={isMobile ? 2 : 1} ta="center">
                        Добро пожаловать в Task Tracker
                      </Title>
                      <Button
                        size={isMobile ? "md" : "lg"}
                        onClick={() => setAuthDrawerOpened(true)}
                      >
                        Начать работу
                      </Button>
                    </Stack>
                  </Center>
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell.Main>

        <AuthDrawer
          opened={authDrawerOpened}
          onClose={() => setAuthDrawerOpened(false)}
        />
      </AppShell>
    </Router>
  );
}

export default App;
