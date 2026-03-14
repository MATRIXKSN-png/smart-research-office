import React from 'react';
import { Menu, Wifi, Calendar, Sun, Moon } from 'lucide-react';
import { ViewModeToggle } from '../components/ViewModeToggle';
import { useTheme } from '../context/ThemeContext';

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
  const { isDark, toggleDark } = useTheme();

  return (
    <header
      className="top-header border-b px-4 md:px-6 py-3 flex items-center justify-between gap-3 sticky top-0 z-30"
      style={{ direction: 'rtl' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {(isMobileView || isSmallScreen) && (
          <button
            onClick={onMenuOpen}
            className="flex-shrink-0 w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 hover:bg-violet-100 transition-colors dark-icon-btn"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-sm md:text-base font-bold text-main leading-tight truncate">
            المكتب الذكي للبحث العلمي
          </h1>
          <p className="text-xs text-muted hidden sm:block truncate">
            إدارة المراجع، استخراج النصوص، والتحليل الذكي في واجهة واحدة
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100 dark-status-badge">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-xs text-emerald-700 font-medium whitespace-nowrap">{arabicDate}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100 dark-status-badge">
          <div className="relative">
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-xs text-emerald-700 font-medium hidden sm:inline">النظام متصل</span>
        </div>

        <button
          onClick={toggleDark}
          title={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all duration-200 dark-toggle-btn"
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-medium hidden sm:inline text-amber-400">فاتح</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-violet-600" />
              <span className="text-xs font-medium hidden sm:inline text-violet-600">داكن</span>
            </>
          )}
        </button>

        <ViewModeToggle isMobileView={isMobileView} onToggle={onToggleMobileView} />
      </div>
    </header>
  );
}
