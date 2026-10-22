import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Brain, Send, ChevronRight, Copy, Pin, Download, ThumbsUp, ThumbsDown,
  CheckCircle, XCircle, RotateCcw, Play, Clock, Plus, Search, MoreHorizontal,
  Trash2, Star, ChevronLeft, Code, BarChart3, Table, Sparkles, X, AlertTriangle, ChevronDown
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { queryResultData } from '../data/mock';

// ─── Types ───────────────────────────────────────────────────────────────────

type ProcessStep = 'idle' | 'understanding' | 'mapping' | 'generating' | 'validating'
  | 'executing' | 'visualizing' | 'done' | 'error' | 'correcting';

interface HistoryItem {
  id: string;
  question: string;
  time: string;
  status: 'success' | 'corrected' | 'failed';
  pinned: boolean;
}

interface Session {
  question: string;
  answer: string;
  sql: string;
  status: 'success' | 'corrected' | 'failed';
  pinned: boolean;
}

// ─── Mock Databases ──────────────────────────────────────────────────────────
const availableDatabases = [
  { id: 'db1', name: 'Maven Toys Demo', type: 'PostgreSQL' },
  { id: 'db2', name: 'E-commerce Sales', type: 'MySQL' },
  { id: 'db3', name: 'HR Analytics', type: 'Snowflake' },
];

// ─── Mock History Data ────────────────────────────────────────────────────────

const historyToday: HistoryItem[] = [
  { id: 'q1', question: 'Doanh thu tháng 8/2026 của chi nhánh Quận 1', time: '10:42 AM', status: 'success', pinned: true },
  { id: 'q2', question: 'Top 10 sản phẩm bán chạy hôm nay', time: '09:15 AM', status: 'success', pinned: false },
  { id: 'q3', question: 'Tồn kho hiện tại của cửa hàng Quận 7', time: '08:30 AM', status: 'corrected', pinned: false },
];

const historyLast7: HistoryItem[] = [
  { id: 'q4', question: 'Doanh thu theo khu vực tháng 7/2026', time: 'Nov 24', status: 'success', pinned: false },
  { id: 'q5', question: 'So sánh doanh thu tháng này và tháng trước', time: 'Nov 23', status: 'success', pinned: true },
  { id: 'q6', question: 'Cửa hàng nào có hiệu suất tốt nhất Q4?', time: 'Nov 22', status: 'success', pinned: false },
];

const historyLast30: HistoryItem[] = [
  { id: 'q7', question: 'Xu hướng doanh thu theo tháng năm 2026', time: 'Nov 10', status: 'success', pinned: false },
  { id: 'q8', question: 'Sản phẩm nào có doanh thu giảm mạnh nhất?', time: 'Nov 5', status: 'corrected', pinned: false },
];

// Mock sessions keyed by history id
const sessionsByHistory: Record<string, Partial<Session>> = {
  q1: {
    question: 'Doanh thu tháng 8/2026 của chi nhánh Quận 1',
    answer: 'Chi nhánh Quận 1 đạt doanh thu **$312,420** trong tháng 8/2026, tăng **13.8%** so với tháng trước. Đây là chi nhánh có tăng trưởng cao nhất trong hệ thống.',
    sql: `SELECT store_name, SUM(revenue) AS total_revenue\nFROM sales\nJOIN stores ON sales.store_id = stores.store_id\nWHERE store_name LIKE '%Quận 1%'\n  AND MONTH(date) = 8 AND YEAR(date) = 2026\nGROUP BY store_name;`,
    status: 'success',
    pinned: true,
  },
  q2: {
    question: 'Top 10 sản phẩm bán chạy hôm nay',
    answer: 'Danh sách 10 sản phẩm bán chạy nhất hôm nay được tổng hợp dưới đây. **Lego City Police Station** dẫn đầu với 284 đơn vị bán ra.',
    sql: `SELECT product_name, SUM(quantity) AS units_sold, SUM(revenue) AS total_revenue\nFROM sales\nJOIN products ON sales.product_id = products.product_id\nWHERE date = CURRENT_DATE\nGROUP BY product_name\nORDER BY units_sold DESC\nLIMIT 10;`,
    status: 'success',
    pinned: false,
  },
};

