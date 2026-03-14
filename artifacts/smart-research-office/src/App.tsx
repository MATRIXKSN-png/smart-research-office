import React, { useState, useEffect } from 'react';
import { AppShell } from './layout/AppShell';
import { UploadPage } from './pages/UploadPage';
import { ExtractedPage } from './pages/ExtractedPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { SettingsPage } from './pages/SettingsPage';

type Page = 'upload' | 'extracted' | 'analysis' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('upload');
  const [isMobileView, setIsMobileView] = useState(false);

  const handleToggleMobileView = () => {
    setIsMobileView((prev) => !prev);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'upload':
        return <UploadPage />;
      case 'extracted':
        return <ExtractedPage />;
      case 'analysis':
        return <AnalysisPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <UploadPage />;
    }
  };

  return (
    <AppShell
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      isMobileView={isMobileView}
      onToggleMobileView={handleToggleMobileView}
    >
      {renderPage()}
    </AppShell>
  );
}

export default App;
