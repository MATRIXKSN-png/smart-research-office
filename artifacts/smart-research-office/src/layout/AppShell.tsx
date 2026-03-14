import React, { useState, useEffect } from 'react';
import { RightSidebar } from './RightSidebar';
import { TopHeader } from './TopHeader';

type Page = 'upload' | 'extracted' | 'analysis' | 'settings';

interface AppShellProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
  isMobileView: boolean;
  onToggleMobileView: () => void;
}

export function AppShell({ currentPage, onNavigate, children, isMobileView, onToggleMobileView }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const check = () => setIsSmallScreen(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const showSidebar = !isMobileView && !isSmallScreen;

  return (
    <div className="min-h-screen bg-[#F6F3FF] flex flex-col" style={{ direction: 'rtl' }}>
      <TopHeader
        onMenuOpen={() => setDrawerOpen(true)}
        isMobileView={isMobileView}
        onToggleMobileView={onToggleMobileView}
        isSmallScreen={isSmallScreen}
      />

      <div className="flex flex-1 min-h-0 relative">
        {showSidebar && (
          <div className="w-64 flex-shrink-0 min-h-full">
            <div className="fixed top-0 pt-[57px] h-full w-64">
              <RightSidebar currentPage={currentPage} onNavigate={onNavigate} />
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className={`max-w-5xl mx-auto px-4 py-6 ${isMobileView || isSmallScreen ? 'px-3' : 'px-6 md:px-8'}`}>
            {children}
          </div>
        </main>
      </div>

      {(isMobileView || isSmallScreen) && drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-72 z-50 shadow-2xl">
            <RightSidebar
              currentPage={currentPage}
              onNavigate={onNavigate}
              onClose={() => setDrawerOpen(false)}
              isDrawer
            />
          </div>
        </>
      )}
    </div>
  );
}
