import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Shield, ShieldCheck, PlusCircle } from 'lucide-react';
import { ContactForm } from '../components/ContactForm';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      n: '01',
      title: 'Raise Your Voice',
      desc: 'Submit your academic concern via the streamlined /raise-issue wizard. Choose your role as a Student or Institution Representative.'
    },
    {
      n: '02',
      title: 'Provide Verification',
      desc: 'Upload your Student ID card or Employee Identification document. Files up to 5 MB in JPG, PNG, or PDF formats are supported.'
    },
    {
      n: '03',
      title: 'Review Information',
      desc: 'Inspect your issue title, category, description, and anonymity preferences on the live review screen prior to publishing.'
    },
    {
      n: '04',
      title: 'Publish & Obtain Reference Code',
      desc: 'Receive your unique reference number (e.g. NV-2026-000001). Your issue immediately appears on the public Explore Feed.'
    },
    {
      n: '05',
      title: 'Be Heard by the Community',
      desc: 'Others can explore, filter, and share your issue, helping bring collective visibility to educational challenges.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#10B981]">Platform Guide</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1E293B]">How NexVoice Works</h1>
        <p className="text-sm text-gray-600 max-w-xl mx-auto">
          A simple, transparent 5-step process designed to elevate student concerns without requiring user logins.
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.n} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex items-start space-x-5">
            <div className="w-12 h-12 rounded-2xl bg-[#4F46E5] text-[#F8FAFC] flex items-center justify-center font-black text-lg shrink-0">
              {step.n}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#1E293B]">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Privacy Guarantee Box */}
      <div className="bg-[#1E293B] text-white rounded-3xl p-8 border border-[#4F46E5] space-y-4">
        <div className="flex items-center space-x-3 text-[#F8FAFC]">
          <Shield className="w-6 h-6" />
          <h3 className="text-xl font-bold">Privacy & Verification Safeguards</h3>
        </div>
        <p className="text-sm text-[#CBD5E1] leading-relaxed">
          Identity verification is crucial to prevent spam and maintain genuine platform integrity. All uploaded ID cards are placed inside a private Supabase storage bucket (`identity-documents`). They are never exposed on public issue cards, detail pages, or public API responses.
        </p>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/raise-issue"
          className="inline-flex items-center px-8 py-3.5 rounded-xl bg-[#4F46E5] text-white font-bold text-sm shadow-md"
        >
          <PlusCircle className="w-4 h-4 mr-2 text-[#F8FAFC]" />
          Raise an Issue Now
        </Link>
      </div>

    </div>
  );
};

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#10B981]">Our Mission</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1E293B]">About NexVoice</h1>
        <p className="text-lg font-semibold text-[#4F46E5]">
          "Turning Student Voices into Action."
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-sm space-y-6 text-gray-700 leading-relaxed text-sm">
        <p>
          NexVoice is a public student voice-to-action platform designed to give students and educational communities a structured way to raise concerns regarding academic policies, scholarship delays, facility shortcomings, and administrative challenges.
        </p>

        <h3 className="text-lg font-bold text-[#1E293B]">Our Core Principles</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#F8FAFC]/40 border border-[#CBD5E1]/60 space-y-2">
            <h4 className="font-bold text-[#1E293B]">1. Constructive Visibility</h4>
            <p className="text-xs text-gray-600">The goal is not to create conflict, but to make educational issues visible, understandable, and easier to address.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFC]/40 border border-[#CBD5E1]/60 space-y-2">
            <h4 className="font-bold text-[#1E293B]">2. Frictionless Participation</h4>
            <p className="text-xs text-gray-600">No mandatory passwords or account creation needed in v1. Anyone can submit an issue in minutes.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <h1 className="text-3xl font-black text-[#1E293B]">Privacy Policy</h1>
      <div className="bg-white rounded-3xl p-8 border border-gray-200 space-y-4 text-sm text-gray-700 leading-relaxed">
        <h3 className="text-base font-bold text-[#1E293B]">1. Identity Information Collection</h3>
        <p>We collect basic identity information (Full Name, Institution Name, ID Number) and an uploaded identity document solely to prevent automated spam and preserve community trust.</p>

        <h3 className="text-base font-bold text-[#1E293B]">2. Private Document Storage</h3>
        <p>Identity documents are saved to private storage. They are strictly segregated from public API endpoints and are never displayed on public issue pages.</p>

        <h3 className="text-base font-bold text-[#1E293B]">3. Anonymous Display Option</h3>
        <p>By default, public issue cards display "Anonymous Student" or "Anonymous Institution Representative". Users must explicitly toggle display settings to show their name.</p>
      </div>
    </div>
  );
};

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <h1 className="text-3xl font-black text-[#1E293B]">Terms of Service</h1>
      <div className="bg-white rounded-3xl p-8 border border-gray-200 space-y-4 text-sm text-gray-700 leading-relaxed">
        <h3 className="text-base font-bold text-[#1E293B]">Community Rules</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Do not submit spam, false allegations, or fake information.</li>
          <li>Do not engage in harassment, personal threats, or hate speech.</li>
          <li>Do not upload identity documents belonging to other individuals without authorization.</li>
          <li>Do not expose personal contact details or sensitive financial data in issue descriptions.</li>
        </ul>
      </div>
    </div>
  );
};

