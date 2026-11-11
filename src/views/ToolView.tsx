import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Share2, 
  Check, 
  HelpCircle, 
  BookOpen, 
  Sparkles, 
  ArrowLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ToolDefinition } from '../types';
import { toolStore } from '../services/store';
import { TOOL_REGISTRY, GenericToolPlaceholder } from '../tools/registry';
import { ToolCard } from '../components/common/ToolCard';
import { AdSlot } from '../components/ads/AdSlot';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';

interface ToolViewProps {
  toolSlug: string;
  onNavigate: (view: string, param?: string) => void;
  onSelectTool: (tool: ToolDefinition) => void;
}

export const ToolView: React.FC<ToolViewProps> = ({ toolSlug, onNavigate, onSelectTool }) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const tool = toolStore.getToolBySlug(toolSlug) || toolStore.getPublishedTools()[0];
  const category = toolStore.getCategoryById(tool.category);
  const isFav = toolStore.isFavorite(tool.id);

  // Record tool execution count in store
  const handleExecute = () => {
    toolStore.recordExecution(tool.id);
  };

  // Find related tools from the same category
  const relatedTools = toolStore
    .getPublishedTools()
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .slice(0, 3);

  const ToolComponent = TOOL_REGISTRY[tool.id] || GenericToolPlaceholder;

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: tool.seoTitle || tool.name,
        text: tool.description,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const toggleFavorite = () => {
    toolStore.toggleFavorite(tool.id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('home') },
          { label: 'All Tools', onClick: () => onNavigate('directory') },
          { label: category?.name || tool.category, onClick: () => onNavigate('category', category?.slug || tool.category) },
          { label: tool.name }
        ]}
      />

      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              {category?.name || tool.category}
            </span>
            <span className="text-xs text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              {tool.executionCount.toLocaleString()} runs
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {tool.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {tool.description}
          </p>
        </div>

        {/* Action buttons (Favorite & Share) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleFavorite}
            className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
              isFav
                ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
            <span>{isFav ? 'Favorited' : 'Favorite'}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-600 dark:text-slate-400 hover:text-slate-900 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copiedShare ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedShare ? 'Copied link!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Top Ad Slot */}
      <AdSlot position="tool-top" />

      {/* Main Interactive Tool Workspace */}
      <main aria-label={tool.name} className="relative">
        <ToolComponent tool={tool} onExecute={handleExecute} />
      </main>

      {/* Bottom Ad Slot */}
      <AdSlot position="tool-bottom" />

      {/* How To Use Guide */}
      {tool.howToUse && tool.howToUse.length > 0 && (
        <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h2>How to use {tool.name}</h2>
          </div>
          <ol className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-1">
            {tool.howToUse.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 text-[11px]">
                  {idx + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Between In-Content Ad Slot */}
      <AdSlot position="tool-between" />

      {/* Tool FAQs Accordion */}
      {tool.faqs && tool.faqs.length > 0 && (
        <section className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {tool.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-3">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            More {category?.name || 'Related'} Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((relTool) => (
              <ToolCard
                key={relTool.id}
                tool={relTool}
                onSelect={onSelectTool}
                categoryName={category?.name}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
