import React, { useState, useMemo, useEffect } from 'react';
import { FileSpreadsheet, Copy, Check, RotateCcw, Clipboard, BookOpen, Mic } from 'lucide-react';
import { ToolDefinition } from '../../types';

interface ToolProps {
  tool: ToolDefinition;
  onExecute?: () => void;
}

export const WordCounter: React.FC<ToolProps> = ({ tool: _tool, onExecute }) => {
  const [text, setText] = useState<string>(
    'OmniTools provides free, private online tools for creators, developers, students, and businesses worldwide. All processing runs directly in your web browser with zero server file uploads.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (text.length > 0 && onExecute) {
      onExecute();
    }
  }, []);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        words: 0,
        charsWithSpaces: 0,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
        keywords: [] as { word: string; count: number; density: number }[],
      };
    }

    const wordsArray = trimmed.match(/\b[a-zA-Z0-9_\u00C0-\u017F'-]+\b/g) || [];
    const wordsCount = wordsArray.length;
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s+/g, '').length;
    const sentences = (text.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length || (trimmed.length > 0 ? 1 : 0);
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length || 0;

    const readingTimeMinutes = Math.max(0.1, parseFloat((wordsCount / 200).toFixed(1)));
    const speakingTimeMinutes = Math.max(0.1, parseFloat((wordsCount / 130).toFixed(1)));

    // Keyword density calculation (filter out tiny stop words < 3 chars)
    const frequencyMap: Record<string, number> = {};
    for (const rawWord of wordsArray) {
      const w = rawWord.toLowerCase();
      if (w.length >= 3 && !['the', 'and', 'for', 'with', 'that', 'this', 'from'].includes(w)) {
        frequencyMap[w] = (frequencyMap[w] || 0) + 1;
      }
    }

    const keywords = Object.entries(frequencyMap)
      .map(([word, count]) => ({
        word,
        count,
        density: parseFloat(((count / (wordsCount || 1)) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      words: wordsCount,
      charsWithSpaces,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes,
      speakingTimeMinutes,
      keywords,
    };
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      setText(clip);
    } catch {
      alert('Clipboard permission not granted.');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
      {/* Primary KPI Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl text-center">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">Total Words</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            {stats.words.toLocaleString()}
          </span>
        </div>
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl text-center">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">Characters (no spaces)</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            {stats.charsNoSpaces.toLocaleString()}
          </span>
        </div>
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl text-center">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">Sentences</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            {stats.sentences.toLocaleString()}
          </span>
        </div>
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl text-center">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">Paragraphs</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            {stats.paragraphs.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Text Content
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePaste}
              className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded flex items-center gap-1 cursor-pointer"
            >
              <Clipboard className="w-3 h-3" /> Paste
            </button>
            <button
              onClick={handleCopy}
              className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={() => setText('')}
              className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="Start typing or paste your content here..."
          className="w-full p-4 text-sm bg-slate-50/50 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed resize-y"
        />

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 px-1">
          <span>Characters with spaces: <strong className="font-mono text-slate-700 dark:text-slate-300">{stats.charsWithSpaces}</strong></span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Reading Time: <strong className="font-mono text-slate-700 dark:text-slate-300">~{stats.readingTimeMinutes} min</strong>
            </span>
            <span className="flex items-center gap-1">
              <Mic className="w-3.5 h-3.5 text-emerald-500" /> Speaking Time: <strong className="font-mono text-slate-700 dark:text-slate-300">~{stats.speakingTimeMinutes} min</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Keyword Density Table */}
      {stats.keywords.length > 0 && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-3">
            Top Keyword Density
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {stats.keywords.map((kw) => (
              <div
                key={kw.word}
                className="p-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-lg flex items-center justify-between"
              >
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                  {kw.word}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {kw.count}x ({kw.density}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
