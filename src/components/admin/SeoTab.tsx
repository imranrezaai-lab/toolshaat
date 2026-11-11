import React, { useState } from 'react';
import { Globe, FileCode, Check, Copy, RefreshCw } from 'lucide-react';
import { toolStore } from '../../services/store';

export const SeoTab: React.FC = () => {
  const settings = toolStore.getSettings();
  const tools = toolStore.getPublishedTools();
  const categories = toolStore.getCategories();

  const [siteName, setSiteName] = useState(settings.siteName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [description, setDescription] = useState(settings.description);
  const [copiedSitemap, setCopiedSitemap] = useState(false);
  const [copiedRobots, setCopiedRobots] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toolStore.updateSettings({
      siteName,
      tagline,
      description
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Generate dynamic sitemap.xml
  const baseUrl = 'https://omnitools.app';
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Static Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/tools</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/faq</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- Categories (${categories.length}) -->
${categories.map(c => `  <url>
    <loc>${baseUrl}/category/${c.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}

  <!-- Tools (${tools.length}) -->
${tools.map(t => `  <url>
    <loc>${baseUrl}/tools/${t.slug}</loc>
    <lastmod>${t.updatedAt.split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
  </url>`).join('\n')}
</urlset>`;

  const robotsTxt = `User-agent: *
Allow: /
Allow: /tools/
Allow: /category/
Disallow: /admin

Sitemap: ${baseUrl}/sitemap.xml`;

  return (
    <div className="space-y-8">
      {/* Global Meta Form */}
      <form onSubmit={handleSave} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-600" />
          Global SEO & Search Indexing Metadata
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Website Brand Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Primary SEO Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Meta Description (SERP Snippet)
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Recommended length: 140–160 characters. Current: {description.length} chars.
          </p>
        </div>

        {/* Live Google Search Snippet Simulation */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Google Search Result Simulation
          </span>
          <p className="text-xs text-slate-500 font-mono">https://omnitools.app</p>
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer">
            {siteName} - {tagline}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            {saved ? 'Saved SEO Changes!' : 'Update SEO Metadata'}
          </button>
        </div>
      </form>

      {/* Dynamic sitemap.xml & robots.txt */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* sitemap.xml */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-indigo-500" /> Dynamic sitemap.xml
            </h4>
            <button
              onClick={() => {
                navigator.clipboard.writeText(sitemapXml);
                setCopiedSitemap(true);
                setTimeout(() => setCopiedSitemap(false), 2000);
              }}
              className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              {copiedSitemap ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              {copiedSitemap ? 'Copied XML' : 'Copy sitemap.xml'}
            </button>
          </div>
          <pre className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-[11px] font-mono text-slate-700 dark:text-slate-300 max-h-56 overflow-y-auto border border-slate-200 dark:border-slate-800 leading-normal">
            {sitemapXml}
          </pre>
        </div>

        {/* robots.txt */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-indigo-500" /> robots.txt
            </h4>
            <button
              onClick={() => {
                navigator.clipboard.writeText(robotsTxt);
                setCopiedRobots(true);
                setTimeout(() => setCopiedRobots(false), 2000);
              }}
              className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              {copiedRobots ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              {copiedRobots ? 'Copied robots' : 'Copy robots.txt'}
            </button>
          </div>
          <pre className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-[11px] font-mono text-slate-700 dark:text-slate-300 max-h-56 overflow-y-auto border border-slate-200 dark:border-slate-800 leading-normal">
            {robotsTxt}
          </pre>
        </div>
      </div>
    </div>
  );
};
