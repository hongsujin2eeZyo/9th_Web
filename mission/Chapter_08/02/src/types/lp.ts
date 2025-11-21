// LP 하나의 타입
export type Lp = {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    tags: { id: number; name: string }[];
    likes: { id: number; userId: number; lpId: number }[];
  };
  
  // 태그 검색 응답 타입 (React Query가 필요로 함)
  export type SearchTagResult = {
    data: Lp[];
    nextCursor: number | null;
    hasNext: boolean;
  };
  