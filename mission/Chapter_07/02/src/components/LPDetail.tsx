import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getToken } from "../utils/storage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useFetchLpDetail } from "../hooks/useFetchLpDetail";
import { useFetchLpComments } from "../hooks/useFetchLpComments";
import CommentItem from "../components/CommentItem";
import LpEditModal from "../components/LpEditModal";

import type { Comment } from "../hooks/useFetchLpComments";
import { useCreateLpComment } from "../hooks/useCreateLpComment";

import SkeletonLpList from "../components/SkeletonLPList";
import SkeletonComment from "../components/SkeletonComment";

import { useDeleteLp } from "../hooks/useDeleteLp";
import { getMyInfo } from "../api/user";
import { updateLp, toggleLike } from "../api/lp";
import { updateLpComment, deleteLpComment } from "../api/lpComment";

const LpDetail = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const lpId = Number(lpid);

  const token = getToken();
  const queryClient = useQueryClient();

  // 삭제 훅
  const deleteLpMutation = useDeleteLp(lpId);

  // 로그인 유저 정보
  const { data: myInfo } = useQuery({
    queryKey: ["my-info"],
    queryFn: getMyInfo,
  });

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [commentInput, setCommentInput] = useState("");
  const [commentError, setCommentError] = useState("");

  const { data: lp, isLoading, isError, error } = useFetchLpDetail(lpId);
  const createComment = useCreateLpComment(lpId);

  const { ref, inView } = useInView();

  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useFetchLpComments(lpId, order);

  // LP 수정 mutation
  const updateLpMutation = useMutation({
    mutationFn: (data: { title: string; content: string; thumbnail: string }) =>
      updateLp(lpId, data),
    onSuccess: () => {
      alert("LP가 수정되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
      setIsEditOpen(false);
    },
  });

  // 좋아요 mutation
  const likeMutation = useMutation({
    mutationFn: () => toggleLike(lpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
    },
  });

  // 로그인 안 되어 있으면 이동
  useEffect(() => {
    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  }, [token]);

  // 정렬 변경 → 댓글 refetch
  useEffect(() => {
    refetch();
  }, [order]);

  // 무한 스크롤
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  // 댓글 작성
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

 

  if (isLoading) return <SkeletonLpList />;
  if (isError)
    return (
      <p className="text-red-400 text-center mt-8">
        {error instanceof Error ? error.message : "에러 발생"}
      </p>
    );

  if (!lp) return null;

  return (
    <div className="bg-black min-h-screen text-white p-8">
      {/* 뒤로가기 */}
      <button
        onClick={() => navigate(-1)}
        className="text-gray-400 hover:text-white mb-6"
      >
        ← 뒤로가기
      </button>

      {/* 본인 글 수정/삭제 버튼 */}
      {myInfo && lp.authorId === myInfo.id && (
        <div className="flex gap-3 mb-6 justify-end">
          <button
            onClick={() => setIsEditOpen(true)}
            className="hover:text-blue-500"
          >
            수정
          </button>

          <button
            onClick={() => {
              if (confirm("정말 이 LP를 삭제하시겠습니까?")) {
                deleteLpMutation.mutate();
                navigate("/");
              }
            }}
            className="hover:text-red-500"
          >
            삭제
          </button>
        </div>
      )}

      {/* LP 정보 */}
      <div className="max-w-[700px] mx-auto space-y-5">

        <div className="flex justify-between text-gray-400 text-sm">
          <span>{lp.author.name}</span>
          <span>{new Date(lp.createdAt).toLocaleDateString()}</span>
        </div>

        <h2 className="text-3xl font-bold">{lp.title}</h2>

        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="rounded-lg w-full aspect-square object-cover"
        />

        <p className="text-gray-300 text-sm">{lp.content}</p>

        {/* 좋아요 버튼 */}
        <button
          onClick={() => likeMutation.mutate()}
          className="text-pink-400 hover:text-pink-500 mt-4"
        >
          좋아요 ({lp.likes?.length || 0})
        </button>

        {/* 댓글 입력 */}
        <div className="mt-6">
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="댓글을 작성해주세요..."
            className="w-full bg-zinc-800 text-white p-3 rounded-md focus:ring-2 focus:ring-pink-500"
            rows={3}
          />
          {commentError && (
            <p className="text-red-400 text-xs mt-1">{commentError}</p>
          )}

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
            page.items.map((c: Comment) => (
              <CommentItem
                key={c.id}
                comment={c}
                lpId={lpId}
                myId={myInfo?.id}

              />
            ))
          )}
        </div>

        {isFetchingNextPage && <SkeletonComment />}

        {/* 무한 스크롤 트리거 */}
        <div ref={ref} className="h-5" />
      </div>

      {/* LP 수정 모달 */}
      {isEditOpen && (
        <LpEditModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          lp={{
            title: lp.title,
            content: lp.content,
            thumbnail: lp.thumbnail,
          }}
          onSave={(data) => updateLpMutation.mutate(data)}
        />
      )}
    </div>
  );
};

export default LpDetail;
