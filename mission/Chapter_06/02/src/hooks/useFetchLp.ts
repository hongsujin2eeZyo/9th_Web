import { useQuery } from "@tanstack/react-query";
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
  order?: "asc" | "desc"; // 오래된순 / 최신순
  search?: string;        // 검색어
  cursor?: number;        // 다음 페이지 커서
  limit?: number;         // 페이지당 개수
};

export const useFetchLp = ({
  order = "desc",
  search = "",
  cursor = 0,
  limit = 20,
}: FetchLpParams) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch, //  재요청용 함수 추가
  } = useQuery({
    queryKey: ["lps", order, search, cursor, limit], // 파라미터 변경 시 자동 리패치
    queryFn: async () => {
      const res = await api.get("/v1/lps", {
        params: { order, search, cursor, limit },
      });
      return res.data.data.data as Lp[];
    },
    staleTime: 1000 * 60 * 5, // 5분 동안 새 요청 X
    gcTime: 1000 * 60 * 10,   // 10분 동안 캐시 유지
    retry: 2, // 실패 시 2회 재시도
  });

  return {
    lps: data ?? [],
    loading: isLoading,
    error: isError ? (error as Error).message : null,
    refetch, // MainContent에서 재시도 버튼에 사용
  };
};
