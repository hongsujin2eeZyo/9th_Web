import { api } from "./axiosInstance";

export const updateLpComment = async (lpId: number, commentId: number, content: string) => {
  const res = await api.patch(`/v1/lps/${lpId}/comments/${commentId}`, {
    content,
  });
  return res.data.data;
};

export const deleteLpComment = async (lpId: number, commentId: number) => {
  const res = await api.delete(`/v1/lps/${lpId}/comments/${commentId}`);
  return res.data.data;
};
