import { useState, useRef, useEffect, useCallback } from 'react';
import {
  BookOpen, Send, FileText, X, ExternalLink, CheckCircle, Sparkles, User,
  Clock, Search, Plus, MoreHorizontal, Trash2, Star, MessageSquare
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Source {
  id: string;
  title: string;
  file: string;
  page: number;
  excerpt: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  loading?: boolean;
}

interface ConvHistory {
  id: string;
  question: string;
  time: string;
  citations: number;
  category?: string;
}

// ─── Mock History Data ────────────────────────────────────────────────────────

const historyToday: ConvHistory[] = [
  { id: 'c1', question: 'Quy trình xử lý hàng hóa hết hạn như thế nào?', time: '10:25 AM', citations: 3 },
  { id: 'c2', question: 'Chính sách đổi trả hàng của khách hàng?', time: '09:40 AM', citations: 2 },
];

const historyLast7: ConvHistory[] = [
  { id: 'c3', question: 'Quy trình duyệt nghỉ phép năm 2026?', time: 'Nov 24', citations: 2 },
  { id: 'c4', question: 'Chính sách thưởng doanh số cho nhân viên?', time: 'Nov 23', citations: 4 },
  { id: 'c5', question: 'Thủ tục báo cáo sự cố cửa hàng như thế nào?', time: 'Nov 22', citations: 1 },
];

const historyLast30: ConvHistory[] = [
  { id: 'c6', question: 'Quy định về giờ làm việc và ca làm?', time: 'Nov 10', citations: 2 },
  { id: 'c7', question: 'Chính sách đào tạo nhân viên mới?', time: 'Nov 5', citations: 3 },
];

// Pre-built conversation threads to restore
const conversationsByHistory: Record<string, Message[]> = {
  c1: [
    { id: '1', role: 'user', content: 'Quy trình xử lý hàng hóa hết hạn như thế nào?' },
    {
      id: '2', role: 'assistant',
      content: `Quy trình xử lý hàng hóa hết hạn tại chuỗi cửa hàng bao gồm **4 bước chính**:\n\n**1. Phát hiện và tách biệt**\nKhi phát hiện hàng hóa hết hạn hoặc sắp hết hạn (trong vòng 30 ngày), nhân viên phải ngay lập tức tách biệt khỏi khu vực trưng bày và gắn nhãn "KHÔNG BÁN".\n\n**2. Báo cáo quản lý**\nBáo cáo cho quản lý cửa hàng trong vòng 1 giờ kể từ khi phát hiện. Ghi nhận vào hệ thống quản lý tồn kho với đầy đủ thông tin.\n\n**3. Xử lý và phân loại**\nQuản lý quyết định phương án: (a) Trả về nhà cung cấp, (b) Tiêu hủy theo quy trình, (c) Giảm giá thanh lý nếu còn an toàn.\n\n**4. Ghi nhận và báo cáo**\nCập nhật báo cáo tổn thất hàng hóa hàng tuần, gửi lên bộ phận Vận hành.`,
      sources: [
        { id: 's1', title: 'SOP Xử lý hàng hóa hết hạn', file: 'SOP_Inventory_2026.pdf', page: 12, excerpt: '4.1 Khi phát hiện hàng hóa hết hạn, nhân viên phải ngay lập tức tách biệt khỏi khu vực bán hàng và gắn nhãn "KHÔNG BÁN". Báo cáo ngay cho quản lý cửa hàng trong vòng 1 giờ...' },
        { id: 's2', title: 'Chính sách hàng hóa hết hạn', file: 'Expired_Product_Policy.pdf', page: 4, excerpt: 'Điều 3.2: Tất cả sản phẩm có ngày hết hạn trong vòng 30 ngày phải được đưa vào khu vực kiểm tra đặc biệt...' },
        { id: 's3', title: 'Hướng dẫn vận hành cửa hàng', file: 'Store_Operation_Manual.pdf', page: 28, excerpt: 'Quy trình kiểm kho hàng ngày: Nhân viên kho phải thực hiện kiểm tra hạn sử dụng của các mặt hàng trong danh mục ưu tiên...' },
      ],
    },
  ],
  c3: [
    { id: '1', role: 'user', content: 'Quy trình duyệt nghỉ phép năm 2026?' },
    {
      id: '2', role: 'assistant',
      content: `Quy trình duyệt nghỉ phép năm 2026 bao gồm **3 giai đoạn**:\n\n**1. Đề xuất của nhân viên**\nNhân viên gửi yêu cầu nghỉ phép qua hệ thống HR hoặc điền vào Mẫu NP-01 trước ít nhất **3 ngày làm việc** đối với nghỉ phép dưới 3 ngày, hoặc **7 ngày làm việc** với nghỉ phép trên 3 ngày.\n\n**2. Xét duyệt của quản lý trực tiếp**\nQuản lý trực tiếp xem xét và phê duyệt trong vòng 24 giờ. Cần cân nhắc lịch làm việc của bộ phận và số ngày phép còn lại của nhân viên.\n\n**3. Xác nhận từ HR**\nHR xác nhận và cập nhật vào hệ thống theo dõi phép năm. Nhân viên nhận thông báo qua email.`,
      sources: [
        { id: 's1', title: 'Chính sách nghỉ phép 2026', file: 'Employee_Leave_Policy.pdf', page: 4, excerpt: 'Nhân viên cần gửi yêu cầu nghỉ phép tối thiểu 3 ngày làm việc trước ngày nghỉ đối với kỳ nghỉ dưới 3 ngày...' },
        { id: 's2', title: 'HR Handbook 2026', file: 'HR_Handbook_2026.docx', page: 12, excerpt: 'Mọi yêu cầu nghỉ phép phải được quản lý trực tiếp phê duyệt trong vòng 24 giờ làm việc kể từ khi nhận được đề xuất...' },
      ],
    },
  ],
};

// ─── Suggestions ─────────────────────────────────────────────────────────────

const suggestions = [
  'Quy trình xử lý hàng hóa hết hạn như thế nào?',
  'Chính sách đổi trả hàng của khách hàng?',
  'Quy trình duyệt nghỉ phép năm 2026?',
  'Chính sách thưởng doanh số cho nhân viên bán hàng?',
  'Thủ tục báo cáo sự cố cửa hàng?',
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: '0', role: 'assistant',
    content: 'Xin chào! Tôi là Knowledge Assistant. Tôi có thể giúp bạn tra cứu thông tin từ các tài liệu nội bộ như SOP, chính sách vận hành, hướng dẫn nghiệp vụ. Hãy đặt câu hỏi bằng tiếng Việt.',
  },
];

