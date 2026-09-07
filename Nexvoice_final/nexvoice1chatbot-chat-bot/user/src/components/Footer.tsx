// NexVoice Verified Thread style: the midnight footer closes each public record with clear trust and accountability cues.
import { Heart, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export const Footer: React.FC = () => (
  <footer className="mt-auto border-t border-[#0EA5E9]/30 bg-[#1E2B37] text-white">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
        <div className="space-y-4 md:col-span-2">
          <Logo compact />
          <p className="max-w-md text-sm leading-relaxed text-slate-300">
            NexVoice gives students and educational communities a transparent way to file academic concerns, preserve the record, and build meaningful visibility around real issues.
          </p>
          <div className="flex items-center text-xs font-semibold uppercase tracking-wide text-slate-300">
            <Heart className="mr-2 h-4 w-4 text-[#0EA5E9]" />
            Document concerns. Build accountability.
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0EA5E9]">Platform</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/" className="inline-block transition-all hover:translate-x-1 hover:text-white">Home</Link></li>
            <li><Link to="/issues" className="inline-block transition-all hover:translate-x-1 hover:text-white">Explore records</Link></li>
            <li><Link to="/raise-issue" className="inline-block transition-all hover:translate-x-1 hover:text-white">File an issue</Link></li>
            <li><Link to="/how-it-works" className="inline-block transition-all hover:translate-x-1 hover:text-white">How it works</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#14B8A6]">Legal & Safety</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/about" className="inline-block transition-all hover:translate-x-1 hover:text-white">About NexVoice</Link></li>
            <li><Link to="/terms" className="inline-block transition-all hover:translate-x-1 hover:text-white">📋 Terms</Link></li>
            <li><Link to="/privacy" className="inline-block transition-all hover:translate-x-1 hover:text-white">🔐 Privacy</Link></li>
            <li><Link to="/age-policy" className="inline-block transition-all hover:translate-x-1 hover:text-white">🧑‍🎓 Age & Guardian Policy</Link></li>
            <li><Link to="/contact" className="inline-block transition-all hover:translate-x-1 hover:text-white">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 space-y-3 rounded-2xl border border-[#0EA5E9]/30 bg-[#1E2B37] p-5 transition-colors hover:border-[#0EA5E9]/60">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#FAF9F6]">
          <Shield className="h-4 w-4 text-[#0EA5E9]" />
          Identity Protection Safeguards
          <Sparkles className="ml-2 h-3 w-3 animate-pulse text-[#0EA5E9]" />
        </div>
        <p className="text-xs leading-relaxed text-slate-300">
          Uploaded identity documents stay in secure private storage. Identity details are never made public without explicit permission.
        </p>
        <div className="text-[11px] italic text-slate-400">NexVoice public issue registry</div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between border-t border-[#0EA5E9]/30 pt-8 text-xs text-slate-300 md:flex-row">
        <p>© {new Date().getFullYear()} NexVoice Platform. All rights reserved.</p>
        <p className="mt-2 flex items-center md:mt-0">
          Built for transparent educational communities.
          <Sparkles className="ml-1 h-3 w-3 text-[#0EA5E9]" />
        </p>
      </div>
    </div>
  </footer>
);
