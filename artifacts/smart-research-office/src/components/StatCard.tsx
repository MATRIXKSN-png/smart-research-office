import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'purple' | 'blue' | 'green' | 'amber';
}

export function StatCard({ label, value, icon, color = 'purple' }: StatCardProps) {
  const colorClasses = {
    purple: 'bg-violet-50 text-violet-600 dark-chip',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-surface rounded-xl border border-border-light p-4 card-shadow flex items-center gap-3 dark-section-card">
      {icon && (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClasses[color]}`}>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs text-muted font-medium truncate">{label}</p>
        <p className="text-lg font-bold text-main leading-tight">{value}</p>
      </div>
    </div>
  );
}
