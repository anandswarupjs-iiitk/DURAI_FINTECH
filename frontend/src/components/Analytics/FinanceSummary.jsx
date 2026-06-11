const FinanceSummary = () => {
  return (

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

      <div className="bg-[#0B1120]
      border border-green-500/10
      rounded-2xl p-6">

        <p className="text-gray-400">
          Total Income
        </p>

        <h2 className="text-4xl font-bold
        text-green-400 mt-3">

          ₹2.4L

        </h2>

      </div>

      <div className="bg-[#0B1120]
      border border-red-500/10
      rounded-2xl p-6">

        <p className="text-gray-400">
          Total Expenses
        </p>

        <h2 className="text-4xl font-bold
        text-red-400 mt-3">

          ₹1.1L

        </h2>

      </div>

      <div className="bg-[#0B1120]
      border border-orange-500/10
      rounded-2xl p-6">

        <p className="text-gray-400">
          Savings Ratio
        </p>

        <h2 className="text-4xl font-bold
        text-orange-400 mt-3">

          54%

        </h2>

      </div>

    </div>

  );
};

export default FinanceSummary;