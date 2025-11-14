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

export const deleteLp = async (lpId: number) => {
    const res = await api.delete(`/v1/lps/${lpId}`);
    return res.data;
  };
  

  // LP 수정
export const updateLp = async (lpId: number, data: {
    title: string;
    content: string;
    thumbnail?: string;
  }) => {
    const res = await api.patch(`/v1/lps/${lpId}`, data);
    return res.data.data;
  };
  
  // LP 좋아요 토글
  export const toggleLike = async (lpId: number) => {
    const res = await api.post(`/v1/lps/${lpId}/likes`);
    return res.data.data;
  };

 