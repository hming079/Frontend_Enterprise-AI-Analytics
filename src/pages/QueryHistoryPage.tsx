import { useState } from 'react';
import { Search, Filter, ChevronDown, X, Clock, CheckCircle, XCircle, RotateCcw, Eye, Code } from 'lucide-react';
import { auditLogs } from '../data/mock';

type Status = 'all' | 'success' | 'failed' | 'corrected';

const statusConfig = {
  success: { label: 'Success', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, iconColor: 'text-emerald-600' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700', icon: XCircle, iconColor: 'text-red-600' },
  corrected: { label: 'Corrected', color: 'bg-amber-100 text-amber-700', icon: RotateCcw, iconColor: 'text-amber-600' },
};

export default function QueryHistoryPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status>('all');
  const [selectedLog, setSelectedLog] = useState<typeof auditLogs[0] | null>(null);

  const filtered = auditLogs.filter(log => {
    const matchSearch = log.question.toLowerCase().includes(search.toLowerCase()) || log.user.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 animate-fade-in flex gap-4 h-full">
      {/* Main table */}
      <div className="flex-1 min-w-0 space-y-4">
        <div>
          <h2 className="text-xl font-700 text-slate-900">Query History</h2>
          <p className="text-sm text-slate-500 mt-0.5">Complete history of AI-generated SQL queries and executions.</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search questions or users..."
              className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64"
            />
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
            {(['all', 'success', 'failed', 'corrected'] as Status[]).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 text-xs font-500 rounded-md transition-colors capitalize ${statusFilter === s ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {s === 'all' ? 'All' : statusConfig[s].label}
              </button>
            ))}
          </div>

          <span className="ml-auto text-xs text-slate-400">{filtered.length} results</span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">Timestamp</th>
                  <th className="px-4 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">User</th>
                  <th className="px-4 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">Question</th>
                  <th className="px-4 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">Data Source</th>
                  <th className="px-4 py-3 text-right text-[10px] font-600 text-slate-500 uppercase tracking-wide">Time</th>
                  <th className="px-4 py-3 text-center text-[10px] font-600 text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-right text-[10px] font-600 text-slate-500 uppercase tracking-wide">Rows</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map(log => {
                  const cfg = statusConfig[log.status as keyof typeof statusConfig];
                  const Icon = cfg.icon;
                  return (
                    <tr
                      key={log.id}
                      className={`border-t border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${selectedLog?.id === log.id ? 'bg-indigo-50' : ''}`}
                      onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                    >
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock size={11} className="text-slate-400" />
                          {log.timestamp}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-500 text-slate-900 whitespace-nowrap">{log.user}</td>
                      <td className="px-4 py-3 max-w-[240px]">
                        <span className="truncate block text-slate-700">{log.question}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-500">{log.source}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-700">{log.execTime}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-600 ${cfg.color}`}>
                          <Icon size={10} className={cfg.iconColor} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-700">{log.rows}</td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600">
                          <Eye size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail drawer */}
      {selectedLog && (
        <div className="w-80 flex-shrink-0 bg-white border border-slate-200 rounded-xl overflow-hidden animate-slide-down flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <span className="text-xs font-600 text-slate-900">Query Detail</span>
            <button onClick={() => setSelectedLog(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
              <X size={14} />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 p-4 space-y-4">
            <div>
              <label className="text-[10px] font-600 text-slate-400 uppercase tracking-wide">Question</label>
              <p className="text-sm text-slate-900 mt-1 leading-relaxed">"{selectedLog.question}"</p>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="text-[10px] font-600 text-slate-400 uppercase tracking-wide">User</label>
                <p className="text-xs font-500 text-slate-900 mt-1">{selectedLog.user}</p>
              </div>
              <div>
                <label className="text-[10px] font-600 text-slate-400 uppercase tracking-wide">Status</label>
                <div className="mt-1">
                  {(() => {
                    const cfg = statusConfig[selectedLog.status as keyof typeof statusConfig];
                    const Icon = cfg.icon;
                    return (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-600 ${cfg.color}`}>
                        <Icon size={10} className={cfg.iconColor} />
                        {cfg.label}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-600 text-slate-400 uppercase tracking-wide">Generated SQL</label>
              <div className="mt-1 bg-slate-900 rounded-lg p-3 overflow-x-auto">
                <code className="text-[10px] font-mono text-slate-200 leading-relaxed whitespace-pre">{selectedLog.sql}</code>
              </div>
            </div>
            {selectedLog.status === 'corrected' && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <label className="text-[10px] font-600 text-amber-700 uppercase tracking-wide">AI Correction Note</label>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">SQL corrected because the requested field did not exist in the selected schema. Column name was automatically mapped via semantic metadata.</p>
              </div>
            )}
            {selectedLog.status === 'failed' && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <label className="text-[10px] font-600 text-red-700 uppercase tracking-wide">Error</label>
                <p className="text-xs text-red-700 mt-1">Query execution failed: table 'monthly_comparison' does not exist. Please rephrase the question or contact your data administrator.</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-3">
                <label className="text-[10px] font-600 text-slate-400 uppercase">Exec Time</label>
                <p className="text-sm font-600 text-slate-900 mt-0.5 font-mono">{selectedLog.execTime}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <label className="text-[10px] font-600 text-slate-400 uppercase">Rows</label>
                <p className="text-sm font-600 text-slate-900 mt-0.5 font-mono">{selectedLog.rows}</p>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-600 text-slate-400 uppercase tracking-wide">Data Source</label>
              <p className="text-xs text-slate-700 mt-1">{selectedLog.source}</p>
            </div>
            <div>
              <label className="text-[10px] font-600 text-slate-400 uppercase tracking-wide">Timestamp</label>
              <p className="text-xs text-slate-700 mt-1">{selectedLog.timestamp}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
