import { useState } from 'react';
import { BookMarked, Upload, RefreshCw, Trash2, Eye, CheckCircle, XCircle, Clock, Plus, FileText, X } from 'lucide-react';
import { knowledgeDocs } from '../../data/mock';

const statusConfig = {
  indexed: { label: 'Indexed', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, iconColor: 'text-emerald-600' },
  indexing: { label: 'Indexing...', color: 'bg-amber-100 text-amber-700', icon: Clock, iconColor: 'text-amber-600' },
  error: { label: 'Error', color: 'bg-red-100 text-red-700', icon: XCircle, iconColor: 'text-red-600' },
};

const uploadSteps = ['Uploading', 'Extracting text', 'Chunking', 'Embedding', 'Indexing', 'Completed'];

export default function KnowledgeBase() {
  const [showUpload, setShowUpload] = useState(false);
  const [uploadStep, setUploadStep] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);

  const simulateUpload = async () => {
    for (let i = 0; i < uploadSteps.length; i++) {
      setUploadStep(i);
      await new Promise(r => setTimeout(r, 700));
    }
    await new Promise(r => setTimeout(r, 500));
    setShowUpload(false);
    setUploadStep(-1);
  };

  return (
    <div className="p-6 animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BookMarked size={20} className="text-violet-600" />
            <h2 className="text-xl font-700 text-slate-900">Knowledge Base</h2>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">Manage enterprise documents for AI knowledge retrieval (RAG).</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-600 rounded-lg transition-colors"
        >
          <Upload size={14} />Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Documents', value: '6', sub: 'across all categories' },
          { label: 'Indexed Documents', value: '4', sub: 'ready for AI search' },
          { label: 'Total Chunks', value: '474', sub: 'vector embeddings' },
          { label: 'Vector Store', value: 'Qdrant', sub: 'Connected · Healthy' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xl font-700 text-slate-900">{s.value}</div>
            <div className="text-xs font-500 text-slate-600 mt-0.5">{s.label}</div>
            <div className="text-[10px] text-slate-400">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-600 text-slate-900">Documents</h3>
          <span className="text-xs text-slate-400">{knowledgeDocs.length} documents</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">Document</th>
                <th className="px-4 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">Type</th>
                <th className="px-4 py-3 text-center text-[10px] font-600 text-slate-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">Uploaded By</th>
                <th className="px-4 py-3 text-right text-[10px] font-600 text-slate-500 uppercase tracking-wide">Chunks</th>
                <th className="px-4 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">Updated</th>
                <th className="px-4 py-3 text-left text-[10px] font-600 text-slate-500 uppercase tracking-wide">Access</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {knowledgeDocs.map(doc => {
                const cfg = statusConfig[doc.status as keyof typeof statusConfig];
                const Icon = cfg.icon;
                return (
                  <tr key={doc.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                          <FileText size={14} className="text-violet-600" />
                        </div>
                        <span className="font-500 text-slate-900 max-w-[200px] truncate">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-500 text-slate-600">{doc.type}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-600 ${cfg.color}`}>
                        <Icon size={10} className={cfg.iconColor} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{doc.uploadedBy}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">{doc.chunks || '—'}</td>
                    <td className="px-4 py-3 text-slate-500">{doc.updated}</td>
                    <td className="px-4 py-3 text-slate-500 text-[11px]">{doc.access}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600"><Eye size={12} /></button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600"><RefreshCw size={12} /></button>
                        <button className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md animate-slide-down">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-sm font-600 text-slate-900">Upload Document</h3>
              {uploadStep < 0 && (
                <button onClick={() => setShowUpload(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
              )}
            </div>
            <div className="p-6 space-y-5">
              {uploadStep < 0 ? (
                <>
                  <div
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={e => { e.preventDefault(); setIsDragging(false); simulateUpload(); }}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? 'border-violet-400 bg-violet-50' : 'border-slate-300 hover:border-violet-300 hover:bg-violet-50/50'} cursor-pointer`}
                    onClick={simulateUpload}
                  >
                    <Upload size={28} className={`mx-auto mb-3 ${isDragging ? 'text-violet-500' : 'text-slate-400'}`} />
                    <p className="text-sm font-500 text-slate-700">Drop files here or click to browse</p>
                    <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, XLSX, TXT</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-500 text-slate-700 mb-1.5">Access Level</label>
                      <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none">
                        <option>All Staff</option>
                        <option>Store Managers</option>
                        <option>HR Only</option>
                        <option>Customer Service</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-500 text-slate-700 mb-1.5">Category</label>
                      <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none">
                        <option>SOP</option>
                        <option>Policy</option>
                        <option>Manual</option>
                        <option>Guideline</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-500 text-slate-700 mb-4">Processing: <span className="font-mono">New_Document.pdf</span></p>
                  {uploadSteps.map((step, i) => {
                    let status = i < uploadStep ? 'done' : i === uploadStep ? 'active' : 'pending';
                    return (
                      <div key={step} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          status === 'done' ? 'bg-emerald-100' : status === 'active' ? 'bg-violet-100' : 'bg-slate-100'
                        }`}>
                          {status === 'done' && <CheckCircle size={12} className="text-emerald-600" />}
                          {status === 'active' && <div className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-pulse" />}
                          {status === 'pending' && <div className="w-2 h-2 rounded-full bg-slate-300" />}
                        </div>
                        <span className={`text-xs font-500 ${status === 'done' ? 'text-emerald-700' : status === 'active' ? 'text-violet-700' : 'text-slate-400'}`}>{step}</span>
                        {status === 'active' && <span className="text-[10px] text-slate-400 animate-pulse">...</span>}
                      </div>
                    );
                  })}
                  {uploadStep === uploadSteps.length - 1 && (
                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <p className="text-xs text-emerald-700 font-500">Document indexed successfully! Available for AI knowledge search.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
