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

//location을 감싸기 위해 내부 컴포넌트로 분리
function AppRoutes() {
  const location = useLocation();
  const background = location.state?.background;

  return (
    <>
      {/* 기본 라우트 (항상 렌더링됨) */}
      <Routes location={background || location}>
        <Route path="/*" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/mypage"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/v1/auth/google/callback"
          element={<GoogleCallback />}
        />
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
