import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminService } from '../../services/adminService';
import { IssueStatusBadge } from '../../components/admin/IssueStatusBadge';
import { AuditTimeline } from '../../components/admin/AuditTimeline';
import { ConfirmationDialog } from '../../components/admin/ConfirmationDialog';
import { AdminLoadingState } from '../../components/admin/AdminLoadingState';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import type { Issue, IssueModerationHistory, DuplicateMatch, IssueComment } from '../../types';
import {
  ArrowLeft,
  Building,
  MapPin,
  User,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  RotateCcw,
  Lock,
  ExternalLink,
  Copy,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';

export const AdminIssueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { admin } = useAdminAuth();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [history, setHistory] = useState<IssueModerationHistory[]>([]);
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [duplicates, setDuplicates] = useState<DuplicateMatch[]>([]);
  const [comments, setComments] = useState<IssueComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Confirmation Modal state
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    action: 'approve' | 'reject' | 'remove' | 'restore';
    title: string;
    message: string;
  }>({
    isOpen: false,
    action: 'approve',
    title: '',
    message: '',
  });

  useEffect(() => {
    if (id) loadData(id);
  }, [id]);

  const loadData = async (issueId: string) => {
    setLoading(true);
    const [issueData, historyData, docData, duplicatesData, allCommentsData] = await Promise.all([
      AdminService.fetchIssueById(issueId),
      AdminService.fetchModerationHistory(issueId),
      AdminService.fetchVerificationDocument(issueId),
      AdminService.fetchDuplicates(issueId),
      AdminService.fetchAllComments(),
    ]);

    setIssue(issueData);
    setHistory(historyData);
    setDocUrl(docData);
    setDuplicates(duplicatesData);
    setComments(allCommentsData.filter((c) => c.issue_id === issueId));
    setLoading(false);
  };

  if (loading) return <AdminLayout><AdminLoadingState message="Loading complete issue record & audit logs..." /></AdminLayout>;

  if (!issue) {
    return (
      <AdminLayout>
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0] space-y-4 max-w-md mx-auto my-12">
          <h2 className="text-xl font-bold text-[#1E2B37]">Issue Not Found</h2>
          <p className="text-xs text-[#64748B]">The requested issue record could not be located in the database.</p>
          <Link to="/admin/issues" className="inline-flex items-center px-4 py-2 rounded-xl bg-[#0EA5E9] text-white font-bold text-xs">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Return to Moderation List
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const handleActionClick = (action: 'approve' | 'reject' | 'remove' | 'restore') => {
    const titles = {
      approve: 'Approve Issue for Publication',
      reject: 'Reject Submission',
      remove: 'Remove Issue from Public Website',
      restore: 'Restore Issue to Public Register',
    };

    const messages = {
      approve: `Once approved, issue ${issue.issue_number} will become publicly visible on NexVoice.`,
      reject: `Rejecting submission ${issue.issue_number} keeps it hidden from the public website.`,
      remove: `Removing issue ${issue.issue_number} immediately hides it from the public website.`,
      restore: `Restoring ${issue.issue_number} makes it publicly visible again.`,
    };

    setModalConfig({
      isOpen: true,
      action,
      title: titles[action],
      message: messages[action],
    });
  };

  const handleConfirmAction = async (reason?: string) => {
    if (!admin || !id) return;
    setActionLoading(true);
    const { action } = modalConfig;

    try {
      if (action === 'approve') {
        await AdminService.approveIssue(issue.id, admin, reason);
      } else if (action === 'reject') {
        await AdminService.rejectIssue(issue.id, admin, reason || 'Rejected during verification review.');
      } else if (action === 'remove') {
        await AdminService.removeIssue(issue.id, admin, reason || 'Removed by administrator discretion.');
      } else if (action === 'restore') {
        await AdminService.restoreIssue(issue.id, admin, reason);
      }
      await loadData(issue.id);
    } finally {
      setActionLoading(false);
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (confirm('Are you sure you want to remove this comment?')) {
      await AdminService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Back Link and Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            onClick={() => navigate('/admin/issues')}
            className="inline-flex items-center text-xs font-semibold text-[#64748B] hover:text-[#1E2B37] transition-colors self-start"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Moderation List
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#64748B] font-medium">Current Status:</span>
            <IssueStatusBadge status={issue.status} />
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Issue & Submitter Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Potential Duplicates Indicator (Non-AI Algorithmic Detection) */}
            {duplicates.length > 0 && (
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-amber-900 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-amber-600 shrink-0" />
                    Potential Duplicates Flagged ({duplicates.length})
                  </h3>
                  <span className="text-[10px] font-semibold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded">
                    Non-Destructive Flag
                  </span>
                </div>
                <p className="text-xs text-amber-800">
                  Traditional TF-IDF algorithmic comparison detected high similarity with existing records. Review before approval. The original submission remains intact.
                </p>

                <div className="space-y-2 pt-1">
                  {duplicates.map((dup) => (
                    <div key={dup.candidate.id} className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-[#0EA5E9] mr-2">{dup.candidate.issue_number}</span>
                        <span className="font-bold text-[#1E2B37]">{dup.candidate.title}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                          {dup.percentage}% Similarity
                        </span>
                        <Link to={`/admin/issues/${dup.candidate.id}`} className="font-semibold text-[#0EA5E9] hover:underline">
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Card 1: Issue Overview */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-bold px-3 py-1 rounded-lg bg-sky-50 text-[#0EA5E9] border border-sky-100">
                    {issue.issue_number}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-[#1E2B37]">
                    {issue.category}
                  </span>
                  {issue.subcategory && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
                      {issue.subcategory}
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono text-[#64748B]">
                  {new Date(issue.created_at).toLocaleString('en-GB')}
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-xl font-black text-[#1E2B37]">{issue.title}</h1>
                <p className="text-xs text-[#64748B] flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-[#14B8A6]" />
                  {issue.location || `${issue.city}, ${issue.province}`}
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Detailed Concern Description</h2>
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E2E8F0] text-sm text-[#1E2B37] leading-relaxed whitespace-pre-line">
                  {issue.description}
                </div>
              </div>
            </div>

            {/* Card 2: Submitter & Institution Details */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-[#1E2B37] border-b border-[#E2E8F0] pb-3 flex items-center">
                <User className="w-4 h-4 mr-2 text-[#0EA5E9]" />
                Submitter & Institution Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#64748B] block font-bold uppercase tracking-wider text-[10px] mb-0.5">Submitter Name</span>
                  <span className="font-semibold text-[#1E2B37]">{issue.name}</span>
                  {issue.is_anonymous && (
                    <span className="ml-2 text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold">
                      Requested Public Anonymity
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[#64748B] block font-bold uppercase tracking-wider text-[10px] mb-0.5">Filing Role</span>
                  <span className="font-semibold text-[#1E2B37]">
                    {issue.submission_type === 'STUDENT' ? 'Student' : 'Institution Representative'}
                  </span>
                </div>

                <div>
                  <span className="text-[#64748B] block font-bold uppercase tracking-wider text-[10px] mb-0.5">Institution Name</span>
                  <span className="font-semibold text-[#1E2B37] flex items-center">
                    <Building className="w-3.5 h-3.5 mr-1 text-[#0EA5E9]" />
                    {issue.institution_name}
                  </span>
                </div>

                <div>
                  <span className="text-[#64748B] block font-bold uppercase tracking-wider text-[10px] mb-0.5">Location</span>
                  <span className="font-semibold text-[#1E2B37]">{issue.city}, {issue.province}</span>
                </div>

                {issue.submission_type === 'STUDENT' ? (
                  <>
                    <div>
                      <span className="text-[#64748B] block font-bold uppercase tracking-wider text-[10px] mb-0.5">Education Level & Program</span>
                      <span className="font-semibold text-[#1E2B37]">{issue.education_level || 'N/A'} - {issue.program || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block font-bold uppercase tracking-wider text-[10px] mb-0.5">Student ID Number</span>
                      <span className="font-semibold text-[#1E2B37] font-mono">{issue.student_id || 'Provided'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-[#64748B] block font-bold uppercase tracking-wider text-[10px] mb-0.5">Designation / Role</span>
                      <span className="font-semibold text-[#1E2B37]">{issue.role || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block font-bold uppercase tracking-wider text-[10px] mb-0.5">Employee / Rep ID</span>
                      <span className="font-semibold text-[#1E2B37] font-mono">{issue.institution_id || 'Provided'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Card 3: Issue Comments Moderation */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-[#1E2B37] border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
                <span className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-indigo-600" />
                  Public Comments Moderation ({comments.length})
                </span>
                <span className="text-[10px] font-semibold text-slate-500">Moderation Control</span>
              </h2>

              {comments.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-4">No comments posted on this issue yet.</p>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-3.5 rounded-xl border border-slate-200 bg-[#FAF9F6] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2 font-bold text-[#1E2B37]">
                          <span>{comment.author_name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            • {new Date(comment.created_at).toLocaleDateString('en-GB')}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="px-2.5 py-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-[11px] inline-flex items-center transition-colors"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove Comment
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Card 4: Verification Information (Private Evidence) */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <h2 className="text-sm font-bold text-[#1E2B37] flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2 text-emerald-600" />
                  Verification Information (Admin Restricted)
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  Private Document
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[#0EA5E9]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#1E2B37]">Private Identity Document</span>
                    <span className="block text-[11px] text-[#64748B]">Protected by Supabase Storage RLS (Bucket: identity-documents)</span>
                  </div>
                </div>

                {docUrl ? (
                  <a
                    href={docUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#0EA5E9] text-white font-bold text-xs inline-flex items-center hover:bg-sky-600 transition-colors shadow-xs"
                  >
                    View Document
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-500 italic">Document stored securely in Supabase Storage</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Audit History */}
          <div className="space-y-6">
            {/* Card 1: Moderation Controls */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-[#1E2B37] border-b border-[#E2E8F0] pb-3">
                Moderation Actions
              </h2>

              <div className="space-y-2.5">
                {(issue.status === 'PENDING_VERIFICATION' || issue.status === 'REPORTED') && (
                  <>
                    <button
                      onClick={() => handleActionClick('approve')}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve Issue for Public
                    </button>
                    <button
                      onClick={() => handleActionClick('reject')}
                      className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Submission
                    </button>
                  </>
                )}

                {(issue.status === 'APPROVED' || issue.status === 'PUBLISHED') && (
                  <button
                    onClick={() => handleActionClick('remove')}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove from Public Website
                  </button>
                )}

                {(issue.status === 'REMOVED' || issue.status === 'REJECTED') && (
                  <button
                    onClick={() => handleActionClick('restore')}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0EA5E9] hover:bg-sky-600 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restore Public Issue
                  </button>
                )}

                {issue.status === 'REJECTED' && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                    This submission was rejected by moderation and is not publicly visible.
                  </div>
                )}
              </div>
            </div>

            {/* Card 2: Audit History Timeline */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-[#1E2B37] border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
                <span>Audit Trail History</span>
                <span className="text-[10px] font-mono font-normal text-[#64748B]">{history.length} records</span>
              </h2>

              <AuditTimeline history={history} />
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmLabel={modalConfig.action.toUpperCase()}
        variant={modalConfig.action}
        requireReason={modalConfig.action === 'reject' || modalConfig.action === 'remove'}
        onConfirm={handleConfirmAction}
        onCancel={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        loading={actionLoading}
      />
    </AdminLayout>
  );
};
