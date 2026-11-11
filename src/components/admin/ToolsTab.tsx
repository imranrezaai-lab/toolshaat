import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  Search, 
  Check, 
  X,
  FileCode,
  Layers
} from 'lucide-react';
import { toolStore } from '../../services/store';
import { ToolDefinition, ToolType } from '../../types';

export const ToolsTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [editingTool, setEditingTool] = useState<ToolDefinition | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('developer');
  const [icon, setIcon] = useState('Code2');
  const [toolType, setToolType] = useState<ToolType>('developer');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [tags, setTags] = useState('utility, tool');

  const tools = toolStore.getAllTools();
  const categories = toolStore.getCategories();

  const handleOpenCreate = () => {
    setName('');
    setSlug('');
    setDescription('');
    setCategory(categories[0]?.id || 'image');
    setIcon('Wrench');
    setToolType('developer');
    setFeatured(false);
    setPublished(true);
    setSeoTitle('');
    setSeoDescription('');
    setTags('');
    setIsCreating(true);
    setEditingTool(null);
  };

  const handleOpenEdit = (t: ToolDefinition) => {
    setEditingTool(t);
    setName(t.name);
    setSlug(t.slug);
    setDescription(t.description);
    setCategory(t.category);
    setIcon(t.icon);
    setToolType(t.toolType);
    setFeatured(t.featured);
    setPublished(t.published);
    setSeoTitle(t.seoTitle);
    setSeoDescription(t.seoDescription);
    setTags(t.tags.join(', '));
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = tags.split(',').map(s => s.trim()).filter(Boolean);

    if (isCreating) {
      toolStore.createTool({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description,
        category,
        icon: icon || 'Wrench',
        toolType,
        featured,
        published,
        seoTitle: seoTitle || name,
        seoDescription: seoDescription || description,
        howToUse: ['Enter or upload data.', 'Execute tool transformation.', 'Download or copy results.'],
        faqs: [{ question: `Is ${name} free?`, answer: 'Yes, 100% free with client-side execution.' }],
        tags: tagArray
      });
      setIsCreating(false);
    } else if (editingTool) {
      toolStore.updateTool(editingTool.id, {
        name,
        slug,
        description,
        category,
        icon,
        toolType,
        featured,
        published,
        seoTitle,
        seoDescription,
        tags: tagArray
      });
      setEditingTool(null);
    }
  };

  const handleDelete = (id: string, toolName: string) => {
    if (confirm(`Are you sure you want to delete "${toolName}"?`)) {
      toolStore.deleteTool(id);
    }
  };

  const togglePublish = (t: ToolDefinition) => {
    toolStore.updateTool(t.id, { published: !t.published });
  };

  const toggleFeatured = (t: ToolDefinition) => {
    toolStore.updateTool(t.id, { featured: !t.featured });
  };

  const filtered = tools.filter(
    t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools by title or slug..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Tool
        </button>
      </div>

      {/* Tools Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Tool Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Executions</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((tool) => (
                <tr key={tool.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {tool.name}
                    </span>
                    <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                      {tool.description}
                    </p>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    {tool.category}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                    /tools/{tool.slug}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {tool.executionCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => togglePublish(tool)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                        tool.published
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {tool.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {tool.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleFeatured(tool)}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          tool.featured ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(tool)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 rounded cursor-pointer"
                        title="Edit tool"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(tool.id, tool.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        title="Delete tool"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Slide-over for Add/Edit Tool */}
      {(isCreating || editingTool) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {isCreating ? 'Add New Platform Tool' : `Edit: ${editingTool?.name}`}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingTool(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Tool Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (isCreating) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                    }}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Lucide Icon</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="e.g. Code2, FileText, QrCode"
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Tool Type</label>
                  <select
                    value={toolType}
                    onChange={(e) => setToolType(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100"
                  >
                    <option value="image">image</option>
                    <option value="pdf">pdf</option>
                    <option value="text">text</option>
                    <option value="developer">developer</option>
                    <option value="calculator">calculator</option>
                    <option value="generator">generator</option>
                    <option value="converter">converter</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Published (Visible to public)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Featured (Highlight on homepage)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingTool(null);
                  }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
                >
                  Save Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
