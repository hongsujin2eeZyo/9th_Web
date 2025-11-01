import Navbar from "../components/navbar";
import { getToken } from "../utils/storage";
import { useEffect, useState } from "react";
import { api } from "../api/axiosInstance";

const Home = () => {
  const token = getToken();
  const [nickname, setNickname] = useState<string | null>(null);


  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await api.get("/v1/users/me"); 
        setNickname(res.data.data.name);
      } catch (error) {
        console.error("사용자 정보 불러오기 실패:", error);
      }
    };
    fetchUser();
  }, [token]);

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <h1 className="text-3xl font-bold mb-3">🎧 돌려돌려 LP판</h1>

        {token ? (
          <p className="text-pink-400 text-xl mt-4">
            {nickname ? `${nickname}님, 환영합니다 🎉` : "환영합니다 🎵"}
          </p>
        ) : (
          <p className="text-gray-400">
            로그인 후 나만의 LP 공간을 즐겨보세요!!
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
