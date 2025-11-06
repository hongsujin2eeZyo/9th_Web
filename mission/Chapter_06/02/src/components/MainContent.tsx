import LpCard from "../components/LPCard";
import { useState } from "react";
import { useFetchLp } from "../hooks/useFetchLp";
import SkeletonLpList from "../components/SkeletonLPList";
import FloatingButton from "../components/FloatingButton";

const MainContent = () => {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const { lps, loading, error } = useFetchLp({ order });

  if (loading) return <SkeletonLpList />;
  if (error)
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

      {/* LP 카드 리스트 */}
      <div className="grid grid-cols-5 gap-4">
        {lps.map((lp) => (
          <LpCard key={lp.id} lp={lp} />
        ))}
      </div>

      <FloatingButton onClick={() => alert("LP 추가 기능 준비 중 🎧")} />
    </div>
  );
};

export default MainContent;
