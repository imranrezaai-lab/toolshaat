import React, { useState } from 'react';
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Layers, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  ImageIcon, 
  FileText, 
  Code2, 
  Calculator, 
  QrCode, 
  Type 
} from 'lucide-react';
import { toolStore } from '../services/store';
import { ToolDefinition } from '../types';
import { ToolCard } from '../components/common/ToolCard';
import { AdSlot } from '../components/ads/AdSlot';

interface HomeViewProps {
  onNavigate: (view: string, param?: string) => void;
  onSelectTool: (tool: ToolDefinition) => void;
  onOpenSearch: () => void;
}

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  ImageIcon,
  FileText,
  Code2,
  Calculator,
  QrCode,
  Type
};

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onSelectTool, onOpenSearch }) => {
  const [activeTab, setActiveTab] = useState<'popular' | 'recent'>('popular');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const featuredTools = toolStore.getFeaturedTools();
  const popularTools = toolStore.getPopularTools(6);
  const recentTools = toolStore.getRecentTools(6);
  const categories = toolStore.getCategories();

  const faqs = [
    {
      q: 'Do I have to register or create an account to use tools?',
      a: 'No. Every single utility on OmniTools is completely free to use immediately without signing up, entering an email, or connecting credit cards.'
    },
    {
      q: 'How does client-side privacy work?',
      a: 'When you compress an image or merge PDFs, your files are read and processed directly by your web browser using HTML5 Canvas and WebAssembly. Nothing is ever uploaded to our servers.'
    },
    {
      q: 'Are there hidden file limits or watermarks?',
      a: 'No watermarks are ever added to your converted files. Processed files retain their pristine quality and original ownership.'
    },
    {
      q: 'Can I request a new tool to be added to the platform?',
      a: 'Yes! Reach out through our Contact page. Our modular engine is built to support hundreds of tools, and we regularly add new utilities based on community requests.'
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-xs text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast, Free & 100% Client-Side Processing</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
            Free Online Tools for Creators, Students & Developers
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Compress images, merge PDFs, generate QR codes, format JSON, and solve calculations right in your browser. Fast, private, and zero server uploads.
          </p>

          {/* Large Search Bar Trigger */}
          <div className="pt-2">
            <div
              onClick={onOpenSearch}
              className="max-w-xl mx-auto flex items-center justify-between p-2 pl-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
                <Search className="w-5 h-5 group-hover:text-indigo-600 transition-colors" />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Search from available online tools...
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold px-3 py-1.5 bg-indigo-600 text-white rounded-lg group-hover:bg-indigo-700 transition-colors">
                  Search
                </span>
              </div>
            </div>
          </div>

          {/* Popular Categories Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Popular:</span>
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigate('category', cat.slug)}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition-colors cursor-pointer"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Placement: Home Top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AdSlot position="home-top" />
      </div>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Explore Categories
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Browse organized suites tailored for specific workflows
            </p>
          </div>
          <button
            onClick={() => onNavigate('directory')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            All Tools <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.icon] || Layers;
            return (
              <div
                key={cat.id}
                onClick={() => onNavigate('category', cat.slug)}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-xl hover:shadow-sm transition-all text-center cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center mx-auto mb-3 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1">
                  {cat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Tools Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Featured Utilities
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hand-picked browser tools with high community adoption
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onSelect={onSelectTool}
              categoryName={categories.find(c => c.id === tool.category)?.name}
            />
          ))}
        </div>
      </section>

      {/* Ad Placement: Home Middle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AdSlot position="home-middle" />
      </div>

      {/* Popular vs Recent Tools Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
            <button
              onClick={() => setActiveTab('popular')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'popular'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Most Popular Tools
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'recent'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Recently Added
            </button>
          </div>

          <button
            onClick={() => onNavigate('directory')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            View Complete Directory <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(activeTab === 'popular' ? popularTools : recentTools).map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onSelect={onSelectTool}
              categoryName={categories.find(c => c.id === tool.category)?.name}
            />
          ))}
        </div>
      </section>

      {/* Why Choose OmniTools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="p-8 sm:p-12 bg-slate-900 text-white rounded-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4 mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Built for speed & privacy
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Why Professionals & Students Choose OmniTools
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We engineered OmniTools from first principles: no annoying sign-up walls, no upload queues, and complete client-side security.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold">100% Client-Side Privacy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your images, documents, and code never touch our servers. Processing occurs in your device's memory.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold">Zero Wait Latency</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No waiting in server processing queues. Calculations and transformations compute in milliseconds.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold">Free Forever Guarantee</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full access to all 10 launch tools without hidden limits, mandatory registrations, or watermarks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-4">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Everything you need to know about using OmniTools
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Ad Placement: Home Bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AdSlot position="home-bottom" />
      </div>
    </div>
  );
};
