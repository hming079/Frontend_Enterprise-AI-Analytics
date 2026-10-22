import { Zap, AlertTriangle, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { aiUsageData } from '../../data/mock';

const userUsage = [
  { user: 'Nguyễn Văn A', requests: 312, tokens: 480000 },
  { user: 'Trần Thị B', requests: 245, tokens: 380000 },
  { user: 'Lê Văn C', requests: 198, tokens: 310000 },
  { user: 'Phạm Thị D', requests: 167, tokens: 260000 },
  { user: 'Hoàng Văn E', requests: 142, tokens: 220000 },
];

const moduleUsage = [
  { name: 'Text-to-SQL', value: 64, color: '#4338CA' },
  { name: 'RAG / Knowledge', value: 28, color: '#7C3AED' },
  { name: 'Explanation', value: 8, color: '#60A5FA' },
];

const latencyData = [
  { date: 'Nov 19', p50: 1.2, p95: 2.8, p99: 4.1 },
  { date: 'Nov 20', p50: 1.4, p95: 3.1, p99: 5.2 },
  { date: 'Nov 21', p50: 1.1, p95: 2.6, p99: 3.8 },
  { date: 'Nov 22', p50: 1.3, p95: 2.9, p99: 4.4 },
  { date: 'Nov 23', p50: 0.9, p95: 2.2, p99: 3.2 },
  { date: 'Nov 24', p50: 1.6, p95: 3.4, p99: 5.8 },
  { date: 'Nov 25', p50: 1.8, p95: 3.8, p99: 6.2 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2">
        <p className="text-xs font-500 text-slate-700 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-xs" style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AIUsage() {
  const tokenLimit = 3500000;
  const tokenUsed = 2400000;
  const usagePct = Math.round((tokenUsed / tokenLimit) * 100);

  return (
    <div className="p-6 animate-fade-in space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-amber-500" />
          <h2 className="text-xl font-700 text-slate-900">AI Usage Monitoring</h2>
        </div>
        <p className="text-sm text-slate-500 mt-0.5">Track token consumption, request volume, cost and performance.</p>
      </div>

      {/* Warning Banner */}
      {usagePct > 65 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-xs font-600 text-amber-800">Approaching Monthly Token Limit</p>
            <p className="text-xs text-amber-700 mt-0.5">You've used {usagePct}% of your monthly quota. Current period ends Nov 30, 2026.</p>
          </div>
          <button className="ml-auto px-3 py-1.5 text-xs bg-amber-600 text-white rounded-lg font-500 hover:bg-amber-700">Upgrade Plan</button>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Total Requests', value: '1,284', sub: 'Today', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Tokens Used', value: '2.4M', sub: `${usagePct}% of ${(tokenLimit / 1000000).toFixed(1)}M limit`, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Est. Cost', value: '$12.40', sub: 'This month', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Avg Latency', value: '1.82s', sub: 'P50 response time', icon: Clock, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Success Rate', value: '94.8%', sub: '1,217 / 1,284 OK', icon: CheckCircle, color: 'text-teal-600', bg: 'bg-teal-50' },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center mb-3`}>
                <Icon size={16} className={kpi.color} />
              </div>
              <div className="text-lg font-700 text-slate-900">{kpi.value}</div>
              <div className="text-[11px] font-500 text-slate-600 mt-0.5">{kpi.label}</div>
              <div className="text-[10px] text-slate-400">{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Monthly Quota */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-600 text-slate-900">Monthly Token Quota</h3>
          <span className="text-xs text-slate-500">Resets Nov 30, 2026</span>
        </div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-500">2,400,000 / 3,500,000 tokens used</span>
          <span className={`font-600 ${usagePct > 80 ? 'text-red-600' : usagePct > 65 ? 'text-amber-600' : 'text-emerald-600'}`}>{usagePct}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${usagePct > 80 ? 'bg-red-500' : usagePct > 65 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${usagePct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>0</span>
          <span className="text-amber-500">Alert at 80%</span>
          <span>3.5M limit</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Token consumption */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-600 text-slate-900 mb-4">Token Consumption (7 days)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={aiUsageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="tokens" name="Tokens" stroke="#7C3AED" strokeWidth={2} fill="url(#tokenGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Module breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-600 text-slate-900 mb-4">Usage by Module</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={moduleUsage} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                  {moduleUsage.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2.5">
              {moduleUsage.map(m => (
                <div key={m.name}>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
                      <span className="text-xs text-slate-600">{m.name}</span>
                    </div>
                    <span className="text-xs font-600 text-slate-900">{m.value}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${m.value}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Users + Latency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-600 text-slate-900 mb-4">Top Users by Token Usage</h3>
          <div className="space-y-3">
            {userUsage.map((u, i) => (
              <div key={u.user}>
                <div className="flex justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-[10px] font-700 text-indigo-700">{i + 1}</span>
                    </div>
                    <span className="font-500 text-slate-700">{u.user}</span>
                  </div>
                  <span className="text-slate-500">{u.requests} req · {(u.tokens / 1000).toFixed(0)}K tokens</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(u.tokens / 480000) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-600 text-slate-900 mb-4">LLM Response Latency</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={latencyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}s`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="p50" name="P50" fill="#4338CA" radius={[2, 2, 0, 0]} />
              <Bar dataKey="p95" name="P95" fill="#7C3AED" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
