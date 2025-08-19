'use client';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface Props {
  salesData: { month: string; ventas: number }[];
  spendingData: { month: string; gastos: number }[];
  pieData: { name: string; value: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DashboardCharts({ salesData, spendingData, pieData }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-2">📈 Ventas por mes</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="ventas" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de barras - Gastos mensuales */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-2">💸 Gastos por mes</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={spendingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="gastos" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico circular - Categorías de artículos comprados */}
      <div className="bg-white p-4 rounded-2xl shadow col-span-1 md:col-span-2">
        <h2 className="text-lg font-semibold mb-2">🛒 Artículos comprados por categoría</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
