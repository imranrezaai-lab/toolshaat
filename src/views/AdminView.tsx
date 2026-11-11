import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Wrench, 
  Layers, 
  DollarSign, 
  Globe, 
  Users, 
  Settings, 
  ArrowLeft,
  Shield,
  ExternalLink,
  Lock,
  LogOut,
  UserCheck
} from 'lucide-react';
import { toolStore } from '../services/store';
import { OverviewTab } from '../components/admin/OverviewTab';
import { ToolsTab } from '../components/admin/ToolsTab';
import { CategoriesTab } from '../components/admin/CategoriesTab';
import { AdsTab } from '../components/admin/AdsTab';
import { SeoTab } from '../components/admin/SeoTab';
import { UsersTab } from '../components/admin/UsersTab';
import { SettingsTab } from '../components/admin/SettingsTab';

interface AdminViewProps {
  onNavigate: (view: string, param?: string) => void;
}

type AdminTab = 'overview' | 'tools' | 'categories' | 'ads' | 'seo' | 'users' | 'settings';

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const currentUser = toolStore.getCurrentUser();
  const settings = toolStore.getSettings();

  // Role-based security gate: if current user is not admin, show permission wall with one-click simulate admin login
  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl text-center space-y-4">
        <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Admin Authorization Required
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          You are currently logged in as a standard member (<strong>{currentUser.email}</strong>). Administrative privileges are required to access this dashboard.
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => {
              toolStore.setCurrentUser({
                id: 'usr-admin-1',
                email: 'admin@omnitools.app',
                name: 'Platform Administrator',
                role: 'admin',
                createdAt: '2026-01-01T00:00:00Z',
                lastActive: new Date().toISOString(),
                status: 'active'
              });
            }}
            className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
          >
            Authenticate as Administrator
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="w-full py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
          >
            Return to Public Website
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'tools' as const, label: 'Tools Management', icon: Wrench },
    { id: 'categories' as const, label: 'Categories', icon: Layers },
    { id: 'ads' as const, label: 'Advertisements', icon: DollarSign },
    { id: 'seo' as const, label: 'SEO & Sitemaps', icon: Globe },
    { id: 'users' as const, label: 'User Accounts', icon: Users },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950/60 flex flex-col md:flex-row">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 flex flex-col justify-between">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                Ω
              </div>
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                Admin Panel
              </span>
            </div>
            <button
              onClick={() => onNavigate('home')}
              title="View public website"
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile & Exit */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-[11px]">
              {currentUser.name.charAt(0)}
            </div>
            <div className="truncate">
              <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-400 truncate font-mono">
                {currentUser.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Public Website
          </button>
        </div>
      </aside>

      {/* Main Admin Viewport */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl">
        {/* Top Breadcrumb & Heading */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Admin / {activeTab}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white capitalize">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Live Platform
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'tools' && <ToolsTab />}
        {activeTab === 'categories' && <CategoriesTab />}
        {activeTab === 'ads' && <AdsTab />}
        {activeTab === 'seo' && <SeoTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
};
