import React from 'react';
import { FileSearch, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: 'file' | 'inbox' | 'search';
}

export function EmptyState({ title, description, icon = 'file' }: EmptyStateProps) {
  const icons = {
    file: FileSearch,
    inbox: Inbox,
    search: FileSearch,
  };
  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-violet-300" />
      </div>
      <h3 className="text-base font-semibold text-[#231942] mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[#8C84A8] max-w-xs leading-relaxed">{description}</p>
      )}
    </div>
  );
}
