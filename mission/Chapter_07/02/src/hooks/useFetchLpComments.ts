import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../api/axiosInstance";

export type Comment = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
  };
};


export const useFetchLpComments = (
  lpId: number,
  order: "asc" | "desc" = "desc"
) => {
  return useInfiniteQuery({
    queryKey: ["lpComments", lpId, order],
    queryFn: async ({ pageParam = 0 }) => {
      const start = Date.now(); 

      const res = await api.get(`/v1/lps/${lpId}/comments`, {
        params: { cursor: pageParam, limit: 10, order },
      });

      const elapsed = Date.now() - start;
      if (elapsed < 500) {
        await new Promise((resolve) => setTimeout(resolve, 500 - elapsed));
      }

      const data = res.data.data;
      return {
        items: data.data as Comment[],
        nextCursor: data.nextCursor,
        hasNext: data.hasNext,
      };
    },

    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,

    initialPageParam: 0,
  });
};
