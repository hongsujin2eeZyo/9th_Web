import Navbar from "../components/navbar";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import { getToken } from "../utils/storage";
import { useEffect, useState } from "react";
import { api } from "../api/axiosInstance";
import { useSidebarControl } from "../hooks/useSidebarControl";

const Home = () => {
  const token = getToken();
  const [nickname, setNickname] = useState<string | null>(null);
  const { isSidebarOpen, toggleSidebar, sidebarRef, toggleButtonRef } = useSidebarControl();

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
    <div className="bg-black min-h-screen text-white flex flex-col relative">
      {/* 상단 네비게이션 */}
      <div className="sticky top-0 z-50">
        <Navbar 
          onToggleSidebar={toggleSidebar}
          toggleButtonRef={toggleButtonRef} 
          nickname={nickname} />
      </div>

      {/* 사이드바 + 메인 콘텐츠 */}
      <div className="flex flex-1 relative">
        <div ref={sidebarRef}>
          <Sidebar isOpen={isSidebarOpen} />
        </div>

        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <MainContent />
        </div>
      </div>
    </div>
  );
};

export default Home;
