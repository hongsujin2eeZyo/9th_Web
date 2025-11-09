import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../api/axiosInstance";

export type Lp = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  likes?: { id: number; userId: number; lpId: number }[];
};

type FetchLpParams = {
  order?: "asc" | "desc";
  search?: string;
  limit?: number;
};

export const useFetchLp = ({
  order = "desc",
  search = "",
  limit = 10,
}: FetchLpParams) => {

  return useInfiniteQuery({
    queryKey: ["lps", order, search, limit],
    queryFn: async ({ pageParam = 0 }) => {
      await new Promise(res => setTimeout(res, 800)); 
      const res = await api.get("/v1/lps", {
        params: { order, search, cursor: pageParam, limit },
      });

      const data = res.data.data;
      return {
        items: data.data as Lp[],
        nextCursor: data.nextCursor,
        hasNext: data.hasNext,
      };
    },

    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,

    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });
};
