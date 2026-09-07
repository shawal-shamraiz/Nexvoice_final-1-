import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, AlertTriangle, Scale, Lock, Flag, MessageSquare, CheckCircle } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <header className="space-y-4 text-center">
        <div className="inline-flex items-center space-x-2 rounded-full border border-[#0EA5E9]/30 bg-[#0EA5E9]/10 px-3.5 py-1.5 text-xs font-bold text-[#0EA5E9]">
          <FileText className="h-4 w-4" />
          <span>Legal Documentation</span>
        </div>
        <h1 className="text-3xl font-black text-[#1E2B37] sm:text-4xl">
          Terms of Service
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
            Purpose of NexVoice V2
          </h2>
          <p className="text-[#64748B]">
            NexVoice V2 is a public student voice-to-action platform designed for educational communities across Pakistan. The platform enables individual students and authorized educational institution representatives to raise academic concerns, document issues transparently, and engage in constructive discussions.
          </p>
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#FAF9F6] p-4 space-y-2 text-xs text-[#1E2B37]">
            <strong className="text-[#0EA5E9] block font-bold uppercase tracking-wider">Platform Objectives:</strong>
            <ul className="list-disc pl-5 space-y-1 text-[#64748B]">
              <li>Turn individual student concerns into collective, trackable insight.</li>
              <li>Encourage respectful and evidence-backed educational dialogue.</li>
              <li>Allow community members to support and react to legitimate issues.</li>
              <li>Provide administrative oversight to moderate inappropriate or false content.</li>
            </ul>
          </div>
        </section>

        {/* Section 2: User Responsibilities */}
        <section className="space-y-3 border-t border-[#E2E8F0] pt-6">
          <h2 className="text-lg font-bold text-[#1E2B37] flex items-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0EA5E9] text-white text-xs font-black mr-2.5">2</span>
            User Responsibilities & Conduct Rules
          </h2>
          <p className="text-[#64748B]">
            Users are solely responsible for all content, information, or documentation submitted through NexVoice V2. By using the platform, you agree to adhere to strict community standards.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 text-emerald-900 space-y-1">
              <span className="font-bold flex items-center text-emerald-700">
                <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> What Users Must Do
              </span>
              <p>Submit information truthfully, accurately, and in good faith to resolve genuine academic challenges.</p>
            </div>
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 text-rose-900 space-y-1">
              <span className="font-bold flex items-center text-rose-700">
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> What Is Strictly Prohibited
              </span>
              <p>Harassment, personal threats, hate speech, spam, defamation, copyright infringement, or publishing private identities.</p>
            </div>
          </div>
        </section>

        {/* Section 3: False or Misleading Information */}
        <section className="space-y-3 border-t border-[#E2E8F0] pt-6">
          <h2 className="text-lg font-bold text-[#1E2B37] flex items-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0EA5E9] text-white text-xs font-black mr-2.5">3</span>
            False or Misleading Information
          </h2>
          <p className="text-[#64748B]">
            Users must not intentionally submit fabricated claims, false allegations, or malicious accusations against individuals or institutions.
          </p>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-3 text-xs">
            <span className="font-bold text-amber-800 uppercase tracking-wider block">Submission Guidelines Example:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-emerald-200 text-emerald-900">
                <span className="font-bold text-emerald-700 block mb-1">✓ Appropriate Submission</span>
                <p className="italic">"Students are experiencing delays in receiving Fall 2025 merit scholarship funds at H-12 Campus."</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-rose-200 text-rose-900">
                <span className="font-bold text-rose-700 block mb-1">✕ Inappropriate Submission</span>
                <p className="italic">"XYZ staff member is a corrupt criminal stealing money."</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-[#64748B]">
            User-generated content represents the submitter's personal statement and does not reflect the official stance of NexVoice.
          </p>
        </section>

        {/* Section 4: Content Reporting & Moderation */}
        <section className="space-y-3 border-t border-[#E2E8F0] pt-6">
          <h2 className="text-lg font-bold text-[#1E2B37] flex items-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0EA5E9] text-white text-xs font-black mr-2.5">4</span>
            Content Reporting & Administrative Moderation
          </h2>
          <p className="text-[#64748B]">
            NexVoice operates a transparent moderation system. Community members can report inappropriate or misleading issues and comments for administrative review.
          </p>
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#FAF9F6] p-4 text-xs space-y-2 text-[#1E2B37]">
            <span className="font-bold text-[#0EA5E9] block">Moderation Workflow:</span>
            <p className="text-[#64748B]">
              Submitting a report alerts authorized NexVoice administrators. <strong>A report does NOT automatically unpublish or hide an issue.</strong> The issue remains live on the public register while administrators evaluate the report and decide whether to dismiss the report or remove the content.
            </p>
          </div>
        </section>

        {/* Section 5: Comments and Reactions */}
        <section className="space-y-3 border-t border-[#E2E8F0] pt-6">
          <h2 className="text-lg font-bold text-[#1E2B37] flex items-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0EA5E9] text-white text-xs font-black mr-2.5">5</span>
            Community Comments & Reactions
          </h2>
          <p className="text-[#64748B]">
            Visitors can react to and comment on public approved issues. All discussions must comply with NexVoice community rules. NexVoice reserves the right to remove comments or restrict abuse.
          </p>
        </section>

        {/* Section 6: Privacy & Identity Protection */}
        <section className="space-y-3 border-t border-[#E2E8F0] pt-6">
          <h2 className="text-lg font-bold text-[#1E2B37] flex items-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0EA5E9] text-white text-xs font-black mr-2.5">6</span>
            Privacy & Sensitive Information Warning
          </h2>
          <p className="text-[#64748B]">
            Users must never post sensitive personal data publicly in issue titles or descriptions. Do not publish CNIC numbers, passwords, phone numbers, home addresses, bank accounts, or third-party identity documents.
          </p>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#0EA5E9]">
            <Lock className="w-4 h-4" />
            <span>Read our full <Link to="/privacy" className="underline hover:text-[#1E2B37]">Privacy Policy</Link> for identity document protections.</span>
          </div>
        </section>

        {/* Section 7: Updates to Terms */}
        <section className="space-y-3 border-t border-[#E2E8F0] pt-6">
          <h2 className="text-lg font-bold text-[#1E2B37] flex items-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0EA5E9] text-white text-xs font-black mr-2.5">7</span>
            Changes to Terms of Service
          </h2>
          <p className="text-[#64748B]">
            NexVoice may update these Terms of Service periodically to reflect operational, legal, or platform improvements. Continued use of the platform constitutes acceptance of updated terms.
          </p>
        </section>

      </article>

      {/* Navigation Footer links */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#0EA5E9]">
        <Link to="/privacy" className="hover:underline flex items-center">
          🔐 Read Privacy Policy
        </Link>
        <span>·</span>
        <Link to="/age-policy" className="hover:underline flex items-center">
          🧑‍🎓 Read Student Age & Guardian Policy
        </Link>
        <span>·</span>
        <Link to="/contact" className="hover:underline flex items-center">
          📩 Contact Support
        </Link>
      </div>
    </div>
  );
};
