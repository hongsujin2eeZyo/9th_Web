import React, { useState } from "react";
import { X } from "lucide-react";
import { createLP } from "../api/lp";
import { useQueryClient } from "@tanstack/react-query";

type LpCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LpCreateModal = ({ isOpen, onClose }: LpCreateModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(""); 
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  if (!isOpen) return null;

  const addTag = () => {
    if (!tagInput.trim()) return;
    setTags(prev => [...prev, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (targetIndex: number) => {
    setTags(prev => prev.filter((_, idx) => idx !== targetIndex));
  };


  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("LP 제목을 입력해주세요.");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      await createLP({
        title,
        content,
        thumbnail, // ✅ 이제 URL string
        tags,
      });
  
      alert("LP 생성 성공 🎧");
  
      queryClient.invalidateQueries({ queryKey: ["my-lps"] });
  
      setTitle("");
      setContent("");
      setThumbnail("");
      setTags([]);
      onClose();
    } catch (err: any) {
      console.error("createLP error", err);
      alert("LP 생성 실패 ❗");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
  
    const imageUrl = URL.createObjectURL(file);
    setThumbnail(imageUrl);
  };
  
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-zinc-800 rounded-xl w-[350px] md:w-[420px] p-6 flex flex-col gap-4 z-[1000]">

        <button className="absolute right-4 top-4 text-gray-300 hover:text-white" onClick={onClose}>
          <X size={20} />
        </button>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange} 
            className="w-full text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-pink-500 file:text-white hover:file:bg-pink-600"
          />
        </div>

        {/* <input
          type="text"
          placeholder="Thumbnail URL"
          className="bg-zinc-700 p-2 w-full rounded-md text-gray-200"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
        /> */}

        <input
          type="text"
          placeholder="LP Name"
          className="bg-zinc-700 p-2 w-full rounded-md text-gray-200"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="LP Content"
          className="bg-zinc-700 p-2 w-full rounded-md text-gray-200"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="LP Tag"
            className="bg-zinc-700 p-2 w-full rounded-md text-gray-200"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
          />
          <button onClick={addTag} className="px-3 bg-zinc-600 rounded-md hover:bg-zinc-500">
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 max-h-16 overflow-y-auto">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-pink-500 text-white text-xs rounded-md cursor-pointer hover:bg-pink-600"
              onClick={() => removeTag(index)}
            >
              #{tag}
            </span>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="py-3 rounded-md bg-gray-300 text-black font-semibold hover:bg-gray-200 disabled:bg-gray-600"
        >
          {isSubmitting ? "Creating..." : "Add LP"}
        </button>
      </div>
    </div>
  );
};

export default LpCreateModal;
