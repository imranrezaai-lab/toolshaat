import React, { useState } from 'react';
import { 
  ImageIcon, 
  FileText, 
  Code2, 
  Calculator, 
  QrCode, 
  Type, 
  Search, 
  Layers, 
  ArrowRight 
} from 'lucide-react';
import { toolStore } from '../services/store';
import { ToolDefinition } from '../types';
import { ToolCard } from '../components/common/ToolCard';
import { AdSlot } from '../components/ads/AdSlot';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';

interface CategoryViewProps {
  categorySlug: string;
  onNavigate: (view: string, param?: string) => void;
  onSelectTool: (tool: ToolDefinition) => void;
}

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  ImageIcon,
  FileText,
  Code2,
  Calculator,
  QrCode,
  Type
};

export const CategoryView: React.FC<CategoryViewProps> = ({
  categorySlug,
  onNavigate,
  onSelectTool
}) => {
  const [query, setQuery] = useState('');

  const category = toolStore.getCategoryBySlug(categorySlug) || toolStore.getCategories()[0];
  const allCategories = toolStore.getCategories();
  const allCategoryTools = toolStore
    .getPublishedTools()
    .filter(t => t.category === category?.id);

  const filteredTools = query.trim()
    ? allCategoryTools.filter(
        t =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase()) ||
          t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : allCategoryTools;

  const Icon = CATEGORY_ICONS[category.icon] || Layers;
  const otherCategories = allCategories.filter(c => c.id !== category.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('home') },
          { label: 'Categories', onClick: () => onNavigate('directory') },
          { label: category.name }
        ]}
      />

      {/* Category Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Icon className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {category.name}
              </h1>
              <span className="text-xs text-slate-400 font-mono">
                ({allCategoryTools.length} {allCategoryTools.length === 1 ? 'tool' : 'tools'})
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              {category.description}
            </p>
          </div>
        </div>

        {/* Quick Search inside this category */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${category.name.toLowerCase()}...`}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Ad Placement: Category Top */}
      <AdSlot position="category-top" />

      {/* Tool Cards */}
      <div>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Available {category.name} ({filteredTools.length})
        </h2>

        {filteredTools.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-500">
            No tools in {category.name} match "{query}".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onSelect={onSelectTool}
                categoryName={category.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Other Categories Explorer */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Explore Other Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {otherCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => onNavigate('category', c.slug)}
              className="p-3 text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 transition-colors cursor-pointer group"
            >
              <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {c.name}
              </h3>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {c.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Ad Placement: Category Bottom */}
      <AdSlot position="category-bottom" />
    </div>
  );
};
