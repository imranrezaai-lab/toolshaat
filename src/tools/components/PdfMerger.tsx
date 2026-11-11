import React, { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, Layers, ArrowUp, ArrowDown, Trash2, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { ToolDefinition } from '../../types';

interface ToolProps {
  tool: ToolDefinition;
  onExecute?: () => void;
}

interface PdfItem {
  id: string;
  file: File;
  pageCount: number;
  size: number;
}

export const PdfMerger: React.FC<ToolProps> = ({ tool: _tool, onExecute }) => {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFilesSelect = async (files: FileList | File[]) => {
    const validPdfs = Array.from(files).filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (validPdfs.length === 0) {
      alert('Please select valid PDF documents.');
      return;
    }

    setStatusText('Analyzing PDF pages...');
    const newItems: PdfItem[] = [];

    for (const f of validPdfs) {
      try {
        const buffer = await f.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        newItems.push({
          id: `${f.name}-${Date.now()}-${Math.random()}`,
          file: f,
          pageCount: pdfDoc.getPageCount(),
          size: f.size
        });
      } catch (err) {
        console.warn(`Could not parse page count for ${f.name}:`, err);
        newItems.push({
          id: `${f.name}-${Date.now()}-${Math.random()}`,
          file: f,
          pageCount: 1,
          size: f.size
        });
      }
    }

    setItems(prev => [...prev, ...newItems]);
    setStatusText('');
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setItems(prev => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    setItems(prev => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const executeMerge = async () => {
    if (items.length < 2) {
      alert('Please upload at least 2 PDF files to merge.');
      return;
    }

    setIsMerging(true);
    setStatusText('Merging pages in client memory...');

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < items.length; i++) {
        setStatusText(`Merging file ${i + 1} of ${items.length}: ${items[i].file.name}...`);
        const fileBytes = await items[i].file.arrayBuffer();
        const sourcePdf = await PDFDocument.load(fileBytes);
        const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      setStatusText('Assembling output PDF document...');
      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(mergedBytes)], { type: 'application/pdf' });
      
      if (mergedBlobUrl) URL.revokeObjectURL(mergedBlobUrl);
      const url = URL.createObjectURL(blob);
      setMergedBlobUrl(url);

      if (onExecute) onExecute();
    } catch (err: any) {
      console.error('PDF merge failed:', err);
      alert('PDF merge error: ' + (err?.message || 'Check if file is password-protected.'));
    } finally {
      setIsMerging(false);
      setStatusText('');
    }
  };

  const handleReset = () => {
    if (mergedBlobUrl) URL.revokeObjectURL(mergedBlobUrl);
    setItems([]);
    setMergedBlobUrl(null);
    setStatusText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const totalPages = items.reduce((sum, item) => sum + item.pageCount, 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
      {items.length === 0 ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files) handleFilesSelect(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-xl p-12 text-center cursor-pointer transition-colors"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files) handleFilesSelect(e.target.files);
            }}
            accept="application/pdf,.pdf"
            multiple
            className="hidden"
          />
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Upload PDF documents to merge
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select 2 or more PDF files. Merge happens securely in your browser with zero server transmission.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Info & Add More */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">
                Merge Queue Summary
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-mono">
                {items.length} documents · {totalPages} total pages
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files) handleFilesSelect(e.target.files);
                }}
                accept="application/pdf,.pdf"
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
              >
                + Add More PDFs
              </button>
            </div>
          </div>

          {/* List of PDFs */}
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                      {item.file.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'} · {formatBytes(item.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    title="Move up"
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === items.length - 1}
                    title="Move down"
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    title="Remove"
                    className="p-1.5 text-rose-400 hover:text-rose-600 rounded ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Merge status indicator */}
          {statusText && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              {isMerging && <Loader2 className="w-4 h-4 animate-spin" />}
              {statusText}
            </div>
          )}

          {/* Success Download Notice */}
          {mergedBlobUrl && (
            <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Successfully merged {totalPages} pages into a unified document!
              </span>
              <a
                href={mergedBlobUrl}
                download="merged_document.pdf"
                className="px-4 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Download Merged PDF
              </a>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear All
            </button>

            <button
              onClick={executeMerge}
              disabled={isMerging || items.length < 2}
              className="px-6 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              {isMerging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
              Merge {items.length} PDF Files
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
