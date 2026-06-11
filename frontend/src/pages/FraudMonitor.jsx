import DashboardLayout from "../layouts/DashboardLayout";

import RiskMeter from "../components/fraud/RiskMeter";
import LiveAlerts from "../components/fraud/LiveAlerts";
import FraudTable from "../components/fraud/FraudTable";
import SecuritySuggestions from "../components/fraud/SecuritySuggestions";

export default function FraudMonitor() {

  return (

    <DashboardLayout>

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Fraud Monitor
        </h1>

        <p className="text-gray-400 mt-2">
          Real-time AI fraud detection and security analysis.
        </p>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-1">
          <RiskMeter />
        </div>

        <div className="xl:col-span-2">
          <LiveAlerts />
        </div>

      </div>

      <div className="mt-8">

        <FraudTable />

      </div>

      <div className="mt-8">

        <SecuritySuggestions />

      </div>

    </DashboardLayout>

  );
}