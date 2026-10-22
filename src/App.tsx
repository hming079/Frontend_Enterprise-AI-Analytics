import { useState } from 'react';
import { aiUsageData, type UserRole } from './data/mock';

// Layout
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// Auth
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Business User pages
import DashboardPage from './pages/DashboardPage';
import AIQueryPage from './pages/AIQueryPage';
import KnowledgePage from './pages/KnowledgePage';
import QueryHistoryPage from './pages/QueryHistoryPage';
import SavedChartsPage from './pages/SavedChartsPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DataSources from './pages/admin/DataSources';
import SchemaMetadata from './pages/admin/SchemaMetadata';
import KnowledgeBase from './pages/admin/KnowledgeBase';
import BusinessGlossary from './pages/admin/BusinessGlossary';
import AIUsage from './pages/admin/AIUsage';
import SystemSettings from './pages/admin/SystemSettings';

type AuthPage = 'login' | 'register' | 'forgot';

interface PageConfig {
  title: string;
  subtitle?: string;
  showActions?: boolean;
}

const pageConfigs: Record<string, PageConfig> = {
  dashboard: { title: 'Overview Dashboard', subtitle: 'Retail Analytics', showActions: true },
  query: { title: 'AI Data Query', subtitle: 'Text-to-SQL · Vietnamese NL' },
  knowledge: { title: 'Knowledge Assistant', subtitle: 'Enterprise RAG' },
  saved: { title: 'Saved Analytics', subtitle: 'Pinned Charts' },
  'kb-manage': { title: 'Knowledge Base', subtitle: 'Document Management' },
  glossary: { title: 'Business Glossary', subtitle: 'AI Semantic Term Definitions' },
  admin: { title: 'System Administration', subtitle: 'Platform Overview' },
  users: { title: 'Users & Roles', subtitle: 'RBAC Management' },
  'data-sources': { title: 'Data Sources', subtitle: 'Database Connections' },
  schema: { title: 'Schema & Metadata', subtitle: 'AI Semantic Configuration' },
  'kb-admin': { title: 'Knowledge Base', subtitle: 'Document Indexing & RAG' },
  audit: { title: 'Audit Logs', subtitle: 'Query & Activity History' },
  'ai-usage': { title: 'AI Usage Monitoring', subtitle: 'Token & Cost Tracking' },
  stats: { title: 'System Statistics', subtitle: 'Platform Metrics' },
  settings: { title: 'System Settings', subtitle: 'Platform Configuration' },
};

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <span className="text-2xl">🔒</span>
      </div>
      <h3 className="text-lg font-700 text-slate-900 mb-2">Access Restricted</h3>
      <p className="text-sm text-slate-500 text-center max-w-xs">You do not have permission to access this section. Contact your administrator for access.</p>
    </div>
  );
}

function SharedDashboardsPage() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-700 text-slate-900 mb-2">Shared Dashboards</h2>
      <p className="text-sm text-slate-500 mb-6">Dashboards shared with your team.</p>
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-slate-200">
        <div className="text-4xl mb-4">📊</div>
        <p className="text-sm text-slate-500">No shared dashboards yet. Pin charts to share with your team.</p>
      </div>
    </div>
  );
}

