import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axiosInstance";


export type LpDetail = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;

  authorId: number; 
  author: {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
  };

  createdAt: string;
  updatedAt: string;

  tags: { id: number; name: string }[];
  likes: { id: number; userId: number; lpId: number }[];

};

// LP 상세 조회 훅
export const useFetchLpDetail = (lpid: number | null) => {
  return useQuery({
    queryKey: ["lp", lpid], // LP별 캐시 구분
    queryFn: async () => {
      if (!lpid) throw new Error("잘못된 LP ID");
      const res = await api.get(`/v1/lps/${lpid}`);
      return res.data.data as LpDetail;
    },
    enabled: !!lpid, // lpid가 있을 때만 실행
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
    gcTime: 1000 * 60 * 10,   // 10분 후 메모리에서 제거
    retry: 2, // 요청 실패 시 2회 재시도
  });
};
