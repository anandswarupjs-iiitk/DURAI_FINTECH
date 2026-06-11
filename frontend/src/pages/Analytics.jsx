import DashboardLayout from "../layouts/DashboardLayout";

import FinanceSummary from "../components/analytics/FinanceSummary";
import ExpensePieChart from "../components/analytics/ExpensePieChart";
import MonthlyBarChart from "../components/analytics/MonthlyBarChart";
import InsightsCard from "../components/analytics/InsightsCard";

const Analytics = () => {
  return (

    <DashboardLayout>

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Analytics
        </h1>

        <p className="text-gray-400 mt-2">
          Financial insights and intelligent expense analysis.
        </p>

      </div>

      <FinanceSummary />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <ExpensePieChart />

        <MonthlyBarChart />

      </div>

      <InsightsCard />

    </DashboardLayout>

  );
};

export default Analytics;