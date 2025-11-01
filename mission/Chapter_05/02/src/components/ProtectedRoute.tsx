import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getToken, removeToken } from "../utils/storage";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const token = getToken();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/v1/auth/protected", {
          method: "GET", 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("토큰이 유효하지 않습니다.");

       
        setIsValid(true);
      } catch {
        removeToken();
        setIsValid(false);
      }
    };

    validateToken();
  }, [token]);

  if (isValid === null) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-300">
        🔐 인증 확인 중...
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
