import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/storage";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const name = params.get("name");

    if (accessToken && refreshToken) {
      setToken("accessToken", accessToken);
      setToken("refreshToken", refreshToken);
      if (name) localStorage.setItem("userName", name);

      setTimeout(() => {
        alert("구글 로그인 성공 🎉");
        navigate("/home", { replace: true });
      }, 300);
    } else {
      alert("구글 로그인 실패: 토큰이 전달되지 않았습니다.");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="text-white flex justify-center items-center h-screen">
      <p>구글 로그인 중입니다...</p>
    </div>
  );
};

export default GoogleCallback;
