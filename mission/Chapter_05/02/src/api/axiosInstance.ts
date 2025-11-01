import axios from "axios";
import { getToken, setToken, removeToken } from "../utils/storage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = getToken("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터 (토큰 만료 처리)
let isRefreshing = false; // 중복 refresh 요청 방지
let refreshSubscribers: ((token: string) => void)[] = [];

const onRrefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // accessToken 만료 (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지
      const refreshToken = getToken("refreshToken");

      if (!refreshToken) {
        removeToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // 이미 갱신 중이면 기다렸다가 다시 요청
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(`${API_BASE_URL}/v1/auth/refresh`, {
          refresh: refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

        // 토큰 갱신 후 저장
        setToken("accessToken", accessToken);
        setToken("refreshToken", newRefreshToken);

        // 대기 중이던 요청들 재시도
        onRrefreshed(accessToken);
        isRefreshing = false;

        // 실패했던 요청 다시 실행
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh Token 만료 — 재로그인 필요");
        removeToken();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
