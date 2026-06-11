import { FiSearch } from "react-icons/fi";

const TransactionFilters = ({
  statusFilter,
  setStatusFilter,
}) => {

  return (

    <div
      className="flex flex-col lg:flex-row gap-4
      justify-between mb-6"
    >

      <div
        className="flex items-center gap-3
        bg-[#131C31] px-4 py-3 rounded-xl
        w-full lg:w-[350px]"
      >

        <FiSearch className="text-gray-400" />

        <input
          type="text"
          placeholder="Search transaction..."
          className="bg-transparent outline-none w-full"
        />

      </div>

      <div className="flex gap-4">

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="bg-[#131C31]
          border border-orange-500/10
          rounded-xl px-4 py-3 text-gray-300"
        >

          <option>All Status</option>
          <option>Success</option>
          <option>Pending</option>
          <option>Flagged</option>

        </select>

      </div>

    </div>

  );
};

export default TransactionFilters;