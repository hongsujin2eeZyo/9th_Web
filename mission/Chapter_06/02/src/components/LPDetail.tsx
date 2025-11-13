import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getToken } from "../utils/storage";

import { useFetchLpDetail } from "../hooks/useFetchLpDetail";
import { useFetchLpComments } from "../hooks/useFetchLpComments";
import { useCreateLpComment } from "../hooks/useCreateLpComment";

import SkeletonLpList from "../components/SkeletonLPList";
import SkeletonComment from "../components/SkeletonComment";

const LpDetail = () => {
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

  useEffect(() => {
    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  }, [token]);

  useEffect(() => {
    refetch();
  }, [order]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  const handleSubmitComment = () => {
    if (!commentInput.trim()) {
      setCommentError("댓글을 입력해주세요.");
      return;
    }
    setCommentError("");

    createComment.mutate(commentInput, {
      onSuccess: () => {
        setCommentInput("");
        refetch();
      },
    });
  };

  if (!token) return null;

  return (
    <div className="bg-black min-h-screen text-white p-8">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate(-1)}
        className="text-gray-400 hover:text-white mb-6"
      >
        ← 뒤로가기
      </button>

      {isLoading && <SkeletonLpList />}
      {isError && (
        <p className="text-red-400 text-center mt-8">
          {error instanceof Error ? error.message : "에러 발생"}
        </p>
      )}

      {lp && (
        <div className="max-w-[700px] mx-auto space-y-5">
          <div className="flex justify-between text-gray-400 text-sm">
            <span>{lp.author?.name ?? "익명"}</span>
            <span>{new Date(lp.createdAt).toLocaleDateString()}</span>
          </div>

          <h2 className="text-3xl font-bold">{lp.title}</h2>

          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="rounded-lg w-full aspect-square object-cover"
          />

          <p className="text-gray-300 text-sm">{lp.content}</p>

          {/* 댓글 입력 */}
          <div className="mt-6">
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="댓글을 작성해주세요..."
              className="w-full bg-zinc-800 text-white p-3 rounded-md focus:ring-2 focus:ring-pink-500"
              rows={3}
            />
            {commentError && <p className="text-red-400 text-xs mt-1">{commentError}</p>}

            <div className="flex justify-end mt-2">
              <button
                onClick={handleSubmitComment}
                className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-md text-sm"
                disabled={createComment.isPending}
              >
                댓글 등록
              </button>
            </div>
          </div>

          {/* 정렬 버튼 */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setOrder("asc")}
              className={`px-3 py-1 rounded-md ${
                order === "asc" ? "bg-pink-500" : "bg-zinc-800"
              }`}
            >
              오래된순
            </button>
            <button
              onClick={() => setOrder("desc")}
              className={`px-3 py-1 rounded-md ${
                order === "desc" ? "bg-pink-500" : "bg-zinc-800"
              }`}
            >
              최신순
            </button>
          </div>

          {/* 댓글 리스트 */}
          <div className="mt-4">
            {comments?.pages.flatMap((page) =>
              page.items.map((c) => (
                <div
                  key={c.id}
                  className="bg-zinc-800 p-3 rounded-md text-sm mb-2"
                >
                  <p className="text-pink-300 text-xs">{c.author.name}</p>
                  {c.content}
                  <p className="text-[11px] text-gray-400 mt-1">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          {isFetchingNextPage && <SkeletonComment />}

          {/* 무한스크롤 트리거 */}
          <div ref={ref} className="h-5" />

        </div>
      )}
    </div>
  );
};

export default LpDetail;
