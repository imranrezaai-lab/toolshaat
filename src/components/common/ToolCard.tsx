import React from 'react';
import { 
  Heart, 
  ArrowUpRight, 
  ImageIcon, 
  FileText, 
  Code2, 
  Calculator, 
  QrCode, 
  Type, 
  Minimize2, 
  Scaling, 
  RefreshCw, 
  Layers, 
  Split, 
  FileSpreadsheet, 
  CaseSensitive, 
  FileCode2, 
  Percent,
  Sparkles,
  Zap
} from 'lucide-react';
import { ToolDefinition } from '../../types';
import { toolStore } from '../../services/store';

interface ToolCardProps {
  tool: ToolDefinition;
  onSelect: (tool: ToolDefinition) => void;
  categoryName?: string;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  ImageIcon,
  FileText,
  Code2,
  Calculator,
  QrCode,
  Type,
  Minimize2,
  Scaling,
  RefreshCw,
  Layers,
  Split,
  FileSpreadsheet,
  CaseSensitive,
  FileCode2,
  Percent,
  Sparkles,
  Zap
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect, categoryName }) => {
  const isFav = toolStore.isFavorite(tool.id);
  const IconComponent = ICON_MAP[tool.icon] || Zap;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toolStore.toggleFavorite(tool.id);
  };

  return (
    <div
      onClick={() => onSelect(tool)}
      className="group relative flex flex-col justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500/60 dark:hover:border-indigo-500/60 hover:shadow-md transition-all cursor-pointer"
    >
      <div>
        {/* Top Header: Icon & Favorite Toggle */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.featured && (
              <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                Featured
              </span>
            )}
            <button
              type="button"
              onClick={handleFavoriteClick}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              className="p-1 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1 mb-1.5">
          {tool.name}
          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500 shrink-0" />
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {tool.description}
        </p>
      </div>

      {/* Footer Metadata: unboxed clean text as per constitution */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <span>{categoryName || tool.category}</span>
          <span aria-hidden="true">·</span>
          <span>Fast & Free</span>
        </div>
        <span className="font-mono tabular-nums">
          {tool.executionCount > 0 ? `${tool.executionCount.toLocaleString()} uses` : 'New'}
        </span>
      </div>
    </div>
  );
};
