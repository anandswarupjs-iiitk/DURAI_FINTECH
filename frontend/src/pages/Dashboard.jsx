import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import FraudAlerts from "../components/dashboard/FraudAlerts";
import RecentTransactions from "../components/dashboard/RecentTransactions";

const Dashboard = () => {
  return (
    <DashboardLayout>

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Security Dashboard
        </h1>

        <p className="text-gray-400 mt-2">
          Monitor transactions and fraud activity in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Total Transactions"
          value="12,450"
          change="+12.4%"
        />

        <StatCard
          title="Fraud Detected"
          value="182"
          change="+5.1%"
        />

        <StatCard
          title="Risk Score"
          value="82%"
          change="+2.1%"
        />

        <StatCard
          title="Revenue Protected"
          value="₹8.2L"
          change="+18%"
        />

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

        <FraudAlerts />

        <RecentTransactions />

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;