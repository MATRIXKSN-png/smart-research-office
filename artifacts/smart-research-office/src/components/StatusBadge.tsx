import React from 'react';

type StatusType = 'نشط الآن' | 'في وضع الانتظار' | 'غير متصل' | 'مكتمل' | 'قيد المعالجة' | 'في الانتظار' | 'متصل';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const configs: Record<StatusType, { bg: string; dot: string; text: string }> = {
    'نشط الآن': { bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500', text: 'نشط الآن' },
    'في وضع الانتظار': { bg: 'bg-slate-100 text-slate-500 border border-slate-200', dot: 'bg-slate-400', text: 'في وضع الانتظار' },
    'غير متصل': { bg: 'bg-red-50 text-red-600 border border-red-200', dot: 'bg-red-500', text: 'غير متصل' },
    'مكتمل': { bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500', text: 'مكتمل' },
    'قيد المعالجة': { bg: 'bg-blue-50 text-blue-600 border border-blue-200', dot: 'bg-blue-500', text: 'قيد المعالجة' },
    'في الانتظار': { bg: 'bg-amber-50 text-amber-600 border border-amber-200', dot: 'bg-amber-400', text: 'في الانتظار' },
    'متصل': { bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500', text: 'متصل' },
  };

  const config = configs[status] || configs['في الانتظار'];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.text}
    </span>
  );
}
