const alerts = [
  {
    title: "Foreign Transaction Attempt",
    time: "2 mins ago",
    level: "Critical",
  },
  {
    title: "Multiple OTP Failures",
    time: "5 mins ago",
    level: "Medium",
  },
  {
    title: "Device Change Detected",
    time: "11 mins ago",
    level: "High",
  },
];

const LiveAlerts = () => {
  return (
    <div className="bg-[#0B1120]
    border border-red-500/20
    rounded-2xl p-6">

      <div className="flex justify-between items-center mb-6">

        <h3 className="text-xl font-semibold">
          Real-Time Alerts
        </h3>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>

          <span className="text-red-400 text-sm">
            LIVE
          </span>
        </div>

      </div>

      <div className="space-y-4">

        {alerts.map((alert, index) => (

          <div
            key={index}
            className="bg-[#131C31]
            rounded-xl p-4 border border-red-500/10"
          >

            <div className="flex justify-between">

              <div>
                <h4 className="font-semibold">
                  {alert.title}
                </h4>

                <p className="text-sm text-gray-400 mt-1">
                  {alert.time}
                </p>
              </div>

              <span className={`
                px-3 py-1 rounded-full text-xs h-fit
                ${
                  alert.level === "Critical"
                    ? "bg-red-500/20 text-red-400"
                    : alert.level === "High"
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-yellow-500/20 text-yellow-300"
                }
              `}>
                {alert.level}
              </span>

            </div>

          </div>

        ))}

      </div>
    </div>
  );
};

export default LiveAlerts;