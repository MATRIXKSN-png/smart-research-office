import React from 'react';

interface InfoChipProps {
  label: string;
  value: string;
  color?: 'default' | 'purple' | 'blue' | 'green';
}

export function InfoChip({ label, value, color = 'default' }: InfoChipProps) {
  const colorClasses = {
    default: 'bg-violet-50 text-violet-700 border-violet-100',
    purple: 'bg-violet-100 text-violet-800 border-violet-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium ${colorClasses[color]}`}>
      <span className="text-[10px] opacity-60">{label}:</span>
      <span>{value}</span>
    </span>
  );
}
