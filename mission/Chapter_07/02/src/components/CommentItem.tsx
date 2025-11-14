import { useState } from "react";
import type { Comment } from "../hooks/useFetchLpComments";

type CommentItemProps = {
  comment: Comment;
  myId?: number;
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
};

const CommentItem = ({ comment, myId, onEdit, onDelete }: CommentItemProps) => {
  const isMine = myId === comment.author.id;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleSave = () => {
    if (!editContent.trim()) return;
    onEdit(comment.id, editContent);
    setIsEditing(false);
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-zinc-800 p-3 rounded-md text-sm mb-2 relative">
      {/* 작성자 이름 */}
      <p className="text-pink-300 text-xs mb-1">{comment.author.name}</p>

      {/* 수정모드 */}
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
              onClick={() => setIsEditing(false)}
            >
              취소
            </button>
            <button
              className="px-3 py-1 bg-pink-500 rounded-md"
              onClick={handleSave}
            >
              저장
            </button>
          </div>
        </>
      ) : (
        <>
          <p>{comment.content}</p>
          <p className="text-[11px] text-gray-400 mt-1">
            {new Date(comment.createdAt).toLocaleString()}
          </p>
        </>
      )}

      {/* 내 댓글만 메뉴 */}
      {isMine && (
        <button
          className="absolute right-2 top-2 text-gray-300 hover:text-white"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          ⋯
        </button>
      )}

      {/* 수정 / 삭제 메뉴 */}
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
            onClick={() => onDelete(comment.id)}
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
