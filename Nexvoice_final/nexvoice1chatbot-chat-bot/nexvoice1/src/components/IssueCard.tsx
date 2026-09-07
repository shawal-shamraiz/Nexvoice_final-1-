import React from 'react';
import type { Issue } from '../types';
import { MapPin, Building, Calendar, ShieldCheck, Flag, CheckCircle2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface IssueCardProps {
  issue: Issue;
  onReportClick?: (issueId: string) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onReportClick }) => {
  const isAnon = issue.is_anonymous;
  const displayName = isAnon
    ? issue.submission_type === 'STUDENT'
      ? 'Anonymous Student'
      : 'Anonymous Institution Representative'
    : issue.name;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-6 space-y-4">
        
        {/* Header Badge Strip */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20 font-mono">
              {issue.issue_number}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-[#1E293B] border border-slate-200">
              {issue.category}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 mr-1 text-[#10B981]" />
              Published
            </span>
          </div>
        </div>

        {/* Issue Title */}
        <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors line-clamp-2">
          <Link to={`/issues/${issue.id}`} className="focus:outline-none focus-visible:underline">
            {issue.title}
          </Link>
        </h3>

        {/* Short Description snippet */}
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {issue.description}
        </p>

        {/* Institution & Location details */}
        <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
          <div className="flex items-center text-slate-700 font-medium">
            <Building className="w-3.5 h-3.5 mr-1.5 text-[#4F46E5] shrink-0" />
            <span className="truncate">{issue.institution_name}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#4F46E5]/80 shrink-0" />
              <span>{issue.city}, {issue.province}</span>
            </div>
            
            <div className="flex items-center text-slate-400">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              <span>{formatDate(issue.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="bg-slate-50/80 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
        
        {/* Verification & Anon status pill */}
        <div className="flex items-center space-x-2 text-slate-600">
          <span className="inline-flex items-center text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
            <ShieldCheck className="w-3 h-3 mr-1 text-[#4F46E5]" />
            Verification pending
          </span>
          <span className="text-[11px] text-slate-500 italic max-w-[120px] truncate">
            • {displayName}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {onReportClick && (
            <button
              onClick={() => onReportClick(issue.id)}
              className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-500"
              title="Report Issue"
              aria-label="Report Issue"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          )}

          <Link
            to={`/issues/${issue.id}`}
            className="inline-flex items-center font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors focus:outline-none focus-visible:underline"
          >
            View Details
            <Eye className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
