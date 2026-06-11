const SendMoneyForm = () => {
  return (
    <div className="bg-[#0B1120]
    border border-orange-500/10
    rounded-2xl p-6">

      <h3 className="text-2xl font-semibold mb-6">
        Send Money
      </h3>

      <div className="space-y-5">

        <input
          type="text"
          placeholder="Recipient Name"
          className="w-full bg-[#131C31]
          rounded-xl p-4 outline-none"
        />

        <input
          type="number"
          placeholder="Amount"
          className="w-full bg-[#131C31]
          rounded-xl p-4 outline-none"
        />

        <textarea
          placeholder="Add note..."
          className="w-full bg-[#131C31]
          rounded-xl p-4 outline-none h-28"
        />

        <button
          className="w-full bg-orange-500
          hover:bg-orange-400 transition-all
          text-black font-semibold py-4 rounded-xl"
        >

          Simulate Transfer

        </button>

      </div>

    </div>
  );
};

export default SendMoneyForm;