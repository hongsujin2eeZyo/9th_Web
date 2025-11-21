import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import MyPage from "./pages/MyPage";
import ProtectedRoute from "./components/ProtectedRoute";
import GoogleCallback from "./pages/GoogleCallback";
import LpDetail from "./components/LPDetail";

// location을 감싸기 위해 내부 컴포넌트로 분리
function AppRoutes() {
  const location = useLocation();
  const background = location.state?.background;

  return (
    <>
      <Routes location={background || location}>
        {/* 메인 홈 */}
        <Route path="/" element={<Home />} />

        {/* LP 상세페이지 */}
        <Route path="/lp/:lpid" element={<LpDetail />} />

        {/* 로그인 / 회원가입 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* 마이페이지 (보호됨) */}
        <Route
          path="/mypage"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />

        {/* 구글 로그인 콜백 */}
        <Route
          path="/v1/auth/google/callback"
          element={<GoogleCallback />}
        />

        {/* 존재하지 않는 경로 → 홈으로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