// ─── Suggestions ─────────────────────────────────────────────────────────────

const suggestions = [
  'Doanh thu theo từng cửa hàng trong quý này?',
  'Top 10 sản phẩm bán chạy nhất tháng này?',
  'So sánh doanh thu tháng này vs tháng trước?',
  'Sản phẩm nào có doanh thu giảm mạnh nhất?',
  'Cửa hàng nào có hiệu suất tốt nhất Q4?',
  'Tổng doanh thu theo danh mục sản phẩm?',
];

// ─── Process steps ───────────────────────────────────────────────────────────

const processSteps: { id: ProcessStep; label: string; detail: string }[] = [
  { id: 'understanding', label: 'Understanding question', detail: 'Parsing intent and business context' },
  { id: 'mapping', label: 'Identifying data source', detail: 'Maven Toys Demo Database → sales, stores' },
  { id: 'generating', label: 'Generating SQL', detail: 'Building query from natural language' },
  { id: 'validating', label: 'Validating SQL', detail: 'Checking syntax and schema compatibility' },
  { id: 'executing', label: 'Executing query', detail: 'Running against PostgreSQL database' },
  { id: 'visualizing', label: 'Generating visualization', detail: 'Selecting optimal chart type' },
];

const COLORS = ['#4338CA', '#5B50D6', '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD'];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: HistoryItem['status'] }) {
  const cfg = {
    success: { label: 'SQL Generated', cls: 'bg-emerald-100 text-emerald-700' },
    corrected: { label: 'Auto-corrected', cls: 'bg-amber-100 text-amber-700' },
    failed: { label: 'Failed', cls: 'bg-red-100 text-red-700' },
  }[status];
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-500 ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow px-3 py-2 text-xs">
      <p className="font-500 text-slate-700 mb-1">{label}</p>
      <p className="text-indigo-600">Revenue: ${(payload[0].value / 1000).toFixed(0)}K</p>
    </div>
  );
}

// ─── History Drawer ───────────────────────────────────────────────────────────

interface HistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelectItem: (item: HistoryItem) => void;
  activeId: string | null;
}

