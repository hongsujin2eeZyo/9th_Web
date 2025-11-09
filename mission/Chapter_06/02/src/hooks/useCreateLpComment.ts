import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axiosInstance";

export const useCreateLpComment = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const res = await api.post(`/v1/lps/${lpId}/comments`, { content });
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lpComments", lpId],
      });
    },
  });
};
