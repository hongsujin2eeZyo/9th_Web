import LpCard from "../components/LPCard";
import { useState, useEffect } from "react";
import { useFetchLp } from "../hooks/useFetchLp";
import SkeletonLpList from "../components/SkeletonLPList";
import FloatingButton from "../components/FloatingButton";
import { useInView } from "react-intersection-observer";
import SkeletonLpCard from "../components/SkeletonLpCard";

const MainContent = () => {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useFetchLp({ order });

  //정렬 바뀌면 목록 리셋
  useEffect(() => {
    refetch();
  }, [order]);

  // 스크롤 트리거
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <SkeletonLpList />;
  if (isError)
    return <p className="text-center text-red-500 mt-10">LP 목록을 불러오지 못했습니다 😢</p>;

  return (
    <div className="w-full bg-black text-white px-6 py-8">
      
      {/* 정렬 버튼 */}
      <div className="flex justify-end mb-4 space-x-2">
        <button
          onClick={() => setOrder("asc")}
          className={`px-3 py-1 rounded-md ${
            order === "asc" ? "bg-pink-500 text-white" : "bg-zinc-800 hover:bg-zinc-700"
          }`}
        >
          오래된순
        </button>
        <button
          onClick={() => setOrder("desc")}
          className={`px-3 py-1 rounded-md ${
            order === "desc" ? "bg-pink-500 text-white" : "bg-zinc-800 hover:bg-zinc-700"
          }`}
        >
          최신순
        </button>
      </div>

      {/* LP 카드 목록 */}
      <div className="grid grid-cols-5 gap-4">
        {data?.pages.flatMap(page =>
          page.items.map(lp => <LpCard key={lp.id} lp={lp} />)
        )}

        {isFetchingNextPage &&
          Array.from({ length: 5 }).map((_, i) => (
             <SkeletonLpCard key={`bottom-skeleton-${i}`} />
        ))
      }
      </div>



      {/* 무한스크롤 트리거 */}
      <div ref={ref} className="h-10" />

      {isFetchingNextPage && (
         <p className="text-center text-gray-400 text-sm mt-4 animate-pulse">
             더 불러오는 중...
      </p>
    )}

      <FloatingButton onClick={() => alert("LP 추가 기능 준비 중 🎧")} />
    </div>
  );
};

export default MainContent;
