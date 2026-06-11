const data = [
  {
    name: "Amazon",
    amount: "₹2,400",
    status: "Safe",
  },
  {
    name: "Unknown Merchant",
    amount: "₹40,000",
    status: "Flagged",
  },
];

const RecentTransactions = () => {
  return (
    <div className="bg-[#0B1120]
    border border-orange-500/10
    rounded-2xl p-6">

      <h3 className="text-xl font-semibold mb-6">
        Recent Transactions
      </h3>

      <div className="space-y-4">

        {data.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center
            bg-[#131C31]
            rounded-xl p-4"
          >
            <div>
              <h4>{item.name}</h4>

              <p className="text-sm text-gray-400">
                {item.amount}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs
              ${
                item.status === "Safe"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
};

export default RecentTransactions;