import { useParams, useNavigate } from "react-router-dom";
import { Heart, X, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getToken } from "../utils/storage";
import { useFetchLpDetail } from "../hooks/useFetchLpDetail";
import SkeletonLpList from "./SkeletonLPList";
import { useInView } from "react-intersection-observer";
import { useFetchLpComments } from "../hooks/useFetchLpComments";
import { useCreateLpComment } from "../hooks/useCreateLpComment"; 
import SkeletonComment from "./SkeletonComment";


const LpDetailModal = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const token = getToken();

  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [commentInput, setCommentInput] = useState("");
  const [commentError, setCommentError] = useState("");

  const { data: lp, isLoading, isError, error } = useFetchLpDetail(Number(lpid));
  const createComment = useCreateLpComment(Number(lpid));

  const { ref, inView } = useInView();

  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useFetchLpComments(Number(lpid), order);

  // 비로그인 접근 차단
  useEffect(() => {
    if (!token) {
      alert("로그인이 필요한 서비스입니다. 로그인 후 이용해주세요.");
      navigate("/login");
    }
  }, [token, navigate]);

  // 정렬 변경 시 목록 리로드
  useEffect(() => {
    refetch();
  }, [order]);

  // 무한스크롤 트리거
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  //  댓글 등록 함수 연결
  const handleSubmitComment = () => {
    if (!commentInput.trim()) {
      setCommentError("댓글을 입력해주세요.");
      return;
    }
    setCommentError("");

    createComment.mutate(commentInput, {
      onSuccess: () => {
        setCommentInput(""); // 입력창 비우기
        refetch(); // 목록 다시 불러오기
      },
    });
  };

  if (!token) return null;


  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999]">
      <div className="relative bg-zinc-900 rounded-2xl w-[700px] max-h-[90vh] overflow-y-auto shadow-xl p-8">

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
            <div className="flex justify-between text-gray-400 text-sm">
              <span>{lp.author?.name ?? "익명"}</span>
              <span>{new Date(lp.createdAt).toLocaleDateString()}</span>
            </div>

            <h2 className="text-2xl font-bold text-white">{lp.title}</h2>

            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="rounded-lg shadow-md w-full aspect-square object-cover"
            />

            <p className="text-gray-300 text-sm">{lp.content}</p>

            {/* 댓글 입력 */}
            <div className="mb-4 flex flex-col gap-2">
              <textarea
                value={commentInput}
                onChange={(e) => {
                  setCommentInput(e.target.value);
                  if (e.target.value.trim()) setCommentError("");
                }}
                placeholder="댓글을 작성해주세요..."
                className="w-full bg-zinc-800 text-white rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                rows={3}
                disabled={createComment.isPending}
              />

              {commentError && (
                <p className="text-red-400 text-xs">{commentError}</p>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleSubmitComment}
                  className="bg-pink-600 hover:bg-pink-700 text-white text-sm px-4 py-2 rounded-md transition disabled:opacity-50"
                  disabled={!commentInput.trim() || createComment.isPending}
                >
                  {createComment.isPending ? "등록 중..." : "댓글 등록"}
                </button>
              </div>
            </div>

            {/* 정렬 버튼 */}
            <div className="flex gap-2">
              <button
                onClick={() => setOrder("asc")}
                className={`px-3 py-1 rounded-md text-sm ${
                  order === "asc"
                    ? "bg-pink-500 text-white"
                    : "bg-zinc-800 hover:bg-zinc-700 text-gray-300"
                }`}
              >
                오래된순
              </button>
              <button
                onClick={() => setOrder("desc")}
                className={`px-3 py-1 rounded-md text-sm ${
                  order === "desc"
                    ? "bg-pink-500 text-white"
                    : "bg-zinc-800 hover:bg-zinc-700 text-gray-300"
                }`}
              >
                최신순
              </button>
            </div>


            {/* 댓글 */}
            {comments === undefined && (
              <div className="flex flex-col gap-2 mt-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonComment key={i} />
                ))}
              </div>
            )}

          {comments?.pages.flatMap((page) =>
            page.items.map((comment) => (
              <div
                key={comment.id}
                className="bg-zinc-800 p-3 rounded-md text-sm text-gray-200 mb-2"
              >
                <p className="text-pink-300 text-xs">{comment.author.name}</p>
                {comment.content}
                <p className="text-[11px] text-gray-400 mt-1">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}

          {isFetchingNextPage && (
            <div className="flex flex-col gap-2 mt-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <SkeletonComment key={i} />
              ))}
            </div>
          )}


          <div ref={ref} className="h-5" />

      

            {isFetchingNextPage && (
              <p className="text-center text-gray-500 text-sm mt-2">
                댓글 불러오는 중...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LpDetailModal;