export const Contact: React.FC = () => (
  <div className="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
    <header className="grid gap-6 animate-fade-in md:grid-cols-[minmax(0,1fr)_15rem] md:items-end">
      <div className="space-y-3 text-left"><div className="flex items-center gap-2 text-[#0EA5E9]"><Mail className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-widest">Contact record</span></div><h1 className="text-3xl font-black text-[#1A1A1A] sm:text-4xl">Contact <span className="text-[#0EA5E9]">NexVoice</span></h1><p className="max-w-xl text-sm text-[#64748B]">Send a question, feedback item, or privacy concern using the structured contact form below.</p></div>
      <aside className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FAF9F6] p-4 card-shadow"><img src="/logo2.jpeg" alt="" aria-hidden="true" className="absolute -right-5 -top-5 h-24 w-24 opacity-10" /><div className="relative"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0EA5E9]">Message register</span><div className="mt-2 font-mono text-sm font-bold text-[#1E2B37]">CONTACT / NEW</div><div className="mt-3 flex items-center gap-2 border-t border-[#E2E8F0] pt-3 text-xs text-[#64748B]"><span className="h-2 w-2 rounded-full bg-[#14B8A6] animate-pulse" />No identity document required</div></div></aside>
    </header>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 animate-fade-in-up delay-200">
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 card-shadow"><ShieldCheck className="h-6 w-6 text-[#14B8A6]" /><h2 className="mt-3 text-sm font-bold text-[#1A1A1A]">Structured message</h2><p className="mt-1 text-xs leading-relaxed text-[#64748B]">Required fields help create a complete contact record.</p></div>
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 card-shadow"><MessageCircle className="h-6 w-6 text-[#0EA5E9]" /><h2 className="mt-3 text-sm font-bold text-[#1A1A1A]">Clear context</h2><p className="mt-1 text-xs leading-relaxed text-[#64748B]">Use the subject and message fields to explain what you need.</p></div>
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 card-shadow"><Shield className="h-6 w-6 text-[#0EA5E9]" /><h2 className="mt-3 text-sm font-bold text-[#1A1A1A]">Privacy questions</h2><p className="mt-1 text-xs leading-relaxed text-[#64748B]">For identity-document questions, include only the details needed to describe the concern.</p></div>
    </div>

    <section className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white card-shadow animate-fade-in-up delay-300"><div className="grid border-b border-[#E2E8F0] bg-[#FAF9F6] text-xs sm:grid-cols-3"><div className="border-b border-[#E2E8F0] px-5 py-3 sm:border-b-0 sm:border-r"><span className="block font-bold uppercase tracking-wider text-[#0EA5E9]">Record state</span><span className="mt-1 block text-[#1A1A1A]">Draft message</span></div><div className="border-b border-[#E2E8F0] px-5 py-3 sm:border-b-0 sm:border-r"><span className="block font-bold uppercase tracking-wider text-[#0EA5E9]">Submission</span><span className="mt-1 block text-[#1A1A1A]">Configured message service</span></div><div className="px-5 py-3"><span className="block font-bold uppercase tracking-wider text-[#14B8A6]">Privacy note</span><span className="mt-1 block text-[#1A1A1A]">Avoid sending identity documents</span></div></div><div className="p-6 sm:p-8"><ContactForm /></div></section>
  </div>
);
