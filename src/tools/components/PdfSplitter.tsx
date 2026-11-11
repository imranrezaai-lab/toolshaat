import React, { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, Split, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { ToolDefinition } from '../../types';

interface ToolProps {
  tool: ToolDefinition;
  onExecute?: () => void;
}

export const PdfSplitter: React.FC<ToolProps> = ({ tool: _tool, onExecute }) => {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rangeInput, setRangeInput] = useState<string>('1');
  const [splitBlobUrl, setSplitBlobUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [extractedPageCount, setExtractedPageCount] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.pdf') && selectedFile.type !== 'application/pdf') {
      alert('Please upload a valid PDF document.');
      return;
    }

    setFile(selectedFile);
    setErrorMessage(null);
    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdf.getPageCount();
      setTotalPages(count);
      setRangeInput(count > 1 ? `1-${Math.min(3, count)}` : '1');
    } catch (err: any) {
      console.error('Failed to read PDF:', err);
      setErrorMessage('Could not load PDF. It might be password-protected or corrupted.');
    }
  };

  const parsePageNumbers = (input: string, max: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(',').map(p => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map(s => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const lower = Math.max(1, Math.min(start, end));
          const upper = Math.min(max, Math.max(start, end));
          for (let i = lower; i <= upper; i++) {
            pages.add(i);
          }
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p >= 1 && p <= max) {
          pages.add(p);
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const executeSplit = async () => {
    if (!file || totalPages === 0) return;
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const selectedPages = parsePageNumbers(rangeInput, totalPages);
      if (selectedPages.length === 0) {
        setErrorMessage(`Please enter valid page numbers between 1 and ${totalPages}.`);
        setIsProcessing(false);
        return;
      }

      const fileBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(fileBuffer);
      const newPdf = await PDFDocument.create();

      // pdf-lib uses 0-based indices
      const indicesToCopy = selectedPages.map(p => p - 1);
      const copiedPages = await newPdf.copyPages(sourcePdf, indicesToCopy);
      copiedPages.forEach(page => newPdf.addPage(page));

      const newPdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(newPdfBytes)], { type: 'application/pdf' });

      if (splitBlobUrl) URL.revokeObjectURL(splitBlobUrl);
      const url = URL.createObjectURL(blob);
      setSplitBlobUrl(url);
      setExtractedPageCount(selectedPages.length);

      if (onExecute) onExecute();
    } catch (err: any) {
      console.error('PDF Split error:', err);
      setErrorMessage(err?.message || 'Error occurred while extracting pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (splitBlobUrl) URL.revokeObjectURL(splitBlobUrl);
    setFile(null);
    setTotalPages(0);
    setRangeInput('1');
    setSplitBlobUrl(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-xl p-12 text-center cursor-pointer transition-colors"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
            }}
            accept="application/pdf,.pdf"
            className="hidden"
          />
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Split className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Upload a PDF document to split
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Extract selected pages or custom ranges with instant client-side processing.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File summary */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-rose-500 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {file.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Total pages: {totalPages}
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
            >
              Choose different file
            </button>
          </div>

          {/* Range controls */}
          <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                Pages to Extract:
              </label>
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="e.g. 1-3, 5, 8-10"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                Use hyphens for ranges (e.g. <code className="font-mono">1-4</code>) and commas for individual pages (e.g. <code className="font-mono">1, 3, 5</code>).
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => setRangeInput('1')}
                className="px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300 hover:border-indigo-500 cursor-pointer"
              >
                Page 1 Only
              </button>
              {totalPages >= 2 && (
                <button
                  type="button"
                  onClick={() => setRangeInput(`1-${Math.ceil(totalPages / 2)}`)}
                  className="px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300 hover:border-indigo-500 cursor-pointer"
                >
                  First Half (1-{Math.ceil(totalPages / 2)})
                </button>
              )}
              {totalPages >= 2 && (
                <button
                  type="button"
                  onClick={() => setRangeInput(`${Math.ceil(totalPages / 2) + 1}-${totalPages}`)}
                  className="px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300 hover:border-indigo-500 cursor-pointer"
                >
                  Second Half ({Math.ceil(totalPages / 2) + 1}-{totalPages})
                </button>
              )}
              <button
                type="button"
                onClick={() => setRangeInput(`1-${totalPages}`)}
                className="px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300 hover:border-indigo-500 cursor-pointer"
              >
                All Pages (1-{totalPages})
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          {/* Success Download Banner */}
          {splitBlobUrl && (
            <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Extracted {extractedPageCount} {extractedPageCount === 1 ? 'page' : 'pages'} ready for download!
              </span>
              <a
                href={splitBlobUrl}
                download={`split_${rangeInput.replace(/[^0-9-]/g, '_')}_${file.name}`}
                className="px-4 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Download Split PDF
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>

            <button
              onClick={executeSplit}
              disabled={isProcessing}
              className="px-6 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Split className="w-4 h-4" />}
              Extract & Split Pages
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
