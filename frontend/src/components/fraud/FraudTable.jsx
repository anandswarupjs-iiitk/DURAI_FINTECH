const transactions = [
  {
    id: "#TX8421",
    amount: "₹45,000",
    confidence: "94%",
    status: "Blocked",
    time: "8:42 PM",
  },
  {
    id: "#TX8422",
    amount: "₹18,200",
    confidence: "71%",
    status: "Under Review",
    time: "8:36 PM",
  },
  {
    id: "#TX8423",
    amount: "₹5,400",
    confidence: "22%",
    status: "Safe",
    time: "8:21 PM",
  },
];

const FraudTable = () => {
  return (
    <div className="bg-[#0B1120]
    border border-orange-500/10
    rounded-2xl p-6 overflow-x-auto">

      <div className="flex justify-between items-center mb-6">

        <h3 className="text-xl font-semibold">
          Suspicious Activity Log
        </h3>

        <span className="text-gray-400 text-sm">
          Updated just now
        </span>

      </div>

      <table className="w-full text-left">

        <thead>
          <tr className="text-gray-400 border-b border-orange-500/10">
            <th className="pb-4">Transaction</th>
            <th className="pb-4">Amount</th>
            <th className="pb-4">AI Confidence</th>
            <th className="pb-4">Status</th>
            <th className="pb-4">Timestamp</th>
          </tr>
        </thead>

        <tbody>

          {transactions.map((tx, index) => (

            <tr
              key={index}
              className="border-b border-orange-500/5"
            >

              <td className="py-5">{tx.id}</td>

              <td>{tx.amount}</td>

              <td className="text-red-400 font-semibold">
                {tx.confidence}
              </td>

              <td>

                <span className={`
                  px-3 py-1 rounded-full text-xs
                  ${
                    tx.status === "Blocked"
                      ? "bg-red-500/20 text-red-400"
                      : tx.status === "Safe"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-orange-500/20 text-orange-400"
                  }
                `}>

                  {tx.status}

                </span>

              </td>

              <td className="text-gray-400">
                {tx.time}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default FraudTable;