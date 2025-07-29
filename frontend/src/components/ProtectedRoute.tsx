import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState, ProtectedRouteProps } from "../types/types-exports";

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuth = useSelector((state: RootState) => !!state.auth.accessToken);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
