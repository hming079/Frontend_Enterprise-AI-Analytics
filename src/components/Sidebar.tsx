import {
  LayoutDashboard, Brain, BookOpen, BookMarked, FileText,
  Users, Database, GitBranch, BarChart3, ScrollText,
  ChevronLeft, ChevronRight, LogOut, Settings, Shield
} from 'lucide-react';
import type { UserRole } from '../data/mock';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  section: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  // WORKSPACE — all roles
  { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard, section: 'WORKSPACE', roles: ['user', 'manager', 'admin'] },
  { id: 'query', label: 'AI Data Query', icon: Brain, section: 'WORKSPACE', roles: ['user', 'manager', 'admin'] },
  { id: 'knowledge', label: 'Knowledge Assistant', icon: BookOpen, section: 'WORKSPACE', roles: ['user', 'manager', 'admin'] },

  // KNOWLEDGE MANAGEMENT — manager + admin
  { id: 'kb-manage', label: 'Knowledge Base', icon: BookMarked, section: 'KNOWLEDGE MANAGEMENT', roles: ['manager', 'admin'] },
  { id: 'glossary', label: 'Business Glossary', icon: FileText, section: 'KNOWLEDGE MANAGEMENT', roles: ['manager', 'admin'] },

  // ADMINISTRATION — admin only
  { id: 'admin', label: 'System Administration', icon: Shield, section: 'ADMINISTRATION', roles: ['admin'] },
  { id: 'users', label: 'Users & Roles', icon: Users, section: 'ADMINISTRATION', roles: ['admin'] },
  { id: 'data-sources', label: 'Data Sources', icon: Database, section: 'ADMINISTRATION', roles: ['admin'] },
  { id: 'schema', label: 'Schema & Metadata', icon: GitBranch, section: 'ADMINISTRATION', roles: ['admin'] },
  { id: 'stats', label: 'System Statistics', icon: BarChart3, section: 'ADMINISTRATION', roles: ['admin'] },
  { id: 'audit', label: 'Audit Logs', icon: ScrollText, section: 'ADMINISTRATION', roles: ['admin'] },
];

const sectionOrder = ['WORKSPACE', 'KNOWLEDGE MANAGEMENT', 'ADMINISTRATION'];

const sectionLabels: Record<string, string> = {
  'WORKSPACE': 'Workspace',
  'KNOWLEDGE MANAGEMENT': 'Knowledge Management',
  'ADMINISTRATION': 'Administration',
};

const roleLabels: Record<UserRole, string> = {
  admin: 'System Administrator',
  manager: 'Business Manager',
  user: 'Business User',
};

const roleDotColor: Record<UserRole, string> = {
  admin: 'bg-red-500',
  manager: 'bg-violet-500',
  user: 'bg-indigo-500',
};

const roleTagColor: Record<UserRole, string> = {
  admin: 'bg-red-50 text-red-700',
  manager: 'bg-violet-50 text-violet-700',
  user: 'bg-indigo-50 text-indigo-700',
};

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}

export default function Sidebar({
  currentPage, onNavigate, collapsed, onToggleCollapse,
  userRole, userName, onLogout,
}: SidebarProps) {
  const visibleItems = navItems.filter(i => i.roles.includes(userRole));

  const grouped = sectionOrder.reduce<Record<string, NavItem[]>>((acc, s) => {
    const items = visibleItems.filter(i => i.section === s);
    if (items.length) acc[s] = items;
    return acc;
  }, {});

  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <aside
      className={`flex flex-col bg-white border-r border-slate-200 flex-shrink-0 transition-all duration-200 ease-in-out`}
      style={{ width: collapsed ? 64 : 240, height: '100vh', position: 'sticky', top: 0 }}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-slate-200 flex-shrink-0 gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <Brain size={14} className="text-white" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-700 text-slate-900 leading-none">Enterprise AI</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Analytics Platform</div>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="flex-shrink-0 p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {sectionOrder.map(section => {
          const items = grouped[section];
          if (!items) return null;
          return (
            <div key={section} className="mb-3">
              {!collapsed && (
                <div className="px-2 mb-1 text-[10px] font-600 text-slate-400 uppercase tracking-widest select-none">
                  {sectionLabels[section]}
                </div>
              )}
              <div className="space-y-0.5">
                {items.map(item => {
                  const Icon = item.icon;
                  const active = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      title={collapsed ? item.label : undefined}
                      className={`
                        w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left text-sm
                        transition-colors duration-100
                        ${active
                          ? 'bg-indigo-50 text-indigo-700 font-500'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }
                        ${collapsed ? 'justify-center' : ''}
                      `}
                    >
                      <Icon
                        size={15}
                        className={`flex-shrink-0 ${active ? 'text-indigo-600' : 'text-slate-400'}`}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate leading-none">{item.label}</span>
                          {active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Settings — admin only, subtle */}
      {userRole === 'admin' && !collapsed && (
        <div className="px-2 py-1.5 border-t border-slate-100">
          <button
            onClick={() => onNavigate('settings')}
            className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs transition-colors ${currentPage === 'settings'
              ? 'bg-slate-100 text-slate-900 font-500'
              : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
          >
            <Settings size={13} className="flex-shrink-0" />
            <span>System Settings</span>
          </button>
        </div>
      )}
      {userRole === 'admin' && collapsed && (
        <div className="px-2 py-1.5 border-t border-slate-100">
          <button
            onClick={() => onNavigate('settings')}
            title="System Settings"
            className="w-full flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          >
            <Settings size={13} />
          </button>
        </div>
      )}

      {/* User profile */}
      <div className="border-t border-slate-200 p-2 flex-shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg group">
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-700 text-indigo-700">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-500 text-slate-900 truncate leading-tight">{userName}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${roleDotColor[userRole]}`} />
                <span className={`text-[10px] font-500 ${roleTagColor[userRole]}`}>
                  {roleLabels[userRole]}
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Sign out"
              className="p-1 rounded-md opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-opacity"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={onLogout}
            title="Sign out"
            className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          >
            <LogOut size={14} />
          </button>
        )}
      </div>
    </aside>
  );
}
