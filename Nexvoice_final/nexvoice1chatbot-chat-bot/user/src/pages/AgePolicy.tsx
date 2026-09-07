import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, HeartHandshake, UserCheck, Mail, FileText, Lock } from 'lucide-react';

export const AgePolicy: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <header className="space-y-4 text-center">
        <div className="inline-flex items-center space-x-2 rounded-full border border-[#0EA5E9]/30 bg-[#0EA5E9]/10 px-3.5 py-1.5 text-xs font-bold text-[#0EA5E9]">
          <GraduationCap className="h-4 w-4" />
          <span>Student & Guardian Protections</span>
        </div>
        <h1 className="text-3xl font-black text-[#1E2B37] sm:text-4xl">
          Student Age & Guardian Policy
        </h1>
        <p className="text-sm text-[#64748B]">
          Last Updated: September 2026 · NexVoice Student Voice Platform
        </p>
      </header>

      {/* Main Content Document Container */}
      <article className="space-y-8 rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:p-10 card-shadow text-sm leading-relaxed text-[#1E2B37]">
        
        {/* Section 1: Introduction & Purpose */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E2B37] flex items-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0EA5E9] text-white text-xs font-black mr-2.5">1</span>
            Purpose of this Policy
          </h2>
          <p className="text-[#64748B]">
            NexVoice is designed specifically for students, educators, and academic communities across schools, colleges, vocational institutes, and universities. Because student communities include individuals of varying ages—including minors—this policy outlines expected standards, guardian involvement, and safety measures.
          </p>
        </section>

        {/* Section 2: Guidance for Minors & Students */}
        <section className="space-y-3 border-t border-[#E2E8F0] pt-6">
          <h2 className="text-lg font-bold text-[#1E2B37] flex items-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0EA5E9] text-white text-xs font-black mr-2.5">2</span>
            Guidance for Minor Students
          </h2>
          <p className="text-[#64748B]">
            We encourage all students to participate responsibly in filing educational concerns:
          </p>
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FAF9F6] space-y-1">
              <strong className="text-[#1E2B37] font-bold text-sm flex items-center">
                <HeartHandshake className="w-4 h-4 mr-1.5 text-[#0EA5E9]" /> Parent or Guardian Involvement
              </strong>
              <p className="text-[#64748B]">
                Students who are minors are strongly encouraged to involve a parent, legal guardian, or trusted educational advisor when documenting official academic concerns.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FAF9F6] space-y-1">
              <strong className="text-[#1E2B37] font-bold text-sm flex items-center">
                <UserCheck className="w-4 h-4 mr-1.5 text-[#14B8A6]" /> Respect Third-Party Privacy
              </strong>
              <p className="text-[#64748B]">
                Students must not submit personal information, phone numbers, addresses, or identity documents belonging to classmates, minors, or other individuals without explicit permission.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Guardian Concerns & Contact Protocol */}
        <section className="space-y-3 border-t border-[#E2E8F0] pt-6">
          <h2 className="text-lg font-bold text-[#1E2B37] flex items-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0EA5E9] text-white text-xs font-black mr-2.5">3</span>
            Guardian Concerns & Content Moderation
          </h2>
          <p className="text-[#64748B]">
            Parents or legal guardians who believe that published content involving a minor is inaccurate, inappropriate, or exposes private personal information can request immediate review:
          </p>
          <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-5 space-y-3 text-xs text-sky-950">
            <span className="font-bold text-[#0EA5E9] text-sm block">How Guardians Can Reach Us:</span>
            <ul className="list-disc pl-5 space-y-1.5 text-[#64748B]">
              <li>
                <strong>Content Report Button:</strong> Click the <strong className="text-rose-600">Report Flag</strong> icon on any public issue card or comment to submit a moderation request.
              </li>
              <li>
                <strong>Direct Contact Register:</strong> Submit a inquiry through our <Link to="/contact" className="text-[#0EA5E9] font-bold underline">Contact Page</Link> describing the concern.
              </li>
            </ul>
            <p className="text-xs text-[#64748B] pt-1">
              NexVoice administrators prioritize moderation inquiries involving minors or sensitive student safety concerns.
            </p>
          </div>
        </section>

        {/* Section 4: Administrative Precautions */}
        <section className="space-y-3 border-t border-[#E2E8F0] pt-6">
          <h2 className="text-lg font-bold text-[#1E2B37] flex items-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0EA5E9] text-white text-xs font-black mr-2.5">4</span>
            Platform Moderation Safeguards
          </h2>
          <p className="text-[#64748B]">
            NexVoice administrators take additional moderation precautions when content involves sensitive situations or minor students. Administrators reserve the right to remove non-compliant issues, edit descriptions to redact private details, or unpublish content that violates student safety principles.
          </p>
        </section>

      </article>

      {/* Navigation Footer links */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#0EA5E9]">
        <Link to="/terms" className="hover:underline flex items-center">
          📋 Read Terms of Service
        </Link>
        <span>·</span>
        <Link to="/privacy" className="hover:underline flex items-center">
          🔐 Read Privacy Policy
        </Link>
        <span>·</span>
        <Link to="/contact" className="hover:underline flex items-center">
          📩 Contact Support
        </Link>
      </div>
    </div>
  );
};
