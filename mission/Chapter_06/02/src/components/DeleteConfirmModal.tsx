// components/DeleteConfirmModal.tsx
import React from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-6 rounded-xl w-80 text-center">
        <h2 className="text-lg font-bold mb-3">정말 탈퇴하시겠습니까?</h2>
        <p className="text-gray-300 text-sm mb-6">
          탈퇴하면 모든 정보가 삭제되며 되돌릴 수 없습니다.
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
          >
            아니오
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-pink-600 rounded hover:bg-red-500"
          >
            예, 탈퇴할래요
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
