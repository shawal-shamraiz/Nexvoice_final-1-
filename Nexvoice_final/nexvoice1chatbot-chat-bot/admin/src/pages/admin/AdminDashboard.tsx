import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatCard } from '../../components/admin/StatCard';
import { AdminService } from '../../services/adminService';
import { IssueStatusBadge } from '../../components/admin/IssueStatusBadge';
import { AdminEmptyState } from '../../components/admin/AdminEmptyState';
import { AdminLoadingState } from '../../components/admin/AdminLoadingState';
import type { Issue, DashboardStats } from '../../types';
import { FileText, Clock, CheckCircle2, XCircle, Trash2, ArrowRight, MessageSquare, Heart, Flag, ThumbsUp, Building2, MapPin, RefreshCw } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPending, setRecentPending] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    else setRefreshing(true);

    try {
      const [statsData, allIssues] = await Promise.all([
        AdminService.fetchDashboardStats(),
        AdminService.fetchAllIssues(),
      ]);

      setStats(statsData);
      setRecentPending(allIssues.filter((i) => i.status === 'PENDING_VERIFICATION').slice(0, 5));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData(true);

    const onFocus = () => loadDashboardData(false);
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [loadDashboardData]);

  if (loading || !stats) {
    return (
      <AdminLayout>
        <AdminLoadingState message="Loading live database analytics & metrics..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#1E2B37]">Admin Moderation & Analytics</h1>
            <p className="text-xs text-[#64748B] mt-1">
              Live database analytics, community reaction metrics, and content moderation.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => loadDashboardData(false)}
              disabled={refreshing}
              className="inline-flex items-center px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold shadow-xs hover:bg-slate-50 transition-all disabled:opacity-50"
              title="Refetch live database stats"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
            <Link
              to="/admin/reports"
              className="inline-flex items-center px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-xs font-bold shadow-xs hover:bg-amber-100 transition-all"
            >
              <Flag className="w-3.5 h-3.5 mr-1.5" />
              Report Center ({stats.pendingReports})
            </Link>
            <Link
              to="/admin/issues"
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-[#0EA5E9] text-white text-xs font-bold shadow-xs hover:bg-sky-600 transition-all"
            >
              Moderation Queue
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Submissions"
            value={stats.totalIssues}
            icon={FileText}
            color="text-[#1E2B37]"
            bgColor="bg-slate-100"
            description="Lifetime student filings"
          />
          <StatCard
            label="Pending Verification"
            value={stats.pendingVerification}
            icon={Clock}
            color="text-amber-700"
            bgColor="bg-amber-50"
            description="Requires moderation review"
          />
          <StatCard
            label="Approved & Published"
            value={stats.approved}
            icon={CheckCircle2}
            color="text-emerald-700"
            bgColor="bg-emerald-50"
            description="Publicly visible concerns"
          />
          <StatCard
            label="Pending Content Reports"
            value={stats.pendingReports}
            icon={Flag}
            color="text-rose-700"
            bgColor="bg-rose-50"
            description="Flagged issues or comments"
          />
        </div>

        {/* Secondary Social Engagement Metrics Grid (Live Database SQL Aggregation) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Community Reactions"
            value={stats.totalReactions}
            icon={Heart}
            color="text-rose-600"
            bgColor="bg-rose-50/60"
            description="Live public.issue_reactions rows"
          />
          <StatCard
            label="Student Comments"
            value={stats.totalComments}
            icon={MessageSquare}
            color="text-indigo-600"
            bgColor="bg-indigo-50/60"
            description="Live public.issue_comments count"
          />
          <StatCard
            label="Rejected Submissions"
            value={stats.rejected}
            icon={XCircle}
            color="text-slate-600"
            bgColor="bg-slate-100"
            description="Declined during moderation"
          />
          <StatCard
            label="Removed Issues"
            value={stats.removed}
            icon={Trash2}
            color="text-slate-500"
            bgColor="bg-slate-100"
            description="Unpublished by admin"
          />
        </div>

        {/* Analytics Breakdown & Top Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Supported Issues (Reactions SQL Aggregation for Approved Issues) */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <h2 className="text-base font-bold text-[#1E2B37] flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-2 text-[#0EA5E9]" />
                  Most Supported Issues
                </h2>
                <p className="text-xs text-[#64748B]">Approved public issues ranked by reactions</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-[#0EA5E9]">SQL Aggregation</span>
            </div>

            {stats.mostSupportedIssues.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">No approved public issues recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {stats.mostSupportedIssues.map((item, idx) => (
                  <div key={item.id} className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#FAF9F6] flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[11px] font-bold text-slate-500">#{idx + 1}</span>
                        <span className="font-mono text-xs font-bold text-[#0EA5E9]">{item.issue_number}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">{item.category}</span>
                      </div>
                      <h3 className="text-xs font-bold text-[#1E2B37] line-clamp-1">{item.title}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                        👍 {item.reactionsCount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Most Commented Issues (Comments SQL Aggregation for Approved Issues) */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <h2 className="text-base font-bold text-[#1E2B37] flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-indigo-600" />
                  Most Commented Issues
                </h2>
                <p className="text-xs text-[#64748B]">Approved public issues ranked by comments</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">SQL Aggregation</span>
            </div>

            {stats.mostCommentedIssues.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">No approved public issues recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {stats.mostCommentedIssues.map((item, idx) => (
                  <div key={item.id} className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#FAF9F6] flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[11px] font-bold text-slate-500">#{idx + 1}</span>
                        <span className="font-mono text-xs font-bold text-indigo-600">{item.issue_number}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">{item.category}</span>
                      </div>
                      <h3 className="text-xs font-bold text-[#1E2B37] line-clamp-1">{item.title}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                        💬 {item.commentsCount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Geographic & Categorical Distribution Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#1E2B37]">Submissions by Category</h2>
            {stats.categoryDistribution.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">No category data available yet.</p>
            ) : (
              <div className="space-y-2.5">
                {stats.categoryDistribution.map((cat) => {
                  const pct = stats.totalIssues > 0 ? Math.round((cat.count / stats.totalIssues) * 100) : 0;
                  return (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-[#1E2B37]">
                        <span>{cat.name}</span>
                        <span className="text-slate-500">{cat.count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#0EA5E9] h-full rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Province Distribution */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#1E2B37] flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
              Submissions by Province
            </h2>
            {stats.provinceDistribution.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">No province data available yet.</p>
            ) : (
              <div className="space-y-2.5">
                {stats.provinceDistribution.map((prov) => {
                  const pct = stats.totalIssues > 0 ? Math.round((prov.count / stats.totalIssues) * 100) : 0;
                  return (
                    <div key={prov.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-[#1E2B37]">
                        <span>{prov.name}</span>
                        <span className="text-slate-500">{prov.count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Pending Verification Queue */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#1E2B37]">Pending Verification Queue</h2>
              <p className="text-xs text-[#64748B]">Submissions awaiting administrative verification & review</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-mono text-xs font-bold border border-amber-200">
              {stats.pendingVerification} pending
            </span>
          </div>

          {recentPending.length === 0 ? (
            <AdminEmptyState
              title="No Pending Issues"
              description="There are currently no pending student submissions requiring moderation."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentPending.map((issue) => (
                <div key={issue.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FAF9F6] space-y-2 hover:border-[#0EA5E9]/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#0EA5E9]">{issue.issue_number}</span>
                    <IssueStatusBadge status={issue.status} size="sm" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1E2B37] line-clamp-1">{issue.title}</h3>
                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <span className="flex items-center"><Building2 className="w-3 h-3 mr-1 text-slate-400" />{issue.institution_name}</span>
                    <Link to={`/admin/issues/${issue.id}`} className="font-semibold text-[#0EA5E9] hover:underline">
                      Review Issue →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
