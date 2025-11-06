import { removeToken } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";


const My = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  const handleback = () => {
    navigate("-1");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-300">
        사용자 정보를 불러오는 중...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-red-400">
        사용자 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-black flex flex-col items-center justify-center h-screen text-white">
      <h1 className="text-2xl mb-4">내 정보</h1>
      <div className="bg-zinc-800 p-6 rounded-xl shadow-md w-80">
        <p>🩷 이름: {user.name}</p>
        <p>🩷 이메일: {user.email}</p>
        <p>🩷 ID: {user.id}</p>
      </div>

      <button
        onClick={handleback}
        className="mt-6 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-xl"
      >
        뒤로가기
      </button>
    </div>
  );
};

export default My;
