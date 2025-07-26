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
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { logout } from "./store/authSlice";
import { api } from "./services/api";
import UserProfilePage from "./pages/UserProfilePage";
import TasksPage from "./pages/TasksPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AuthDrawer from "./components/AuthDrawer";

function App() {
  const [authDrawerOpened, setAuthDrawerOpened] = useState(false);
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    // Инвалидируем кэш задач при выходе
    dispatch(api.util.invalidateTags(["Tasks"]));
  };

  const AppHeader = () => (
    <Container h="100%" p="md">
      <Group justify="space-between" h="100%">
        <Title order={3}>Task Tracker</Title>
        <Group>
          {accessToken ? (
            <>
              <Button variant="light" component="a" href="/tasks">
                Задачи
              </Button>
              <Button variant="light" component="a" href="/userProfile">
                Профиль
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Выйти
              </Button>
            </>
          ) : (
            <Button onClick={() => setAuthDrawerOpened(true)}>
              Войти / Регистрация
            </Button>
          )}
        </Group>
      </Group>
    </Container>
  );

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
                    <Stack align="center" gap="lg">
                      <Title order={1}>Добро пожаловать в Task Tracker</Title>
                      <Button
                        size="lg"
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
