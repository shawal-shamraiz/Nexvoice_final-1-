import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Issue } from '../types';
import { DataService } from '../lib/supabase';
import { ReportModal } from '../components/ReportModal';
import { IssueCard } from '../components/IssueCard';
import { ReactionPicker } from '../components/ReactionPicker';
import { CommentsSection } from '../components/CommentsSection';
import { ArrowLeft, Building, MapPin, Calendar, ShieldCheck, Flag, CheckCircle2, User, Share2, Search } from 'lucide-react';

export const IssueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [similarIssues, setSimilarIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [reportModalState, setReportModalState] = useState<{ isOpen: boolean; issueId?: string; commentId?: string }>({
    isOpen: false,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setSimilarLoading(true);
    Promise.all([DataService.fetchIssueById(id), DataService.fetchSimilarIssues(id)])
      .then(([loadedIssue, relatedIssues]) => {
        if (!active) return;
        setIssue(loadedIssue);
        setSimilarIssues(relatedIssues);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
        setSimilarLoading(false);
      });
    return () => { active = false; };
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500 font-medium">Loading issue details…</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4 bg-white rounded-3xl border border-slate-200 shadow-sm my-10">
        <h2 className="text-2xl font-bold text-[#1E293B]">Issue Not Found</h2>
        <p className="text-sm text-slate-600">The requested reference ID does not exist or has been archived.</p>
        <Link to="/issues" className="inline-flex items-center px-5 py-2.5 rounded-xl bg-[#4F46E5] text-white font-bold text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
        </Link>
      </div>
    );
  }

  const publicDisplayName = issue.is_anonymous
    ? issue.submission_type === 'STUDENT' ? 'Anonymous Student' : 'Anonymous Institution Representative'
    : issue.name;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-[#1E293B] transition-colors self-start">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handleShare} className="inline-flex items-center px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50">
            <Share2 className="w-3.5 h-3.5 mr-1.5" /> {copied ? 'Link Copied!' : 'Share Issue'}
          </button>
          <button
            onClick={() => setReportModalState({ isOpen: true, issueId: issue.id })}
            className="inline-flex items-center px-3.5 py-2 rounded-lg border border-indigo-200 text-[#4F46E5] text-xs font-semibold hover:bg-indigo-50"
          >
            <Flag className="w-3.5 h-3.5 mr-1.5" /> Report Issue
          </button>
        </div>
      </div>

      <article className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-100">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-indigo-50 text-[#4F46E5] border border-indigo-100">{issue.issue_number}</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-[#1E293B]">{issue.category}</span>
            {issue.subcategory && <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">{issue.subcategory}</span>}
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-[#10B981]" /> Status: Published</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] leading-tight">{issue.title}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 text-xs border border-slate-100">
          <div><span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Institution</span><span className="font-semibold text-[#1E293B] flex items-center"><Building className="w-3.5 h-3.5 mr-1 text-[#4F46E5]" />{issue.institution_name}</span></div>
          <div><span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Location</span><span className="font-semibold text-slate-700 flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-[#10B981]" />{issue.city}, {issue.province}</span></div>
          <div><span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Submitted By</span><span className="font-semibold text-slate-700 flex items-center"><User className="w-3.5 h-3.5 mr-1 text-slate-500" />{publicDisplayName}</span></div>
          <div><span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Date Published</span><span className="font-semibold text-slate-700 flex items-center"><Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />{new Date(issue.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
        </div>

        <div className="space-y-2 pt-2">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Detailed Concern</h2>
          <div className="text-slate-800 leading-relaxed text-base whitespace-pre-line bg-white p-6 rounded-2xl border border-slate-200">{issue.description}</div>
        </div>

        <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-100 flex items-start space-x-3 text-xs">
          <ShieldCheck className="w-5 h-5 text-[#4F46E5] shrink-0 mt-0.5" />
          <div className="space-y-1"><strong className="block text-[#1E293B] font-bold text-sm">Verification Status: Verified</strong><p className="text-slate-600">Identity verification is handled through private storage. Sensitive verification files and private identity data are never shown on public issue pages.</p></div>
        </div>

        {/* Reaction Picker Section */}
        <ReactionPicker issueId={issue.id} />
      </article>

      {/* Similar Issues Section */}
      <section aria-labelledby="similar-issues-heading" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#10B981]">Discover related concerns</p>
            <h2 id="similar-issues-heading" className="mt-1 text-2xl font-black text-[#1E293B]">Similar Issues</h2>
          </div>
          <Search className="hidden sm:block w-6 h-6 text-indigo-200" aria-hidden="true" />
        </div>
        {similarLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Finding related public issues…</div>
        ) : similarIssues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {similarIssues.map((relatedIssue) => <IssueCard key={relatedIssue.id} issue={relatedIssue} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h3 className="font-bold text-[#1E293B]">No similar issues found yet.</h3>
            <p className="mt-1 text-sm text-slate-500">As more students raise concerns, related issues will automatically appear here.</p>
          </div>
        )}
      </section>

      {/* Comments Section */}
      <CommentsSection
        issueId={issue.id}
        onReportComment={(commentId) => setReportModalState({ isOpen: true, commentId })}
      />

      <ReportModal
        issueId={reportModalState.issueId}
        commentId={reportModalState.commentId}
        isOpen={reportModalState.isOpen}
        onClose={() => setReportModalState({ isOpen: false })}
      />
    </div>
  );
};
