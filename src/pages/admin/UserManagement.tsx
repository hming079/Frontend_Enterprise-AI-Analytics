import { useState } from 'react';
import {
  Search, Plus, MoreHorizontal, Edit, Shield, UserX, UserCheck,
  KeyRound, Eye, X, Users, Database, Layers, MapPin, Table as TableIcon, Columns, Save, Lock
} from 'lucide-react';
import { users, type User, type UserRole } from '../../data/mock';

// ─── Mở rộng User interface cho Data Level Security ──────────────────────────
interface AppUser extends User {
  allowedSchemas?: string[];
  allowedTables?: string[];
  restrictedColumns?: string[];
  rlsFilter?: string;
  assignedStores?: string[]; // Legacy/UI display
}

const roleConfig: Record<UserRole, { label: string; color: string }> = {
  admin: { label: 'System Administrator', color: 'bg-red-100 text-red-700' },
  manager: { label: 'Business Manager', color: 'bg-violet-100 text-violet-700' },
  user: { label: 'Business User', color: 'bg-indigo-100 text-indigo-700' },
};

const permissions = [
  { feature: 'Dashboard', admin: true, manager: true, user: true },
  { feature: 'AI Data Query', admin: true, manager: true, user: true },
  { feature: 'Knowledge Assistant', admin: true, manager: true, user: true },
  { feature: 'Query History', admin: true, manager: true, user: true },
  { feature: 'Knowledge Base Mgmt', admin: true, manager: true, user: false },
  { feature: 'Business Glossary', admin: true, manager: true, user: false },
  { feature: 'Data Sources', admin: true, manager: false, user: false },
  { feature: 'Schema & Metadata', admin: true, manager: false, user: false },
  { feature: 'User Management', admin: true, manager: false, user: false },
  { feature: 'System Statistics', admin: true, manager: false, user: false },
  { feature: 'Audit Logs', admin: true, manager: false, user: false },
];

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'permissions' | 'data-scope'>('users');

  // State quản lý việc Edit Data Scope
  const [isEditingData, setIsEditingData] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    schemas: string;
    tables: string;
    columns: string;
    rls: string;
  }>({ schemas: '', tables: '', columns: '', rls: '' });

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  // Khởi tạo data khi bấm Edit
  const handleStartEdit = () => {
    setEditFormData({
      schemas: (selectedUser?.allowedSchemas || ['Sales DB']).join(', '),
      tables: (selectedUser?.allowedTables || ['*']).join(', '),
      columns: (selectedUser?.restrictedColumns || []).join(', '),
      rls: selectedUser?.rlsFilter || (selectedUser?.role === 'user' ? "store_id IN ('HCM_01')" : ""),
    });
    setIsEditingData(true);
  };

  // Lưu cấu hình Data Scope
  const handleSaveEdit = () => {
    if (!selectedUser) return;

    // Parse chuỗi thành mảng
    const updatedUser: AppUser = {
      ...selectedUser,
      allowedSchemas: editFormData.schemas.split(',').map(s => s.trim()).filter(Boolean),
      allowedTables: editFormData.tables.split(',').map(s => s.trim()).filter(Boolean),
      restrictedColumns: editFormData.columns.split(',').map(s => s.trim()).filter(Boolean),
      rlsFilter: editFormData.rls.trim(),
    };

    setSelectedUser(updatedUser);
    setIsEditingData(false);

    // Trong thực tế sẽ gọi API update user ở đây
    // updateUserData(updatedUser);
  };

  return (
    <div className="p-6 animate-fade-in space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-700 text-slate-900">Users & Roles</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage user accounts, roles, and fine-grained data access policies.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-600 rounded-lg transition-colors">
          <Plus size={14} />Add User
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {[
          { id: 'users', label: 'User List', icon: Users },
          { id: 'permissions', label: 'Feature Permissions', icon: Shield },
          { id: 'data-scope', label: 'Data Access Control', icon: Database },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-500 border-b-2 transition-colors -mb-px ${activeTab === tab.id ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
              <Icon size={13} />{tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: USER LIST ────────────────────────────────────────────────── */}
      {activeTab === 'users' && (
        <div className="flex gap-4">
          <div className="flex-1 space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-56"
                />
              </div>
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
                {(['all', 'admin', 'manager', 'user'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1 text-xs font-500 rounded-md transition-colors capitalize ${roleFilter === r ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {r === 'all' ? 'All' : r === 'admin' ? 'Admin' : r === 'manager' ? 'Manager' : 'User'}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">User</th>
                    <th className="px-4 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">Role</th>
                    <th className="px-4 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">Department</th>
                    <th className="px-4 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(user => {
                    const rc = roleConfig[user.role];
                    return (
                      <tr
                        key={user.id}
                        className={`border-t border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${selectedUser?.id === user.id ? 'bg-indigo-50' : ''}`}
                        onClick={() => {
                          setSelectedUser(selectedUser?.id === user.id ? null : user);
                          setIsEditingData(false);
                        }}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-600 text-indigo-700">{user.avatar}</span>
                            </div>
                            <div>
                              <p className="font-500 text-slate-900">{user.name}</p>
                              <p className="text-[11px] text-slate-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-600 ${rc.color}`}>{rc.label}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{user.department}</td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-[10px] font-600 ${user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{user.lastLogin}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Detail Drawer */}
          {selectedUser && (
            <div className="w-96 flex-shrink-0 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col animate-slide-down">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <span className="text-xs font-600 text-slate-900">User Profile</span>
                <button onClick={() => setSelectedUser(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X size={14} /></button>
              </div>

              <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-200px)]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-700 text-indigo-700">{selectedUser.avatar}</span>
                  </div>
                  <div>
                    <p className="font-600 text-slate-900">{selectedUser.name}</p>
                    <p className="text-xs text-slate-400">{selectedUser.email}</p>
                    <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-600 ${roleConfig[selectedUser.role].color}`}>
                      {roleConfig[selectedUser.role].label}
                    </span>
                  </div>
                </div>

                {/* Phân quyền Dữ liệu (Edit/View Mode) */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-600 text-slate-900 flex items-center gap-1.5">
                      <Lock size={14} className="text-indigo-600" /> Data Control Policies
                    </p>
                    {!isEditingData ? (
                      <button onClick={handleStartEdit} className="text-[10px] flex items-center gap-1 font-600 text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">
                        <Edit size={10} /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => setIsEditingData(false)} className="text-[10px] font-600 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-md">
                          Cancel
                        </button>
                        <button onClick={handleSaveEdit} className="text-[10px] flex items-center gap-1 font-600 text-white bg-indigo-600 hover:bg-indigo-700 px-2 py-1 rounded-md">
                          <Save size={10} /> Save
                        </button>
                      </div>
                    )}
                  </div>

                  {!isEditingData ? (
                    <div className="space-y-4">
                      {/* View Mode */}
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide font-600 mb-1.5">Allowed Schemas</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(selectedUser.allowedSchemas || ['Sales DB', 'Inventory DB']).map(db => (
                            <span key={db} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-700 flex items-center gap-1">
                              <Layers size={10} className="text-slate-400" /> {db}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide font-600 mb-1.5">Allowed Tables</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(selectedUser.allowedTables || ['* (All Tables)']).map(tbl => (
                            <span key={tbl} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-700 flex items-center gap-1">
                              <TableIcon size={10} className="text-slate-400" /> {tbl}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide font-600 mb-1.5">Restricted Columns (Masked)</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(selectedUser.restrictedColumns && selectedUser.restrictedColumns.length > 0) ? selectedUser.restrictedColumns.map(col => (
                            <span key={col} className="px-2 py-0.5 bg-red-50 border border-red-100 text-red-600 rounded text-[10px] font-500 flex items-center gap-1">
                              <Columns size={10} /> {col}
                            </span>
                          )) : (
                            <span className="text-[10px] text-slate-400 italic">No restrictions</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide font-600 mb-1.5">Row-Level Security (RLS)</p>
                        {selectedUser.rlsFilter ? (
                          <div className="bg-slate-900 text-emerald-400 font-mono text-[10px] p-2 rounded-lg break-all">
                            WHERE {selectedUser.rlsFilter}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Bypass all Row-Level Filters</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Edit Mode */}
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-wide font-600 mb-1 block">Schemas (Comma separated)</label>
                        <input
                          type="text" value={editFormData.schemas} onChange={e => setEditFormData({ ...editFormData, schemas: e.target.value })}
                          className="w-full text-xs border border-slate-200 rounded p-1.5 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="e.g. Sales DB, HR DB"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-wide font-600 mb-1 block">Tables (Comma separated, * for all)</label>
                        <input
                          type="text" value={editFormData.tables} onChange={e => setEditFormData({ ...editFormData, tables: e.target.value })}
                          className="w-full text-xs border border-slate-200 rounded p-1.5 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="e.g. sales, products"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-wide font-600 mb-1 block">Restricted Columns</label>
                        <input
                          type="text" value={editFormData.columns} onChange={e => setEditFormData({ ...editFormData, columns: e.target.value })}
                          className="w-full text-xs border border-red-200 bg-red-50/30 rounded p-1.5 focus:ring-1 focus:ring-red-400 outline-none" placeholder="e.g. salary, credit_card"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-wide font-600 mb-1 block">RLS Filter (SQL WHERE Clause)</label>
                        <textarea
                          value={editFormData.rls} onChange={e => setEditFormData({ ...editFormData, rls: e.target.value })} rows={2}
                          className="w-full text-[10px] font-mono border border-slate-200 bg-slate-50 rounded p-1.5 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="e.g. store_id = 'S01' OR region = 'North'"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: FEATURE PERMISSIONS ──────────────────────────────────────── */}
      {activeTab === 'permissions' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Giữ nguyên như code cũ */}
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-600 text-slate-900">Role Permission Matrix</h3>
            <p className="text-xs text-slate-400 mt-0.5">Application feature access control by role</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-5 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide w-64">Feature</th>
                  <th className="px-4 py-3 text-center text-[10px] font-600 text-red-600 uppercase tracking-wide">
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full">Admin</span>
                  </th>
                  <th className="px-4 py-3 text-center text-[10px] font-600 text-violet-600 uppercase tracking-wide">
                    <span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full">Manager</span>
                  </th>
                  <th className="px-4 py-3 text-center text-[10px] font-600 text-indigo-600 uppercase tracking-wide">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">Business User</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((row, i) => (
                  <tr key={row.feature} className={`border-t border-slate-50 ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                    <td className="px-5 py-3 font-500 text-slate-700">{row.feature}</td>
                    {['admin', 'manager', 'user'].map(role => {
                      const allowed = row[role as 'admin' | 'manager' | 'user'];
                      return (
                        <td key={role} className="px-4 py-3 text-center">
                          {allowed ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-sm font-700">✓</span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 text-sm">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 3: DATA ACCESS SCOPE (Policy Overview) ──────────────────────── */}
      {activeTab === 'data-scope' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="mb-6">
              <h3 className="text-base font-600 text-slate-900">Fine-Grained Data Security Policies</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
                Overview of default data access policies per role. These policies dictate which databases, tables, and columns users can query via AI, and enforce Row-Level Security (RLS) to restrict data visibility. Admins can override these per user in the User Profile Drawer.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {[
                {
                  role: 'System Administrator', color: 'border-red-200 bg-red-50', badge: 'bg-red-100 text-red-700',
                  schema: 'All Databases (*)',
                  table: 'All Tables (*)',
                  column: 'No Restrictions',
                  rls: 'Bypass all Filters',
                },
                {
                  role: 'Business Manager', color: 'border-violet-200 bg-violet-50', badge: 'bg-violet-100 text-violet-700',
                  schema: 'Sales DB, Inventory DB',
                  table: 'sales, inventory, stores',
                  column: 'Restricted: employee_salary, margins',
                  rls: "region_id IN ('assigned_regions')",
                },
                {
                  role: 'Business User', color: 'border-indigo-200 bg-indigo-50', badge: 'bg-indigo-100 text-indigo-700',
                  schema: 'Sales DB (Views Only)',
                  table: 'sales_aggregated_view',
                  column: 'Restricted: customer_pii, costs',
                  rls: "store_id IN ('assigned_stores')",
                },
              ].map(item => (
                <div key={item.role} className={`rounded-xl border p-5 ${item.color} flex flex-col`}>
                  <div className="mb-4">
                    <span className={`text-[10px] font-600 px-2 py-1 rounded-full ${item.badge}`}>{item.role}</span>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-600 mb-1">Schema & Table Access</p>
                      <p className="text-xs font-500 text-slate-900 bg-white/60 px-2 py-1 rounded border border-white mb-1">{item.schema}</p>
                      <p className="text-xs font-500 text-slate-900 bg-white/60 px-2 py-1 rounded border border-white">{item.table}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-600 mb-1">Column Masking</p>
                      <p className={`text-xs font-500 bg-white/60 px-2 py-1 rounded border border-white ${item.column.includes('Restricted') ? 'text-red-600' : 'text-slate-900'}`}>{item.column}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-600 mb-1">Row-Level Filter (RLS)</p>
                      <p className="text-xs font-mono font-500 text-slate-800 bg-white/60 px-2 py-1.5 rounded border border-white">{item.rls}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}