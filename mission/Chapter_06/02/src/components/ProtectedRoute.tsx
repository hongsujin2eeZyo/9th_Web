import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getToken, removeToken } from "../utils/storage";
import { api } from "../api/axiosInstance";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const location = useLocation();
 
  useEffect(() => {

    const token = getToken();

    if (!token) {
      setIsValid(false);
      return;
    }


  
    const validateToken = async () => {
      try {

        const res = await api.get(`${import.meta.env.VITE_SERVER_API_URL}/v1/auth/protected`);
        console.log("토큰 검증 성공:", res.data);
        setIsValid(true);
      } catch (error: any) {
        console.error("토큰 검증 실패:", error);
        removeToken();
        setIsValid(false);
      }
    };

    validateToken();
  }, []);

  if (isValid === null) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-300">
        인증 확인 중...
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
