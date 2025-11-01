import { api } from "./axiosInstance";
import type { LoginRequest, LoginResponse, SignupRequest } from "../types/auth";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  console.log("로그인 API 호출:", data);
  const res = await api.post("/v1/auth/signin", data);
  console.log("로그인 응답:", res.data);
  

  
  if (res.data.data) {
    return res.data.data;
  }
  return res.data;
};

export const signup = async (data: SignupRequest): Promise<void> => {
  console.log("회원가입 API 호출:", data);
  const res = await api.post("/v1/auth/signup", data);
  console.log("회원가입 응답:", res.data);

};

