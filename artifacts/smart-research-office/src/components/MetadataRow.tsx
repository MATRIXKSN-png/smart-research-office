import React from 'react';

interface MetadataRowProps {
  label: string;
  value: string;
}

export function MetadataRow({ label, value }: MetadataRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border-soft last:border-0">
      <span className="text-xs font-medium text-muted">{label}</span>
      <span className="text-xs text-main font-medium text-left max-w-[60%] truncate">{value}</span>
    </div>
  );
}
