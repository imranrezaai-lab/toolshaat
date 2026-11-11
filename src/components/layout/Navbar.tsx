import React, { useState } from 'react';
import { Search, Moon, Sun, Heart, Shield, Menu, X, Wrench } from 'lucide-react';
import { toolStore } from '../../services/store';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenSearch: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  isDark,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const settings = toolStore.getSettings();
  const currentUser = toolStore.getCurrentUser();
  const favoritesCount = toolStore.getFavorites().length;

  const handleNavClick = (view: string, param?: string) => {
    onNavigate(view, param);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element wordmark as per constitution) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
              Ω
            </div>
            <span>{settings.siteName}</span>
          </button>
        </div>

        {/* Zone 2: 4–5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => handleNavClick('directory')}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white cursor-pointer ${
              currentView === 'directory' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            All Tools
          </button>
          <button
            onClick={() => handleNavClick('category', 'image')}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white cursor-pointer ${
              currentView === 'category' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white cursor-pointer ${
              currentView === 'about' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            About
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white cursor-pointer ${
              currentView === 'faq' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white cursor-pointer ${
              currentView === 'contact' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: Search, Theme switch, Favorites, Admin CTA */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            title="Search tools (⌘K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline text-[10px] bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-1 rounded font-mono">
              /
            </kbd>
          </button>

          {/* Favorites indicator */}
          <button
            onClick={() => handleNavClick('favorites')}
            title="Favorite tools"
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            {favoritesCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 md:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3">
          <button
            onClick={() => handleNavClick('directory')}
            className="block w-full text-left py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600"
          >
            All Tools
          </button>
          <button
            onClick={() => handleNavClick('category', 'image')}
            className="block w-full text-left py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600"
          >
            Categories
          </button>
          <button
            onClick={() => handleNavClick('favorites')}
            className="block w-full text-left py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600"
          >
            Favorites ({favoritesCount})
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="block w-full text-left py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600"
          >
            About OmniTools
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="block w-full text-left py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600"
          >
            FAQ
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="block w-full text-left py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600"
          >
            Contact Us
          </button>
        </div>
      )}
    </header>
  );
};
