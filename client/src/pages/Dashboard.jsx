import { useEffect, useState } from "react";
import {
  Briefcase,
  Users,
  Trophy,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import api from "../api/axios";
import PageHeader from "../components/PageHeader.jsx";
import Spinner from "../components/Spinner.jsx";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card p-5 transition hover:border-slate-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-100">{value}</p>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  if (!data) return <p className="text-slate-400">Failed to load dashboard.</p>;

  const fmtMoney = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your sales performance" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Briefcase} label="Total Leads" value={data.totalLeads} color="bg-brand-500/15 text-brand-400" />
        <StatCard icon={Users} label="Total Customers" value={data.totalCustomers} color="bg-cyan-500/15 text-cyan-400" />
        <StatCard icon={Trophy} label="Deals Won" value={data.dealsWon} color="bg-emerald-500/15 text-emerald-400" />
        <StatCard icon={DollarSign} label="Revenue" value={fmtMoney(data.revenue)} color="bg-amber-500/15 text-amber-400" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-100">Monthly Sales</h3>
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.monthlySales}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8 }}
                formatter={(v) => fmtMoney(v)}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 font-semibold text-slate-100">Leads by Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.leadsByStatus} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={12} allowDecimals={false} />
              <YAxis dataKey="status" type="category" stroke="#64748b" fontSize={12} width={70} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8 }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 card p-5">
        <h3 className="mb-4 font-semibold text-slate-100">Recent Activities</h3>
        {data.recentActivities.length === 0 ? (
          <p className="text-sm text-slate-500">No recent activity.</p>
        ) : (
          <ul className="space-y-3">
            {data.recentActivities.map((a) => (
              <li key={a._id} className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-300">
                  {a.userName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-200">
                    <span className="font-medium">{a.userName}</span> {a.action}
                  </p>
                  <p className="text-xs text-slate-500">{a.details}</p>
                </div>
                <span className="text-xs text-slate-600">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
