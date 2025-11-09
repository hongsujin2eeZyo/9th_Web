import SkeletonLpCard from "./SkeletonLpCard";

const SkeletonLpList = () => {
  return (
    <div className="w-full bg-black text-white px-6 py-8">
      <div className="grid grid-cols-5 gap-4 w-full">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonLpCard key={i} />
        ))}
      </div>

      <p className="mt-6 text-gray-400 text-center animate-pulse">
        LP 목록을 불러오는 중입니다...
      </p>
    </div>
  );
};

export default SkeletonLpList;
