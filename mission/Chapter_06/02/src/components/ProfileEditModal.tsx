import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../api/user";
import { postImage } from "../api/upload"; // 이미지 업로드 API

type ProfileEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    bio?: string | null;
    avatar?: string | null;
  } | null;
};

const ProfileEditModal = ({ isOpen, onClose, user }: ProfileEditModalProps) => {
  if (!isOpen || !user) return null;

  const queryClient = useQueryClient();

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? "");
  const [avatar, setAvatar] = useState(user.avatar ?? "");

  // 🔥 이미지 업로드
  const handleUploadImage = async (file: File) => {
    if (!file) return;

    try {
      const imageUrl = await postImage(file);
      setAvatar(imageUrl);
    } catch (err) {
      console.error("이미지 업로드 실패", err);
    }
  };

  // 유저 정보 수정 mutation
  const updateMutation = useMutation({
    mutationFn: () => updateUser({ name, bio, avatar }),
    onSuccess: () => {
      alert("프로필이 수정되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["my-info"] });
      onClose();
    },
    onError: () => {
      alert("프로필 수정 실패 ❗");
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      alert("이름은 필수입니다.");
      return;
    }
    updateMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="bg-zinc-800 p-6 rounded-xl w-[350px]">
        <h2 className="text-xl font-bold mb-4">프로필 수정</h2>

        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={avatar || "/default-avatar.png"}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover mb-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUploadImage(file);
            }}
            className="text-sm text-gray-300"
          />
        </div>

        {/* 이름 */}
        <div className="mb-3">
          <label className="text-sm text-gray-300">이름</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-zinc-700 text-white mt-1"
          />
        </div>

        {/* bio */}
        <div className="mb-4">
          <label className="text-sm text-gray-300">소개 (Bio)</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full p-2 rounded bg-zinc-700 text-white mt-1"
            placeholder="자기소개를 입력하세요 (선택)"
          />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 bg-gray-600 rounded hover:bg-gray-500"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-2 bg-pink-600 rounded hover:bg-pink-500"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
