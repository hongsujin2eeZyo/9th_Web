import React from "react";

const SkeletonLpList = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-8 bg-black text-white">
      <div className="grid grid-cols-5 gap-4 w-full animate-pulse">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="bg-zinc-800 rounded-md w-full aspect-square"
          ></div>
        ))}
      </div>
      <p className="mt-6 text-gray-400">LP 목록을 불러오는 중입니다...</p>
    </div>
  );
};

export default SkeletonLpList;
