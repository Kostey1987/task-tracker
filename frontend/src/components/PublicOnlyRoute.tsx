import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState, PublicOnlyRouteProps } from "../types/types-exports";

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({
  children,
}) => {
  const isAuth = useSelector((state: RootState) => !!state.auth.accessToken);

  if (isAuth) {
    return <Navigate to="/userProfile" replace />;
  }
  return <>{children}</>;
};
