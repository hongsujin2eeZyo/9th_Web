// hooks/useUser.ts

import { useEffect, useState } from "react";
import { getMyInfo } from "../api/user";

export type UserInfo = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
};

export const useUser = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await getMyInfo();
        setUser(res);
      } catch (e) {
        console.error("유저 정보 불러오기 실패", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, []);

  return { user, isLoading };
};
