import axios from "axios";
import { getToken, removeToken } from "../utils/storage";

// 환경변수에서 API URL 가져오기, 없으면 기본값 사용
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    console.log("API 요청:", config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => {
    console.log("API 응답:", response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.error("API 에러:", error.config?.url, error.response?.status, error.response?.data);
    

    if (!error.response) {
      console.error("서버 연결 실패:", error.message);
    }
    
    if (error.response?.status === 401) {
      removeToken();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

