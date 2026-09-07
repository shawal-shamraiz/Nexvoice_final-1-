import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Megaphone, PlusCircle, Search, ShieldCheck, ArrowRight, CheckCircle2, FileCheck } from 'lucide-react';
import { DataService } from '../lib/supabase';
import type { Issue } from '../types';
import { IssueCard } from '../components/IssueCard';
import { ReportModal } from '../components/ReportModal';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportingIssueId, setReportingIssueId] = useState<string | null>(null);

  useEffect(() => {
    const loadRecent = async () => {
      const data = await DataService.fetchIssues();
      setRecentIssues(data.slice(0, 3));
      setLoading(false);
    };
    loadRecent();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0F172A] via-[#0F172A] to-[#1E293B] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#1E293B] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#4F46E5_1px,transparent_1px)] [background-size:28px_28px] opacity-15"></div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center space-x-2 bg-[#1E293B] px-4 py-1.5 rounded-full border border-[#334155] shadow-lg text-xs font-semibold tracking-wide text-[#F8FAFC]">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Public Student Issue Platform • v1.0 MVP</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Your Voice <span className="text-[#818CF8]">Shouldn't Get Lost.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#94A3B8] max-w-2xl mx-auto font-normal leading-relaxed">
            NexVoice gives students and educational communities a simple way to raise academic concerns, make them visible, and help turn individual problems into meaningful action.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/raise-issue')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-base shadow-xl border border-indigo-400/20 transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            >
              <PlusCircle className="w-5 h-5 mr-2 text-[#10B981]" />
              Raise an Issue
            </button>

            <button
              onClick={() => navigate('/issues')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-[#0F172A] font-bold text-base shadow-lg border border-slate-200 transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              <Search className="w-5 h-5 mr-2 text-[#4F46E5]" />
              Explore Issues
            </button>
          </div>

          {/* Quick Concept Highlights */}
          <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800 text-left text-xs text-[#94A3B8]">
            <div className="flex items-start space-x-3 bg-white/5 p-4 rounded-2xl border border-white/5">
              <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white text-sm mb-0.5">No Account Required</strong>
                Raise an issue immediately without lengthy registration.
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-white/5 p-4 rounded-2xl border border-white/5">
              <ShieldCheck className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white text-sm mb-0.5">Private Verification</strong>
                ID cards stored securely in private storage bucket.
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-white/5 p-4 rounded-2xl border border-white/5">
              <FileCheck className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white text-sm mb-0.5">Unique Reference ID</strong>
                Receive a reference code like NV-2026-000001 for tracking.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs relative overflow-hidden">
          
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5]">Simple & Transparent Workflow</span>
            <h2 className="text-3xl font-black text-[#0F172A]">
              How NexVoice Empowers Educational Communities
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              NexVoice gives students and institution representatives a structured channel to report concerns regarding fees, exams, facilities, or policies.
            </p>

            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center font-bold text-sm">1</div>
                <h4 className="font-bold text-[#0F172A]">Select Identity Role</h4>
                <p className="text-xs text-slate-600">Choose Student or Institution Representative and upload ID verification.</p>
              </div>

              <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center font-bold text-sm">2</div>
                <h4 className="font-bold text-[#0F172A]">Detail Your Issue</h4>
                <p className="text-xs text-slate-600">Categorize your problem, specify institution location, and set anonymity preferences.</p>
              </div>

              <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center font-bold text-sm">3</div>
                <h4 className="font-bold text-[#0F172A]">Publish & Share</h4>
                <p className="text-xs text-slate-600">Get your reference ID and let the public community review your concern.</p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/how-it-works"
                className="inline-flex items-center text-sm font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
              >
                Learn more about privacy & verification guidelines
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Recent Issues Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[#4F46E5] font-semibold text-xs uppercase tracking-wider mb-1">
              <Megaphone className="w-4 h-4" />
              <span>Public Feed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              Recently Reported Issues
            </h2>
          </div>

          <Link
            to="/issues"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#4F46E5] text-[#4F46E5] font-bold text-sm transition-all shadow-2xs"
          >
            View All Issues
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-white animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : recentIssues.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <p className="text-slate-500 font-medium">No issues have been reported yet.</p>
            <button
              onClick={() => navigate('/raise-issue')}
              className="px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm transition-colors"
            >
              Be the first to raise an issue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onReportClick={(id) => setReportingIssueId(id)}
              />
            ))}
          </div>
        )}

      </section>

      {/* Report Modal */}
      {reportingIssueId && (
        <ReportModal
          issueId={reportingIssueId}
          isOpen={Boolean(reportingIssueId)}
          onClose={() => setReportingIssueId(null)}
        />
      )}

    </div>
  );
};
