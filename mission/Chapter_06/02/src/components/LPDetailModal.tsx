import { useParams, useNavigate } from "react-router-dom";
import { Heart, X, Pencil, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { getToken } from "../utils/storage";
import { useFetchLpDetail } from "../hooks/useFetchLpDetail";
import SkeletonLpList from "./SkeletonLPList";

const LpDetailModal = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const token = getToken();
  const { data: lp, isLoading, isError, error } = useFetchLpDetail(Number(lpid));

  //비로그인 접근 시 차단
  useEffect(() => {
    if (!token) {
      alert("로그인이 필요한 서비스입니다. 로그인 후 이용해주세요.");
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) return null; // 로그인 안 된 상태에서는 아무것도 렌더하지 않음

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999]">
      <div className="relative bg-zinc-900 rounded-2xl w-[700px] max-h-[90vh] overflow-y-auto shadow-xl p-8">
        {/* 닫기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={22} />
        </button>

        {isLoading && <SkeletonLpList />}
        {isError && (
          <p className="text-red-400 text-center mt-8">
            {error instanceof Error ? error.message : "에러 발생"}
          </p>
        )}

        {lp && (
          <div className="flex flex-col space-y-5">
            {/* 작성자 / 날짜 */}
            <div className="flex justify-between text-gray-400 text-sm">
              <span>{lp.author?.name ?? "익명"}</span>
              <span>{new Date(lp.createdAt).toLocaleDateString()}</span>
            </div>

            {/* 제목 */}
            <h2 className="text-2xl font-bold text-white">{lp.title}</h2>

            {/* 썸네일 */}
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="rounded-lg shadow-md w-full aspect-square object-cover"
            />

            {/* 본문 */}
            <p className="text-gray-300 leading-relaxed text-sm">{lp.content}</p>

            {/* 좋아요 / 수정 / 삭제 */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t border-zinc-800">
              {/* 좋아요 */}
              <button
                className="flex items-center gap-2 text-pink-400 hover:text-pink-500 transition"
                onClick={() => alert("좋아요 기능 준비 중 🩷")}
              >
                <Heart size={18} fill="currentColor" />
                <span>{lp.likes?.length ?? 0}</span>
              </button>

              {/* 수정 */}
              <button
                className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                onClick={() => alert("수정 기능 준비 중 ✏️")}
              >
                <Pencil size={18} />
                <span className="text-sm">수정</span>
              </button>

              {/* 삭제 */}
              <button
                className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition"
                onClick={() => {
                  if (confirm("정말 삭제하시겠습니까?")) {
                    alert("삭제 기능 준비 중 🗑️");
                  }
                }}
              >
                <Trash2 size={18} />
                <span className="text-sm">삭제</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LpDetailModal;
