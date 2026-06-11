import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Food", value: 400 },
  { name: "Shopping", value: 300 },
  { name: "Bills", value: 300 },
  { name: "Travel", value: 200 },
];

const COLORS = [
  "#f97316",
  "#ef4444",
  "#eab308",
  "#22c55e",
];

const ExpensePieChart = () => {
  return (

    <div className="bg-[#0B1120]
    border border-orange-500/10
    rounded-2xl p-6 h-[420px]">

      <h3 className="text-2xl font-semibold mb-6">
        Expense Categories
      </h3>

      <ResponsiveContainer width="100%" height="85%">

        <PieChart>

          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            dataKey="value"
            label
          >

            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}

          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>

  );
};

export default ExpensePieChart;