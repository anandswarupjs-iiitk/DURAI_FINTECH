const RiskMeter = () => {

  const score = 82;

  return (
    <div className="bg-[#0B1120]
    border border-orange-500/10
    rounded-2xl p-6">

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">
          AI Risk Score
        </h3>

        <span className="text-orange-400">
          LIVE AI ANALYSIS
        </span>
      </div>

      <div className="flex flex-col items-center justify-center">

        <div className="relative w-52 h-52 rounded-full
        flex items-center justify-center
        border-[14px] border-red-500">

          <div className="text-center">
            <h1 className="text-5xl font-bold text-red-400">
              {score}%
            </h1>

            <p className="text-gray-400 mt-2">
              HIGH RISK
            </p>
          </div>

        </div>

        <p className="text-gray-400 text-center mt-6">
          AI model predicts suspicious activity
          based on transaction behavior,
          device mismatch and IP anomalies.
        </p>

      </div>

    </div>
  );
};

export default RiskMeter;