import React, { useState, useEffect } from 'react';
import { FileCode2, Copy, Check, RotateCcw, Download, CheckCircle2, AlertTriangle, ArrowDownUp } from 'lucide-react';
import { ToolDefinition } from '../../types';

interface ToolProps {
  tool: ToolDefinition;
  onExecute?: () => void;
}

export const JsonFormatter: React.FC<ToolProps> = ({ tool: _tool, onExecute }) => {
  const [input, setInput] = useState<string>(
    JSON.stringify(
      {
        platform: 'OmniTools',
        version: '2.0.0',
        features: ['image-compression', 'pdf-merger', 'qr-generator', 'json-validator'],
        privacy: {
          clientSideOnly: true,
          serverUploads: false,
          retentionPeriodHours: 0
        },
        activeToolsCount: 10
      },
      null,
      2
    )
  );
  const [indent, setIndent] = useState<number | 'tab'>(2);
  const [sortKeys, setSortKeys] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorPosition, setErrorPosition] = useState<{ line: number; col: number } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const sortObject = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sortObject);
    }
    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((acc: any, key) => {
          acc[key] = sortObject(obj[key]);
          return acc;
        }, {});
    }
    return obj;
  };

  const validateAndFormat = (rawText: string, format = true) => {
    if (!rawText.trim()) {
      setIsValid(true);
      setErrorMessage(null);
      setErrorPosition(null);
      return;
    }

    try {
      let parsed = JSON.parse(rawText);
      if (sortKeys) {
        parsed = sortObject(parsed);
      }
      setIsValid(true);
      setErrorMessage(null);
      setErrorPosition(null);

      if (format) {
        const indentVal = indent === 'tab' ? '\t' : indent;
        setInput(JSON.stringify(parsed, null, indentVal));
      }
      if (onExecute) onExecute();
    } catch (err: any) {
      setIsValid(false);
      const msg = err.message || 'Invalid JSON syntax.';
      setErrorMessage(msg);

      // Extract line and column if available
      const match = msg.match(/at position (\d+)/i) || msg.match(/line (\d+) column (\d+)/i);
      if (match) {
        if (match[2]) {
          setErrorPosition({ line: parseInt(match[1]), col: parseInt(match[2]) });
        } else {
          const pos = parseInt(match[1]);
          const upToError = rawText.substring(0, pos);
          const lines = upToError.split('\n');
          setErrorPosition({ line: lines.length, col: lines[lines.length - 1].length + 1 });
        }
      } else {
        setErrorPosition(null);
      }
    }
  };

  const handleMinify = () => {
    try {
      let parsed = JSON.parse(input);
      if (sortKeys) parsed = sortObject(parsed);
      setInput(JSON.stringify(parsed));
      setIsValid(true);
      setErrorMessage(null);
      setErrorPosition(null);
      if (onExecute) onExecute();
    } catch (err: any) {
      setIsValid(false);
      setErrorMessage(err.message || 'Cannot minify invalid JSON');
    }
  };

  useEffect(() => {
    // live validation without altering user text
    try {
      if (input.trim()) {
        JSON.parse(input);
        setIsValid(true);
        setErrorMessage(null);
        setErrorPosition(null);
      }
    } catch (err: any) {
      setIsValid(false);
      setErrorMessage(err.message);
    }
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([input], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
            <span>Indent:</span>
            <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
              {[2, 4, 'tab' as const].map((space) => (
                <button
                  key={space}
                  onClick={() => setIndent(space)}
                  className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                    indent === space
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {space === 'tab' ? 'Tab' : `${space} spaces`}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={sortKeys}
              onChange={(e) => setSortKeys(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="flex items-center gap-1">
              <ArrowDownUp className="w-3 h-3 text-slate-400" /> Sort Keys A-Z
            </span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => validateAndFormat(input, true)}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Beautify & Format
          </button>
          <button
            onClick={handleMinify}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-lg transition-colors cursor-pointer"
          >
            Minify (1 line)
          </button>
        </div>
      </div>

      {/* Editor with Syntax Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {isValid ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Valid JSON
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" /> Syntax Error
                {errorPosition && (
                  <span className="text-[11px] font-mono ml-1">
                    [Line {errorPosition.line}, Col {errorPosition.col}]
                  </span>
                )}
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {input.length.toLocaleString()} characters · {input.split('\n').length} lines
          </span>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={14}
          spellCheck={false}
          className={`w-full p-4 text-xs font-mono bg-slate-50/50 dark:bg-slate-950/80 border rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 resize-y leading-relaxed ${
            isValid
              ? 'border-slate-300 dark:border-slate-800 focus:ring-indigo-500'
              : 'border-rose-400 dark:border-rose-800 focus:ring-rose-500'
          }`}
          placeholder="Paste unformatted JSON here..."
        />

        {errorMessage && (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-mono bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900">
            {errorMessage}
          </p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setInput('')}
          className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Clear Editor
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download .json
          </button>
          <button
            onClick={handleCopy}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied JSON!' : 'Copy Formatted JSON'}
          </button>
        </div>
      </div>
    </div>
  );
};
