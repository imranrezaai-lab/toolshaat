import React, { useState } from 'react';
import { Settings, Save, Check, RotateCcw, AlertTriangle } from 'lucide-react';
import { toolStore } from '../../services/store';

export const SettingsTab: React.FC = () => {
  const settings = toolStore.getSettings();

  const [siteName, setSiteName] = useState(settings.siteName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [description, setDescription] = useState(settings.description);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [twitter, setTwitter] = useState(settings.socialLinks.twitter || '');
  const [github, setGithub] = useState(settings.socialLinks.github || '');
  const [discord, setDiscord] = useState(settings.socialLinks.discord || '');
  const [privacyPolicy, setPrivacyPolicy] = useState(settings.privacyPolicy);
  const [termsOfService, setTermsOfService] = useState(settings.termsOfService);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toolStore.updateSettings({
      siteName,
      tagline,
      description,
      contactEmail,
      socialLinks: { twitter, github, discord },
      privacyPolicy,
      termsOfService
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to reset all tools, categories, and settings to factory defaults? Any custom tools added will be removed.')) {
      toolStore.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSave} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-600" />
              Platform Branding & System Configuration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Update website identity, contact details, social links, and legal terms.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Website Name *
            </label>
            <input
              type="text"
              required
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Contact Email *
            </label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100 font-mono"
            />
          </div>
        </div>

        <div className="text-xs">
          <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
            Tagline
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="text-xs">
          <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
            Site Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Social Links */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
            Social Media Links
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Twitter / X URL</label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/..."
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">GitHub URL</label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Discord URL</label>
              <input
                type="url"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
                placeholder="https://discord.gg/..."
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Legal Text Configuration */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Legal & Policy Content
          </h4>
          <div className="text-xs">
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Privacy Policy Statement
            </label>
            <textarea
              rows={3}
              value={privacyPolicy}
              onChange={(e) => setPrivacyPolicy(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="text-xs">
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Terms of Service Statement
            </label>
            <textarea
              rows={3}
              value={termsOfService}
              onChange={(e) => setTermsOfService(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved Website Settings!' : 'Save All Settings'}
          </button>
        </div>
      </form>

      {/* Danger Zone: Factory Reset */}
      <div className="p-6 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-semibold text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Reset Platform Database to Factory Defaults</span>
        </div>
        <p className="text-xs text-rose-700 dark:text-rose-400">
          This will purge all custom tools, category changes, and restore the initial 10 tools seed.
        </p>
        <button
          onClick={handleResetToDefaults}
          className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
        >
          Reset to Factory Defaults
        </button>
      </div>
    </div>
  );
};
