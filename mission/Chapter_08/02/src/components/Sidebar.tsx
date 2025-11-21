import React, { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { deleteUser } from "../api/auth";
import { useMutation } from "@tanstack/react-query";
import { removeToken } from "../utils/storage";

type SidebarProps = {
  isOpen: boolean;
};

const Sidebar = ({ isOpen }: SidebarProps) => {
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 🔥 탈퇴 mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      alert("회원 탈퇴가 완료되었습니다.");
      removeToken();
      navigate("/login", { replace: true });
    },
    onError: () => {
      alert("탈퇴 중 오류가 발생했습니다.");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <div
        className={`fixed left-0 top-16 bottom-0 bg-zinc-900 text-white w-64 p-5 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="space-y-4">
          <li className="hover:text-pink-400 cursor-pointer flex items-center space-x-2">
            <Search size={16} className="text-pink-400" />
            <span>찾기</span>
          </li>
          <li
            className="hover:text-pink-400 cursor-pointer"
            onClick={() => navigate("/mypage")}
          >
            마이페이지
          </li>
        </ul>

        {/* 탈퇴 버튼 */}
        <ul className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <li
            className="hover:text-pink-400 cursor-pointer text-xs text-center"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            탈퇴하기
          </li>
        </ul>
      </div>

      {/*  탈퇴 확인 모달 */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default Sidebar;
