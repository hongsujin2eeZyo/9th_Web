import { useEffect, useState } from "react";

export function useSign() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(value);
    setEmailError(isValid ? "" : "유효하지 않은 이메일 형식입니다.");
    setIsEmailValid(isValid);
    return isValid;
  };

  const validatePassword = (value: string) => {
    const isValid = value.length >= 6;
    setPasswordError(isValid ? "" : "비밀번호는 최소 6자 이상이어야 합니다.");
    return isValid;
  };

  const validateConfirmPassword = (value: string, pw = password) => {
    const isValid = value === pw;
    setConfirmError(isValid ? "" : "비밀번호가 일치하지 않습니다.");
    return isValid;
  };

  useEffect(() => {
    const pwValid = validatePassword(password);
    const confirmValid = validateConfirmPassword(confirmPassword, password);
    setIsPasswordValid(pwValid && confirmValid);
  }, [password, confirmPassword]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
  };

  const validateEmailStep = () => validateEmail(email);

  const validatePasswordStep = () => {
    return isPasswordValid;
  };

  return {
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
  };
}
