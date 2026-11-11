import React from 'react';
import { ToolDefinition } from '../types';
import { ImageCompressor } from './components/ImageCompressor';
import { ImageResizer } from './components/ImageResizer';
import { ImageConverter } from './components/ImageConverter';
import { PdfMerger } from './components/PdfMerger';
import { PdfSplitter } from './components/PdfSplitter';
import { QrCodeGenerator } from './components/QrCodeGenerator';
import { WordCounter } from './components/WordCounter';
import { CaseConverter } from './components/CaseConverter';
import { JsonFormatter } from './components/JsonFormatter';
import { PercentageCalculator } from './components/PercentageCalculator';
import { PasswordGenerator } from './components/PasswordGenerator';
import { Wrench } from 'lucide-react';

export interface ToolComponentProps {
  tool: ToolDefinition;
  onExecute?: () => void;
}

export const TOOL_REGISTRY: Record<string, React.FC<ToolComponentProps>> = {
  'image-compressor': ImageCompressor,
  'image-resizer': ImageResizer,
  'image-converter': ImageConverter,
  'pdf-merger': PdfMerger,
  'pdf-splitter': PdfSplitter,
  'qr-code-generator': QrCodeGenerator,
  'word-counter': WordCounter,
  'case-converter': CaseConverter,
  'json-formatter': JsonFormatter,
  'password-generator': PasswordGenerator,
  'percentage-calculator': PercentageCalculator,
};

// Generic Fallback Component for user-added tools created in Admin Dashboard
export const GenericToolPlaceholder: React.FC<ToolComponentProps> = ({ tool, onExecute }) => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');

  const handleTest = () => {
    setOutput(`Processed input: ${input.toUpperCase()} at ${new Date().toLocaleTimeString()}`);
    if (onExecute) onExecute();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center space-y-4">
      <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mx-auto">
        <Wrench className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
          {tool.name} Engine
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          This tool was registered via the Admin Dashboard. Test its reactive sandbox below:
        </p>
      </div>
      <div className="max-w-md mx-auto space-y-3 text-left">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter test input..."
          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
        />
        <button
          onClick={handleTest}
          className="w-full py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
        >
          Execute Simulation
        </button>
        {output && (
          <div className="p-3 bg-slate-100 dark:bg-slate-800 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
            {output}
          </div>
        )}
      </div>
    </div>
  );
};
