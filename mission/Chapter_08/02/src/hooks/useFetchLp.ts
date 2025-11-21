import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../api/axiosInstance";

export type Lp = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  authorId: number;   

  likes?: { id: number; userId: number; lpId: number }[];
  tags?: { id: number; name: string }[];  

};

type FetchLpParams = {
  order?: "asc" | "desc";
  search?: string;
  limit?: number;
  enabled?: boolean;
  mode?: "all" | "search";
};

export const useFetchLp = ({
  order = "desc",
  search = "",
  limit = 10,
  enabled = true,
  mode = "all",
}: FetchLpParams) => {
  const trimmedSearch = search?.trim() ?? "";
  const queryKey =
    mode === "search"
      ? ["search", trimmedSearch, order, limit]
      : ["lps", order, limit];

  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      await new Promise(res => setTimeout(res, 800)); 
      const res = await api.get("/v1/lps", {
        params: {
          order,
          cursor: pageParam,
          limit,
          ...(trimmedSearch ? { search: trimmedSearch } : {}),
        },
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
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    retry: 2,
    enabled,
  });
};
