import { useEffect, useState } from "react";
import { getMyInfo, getMyLps } from "../api/user";  // ✅ LP 조회 API 추가
import { removeToken } from "../utils/storage";
import { useNavigate } from "react-router-dom";

export type UserInfo = {
  id: number;
  name: string;
  email: string;
};

export type LPInfo = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
};

export const useUser = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [lpList, setLpList] = useState<LPInfo[]>([]);     // ✅ LP 목록 상태 추가
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndLPs = async () => {
      try {
        // ✅ 내 정보 조회
        const userData = await getMyInfo();
        setUser(userData);

        // ✅ LP 목록 조회 (cursor = 0, limit = 10 기본값)
        const lpData = await getMyLps(0, 20);  // LP 20개 불러오기
        setLpList(lpData.data);               // ✅ data 배열만 저장
      } catch (error) {
        console.error("내 정보 조회 실패:", error);
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        removeToken();
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndLPs();
  }, [navigate]);

  return { user, lpList, isLoading }; // ✅ LP 목록도 반환
};
