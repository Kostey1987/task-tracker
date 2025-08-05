import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState, ProtectedRouteProps } from "../types/types-exports";

// Компонент для защиты маршрутов - проверяет аутентификацию пользователя
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Проверяем наличие access token для определения аутентификации
  const isAuth = useSelector((state: RootState) => !!state.auth.accessToken);

  // Если пользователь не аутентифицирован, перенаправляем на страницу входа
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Если аутентифицирован, отображаем защищенный контент
  return <>{children}</>;
};
