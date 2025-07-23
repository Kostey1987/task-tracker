import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../store/store";

interface Props {
  children: React.ReactNode;
}

export const PublicOnlyRoute: React.FC<Props> = ({ children }) => {
  const isAuth = useSelector((state: RootState) => !!state.auth.accessToken);

  if (isAuth) {
    return <Navigate to="/userProfile" replace />;
  }
  return <>{children}</>;
};
