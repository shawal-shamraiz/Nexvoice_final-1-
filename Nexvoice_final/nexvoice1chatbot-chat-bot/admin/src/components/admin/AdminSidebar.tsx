import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Flag, Mail, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export const AdminSidebar: React.FC = () => {
  const { signOut } = useAdminAuth();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Issues Moderation', path: '/admin/issues', icon: FileText },
    { label: 'Report Center', path: '/admin/reports', icon: Flag },
    { label: 'Contact Messages', path: '/admin/messages', icon: Mail },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#1E2B37] text-white flex flex-col min-h-screen border-r border-[#E2E8F0]/10 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-[#0EA5E9] flex items-center justify-center text-white shadow-md">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight leading-tight">NexVoice</h1>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#0EA5E9]">Admin Portal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5" aria-label="Admin Navigation">
        {navItems.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#0EA5E9] text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Signout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={signOut}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
