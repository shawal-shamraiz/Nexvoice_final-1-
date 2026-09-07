import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminService } from '../../services/adminService';
import { IssueStatusBadge } from '../../components/admin/IssueStatusBadge';
import { AdminEmptyState } from '../../components/admin/AdminEmptyState';
import { AdminLoadingState } from '../../components/admin/AdminLoadingState';
import { ConfirmationDialog } from '../../components/admin/ConfirmationDialog';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { ISSUE_CATEGORIES, PROVINCES } from '../../types';
import type { Issue } from '../../types';
import { Search, Eye, CheckCircle2, XCircle, Trash2, RotateCcw } from 'lucide-react';

export const AdminIssues: React.FC = () => {
  const { admin } = useAdminAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('PENDING_VERIFICATION');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [provinceFilter, setProvinceFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST'>('NEWEST');

  // Confirmation Modal
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    issueId: string;
    issueNumber: string;
    action: 'approve' | 'reject' | 'remove' | 'restore';
    title: string;
    message: string;
  }>({
    isOpen: false,
    issueId: '',
    issueNumber: '',
    action: 'approve',
    title: '',
    message: '',
  });

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    setLoading(true);
    const data = await AdminService.fetchAllIssues();
    setIssues(data);
    setLoading(false);
  };

  useEffect(() => {
    let result = [...issues];

    if (statusFilter !== 'ALL') {
      if (statusFilter === 'APPROVED') {
        result = result.filter((i) => i.status === 'APPROVED' || i.status === 'PUBLISHED');
      } else {
        result = result.filter((i) => i.status === statusFilter);
      }
    }

    if (categoryFilter !== 'ALL') {
      result = result.filter((i) => i.category === categoryFilter);
    }

    if (provinceFilter !== 'ALL') {
      result = result.filter((i) => i.province === provinceFilter);
    }

    if (typeFilter !== 'ALL') {
      result = result.filter((i) => i.submission_type === typeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.institution_name.toLowerCase().includes(q) ||
          i.issue_number.toLowerCase().includes(q) ||
          i.name.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sortBy === 'NEWEST' ? timeB - timeA : timeA - timeB;
    });

    setFilteredIssues(result);
  }, [issues, statusFilter, categoryFilter, provinceFilter, typeFilter, searchQuery, sortBy]);

  const handleActionClick = (issue: Issue, action: 'approve' | 'reject' | 'remove' | 'restore') => {
    const titles = {
      approve: 'Approve Issue for Publication',
      reject: 'Reject Submission',
      remove: 'Remove Issue from Public Website',
      restore: 'Restore Issue to Public Register',
    };

    const messages = {
      approve: `Are you sure you want to approve issue ${issue.issue_number}? It will immediately become publicly visible on NexVoice.`,
      reject: `Reject submission ${issue.issue_number}. This issue will remain private and hidden from the website.`,
      remove: `Remove issue ${issue.issue_number} from public visibility. The record will remain saved in the database audit log.`,
      restore: `Restore ${issue.issue_number} back to public display on the NexVoice website.`,
    };

    setModalConfig({
      isOpen: true,
      issueId: issue.id,
      issueNumber: issue.issue_number,
      action,
      title: titles[action],
      message: messages[action],
    });
  };

  const handleConfirmAction = async (reason?: string) => {
    if (!admin) return;
    setActionLoading(true);
    const { issueId, action } = modalConfig;

    try {
      if (action === 'approve') {
        await AdminService.approveIssue(issueId, admin, reason);
      } else if (action === 'reject') {
        await AdminService.rejectIssue(issueId, admin, reason || 'Inappropriate or unverified content.');
      } else if (action === 'remove') {
        await AdminService.removeIssue(issueId, admin, reason || 'Removed by admin discretion.');
      } else if (action === 'restore') {
        await AdminService.restoreIssue(issueId, admin, reason);
      }
      await loadIssues();
    } finally {
      setActionLoading(false);
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#1E2B37]">Issue Moderation Ledger</h1>
            <p className="text-xs text-[#64748B] mt-1">
              Review, verify, approve, or remove student issues submitted across all institutions.
            </p>
          </div>

          {/* Quick status tabs */}
          <div className="flex items-center flex-wrap gap-1 bg-white p-1 rounded-xl border border-[#E2E8F0] shadow-xs self-start">
            {[
              { id: 'PENDING_VERIFICATION', label: 'Pending Review' },
              { id: 'APPROVED', label: 'Approved' },
              { id: 'REJECTED', label: 'Rejected' },
              { id: 'REMOVED', label: 'Removed' },
              { id: 'REPORTED', label: 'Reported' },
              { id: 'ALL', label: 'All Issues' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === tab.id
                    ? 'bg-[#1E2B37] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E2B37] hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by reference code (e.g. NV-2026-000001), title, institution, or student name..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E2E8F0] text-xs focus:border-[#0EA5E9] focus:outline-none bg-[#FAF9F6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] px-3 py-1.5 bg-white focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                {ISSUE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1">Province</label>
              <select
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] px-3 py-1.5 bg-white focus:outline-none"
              >
                <option value="ALL">All Provinces</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1">Filer Role</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] px-3 py-1.5 bg-white focus:outline-none"
              >
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Student</option>
                <option value="INSTITUTION_REPRESENTATIVE">Institution Rep</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1">Sort Order</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'NEWEST' | 'OLDEST')}
                className="w-full rounded-xl border border-[#E2E8F0] px-3 py-1.5 bg-white focus:outline-none"
              >
                <option value="NEWEST">Newest First</option>
                <option value="OLDEST">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <AdminLoadingState message="Fetching moderation records..." />
        ) : filteredIssues.length === 0 ? (
          <AdminEmptyState
            title="No Matching Issues Found"
            description="No issues match the selected filter criteria or search query."
          />
        ) : (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    <th className="py-3 px-4">Ref Number</th>
                    <th className="py-3 px-4">Title & Details</th>
                    <th className="py-3 px-4">Institution</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-xs">
                  {filteredIssues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0EA5E9] whitespace-nowrap">
                        <Link to={`/admin/issues/${issue.id}`} className="hover:underline">
                          {issue.issue_number}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <Link to={`/admin/issues/${issue.id}`} className="font-bold text-[#1E2B37] hover:text-[#0EA5E9] line-clamp-1">
                          {issue.title}
                        </Link>
                        <div className="flex items-center space-x-2 text-[10px] text-[#64748B] mt-0.5">
                          <span className="font-medium">{issue.category}</span>
                          <span>•</span>
                          <span>{issue.city}, {issue.province}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 max-w-xs truncate">
                        {issue.institution_name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 font-semibold text-[10px] text-slate-700">
                          {issue.submission_type === 'STUDENT' ? 'Student' : 'Institution Rep'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {new Date(issue.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <IssueStatusBadge status={issue.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <Link
                            to={`/admin/issues/${issue.id}`}
                            className="p-1.5 rounded-lg border border-[#E2E8F0] text-slate-600 hover:text-[#0EA5E9] hover:bg-slate-50 transition-colors"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          {(issue.status === 'PENDING_VERIFICATION' || issue.status === 'REPORTED') && (
                            <>
                              <button
                                onClick={() => handleActionClick(issue, 'approve')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition-colors inline-flex items-center"
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleActionClick(issue, 'reject')}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 transition-colors inline-flex items-center"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Reject
                              </button>
                            </>
                          )}

                          {(issue.status === 'APPROVED' || issue.status === 'PUBLISHED') && (
                            <button
                              onClick={() => handleActionClick(issue, 'remove')}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 text-white font-bold text-[11px] hover:bg-slate-900 transition-colors inline-flex items-center"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Remove
                            </button>
                          )}

                          {(issue.status === 'REMOVED' || issue.status === 'REJECTED') && (
                            <button
                              onClick={() => handleActionClick(issue, 'restore')}
                              className="px-2.5 py-1 rounded-lg bg-[#0EA5E9] text-white font-bold text-[11px] hover:bg-sky-600 transition-colors inline-flex items-center"
                            >
                              <RotateCcw className="w-3 h-3 mr-1" />
                              Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Action Dialog */}
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
