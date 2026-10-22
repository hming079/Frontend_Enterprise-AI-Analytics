import { useState } from 'react';
import { GitBranch, Key, Link, RefreshCw, Save, Edit, Check } from 'lucide-react';
import { schemaData } from '../../data/mock';

const metadataMap: Record<string, { businessName: string; description: string; synonyms: string[]; formula?: string }> = {
  revenue: {
    businessName: 'Doanh thu',
    description: 'Tổng giá trị bán hàng đã hoàn thành trong kỳ báo cáo',
    synonyms: ['revenue', 'sales amount', 'doanh số', 'total sales', 'income'],
    formula: 'quantity × unit_price',
  },
  quantity: {
    businessName: 'Số lượng bán',
    description: 'Số lượng đơn vị sản phẩm được bán trong giao dịch',
    synonyms: ['qty', 'units sold', 'amount', 'số lượng'],
  },
  unit_price: {
    businessName: 'Đơn giá',
    description: 'Giá bán của một đơn vị sản phẩm tại thời điểm giao dịch',
    synonyms: ['price', 'unit cost', 'selling price', 'giá bán'],
  },
  date: {
    businessName: 'Ngày giao dịch',
    description: 'Ngày thực hiện giao dịch bán hàng',
    synonyms: ['transaction date', 'sale date', 'order date', 'ngày bán'],
  },
};

export default function SchemaMetadata() {
  const [selectedTable, setSelectedTable] = useState('sales');
  const [selectedColumn, setSelectedColumn] = useState<string | null>('revenue');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaved(true);
    setEditing(false);
    await new Promise(r => setTimeout(r, 1500));
    setSaved(false);
  };

  const meta = selectedColumn ? metadataMap[selectedColumn] : null;

  return (
    <div className="p-6 animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch size={20} className="text-indigo-600" />
            <h2 className="text-xl font-700 text-slate-900">Schema & Metadata</h2>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">Manage database schema and AI semantic metadata for Text-to-SQL.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-xs font-500 text-slate-700 hover:bg-slate-50 rounded-lg">
            <RefreshCw size={13} />Sync Schema
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-600 rounded-lg transition-colors"
          >
            {saved ? <><Check size={13} />Saved!</> : <><Save size={13} />Save Metadata</>}
          </button>
        </div>
      </div>

      {/* Data source badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Data Source:</span>
        <span className="text-xs font-500 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Maven Toys Demo Database (PostgreSQL)
        </span>
        <span className="text-[10px] text-slate-400">12 tables · Last synced 2 min ago</span>
      </div>

      <div className="flex gap-4 h-[calc(100vh-280px)]">
        {/* Tables panel */}
        <div className="w-48 flex-shrink-0 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-3 py-2.5 border-b border-slate-100">
            <span className="text-[10px] font-600 text-slate-400 uppercase tracking-wide">Tables</span>
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            {schemaData.tables.map(table => (
              <button
                key={table}
                onClick={() => { setSelectedTable(table); setSelectedColumn(null); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${
                  selectedTable === table ? 'bg-indigo-50 text-indigo-700 font-500' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                {table}
              </button>
            ))}
          </div>
        </div>

        {/* Columns panel */}
        <div className="w-72 flex-shrink-0 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-600 text-slate-900 font-mono">{selectedTable}</span>
              <span className="text-[10px] text-slate-400">{schemaData.columns.length} columns</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-3 py-2 text-left text-[10px] font-600 text-slate-400 uppercase tracking-wide">Column</th>
                  <th className="px-3 py-2 text-left text-[10px] font-600 text-slate-400 uppercase tracking-wide">Type</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {schemaData.columns.map(col => (
                  <tr
                    key={col.name}
                    onClick={() => setSelectedColumn(col.name)}
                    className={`border-t border-slate-50 cursor-pointer transition-colors ${
                      selectedColumn === col.name ? 'bg-indigo-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        {col.pk && <Key size={9} className="text-amber-500 flex-shrink-0" />}
                        {col.fk && <Link size={9} className="text-violet-500 flex-shrink-0" />}
                        <span className={`font-mono ${selectedColumn === col.name ? 'text-indigo-700 font-600' : 'text-slate-700'}`}>{col.name}</span>
                        {!col.nullable && <span className="text-red-400 text-[10px]">*</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-slate-400 text-[10px] font-mono">{col.type}</td>
                    <td className="px-3 py-2.5">
                      {metadataMap[col.name] && (
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" title="Has semantic metadata" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Metadata panel */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
            <div>
              <span className="text-sm font-600 text-slate-900">Semantic Metadata</span>
              {selectedColumn && <span className="ml-2 font-mono text-xs text-slate-400">→ {selectedTable}.{selectedColumn}</span>}
            </div>
            {selectedColumn && (
              <button
                onClick={() => setEditing(!editing)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 font-500"
              >
                <Edit size={12} />{editing ? 'Cancel' : 'Edit'}
              </button>
            )}
          </div>

          {!selectedColumn ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <GitBranch size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400">Select a column to view and edit its semantic metadata</p>
                <p className="text-xs text-slate-300 mt-1">Metadata is used by the AI Text-to-SQL engine</p>
              </div>
            </div>
          ) : meta ? (
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="p-3 bg-violet-50 border border-violet-200 rounded-lg">
                <p className="text-[10px] font-600 text-violet-600 uppercase tracking-wide mb-1">AI Metadata Notice</p>
                <p className="text-xs text-violet-700">This metadata is used by the Text-to-SQL engine to map business terminology to the correct database columns.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-600 text-slate-400 uppercase tracking-wide mb-2">Business Name (Vietnamese)</label>
                  {editing ? (
                    <input defaultValue={meta.businessName} className="w-full px-3 py-2 text-sm border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  ) : (
                    <p className="text-sm font-500 text-slate-900">{meta.businessName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-600 text-slate-400 uppercase tracking-wide mb-2">Technical Column</label>
                  <p className="text-sm font-mono text-slate-700">{selectedTable}.{selectedColumn}</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-600 text-slate-400 uppercase tracking-wide mb-2">Description</label>
                {editing ? (
                  <textarea defaultValue={meta.description} rows={2} className="w-full px-3 py-2 text-sm border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" />
                ) : (
                  <p className="text-sm text-slate-700 leading-relaxed">{meta.description}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-600 text-slate-400 uppercase tracking-wide mb-2">Synonyms / Aliases</label>
                <div className="flex flex-wrap gap-1.5">
                  {meta.synonyms.map(s => (
                    <span key={s} className="px-2 py-1 text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg font-mono">
                      {s}
                    </span>
                  ))}
                  {editing && (
                    <button className="px-2 py-1 text-xs border border-dashed border-slate-300 text-slate-400 rounded-lg">+ Add</button>
                  )}
                </div>
              </div>

              {meta.formula && (
                <div>
                  <label className="block text-[10px] font-600 text-slate-400 uppercase tracking-wide mb-2">Computation Formula</label>
                  <div className="px-3 py-2 bg-slate-900 rounded-lg">
                    <code className="text-xs font-mono text-emerald-400">{meta.formula}</code>
                  </div>
                </div>
              )}

              {editing && (
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-600 rounded-lg transition-colors">
                  <Save size={12} />Save Changes
                </button>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-slate-400">No semantic metadata defined for</p>
                <p className="font-mono text-sm text-slate-600 mt-1">{selectedTable}.{selectedColumn}</p>
                <button className="mt-4 px-4 py-2 text-xs bg-indigo-600 text-white rounded-lg font-500 hover:bg-indigo-700">
                  Add Metadata
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
