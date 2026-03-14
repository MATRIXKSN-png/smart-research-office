import React from 'react';

interface SectionCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  compact?: boolean;
}

export function SectionCard({ title, description, children, className = '', headerAction, compact = false }: SectionCardProps) {
  return (
    <div className={`bg-surface rounded-2xl border border-border-light card-shadow dark-section-card ${className}`}>
      {(title || headerAction) && (
        <div className={`flex items-center justify-between ${compact ? 'px-4 py-3' : 'px-5 py-4'} border-b border-border-soft`}>
          <div>
            {title && <h3 className="font-semibold text-main text-sm">{title}</h3>}
            {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={compact ? 'p-4' : 'p-5'}>{children}</div>
    </div>
  );
}
