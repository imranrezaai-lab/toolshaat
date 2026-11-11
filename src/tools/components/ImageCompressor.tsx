import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RotateCcw, Image as ImageIcon, Sliders, CheckCircle2 } from 'lucide-react';
import { ToolDefinition } from '../../types';

interface ToolProps {
  tool: ToolDefinition;
  onExecute?: () => void;
}

export const ImageCompressor: React.FC<ToolProps> = ({ tool: _tool, onExecute }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(75);
  const [maxDimension, setMaxDimension] = useState<number>(1920);
  const [useMaxDimension, setUseMaxDimension] = useState<boolean>(false);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, or WebP).');
      return;
    }
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const compressImage = () => {
    if (!file || !previewUrl) return;
    setProcessing(true);

    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (useMaxDimension && (width > maxDimension || height > maxDimension)) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setProcessing(false);
        return;
      }

      if (format === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(img, 0, 0, width, height);

      const q = format === 'image/png' ? 1.0 : quality / 100;
      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (compressedUrl) URL.revokeObjectURL(compressedUrl);
            const newUrl = URL.createObjectURL(blob);
            setCompressedUrl(newUrl);
            setCompressedSize(blob.size);
            if (onExecute) onExecute();
          }
          setProcessing(false);
        },
        format,
        q
      );
    };
  };

  useEffect(() => {
    if (file && previewUrl) {
      compressImage();
    }
  }, [file, previewUrl, quality, format, useMaxDimension, maxDimension]);

  const handleReset = () => {
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setFile(null);
    setPreviewUrl(null);
    setCompressedUrl(null);
    setOriginalSize(0);
    setCompressedSize(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const savingsPercent = originalSize > 0 && compressedSize > 0 
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

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
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl p-12 text-center cursor-pointer transition-colors"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
            }}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Upload an image to compress
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Drag and drop or browse JPG, PNG, or WebP. Processed 100% locally in your browser.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" /> Compression Quality
                </span>
                <span className="tabular-nums font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                  {quality}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                step="5"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Output Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="image/jpeg">JPEG (Universal, best photo compression)</option>
                <option value="image/webp">WebP (Modern, superior efficiency)</option>
                <option value="image/png">PNG (Lossless with alpha transparency)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Dimension Scaling
              </label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useMaxDimension}
                    onChange={(e) => setUseMaxDimension(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Max width/height
                </label>
                {useMaxDimension && (
                  <input
                    type="number"
                    value={maxDimension}
                    onChange={(e) => setMaxDimension(Number(e.target.value))}
                    className="w-20 px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 font-mono"
                    placeholder="1920"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Metrics Card */}
          <div className="grid grid-cols-3 gap-4 text-center p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">Original Size</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
                {formatBytes(originalSize)}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">Compressed Size</span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                {formatBytes(compressedSize)}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">Total Reduction</span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums flex items-center justify-center gap-1">
                {savingsPercent > 0 && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                {savingsPercent}%
              </span>
            </div>
          </div>

          {/* Previews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 bg-slate-50 dark:bg-slate-950 text-center">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-2">Original</span>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Original preview"
                  className="max-h-64 mx-auto rounded object-contain border border-slate-200 dark:border-slate-800"
                />
              )}
            </div>
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 bg-slate-50 dark:bg-slate-950 text-center">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-2">
                Compressed Output {processing && '(Optimizing...)'}
              </span>
              {compressedUrl && (
                <img
                  src={compressedUrl}
                  alt="Compressed preview"
                  className="max-h-64 mx-auto rounded object-contain border border-slate-200 dark:border-slate-800"
                />
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset & Clear
            </button>

            {compressedUrl && (
              <a
                href={compressedUrl}
                download={`compressed_${file.name.replace(/\.[^/.]+$/, '')}.${format.split('/')[1]}`}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Compressed Image
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
