import { useState,useEffect } from "react";

export function useLogin(){
      const [email,setEmail] = useState("");
      const [password, setPassword] = useState("");

      const [emailError, setEmailError] = useState("");
      const [passwordError, setPasswordError] = useState("");
      const [isValid, setIsValid] = useState(false);

      const validateEmail = (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            setEmailError("유효하지 않은 이메일 형식입니다.");
            return false;
          } else {
            setEmailError("");
            return true;
          }
        };

      const validatePassword = (value: string) => {
        if (value.length < 6) {
          setPasswordError("비밀번호는 최소 6자 이상이어야 합니다.");
          return false;
        } else {
          setPasswordError("");
          return true;
        }
      };
    

      const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        validateEmail(value);
      };

      const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        validatePassword(value);
      };
    
      useEffect(() => {
        const emailValid = validateEmail(email);
        const passwordValid = validatePassword(password);
        setIsValid(emailValid && passwordValid);
      }, [email, password]);
      
      return {
        email,
        password,
        emailError,
        passwordError,
        handleEmailChange,
        handlePasswordChange,
        isValid,
      };
    }