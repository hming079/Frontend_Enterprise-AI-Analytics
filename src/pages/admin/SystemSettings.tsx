import { useState } from 'react';
import { Settings, Shield, Database, Brain, Zap, ScrollText, Lock, ChevronRight, Eye, EyeOff, Save, CheckCircle } from 'lucide-react';

const sections = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'database', label: 'Database', icon: Database },
  { id: 'llm', label: 'LLM Provider', icon: Brain },
  { id: 'ai-limits', label: 'AI Usage Limits', icon: Zap },
  { id: 'audit', label: 'Audit Logging', icon: ScrollText },
];

export default function SystemSettings() {
  const [activeSection, setActiveSection] = useState('general');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [provider, setProvider] = useState('gemini');
  const [model, setModel] = useState('gemini-2.0-flash');
  const [temp, setTemp] = useState(0.1);
  const [maxTokens, setMaxTokens] = useState(4096);

  const handleSave = async () => {
    setSaved(true);
    await new Promise(r => setTimeout(r, 1500));
    setSaved(false);
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Settings size={20} className="text-indigo-600" />
          <h2 className="text-xl font-700 text-slate-900">System Settings</h2>
        </div>
        <p className="text-sm text-slate-500">Configure platform behavior, security, AI providers and logging.</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-48 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {sections.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-left transition-colors border-b border-slate-50 last:border-0 ${
                    activeSection === s.id ? 'bg-indigo-50 text-indigo-700 font-500' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={14} className={activeSection === s.id ? 'text-indigo-600' : 'text-slate-400'} />
                  {s.label}
                  <ChevronRight size={12} className="ml-auto text-slate-300" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
            {activeSection === 'general' && (
              <>
                <h3 className="text-sm font-600 text-slate-900 pb-3 border-b border-slate-100">General Settings</h3>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-500 text-slate-700 mb-1.5">Platform Name</label>
                    <input defaultValue="Enterprise AI Analytics" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-500 text-slate-700 mb-1.5">Default Language</label>
                    <select className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none">
                      <option>Vietnamese (vi)</option>
                      <option>English (en)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-500 text-slate-700 mb-1.5">Session Timeout</label>
                    <select className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                      <option>8 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-500 text-slate-700 mb-1.5">Timezone</label>
                    <select className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none">
                      <option>Asia/Ho_Chi_Minh (UTC+7)</option>
                      <option>UTC</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-xs font-500 text-slate-900">Maintenance Mode</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Temporarily disable access for all users except administrators</p>
                  </div>
                  <button className="relative w-11 h-6 bg-slate-200 rounded-full transition-colors">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform" />
                  </button>
                </div>
              </>
            )}

            {activeSection === 'llm' && (
              <>
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-600 text-slate-900">LLM Provider Configuration</h3>
                  <div className="flex items-center gap-1.5 ml-auto text-xs text-emerald-600">
                    <CheckCircle size={12} />
                    <span className="font-500">Connected</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Lock size={13} className="text-amber-600" />
                    <p className="text-xs text-amber-700">API keys are encrypted and never exposed in the UI. Use environment variables for production deployments.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-500 text-slate-700 mb-1.5">Provider</label>
                    <select
                      value={provider}
                      onChange={e => setProvider(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="gemini">Google Gemini</option>
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Anthropic Claude</option>
                      <option value="azure">Azure OpenAI</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-500 text-slate-700 mb-1.5">Model</label>
                    <select
                      value={model}
                      onChange={e => setModel(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      {provider === 'gemini' && (
                        <>
                          <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                          <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                          <option value="gemini-2.0-pro">gemini-2.0-pro</option>
                        </>
                      )}
                      {provider === 'openai' && (
                        <>
                          <option value="gpt-4o">gpt-4o</option>
                          <option value="gpt-4o-mini">gpt-4o-mini</option>
                          <option value="gpt-4-turbo">gpt-4-turbo</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-500 text-slate-700 mb-1.5">API Key</label>
                    <div className="relative">
                      <input
                        type={showKey ? 'text' : 'password'}
                        defaultValue="sk-••••••••••••••••••••"
                        className="w-full px-3 py-2.5 pr-10 text-sm border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                      <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-500 text-slate-700 mb-1.5">Max Tokens</label>
                    <input
                      type="number"
                      value={maxTokens}
                      onChange={e => setMaxTokens(Number(e.target.value))}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-500 text-slate-700 mb-2">
                      Temperature: <span className="font-mono text-indigo-600">{temp}</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={temp}
                      onChange={e => setTemp(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>0 — Deterministic (SQL generation)</span>
                      <span>1 — Creative (knowledge answers)</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === 'ai-limits' && (
              <>
                <h3 className="text-sm font-600 text-slate-900 pb-3 border-b border-slate-100">AI Usage Limits</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Monthly Token Limit', value: '3,500,000', unit: 'tokens' },
                    { label: 'Daily Request Limit per User', value: '200', unit: 'requests' },
                    { label: 'Max SQL Self-Correction Attempts', value: '3', unit: 'attempts' },
                    { label: 'Max RAG Retrieved Chunks', value: '5', unit: 'chunks' },
                    { label: 'Query Result Row Limit', value: '10,000', unit: 'rows' },
                  ].map(limit => (
                    <div key={limit.label} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className="flex-1">
                        <p className="text-xs font-500 text-slate-900">{limit.label}</p>
                      </div>
                      <input
                        defaultValue={limit.value}
                        className="w-28 text-right px-3 py-1.5 text-sm font-mono border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                      <span className="text-xs text-slate-400 w-16">{limit.unit}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div>
                    <p className="text-xs font-500 text-amber-900">Alert threshold</p>
                    <p className="text-[11px] text-amber-700 mt-0.5">Send notification when usage exceeds 80% of monthly limit</p>
                  </div>
                  <button className="relative w-11 h-6 bg-amber-500 rounded-full">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>
              </>
            )}

            {activeSection === 'security' && (
              <>
                <h3 className="text-sm font-600 text-slate-900 pb-3 border-b border-slate-100">Security Settings</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Two-Factor Authentication (2FA)', desc: 'Require 2FA for all admin accounts', enabled: true },
                    { label: 'IP Allowlist', desc: 'Restrict access to specific IP ranges', enabled: false },
                    { label: 'Force Password Reset', desc: 'Require password change every 90 days', enabled: true },
                    { label: 'Audit All AI Queries', desc: 'Log all AI interactions for compliance', enabled: true },
                    { label: 'SQL Injection Prevention', desc: 'Validate all generated SQL before execution', enabled: true },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="text-xs font-500 text-slate-900">{item.label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      <button className={`relative w-11 h-6 rounded-full transition-colors ${item.enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.enabled ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!['general', 'llm', 'ai-limits', 'security'].includes(activeSection) && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Settings size={32} className="text-slate-300 mb-3" />
                <p className="text-sm text-slate-400">Configuration for <strong className="capitalize">{activeSection.replace('-', ' ')}</strong></p>
                <p className="text-xs text-slate-300 mt-1">Settings available in production deployment</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-600 rounded-lg transition-colors"
              >
                {saved ? <><CheckCircle size={13} />Saved!</> : <><Save size={13} />Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
