import React, { useState } from "react";
import { useUser } from "../hooks/useUser";
import SortButtons from "./SortButtons";
import { useFetchMyLp } from "../hooks/useFetchMyLp";
import { useInView } from "react-intersection-observer";
import FloatingButton from "./FloatingButton";     
import LpCreateModal from "./LpCreateModal";   
import ProfileEditModal from "./ProfileEditModal";

const MyInfo = () => {
  const { user, isLoading: userLoading } = useUser();
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);


  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useFetchMyLp({ order });

  const { ref, inView } = useInView();


  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  const lpList = data?.pages.flatMap(page => page.items) ?? [];

  if (userLoading || isLoading) {
    return <div className="text-center text-white mt-20">LOADING...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-black text-white p-6">

      {/* 프로필 */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
          {user?.name[0]}
        </div>
        <div>
          <h1 className="text-xl font-bold">{user?.name}</h1>
          <p className="text-gray-400 text-sm">{user?.email}</p>

          {user?.bio ? (
            <p className="text-gray-300 text-sm mt-1">{user.bio}</p>
          ) : (
            <p className="text-gray-600 text-xs mt-1 italic">소개가 없습니다.</p>
          )}
        </div>
        <button
          onClick={() => setIsEditOpen(true)}
          className="px-3 py-1 bg-zinc-800 rounded hover:bg-zinc-700 text-sm"
        >
          ⚙ 설정
  </button>

      </div>

      <SortButtons order={order} setOrder={setOrder} />

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 opacity-80">
        {lpList.map((lp) => (
          <div
            key={lp.id}
            className="aspect-square bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition"
          >
            {lp.thumbnail ? (
                <img
                  src={lp.thumbnail}
                  alt={lp.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("❌ 이미지 로딩 실패:", lp.thumbnail);
                    console.log(" 내 LP 데이터:", lpList);
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                No Image
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 무한 스크롤 트리거 */}
      <div ref={ref} className="h-10" />

      
       <FloatingButton onClick={() => setIsModalOpen(true)} />


      <LpCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ProfileEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={user}
      />
    </div>
  );
};

export default MyInfo;

