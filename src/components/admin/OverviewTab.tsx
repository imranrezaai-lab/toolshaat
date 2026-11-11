import React from 'react';
import { 
  Wrench, 
  CheckCircle, 
  FileEdit, 
  Users, 
  Play, 
  TrendingUp, 
  DollarSign, 
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { toolStore } from '../../services/store';

export const OverviewTab: React.FC = () => {
  const tools = toolStore.getAllTools();
  const publishedCount = tools.filter(t => t.published).length;
  const draftCount = tools.filter(t => !t.published).length;
  const users = toolStore.getUsers();
  const auditLogs = toolStore.getAuditLogs();
  const settings = toolStore.getSettings();

  const totalExecutions = tools.reduce((sum, t) => sum + t.executionCount, 0);
  const popularTools = [...tools].sort((a, b) => b.executionCount - a.executionCount).slice(0, 5);

  // Estimated AdSense revenue calculation ($2.50 RPM on executions)
  const estimatedRevenue = ((totalExecutions / 1000) * 2.5).toFixed(2);

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Tools</span>
            <Wrench className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {tools.length}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">
              {publishedCount} published · {draftCount} drafts
            </span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Tool Executions</span>
            <Play className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {totalExecutions.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400">100% Client-Side</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Registered Accounts</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {users.length}
            </span>
            <span className="text-[11px] text-slate-400">Supabase Auth Seed</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Est. AdSense Earnings</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              ${estimatedRevenue}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">
              RPM $2.50 benchmark
            </span>
          </div>
        </div>
      </div>

      {/* Traffic & Popularity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Executed Tools */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Top Performing Tools
            </h3>
            <span className="text-xs text-slate-400">Lifetime usage</span>
          </div>

          <div className="space-y-3">
            {popularTools.map((tool, idx) => {
              const percent = totalExecutions > 0 ? ((tool.executionCount / totalExecutions) * 100).toFixed(1) : '0';
              return (
                <div key={tool.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="text-slate-400 font-mono w-4">{idx + 1}.</span>
                      {tool.name}
                    </span>
                    <span className="font-mono text-slate-500 tabular-nums">
                      {tool.executionCount.toLocaleString()} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${Math.max(5, parseFloat(percent))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System & Audit Logs */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Recent Admin Activity Log
            </h3>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {auditLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="pt-2 text-xs space-y-0.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                    {log.action}
                  </span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {log.target}
                </p>
                {log.details && (
                  <p className="text-[11px] text-slate-500 truncate">
                    {log.details} · <span className="font-mono">{log.actor}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
