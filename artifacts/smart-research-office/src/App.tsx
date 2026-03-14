import React, { useState } from 'react';
import { AppShell } from './layout/AppShell';
import { UploadPage } from './pages/UploadPage';
import { ExtractedPage } from './pages/ExtractedPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { SettingsPage } from './pages/SettingsPage';
import { ReferencesProvider } from './context/ReferencesContext';
import { ThemeProvider } from './context/ThemeContext';

type Page = 'upload' | 'extracted' | 'analysis' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('upload');
  const [isMobileView, setIsMobileView] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'upload':
        return <UploadPage onNavigate={setCurrentPage} />;
      case 'extracted':
        return <ExtractedPage />;
      case 'analysis':
        return <AnalysisPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <UploadPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider>
      <ReferencesProvider>
        <AppShell
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          isMobileView={isMobileView}
          onToggleMobileView={() => setIsMobileView((p) => !p)}
        >
          {renderPage()}
        </AppShell>
      </ReferencesProvider>
    </ThemeProvider>
  );
}

export default App;
