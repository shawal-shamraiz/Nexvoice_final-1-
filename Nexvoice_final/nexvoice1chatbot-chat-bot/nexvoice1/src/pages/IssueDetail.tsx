import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Issue } from '../types';
import { DataService } from '../lib/supabase';
import { ReportModal } from '../components/ReportModal';
import { IssueCard } from '../components/IssueCard';
import { ArrowLeft, Building, MapPin, Calendar, ShieldCheck, Flag, CheckCircle2, User, Share2 } from 'lucide-react';

export const IssueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [similarIssues, setSimilarIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [reportModalIssueId, setReportModalIssueId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      loadIssue(id);
    }
  }, [id]);

  const loadIssue = async (issueId: string) => {
    setLoading(true);
    const data = await DataService.fetchIssueById(issueId);
    setIssue(data);
    setLoading(false);

    if (data) {
      setLoadingSimilar(true);
      try {
        const similar = await DataService.fetchSimilarIssues(data);
        setSimilarIssues(similar);
      } catch {
        setSimilarIssues([]);
      } finally {
        setLoadingSimilar(false);
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500 font-medium">Loading issue details...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-5 bg-white rounded-3xl border border-slate-200 shadow-sm my-12">
        <h2 className="text-2xl font-bold text-[#0F172A]">Issue Not Found</h2>
        <p className="text-sm text-slate-600">The requested reference ID does not exist or has been archived.</p>
        <Link
          to="/issues"
          className="inline-flex items-center px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-sm shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Explore
        </Link>
      </div>
    );
  }

  const isAnon = issue.is_anonymous;
  const publicDisplayName = isAnon
    ? issue.submission_type === 'STUDENT'
      ? 'Anonymous Student'
      : 'Anonymous Institution Representative'
    : issue.name;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Navigation & Share Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-[#0F172A] transition-colors focus:outline-none focus-visible:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <Share2 className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            {copied ? 'Link Copied!' : 'Share Issue'}
          </button>

          <button
            onClick={() => setReportModalIssueId(issue.id)}
            className="inline-flex items-center px-3.5 py-1.5 rounded-xl border border-rose-200 bg-white text-rose-600 text-xs font-semibold hover:bg-rose-50 transition-colors shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <Flag className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
            Report This Issue
          </button>
        </div>
      </div>

      {/* Main Issue Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8">
        
        {/* Header Badges */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-5 border-b border-slate-100">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20">
              {issue.issue_number}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-[#1E293B] border border-slate-200">
              {issue.category}
            </span>
            {issue.subcategory && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                {issue.subcategory}
              </span>
            )}
          </div>

          <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-[#10B981]" />
            Status: Published
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] leading-tight tracking-tight">
          {issue.title}
        </h1>

        {/* Meta Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#F8FAFC] text-xs border border-slate-200/80">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Institution</span>
            <span className="font-semibold text-[#0F172A] flex items-center">
              <Building className="w-3.5 h-3.5 mr-1.5 text-[#4F46E5] shrink-0" />
              <span className="truncate">{issue.institution_name}</span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Location</span>
            <span className="font-semibold text-slate-700 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#4F46E5]/80 shrink-0" />
              <span>{issue.city}, {issue.province}</span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Submitted By</span>
            <span className="font-semibold text-slate-700 flex items-center">
              <User className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
              <span className="truncate">{publicDisplayName}</span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Date Published</span>
            <span className="font-semibold text-slate-700 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
              <span>{new Date(issue.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </span>
          </div>
        </div>

        {/* Full Issue Description */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Detailed Concern</h3>
          <div className="text-slate-800 leading-relaxed text-base whitespace-pre-line bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            {issue.description}
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200 flex items-start space-x-3.5 text-xs">
          <ShieldCheck className="w-5 h-5 text-[#4F46E5] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block text-[#0F172A] font-bold text-sm">Verification Status: Pending</strong>
            <p className="text-slate-600 leading-relaxed">
              Identity document has been securely submitted to private storage. Physical identity verification check is pending processing. Sensitive verification files are permanently hidden from public APIs.
            </p>
          </div>
        </div>

        {/* Action strip at bottom of card */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 flex-wrap gap-3 text-xs">
          <span className="text-slate-400">
            Notice something incorrect or violating guidelines?
          </span>
          <button
            onClick={() => setReportModalIssueId(issue.id)}
            className="inline-flex items-center text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition-colors"
          >
            <Flag className="w-3.5 h-3.5 mr-1 text-rose-500" />
            Report this issue
          </button>
        </div>

      </div>

      {/* Similar Issues Section */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              Similar Issues
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Related community concerns categorized under {issue.category}
            </p>
          </div>
        </div>

        {loadingSimilar ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-white animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : similarIssues.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xs text-center space-y-2">
            <h3 className="text-base font-bold text-[#0F172A]">No similar issues found yet.</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              As more students raise concerns, related issues may appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarIssues.map((simIssue) => (
              <IssueCard
                key={simIssue.id}
                issue={simIssue}
                onReportClick={(reportedId) => setReportModalIssueId(reportedId)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Report Modal */}
      {reportModalIssueId && (
        <ReportModal
          issueId={reportModalIssueId}
          isOpen={Boolean(reportModalIssueId)}
          onClose={() => setReportModalIssueId(null)}
        />
      )}

    </div>
  );
};
