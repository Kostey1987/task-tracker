import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState, PublicOnlyRouteProps } from "../types/types-exports";

// Компонент для публичных маршрутов - доступен только неаутентифицированным пользователям
export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({
  children,
}) => {
  // Проверяем наличие access token для определения аутентификации
  const isAuth = useSelector((state: RootState) => !!state.auth.accessToken);

  // Если пользователь аутентифицирован, перенаправляем на профиль
  if (isAuth) {
    return <Navigate to="/userProfile" replace />;
  }

  // Если не аутентифицирован, отображаем публичный контент
  return <>{children}</>;
};
