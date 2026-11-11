import React, { useState, useEffect } from 'react';
import { KeyRound, Copy, Check, RefreshCw, ShieldCheck, Download, Sliders } from 'lucide-react';
import { ToolComponentProps } from '../registry';

export const PasswordGenerator: React.FC<ToolComponentProps> = ({ tool: _tool, onExecute }) => {
  const [length, setLength] = useState<number>(16);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [batchCount, setBatchCount] = useState<number>(1);
  const [batchList, setBatchList] = useState<string[]>([]);

  const generateSinglePassword = (len: number): string => {
    let chars = '';
    if (includeLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (excludeAmbiguous) {
      // Remove easily confused characters: i, l, 1, L, o, 0, O
      chars = chars.replace(/[il1Lo0O]/g, '');
    }

    if (!chars) return '';

    // Use cryptographically secure randomness
    const array = new Uint32Array(len);
    window.crypto.getRandomValues(array);
    let result = '';
    for (let i = 0; i < len; i++) {
      result += chars[array[i] % chars.length];
    }
    return result;
  };

  const generate = () => {
    const mainPwd = generateSinglePassword(length);
    setPassword(mainPwd);

    if (batchCount > 1) {
      const list: string[] = [];
      for (let i = 0; i < batchCount; i++) {
        list.push(generateSinglePassword(length));
      }
      setBatchList(list);
    } else {
      setBatchList([]);
    }

    if (onExecute) onExecute();
  };

  useEffect(() => {
    generate();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous, batchCount]);

  // Calculate password strength
  const getStrength = (pwd: string) => {
    if (!pwd) return { label: 'Empty', color: 'bg-slate-300', score: 0 };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 14) score += 1;
    if (pwd.length >= 20) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { label: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-500', width: '25%' };
    if (score <= 4) return { label: 'Moderate', color: 'bg-amber-500', textColor: 'text-amber-500', width: '50%' };
    if (score === 5) return { label: 'Strong', color: 'bg-indigo-500', textColor: 'text-indigo-500', width: '75%' };
    return { label: 'Very Strong', color: 'bg-emerald-500', textColor: 'text-emerald-500', width: '100%' };
  };

  const strength = getStrength(password);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const content = batchList.length > 0 ? batchList.join('\n') : password;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passwords.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
      {/* Password Display Box */}
      <div className="space-y-2">
        <div className="relative flex items-center">
          <input
            type="text"
            readOnly
            value={password}
            className="w-full py-4 pl-4 pr-28 text-base sm:text-lg font-mono font-semibold bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 select-all"
          />
          <div className="absolute right-2 flex items-center gap-1">
            <button
              onClick={generate}
              title="Regenerate password"
              className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleCopy(password)}
              title="Copy password"
              className="px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Strength Meter Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Password Strength:</span>
            <span className={`font-semibold font-mono ${strength.textColor}`}>{strength.label}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${strength.color} transition-all duration-300`}
              style={{ width: strength.width }}
            />
          </div>
        </div>
      </div>

      {/* Controls & Options */}
      <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-5">
        {/* Length Slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Password Length
            </span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              {length} characters
            </span>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>6 (Short)</span>
            <span>16 (Recommended)</span>
            <span>32 (Secure)</span>
            <span>64 (Max)</span>
          </div>
        </div>

        {/* Character Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Include Uppercase Letters (A-Z)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Include Lowercase Letters (a-z)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Include Numbers (0-9)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Include Special Symbols (!@#$%)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 sm:col-span-2">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Exclude Ambiguous Characters (e.g. 1, l, I, 0, O, o)</span>
          </label>
        </div>
      </div>

      {/* Batch Generation Option */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Batch Generation (Generate multiple passwords at once)
          </label>
          <select
            value={batchCount}
            onChange={(e) => setBatchCount(Number(e.target.value))}
            className="px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border rounded-lg text-slate-800 dark:text-slate-200"
          >
            <option value="1">1 Password</option>
            <option value="5">5 Passwords</option>
            <option value="10">10 Passwords</option>
            <option value="20">20 Passwords</option>
          </select>
        </div>

        {batchList.length > 0 && (
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {batchList.map((pwd, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono"
              >
                <span className="truncate pr-2">{pwd}</span>
                <button
                  onClick={() => handleCopy(pwd)}
                  className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer"
                  title="Copy password"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleDownloadTxt}
          className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> Download as .txt
        </button>

        <button
          onClick={generate}
          className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Generate New Password
        </button>
      </div>
    </div>
  );
};
