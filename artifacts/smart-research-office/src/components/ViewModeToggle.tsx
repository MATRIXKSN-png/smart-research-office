import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';

interface ViewModeToggleProps {
  isMobileView: boolean;
  onToggle: () => void;
}

export function ViewModeToggle({ isMobileView, onToggle }: ViewModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      title={isMobileView ? 'التبديل لوضع الكمبيوتر' : 'التبديل لوضع الهاتف'}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-200
        ${isMobileView
          ? 'bg-violet-600 text-white border-violet-700 shadow-lg shadow-violet-200'
          : 'bg-white text-[#6B628A] border-violet-200 hover:bg-violet-50'}
      `}
    >
      {isMobileView ? (
        <>
          <Monitor className="w-4 h-4" />
          <span className="hidden sm:inline">وضع الكمبيوتر</span>
        </>
      ) : (
        <>
          <Smartphone className="w-4 h-4" />
          <span className="hidden sm:inline">وضع الهاتف</span>
        </>
      )}
    </button>
  );
}
