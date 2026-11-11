import React, { useState } from 'react';
import { DollarSign, Sliders, ToggleLeft, ToggleRight, Check, Eye } from 'lucide-react';
import { toolStore } from '../../services/store';
import { AdSlotConfig } from '../../types';

export const AdsTab: React.FC = () => {
  const settings = toolStore.getSettings();
  const adSlots = toolStore.getAdSlots();

  const [adsEnabled, setAdsEnabled] = useState(settings.adsEnabled);
  const [adsenseClientId, setAdsenseClientId] = useState(settings.adsenseClientId);
  const [previewAdsMode, setPreviewAdsMode] = useState(settings.previewAdsMode);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleGlobalToggle = () => {
    const next = !adsEnabled;
    setAdsEnabled(next);
    toolStore.updateSettings({ adsEnabled: next });
  };

  const handlePreviewToggle = () => {
    const next = !previewAdsMode;
    setPreviewAdsMode(next);
    toolStore.updateSettings({ previewAdsMode: next });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toolStore.updateSettings({
      adsEnabled,
      adsenseClientId,
      previewAdsMode
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSlotToggle = (slot: AdSlotConfig) => {
    toolStore.updateAdSlot(slot.id, { enabled: !slot.enabled });
  };

  const handleSlotIdChange = (slot: AdSlotConfig, newSlotId: string) => {
    toolStore.updateAdSlot(slot.id, { slotId: newSlotId });
  };

  return (
    <div className="space-y-8">
      {/* Global Ad Settings Card */}
      <form onSubmit={handleSaveSettings} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Global Monetization & Google AdSense Controls
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure master publisher IDs and toggle ad visibility across all pages.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleGlobalToggle}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                adsEnabled
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {adsEnabled ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5" />}
              <span>{adsEnabled ? 'Ads Globally Active' : 'Ads Disabled Globally'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Google AdSense Client ID (Publisher ID)
            </label>
            <input
              type="text"
              value={adsenseClientId}
              onChange={(e) => setAdsenseClientId(e.target.value)}
              placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Obtained from your Google AdSense console once domain ownership is verified.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Development Wireframe Preview Mode
            </label>
            <button
              type="button"
              onClick={handlePreviewToggle}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                previewAdsMode
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300'
                  : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>Show visual wireframe bounding boxes in dev mode</span>
              </div>
              <span className="font-semibold">{previewAdsMode ? 'ON' : 'OFF'}</span>
            </button>
            <p className="text-[11px] text-slate-400 mt-1">
              Renders gray wireframes with exact bounds (CLS = 0) to preview ad slot positions without firing live ad tags.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : null}
            {saveSuccess ? 'Saved Ad Settings!' : 'Save Global Ad Settings'}
          </button>
        </div>
      </form>

      {/* Individual Ad Placements Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            AdSense Placement Positions & Unit Slots ({adSlots.length})
          </h3>
          <p className="text-xs text-slate-500">
            Individual slot controls. Disable specific units on sensitive views to preserve user workflow.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Placement Position</th>
                <th className="py-3 px-4">Location & Description</th>
                <th className="py-3 px-4">AdSense Unit Slot ID</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {adSlots.map((slot) => (
                <tr key={slot.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    {slot.position}
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    {slot.name}
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={slot.slotId}
                      onChange={(e) => handleSlotIdChange(slot, e.target.value)}
                      placeholder="e.g. 1234567890"
                      className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono w-36 text-slate-800 dark:text-slate-200"
                    />
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {slot.format}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleSlotToggle(slot)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        slot.enabled
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {slot.enabled ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
