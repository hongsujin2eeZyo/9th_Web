import { useEffect, useState } from "react";
import { getMyInfo } from "../api/user";
import { removeToken } from "../utils/storage";
import { useNavigate } from "react-router-dom";

export type UserInfo = {
  id: number;
  name: string;
  email: string;
};

export const useUser = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getMyInfo();
        setUser(userData);
      } catch (error) {
        console.error("내 정보 조회 실패:", error);
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        removeToken();
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  return { user, isLoading };
};
