const StatCard = ({ title, value, change }) => {
  return (
    <div className="bg-[#0B1120]
    border border-orange-500/10
    rounded-2xl p-6">

      <p className="text-gray-400 text-sm">{title}</p>

      <h2 className="text-3xl font-bold mt-3">
        {value}
      </h2>

      <p className="text-green-400 text-sm mt-2">
        {change}
      </p>
    </div>
  );
};

export default StatCard;