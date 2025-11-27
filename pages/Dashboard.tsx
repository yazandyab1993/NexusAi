import React from 'react';
import { User, GeneratedAsset, Transaction } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CreditCard, Video, Activity, Zap } from 'lucide-react';

interface DashboardProps {
  user: User;
  assets: GeneratedAsset[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, assets, transactions }) => {
  
  // Dummy data for the chart
  const data = [
    { name: 'Mon', usage: 40 },
    { name: 'Tue', usage: 30 },
    { name: 'Wed', usage: 20 },
    { name: 'Thu', usage: 27 },
    { name: 'Fri', usage: 18 },
    { name: 'Sat', usage: 23 },
    { name: 'Sun', usage: 34 },
  ];

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
        <span className="text-slate-400 text-sm font-medium">Last 30 days</span>
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <p className="text-slate-400">Welcome back, {user.name}. Here's what's happening with your account.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Available Credits" value={user.credits} icon={CreditCard} color="bg-blue-600" />
        <StatCard label="Videos Generated" value={assets.length} icon={Video} color="bg-purple-600" />
        <StatCard label="Total Spent" value={transactions.filter(t => t.type === 'SPEND').reduce((acc, curr) => acc + curr.amount, 0)} icon={Zap} color="bg-orange-600" />
        <StatCard label="Active Projects" value="3" icon={Activity} color="bg-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Credit Usage History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="usage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${tx.type === 'DEPOSIT' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-200">{tx.description}</p>
                    <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${tx.type === 'DEPOSIT' ? 'text-green-400' : 'text-slate-200'}`}>
                  {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.amount}
                </span>
              </div>
            ))}
            {transactions.length === 0 && <p className="text-slate-500 text-sm">No transactions yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
