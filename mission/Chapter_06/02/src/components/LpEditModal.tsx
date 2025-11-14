import React, { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  lp: {
    title: string;
    content: string;
    thumbnail: string;
  };
  onSave: (data: { title: string; content: string; thumbnail: string }) => void;
};

const LpEditModal = ({ isOpen, onClose, lp, onSave }: Props) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(lp.title);
  const [content, setContent] = useState(lp.content);
  const [thumbnail, setThumbnail] = useState(lp.thumbnail);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
      <div className="bg-zinc-800 p-6 rounded-xl w-[400px]">
        <h2 className="text-xl font-bold mb-4">LP 수정</h2>

        <label className="text-sm text-gray-300">제목</label>
        <input
          className="w-full p-2 mt-1 bg-zinc-700 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="text-sm text-gray-300 mt-4 block">내용</label>
        <textarea
          className="w-full p-2 mt-1 bg-zinc-700 rounded"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <label className="text-sm text-gray-300 mt-4 block">썸네일</label>
        <input
          className="w-full p-2 mt-1 bg-zinc-700 rounded"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-3 py-1 bg-gray-600 rounded">
            취소
          </button>
          <button
            onClick={() => onSave({ title, content, thumbnail })}
            className="px-3 py-1 bg-pink-500 rounded"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default LpEditModal;
