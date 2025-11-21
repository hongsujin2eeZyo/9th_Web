import LpCard from "../components/LPCard";
import { useState, useEffect, useMemo } from "react";
import { useFetchLp } from "../hooks/useFetchLp";
import SkeletonLpList from "../components/SkeletonLPList";
import FloatingButton from "../components/FloatingButton";
import { useInView } from "react-intersection-observer";
import SkeletonLpCard from "../components/SkeletonLpCard";
import SortButtons from "../components/SortButtons";
import LpCreateModal from "../components/LpCreateModal"; // ✅ 추가

type MainContentProps = {
  searchQuery: string;
};

const MainContent = ({ searchQuery }: MainContentProps) => {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const { ref, inView } = useInView();

  // ✅ 모달 열림 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  const trimmedSearch = searchQuery.trim();
  const isSearching = trimmedSearch.length > 0;

  const {
    data: lpData,
    isLoading: isLpLoading,
    isError: isLpError,
    fetchNextPage: fetchLpNextPage,
    hasNextPage: hasLpNextPage,
    isFetchingNextPage: isLpFetchingNextPage,
  } = useFetchLp({ order, enabled: !isSearching });

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
    fetchNextPage: fetchSearchNextPage,
    hasNextPage: hasSearchNextPage,
    isFetchingNextPage: isSearchFetchingNextPage,
  } = useFetchLp({
    order,
    search: trimmedSearch,
    enabled: isSearching,
    mode: "search",
  });

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMemo(() => {
    if (isSearching) {
      return {
        data: searchData,
        isLoading: isSearchLoading,
        isError: isSearchError,
        fetchNextPage: fetchSearchNextPage,
        hasNextPage: hasSearchNextPage,
        isFetchingNextPage: isSearchFetchingNextPage,
      };
    }
    return {
      data: lpData,
      isLoading: isLpLoading,
      isError: isLpError,
      fetchNextPage: fetchLpNextPage,
      hasNextPage: hasLpNextPage,
      isFetchingNextPage: isLpFetchingNextPage,
    };
  }, [
    isSearching,
    lpData,
    searchData,
    isLpLoading,
    isSearchLoading,
    isLpError,
    isSearchError,
    fetchLpNextPage,
    fetchSearchNextPage,
    hasLpNextPage,
    hasSearchNextPage,
    isLpFetchingNextPage,
    isSearchFetchingNextPage,
  ]);

  // 무한 스크롤
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <SkeletonLpList />;
  if (isError)
    return <p className="text-center text-red-500 mt-10">LP 목록을 불러오지 못했습니다 😢</p>;

  return (
    <div className="w-full bg-black text-white px-6 py-8">
      
      {/* 정렬 버튼 */}
      <div className="flex flex-col gap-2 mb-4">
        <SortButtons order={order} setOrder={setOrder} />
        {isSearching && (
          <p className="text-sm text-gray-400">
            '{trimmedSearch}' 검색 결과
          </p>
        )}
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

      {/* ✅ + 버튼 클릭 → 모달 열기 */}
      <FloatingButton onClick={() => setIsModalOpen(true)} />

      {/* ✅ 모달 컴포넌트 연결 */}
      <LpCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default MainContent;
