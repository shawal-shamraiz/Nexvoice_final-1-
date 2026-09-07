import { useEffect, useState } from 'react';
import { X, Flag, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { DataService } from '../lib/supabase';

interface ReportModalProps {
  issueId?: string;
  commentId?: string;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS = [
  'Spam',
  'Abusive Content',
  'False Information',
  'Personal Information',
  'Harassment',
  'Duplicate',
  'Other',
] as const;

export const ReportModal: React.FC<ReportModalProps> = ({ issueId, commentId, isOpen, onClose }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setReason('');
      setDescription('');
      setIsSubmitting(false);
      setIsSubmitted(false);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedDescription = description.trim();

    if (!reason) {
      setError('Please select a reason for your report.');
      return;
    }
    if (trimmedDescription.length > 1000) {
      setError('Please keep the explanation under 1,000 characters.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    let succeeded = false;

    if (commentId) {
      succeeded = await DataService.reportComment(commentId, reason, trimmedDescription);
    } else if (issueId) {
      succeeded = await DataService.reportIssue({
        issue_id: issueId,
        reason,
        ...(trimmedDescription ? { description: trimmedDescription } : {}),
      });
    }

    setIsSubmitting(false);

    if (succeeded) {
      setIsSubmitted(true);
    } else {
      setError("We couldn't submit your report right now. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => { if (event.target === event.currentTarget && !isSubmitting) onClose(); }}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-dialog-title"
      >
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg disabled:opacity-50"
          aria-label="Close report dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <>
            <div className="flex items-start space-x-3 pr-8">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center shrink-0">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h2 id="report-dialog-title" className="text-lg font-bold text-[#1E293B]">
                  {commentId ? 'Report Comment' : 'Report This Issue'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">Help us maintain a trustworthy public platform.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="report-reason" className="block text-sm font-semibold text-slate-700 mb-1.5">Reason for reporting <span className="text-rose-600">*</span></label>
                <select
                  id="report-reason"
                  value={reason}
                  onChange={(event) => { setReason(event.target.value); setError(''); }}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/35 focus:border-[#4F46E5]"
                  disabled={isSubmitting}
                  required
                >
                  <option value="">Select a reason</option>
                  {REPORT_REASONS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="report-details" className="block text-sm font-semibold text-slate-700 mb-1.5">Additional details <span className="font-normal text-slate-400">(optional)</span></label>
                <textarea
                  id="report-details"
                  value={description}
                  onChange={(event) => { setDescription(event.target.value); setError(''); }}
                  rows={4}
                  maxLength={1000}
                  placeholder="Explain what prompted your report, if helpful."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/35 focus:border-[#4F46E5] resize-y"
                  disabled={isSubmitting}
                />
                <p className="mt-1 text-[11px] text-slate-400 text-right">{description.length}/1,000</p>
              </div>

              {error && (
                <p className="flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-700" role="alert">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </p>
              )}

              <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3">
                <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSubmitting || !reason} className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? 'Submitting…' : 'Submit Report'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#10B981] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h2 id="report-dialog-title" className="text-xl font-bold text-[#1E293B]">Report Submitted</h2>
              <p className="text-sm text-slate-600 mt-2">Thank you. Your report has been recorded and will be reviewed by administrators.</p>
            </div>
            <button onClick={onClose} className="mt-2 px-6 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold">Close</button>
          </div>
        )}
      </div>
    </div>
  );
};
