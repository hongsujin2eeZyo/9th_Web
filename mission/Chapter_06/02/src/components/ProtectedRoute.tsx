import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthCheck } from "../hooks/useAuthCheck";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isLoading, isError } = useAuthCheck();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-300">
        인증 확인 중...
      </div>
    );
  }

  if (isError) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
