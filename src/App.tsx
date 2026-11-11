import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/common/SearchModal';
import { HomeView } from './views/HomeView';
import { DirectoryView } from './views/DirectoryView';
import { CategoryView } from './views/CategoryView';
import { ToolView } from './views/ToolView';
import { AdminView } from './views/AdminView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { FaqView } from './views/FaqView';
import { PrivacyView, TermsView } from './views/PrivacyView';
import { FavoritesView } from './views/FavoritesView';
import { toolStore } from './services/store';
import { ToolDefinition } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentParam, setCurrentParam] = useState<string>('');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return (
      localStorage.getItem('omnitools_theme') === 'dark' ||
      (!localStorage.getItem('omnitools_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  // Re-render trigger on store mutation
  const [, setStoreVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = toolStore.subscribe(() => {
      setStoreVersion(v => v + 1);
    });
    return unsubscribe;
  }, []);

  // Theme synchronization
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('omnitools_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('omnitools_theme', 'light');
    }
  }, [isDark]);

  // URL hash routing synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) {
        setCurrentView('home');
        setCurrentParam('');
        return;
      }

      const parts = hash.split('/');
      const view = parts[0] || 'home';
      const param = parts[1] || '';

      setCurrentView(view);
      setCurrentParam(param);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Keyboard shortcut for search (/ or ⌘K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateTo = (view: string, param?: string) => {
    const newHash = param ? `#${view}/${param}` : `#${view}`;
    window.location.hash = newHash;
    setCurrentView(view);
    setCurrentParam(param || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTool = (tool: ToolDefinition) => {
    navigateTo('tool', tool.slug);
  };

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors">
      {/* Top Navigation Bar (Except on Admin fullscreen view) */}
      {currentView !== 'admin' && (
        <Navbar
          currentView={currentView}
          onNavigate={navigateTo}
          onOpenSearch={() => setSearchOpen(true)}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onNavigate={navigateTo}
            onSelectTool={handleSelectTool}
            onOpenSearch={() => setSearchOpen(true)}
          />
        )}

        {currentView === 'directory' && (
          <DirectoryView
            onNavigate={navigateTo}
            onSelectTool={handleSelectTool}
          />
        )}

        {currentView === 'category' && (
          <CategoryView
            categorySlug={currentParam || 'image'}
            onNavigate={navigateTo}
            onSelectTool={handleSelectTool}
          />
        )}

        {currentView === 'tool' && (
          <ToolView
            toolSlug={currentParam || 'image-compressor'}
            onNavigate={navigateTo}
            onSelectTool={handleSelectTool}
          />
        )}

        {currentView === 'admin' && (
          <AdminView onNavigate={navigateTo} />
        )}

        {currentView === 'about' && (
          <AboutView onNavigate={navigateTo} />
        )}

        {currentView === 'contact' && (
          <ContactView onNavigate={navigateTo} />
        )}

        {currentView === 'faq' && (
          <FaqView onNavigate={navigateTo} />
        )}

        {currentView === 'privacy' && (
          <PrivacyView onNavigate={navigateTo} />
        )}

        {currentView === 'terms' && (
          <TermsView onNavigate={navigateTo} />
        )}

        {currentView === 'favorites' && (
          <FavoritesView
            onNavigate={navigateTo}
            onSelectTool={handleSelectTool}
          />
        )}
      </div>

      {/* Footer (Except on Admin view) */}
      {currentView !== 'admin' && (
        <Footer onNavigate={navigateTo} />
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectTool={handleSelectTool}
      />
    </div>
  );
}
