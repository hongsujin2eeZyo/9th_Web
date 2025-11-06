import React from "react";

type AddLpFormProps = {
  onBack: () => void;
};

const AddLpForm = ({ onBack }: AddLpFormProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h2 className="text-3xl font-bold mb-6 text-pink-400">새 LP 추가하기</h2>
      <form className="flex flex-col gap-4 w-1/3">
        <input
          type="text"
          placeholder="앨범 제목"
          className="p-2 rounded bg-zinc-800 text-white border border-zinc-700"
        />
        <textarea
          placeholder="앨범 설명"
          className="p-2 rounded bg-zinc-800 text-white border border-zinc-700 h-32"
        />
        <input
          type="file"
          className="p-2 rounded bg-zinc-800 text-gray-400 border border-zinc-700"
        />
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
          >
            ← 돌아가기
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-md text-white"
          >
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLpForm;
