import { Star, BarChart3, Pin, Trash2, Share, TrendingUp, Download } from 'lucide-react';

const savedCharts = [
  { id: '1', title: 'Doanh thu theo cửa hàng Q4', type: 'Bar Chart', query: 'Doanh thu theo từng cửa hàng trong quý gần nhất?', savedAt: 'Nov 25, 2026', pinned: true, source: 'Maven Toys DB' },
  { id: '2', title: 'Top 10 sản phẩm tháng này', type: 'Table', query: 'Top 10 sản phẩm bán chạy nhất?', savedAt: 'Nov 24, 2026', pinned: false, source: 'Maven Toys DB' },
  { id: '3', title: 'Xu hướng doanh thu 12 tháng', type: 'Area Chart', query: 'Xu hướng doanh thu theo tháng trong năm nay?', savedAt: 'Nov 22, 2026', pinned: true, source: 'Maven Toys DB' },
  { id: '4', title: 'Phân bổ danh mục sản phẩm', type: 'Pie Chart', query: 'Tỷ lệ doanh thu theo danh mục sản phẩm?', savedAt: 'Nov 20, 2026', pinned: false, source: 'Maven Toys DB' },
];

const typeColors: Record<string, string> = {
  'Bar Chart': 'bg-indigo-100 text-indigo-700',
  'Table': 'bg-slate-100 text-slate-700',
  'Area Chart': 'bg-violet-100 text-violet-700',
  'Pie Chart': 'bg-emerald-100 text-emerald-700',
  'Line Chart': 'bg-amber-100 text-amber-700',
};

export default function SavedChartsPage() {
  return (
    <div className="p-6 animate-fade-in space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Star size={20} className="text-amber-500" />
          <h2 className="text-xl font-700 text-slate-900">Saved Analytics</h2>
        </div>
        <p className="text-sm text-slate-500 mt-0.5">Your pinned charts and saved query visualizations.</p>
      </div>

      {savedCharts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Star size={40} className="text-slate-300 mb-4" />
          <p className="text-sm text-slate-400">No saved analytics yet</p>
          <p className="text-xs text-slate-300 mt-1">Run a query in AI Data Query and pin charts to dashboard</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedCharts.map(chart => (
            <div key={chart.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <BarChart3 size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-600 text-slate-900">{chart.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-500 px-1.5 py-0.5 rounded-full ${typeColors[chart.type] || 'bg-slate-100 text-slate-600'}`}>{chart.type}</span>
                      {chart.pinned && (
                        <span className="flex items-center gap-0.5 text-[10px] text-amber-600 font-500">
                          <Pin size={9} />Pinned
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview placeholder */}
              <div className="h-32 bg-slate-50 rounded-lg border border-slate-100 mb-4 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp size={24} className="text-slate-300 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-300">Chart preview</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[10px] text-slate-400 mb-1">Original query</p>
                <p className="text-xs text-slate-600 italic">"{chart.query}"</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="text-[10px] text-slate-400">{chart.savedAt}</div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"><Download size={12} /></button>
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"><Share size={12} /></button>
                  <button className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
