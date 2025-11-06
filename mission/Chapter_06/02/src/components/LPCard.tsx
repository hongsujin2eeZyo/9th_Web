import { useNavigate, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import type { Lp } from "../hooks/useFetchLp";

const LpCard = ({ lp }: { lp: Lp }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      onClick={() =>
        navigate(`/lp/${lp.id}`, { state: { background: location } }) // ✅ 배경 저장
      }
      className="relative group overflow-hidden rounded-md cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
    >
      {/* 썸네일 이미지 */}
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
      />

      {/* 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        {/* 제목 */}
        <h3 className="text-white text-sm font-semibold truncate">{lp.title}</h3>

        {/* 업로드일 + 좋아요 */}
        <div className="flex items-center justify-between text-xs text-gray-300 mt-1">
          <span>{new Date(lp.createdAt).toLocaleDateString()}</span>
          <span className="flex items-center gap-1 text-pink-400">
            <Heart size={12} fill="currentColor" />
            {lp.likes?.length ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LpCard;
