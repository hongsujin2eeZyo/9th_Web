import { api } from "./axiosInstance";

export const getMyInfo = async () => {
  const res = await api.get("/v1/users/me");

  return res.data.data;
};