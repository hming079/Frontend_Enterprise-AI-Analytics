import { useState } from 'react';
import { FileText, Plus, Edit, Trash2, Search, Download, Upload, CheckCircle, Clock, Database } from 'lucide-react';
import { glossaryTerms } from '../../data/mock';

export default function BusinessGlossary() {
  const [search, setSearch] = useState('');

  const filtered = glossaryTerms.filter(t =>
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    t.synonyms.toLowerCase().includes(search.toLowerCase())
  );

  const activeTerms = glossaryTerms.filter(term => term.status === 'active').length;
  const draftTerms = glossaryTerms.filter(term => term.status === 'draft').length;
  const formulaTerms = glossaryTerms.filter(term => term.formula).length;
  const formulaCoverage = Math.round((formulaTerms / glossaryTerms.length) * 100);

  const metrics = [
    { label: 'Total Terms', value: glossaryTerms.length, detail: 'Across all definitions', icon: FileText, color: 'text-indigo-600', background: 'bg-indigo-50' },
    { label: 'Active Terms', value: activeTerms, detail: 'Ready for AI queries', icon: CheckCircle, color: 'text-emerald-600', background: 'bg-emerald-50' },
    { label: 'Draft Terms', value: draftTerms, detail: 'Awaiting review', icon: Clock, color: 'text-amber-600', background: 'bg-amber-50' },
    { label: 'Formula Coverage', value: `${formulaCoverage}%`, detail: `${formulaTerms} terms with formulas`, icon: Database, color: 'text-violet-600', background: 'bg-violet-50' },
  ];

  return (
    <div className="p-6 animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-indigo-600" />
            <h2 className="text-xl font-700 text-slate-900">Business Glossary</h2>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">Define business terminology and synonyms used by the AI Text-to-SQL engine.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-xs font-500 text-slate-600 hover:bg-slate-50 rounded-lg">
            <Upload size={13} />Import
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-xs font-500 text-slate-600 hover:bg-slate-50 rounded-lg">
            <Download size={13} />Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-600 rounded-lg transition-colors">
            <Plus size={14} />Add Term
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map(metric => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${metric.background} flex items-center justify-center flex-shrink-0`}>
                <Icon size={17} className={metric.color} />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-700 text-slate-900 leading-none">{metric.value}</div>
                <div className="text-xs font-600 text-slate-700 mt-1">{metric.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">{metric.detail}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search terms..."
            className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64"
          />
        </div>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} terms</span>
      </div>

      {/* AI Connection Notice */}
      <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
        <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-indigo-700 text-xs font-700">AI</span>
        </div>
        <div>
          <p className="text-xs font-600 text-indigo-800">Connected to Text-to-SQL Engine</p>
          <p className="text-xs text-indigo-600 mt-0.5">All terms, synonyms and formulas in this glossary are automatically used by the AI when generating SQL from natural language questions.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">Business Term</th>
                <th className="px-4 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">Technical Field</th>
                <th className="px-4 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">Synonyms</th>
                <th className="px-4 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">Definition</th>
                <th className="px-4 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">Formula</th>
                <th className="px-4 py-3 text-center text-[10px] font-600 text-slate-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(term => (
                <tr key={term.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-600 text-slate-900">{term.term}</td>
                  <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">{term.field}</td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {term.synonyms.split(', ').map(s => (
                        <span key={s} className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded text-[10px] font-mono">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-[200px]">
                    <span className="line-clamp-2">{term.definition}</span>
                  </td>
                  <td className="px-4 py-3">
                    {term.formula ? (
                      <code className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{term.formula}</code>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {term.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-600">
                        <CheckCircle size={9} />Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-600">
                        <Clock size={9} />Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600"><Edit size={12} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600"><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
