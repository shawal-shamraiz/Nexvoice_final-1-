// NexVoice Verified Thread style: the public filing process is explained through calm linen records, cyan wayfinding, and purposeful motion.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, ChevronDown, ChevronUp, PlusCircle, Rocket, Shield, Sparkles, Star, Zap } from 'lucide-react';
import { AnimatedCard } from '../components/AnimatedCard';
import { Typewriter } from '../components/Typewriter';

const steps = [
  { number: '01', title: 'File the concern', description: 'Use the streamlined issue form to document an academic concern as a student or institution representative.', icon: Rocket },
  { number: '02', title: 'Provide verification', description: 'Upload a student ID or employee identification document. Files up to 5 MB in JPG, PNG, or PDF are supported.', icon: Shield },
  { number: '03', title: 'Review the record', description: 'Confirm the issue title, category, description, and anonymity choice before publication.', icon: Star },
  { number: '04', title: 'Receive a reference', description: 'A unique reference number is issued when the record is published to the public register.', icon: Award },
  { number: '05', title: 'Build visibility', description: 'Other community members can discover, filter, and share the record, helping a verified issue reach the right audience.', icon: Zap },
];

export const HowItWorks: React.FC = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      <header className="grid gap-6 animate-fade-in md:grid-cols-[minmax(0,1fr)_15rem] md:items-end">
        <div className="space-y-3 text-left">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0EA5E9]"><Sparkles className="h-4 w-4" />Registry field guide</span>
          <h1 className="text-3xl font-black text-[#1A1A1A] sm:text-4xl">How a <span className="text-[#0EA5E9]">NexVoice</span> record moves</h1>
          <p className="min-h-6 max-w-xl text-sm text-[#64748B]"><Typewriter words={['Evidence creates the record.', 'Verification protects the process.', 'Visibility supports accountability.', 'Communities move when issues are traceable.']} speed={80} delay={2500} className="font-semibold text-[#0EA5E9]" /></p>
        </div>
        <aside className="rounded-2xl border border-[#E2E8F0] bg-white p-4 card-shadow"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0EA5E9]">Reference pathway</span><div className="mt-2 font-mono text-sm font-bold text-[#1E2B37]">NV / FILE / VERIFY</div><div className="mt-3 flex items-center gap-2 text-xs text-[#64748B]"><span className="h-2 w-2 rounded-full bg-[#14B8A6] animate-pulse" />Private evidence, public record</div></aside>
      </header>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isExpanded = expandedStep === index;
          return (
            <AnimatedCard key={step.number} animation="fade-in-up" delay={index * 100} hoverEffect={isExpanded ? 'glow' : 'lift'} className={`rounded-3xl border bg-white card-shadow ${isExpanded ? 'border-[#0EA5E9]/50' : 'border-[#E2E8F0]'}`}>
              <button type="button" onClick={() => setExpandedStep(isExpanded ? null : index)} aria-expanded={isExpanded} className="flex w-full items-start gap-5 p-6 text-left">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0EA5E9] text-white shadow-md"><Icon className="h-6 w-6" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4"><div><span className="text-xs font-bold tracking-widest text-[#0EA5E9]">{step.number}</span><h2 className="text-lg font-bold text-[#1A1A1A]">{step.title}</h2></div><span className="rounded-lg p-1 text-[#94A3B8] transition-transform hover:scale-110 hover:text-[#0EA5E9]">{isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}</span></div>
                  <div className={`grid transition-[grid-template-rows,margin] duration-300 ${isExpanded ? 'mt-3 grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}><div className="overflow-hidden"><p className="text-sm leading-relaxed text-[#64748B]">{step.description}</p></div></div>
                </div>
              </button>
            </AnimatedCard>
          );
        })}
      </div>

      <AnimatedCard animation="fade-in-up" delay={500} hoverEffect="glow" className="space-y-4 rounded-3xl border border-[#0EA5E9]/30 bg-gradient-to-br from-[#1E2B37] to-[#263946] p-8 text-white">
        <div className="flex items-center gap-3"><Shield className="h-6 w-6 text-[#0EA5E9]" /><h2 className="text-xl font-bold">Privacy and verification safeguards</h2></div>
        <p className="text-sm leading-relaxed text-slate-300">Identity verification helps prevent spam and protect the integrity of the public register. Uploaded ID documents are stored in the private <code className="rounded bg-white/10 px-1.5 py-0.5">identity-documents</code> bucket and are not exposed on public issue cards, detail pages, or public API responses.</p>
        <div className="flex items-center gap-2 text-xs text-slate-300"><Sparkles className="h-3 w-3 text-[#0EA5E9]" />Private storage for verification material</div>
      </AnimatedCard>

      <div className="pt-4 text-center animate-fade-in-up delay-700"><Link to="/raise-issue" className="inline-flex items-center rounded-xl bg-[#0EA5E9] px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.03] hover:bg-sky-500 hover:shadow-[0_0_30px_rgba(14,165,233,0.3)] active:scale-[0.97]"><PlusCircle className="mr-2 h-4 w-4" />File an issue</Link></div>
    </div>
  );
};

export default HowItWorks;
