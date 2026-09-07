import React from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { User, LogOut, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminHeader: React.FC = () => {
  const { admin, signOut } = useAdminAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between shadow-xs sticky top-0 z-30">
      <div className="flex items-center space-x-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Operational Portal</span>
        <span className="text-slate-300">/</span>
        <span className="text-xs font-bold text-[#1E2B37]">NexVoice Administration</span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 bg-[#FAF9F6] px-3 py-1.5 rounded-xl border border-[#E2E8F0]">
          <div className="w-7 h-7 rounded-lg bg-[#1E2B37] text-[#0EA5E9] font-bold text-xs flex items-center justify-center">
            {admin?.full_name?.charAt(0) || 'A'}
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold text-[#1E2B37]">{admin?.full_name || 'Administrator'}</span>
            <span className="block text-[10px] text-[#64748B] font-medium">Administrator</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/settings')}
          className="p-2 rounded-lg text-slate-500 hover:text-[#0EA5E9] hover:bg-slate-100 transition-colors"
          title="Account Settings"
        >
          <Key className="w-4 h-4" />
        </button>

        <button
          onClick={signOut}
          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
