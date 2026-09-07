// NexVoice Verified Thread style: a midnight civic header gives way to linen public-record surfaces and cyan actions.
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Award, CheckCircle2, Clock, FileCheck, Megaphone, PlusCircle, Rocket, Search, ShieldCheck, Sparkles, Star, TrendingUp, Users, Zap } from 'lucide-react';
import { DataService } from '../lib/supabase';
import type { Issue } from '../types';
import { AnimatedCard } from '../components/AnimatedCard';
import { IssueCard } from '../components/IssueCard';
import { ReportModal } from '../components/ReportModal';
import { Typewriter } from '../components/Typewriter';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportingIssueId, setReportingIssueId] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, provinces: 0 });

  useEffect(() => {
    const loadRecent = async () => {
      const data = await DataService.fetchIssues();
      setRecentIssues(data.slice(0, 3));
      setStats({
        total: data.length,
        provinces: new Set(data.map((issue) => issue.province)).size,
      });
      setLoading(false);
    };

    void loadRecent();
  }, []);

  const statItems = [
    { icon: TrendingUp, value: `${stats.total}+`, label: 'Records published', color: '#0EA5E9' },
    { icon: Users, value: stats.provinces, label: 'Regions represented', color: '#14B8A6' },
    { icon: Clock, value: '5 min', label: 'To file a record', color: '#F59E0B' },
  ];

  const workflow = [
    { number: '01', title: 'Select your role', description: 'Choose student or institution representative and prepare verification.', icon: Rocket },
    { number: '02', title: 'Detail the issue', description: 'Add the category, location, context, and any anonymity preference.', icon: Star },
    { number: '03', title: 'Publish the record', description: 'Receive a reference code and make the issue visible to the community.', icon: Award },
  ];

  return (
    <div className="space-y-16 pb-16">
      <section className="relative overflow-hidden border-b border-[#0EA5E9]/20 bg-gradient-to-br from-[#1E2B37] via-[#1E2B37] to-[#2A3A48] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#0EA5E9_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.08]" />
        <div className="absolute right-1/4 top-1/4 h-96 w-96 rounded-full bg-[#0EA5E9]/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-[#14B8A6]/10 blur-2xl animate-float" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <div className="space-y-8 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0EA5E9]/30 bg-[#0EA5E9]/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#FAF9F6] shadow-lg animate-pop-in">
            <Sparkles className="h-4 w-4 text-[#0EA5E9]" />
            <span>Public Issue Registry · Student Accountability</span>
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl animate-fade-in-up delay-100">
            Make the record. <span className="text-[#0EA5E9]">Move the issue.</span>
          </h1>

          <p className="min-h-[4.5rem] max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl animate-fade-in-up delay-200">
            <Typewriter
              words={[
                'File an academic concern in a public record built for student accountability.',
                'Give a verified issue the clarity and visibility it needs to move forward.',
                'Clear evidence. Private verification. Public accountability.',
              ]}
              speed={60}
              delay={3000}
              className="text-[#FAF9F6]"
            />
          </p>

          <div className="flex flex-col items-start justify-start gap-4 pt-4 sm:flex-row animate-fade-in-up delay-300">
            <button onClick={() => navigate('/raise-issue')} className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-[#0EA5E9] px-8 py-4 text-base font-bold text-white shadow-xl transition-all hover:scale-[1.03] hover:bg-sky-500 hover:shadow-[0_0_40px_rgba(14,165,233,0.3)] active:scale-[0.97] sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" /> File an issue
            </button>
            <button onClick={() => navigate('/issues')} className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:scale-[1.03] hover:bg-white/20 active:scale-[0.97] sm:w-auto">
              <Search className="mr-2 h-5 w-5" /> Explore records
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-white/10 pt-10 text-left text-sm text-slate-300 sm:grid-cols-3 animate-fade-in-up delay-400">
            {statItems.map(({ icon: Icon, value, label, color }, index) => (
              <AnimatedCard key={label} animation="scale-in" delay={400 + index * 100} hoverEffect="lift" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}28` }}><Icon className="h-5 w-5" style={{ color }} /></div>
                <div><div className="text-xl font-bold text-white">{value}</div><div className="text-xs text-slate-300">{label}</div></div>
              </AnimatedCard>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 text-left text-xs text-slate-300 sm:grid-cols-3 animate-fade-in-up delay-500">
            {[
              { icon: CheckCircle2, title: 'No account required', description: 'Create a public record without a lengthy registration.', color: '#14B8A6' },
              { icon: ShieldCheck, title: 'Private verification', description: 'Identity documents remain outside the public record.', color: '#0EA5E9' },
              { icon: FileCheck, title: 'Traceable reference', description: 'Use a unique reference code to follow the issue.', color: '#F59E0B' },
            ].map(({ icon: Icon, title, description, color }) => (
              <div key={title} className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:scale-[1.02] hover:bg-white/10">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 transition-transform group-hover:scale-110" style={{ color }} />
                <div><strong className="mb-0.5 block text-sm text-white">{title}</strong>{description}</div>
              </div>
            ))}
          </div>
          </div>

          <aside className="relative overflow-hidden rounded-2xl border border-[#0EA5E9]/30 bg-[#1E2B37]/80 p-5 text-left shadow-2xl backdrop-blur-sm animate-slide-in-right">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#0EA5E9]/10 blur-2xl" />
            <div className="relative space-y-5">
              <div><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0EA5E9]">Registry filing desk</span><p className="mt-2 font-mono text-sm font-bold text-white">NV-2026-000001</p></div>
              <div className="space-y-3 border-y border-white/10 py-4 text-xs"><div className="flex justify-between gap-3"><span className="text-slate-400">Record state</span><span className="font-semibold text-[#10B981]">Published</span></div><div className="flex justify-between gap-3"><span className="text-slate-400">Verification</span><span className="font-semibold text-white">Private</span></div><div className="flex justify-between gap-3"><span className="text-slate-400">Access</span><span className="font-semibold text-white">Public register</span></div></div>
              <p className="text-xs leading-relaxed text-slate-300">A concise public record gives each academic concern a stable reference, a clear status, and a constructive path to visibility.</p>
            </div>
          </aside>
        </div>
      </section>

      <AnimatedCard animation="fade-in-up" delay={200} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white p-8 card-shadow transition-shadow hover:shadow-xl sm:p-12">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#0EA5E9]/5 blur-2xl animate-pulse-glow" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0EA5E9]"><Zap className="h-4 w-4" />Clear filing process</span>
            <h2 className="text-3xl font-black text-[#1A1A1A]">How <span className="text-[#0EA5E9]">NexVoice</span> turns concerns into public records</h2>
            <p className="text-sm leading-relaxed text-[#64748B] sm:text-base">NexVoice gives students and institution representatives a structured channel for documenting concerns about fees, exams, facilities, and policies.</p>
            <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-3">
              {workflow.map(({ number, title, description, icon: Icon }, index) => (
                <AnimatedCard key={number} animation="scale-in" delay={300 + index * 150} hoverEffect="lift" className="rounded-2xl border border-[#E2E8F0] bg-[#FAF9F6] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0EA5E9] text-sm font-bold text-white"><Icon className="h-5 w-5" /></div>
                  <span className="mt-3 block text-[11px] font-bold tracking-widest text-[#0EA5E9]">{number}</span>
                  <h3 className="font-bold text-[#1A1A1A]">{title}</h3>
                  <p className="mt-1 text-xs text-[#64748B]">{description}</p>
                </AnimatedCard>
              ))}
            </div>
            <div className="pt-4"><Link to="/how-it-works" className="group inline-flex items-center text-sm font-bold text-[#0EA5E9] transition-colors hover:text-[#1E2B37]">Review privacy and verification guidance<ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></div>
          </div>
        </section>
      </AnimatedCard>

      <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end animate-fade-in-up">
          <div><div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0EA5E9]"><Megaphone className="h-4 w-4" />Public issue register</div><h2 className="text-2xl font-black text-[#1A1A1A] sm:text-3xl">Recently filed records</h2></div>
          <Link to="/issues" className="group inline-flex items-center rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-bold text-[#0EA5E9] card-shadow transition-all hover:border-[#0EA5E9] hover:shadow-lg">View all records<ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-64 rounded-2xl border border-[#E2E8F0] animate-shimmer" />)}</div>
        ) : recentIssues.length === 0 ? (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center card-shadow animate-fade-in"><p className="font-medium text-[#64748B]">No public records have been filed yet.</p><button onClick={() => navigate('/raise-issue')} className="mt-4 rounded-xl bg-[#0EA5E9] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.03] hover:bg-sky-500 active:scale-[0.97]">File the first issue</button></div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">{recentIssues.map((issue, index) => <IssueCard key={issue.id} issue={issue} animationDelay={index * 100} onReportClick={setReportingIssueId} />)}</div>
        )}
      </section>

      {reportingIssueId && <ReportModal issueId={reportingIssueId} isOpen={Boolean(reportingIssueId)} onClose={() => setReportingIssueId(null)} />}
    </div>
  );
};
