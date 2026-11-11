import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';

interface FaqViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const FaqView: React.FC<FaqViewProps> = ({ onNavigate }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqList = [
    {
      q: 'Is OmniTools truly 100% free?',
      a: 'Yes. All current tools are completely free to use without restrictions, subscriptions, or credit card requirements.'
    },
    {
      q: 'Do I need an account to use the tools?',
      a: 'No. Users can use every single tool directly in their browser without registering or logging in.'
    },
    {
      q: 'How are my files protected?',
      a: 'Our tools use client-side browser execution. When you upload photos or PDFs, they are loaded into local browser memory via standard HTML5 File APIs. They are never sent across the internet to our backend.'
    },
    {
      q: 'Can I use OmniTools offline?',
      a: 'Once the page has loaded in your browser, many of our tools (such as the Word Counter, Case Converter, JSON Formatter, and Percentage Calculator) can function even if your internet connection disconnects temporarily.'
    },
    {
      q: 'Are there file size limits?',
      a: 'Since files are processed locally on your hardware, limits depend strictly on your device RAM and browser capabilities. Standard multi-megabyte images and documents run smoothly.'
    },
    {
      q: 'Can I monetize or use the generated files commercially?',
      a: 'Yes. Any image, QR code, or document created or modified with our tools remains 100% your property for commercial and non-commercial purposes.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('home') },
          { label: 'Frequently Asked Questions' }
        ]}
      />

      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Find answers regarding privacy, functionality, limits, and technical usage.
        </p>
      </div>

      <div className="space-y-3">
        {faqList.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <span>{item.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
