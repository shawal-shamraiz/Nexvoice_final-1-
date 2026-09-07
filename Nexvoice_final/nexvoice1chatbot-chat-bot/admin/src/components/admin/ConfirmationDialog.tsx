import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, Trash2 } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: 'approve' | 'reject' | 'remove' | 'restore';
  requireReason?: boolean;
  reasonPlaceholder?: string;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  variant = 'approve',
  requireReason = false,
  reasonPlaceholder = 'Provide optional moderation note...',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requireReason && !reason.trim()) {
      setError('Please provide a reason before continuing.');
      return;
    }
    setError('');
    onConfirm(reason.trim());
  };

  const variantStyles = {
    approve: {
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      icon: CheckCircle,
      iconColor: 'text-emerald-600 bg-emerald-50',
    },
    reject: {
      btn: 'bg-rose-600 hover:bg-rose-700 text-white',
      icon: XCircle,
      iconColor: 'text-rose-600 bg-rose-50',
    },
    remove: {
      btn: 'bg-slate-800 hover:bg-slate-900 text-white',
      icon: Trash2,
      iconColor: 'text-slate-700 bg-slate-100',
    },
    restore: {
      btn: 'bg-[#0EA5E9] hover:bg-sky-600 text-white',
      icon: CheckCircle,
      iconColor: 'text-[#0EA5E9] bg-sky-50',
    },
  }[variant];

  const Icon = variantStyles.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl max-w-md w-full p-6 space-y-4 animate-pop-in">
        <div className="flex items-start space-x-3">
          <div className={`p-3 rounded-xl ${variantStyles.iconColor} shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1E2B37]">{title}</h3>
            <p className="text-sm text-[#64748B] mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(requireReason || variant === 'reject' || variant === 'remove') && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2B37] mb-1">
                Moderation Note {requireReason ? <span className="text-rose-600">*</span> : '(Optional)'}
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                placeholder={reasonPlaceholder}
                rows={3}
                className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm focus:border-[#0EA5E9] focus:outline-none bg-[#FAF9F6]"
              />
              {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-[#E2E8F0]">
            <button
              type="button"
              disabled={loading}
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50 ${variantStyles.btn}`}
            >
              {loading ? 'Processing...' : confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
