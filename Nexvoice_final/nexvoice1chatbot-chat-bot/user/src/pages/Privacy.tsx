import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ShieldCheck, Database, Eye, Server, FileCheck, CheckCircle } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <header className="space-y-4 text-center">
        <div className="inline-flex items-center space-x-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-3.5 py-1.5 text-xs font-bold text-[#14B8A6]">
          <Lock className="h-4 w-4" />
          <span>Data Protection & Safeguards</span>
        </div>
        <h1 className="text-3xl font-black text-[#1E2B37] sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#64748B]">
          Last Updated: September 2026 · NexVoice Student Voice Platform
        </p>
      </header>

      {/* Main Privacy Document */}
      <article className="space-y-8 rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:p-10 card-shadow text-sm leading-relaxed text-[#1E2B37]">
        
        {/* Section 1: Overview */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E2B37] flex items-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#14B8A6] text-white text-xs font-black mr-2.5">1</span>
            Privacy Overview
          </h2>
          <p className="text-[#64748B]">
            NexVoice is committed to protecting the privacy and personal data of students, educational institution representatives, and community members. This Privacy Policy explains what information is collected, how it is secured, and what information remains public or private.
          </p>
        </section>

        {/* Section 2: Information We Collect */}
        <section className="space-y-3 border-t border-[#E2E8F0] pt-6">
          <h2 className="text-lg font-bold text-[#1E2B37] flex items-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#14B8A6] text-white text-xs font-black mr-2.5">2</span>
            Information We May Collect
          </h2>
          <p className="text-[#64748B]">
            Depending on how you use NexVoice V2, we collect specific categories of information to maintain platform integrity:
          </p>
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FAF9F6] space-y-1">
              <strong className="text-[#1E2B37] font-bold text-sm block">Identity & Verification Information</strong>
              <p className="text-[#64748B]">
                Full Name, Institution Name, Student ID number, Employee/Institution ID, Role or Designation, and uploaded Identity Verification Documents (JPG, PNG, or PDF up to 5 MB).
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FAF9F6] space-y-1">
              <strong className="text-[#1E2B37] font-bold text-sm block">Issue Filing Information</strong>
              <p className="text-[#64748B]">
                Issue Title, Detailed Description, Academic Category, Subcategory, Province, City, Department/Location, and Public Display Name settings.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FAF9F6] space-y-1">
              <strong className="text-[#1E2B37] font-bold text-sm block">Community Activity Data</strong>
              <p className="text-[#64748B]">
                Community Reactions (👍 Support, ❤️ Solidarity, 😟 Concerned, 😡 Outraged, 👏 Applaud), Public Comments, and Content Abuse Reports.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Public vs Private Information */}
        <section className="space-y-3 border-t border-[#E2E8F0] pt-6">
          <h2 className="text-lg font-bold text-[#1E2B37] flex items-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#14B8A6] text-white text-xs font-black mr-2.5">3</span>
            Public vs. Private Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl border border-sky-200 bg-sky-50/50 space-y-2">
              <span className="font-bold text-[#0EA5E9] text-sm flex items-center">
                <Eye className="w-4 h-4 mr-1.5" /> Publicly Displayed Data
              </span>
              <ul className="list-disc pl-4 space-y-1 text-[#64748B]">
                <li>Issue Title & Description</li>
                <li>Institution Name, Province & City</li>
                <li>Issue Category & Reference Number</li>
                <li>Community Reactions & Public Comments</li>
                <li>Filer's display preference (Anonymous or Full Name)</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2">
              <span className="font-bold text-emerald-800 text-sm flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5" /> Strictly Private Data
              </span>
              <ul className="list-disc pl-4 space-y-1 text-[#64748B]">
                <li>Uploaded Identity Verification Documents</li>
                <li>Student ID & Employee ID Numbers</li>
                <li>Anonymous Filer Real Identity Details</li>
                <li>Internal Moderation Log Details</li>
              </ul>
            </div>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-xs space-y-1 text-amber-900">
            <strong className="font-bold block">Anonymous Submission Clarification:</strong>
            <p>
              When filing anonymously, your real name is never displayed on public issue cards or public pages. Authorized NexVoice administrators retain access to identity verification data solely for anti-spam verification, security, abuse prevention, and legal compliance.
            </p>
          </div>
        </section>

        {/* Section 4: Identity Document Protection */}
        <section className="space-y-3 border-t border-[#E2E8F0] pt-6">
          <h2 className="text-lg font-bold text-[#1E2B37] flex items-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#14B8A6] text-white text-xs font-black mr-2.5">4</span>
            Identity Verification Document Safeguards
          </h2>
          <p className="text-[#64748B]">
            All uploaded identity verification documents are stored inside restricted private cloud storage buckets (`identity-documents`). They are strictly segregated from public API endpoints and are never exposed on public issue pages.
          </p>
        </section>

        {/* Section 5: Data Retention & Deletion */}
        <section className="space-y-3 border-t border-[#E2E8F0] pt-6">
          <h2 className="text-lg font-bold text-[#1E2B37] flex items-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#14B8A6] text-white text-xs font-black mr-2.5">5</span>
            Data Retention Policy
          </h2>
          <p className="text-[#64748B]">
            NexVoice retains identity verification information only for as long as reasonably necessary to satisfy identity verification, security checks, content moderation, abuse prevention, and legal compliance. Information may be archived or anonymized once verification purposes are complete.
          </p>
        </section>

        {/* Section 6: Data Security & Infrastructure */}
        <section className="space-y-3 border-t border-[#E2E8F0] pt-6">
          <h2 className="text-lg font-bold text-[#1E2B37] flex items-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#14B8A6] text-white text-xs font-black mr-2.5">6</span>
            Technical Security & Third-Party Infrastructure
          </h2>
          <p className="text-[#64748B]">
            NexVoice implements modern technical and organizational security controls to protect your data across our service pipeline:
          </p>
          <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#FAF9F6] text-xs font-mono text-[#1E2B37] text-center">
            User Website ➔ Node.js API Service ➔ Supabase PostgreSQL Database (Encrypted in Transit & Rest)
          </div>
          <p className="text-xs text-[#64748B]">
            We utilize Supabase cloud infrastructure for PostgreSQL database storage and secure file storage bucket policies. Service-role keys and internal credentials are standardly secured on backend servers.
          </p>
        </section>

      </article>

      {/* Navigation Footer links */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#0EA5E9]">
        <Link to="/terms" className="hover:underline flex items-center">
          📋 Read Terms of Service
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
