import { useState } from 'react';
import { Database, Plus, RefreshCw, Edit, Trash2, CheckCircle, XCircle, Clock, X, TestTube, Eye, PowerOff, Save } from 'lucide-react';
import { dataSources as initialDataSources } from '../../data/mock';

export default function DataSources() {
  // Chuyển dataSources thành state để có thể cập nhật UI khi Edit/Disconnect
  const [sources, setSources] = useState(initialDataSources);

  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [testResult, setTestResult] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({
    name: '',
    type: 'PostgreSQL',
    host: '',
    port: '5432',
    database: '',
    username: '',
    password: '',
    status: 'connected'
  });

  const handleOpenAdd = () => {
    setModalMode('add');
    setEditingId(null);
    setForm({ name: '', type: 'PostgreSQL', host: '', port: '5432', database: '', username: '', password: '', status: 'connected' });
    setTestResult('idle');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ds: any) => {
    setModalMode('edit');
    setEditingId(ds.id);
    setForm({
      name: ds.name || '',
      type: ds.type || 'PostgreSQL',
      host: ds.host || '',
      port: ds.port || '',
      database: ds.database || '',
      username: ds.username || '',
      password: ds.password || '',
      status: ds.status || 'connected'
    });
    setTestResult('idle');
    setIsModalOpen(true);
  };

  const handleTest = async () => {
    setTestResult('testing');
    await new Promise(r => setTimeout(r, 1500));
    setTestResult('success');
    setForm(f => ({ ...f, status: 'connected' })); // Tự động đổi status thành connected nếu test thành công
  };

  const handleDisconnect = () => {
    setForm(f => ({ ...f, status: 'error' })); // Chuyển trạng thái sang Error/Disconnected
    setTestResult('idle');
  };

  const handleSave = () => {
    if (modalMode === 'add') {
      const newSource = {
        id: `ds-${Date.now()}`,
        name: form.name || 'New Database',
        type: form.type,
        host: form.host,
        port: form.port,
        database: form.database,
        status: form.status,
        tables: '0',
        size: '0 MB',
        lastSync: 'Just now'
      };
      setSources([newSource, ...sources]);
    } else {
      setSources(sources.map(s => s.id === editingId ? { ...s, ...form } : s));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 animate-fade-in space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-700 text-slate-900">Data Sources</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage database connections and synchronization settings.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-600 rounded-lg transition-colors"
        >
          <Plus size={14} />Add Data Source
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sources.map(ds => (
          <div key={ds.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ds.status === 'connected' ? 'bg-indigo-50' : 'bg-slate-100'}`}>
                  <Database size={20} className={ds.status === 'connected' ? 'text-indigo-600' : 'text-slate-400'} />
                </div>
                <div>
                  <h3 className="text-sm font-600 text-slate-900">{ds.name}</h3>
                  <span className="text-[10px] font-500 px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded mt-1 inline-block">{ds.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {ds.status === 'connected' ? (
                  <span className="flex items-center gap-1 text-[10px] font-600 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-600 text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />Disconnected
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-500 mb-4 flex-1">
              <div className="flex justify-between">
                <span>Host</span>
                <span className="font-mono text-slate-700 truncate max-w-[160px]">{ds.host}:{ds.port}</span>
              </div>
              <div className="flex justify-between">
                <span>Database</span>
                <span className="font-mono text-slate-700">{ds.database}</span>
              </div>
              <div className="flex justify-between">
                <span>Tables</span>
                <span className="font-500 text-slate-700">{ds.tables}</span>
              </div>
              <div className="flex justify-between">
                <span>Size</span>
                <span className="font-500 text-slate-700">{ds.size}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Sync</span>
                <span className={`flex items-center gap-1 ${ds.status === 'connected' ? 'text-emerald-600' : 'text-slate-400'}`}>
                  <Clock size={10} />{ds.lastSync}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100 flex-wrap">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 font-500">
                <Eye size={11} />View
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 font-500">
                <RefreshCw size={11} />Sync
              </button>
              <button
                onClick={() => handleOpenEdit(ds)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] border border-indigo-100 bg-indigo-50 rounded-lg hover:bg-indigo-100 text-indigo-700 font-600"
              >
                <Edit size={11} />Edit
              </button>
              <button
                onClick={() => setSources(sources.filter(s => s.id !== ds.id))}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] border border-red-100 rounded-lg hover:bg-red-50 text-red-500 font-500 ml-auto"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        ))}

        {/* Add Placeholder */}
        <button
          onClick={handleOpenAdd}
          className="bg-white rounded-xl border border-dashed border-slate-300 p-5 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all flex flex-col items-center justify-center gap-2 min-h-[200px] text-slate-400 hover:text-indigo-600 group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
            <Plus size={20} />
          </div>
          <span className="text-xs font-500">Add Data Source</span>
        </button>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg animate-slide-down">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Database size={16} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-600 text-slate-900">
                    {modalMode === 'add' ? 'Add Data Source' : 'Edit Data Source'}
                  </h3>
                  <p className="text-[10px] text-slate-500">{modalMode === 'add' ? 'Connect a new database' : 'Update connection settings'}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-500 text-slate-700 mb-1.5">Connection Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Production Retail DB" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-500 text-slate-700 mb-1.5">Database Type</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                  >
                    <option>PostgreSQL</option>
                    <option>MySQL</option>
                    <option>Microsoft SQL Server</option>
                    <option>Snowflake</option>
                    <option>BigQuery</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-500 text-slate-700 mb-1.5">Host</label>
                  <input value={form.host} onChange={e => setForm(f => ({ ...f, host: e.target.value }))} placeholder="db.example.com" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-500 text-slate-700 mb-1.5">Port</label>
                  <input value={form.port} onChange={e => setForm(f => ({ ...f, port: e.target.value }))} placeholder="5432" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-500 text-slate-700 mb-1.5">Database Name</label>
                  <input value={form.database} onChange={e => setForm(f => ({ ...f, database: e.target.value }))} placeholder="retail_db" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-500 text-slate-700 mb-1.5">Username</label>
                  <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="db_user" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-500 text-slate-700 mb-1.5">Password</label>
                  <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              {testResult === 'success' && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <CheckCircle size={14} className="text-emerald-600" />
                  <span className="text-xs text-emerald-700 font-500">Connection successful! Database is accessible.</span>
                </div>
              )}
              {testResult === 'error' && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <XCircle size={14} className="text-red-600" />
                  <span className="text-xs text-red-700 font-500">Connection failed. Please check credentials or host.</span>
                </div>
              )}

              {/* Hiển thị trạng thái hiện tại (nếu đang Edit) */}
              {modalMode === 'edit' && (
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-600 text-slate-700">Current Status:</span>
                    {form.status === 'connected' ? (
                      <span className="flex items-center gap-1 text-[10px] font-600 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Connected</span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-600 text-red-700 bg-red-100 px-2 py-0.5 rounded-full">Disconnected</span>
                    )}
                  </div>
                  {form.status === 'connected' && (
                    <button onClick={handleDisconnect} className="flex items-center gap-1 text-[11px] font-600 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors">
                      <PowerOff size={12} /> Disconnect
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
              <button
                onClick={handleTest}
                disabled={testResult === 'testing'}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-xs font-600 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                {testResult === 'testing' ? <div className="w-3 h-3 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" /> : <TestTube size={13} />}
                Test Connection
              </button>
              <button
                onClick={handleSave}
                className="ml-auto flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-600 rounded-lg transition-colors shadow-sm"
              >
                <Save size={13} />
                {modalMode === 'add' ? 'Save & Connect' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}