import React from 'react';
import { Inbox } from 'lucide-react';

interface AdminEmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({ title, description, action }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center space-y-3 card-shadow">
      <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
        <Inbox className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-[#1E2B37]">{title}</h3>
      <p className="text-xs text-[#64748B] max-w-sm mx-auto">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
