import { api } from "./axiosInstance";

export const createLP = async (lpData: {
  title: string;
  content: string;
  thumbnail: string; 
  tags: string[];
}) => {
  const res = await api.post("/v1/lps", {
    ...lpData,
    published: true,
  });

  return res.data.data;
};
