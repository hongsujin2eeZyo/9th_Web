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

export const useFetchMyLp = ({
  order = "desc",
  search = "",
  limit = 10,
}: FetchLpParams) => {
  return useInfiniteQuery({
    queryKey: ["my-lps", order, search, limit], // ✅ 여기 중요 (my-lps)

    queryFn: async ({ pageParam = 0 }) => {
      const res = await api.get("/v1/lps/user", { // ✅ "내 LP" API
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
  

    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
