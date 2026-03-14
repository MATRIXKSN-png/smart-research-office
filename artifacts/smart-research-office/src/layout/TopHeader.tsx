import React from 'react';
import { Menu, Wifi, Calendar } from 'lucide-react';
import { ViewModeToggle } from '../components/ViewModeToggle';

interface TopHeaderProps {
  onMenuOpen: () => void;
  isMobileView: boolean;
  onToggleMobileView: () => void;
  isSmallScreen: boolean;
}

function getArabicDate(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  try {
    return now.toLocaleDateString('ar-SA', options);
  } catch {
    return new Intl.DateTimeFormat('ar-EG', options).format(now);
  }
}

export function TopHeader({ onMenuOpen, isMobileView, onToggleMobileView, isSmallScreen }: TopHeaderProps) {
  const arabicDate = getArabicDate();

  return (
    <header
      className="bg-white border-b border-violet-100 px-4 md:px-6 py-3 flex items-center justify-between gap-3 sticky top-0 z-30"
      style={{ direction: 'rtl' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {(isMobileView || isSmallScreen) && (
          <button
            onClick={onMenuOpen}
            className="flex-shrink-0 w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 hover:bg-violet-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-sm md:text-base font-bold text-[#231942] leading-tight truncate">
            المكتب الذكي للبحث العلمي
          </h1>
          <p className="text-xs text-[#8C84A8] hidden sm:block truncate">
            إدارة المراجع، استخراج النصوص، والتحليل الذكي في واجهة واحدة
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-xs text-emerald-700 font-medium whitespace-nowrap">{arabicDate}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100">
          <div className="relative">
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-xs text-emerald-700 font-medium hidden sm:inline">النظام متصل</span>
        </div>

        <ViewModeToggle isMobileView={isMobileView} onToggle={onToggleMobileView} />
      </div>
    </header>
  );
}
