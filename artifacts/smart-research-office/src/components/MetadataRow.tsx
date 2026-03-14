import React from 'react';

interface MetadataRowProps {
  label: string;
  value: string;
}

export function MetadataRow({ label, value }: MetadataRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-violet-50 last:border-0">
      <span className="text-xs font-medium text-[#8C84A8]">{label}</span>
      <span className="text-xs text-[#231942] font-medium text-left max-w-[60%] truncate">{value}</span>
    </div>
  );
}
