import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, PlusCircle } from 'lucide-react';
import { DataService } from '../lib/supabase';

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
        <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5]">Platform Guide</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A]">How NexVoice Works</h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          A simple, transparent 5-step process designed to elevate student concerns without requiring user logins.
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.n} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs flex items-start space-x-5">
            <div className="w-12 h-12 rounded-2xl bg-[#4F46E5] text-white flex items-center justify-center font-black text-lg shrink-0">
              {step.n}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#0F172A]">{step.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Privacy Guarantee Box */}
      <div className="bg-[#0F172A] text-white rounded-3xl p-8 border border-[#1E293B] space-y-4">
        <div className="flex items-center space-x-3 text-white">
          <Shield className="w-6 h-6 text-[#10B981]" />
          <h3 className="text-xl font-bold">Privacy & Verification Safeguards</h3>
        </div>
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          Identity verification is crucial to prevent spam and maintain genuine platform integrity. All uploaded ID cards are placed inside a private Supabase storage bucket (`identity-documents`). They are never exposed on public issue cards, detail pages, or public API responses.
        </p>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/raise-issue"
          className="inline-flex items-center px-8 py-3.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-sm shadow-md transition-colors"
        >
          <PlusCircle className="w-4 h-4 mr-2 text-[#10B981]" />
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
        <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5]">Our Mission</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A]">About NexVoice</h1>
        <p className="text-lg font-semibold text-[#4F46E5]">
          "Turning Student Voices into Action."
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xs space-y-6 text-slate-700 leading-relaxed text-sm">
        <p>
          NexVoice is a public student voice-to-action platform designed to give students and educational communities a structured way to raise concerns regarding academic policies, scholarship delays, facility shortcomings, and administrative challenges.
        </p>

        <h3 className="text-lg font-bold text-[#0F172A]">Our Core Principles</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
            <h4 className="font-bold text-[#0F172A]">1. Constructive Visibility</h4>
            <p className="text-xs text-slate-600">The goal is not to create conflict, but to make educational issues visible, understandable, and easier to address.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
            <h4 className="font-bold text-[#0F172A]">2. Frictionless Participation</h4>
            <p className="text-xs text-slate-600">No mandatory passwords or account creation needed in v1. Anyone can submit an issue in minutes.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <h1 className="text-3xl font-black text-[#0F172A]">Privacy Policy</h1>
      <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-4 text-sm text-slate-700 leading-relaxed shadow-2xs">
        <h3 className="text-base font-bold text-[#0F172A]">1. Identity Information Collection</h3>
        <p>We collect basic identity information (Full Name, Institution Name, ID Number) and an uploaded identity document solely to prevent automated spam and preserve community trust.</p>

        <h3 className="text-base font-bold text-[#0F172A]">2. Private Document Storage</h3>
        <p>Identity documents are saved to private storage. They are strictly segregated from public API endpoints and are never displayed on public issue pages.</p>

        <h3 className="text-base font-bold text-[#0F172A]">3. Anonymous Display Option</h3>
        <p>By default, public issue cards display "Anonymous Student" or "Anonymous Institution Representative". Users must explicitly toggle display settings to show their name.</p>
      </div>
    </div>
  );
};

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <h1 className="text-3xl font-black text-[#0F172A]">Terms of Service</h1>
      <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-4 text-sm text-slate-700 leading-relaxed shadow-2xs">
        <h3 className="text-base font-bold text-[#0F172A]">Community Rules</h3>
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

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = React.useState(false);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await DataService.sendContactMessage({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    });
    setSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-[#0F172A]">Contact NexVoice</h1>
        <p className="text-sm text-slate-600">Have questions, feedback, or privacy concerns?</p>
      </div>

      {!submitted ? (
        <form onSubmit={handleContactSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4 text-sm shadow-2xs">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Your Name</label>
            <input required name="name" type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-[#1E293B] focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Your Email</label>
            <input required name="email" type="email" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-[#1E293B] focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subject</label>
            <input required name="subject" type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-[#1E293B] focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Message</label>
            <textarea required name="message" rows={4} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-[#1E293B] focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] focus:outline-none leading-relaxed" />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-sm shadow-md transition-colors">
            Send Message
          </button>
        </form>
      ) : (
        <div className="bg-emerald-50 p-8 rounded-3xl text-center border border-emerald-200 space-y-2">
          <h3 className="text-lg font-bold text-emerald-800">Message Sent</h3>
          <p className="text-xs text-emerald-700">Thank you for reaching out. We will review your message shortly.</p>
        </div>
      )}
    </div>
  );
};
