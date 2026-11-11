import React, { useState } from 'react';
import { Users, Shield, User, Search, Check, AlertCircle } from 'lucide-react';
import { toolStore } from '../../services/store';
import { UserProfile } from '../../types';

export const UsersTab: React.FC = () => {
  const users = toolStore.getUsers();
  const currentUser = toolStore.getCurrentUser();
  const [search, setSearch] = useState('');

  const handleRoleChange = (id: string, role: 'admin' | 'user') => {
    toolStore.updateUserRole(id, role);
  };

  const handleStatusChange = (id: string, currentStatus: 'active' | 'suspended') => {
    toolStore.updateUserStatus(id, currentStatus === 'active' ? 'suspended' : 'active');
  };

  const handleSwitchLogin = (u: UserProfile) => {
    toolStore.setCurrentUser(u);
  };

  const filtered = users.filter(
    u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Active Session Simulation Notice */}
      <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-slate-800 dark:text-slate-200">
            Currently logged in as: <strong>{currentUser.name}</strong> ({currentUser.email}) · Role:{' '}
            <span className="font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400">{currentUser.role}</span>
          </span>
        </div>
        <span className="text-slate-500 text-[11px]">
          Supabase RBAC Simulation Active
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search accounts by name or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
          />
        </div>

        <span className="text-xs text-slate-400 font-mono">
          {users.length} registered accounts
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-right">Switch Active / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((u) => {
                const isCurrent = currentUser.id === u.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">
                        {u.name.charAt(0)}
                      </div>
                      <span>{u.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 px-1.5 py-0.2 rounded font-medium">
                          You
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                      {u.email}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                        className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border rounded text-xs text-slate-800 dark:text-slate-200 font-mono"
                      >
                        <option value="admin">admin</option>
                        <option value="user">user</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleStatusChange(u.id, u.status)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                        }`}
                      >
                        {u.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!isCurrent && (
                        <button
                          onClick={() => handleSwitchLogin(u)}
                          className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white rounded text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                        >
                          Simulate Login
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
