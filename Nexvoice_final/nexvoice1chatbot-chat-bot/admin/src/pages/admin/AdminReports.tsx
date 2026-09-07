import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminService } from '../../services/adminService';
import { AdminEmptyState } from '../../components/admin/AdminEmptyState';
import { AdminLoadingState } from '../../components/admin/AdminLoadingState';
import type { ContentReport, ReportStatus, Profile } from '../../types';
import { Flag, CheckCircle2, XCircle, Eye, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'ALL'>('PENDING');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    const [adminProfile, reportsData] = await Promise.all([
      AdminService.getCurrentAdminProfile(),
      AdminService.fetchReports(),
    ]);
    setCurrentAdmin(adminProfile);
    setReports(reportsData);
    setLoading(false);
  };

  const loadReports = async () => {
    const data = await AdminService.fetchReports();
    setReports(data);
  };

  const handleUpdateStatus = async (reportId: string, status: ReportStatus) => {
    setUpdatingId(reportId);
    setFeedback(null);
    try {
      const adminId = currentAdmin?.id || 'admin-system';
      const success = await AdminService.updateReportStatus(reportId, status, adminId);
      if (success) {
        setFeedback({
          type: 'success',
          message: `Report status successfully updated to ${status} and persisted to database.`,
        });
        await loadReports();
      } else {
        setFeedback({
          type: 'error',
          message: 'Unable to update report status in database. Please try again.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'Unable to update report. Please check server connection and try again.',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveReportedIssue = async (reportId: string, issueId: string) => {
    const reason = window.prompt(
      'Explicit Admin Action: Please enter the reason for unpublishing/removing this reported issue from public display:',
      'Content violates community guidelines'
    );
    if (!reason || reason.trim().length === 0) return;

    setUpdatingId(reportId);
    setFeedback(null);
    try {
      const admin = currentAdmin || { id: 'admin-system', full_name: 'Administrator', role: 'ADMIN' };
      const removeSuccess = await AdminService.removeIssue(issueId, admin, reason.trim());
      if (removeSuccess) {
        await AdminService.updateReportStatus(reportId, 'RESOLVED', admin.id);
        setFeedback({
          type: 'success',
          message: 'Issue explicitly unpublished/removed from public website, and report marked as RESOLVED.',
        });
        await loadReports();
      } else {
        setFeedback({
          type: 'error',
          message: 'Failed to remove issue from database. Please try again.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'An error occurred while attempting to remove the reported issue.',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  const pendingCount = reports.filter((r) => r.status === 'PENDING').length;
  const reviewedCount = reports.filter((r) => r.status === 'REVIEWED').length;
  const resolvedCount = reports.filter((r) => r.status === 'RESOLVED').length;
  const dismissedCount = reports.filter((r) => r.status === 'DISMISSED').length;

  if (loading) return <AdminLayout><AdminLoadingState message="Loading content reports from database..." /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#1E2B37]">Admin Report Center</h1>
            <p className="text-xs text-[#64748B] mt-1">
              Review and moderate reported issues and comments submitted by public users.
            </p>
          </div>

          {/* Quick status tabs */}
          <div className="flex items-center flex-wrap gap-1 bg-white p-1 rounded-xl border border-[#E2E8F0] shadow-xs self-start text-xs font-bold">
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'PENDING'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E2B37] hover:bg-slate-100'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('REVIEWED')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'REVIEWED'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E2B37] hover:bg-slate-100'
              }`}
            >
              Reviewed ({reviewedCount})
            </button>
            <button
              onClick={() => setStatusFilter('RESOLVED')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'RESOLVED'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E2B37] hover:bg-slate-100'
              }`}
            >
              Resolved ({resolvedCount})
            </button>
            <button
              onClick={() => setStatusFilter('DISMISSED')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'DISMISSED'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E2B37] hover:bg-slate-100'
              }`}
            >
              Dismissed ({dismissedCount})
            </button>
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-[#1E2B37] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E2B37] hover:bg-slate-100'
              }`}
            >
              All Reports ({reports.length})
            </button>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-xs font-bold ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              {feedback.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-slate-400 hover:text-slate-600 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Reports Table / List */}
        {filteredReports.length === 0 ? (
          <AdminEmptyState
            title="No Content Reports"
            description="There are currently no reported issues or comments matching the selected filter."
          />
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-slate-500">{report.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      Reason: {report.reason}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      Target: {report.comment_id ? 'Comment' : 'Issue'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        report.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : report.status === 'RESOLVED'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : report.status === 'DISMISSED'
                          ? 'bg-slate-100 text-slate-700 border border-slate-200'
                          : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                      }`}
                    >
                      Status: {report.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {new Date(report.created_at).toLocaleString('en-GB')}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  {report.issue_title && (
                    <div className="font-bold text-[#1E2B37] flex items-center">
                      <span className="text-slate-500 font-normal mr-2">Issue:</span>
                      {report.issue_number && <span className="font-mono text-[#0EA5E9] mr-2">{report.issue_number}</span>}
                      {report.issue_title}
                    </div>
                  )}

                  {report.comment_content && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium italic">
                      "{report.comment_content}"
                    </div>
                  )}

                  {report.description && (
                    <div className="text-slate-600">
                      <strong className="text-slate-800">Reporter Note:</strong> {report.description}
                    </div>
                  )}

                  {report.reviewed_at && (
                    <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-1 flex items-center justify-between">
                      <span>Reviewed By: <strong className="text-slate-600">{report.reviewed_by || 'Admin System'}</strong></span>
                      <span>Reviewed At: {new Date(report.reviewed_at).toLocaleString('en-GB')}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  {report.issue_id && (
                    <Link
                      to={`/admin/issues/${report.issue_id}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-bold text-[#0EA5E9] hover:bg-sky-50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      View Target Issue
                    </Link>
                  )}

                  <div className="flex items-center space-x-2 ml-auto">
                    {report.issue_id && report.status === 'PENDING' && (
                      <button
                        disabled={updatingId === report.id}
                        onClick={() => handleRemoveReportedIssue(report.id, report.issue_id!)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs inline-flex items-center transition-colors disabled:opacity-50"
                        title="Explicit Admin Action: Unpublish and remove this reported issue from public website"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Remove Issue
                      </button>
                    )}

                    {report.status !== 'DISMISSED' && (
                      <button
                        disabled={updatingId === report.id}
                        onClick={() => handleUpdateStatus(report.id, 'DISMISSED')}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center transition-colors disabled:opacity-50"
                        title="Dismiss report as invalid — issue remains live on User website"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Dismiss Report
                      </button>
                    )}

                    {report.status !== 'RESOLVED' && (
                      <button
                        disabled={updatingId === report.id}
                        onClick={() => handleUpdateStatus(report.id, 'RESOLVED')}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center transition-colors disabled:opacity-50"
                        title="Mark report as resolved"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
