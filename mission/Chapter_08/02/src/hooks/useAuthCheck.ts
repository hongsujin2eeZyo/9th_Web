import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axiosInstance";
import { getToken, removeToken } from "../utils/storage";

export const useAuthCheck = () => {
  const token = getToken();

  return useQuery({
    queryKey: ["authCheck"],
    queryFn: async () => {
      try {
        const res = await api.get(`${import.meta.env.VITE_SERVER_API_URL}/v1/auth/protected`);
        return res.data;
      } catch (err) {
        removeToken();  
        throw err;     
      }
    },
    enabled: !!token,
    retry: 1,
  });
};
