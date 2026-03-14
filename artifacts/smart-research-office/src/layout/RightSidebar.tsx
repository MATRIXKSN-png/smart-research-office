import React from 'react';
import {
  Link2,
  FileText,
  MessageSquare,
  Settings,
  ChevronLeft,
  Building2,
} from 'lucide-react';
import { AgentStatusCard } from '../components/AgentStatusCard';
import { mockAgents } from '../data/mockData';

type Page = 'upload' | 'extracted' | 'analysis' | 'settings';

interface RightSidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onClose?: () => void;
  isDrawer?: boolean;
}

const navItems: { id: Page; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'upload', label: 'ربط الملفات بمرجع', icon: Link2 },
  { id: 'extracted', label: 'النصوص المستخرجة', icon: FileText },
  { id: 'analysis', label: 'تحليل السؤال', icon: MessageSquare },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
];

export function RightSidebar({ currentPage, onNavigate, onClose, isDrawer = false }: RightSidebarProps) {
  return (
    <aside
      className="sidebar-gradient h-full flex flex-col overflow-hidden"
      style={{ direction: 'rtl' }}
    >
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-tight">المكتب الذكي</p>
            <p className="text-[10px] text-violet-300 leading-tight">للبحث العلمي</p>
          </div>
        </div>
        {isDrawer && onClose && (
          <button
            onClick={onClose}
            className="text-violet-300 hover:text-white transition-colors p-1"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
        <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest px-3 mb-3">
          التنقل الرئيسي
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onNavigate(item.id);
                    if (onClose) onClose();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-right
                    ${isActive
                      ? 'bg-white/20 text-white shadow-lg shadow-black/10'
                      : 'text-violet-200 hover:bg-white/10 hover:text-white'}
                  `}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-violet-300'}`} />
                  <span className="flex-1 text-right">{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-300 flex-shrink-0" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest px-3 mb-3">
            حالة الوكلاء الذكية
          </p>
          <div className="space-y-0.5">
            {mockAgents.map((agent) => (
              <AgentStatusCard key={agent.id} agent={agent} compact />
            ))}
          </div>
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <p className="text-[10px] text-violet-400 text-center">
          حقوق التصميم والبرمجة: <span className="text-violet-300 font-semibold">matrixksn</span>
        </p>
      </div>
    </aside>
  );
}
