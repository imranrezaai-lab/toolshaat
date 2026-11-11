import React from 'react';
import { AdPosition } from '../../types';
import { toolStore } from '../../services/store';

interface AdSlotProps {
  position: AdPosition;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ position, className = '' }) => {
  const settings = toolStore.getSettings();
  const slot = toolStore.getAdSlotByPosition(position);

  // If ads are disabled globally or for this slot, render nothing
  if (!settings.adsEnabled || !slot?.enabled) {
    return null;
  }

  // Developer preview placeholder mode or when no real AdSense client ID is set
  if (settings.previewAdsMode) {
    return (
      <div
        className={`w-full overflow-hidden my-6 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl bg-slate-100/60 dark:bg-slate-900/40 p-4 text-center transition-all ${className}`}
        style={{ minHeight: slot.format === 'rectangle' ? '250px' : '90px' }}
      >
        <div className="flex flex-col items-center justify-center h-full min-h-[70px] text-slate-400 dark:text-slate-500">
          <span className="text-[10px] uppercase tracking-wider font-semibold bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400 mb-1">
            Advertisement Placement
          </span>
          <p className="text-xs font-mono text-slate-600 dark:text-slate-400">
            Position: <span className="font-semibold">{position}</span> · Slot: {slot.slotId || 'responsive-unit'}
          </p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            Google AdSense · Fixed Bounds (CLS = 0)
          </span>
        </div>
      </div>
    );
  }

  // Real AdSense Unit container (when previewAdsMode is false)
  return (
    <div
      className={`w-full overflow-hidden my-6 flex justify-center text-center ${className}`}
      style={{ minHeight: '90px' }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={settings.adsenseClientId}
        data-ad-slot={slot.slotId}
        data-ad-format={slot.format}
        data-full-width-responsive="true"
      />
    </div>
  );
};
