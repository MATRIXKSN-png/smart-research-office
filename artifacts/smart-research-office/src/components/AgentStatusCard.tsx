import React from 'react';
import { Briefcase, FileText, Scan, Brain, Search, Layers } from 'lucide-react';
import { Agent } from '../data/mockData';

interface AgentStatusCardProps {
  agent: Agent;
  compact?: boolean;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  briefcase: Briefcase,
  'file-text': FileText,
  scan: Scan,
  brain: Brain,
  search: Search,
  layers: Layers,
};

export function AgentStatusCard({ agent, compact = false }: AgentStatusCardProps) {
  const Icon = iconMap[agent.icon] || Briefcase;

  const statusColors = {
    'نشط الآن': { dot: 'bg-emerald-400', text: 'text-emerald-300', pulse: true },
    'في وضع الانتظار': { dot: 'bg-slate-400', text: 'text-slate-400', pulse: false },
    'غير متصل': { dot: 'bg-red-400', text: 'text-red-400', pulse: false },
  };

  const statusConfig = statusColors[agent.status] || statusColors['في وضع الانتظار'];

  if (compact) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group">
        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-3.5 h-3.5 text-violet-200" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-violet-100 truncate">{agent.name}</p>
        </div>
        <div className={`relative w-2 h-2 rounded-full flex-shrink-0 ${statusConfig.dot}`}>
          {statusConfig.pulse && (
            <span className={`absolute inset-0 rounded-full ${statusConfig.dot} animate-ping opacity-75`} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-violet-200" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-violet-100 truncate">{agent.name}</p>
        <p className={`text-[10px] ${statusConfig.text} font-medium mt-0.5`}>{agent.status}</p>
      </div>
      <div className={`relative w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusConfig.dot}`}>
        {statusConfig.pulse && (
          <span className={`absolute inset-0 rounded-full ${statusConfig.dot} animate-ping opacity-75`} />
        )}
      </div>
    </div>
  );
}
