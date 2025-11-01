import { useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../utils/storage";

const Navbar = () => {
  const navigate = useNavigate();
  const token = getToken(); 

  const handleLogout = () => {
    removeToken();
    alert("로그아웃 되었습니다!");
    navigate("/home");
  };

  return (
    <nav className="bg-zinc-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
      {/* 로고 클릭 시 홈으로 */}
      <p
        onClick={() => navigate("/")}
        className="text-pink-500 text-xl font-semibold cursor-pointer"
      >
        돌려돌려 LP판
      </p>

      {/* 로그인 상태에 따라 버튼 분기 */}
      <div className="flex space-x-4">
        {token ? (
          <>
            <button
              onClick={() => navigate("/mypage")}
              className="bg-pink-500 hover:bg-pink-600 px-3 py-1 rounded-md text-sm transition"
            >
              마이페이지
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-800 px-3 py-1 rounded-md text-sm transition"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
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
