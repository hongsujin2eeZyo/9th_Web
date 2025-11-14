const SkeletonComment = () => {
    return (
      <div className="bg-zinc-800 p-3 rounded-md mb-2 animate-pulse">
        <div className="h-3 w-16 bg-zinc-700 rounded mb-2" />
        <div className="h-3 w-full bg-zinc-700 rounded mb-1" />
        <div className="h-3 w-2/3 bg-zinc-700 rounded" />
      </div>
    );
  };
  
  export default SkeletonComment;
  