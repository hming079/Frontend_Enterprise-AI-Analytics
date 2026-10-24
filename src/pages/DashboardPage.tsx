import { useState, useRef, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, BarChart2,
  ArrowRight, ArrowLeft, LayoutDashboard, Activity, Map, Box, GripHorizontal, Plus, X
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { revenueTrendData, categoryData, topProducts, storePerformance, inventoryStatus } from '../data/mock';
import type { UserRole } from '../data/mock';

interface DashboardPageProps {
  userName: string;
  userRole: UserRole;
  onNavigate: (page: string) => void;
}

// ─── Danh sách các loại Dashboard (Mock Data) ──────────────────────────────
const availableDashboards = [
  { id: 'executive', title: 'Executive Overview', desc: 'Tổng quan doanh thu, đơn hàng và hiệu suất toàn công ty.', icon: LayoutDashboard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'inventory', title: 'Inventory Health', desc: 'Theo dõi tình trạng kho hàng, mức độ tồn kho và cảnh báo hết hàng.', icon: Box, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'store-ops', title: 'Store Operations', desc: 'Phân tích hiệu suất theo từng chi nhánh và khu vực địa lý.', icon: Map, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'marketing', title: 'Marketing & Sales', desc: 'Hiệu quả chiến dịch, xu hướng danh mục sản phẩm và top bán chạy.', icon: Activity, color: 'text-violet-600', bg: 'bg-violet-50' },
];

const kpiCards = [
  { label: 'Total Revenue', value: '$1.28M', change: '+12.4%', positive: true, icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50', sub: 'vs. previous period' },
  { label: 'Total Orders', value: '24,892', change: '+8.2%', positive: true, icon: ShoppingCart, color: 'text-violet-600', bg: 'bg-violet-50', sub: 'vs. previous period' },
  { label: 'Units Sold', value: '68,430', change: '+15.7%', positive: true, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'vs. previous period' },
  { label: 'Avg. Order Value', value: '$51.42', change: '+3.6%', positive: true, icon: BarChart2, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'vs. previous period' },
];

// ─── MASTER LIST CÁC WIDGET ────────────────────────────────────────────────
const ALL_WIDGETS = [
  { id: 'revenue', span: 'lg:col-span-4', title: 'Revenue Trend', desc: 'Monthly revenue and order volume' },
  { id: 'inventory', span: 'lg:col-span-2', title: 'Inventory Health', desc: 'Current stock status' },
  { id: 'category', span: 'lg:col-span-3', title: 'Sales by Category', desc: 'Revenue by product category' },
  { id: 'store', span: 'lg:col-span-3', title: 'Store Performance', desc: 'Store target completion' },
  { id: 'top-products', span: 'lg:col-span-6', title: 'Top Products', desc: 'Best selling items of the month' },
];

// Cấu hình Widgets ban đầu hiển thị trên màn hình
const initialWidgets = [
  { id: 'revenue', span: 'lg:col-span-4' },
  { id: 'inventory', span: 'lg:col-span-2' },
  { id: 'category', span: 'lg:col-span-3' },
  { id: 'store', span: 'lg:col-span-3' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2">
        <p className="text-xs font-500 text-slate-700 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-xs" style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' && p.value > 10000 ? `$${(p.value / 1000).toFixed(0)}K` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage({ userName, userRole, onNavigate }: DashboardPageProps) {
  const [activeDashboard, setActiveDashboard] = useState<string | null>(null);

  // State quản lý Widgets
  const [widgets, setWidgets] = useState(initialWidgets);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);

  // Đóng menu Add Widget khi click ra ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setIsAddMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // ─── XỬ LÝ THÊM / XÓA WIDGET ────────────────────────────────────────────────
  const availableToAdd = ALL_WIDGETS.filter(w => !widgets.find(active => active.id === w.id));

  const handleAddWidget = (widgetId: string) => {
    const widgetToAdd = ALL_WIDGETS.find(w => w.id === widgetId);
    if (widgetToAdd) {
      setWidgets([...widgets, { id: widgetToAdd.id, span: widgetToAdd.span }]);
    }
    setIsAddMenuOpen(false);
  };

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
  };

  // ─── XỬ LÝ SỰ KIỆN KÉO THẢ ──────────────────────────────────────────────────
  const onDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const newWidgets = [...widgets];
    const draggedItem = newWidgets[draggedIdx];
    newWidgets.splice(draggedIdx, 1);
    newWidgets.splice(index, 0, draggedItem);

    setDraggedIdx(index);
    setWidgets(newWidgets);
  };

  const onDragEnd = () => {
    setDraggedIdx(null);
  };

  // ─── GIAO DIỆN 1: Quản lý / Chọn Dashboard ────────────────────────────────
  if (!activeDashboard) {
    return (
      <div className="p-6 space-y-6 animate-fade-in max-w-6xl mx-auto">
        <div>
          <h2 className="text-xl font-700 text-slate-900">{greeting()}, {userName.split(' ').slice(-2).join(' ')} 👋</h2>
          <p className="text-sm text-slate-500 mt-0.5">Vui lòng chọn một Dashboard bên dưới để xem báo cáo chi tiết.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {availableDashboards.map((db) => {
            const Icon = db.icon;
            return (
              <button
                key={db.id}
                onClick={() => setActiveDashboard(db.id)}
                className="text-left bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className={`w-12 h-12 rounded-xl ${db.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className={db.color} />
                </div>
                <h3 className="text-base font-600 text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {db.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  {db.desc}
                </p>
                <div className="flex items-center text-xs font-600 text-indigo-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                  View Dashboard <ArrowRight size={14} className="ml-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const currentDbInfo = availableDashboards.find(db => db.id === activeDashboard);

  // ─── GIAO DIỆN 2: Chi tiết Dashboard đã chọn ──────────────────────────────
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveDashboard(null)}
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
            title="Quay lại danh sách Dashboard"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-xl font-700 text-slate-900">{currentDbInfo?.title || 'Dashboard'}</h2>
            <p className="text-sm text-slate-500 mt-0.5">Dữ liệu được cập nhật tự động cho kỳ báo cáo hiện tại.</p>
          </div>
        </div>

        {/* Nút Add Widget */}
        <div className="relative" ref={addMenuRef}>
          <button
            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-600 rounded-lg transition-colors"
          >
            <Plus size={14} /> Add Widget
          </button>

          {isAddMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-20 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100 mb-2">
                <p className="text-xs font-600 text-slate-900">Available Widgets</p>
              </div>
              {availableToAdd.length === 0 ? (
                <div className="px-4 py-3 text-xs text-slate-500 italic text-center">
                  All widgets are already added.
                </div>
              ) : (
                availableToAdd.map(w => (
                  <button
                    key={w.id}
                    onClick={() => handleAddWidget(w.id)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex flex-col group"
                  >
                    <span className="text-xs font-600 text-slate-900 group-hover:text-indigo-600">{w.title}</span>
                    <span className="text-[10px] text-slate-500">{w.desc}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon size={18} className={card.color} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-500 ${card.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                  {card.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {card.change}
                </span>
              </div>
              <div className="text-xl font-700 text-slate-900">{card.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{card.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{card.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Draggable Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        {widgets.map((widget, index) => {
          // Lấy thông tin widget từ ALL_WIDGETS để hiển thị Title chung
          const widgetInfo = ALL_WIDGETS.find(w => w.id === widget.id);

          return (
            <div
              key={widget.id}
              draggable
              onDragStart={(e) => onDragStart(e, index)}
              onDragOver={(e) => onDragOver(e, index)}
              onDragEnd={onDragEnd}
              className={`${widget.span} bg-white rounded-xl border border-slate-200 p-5 shadow-sm transition-all duration-200 ${draggedIdx === index ? 'opacity-40 scale-[0.98] border-indigo-400 border-dashed z-10' : 'opacity-100 hover:border-slate-300'
                }`}
            >
              {/* Common Header cho mọi Widget */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-600 text-slate-900">{widgetInfo?.title}</h3>
                  {widgetInfo?.desc && <p className="text-xs text-slate-400 mt-0.5">{widgetInfo.desc}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <div className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md cursor-move">
                    <GripHorizontal size={14} />
                  </div>
                  <button
                    onClick={() => handleRemoveWidget(widget.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Nội dung cụ thể của từng Widget */}
              {widget.id === 'revenue' && (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={revenueTrendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4338CA" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#4338CA" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#4338CA" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: '#4338CA' }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {widget.id === 'inventory' && (
                <>
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie data={inventoryStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                        {inventoryStatus.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `${v}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {inventoryStatus.map(s => (
                      <div key={s.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                          <span className="text-xs text-slate-600">{s.name}</span>
                        </div>
                        <span className="text-xs font-500 text-slate-900">{s.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {widget.id === 'category' && (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                    <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={110} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" name="Revenue" fill="#4338CA" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {widget.id === 'store' && (
                <div className="space-y-3">
                  {storePerformance.map(store => {
                    const pct = Math.round((store.revenue / store.target) * 100);
                    const onTarget = pct >= 100;
                    return (
                      <div key={store.store}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-700 font-500 truncate max-w-[180px]">{store.store}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-500 ${onTarget ? 'text-emerald-600' : 'text-amber-600'}`}>{pct}%</span>
                            <span className="text-xs font-500 text-slate-900">${(store.revenue / 1000).toFixed(0)}K</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${onTarget ? 'bg-emerald-500' : 'bg-amber-400'}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Widget Mới: Top Products */}
              {widget.id === 'top-products' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400">
                        <th className="pb-2 font-600 uppercase">Product Name</th>
                        <th className="pb-2 font-600 uppercase text-right">Category</th>
                        <th className="pb-2 font-600 uppercase text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Dùng mock data cơ bản giả lập topProducts */}
                      {[
                        { id: 1, name: 'Lego City Police Station', cat: 'Toys', rev: '$24,500' },
                        { id: 2, name: 'Monopoly Classic', cat: 'Board Games', rev: '$18,200' },
                        { id: 3, name: 'Nerf Elite Blaster', cat: 'Outdoor', rev: '$15,400' },
                      ].map((item, i) => (
                        <tr key={item.id} className="border-b border-slate-50 last:border-0">
                          <td className="py-2.5 font-500 text-slate-900 flex items-center gap-2">
                            <span className="text-slate-400 w-3">{i + 1}</span> {item.name}
                          </td>
                          <td className="py-2.5 text-right text-slate-500">{item.cat}</td>
                          <td className="py-2.5 text-right font-600 text-emerald-600">{item.rev}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}