// ─── History Drawer ───────────────────────────────────────────────────────────

interface KnowledgeHistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelectConv: (id: string) => void;
  activeId: string | null;
}

function KnowledgeHistoryDrawer({ open, onClose, onSelectConv, activeId }: KnowledgeHistoryDrawerProps) {
  const [search, setSearch] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filter = (items: ConvHistory[]) =>
    items.filter(i => i.question.toLowerCase().includes(search.toLowerCase()));

  const todayF = filter(historyToday);
  const last7F = filter(historyLast7);
  const last30F = filter(historyLast30);
  const hasAny = todayF.length + last7F.length + last30F.length > 0;

  useEffect(() => {
    if (!menuOpenId) return;
    const h = () => setMenuOpenId(null);
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, [menuOpenId]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  const renderGroup = (label: string, items: ConvHistory[]) => {
    if (!items.length) return null;
    return (
      <div key={label} className="mb-4">
        <div className="px-3 mb-1 text-[10px] font-600 text-slate-400 uppercase tracking-widest">{label}</div>
        <div className="space-y-0.5">
          {items.map(item => (
            <div key={item.id} className="relative group">
              <button
                onClick={() => onSelectConv(item.id)}
                className={`w-full flex flex-col items-start gap-1 px-3 py-2.5 rounded-lg text-left transition-colors ${activeId === item.id ? 'bg-violet-50' : 'hover:bg-slate-50'
                  }`}
              >
                <p className={`text-xs leading-snug line-clamp-2 ${activeId === item.id ? 'text-violet-700 font-500' : 'text-slate-700'}`}>
                  {item.question}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">{item.time}</span>
                  {item.citations > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-violet-100 text-violet-700 rounded font-500">
                      {item.citations} source{item.citations > 1 ? 's' : ''}
                    </span>
                  )}
                  {item.category && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-500">
                      {item.category}
                    </span>
                  )}
                </div>
              </button>

              <button
                onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === item.id ? null : item.id); }}
                className="absolute right-2 top-2.5 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-opacity"
              >
                <MoreHorizontal size={13} />
              </button>

              {menuOpenId === item.id && (
                <div
                  className="absolute right-2 top-8 z-20 bg-white border border-slate-200 rounded-xl shadow-lg py-1 w-36 animate-slide-down"
                  onClick={e => e.stopPropagation()}
                >
                  {[
                    { label: 'Open', action: () => { onSelectConv(item.id); setMenuOpenId(null); } },
                    { label: 'Pin', action: () => setMenuOpenId(null) },
                    { label: 'Rename', action: () => setMenuOpenId(null) },
                    { label: 'Delete', action: () => { setDeleteTarget(item.id); setMenuOpenId(null); }, danger: true },
                  ].map(opt => (
                    <button
                      key={opt.label}
                      onClick={opt.action}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 text-left ${opt.danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {deleteTarget === item.id && (
                <div className="mx-3 mb-1 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-xs text-red-700 font-500 mb-2">Delete this conversation?</p>
                  <div className="flex gap-2">
                    <button onClick={() => setDeleteTarget(null)} className="flex-1 py-1 text-[11px] border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">Cancel</button>
                    <button onClick={() => setDeleteTarget(null)} className="flex-1 py-1 text-[11px] bg-red-600 hover:bg-red-700 text-white rounded-lg font-500">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className="flex-shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-hidden transition-all duration-200 ease-in-out"
      style={{ width: open ? 280 : 0 }}
    >
      <div className="w-[280px] flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-shrink-0">
          <div>
            <p className="text-xs font-600 text-slate-900">Chat History</p>
            <p className="text-[10px] text-slate-400">Lịch sử hỏi đáp tri thức</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2.5 border-b border-slate-100 flex-shrink-0">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm trong lịch sử..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 placeholder-slate-400"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-2">
          {hasAny ? (
            <>
              {renderGroup('Today', todayF)}
              {renderGroup('Last 7 Days', last7F)}
              {renderGroup('Last 30 Days', last30F)}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <MessageSquare size={24} className="text-slate-300 mb-2" />
              <p className="text-xs text-slate-400">
                {search ? 'Không tìm thấy kết quả.' : 'Chưa có cuộc hội thoại nào.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Source Preview Panel ─────────────────────────────────────────────────────

function SourcePanel({ source, onClose }: { source: Source; onClose: () => void }) {
  return (
    <div className="w-72 border-l border-slate-200 bg-white flex flex-col flex-shrink-0 animate-slide-down">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-violet-600" />
          <span className="text-xs font-600 text-slate-900">Source Preview</span>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X size={14} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <h4 className="text-sm font-600 text-slate-900 mb-1">{source.title}</h4>
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1"><FileText size={11} />{source.file}</span>
          <span>Page {source.page}</span>
        </div>
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[10px] font-600 text-violet-600 uppercase tracking-wide">Relevant Excerpt</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed italic">"{source.excerpt}"</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Relevance Score</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full" style={{ width: '92%' }} />
              </div>
              <span className="font-500 text-slate-700">92%</span>
            </div>
          </div>
        </div>
        <button className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 px-4 border border-violet-200 rounded-lg text-xs font-500 text-violet-600 hover:bg-violet-50 transition-colors">
          <ExternalLink size={12} />Open Document
        </button>
      </div>
    </div>
  );
}

// ─── Message Renderer ─────────────────────────────────────────────────────────

function MessageBubble({ msg, onSourceClick }: { msg: Message; onSourceClick: (s: Source) => void }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end gap-2.5">
        <div className="max-w-lg bg-indigo-600 text-white text-sm px-4 py-3 rounded-2xl rounded-tr-sm leading-relaxed">
          {msg.content}
        </div>
        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <User size={13} className="text-indigo-600" />
        </div>
      </div>
    );
  }

  if (msg.loading) {
    return (
      <div className="flex gap-2.5">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <Sparkles size={12} className="text-white" />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl rounded-tl-sm px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-violet-400"
                  style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
            <span className="text-xs text-slate-400">Đang tìm kiếm trong knowledge base...</span>
          </div>
        </div>
      </div>
    );
  }

  // Format content — simple bold support
  const formatContent = (text: string) =>
    text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const rendered = parts.map((p, j) =>
        p.startsWith('**') ? <strong key={j} className="text-slate-900 font-600">{p.slice(2, -2)}</strong> : p
      );
      if (!line.trim()) return <div key={i} className="h-1.5" />;
      return <p key={i} className="text-sm text-slate-700 leading-relaxed">{rendered}</p>;
    });

  return (
    <div className="flex gap-2.5">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles size={12} className="text-white" />
      </div>
      <div className="max-w-2xl flex-1">
        <div className="bg-white border border-slate-200 rounded-xl rounded-tl-sm px-4 py-4 shadow-sm">
          <div className="space-y-0.5 mb-4">{formatContent(msg.content)}</div>

          {msg.sources && msg.sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={12} className="text-emerald-500" />
                <span className="text-[10px] font-600 text-slate-500 uppercase tracking-wide">Sources Verified</span>
                <span className="text-[10px] text-slate-400">— {msg.sources.length} documents</span>
              </div>
              <div className="space-y-1">
                {msg.sources.map((src, i) => (
                  <button
                    key={src.id}
                    onClick={() => onSourceClick(src)}
                    className="w-full flex items-start gap-2 p-2.5 rounded-lg border border-slate-100 hover:border-violet-200 hover:bg-violet-50 text-left transition-all group"
                  >
                    <div className="w-5 h-5 rounded bg-slate-100 group-hover:bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-700 text-slate-500 group-hover:text-violet-600">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-500 text-slate-700 group-hover:text-violet-700 truncate">{src.file}</p>
                      <p className="text-[10px] text-slate-400">Page {src.page}</p>
                    </div>
                    <ExternalLink size={11} className="text-slate-300 group-hover:text-violet-400 flex-shrink-0 mt-0.5" />
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                AI answer based on verified enterprise documents
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function KnowledgePage() {
  const [historyOpen, setHistoryOpen] = useState(true);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    setInput('');
    setLoading(true);
    setActiveConvId(null);

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    const loadMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: '', loading: true };
    setMessages(prev => [...prev, userMsg, loadMsg]);

    await new Promise(r => setTimeout(r, 1800));

    const aiMsg: Message = {
      id: (Date.now() + 2).toString(),
      role: 'assistant',
      content: `Dựa trên tài liệu nội bộ, tôi tìm thấy thông tin về "${text}".\n\nQuy trình tiêu chuẩn bao gồm các bước chính được mô tả trong SOP và hướng dẫn vận hành. Nhân viên cần tuân thủ đúng quy trình và báo cáo lên quản lý trực tiếp khi có vấn đề phát sinh.\n\nĐể biết thêm chi tiết, vui lòng tham khảo tài liệu được trích dẫn bên dưới.`,
      sources: [
        { id: 's1', title: 'Hướng dẫn vận hành', file: 'Store_Operation_Manual.pdf', page: 12, excerpt: 'Nhân viên cần báo cáo ngay lập tức cho quản lý cửa hàng khi phát hiện tình huống bất thường...' },
        { id: 's2', title: 'SOP Nghiệp vụ 2026', file: 'SOP_Operations_2026.pdf', page: 7, excerpt: 'Quy trình xử lý được chia thành 3 giai đoạn: phát hiện, xử lý và báo cáo...' },
      ],
    };

    setMessages(prev => [...prev.slice(0, -1), aiMsg]);
    setLoading(false);
  }, [loading]);

  const handleSelectConv = (id: string) => {
    setActiveConvId(id);
    const thread = conversationsByHistory[id];
    if (thread) {
      setMessages(thread);
    } else {
      const item = [...historyToday, ...historyLast7, ...historyLast30].find(i => i.id === id);
      if (item) {
        setMessages([
          { id: '0', role: 'user', content: item.question },
          { id: '1', role: 'assistant', content: `Đây là câu trả lời đã được lưu cho câu hỏi: "${item.question}". Câu trả lời được tổng hợp từ ${item.citations} tài liệu nội bộ.`, sources: [] },
        ]);
      }
    }
    setSelectedSource(null);
  };

  const handleNewConversation = () => {
    setMessages(INITIAL_MESSAGES);
    setActiveConvId(null);
    setSelectedSource(null);
    setInput('');
  };

  const isDefaultState = messages.length <= 1;

  return (
    <div className="flex h-full min-h-0">
      {/* History Drawer */}
      <KnowledgeHistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelectConv={handleSelectConv}
        activeId={activeConvId}
      />

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sub-header */}
        <div className="flex items-center gap-3 px-5 py-2.5 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-violet-600">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            <span className="font-500">Enterprise RAG</span>
            <span className="text-slate-400">· 4 documents indexed</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setHistoryOpen(o => !o)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-500 rounded-lg border transition-colors ${historyOpen
                  ? 'bg-violet-50 border-violet-200 text-violet-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
            >
              <Clock size={13} />History
            </button>
            <button
              onClick={handleNewConversation}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-600 rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors"
            >
              <Plus size={13} />New Conversation
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Suggestions — shown when fresh conversation */}
          {isDefaultState && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-3">
                  <BookOpen size={20} className="text-violet-600" />
                </div>
                <h3 className="text-base font-600 text-slate-900 mb-1">Knowledge Assistant</h3>
                <p className="text-sm text-slate-500">Tra cứu tài liệu nội bộ, SOP, chính sách và quy trình nghiệp vụ.</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-600 text-slate-400 uppercase tracking-widest mb-2">Câu hỏi thường gặp</p>
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="w-full flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-violet-300 hover:bg-violet-50/50 text-left transition-all group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-violet-400 flex-shrink-0" />
                    <span className="text-sm text-slate-700 group-hover:text-violet-700">{s}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Thread */}
          {!isDefaultState && (
            <div className="max-w-2xl mx-auto space-y-5">
              {messages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  onSourceClick={setSelectedSource}
                />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 bg-white px-5 py-4 flex-shrink-0">
          <div className="max-w-2xl mx-auto flex gap-3">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              placeholder="Đặt câu hỏi về chính sách, quy trình hoặc nghiệp vụ..."
              rows={2}
              className="flex-1 px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 resize-none placeholder-slate-400 text-slate-900 leading-relaxed"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="px-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl transition-colors flex items-center justify-center"
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Send size={16} />
              }
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 max-w-2xl mx-auto">
            Câu trả lời được tạo từ tài liệu nội bộ đã được kiểm duyệt. Nhấn vào citation để xem nguồn gốc.
          </p>
        </div>
      </div>

      {/* Source Preview Panel */}
      {selectedSource && (
        <SourcePanel source={selectedSource} onClose={() => setSelectedSource(null)} />
      )}
    </div>
  );
}
