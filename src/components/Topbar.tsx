import { Bell, Search, ChevronDown, RefreshCw, Download, Calendar, Store } from 'lucide-react';
import { useState } from 'react';

interface TopbarProps {
  title: string;
  subtitle?: string;
  showActions?: boolean;
}

export default function Topbar({ title, subtitle, showActions = false }: TopbarProps) {
  const [dateRange, setDateRange] = useState('This Month');
  const [store, setStore] = useState('All Stores');

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 flex-shrink-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3">
          <h1 className="text-base font-600 text-slate-900 truncate">{title}</h1>
          {subtitle && <span className="text-sm text-slate-400 truncate hidden md:block">{subtitle}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {showActions && (
          <>
            <div className="relative">
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="pl-8 pr-7 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 appearance-none cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
                <option>Custom Range</option>
              </select>
              <Calendar size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={store}
                onChange={e => setStore(e.target.value)}
                className="pl-8 pr-7 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 appearance-none cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option>All Stores</option>
                <option>Store 12 - HCMC</option>
                <option>Store 07 - Hanoi</option>
                <option>Store 15 - Da Nang</option>
                <option>Store 03 - Can Tho</option>
              </select>
              <Store size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700">
              <RefreshCw size={13} />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-500">
              <Download size={12} />
              Export
            </button>
          </>
        )}

        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white w-48"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
