import React from 'react';
import type { IssueStatus } from '../../types';

interface IssueStatusBadgeProps {
  status: IssueStatus;
  size?: 'sm' | 'md';
}

export const IssueStatusBadge: React.FC<IssueStatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  switch (status) {
    case 'PENDING_VERIFICATION':
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5 animate-pulse" />
          PENDING VERIFICATION
        </span>
      );
    case 'APPROVED':
    case 'PUBLISHED':
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
          APPROVED
        </span>
      );
    case 'REJECTED':
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
          REJECTED
        </span>
      );
    case 'REMOVED':
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-gray-100 text-gray-600 border border-gray-300 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5" />
          REMOVED
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};
