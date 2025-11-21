import React from "react";
import { Plus } from "lucide-react"; // 아이콘 (lucide-react 설치 필요)

type FloatingButtonProps = {
  onClick?: () => void;
};

const FloatingButton = ({ onClick }: FloatingButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-pink-500 hover:bg-pink-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
    >
      <Plus size={24} />
    </button>
  );
};

export default FloatingButton;
