import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RotateCcw, Lock, Unlock, Scaling, Check } from 'lucide-react';
import { ToolDefinition } from '../../types';

interface ToolProps {
  tool: ToolDefinition;
  onExecute?: () => void;
}

export const ImageResizer: React.FC<ToolProps> = ({ tool: _tool, onExecute }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [lockRatio, setLockRatio] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [resizedSize, setResizedSize] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setTargetWidth(img.width);
        setTargetHeight(img.height);
        setAspectRatio(img.width / img.height);
        setPreviewUrl(img.src);
      };
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleWidthChange = (w: number) => {
    setTargetWidth(w);
    if (lockRatio && aspectRatio > 0) {
      setTargetHeight(Math.round(w / aspectRatio));
    }
  };

  const handleHeightChange = (h: number) => {
    setTargetHeight(h);
    if (lockRatio && aspectRatio > 0) {
      setTargetWidth(Math.round(h * aspectRatio));
    }
  };

  const applyPreset = (w: number, h: number) => {
    setTargetWidth(w);
    setTargetHeight(h);
  };

  const executeResize = () => {
    if (!previewUrl || targetWidth <= 0 || targetHeight <= 0) return;

    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (format === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (resizedUrl) URL.revokeObjectURL(resizedUrl);
            const url = URL.createObjectURL(blob);
            setResizedUrl(url);
            setResizedSize(blob.size);
            if (onExecute) onExecute();
          }
        },
        format,
        0.92
      );
    };
  };

  useEffect(() => {
    if (previewUrl && targetWidth > 0 && targetHeight > 0) {
      executeResize();
    }
  }, [previewUrl, targetWidth, targetHeight, format]);

  const handleReset = () => {
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    setFile(null);
    setPreviewUrl(null);
    setResizedUrl(null);
    setOriginalWidth(0);
    setOriginalHeight(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            <Scaling className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Upload an image to resize
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click or drag & drop. Set exact pixels or choose standard social presets.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dimensions Controls */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Width (px)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={targetWidth}
                  onChange={(e) => handleWidthChange(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div className="pt-5">
                <button
                  type="button"
                  onClick={() => setLockRatio(!lockRatio)}
                  title={lockRatio ? 'Unlock Aspect Ratio' : 'Lock Aspect Ratio'}
                  className={`p-2 rounded-lg border transition-colors ${
                    lockRatio
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300'
                      : 'bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700'
                  }`}
                >
                  {lockRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Height (px)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={targetHeight}
                  onChange={(e) => handleHeightChange(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div className="w-40">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                >
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>
            </div>

            {/* Presets */}
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-2 font-medium">
                Quick Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Full HD 1920×1080', w: 1920, h: 1080 },
                  { label: 'OpenGraph 1200×630', w: 1200, h: 630 },
                  { label: 'Square 1080×1080', w: 1080, h: 1080 },
                  { label: 'Banner 1280×720', w: 1280, h: 720 },
                  { label: 'Avatar 400×400', w: 400, h: 400 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => applyPreset(preset.w, preset.h)}
                    className="px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 hover:border-indigo-500 transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dimension Info Banner */}
          <div className="flex items-center justify-between text-xs px-4 py-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-slate-600 dark:text-slate-400">
            <span>
              Original: <strong className="font-mono text-slate-900 dark:text-slate-200">{originalWidth}×{originalHeight} px</strong> ({formatBytes(file.size)})
            </span>
            <span>
              Target: <strong className="font-mono text-indigo-600 dark:text-indigo-400">{targetWidth}×{targetHeight} px</strong> ({formatBytes(resizedSize)})
            </span>
          </div>

          {/* Preview Canvas */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 bg-slate-50 dark:bg-slate-950 text-center">
            {resizedUrl && (
              <img
                src={resizedUrl}
                alt="Resized output"
                className="max-h-80 mx-auto rounded object-contain border border-slate-200 dark:border-slate-800"
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

            {resizedUrl && (
              <a
                href={resizedUrl}
                download={`resized_${targetWidth}x${targetHeight}_${file.name.replace(/\.[^/.]+$/, '')}.${format.split('/')[1]}`}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Resized Image
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
