import { api } from "./axiosInstance";

export const getMyInfo = async () => {
  const res = await api.get("/v1/users/me");
  return res.data.data; 
};

export const getMyLps = async (cursor = 0, limit = 10) => {
  const res = await api.get("/v1/lps/user", {
    params: { cursor, limit, order: "desc" },
  });
  return res.data.data; 
};
