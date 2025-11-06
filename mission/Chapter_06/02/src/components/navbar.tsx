import { useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../utils/storage";
import { Search } from "lucide-react"; 
import type { RefObject } from "react";

type NavbarProps = {
  onToggleSidebar: () => void;
  toggleButtonRef: RefObject<HTMLButtonElement | null>; 
  nickname?: string | null;
};

const Navbar = ({onToggleSidebar, toggleButtonRef, nickname}: NavbarProps) => {
  const navigate = useNavigate();
  const token = getToken(); 

  const handleLogout = () => {
    removeToken();
    alert("로그아웃 되었습니다!");
    navigate("/home");
  };

  return (
    <nav className="bg-zinc-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-4">
        {/* 햄버거 버튼 */}
        <button
        ref={toggleButtonRef} 
          onClick={onToggleSidebar}
          className=" text-2xl text-white-400 hover:text-pink-300 transition"
        >
          ☰
        </button>

        {/* 로고 클릭 시 홈으로 */}
        <p
          onClick={() => navigate("/")}
          className="text-pink-500 text-xl font-semibold cursor-pointer"
        >
          돌려돌려 LP판
        </p>
      </div>

      {/* 로그인 상태에 따라 버튼 분기 */}
      <div className="flex space-x-4 items-center">
        {token ? (
          <>
            <Search size={16} className="text-white-400" />
            <span className="text-sm text-gray-300">
              {nickname ? `${nickname}님, 반갑습니다 👋` : "환영합니다 🎵"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-800 px-3 py-1 rounded-md text-sm transition"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Search size={16} className="text-white-400" />

            <button
              onClick={() => navigate("/login")}
              className="border border-zinc-700 bg-black rounded-md px-3 py-1 text-sm hover:scale-105 transition"
            >
              로그인
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-pink-500 border border-pink-500 rounded-md px-3 py-1 text-sm hover:bg-pink-600 transition"
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
