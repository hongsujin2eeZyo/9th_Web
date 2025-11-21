import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createLP } from "../api/lp";
import { postImage } from "../api/upload"; 

type LpCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LpCreateModal = ({ isOpen, onClose }: LpCreateModalProps) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    thumbnail: "", 
    published: true,
  });

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // LP 생성
  const { mutate } = useMutation({
    mutationFn: createLP,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-lps"] });
      alert("LP 생성 성공 🎧");
      onClose();
    },
    onError: (err: any) => {
      console.error("Error:", err);
      alert("생성 실패 ❗");
    },
  });

  if (!isOpen) return null;

  // 공통 input handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 이미지 클릭 → 파일 input 열기
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 🔥 파일 선택 → 서버 업로드 → URL 반환
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await postImage(file); // 🔥 여기서 URL을 받아옴
      setFormData((prev) => ({ ...prev, thumbnail: imageUrl }));
    } catch (error) {
      console.error("upload error:", error);
      alert("이미지 업로드 실패 ❗");
    }
  };

  // 태그 추가
  const addTag = () => {
    if (!tagInput.trim()) return;
    setTags((prev) => [...prev, tagInput.trim()]);
    setTagInput("");
  };

  // LP 생성 제출
  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    const body = {
      ...formData,
      tags,
    };

    mutate(body);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-zinc-800 rounded-xl w-[400px] p-6 shadow-lg">

        {/* 닫기 버튼 */}
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* 이미지 업로드 부분 */}
        <div
          onClick={handleImageClick}
          className="mx-auto mt-4 mb-6 w-40 h-40 rounded-full overflow-hidden cursor-pointer border border-gray-600"
        >
          <img
            src={
              formData.thumbnail ||
              "https://via.placeholder.com/300?text=Upload+Image"
            }
            className="w-full h-full object-cover"
          />
        </div>

        {/* 숨겨진 실제 input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* 제목 */}
        <input
          type="text"
          name="title"
          placeholder="LP Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full bg-zinc-700 text-white p-2 rounded-md mb-3"
        />

        {/* 내용 */}
        <input
          type="text"
          name="content"
          placeholder="LP Content"
          value={formData.content}
          onChange={handleChange}
          className="w-full bg-zinc-700 text-white p-2 rounded-md mb-3"
        />

        {/* 태그 */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            placeholder="Tag"
            className="flex-1 bg-zinc-700 text-white p-2 rounded-md"
          />
          <button
            onClick={addTag}
            className="px-3 bg-gray-400 rounded-md text-black font-bold"
          >
            Add
          </button>
        </div>

        {/* 태그 목록 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="bg-pink-500 px-2 py-1 rounded-md text-white text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 제출 버튼 */}
        <button
          onClick={handleSubmit}
          className="w-full bg-gray-300 text-black py-3 rounded-md font-semibold"
        >
          Add LP
        </button>
      </div>
    </div>
  );
};

export default LpCreateModal;