function StatsPage() {
  const totalAiTokens = aiUsageData.reduce((total, day) => total + day.tokens, 0);
  const totalLlmCost = aiUsageData.reduce((total, day) => total + day.cost, 0);

  return (
    <div className="p-6">
      <h2 className="text-xl font-700 text-slate-900 mb-2">System Statistics</h2>
      <p className="text-sm text-slate-500 mb-6">Platform-wide performance metrics and analytics.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Queries (All Time)', value: '48,290' },
          { label: 'Documents Indexed', value: '4 / 6' },
          { label: 'Schema Tables Mapped', value: '12' },
          { label: 'Active Integrations', value: '3' },
          { label: 'Avg SQL Accuracy', value: '94.8%' },
          { label: 'Total Users Created', value: '128' },
          { label: 'AI Tokens Used (7 Days)', value: `${(totalAiTokens / 1000000).toFixed(2)}M` },
          { label: 'LLM Cost (7 Days)', value: `$${totalLlmCost.toFixed(2)}` },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="text-2xl font-700 text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [userName, setUserName] = useState('User');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogin = (role: UserRole, name: string) => {
    setUserRole(role);
    setUserName(name);
    setIsAuthenticated(true);
    // Admin lands on their system dashboard; others on business dashboard
    setCurrentPage(role === 'admin' ? 'admin' : 'dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthPage('login');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  // Unauthenticated
  if (!isAuthenticated) {
    if (authPage === 'register') return <RegisterPage onBack={() => setAuthPage('login')} />;
    if (authPage === 'forgot') return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="w-full max-w-sm text-center">
          <h2 className="text-2xl font-700 text-slate-900 mb-2">Quên mật khẩu</h2>
          <p className="text-sm text-slate-500 mb-6">Nhập email để nhận liên kết đặt lại mật khẩu.</p>
          <input type="email" placeholder="you@company.com" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          <button className="w-full py-2.5 bg-indigo-600 text-white text-sm font-500 rounded-lg hover:bg-indigo-700 mb-3">Gửi email</button>
          <button onClick={() => setAuthPage('login')} className="text-xs text-indigo-600 hover:text-indigo-700">← Quay lại đăng nhập</button>
        </div>
      </div>
    );
    return <LoginPage onLogin={handleLogin} onNavigate={(p) => setAuthPage(p)} />;
  }

  // Access control
  const adminOnlyPages = ['admin', 'users', 'data-sources', 'schema', 'kb-admin', 'audit', 'ai-usage', 'stats', 'settings'];
  const managerPlusPages = ['kb-manage', 'glossary'];

  const canAccess = (page: string) => {
    if (adminOnlyPages.includes(page) && userRole !== 'admin') return false;
    if (managerPlusPages.includes(page) && userRole === 'user') return false;
    return true;
  };

  const pageConfig = pageConfigs[currentPage] || { title: currentPage };

  const renderPage = () => {
    if (!canAccess(currentPage)) return <AccessDenied />;

    switch (currentPage) {
      // Workspace
      case 'dashboard': return <DashboardPage userName={userName} userRole={userRole} onNavigate={handleNavigate} />;
      case 'query': return <AIQueryPage />;
      case 'knowledge': return <KnowledgePage />;
      // Business tools
      case 'saved': return <SavedChartsPage />;
      case 'kb-manage': return <KnowledgeBase />;
      case 'glossary': return <BusinessGlossary />;
      // Admin
      case 'admin': return <AdminDashboard />;
      case 'users': return <UserManagement />;
      case 'data-sources': return <DataSources />;
      case 'schema': return <SchemaMetadata />;
      case 'kb-admin': return <KnowledgeBase />;
      case 'audit': return <QueryHistoryPage />;
      case 'ai-usage': return <AIUsage />;
      case 'stats': return <StatsPage />;
      case 'settings': return <SystemSettings />;
      default: return <DashboardPage userName={userName} userRole={userRole} onNavigate={handleNavigate} />;
    }
  };

  // Query and Knowledge pages need full-height flex layout (input pinned at bottom)
  const isFullHeight = ['knowledge', 'query'].includes(currentPage);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(c => !c)}
        userRole={userRole}
        userName={userName}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          title={pageConfig.title}
          subtitle={pageConfig.subtitle}
          showActions={pageConfig.showActions}
        />

        <main className={`flex-1 ${isFullHeight ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
          {isFullHeight ? (
            <div className="flex-1 overflow-hidden">
              {renderPage()}
            </div>
          ) : (
            renderPage()
          )}
        </main>
      </div>
    </div>
  );
}
