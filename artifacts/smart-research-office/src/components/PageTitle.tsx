import React from 'react';

interface PageTitleProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}

export function PageTitle({ title, description, action, badge }: PageTitleProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-bold text-main">{title}</h1>
          {badge}
        </div>
        {description && (
          <p className="mt-1 text-sm text-secondary leading-relaxed">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
