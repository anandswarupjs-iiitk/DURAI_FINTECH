const alerts = [
  {
    amount: "₹50,000",
    reason: "Foreign IP",
    risk: "91%",
  },
  {
    amount: "₹12,000",
    reason: "New Device",
    risk: "73%",
  },
];

const FraudAlerts = () => {
  return (
    <div className="bg-[#0B1120]
    border border-red-500/20
    rounded-2xl p-6">

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">
          Fraud Alerts
        </h3>

        <span className="text-red-400 text-sm">
          LIVE
        </span>
      </div>

      <div className="space-y-4">
        {alerts.map((item, i) => (
          <div
            key={i}
            className="bg-[#131C31]
            p-4 rounded-xl flex justify-between"
          >
            <div>
              <h4 className="font-semibold">
                {item.amount}
              </h4>

              <p className="text-sm text-gray-400">
                {item.reason}
              </p>
            </div>

            <div className="text-red-400 font-bold">
              {item.risk}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FraudAlerts;