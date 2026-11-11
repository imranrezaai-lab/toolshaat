import React from 'react';
import { Heart, Clock, ArrowRight, Trash2 } from 'lucide-react';
import { toolStore } from '../services/store';
import { ToolDefinition } from '../types';
import { ToolCard } from '../components/common/ToolCard';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';

interface FavoritesViewProps {
  onNavigate: (view: string, param?: string) => void;
  onSelectTool: (tool: ToolDefinition) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ onNavigate, onSelectTool }) => {
  const favoriteIds = toolStore.getFavorites();
  const recentIds = toolStore.getUserRecents();
  const allTools = toolStore.getPublishedTools();
  const categories = toolStore.getCategories();

  const favoriteTools = allTools.filter(t => favoriteIds.includes(t.id));
  const recentTools = recentIds
    .map(id => allTools.find(t => t.id === id))
    .filter((t): t is ToolDefinition => !!t);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('home') },
          { label: 'My Saved Tools & Recents' }
        ]}
      />

      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          My Saved Tools
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Your bookmarked utilities and recently executed tools stored locally in your browser.
        </p>
      </div>

      {/* Favorites Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <h2>Favorite Bookmarks ({favoriteTools.length})</h2>
        </div>

        {favoriteTools.length === 0 ? (
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You haven't added any favorite tools yet. Click the heart icon on any tool card to bookmark it here.
            </p>
            <button
              onClick={() => onNavigate('directory')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Browse All Tools
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favoriteTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onSelect={onSelectTool}
                categoryName={categories.find(c => c.id === tool.category)?.name}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recently Used Section */}
      <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h2>Recently Used Utilities ({recentTools.length})</h2>
          </div>
        </div>

        {recentTools.length === 0 ? (
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-500 dark:text-slate-400">
            No recently executed tools recorded.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onSelect={onSelectTool}
                categoryName={categories.find(c => c.id === tool.category)?.name}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
