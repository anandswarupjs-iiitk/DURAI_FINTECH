import { FiBell, FiSearch } from "react-icons/fi";

const Topbar = () => {
  return (
    <div className="h-[80px] border-b border-orange-500/10
    flex items-center justify-between px-8 bg-[#050816]">

      <div className="flex items-center gap-3 bg-[#0B1120]
      px-4 py-2 rounded-xl w-[320px]">

        <FiSearch className="text-gray-400" />

        <input
          type="text"
          placeholder="Search transactions..."
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      <div className="flex items-center gap-6">

        <button className="relative">
          <FiBell className="text-2xl text-orange-400" />

          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-orange-500"></div>

          <div>
            <h4 className="font-semibold">Durai</h4>
            <p className="text-xs text-gray-400">Security Admin</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Topbar;