function HistoryDrawer({ open, onClose, onSelectItem, activeId }: HistoryDrawerProps) {
  const [search, setSearch] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filterItems = (items: HistoryItem[]) =>
    items.filter(i => i.question.toLowerCase().includes(search.toLowerCase()));

  const todayFiltered = filterItems(historyToday);
  const last7Filtered = filterItems(historyLast7);
  const last30Filtered = filterItems(historyLast30);
  const hasAny = todayFiltered.length + last7Filtered.length + last30Filtered.length > 0;

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpenId) return;
    const handler = () => setMenuOpenId(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [menuOpenId]);

  // Escape to close drawer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const renderGroup = (label: string, items: HistoryItem[]) => {
    if (!items.length) return null;
    return (
      <div key={label} className="mb-4">
        <div className="px-3 mb-1 text-[10px] font-600 text-slate-400 uppercase tracking-widest">{label}</div>
        <div className="space-y-0.5">
          {items.map(item => (
            <div key={item.id} className="relative group">
              <button
                onClick={() => onSelectItem(item)}
                className={`w-full flex flex-col items-start gap-1 px-3 py-2.5 rounded-lg text-left transition-colors ${activeId === item.id ? 'bg-indigo-50' : 'hover:bg-slate-50'
                  }`}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <p className={`text-xs leading-snug line-clamp-2 flex-1 ${activeId === item.id ? 'text-indigo-700 font-500' : 'text-slate-700'}`}>
                    {item.question}
                  </p>
                  {item.pinned && (
                    <Star size={10} className="text-amber-400 flex-shrink-0 mt-0.5 fill-current" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">{item.time}</span>
                  <StatusBadge status={item.status} />
                </div>
              </button>

              {/* Hover action button */}
              <button
                onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === item.id ? null : item.id); }}
                className="absolute right-2 top-2.5 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-opacity"
              >
                <MoreHorizontal size={13} />
              </button>

              {/* Context menu */}
              {menuOpenId === item.id && (
                <div
                  className="absolute right-2 top-8 z-20 bg-white border border-slate-200 rounded-xl shadow-lg py-1 w-36 animate-slide-down"
                  onClick={e => e.stopPropagation()}
                >
                  {[
                    { label: 'Open', icon: ChevronRight, action: () => { onSelectItem(item); setMenuOpenId(null); } },
                    { label: item.pinned ? 'Unpin' : 'Pin', icon: Star, action: () => setMenuOpenId(null) },
                    { label: 'Rename', icon: CheckCircle, action: () => setMenuOpenId(null) },
                    { label: 'Delete', icon: Trash2, action: () => { setDeleteTarget(item.id); setMenuOpenId(null); }, danger: true },
                  ].map(opt => (
                    <button
                      key={opt.label}
                      onClick={opt.action}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 text-left ${opt.danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700'}`}
                    >
                      <opt.icon size={12} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Delete confirmation */}
              {deleteTarget === item.id && (
                <div className="mx-3 mb-1 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-xs text-red-700 font-500 mb-2">Delete this query?</p>
                  <div className="flex gap-2">
                    <button onClick={() => setDeleteTarget(null)} className="flex-1 py-1 text-[11px] border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">Cancel</button>
                    <button onClick={() => setDeleteTarget(null)} className="flex-1 py-1 text-[11px] bg-red-600 hover:bg-red-700 text-white rounded-lg font-500">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`flex-shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-hidden transition-all duration-200 ease-in-out`}
      style={{ width: open ? 280 : 0 }}
    >
      {/* Inner — always 280px wide so content doesn't collapse during animation */}
      <div className="w-[280px] flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-shrink-0">
          <div>
            <p className="text-xs font-600 text-slate-900">Query History</p>
            <p className="text-[10px] text-slate-400">Lịch sử các truy vấn dữ liệu</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2.5 border-b border-slate-100 flex-shrink-0">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm trong lịch sử..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-400"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-2">
          {hasAny ? (
            <>
              {renderGroup('Today', todayFiltered)}
              {renderGroup('Last 7 Days', last7Filtered)}
              {renderGroup('Last 30 Days', last30Filtered)}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <Clock size={24} className="text-slate-300 mb-2" />
              <p className="text-xs text-slate-400">
                {search ? 'No queries match your search.' : 'No queries yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Processing Timeline ──────────────────────────────────────────────────────

function ProcessingTimeline({ step, question }: { step: ProcessStep; question: string }) {
  const currentIdx = processSteps.findIndex(s => s.id === step);
  const isError = step === 'error';
  const isCorrect = step === 'correcting';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
        <span className="text-sm font-500 text-slate-900">AI đang phân tích...</span>
        <span className="ml-auto text-xs text-slate-400 truncate max-w-xs hidden md:block">"{question}"</span>
      </div>

      {isError && (
        <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-200 text-xs">
          <div className="flex items-center gap-1.5 mb-0.5">
            <XCircle size={12} className="text-red-600" />
            <span className="font-600 text-red-700">SQL Validation Failed</span>
          </div>
          <p className="text-red-600">Column 'revenue_total' does not exist. AI đang tự sửa lỗi...</p>
        </div>
      )}
      {isCorrect && (
        <div className="mb-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs">
          <div className="flex items-center gap-1.5 mb-0.5">
            <RotateCcw size={12} className="text-amber-600 animate-spin" />
            <span className="font-600 text-amber-700">AI Self-Correction</span>
            <span className="ml-auto px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded text-[10px] font-600">Attempt 2/3</span>
          </div>
          <p className="text-amber-700">Mapping 'revenue_total' → 'revenue' (sales table)...</p>
        </div>
      )}

      <div className="space-y-2">
        {processSteps.map((s, idx) => {
          let st: 'done' | 'active' | 'pending' = 'pending';
          if (idx < currentIdx) st = 'done';
          else if (s.id === step || (isCorrect && s.id === 'validating')) st = 'active';

          return (
            <div key={s.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${st === 'done' ? 'bg-emerald-100' :
                  st === 'active' ? 'bg-indigo-100' : 'bg-slate-100'
                  }`}>
                  {st === 'done' && <CheckCircle size={11} className="text-emerald-600" />}
                  {st === 'active' && <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />}
                  {st === 'pending' && <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                </div>
                {idx < processSteps.length - 1 && (
                  <div className={`w-px h-3 ${st === 'done' ? 'bg-emerald-200' : 'bg-slate-150'}`} />
                )}
              </div>
              <div className="pb-0.5 min-w-0">
                <p className={`text-xs font-500 ${st === 'done' ? 'text-emerald-700' :
                  st === 'active' ? 'text-indigo-700' : 'text-slate-400'
                  }`}>{s.label}</p>
                {st !== 'pending' && (
                  <p className="text-[10px] text-slate-400 truncate">{s.detail}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Query Result ─────────────────────────────────────────────────────────────

function QueryResult({ session, onTogglePin }: { session: Session; onTogglePin: () => void }) {
  const [tab, setTab] = useState<'chart' | 'table' | 'sql'>('chart');
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(session.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Self-correction notice */}
      {session.status === 'corrected' && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs">
          <RotateCcw size={13} className="text-amber-600 flex-shrink-0" />
          <span className="font-600 text-amber-700">AI Self-Correction Applied</span>
          <span className="text-amber-600">Column name was automatically remapped via schema metadata.</span>
          <CheckCircle size={13} className="text-emerald-500 ml-auto flex-shrink-0" />
        </div>
      )}

      {/* AI Answer */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
            <Sparkles size={13} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-600 text-slate-900">AI Answer</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-500">
                {session.status === 'success' ? 'Query Successful' : 'Auto-corrected & Executed'}
              </span>
              <span className="text-[10px] text-slate-400">6 rows · 1.2s</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {/* Render lightweight bold */}
              {session.answer.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                part.startsWith('**') ? (
                  <strong key={i} className="text-slate-900 font-600">{part.slice(2, -2)}</strong>
                ) : part
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs + Result */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-center border-b border-slate-100 px-4">
          {([
            { id: 'chart', label: 'Chart', icon: BarChart3 },
            { id: 'table', label: 'Table', icon: Table },
            { id: 'sql', label: 'SQL', icon: Code },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-500 border-b-2 transition-colors ${tab === t.id
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
              <t.icon size={13} />{t.label}
            </button>
          ))}
          <div className="ml-auto py-2">
            <select className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option>Bar Chart</option>
              <option>Line Chart</option>
              <option>Area Chart</option>
              <option>Pie / Donut</option>
              <option>KPI Card</option>
            </select>
          </div>
        </div>

        <div className="p-5">
          {tab === 'chart' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-600 text-slate-900">Revenue by Store — Last Quarter</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Total: $1,380,220 · 6 stores</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={queryResultData} margin={{ top: 0, right: 0, left: -10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="store_name" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="total_revenue" name="Revenue" radius={[4, 4, 0, 0]}>
                    {queryResultData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </>
          )}

          {tab === 'table' && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-2.5 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">Store</th>
                    <th className="px-4 py-2.5 text-right text-[10px] font-600 text-slate-500 uppercase tracking-wide">Revenue</th>
                    <th className="px-4 py-2.5 text-right text-[10px] font-600 text-slate-500 uppercase tracking-wide">Prev</th>
                    <th className="px-4 py-2.5 text-right text-[10px] font-600 text-slate-500 uppercase tracking-wide">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {queryResultData.map(row => (
                    <tr key={row.store_name} className="border-t border-slate-50">
                      <td className="px-4 py-2.5 font-500 text-slate-900">{row.store_name}</td>
                      <td className="px-4 py-2.5 text-right font-500 text-slate-900">${row.total_revenue.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-right text-slate-500">${row.prev_revenue.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`font-500 ${row.growth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {row.growth >= 0 ? '+' : ''}{row.growth}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'sql' && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-500 text-slate-700">Generated SQL</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-500">Valid</span>
                {session.status === 'corrected' && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-500">Auto-corrected</span>
                )}
              </div>
              <div className="relative bg-slate-900 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <button onClick={copy} className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1">
                    <Copy size={10} />{copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="px-4 py-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed whitespace-pre">
                  {session.sql}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-2 px-5 pb-4 flex-wrap">
          <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 font-500">
            <Copy size={12} />{copied ? 'Copied!' : 'Copy SQL'}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 font-500">
            <Play size={12} />Re-run
          </button>
          <div className="flex items-center gap-1 ml-1">
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-green-50 hover:border-green-200 text-slate-400 hover:text-green-600">
              <ThumbsUp size={12} />
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-red-500">
              <ThumbsDown size={12} />
            </button>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 font-500">
              <Download size={12} />Export
            </button>
            <button
              onClick={onTogglePin}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-500 transition-colors ${session.pinned
                ? 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
            >
              <Pin size={12} />
              {session.pinned ? '✓ Pinned to Dashboard' : 'Pin to Dashboard'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Welcome / Empty State ────────────────────────────────────────────────────

function WelcomeState({ onSuggestion }: { onSuggestion: (s: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-10 px-6 max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
        <Brain size={24} className="text-indigo-600" />
      </div>
      <h3 className="text-base font-600 text-slate-900 mb-1">AI Data Analyst</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        Đặt câu hỏi bằng tiếng Việt về dữ liệu bán lẻ — hệ thống tự động tạo SQL, thực thi và trực quan hóa kết quả.
      </p>
      <div className="w-full grid grid-cols-1 gap-2 text-left">
        <p className="text-[10px] font-600 text-slate-400 uppercase tracking-widest mb-1">Gợi ý câu hỏi</p>
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-all group"
          >
            <ChevronRight size={13} className="text-slate-400 group-hover:text-indigo-500 flex-shrink-0" />
            <span className="text-sm text-slate-700 group-hover:text-indigo-700">{s}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AIQueryPage() {
  const [historyOpen, setHistoryOpen] = useState(true);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [step, setStep] = useState<ProcessStep>('idle');
  const [submittedQ, setSubmittedQ] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [selectedDb, setSelectedDb] = useState(availableDatabases[0].id);

  const defaultSession: Session = {
    question: submittedQ,
    answer: `Doanh thu theo từng cửa hàng trong quý gần nhất được tổng hợp bên dưới. **Store 12 - HCMC** dẫn đầu với **$312,420**, tăng 13.8% so với kỳ trước. Tổng doanh thu toàn hệ thống đạt **$1,380,220**.`,
    sql: `SELECT\n  s.store_name,\n  SUM(sl.revenue) AS total_revenue,\n  LAG(SUM(sl.revenue)) OVER (ORDER BY s.store_id) AS prev_revenue\nFROM sales sl\nJOIN stores s ON sl.store_id = s.store_id\nWHERE EXTRACT(QUARTER FROM sl.date) = EXTRACT(QUARTER FROM CURRENT_DATE - INTERVAL '1 quarter')\nGROUP BY s.store_name, s.store_id\nORDER BY total_revenue DESC;`,
    status: 'success',
    pinned: false,
  };

  const runQuery = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setSubmittedQ(q);
    setInput('');
    setActiveHistoryId(null);
    setSession(null);

    const willError = q.toLowerCase().includes('giảm') || q.toLowerCase().includes('hết hạn');
    const steps: ProcessStep[] = ['understanding', 'mapping', 'generating', 'validating'];

    for (const s of steps) {
      setStep(s);
      await new Promise(r => setTimeout(r, 650 + Math.random() * 350));
      if (s === 'validating' && willError) {
        setStep('error');
        await new Promise(r => setTimeout(r, 1000));
        setStep('correcting');
        await new Promise(r => setTimeout(r, 800));
      }
    }
    setStep('executing');
    await new Promise(r => setTimeout(r, 500));
    setStep('visualizing');
    await new Promise(r => setTimeout(r, 400));
    setStep('done');

    setSession({ ...defaultSession, question: q, status: willError ? 'corrected' : 'success' });
  }, []);

  const handleSelectHistory = (item: HistoryItem) => {
    setActiveHistoryId(item.id);
    const s = sessionsByHistory[item.id];
    if (s) {
      setSubmittedQ(s.question ?? item.question);
      setStep('done');
      setSession({
        question: s.question ?? item.question,
        answer: s.answer ?? defaultSession.answer,
        sql: s.sql ?? defaultSession.sql,
        status: s.status ?? 'success',
        pinned: s.pinned ?? item.pinned,
      });
    } else {
      // Restore with default session for demo
      setSubmittedQ(item.question);
      setStep('done');
      setSession({ ...defaultSession, question: item.question, status: item.status, pinned: item.pinned });
    }
  };

  const handleNewQuery = () => {
    setStep('idle');
    setSession(null);
    setSubmittedQ('');
    setActiveHistoryId(null);
    textareaRef.current?.focus();
  };

  const handleTogglePin = () => {
    if (session) setSession(s => s ? { ...s, pinned: !s.pinned } : s);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runQuery(input);
  };

  const isProcessing = !['idle', 'done'].includes(step);

  return (
    <div className="flex h-full min-h-0">
      {/* History Drawer */}
      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelectItem={handleSelectHistory}
        activeId={activeHistoryId}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Sub-header */}
        <div className="flex items-center gap-3 px-5 py-2.5 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <select
              value={selectedDb}
              onChange={(e) => setSelectedDb(e.target.value)}
              className="font-500 bg-transparent outline-none cursor-pointer appearance-none pr-5 py-0.5 text-emerald-600 hover:text-emerald-700 transition-colors focus:ring-0"
            >
              {availableDatabases.map(db => (
                <option key={db.id} value={db.id} className="text-slate-700">
                  {db.name} · {db.type}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600 group-hover:text-emerald-700" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setHistoryOpen(o => !o)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-500 rounded-lg border transition-colors ${historyOpen
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
            >
              <Clock size={13} />
              History
            </button>
            <button
              onClick={handleNewQuery}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-600 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              <Plus size={13} />
              New Query
            </button>
          </div>
        </div>

        {/* Scrollable result area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-5 py-5">
            {step === 'idle' && !session && (
              <WelcomeState onSuggestion={q => { setInput(q); textareaRef.current?.focus(); }} />
            )}

            {isProcessing && (
              <div className="animate-fade-in">
                {/* User question bubble */}
                <div className="flex justify-end mb-4">
                  <div className="bg-indigo-600 text-white text-sm px-4 py-3 rounded-2xl rounded-tr-sm max-w-md leading-relaxed">
                    {submittedQ}
                  </div>
                </div>
                <ProcessingTimeline step={step} question={submittedQ} />
              </div>
            )}

            {step === 'done' && session && (
              <div className="animate-fade-in space-y-4">
                {/* User question */}
                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white text-sm px-4 py-3 rounded-2xl rounded-tr-sm max-w-md leading-relaxed">
                    {session.question}
                  </div>
                </div>
                <QueryResult session={session} onTogglePin={handleTogglePin} />
              </div>
            )}
          </div>
        </div>

        {/* Fixed input bar */}
        <div className="border-t border-slate-200 bg-white px-5 py-4 flex-shrink-0">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); runQuery(input); }
                }}
                placeholder="Bạn muốn phân tích dữ liệu gì? Ví dụ: Doanh thu theo từng chi nhánh trong tháng này..."
                rows={2}
                disabled={isProcessing}
                className="w-full px-4 py-3 pr-28 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none placeholder-slate-400 disabled:opacity-50 leading-relaxed"
              />
              <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-600 rounded-lg transition-colors"
              >
                {isProcessing
                  ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Send size={12} />Phân tích</>
                }
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Nhấn Enter để gửi · Shift+Enter để xuống dòng · Kết quả SQL được validate tự động trước khi thực thi
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
