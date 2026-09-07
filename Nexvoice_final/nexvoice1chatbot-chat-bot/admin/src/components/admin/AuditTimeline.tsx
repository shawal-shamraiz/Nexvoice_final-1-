import React from 'react';
import type { IssueModerationHistory } from '../../types';
import { CheckCircle2, XCircle, Trash2, RotateCcw, Clock } from 'lucide-react';

interface AuditTimelineProps {
  history: IssueModerationHistory[];
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-[#64748B] border border-dashed border-[#E2E8F0] rounded-xl bg-[#FAF9F6]">
        No moderation history recorded yet.
      </div>
    );
  }

  const getActionDetails = (action: string) => {
    switch (action) {
      case 'SUBMITTED':
        return { icon: Clock, color: 'text-slate-500 bg-slate-100', label: 'SUBMITTED' };
      case 'APPROVED':
        return { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50', label: 'APPROVED' };
      case 'REJECTED':
        return { icon: XCircle, color: 'text-rose-600 bg-rose-50', label: 'REJECTED' };
      case 'REMOVED':
        return { icon: Trash2, color: 'text-slate-700 bg-slate-100', label: 'REMOVED' };
      case 'RESTORED':
        return { icon: RotateCcw, color: 'text-[#0EA5E9] bg-sky-50', label: 'RESTORED' };
      default:
        return { icon: Clock, color: 'text-slate-500 bg-slate-100', label: action };
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
        {history.map((item) => {
          const { icon: Icon, color, label } = getActionDetails(item.action);
          return (
            <div key={item.id} className="relative flex items-start space-x-3">
              <div className={`absolute -left-6 p-1 rounded-full ${color} ring-4 ring-white`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="bg-[#FAF9F6] p-3.5 rounded-xl border border-[#E2E8F0] w-full space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E2B37] uppercase tracking-wider">{label}</span>
                  <span className="text-[11px] font-mono text-[#64748B]">{formatDate(item.created_at)}</span>
                </div>
                <div className="text-xs text-slate-700 font-medium">
                  By: <strong className="text-[#1E2B37]">{item.admin_name || item.admin_id || 'System'}</strong>
                </div>
                {item.note && (
                  <p className="text-xs text-[#64748B] italic bg-white p-2 rounded-lg border border-[#E2E8F0]/60 mt-1">
                    "{item.note}"
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
