import React, { useState } from 'react';
import { CaseSensitive, Copy, Check, RotateCcw, Download, ArrowRight } from 'lucide-react';
import { ToolDefinition } from '../../types';

interface ToolProps {
  tool: ToolDefinition;
  onExecute?: () => void;
}

export const CaseConverter: React.FC<ToolProps> = ({ tool: _tool, onExecute }) => {
  const [input, setInput] = useState<string>('OmniTools platform provides privacy-focused browser utilities for modern developers and creators.');
  const [copied, setCopied] = useState<boolean>(false);

  const applyCase = (transformer: (text: string) => string) => {
    setInput(transformer(input));
    if (onExecute) onExecute();
  };

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const toCamelCase = (str: string) => {
    return str
      .replace(/[^a-zA-Z0-9]+(.)/g, (_m, chr) => chr.toUpperCase())
      .replace(/^[A-Z]/, (c) => c.toLowerCase());
  };

  const toPascalCase = (str: string) => {
    return str
      .replace(/[^a-zA-Z0-9]+(.)/g, (_m, chr) => chr.toUpperCase())
      .replace(/^[a-z]/, (c) => c.toUpperCase());
  };

  const toSnakeCase = (str: string) => {
    return str
      .trim()
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s\W-]+/g, '_')
      .toLowerCase();
  };

  const toKebabCase = (str: string) => {
    return str
      .trim()
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s\W_]+/g, '-')
      .toLowerCase();
  };

  const toConstantCase = (str: string) => {
    return toSnakeCase(str).toUpperCase();
  };

  const toAlternatingCase = (str: string) => {
    let alt = true;
    return str.split('').map((char) => {
      if (/[a-zA-Z]/.test(char)) {
        const res = alt ? char.toLowerCase() : char.toUpperCase();
        alt = !alt;
        return res;
      }
      return char;
    }).join('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([input], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted_text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
      {/* Action Buttons Grid */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Select Target Casing:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            onClick={() => applyCase(toSentenceCase)}
            className="py-2 px-3 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer text-left"
          >
            Sentence case
          </button>
          <button
            onClick={() => applyCase((s) => s.toLowerCase())}
            className="py-2 px-3 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer text-left"
          >
            lower case
          </button>
          <button
            onClick={() => applyCase((s) => s.toUpperCase())}
            className="py-2 px-3 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer text-left"
          >
            UPPER CASE
          </button>
          <button
            onClick={() => applyCase(toTitleCase)}
            className="py-2 px-3 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer text-left"
          >
            Title Case
          </button>
          <button
            onClick={() => applyCase(toCamelCase)}
            className="py-2 px-3 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer text-left"
          >
            camelCase
          </button>
          <button
            onClick={() => applyCase(toPascalCase)}
            className="py-2 px-3 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer text-left"
          >
            PascalCase
          </button>
          <button
            onClick={() => applyCase(toSnakeCase)}
            className="py-2 px-3 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer text-left font-mono"
          >
            snake_case
          </button>
          <button
            onClick={() => applyCase(toKebabCase)}
            className="py-2 px-3 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer text-left font-mono"
          >
            kebab-case
          </button>
          <button
            onClick={() => applyCase(toConstantCase)}
            className="py-2 px-3 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer text-left font-mono"
          >
            CONSTANT_CASE
          </button>
          <button
            onClick={() => applyCase(toAlternatingCase)}
            className="py-2 px-3 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer text-left"
          >
            aLtErNaTiNg
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={9}
          placeholder="Paste or write your text here..."
          className="w-full p-4 text-sm bg-slate-50/50 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed resize-y"
        />
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1.5">
          <span>Character count: <strong className="font-mono text-slate-700 dark:text-slate-300">{input.length}</strong></span>
          <span>Word count: <strong className="font-mono text-slate-700 dark:text-slate-300">{input.trim() ? input.trim().split(/\s+/).length : 0}</strong></span>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setInput('')}
          className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Clear Text
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download .txt
          </button>
          <button
            onClick={handleCopy}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard!' : 'Copy Result'}
          </button>
        </div>
      </div>
    </div>
  );
};
