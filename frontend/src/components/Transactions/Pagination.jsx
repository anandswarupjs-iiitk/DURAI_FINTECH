const Pagination = () => {
  return (
    <div className="flex justify-end gap-3 mt-6">

      <button className="px-4 py-2 rounded-lg
      bg-[#131C31] text-gray-300">

        Previous

      </button>

      <button className="px-4 py-2 rounded-lg
      bg-orange-500 text-black font-semibold">

        1

      </button>

      <button className="px-4 py-2 rounded-lg
      bg-[#131C31] text-gray-300">

        2

      </button>

      <button className="px-4 py-2 rounded-lg
      bg-[#131C31] text-gray-300">

        Next

      </button>

    </div>
  );
};

export default Pagination;