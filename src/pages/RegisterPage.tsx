import { useState } from 'react';
import { Brain, ArrowLeft, ArrowRight } from 'lucide-react';

interface RegisterPageProps {
  onBack: () => void;
}

export default function RegisterPage({ onBack }: RegisterPageProps) {
  const [form, setForm] = useState({ name: '', email: '', department: '', password: '', confirm: '' });

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <div className="text-lg font-700 text-slate-900">Enterprise AI</div>
            <div className="text-xs text-slate-400">Analytics Platform</div>
          </div>
        </div>

        <h2 className="text-2xl font-700 text-slate-900 mb-1">Đăng ký tài khoản</h2>
        <p className="text-sm text-slate-500 mb-6">Tạo tài khoản mới để truy cập hệ thống</p>

        <div className="space-y-4">
          {[
            { key: 'name', label: 'Họ và tên', placeholder: 'Nguyễn Văn A' },
            { key: 'email', label: 'Email công ty', placeholder: 'you@company.com' },
            { key: 'department', label: 'Phòng ban', placeholder: 'Sales, Operations, HR...' },
            { key: 'password', label: 'Mật khẩu', placeholder: '••••••••', type: 'password' },
            { key: 'confirm', label: 'Xác nhận mật khẩu', placeholder: '••••••••', type: 'password' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-500 text-slate-700 mb-1.5">{field.label}</label>
              <input
                type={field.type || 'text'}
                value={form[field.key as keyof typeof form]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 placeholder-slate-400"
              />
            </div>
          ))}

          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-500 rounded-lg transition-colors">
            Đăng ký <ArrowRight size={14} />
          </button>

          <button onClick={onBack} className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft size={13} />Quay lại đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
