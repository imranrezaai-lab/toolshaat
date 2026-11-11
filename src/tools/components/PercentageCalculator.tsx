import React, { useState, useEffect } from 'react';
import { Percent, Copy, Check, Calculator, ArrowRight, HelpCircle } from 'lucide-react';
import { ToolDefinition } from '../../types';

interface ToolProps {
  tool: ToolDefinition;
  onExecute?: () => void;
}

export const PercentageCalculator: React.FC<ToolProps> = ({ tool: _tool, onExecute }) => {
  const [activeTab, setActiveTab] = useState<'of' | 'is' | 'change' | 'add_sub'>('of');
  const [copied, setCopied] = useState<boolean>(false);

  // Tab 1: What is X% of Y?
  const [percentOfX, setPercentOfX] = useState<number>(15);
  const [percentOfY, setPercentOfY] = useState<number>(240);

  // Tab 2: X is what % of Y?
  const [isX, setIsX] = useState<number>(36);
  const [isY, setIsY] = useState<number>(144);

  // Tab 3: Percent change from X to Y?
  const [changeFrom, setChangeFrom] = useState<number>(80);
  const [changeTo, setChangeTo] = useState<number>(120);

  // Tab 4: Y + X% and Y - X%
  const [baseVal, setBaseVal] = useState<number>(150);
  const [deltaPercent, setDeltaPercent] = useState<number>(20);

  const formatNum = (num: number) => {
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculations
  const calc1Result = (percentOfX / 100) * percentOfY;
  const calc2Result = isY !== 0 ? (isX / isY) * 100 : 0;
  const calc3Diff = changeTo - changeFrom;
  const calc3Percent = changeFrom !== 0 ? ((changeTo - changeFrom) / changeFrom) * 100 : 0;
  const calc4Add = baseVal + (baseVal * (deltaPercent / 100));
  const calc4Sub = baseVal - (baseVal * (deltaPercent / 100));

  useEffect(() => {
    if (onExecute) onExecute();
  }, [percentOfX, percentOfY, isX, isY, changeFrom, changeTo, baseVal, deltaPercent]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        {[
          { id: 'of', label: 'What is X% of Y?' },
          { id: 'is', label: 'X is what % of Y?' },
          { id: 'change', label: 'Percentage Change (% Increase/Decrease)' },
          { id: 'add_sub', label: 'Add or Subtract %' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: What is X% of Y? */}
      {activeTab === 'of' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-800 dark:text-slate-200">
              <span>What is</span>
              <div className="relative w-28">
                <input
                  type="number"
                  value={percentOfX}
                  onChange={(e) => setPercentOfX(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono pr-7"
                />
                <span className="absolute right-2.5 top-2.5 text-xs text-slate-400">%</span>
              </div>
              <span>of</span>
              <div className="w-36">
                <input
                  type="number"
                  value={percentOfY}
                  onChange={(e) => setPercentOfY(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
              <span>?</span>
            </div>
          </div>

          <div className="p-6 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Calculated Answer</span>
              <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
                {formatNum(calc1Result)}
              </span>
            </div>
            <button
              onClick={() => handleCopy(formatNum(calc1Result))}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Result'}
            </button>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <strong className="text-slate-800 dark:text-slate-200 block">Step-by-step formula:</strong>
            <p className="font-mono">({percentOfX} ÷ 100) × {percentOfY} = {formatNum(percentOfX / 100)} × {percentOfY} = {formatNum(calc1Result)}</p>
          </div>
        </div>
      )}

      {/* Tab 2: X is what % of Y? */}
      {activeTab === 'is' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-800 dark:text-slate-200">
              <div className="w-32">
                <input
                  type="number"
                  value={isX}
                  onChange={(e) => setIsX(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
              <span>is what percentage of</span>
              <div className="w-32">
                <input
                  type="number"
                  value={isY}
                  onChange={(e) => setIsY(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
              <span>?</span>
            </div>
          </div>

          <div className="p-6 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Calculated Percentage</span>
              <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
                {formatNum(calc2Result)}%
              </span>
            </div>
            <button
              onClick={() => handleCopy(`${formatNum(calc2Result)}%`)}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Result'}
            </button>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <strong className="text-slate-800 dark:text-slate-200 block">Step-by-step formula:</strong>
            <p className="font-mono">({isX} ÷ {isY}) × 100 = {formatNum(calc2Result)}%</p>
          </div>
        </div>
      )}

      {/* Tab 3: Percent Change */}
      {activeTab === 'change' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-800 dark:text-slate-200">
              <span>From initial value</span>
              <div className="w-32">
                <input
                  type="number"
                  value={changeFrom}
                  onChange={(e) => setChangeFrom(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
              <span>to new value</span>
              <div className="w-32">
                <input
                  type="number"
                  value={changeTo}
                  onChange={(e) => setChangeTo(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                {calc3Percent >= 0 ? 'Percentage Increase' : 'Percentage Decrease'}
              </span>
              <span className={`text-3xl font-extrabold font-mono tabular-nums ${
                calc3Percent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {calc3Percent >= 0 ? `+${formatNum(calc3Percent)}%` : `${formatNum(calc3Percent)}%`}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1 font-mono">
                Absolute difference: {calc3Diff >= 0 ? `+${calc3Diff}` : calc3Diff}
              </span>
            </div>
            <button
              onClick={() => handleCopy(`${formatNum(calc3Percent)}%`)}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Result'}
            </button>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <strong className="text-slate-800 dark:text-slate-200 block">Step-by-step formula:</strong>
            <p className="font-mono">(({changeTo} - {changeFrom}) ÷ {changeFrom}) × 100 = ({calc3Diff} ÷ {changeFrom}) × 100 = {formatNum(calc3Percent)}%</p>
          </div>
        </div>
      )}

      {/* Tab 4: Add / Subtract % */}
      {activeTab === 'add_sub' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-800 dark:text-slate-200">
              <span>Original Value</span>
              <div className="w-32">
                <input
                  type="number"
                  value={baseVal}
                  onChange={(e) => setBaseVal(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
              <span>with percentage adjustment</span>
              <div className="relative w-28">
                <input
                  type="number"
                  value={deltaPercent}
                  onChange={(e) => setDeltaPercent(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono pr-7"
                />
                <span className="absolute right-2.5 top-2.5 text-xs text-slate-400">%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl">
              <span className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                Value Added (+{deltaPercent}%)
              </span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums block mb-2">
                {formatNum(calc4Add)}
              </span>
              <button
                onClick={() => handleCopy(formatNum(calc4Add))}
                className="text-xs text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Copy {formatNum(calc4Add)}
              </button>
            </div>

            <div className="p-5 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl">
              <span className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                Value Subtracted (-{deltaPercent}%)
              </span>
              <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 font-mono tabular-nums block mb-2">
                {formatNum(calc4Sub)}
              </span>
              <button
                onClick={() => handleCopy(formatNum(calc4Sub))}
                className="text-xs text-rose-700 dark:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Copy {formatNum(calc4Sub)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
