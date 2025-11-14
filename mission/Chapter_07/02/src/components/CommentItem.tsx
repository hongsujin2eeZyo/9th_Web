import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLpComment, deleteLpComment } from "../api/lpComment";
import type { Comment } from "../hooks/useFetchLpComments";

type CommentItemProps = {
  comment: Comment;
  lpId: number;
  myId?: number;
};

const CommentItem = ({ comment, lpId, myId }: CommentItemProps) => {
  const queryClient = useQueryClient();

  const isMine = myId === comment.author.id;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  // 댓글 수정
  const updateMutation = useMutation({
    mutationFn: (newContent: string) =>
      updateLpComment(lpId, comment.id, newContent),
    onSuccess: () => {
      // 댓글 목록 invalidate
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
      setIsEditing(false);
      setIsMenuOpen(false);
    },
  });

  //  댓글 삭제
  const deleteMutation = useMutation({
    mutationFn: () => deleteLpComment(lpId, comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
      setIsMenuOpen(false);
    },
  });

  const handleSave = () => {
    if (!editContent.trim()) return;
    updateMutation.mutate(editContent);
  };

  const handleDelete = () => {
    if (confirm("댓글을 삭제하시겠습니까?")) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="bg-zinc-800 p-3 rounded-md text-sm mb-2 relative">
      {/* 작성자 */}
      <p className="text-pink-300 text-xs mb-1">{comment.author.name}</p>

      {/* 수정 모드 */}
      {isEditing ? (
        <>
          <textarea
            className="w-full bg-zinc-700 text-white p-2 rounded-md"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className="flex gap-2 justify-end mt-2">
            <button
              className="px-3 py-1 bg-gray-600 rounded-md"
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
              }}
            >
              취소
            </button>
            <button
              className="px-3 py-1 bg-pink-500 rounded-md"
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* 댓글 내용 */}
          <p>{comment.content}</p>

          {/* 댓글 날짜 */}
          <p className="text-[11px] text-gray-400 mt-1">
            {new Date(comment.createdAt).toLocaleString()}
          </p>
        </>
      )}

      {/* 내 댓글일 때만 메뉴 버튼 */}
      {isMine && !isEditing && (
        <button
          className="absolute right-2 top-2 text-gray-300 hover:text-white"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          ⋯
        </button>
      )}

      {/* 수정/삭제 메뉴 */}
      {isMenuOpen && (
        <div className="absolute right-2 top-8 bg-zinc-700 p-2 rounded-md text-xs w-24">
          <button
            className="block w-full text-left px-2 py-1 hover:bg-zinc-600"
            onClick={() => {
              setIsEditing(true);
              setIsMenuOpen(false);
            }}
          >
            수정
          </button>
          <button
            className="block w-full text-left px-2 py-1 hover:bg-zinc-600 text-red-400"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
