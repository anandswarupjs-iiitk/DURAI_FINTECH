const transactions = [
  {
    id: "#TX1234",
    user: "Rahul Sharma",
    amount: "₹12,000",
    status: "Success",
    date: "23 May 2026",
  },
  {
    id: "#TX1235",
    user: "Anand",
    amount: "₹48,000",
    status: "Flagged",
    date: "23 May 2026",
  },
  {
    id: "#TX1236",
    user: "Priya Nair",
    amount: "₹7,500",
    status: "Pending",
    date: "22 May 2026",
  },
];

const TransactionTable = ({ transactions }) => {

  return (

    <div
      className="bg-[#0B1120]
      border border-orange-500/10
      rounded-2xl p-6 overflow-x-auto"
    >

      <table className="w-full text-left">

        <thead>

          <tr
            className="border-b border-orange-500/10
            text-gray-400"
          >

            <th className="pb-4">Transaction ID</th>
            <th className="pb-4">User</th>
            <th className="pb-4">Amount</th>
            <th className="pb-4">Status</th>
            <th className="pb-4">Date</th>

          </tr>

        </thead>

        <tbody>

          {transactions.map((tx, index) => (

            <tr
              key={index}
              className="border-b border-orange-500/5"
            >

              <td className="py-5">{tx.id}</td>

              <td>{tx.user}</td>

              <td>{tx.amount}</td>

              <td>

                <span
                  className={`px-3 py-1 rounded-full text-xs
                  ${
                    tx.status === "Success"
                      ? "bg-green-500/20 text-green-400"
                      : tx.status === "Pending"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >

                  {tx.status}

                </span>

              </td>

              <td className="text-gray-400">
                {tx.date}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
};

export default TransactionTable;