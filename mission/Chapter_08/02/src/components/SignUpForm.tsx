import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSign } from "../hooks/useSign";
import { Mail, Eye, EyeOff, UserCircle } from "lucide-react";
import { signup } from "../api/auth";

const SignUpForm = () => {
  const navigate = useNavigate();
  const {
    email,
    password,
    confirmPassword,
    emailError,
    passwordError,
    confirmError,
    isEmailValid,
    isPasswordValid,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    validateEmailStep,
    validatePasswordStep,
  } = useSign();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showNicknameForm, setShowNicknameForm] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");


  const handleEmailNext = () => {
    if (validateEmailStep()) {
      setShowPasswordForm(true);
    }
  };

  const handlePasswordNext = () => {
    if (validatePasswordStep()) {
      setShowNicknameForm(true);
    }
  };

  const handleSignUp = async () => {
    if (nickname.trim().length < 2) {
      setNicknameError("닉네임은 2자 이상 입력해주세요.");
      return;
    }
  
    setIsLoading(true);
    try {
      await signup({
        name: nickname,
        email,
        password,
        bio: bio || undefined,
        avatar: avatar || undefined,
      });
      alert(`회원가입 성공 🎉\n닉네임: ${nickname}`);
      navigate("/login");
    } catch (error: any) {
      console.error("회원가입 에러:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "회원가입 실패. 다시 시도해주세요.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="text-white px-6 py-4 shadow-md items-center gap-4 flex flex-col min-h-screen">
      <div className="flex items-center justify-between w-full max-w-xs mb-6 mt-4">
        <button
          onClick={() => {
            if (showNicknameForm) setShowNicknameForm(false);
            else if (showPasswordForm) setShowPasswordForm(false);
            else navigate(-1);
          }}
          className="text-2xl cursor-pointer"
        >
          &lt;
        </button>
        <h1 className="text-lg font-semibold">회원가입</h1>
        <div className="w-6" />
      </div>

      {!showPasswordForm && !showNicknameForm && (
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="이메일을 입력해주세요!"
            className={`p-3 rounded-xl border ${
              emailError ? "border-red-500" : "border-white/40"
            } bg-zinc-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 ${
              emailError ? "focus:ring-red-500" : "focus:ring-white/60"
            }`}
          />
          {emailError && (
            <p className="text-red-500 text-xs mt-1 ml-1">{emailError}</p>
          )}

          <button
            onClick={handleEmailNext}
            disabled={!isEmailValid}
            className={`py-3 rounded-xl mt-2 transition-colors cursor-pointer w-full ${
              isEmailValid
                ? "bg-pink-500 hover:bg-pink-600 text-white"
                : "bg-gray-500 text-gray-300 cursor-not-allowed"
            }`}
          >
            다음
          </button>
        </div>
      )}

      {showPasswordForm && !showNicknameForm && (
        <div className="flex flex-col gap-3 w-full max-w-xs mt-5">
          <div className="flex items-center gap-2 px-4 py-3 w-full">
            <Mail className="w-5 h-5 text-gray-300" />
            <span className="text-gray-300 text-sm truncate">{email}</span>
          </div>

          <div className="relative flex flex-col">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호를 입력해주세요!"
              className={`p-3 rounded-xl border pr-10 ${
                passwordError ? "border-red-500" : "border-white/40"
              } bg-zinc-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 ${
                passwordError ? "focus:ring-red-500" : "focus:ring-white/60"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {passwordError && (
              <p className="text-red-500 text-xs mt-1 ml-1">{passwordError}</p>
            )}
          </div>

          <div className="relative flex flex-col">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="비밀번호를 다시 입력해주세요!"
              className={`p-3 rounded-xl border pr-10 ${
                confirmError ? "border-red-500" : "border-white/40"
              } bg-zinc-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 ${
                confirmError ? "focus:ring-red-500" : "focus:ring-white/60"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {confirmError && (
              <p className="text-red-500 text-xs mt-1 ml-1">{confirmError}</p>
            )}
          </div>

          <button
            onClick={handlePasswordNext}
            disabled={!isPasswordValid}
            className={`py-3 rounded-xl mt-2 transition-colors w-full ${
              isPasswordValid
                ? "bg-pink-500 hover:bg-pink-600 text-white"
                : "bg-gray-500 text-gray-300 cursor-not-allowed"
            }`}
          >
            다음
          </button>
        </div>
      )}

      {showNicknameForm && (
        <div className="flex flex-col gap-4 w-full max-w-xs items-center mt-8">
          <UserCircle className="w-28 h-28 text-gray-400 mb-4" />

          <input
            type="text"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setNicknameError("");
            }}
            placeholder="닉네임을 입력해주세요!"
            className={`p-3 rounded-xl border text-center ${
              nicknameError ? "border-red-500" : "border-white/40"
            } bg-zinc-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 ${
              nicknameError ? "focus:ring-red-500" : "focus:ring-white/60"
            }`}
          />
          {nicknameError && (
            <p className="text-red-500 text-xs mt-1">{nicknameError}</p>
          )}

          <button
            onClick={handleSignUp}
            disabled={nickname.trim().length < 2 || isLoading}
            className={`py-3 rounded-xl mt-2 transition-colors w-full ${
              nickname.trim().length >= 2 && !isLoading
                ? "bg-pink-500 hover:bg-pink-600 text-white"
                : "bg-gray-500 text-gray-300 cursor-not-allowed"
            }`}
          >
            {isLoading ? "회원가입 중..." : "회원가입 완료"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SignUpForm;
