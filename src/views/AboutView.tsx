import React from 'react';
import { ShieldCheck, Zap, Lock, Globe, Users, Heart } from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';

interface AboutViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('home') },
          { label: 'About Us' }
        ]}
      />

      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          About OmniTools
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          OmniTools was founded on a simple conviction: modern web browsers possess tremendous computational power, and users shouldn't have to surrender their private documents, images, and data to remote servers simply to compress a file, merge a PDF, or format JSON.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Client-Side Computing
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            By running image transforms, PDF merges, and formatting inside HTML5 canvas and WebAssembly, your sensitive data stays on your device.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Speed Without Limits
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            No uploading or downloading delays across sluggish internet connections. Operations happen instantaneously at CPU speeds.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Global Accessibility
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Designed for students in universities, engineers writing code, and small businesses optimizing web performance.
          </p>
        </div>
      </div>

      <div className="p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Our Architectural Roadmap
        </h2>
        <p>
          We began with 10 essential utilities covering image compression, resizing, conversion, PDF merging and splitting, QR code creation, word analytics, case transformation, JSON validation, and percentage calculations.
        </p>
        <p>
          Under the hood, our modular engine is architected to scale to over 500 specialized tools across developer utilities, audio converters, cryptographic hashing, and document transformations.
        </p>
      </div>
    </div>
  );
};
