// NexVoice Verified Thread style: each issue is presented as a readable public record with clear status and provenance.
import type { Issue } from '../types';
import { ArrowUpRight, Building, Calendar, FileText, Flag, MapPin, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedCard } from './AnimatedCard';
import { StatusBadge, type StatusType } from './StatusBadge';

interface IssueCardProps {
  issue: Issue;
  onReportClick?: (issueId: string) => void;
  animationDelay?: number;
}

const toStatusBadge = (status: string): StatusType => {
  if (status === 'PUBLISHED') return 'PUBLISHED';
  if (status === 'REPORTED') return 'REPORTED';
  if (status === 'ARCHIVED') return 'ARCHIVED';
  if (status === 'RESOLVED') return 'RESOLVED';
  if (status === 'UNDER_REVIEW') return 'UNDER_REVIEW';
  return 'PENDING_VERIFICATION';
};

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onReportClick, animationDelay = 0 }) => {
  const displayName = issue.is_anonymous
    ? issue.submission_type === 'STUDENT' ? 'Anonymous student' : 'Anonymous institution representative'
    : issue.name;

  const formatDate = (dateStr: string) => {
    try { return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return dateStr; }
  };

  return (
    <AnimatedCard animation="fade-in-up" delay={animationDelay} hoverEffect="lift" className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white card-shadow">
      <article className="flex min-h-full flex-col justify-between">
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[#0EA5E9]/20 bg-[#0EA5E9]/10 px-2.5 py-1 font-mono text-xs font-bold text-[#0EA5E9]"><FileText className="h-3 w-3" />{issue.issue_number}</span>
              <span className="rounded-full border border-[#E2E8F0] bg-[#FAF9F6] px-2.5 py-1 text-xs font-semibold text-[#1A1A1A]">{issue.category}</span>
            </div>
            <StatusBadge status={toStatusBadge(issue.status)} size="sm" />
          </div>

          <h3 className="line-clamp-2 text-lg font-bold text-[#1A1A1A] transition-colors hover:text-[#0EA5E9]"><Link to={`/issues/${issue.id}`}>{issue.title}</Link></h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-[#64748B]">{issue.description}</p>

          <div className="space-y-1.5 border-t border-[#E2E8F0] pt-3 text-xs text-[#64748B]">
            <div className="flex items-center font-medium text-[#1A1A1A]"><Building className="mr-1.5 h-3.5 w-3.5 shrink-0 text-[#0EA5E9]" /><span className="truncate">{issue.institution_name}</span></div>
            <div className="flex items-center justify-between gap-2"><span className="flex min-w-0 items-center"><MapPin className="mr-1.5 h-3.5 w-3.5 shrink-0 text-[#14B8A6]" /><span className="truncate">{issue.city}, {issue.province}</span></span><span className="flex shrink-0 items-center text-[#94A3B8]"><Calendar className="mr-1 h-3.5 w-3.5" />{formatDate(issue.created_at)}</span></div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#E2E8F0] bg-[#FAF9F6] px-6 py-3 text-xs">
          <div className="flex min-w-0 items-center gap-2 text-[#64748B]"><span className="inline-flex shrink-0 items-center rounded border border-[#E2E8F0] bg-white px-2 py-0.5 text-[11px]"><ShieldCheck className="mr-1 h-3 w-3 text-[#0EA5E9]" />Verification pending</span><span className="truncate text-[11px] italic text-[#94A3B8]">· {displayName}</span></div>
          <div className="flex shrink-0 items-center gap-3">
            {onReportClick && <button type="button" onClick={() => onReportClick(issue.id)} className="rounded p-1 text-[#94A3B8] transition-all hover:scale-110 hover:text-rose-600" title="Report issue" aria-label={`Report ${issue.title}`}><Flag className="h-3.5 w-3.5" /></button>}
            <Link to={`/issues/${issue.id}`} className="group inline-flex items-center font-semibold text-[#0EA5E9] transition-colors hover:text-[#1E2B37]">View record<ArrowUpRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
          </div>
        </div>
      </article>
    </AnimatedCard>
  );
};
