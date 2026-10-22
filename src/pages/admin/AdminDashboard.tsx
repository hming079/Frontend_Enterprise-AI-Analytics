import { Users, Database, Zap, Activity, CheckCircle, XCircle, Clock, TrendingUp, Shield } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from 'recharts';
import { activityData, aiUsageData } from '../../data/mock';

const kpis = [
  { label: 'Total Users', value: '128', change: '+4 this week', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Active Users', value: '96', change: '75% active', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Data Sources', value: '4', change: '3 healthy', icon: Database, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Queries Today', value: '1,284', change: '+12% vs yesterday', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'AI Tokens Used', value: '2.4M', change: '68% of monthly limit', icon: Zap, color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: 'System Health', value: '99.9%', change: 'All systems operational', icon: Shield, color: 'text-teal-600', bg: 'bg-teal-50' },
];

const healthItems = [
  { name: 'PostgreSQL Database', status: 'healthy', latency: '4ms' },
  { name: 'LLM Provider (Gemini)', status: 'healthy', latency: '320ms' },
  { name: 'Vector Database (Qdrant)', status: 'healthy', latency: '12ms' },
  { name: 'REST API Gateway', status: 'healthy', latency: '8ms' },
  { name: 'HR Database (MySQL)', status: 'error', latency: 'timeout' },
];

const recentActivity = [
  { user: 'Nguyễn Văn A', action: 'Executed SQL Query', module: 'Text-to-SQL', status: 'success', time: '10:42 AM' },
  { user: 'Trần Thị B', action: 'Uploaded document', module: 'Knowledge Base', status: 'success', time: '10:38 AM' },
  { user: 'Lê Văn C', action: 'Login', module: 'Auth', status: 'success', time: '10:35 AM' },
  { user: 'System', action: 'Schema sync completed', module: 'Data Sources', status: 'success', time: '10:30 AM' },
  { user: 'Phạm Thị D', action: 'Query failed', module: 'Text-to-SQL', status: 'failed', time: '10:28 AM' },
  { user: 'Hoàng Văn E', action: 'Exported report', module: 'Dashboard', status: 'success', time: '10:15 AM' },
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

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield size={20} className="text-indigo-600" />
          <h2 className="text-xl font-700 text-slate-900">System Administration</h2>
        </div>
        <p className="text-sm text-slate-500">Monitor users, data sources, AI usage and platform health.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-all">
              <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center mb-3`}>
                <Icon size={16} className={kpi.color} />
              </div>
              <div className="text-lg font-700 text-slate-900">{kpi.value}</div>
              <div className="text-[11px] font-500 text-slate-600 mt-0.5">{kpi.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{kpi.change}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* System Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="mb-5">
            <h3 className="text-sm font-600 text-slate-900">System Activity Today</h3>
            <p className="text-xs text-slate-400 mt-0.5">Queries, logins and AI requests by hour</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-indigo-500 rounded inline-block" />Queries</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-violet-500 rounded inline-block" />AI Requests</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-500 rounded inline-block" />Logins</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={activityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="queries" name="Queries" stroke="#4338CA" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="ai" name="AI Requests" stroke="#7C3AED" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="logins" name="Logins" stroke="#059669" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Token Usage */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-600 text-slate-900">AI Token Usage (7 days)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Daily token consumption</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-700 text-slate-900">2.4M</div>
              <div className="text-[10px] text-amber-600 font-500">68% of limit</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={aiUsageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="tokens" name="Tokens" fill="#7C3AED" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Health + Metrics + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* System Health */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-600 text-slate-900 mb-4">System Health</h3>
          <div className="space-y-3">
            {healthItems.map(item => (
              <div key={item.name} className="flex items-center gap-3">
                {item.status === 'healthy' ? (
                  <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
                ) : (
                  <XCircle size={15} className="text-red-500 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-500 text-slate-900 truncate">{item.name}</p>
                  <p className={`text-[10px] ${item.status === 'healthy' ? 'text-slate-400' : 'text-red-500'}`}>{item.latency}</p>
                </div>
                <span className={`text-[10px] font-600 px-1.5 py-0.5 rounded-full ${item.status === 'healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {item.status === 'healthy' ? 'Healthy' : 'Error'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-600 text-slate-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">Query Success Rate</span>
                <span className="font-600 text-slate-900">94.8%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94.8%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">AI Self-Correction Rate</span>
                <span className="font-600 text-slate-900">87.2%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '87.2%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">Knowledge Base Coverage</span>
                <span className="font-600 text-slate-900">76%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full" style={{ width: '76%' }} />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Avg Response</div>
                <div className="text-base font-700 text-slate-900">1.82s</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Uptime</div>
                <div className="text-base font-700 text-slate-900">99.9%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-600 text-slate-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${item.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-500 text-slate-900">{item.user}</p>
                  <p className="text-[11px] text-slate-500 truncate">{item.action}</p>
                  <p className="text-[10px] text-slate-400">{item.module}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 flex-shrink-0">
                  <Clock size={9} />
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
