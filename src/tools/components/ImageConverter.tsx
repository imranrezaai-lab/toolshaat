import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RotateCcw, RefreshCw, ArrowRight, Check } from 'lucide-react';
import { ToolDefinition } from '../../types';

interface ToolProps {
  tool: ToolDefinition;
  onExecute?: () => void;
}

export const ImageConverter: React.FC<ToolProps> = ({ tool: _tool, onExecute }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp'>('webp');
  const [quality, setQuality] = useState<number>(90);
  const [convertedSize, setConvertedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const executeConvert = () => {
    if (!previewUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      if (targetFormat === 'jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, img.width, img.height);
      }
      ctx.drawImage(img, 0, 0);

      const mimeType = `image/${targetFormat}`;
      const q = targetFormat === 'png' ? 1.0 : quality / 100;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (convertedUrl) URL.revokeObjectURL(convertedUrl);
            const url = URL.createObjectURL(blob);
            setConvertedUrl(url);
            setConvertedSize(blob.size);
            if (onExecute) onExecute();
          }
          setIsProcessing(false);
        },
        mimeType,
        q
      );
    };
  };

  useEffect(() => {
    if (previewUrl) {
      executeConvert();
    }
  }, [previewUrl, targetFormat, quality]);

  const handleReset = () => {
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setFile(null);
    setPreviewUrl(null);
    setConvertedUrl(null);
    setConvertedSize(0);
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
            accept="image/*"
            className="hidden"
          />
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Upload an image to convert
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Convert PNG to WebP, JPG to PNG, or WebP to JPG directly in your browser.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Format selection */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Convert to Target Format:
              </label>
              <div className="flex gap-2">
                {(['webp', 'png', 'jpeg'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setTargetFormat(fmt)}
                    className={`flex-1 py-2 text-xs font-semibold uppercase rounded-lg border transition-colors cursor-pointer ${
                      targetFormat === fmt
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-indigo-500'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {targetFormat !== 'png' && (
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Encoding Quality</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Conversion summary */}
          <div className="flex items-center justify-center gap-4 py-3 px-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-xs">
            <span className="font-mono text-slate-700 dark:text-slate-300">
              {file.name} ({formatBytes(file.size)})
            </span>
            <ArrowRight className="w-4 h-4 text-indigo-500" />
            <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
              .{targetFormat.toUpperCase()} ({formatBytes(convertedSize)})
            </span>
          </div>

          {/* Preview */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 bg-slate-50 dark:bg-slate-950 text-center">
            {convertedUrl && (
              <img
                src={convertedUrl}
                alt="Converted preview"
                className="max-h-72 mx-auto rounded object-contain border border-slate-200 dark:border-slate-800"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>

            {convertedUrl && (
              <a
                href={convertedUrl}
                download={`${file.name.replace(/\.[^/.]+$/, '')}.${targetFormat}`}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download .{targetFormat.toUpperCase()}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
