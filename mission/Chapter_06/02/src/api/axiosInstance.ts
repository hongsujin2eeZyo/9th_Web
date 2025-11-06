import axios from "axios";
import { getToken, setToken, removeToken } from "../utils/storage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});


api.interceptors.request.use(
  (config) => {
    const token = getToken("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);


let isRefreshing = false; 
let refreshSubscribers: ((token: string) => void)[] = [];

const onRrefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 
      const refreshToken = getToken("refreshToken");

      if (!refreshToken) {
        removeToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }


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

     
        setToken("accessToken", accessToken);
        setToken("refreshToken", newRefreshToken);


        onRrefreshed(accessToken);
        isRefreshing = false;


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
