
type SortButtonsProps = {
  order: "asc" | "desc";
  setOrder: (order: "asc" | "desc") => void;
};

const SortButtons = ({ order, setOrder }: SortButtonsProps) => {
  return (
    <div className="flex justify-end mb-4 space-x-2">
      <button
        onClick={() => setOrder("asc")}
        className={`px-3 py-1 rounded-md ${
          order === "asc"
            ? "bg-pink-500 text-white"
            : "bg-zinc-800 hover:bg-zinc-700"
        }`}
      >
        오래된순
      </button>

      <button
        onClick={() => setOrder("desc")}
        className={`px-3 py-1 rounded-md ${
          order === "desc"
            ? "bg-pink-500 text-white"
            : "bg-zinc-800 hover:bg-zinc-700"
        }`}
      >
        최신순
      </button>
    </div>
  );
};

export default SortButtons;
