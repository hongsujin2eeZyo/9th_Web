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

import { updateLpComment, deleteLpComment } from "../api/lpComment";
import { updateLp, toggleLike } from "../api/lp";

const LpDetail = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const lpId = Number(lpid);

  const token = getToken();
  const queryClient = useQueryClient();

  // LP 삭제 훅
  const deleteLpMutation = useDeleteLp(lpId);

  // 로그인 유저 정보
  const { data: myInfo } = useQuery({
    queryKey: ["my-info"],
    queryFn: getMyInfo,
  });

  // LP 수정 모달
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [order] = useState<"asc" | "desc">("desc");
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

  /* 댓글 수정 */
  const updateCommentMutation = useMutation({
    mutationFn: (params: { commentId: number; content: string }) =>
      updateLpComment(lpId, params.commentId, params.content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
    },
  });

  /* 댓글 삭제 */
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteLpComment(lpId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
    },
  });

  /* 좋아요 */
  const likeMutation = useMutation({
    mutationFn: () => toggleLike(lpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
    },
  });

  /* LP 수정 */
  const updateLpMutation = useMutation({
    mutationFn: (data: { title: string; content: string; thumbnail: string }) =>
      updateLp(lpId, data),
    onSuccess: () => {
      alert("LP가 수정되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
      setIsEditOpen(false);
    },
  });

  /* 로그인 확인 */
  useEffect(() => {
    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  }, [token]);

  /* 정렬 변경 */
  useEffect(() => {
    refetch();
  }, [order]);

  /* 무한 스크롤 */
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage]);

  /* 댓글 작성 */
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

      {/* 본인 글 수정/삭제 */}
      {myInfo && lp.authorId === myInfo.id && (
        <div className="flex gap-3 mb-6 justify-end">
          <button onClick={() => setIsEditOpen(true)}>수정</button>
          <button
            onClick={() => {
              if (confirm("정말 이 LP를 삭제하시겠습니까?")) {
                deleteLpMutation.mutate();
                navigate("/");
              }
            }}
            className="text-red-400"
          >
            삭제
          </button>
        </div>
      )}

      {/* LP 본문 */}
      <div className="max-w-[700px] mx-auto space-y-5">
        <h2 className="text-3xl font-bold">{lp.title}</h2>

        {/* 작성자 정보 */}
        <div className="flex items-center gap-4 text-sm text-gray-300">
          {lp.author?.avatar ? (
            <img
              src={lp.author.avatar}
              alt={`${lp.author.name} 프로필`}
              className="w-14 h-14 rounded-full object-cover border border-zinc-700"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center text-lg font-semibold">
              {lp.author?.name ? lp.author.name[0] : "?"}
            </div>
          )}
          <div>
            <p className="text-white font-semibold">
              {lp.author?.name ?? "알 수 없음"}
            </p>
          
            <p className="text-xs text-gray-500">
              {new Date(lp.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <img src={lp.thumbnail} className="rounded-lg w-full" />

        <p className="text-gray-300 text-sm">{lp.content}</p>

        {/* 좋아요 */}
        <button
          onClick={() => likeMutation.mutate()}
          className="text-pink-400 hover:text-pink-500 mt-4"
        >
          좋아요 ({lp.likes?.length || 0})
        </button>

        {/* 댓글 영역 */}
        <div className="mt-6">
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="w-full bg-zinc-800 p-3 rounded-md"
            rows={3}
            placeholder="댓글을 작성해주세요..."
          />
          {commentError && (
            <p className="text-red-400 text-xs mt-1">{commentError}</p>
          )}

          <button
            className="bg-pink-600 px-4 py-2 rounded-md mt-2"
            onClick={handleSubmitComment}
          >
            댓글 등록
          </button>
        </div>

        {/* 댓글 리스트 */}
        <div className="mt-4">
          {comments?.pages.flatMap((page) =>
            page.items.map((c: Comment) => (
              <CommentItem
                key={c.id}
                comment={c}
                myId={myInfo?.id}
                onEdit={(id, content) =>
                  updateCommentMutation.mutate({ commentId: id, content })
                }
                onDelete={(id) => deleteCommentMutation.mutate(id)}
              />
            ))
          )}
        </div>

        {isFetchingNextPage && <SkeletonComment />}
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
