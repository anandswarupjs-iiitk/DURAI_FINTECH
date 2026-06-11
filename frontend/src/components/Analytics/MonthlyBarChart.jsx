import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", amount: 4000 },
  { month: "Feb", amount: 3000 },
  { month: "Mar", amount: 5200 },
  { month: "Apr", amount: 2780 },
  { month: "May", amount: 6890 },
];

const MonthlyBarChart = () => {
  return (

    <div className="bg-[#0B1120]
    border border-orange-500/10
    rounded-2xl p-6 h-[420px]">

      <h3 className="text-2xl font-semibold mb-6">
        Monthly Spending Trends
      </h3>

      <ResponsiveContainer width="100%" height="85%">

        <BarChart data={data}>

          <XAxis dataKey="month" stroke="#9CA3AF" />

          <YAxis stroke="#9CA3AF" />

          <Tooltip />

          <Bar
            dataKey="amount"
            fill="#f97316"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );
};

export default MonthlyBarChart;