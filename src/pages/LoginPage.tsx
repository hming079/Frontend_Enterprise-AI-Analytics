import { useState } from 'react';
import { Brain, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import type { UserRole } from '../data/mock';

interface LoginPageProps {
  onLogin: (role: UserRole, name: string) => void;
  onNavigate: (page: 'register' | 'forgot') => void;
}

const demoAccounts = [
  { role: 'admin' as UserRole, label: 'Admin', email: 'admin@enterprise.ai', color: 'bg-red-50 border-red-200 text-red-700', dot: 'bg-red-500' },
  { role: 'manager' as UserRole, label: 'Manager', email: 'manager@enterprise.ai', color: 'bg-violet-50 border-violet-200 text-violet-700', dot: 'bg-violet-500' },
  { role: 'user' as UserRole, label: 'Business User', email: 'user@enterprise.ai', color: 'bg-indigo-50 border-indigo-200 text-indigo-700', dot: 'bg-indigo-500' },
];

const namesByRole: Record<UserRole, string> = {
  admin: 'Nguyễn Văn A',
  manager: 'Trần Thị B',
  user: 'Lê Văn C',
};

export default function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('admin@enterprise.ai');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const demo = demoAccounts.find(d => d.email === email);
    if (demo) {
      onLogin(demo.role, namesByRole[demo.role]);
    } else {
      setError('Tài khoản hoặc mật khẩu không đúng. Vui lòng thử tài khoản demo bên dưới.');
    }
    setLoading(false);
  };

  const quickLogin = async (role: UserRole) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    onLogin(role, namesByRole[role]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Brain size={20} className="text-white" />
              </div>
              <div>
                <div className="text-lg font-700 text-slate-900">Enterprise AI</div>
                <div className="text-xs text-slate-400">Analytics Platform</div>
              </div>
            </div>
            <h2 className="text-2xl font-700 text-slate-900">Đăng nhập</h2>
            <p className="text-sm text-slate-500 mt-1">Nền tảng Phân tích dữ liệu và Tra cứu tri thức doanh nghiệp</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-500 text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 placeholder-slate-400"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-500 text-slate-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 placeholder-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-xs text-slate-600">Ghi nhớ đăng nhập</span>
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-500"
              >
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-500 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Đăng nhập <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-500">Tài khoản Demo</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="space-y-2">
              {demoAccounts.map(acc => (
                <button
                  key={acc.role}
                  onClick={() => quickLogin(acc.role)}
                  disabled={loading}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-xs font-500 hover:opacity-80 transition-opacity ${acc.color}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${acc.dot}`} />
                  <span className="font-600">{acc.label}</span>
                  <span className="text-opacity-70 ml-auto">{acc.email}</span>
                  <ArrowRight size={12} />
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Chưa có tài khoản?{' '}
            <button onClick={() => onNavigate('register')} className="text-indigo-600 hover:text-indigo-700 font-500">
              Đăng ký
            </button>
          </p>
        </div>
      </div>

      {/* Right - Info panel */}
      <div className="hidden lg:flex w-96 bg-indigo-600 flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white" />
          <div className="absolute bottom-20 left-5 w-40 h-40 rounded-full bg-white" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="text-indigo-200" />
            <span className="text-xs text-indigo-200 font-500">Enterprise Grade Security</span>
          </div>
        </div>
        <div className="relative">
          <h3 className="text-2xl font-700 text-white mb-4 leading-tight">
            Phân tích dữ liệu bán lẻ với AI tự nhiên
          </h3>
          <p className="text-sm text-indigo-200 mb-8 leading-relaxed">
            Đặt câu hỏi bằng tiếng Việt, hệ thống tự động tạo SQL, thực thi trên cơ sở dữ liệu và trực quan hóa kết quả.
          </p>
          <div className="space-y-3">
            {['Text-to-SQL với tự sửa lỗi AI', 'Enterprise RAG Knowledge Search', 'RBAC phân quyền theo vai trò', 'Giám sát AI Usage & Audit Log'].map(f => (
              <div key={f} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <span className="text-sm text-indigo-100">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="text-xs text-indigo-300">© 2026 Enterprise AI Analytics — Academic Prototype</div>
        </div>
      </div>
    </div>
  );
}
