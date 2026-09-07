import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] text-white border-t border-[#1E293B] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <Logo variant="light" size="sm" />
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Giving students and educational communities a simple, transparent way to raise academic concerns, make them visible, and turn individual problems into meaningful action.
            </p>
            <div className="text-xs text-[#94A3B8] font-semibold tracking-wide uppercase">
              "Turning Student Voices into Action."
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h3>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/issues" className="hover:text-white transition-colors">Explore Issues</Link></li>
              <li><Link to="/raise-issue" className="hover:text-white transition-colors">Raise an Issue</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Organization & Transparency */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">About & Legal</h3>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li><Link to="/about" className="hover:text-white transition-colors">About NexVoice</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Privacy Note */}
          <div className="bg-[#1E293B]/70 p-5 rounded-2xl border border-[#334155] space-y-3">
            <div className="flex items-center space-x-2 text-white font-semibold text-sm">
              <Shield className="w-4 h-4 text-[#10B981]" />
              <span>Identity Protection</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              All uploaded identity documents are stored in secure private storage. Identity details are never made public without explicit permission.
            </p>
            <div className="text-[11px] text-[#64748B] italic">
              NexVoice v1.0 Public MVP
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-[#1E293B] flex flex-col md:flex-row items-center justify-between text-xs text-[#94A3B8]">
          <p>© {new Date().getFullYear()} NexVoice Platform. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center">
            Built for Educational Excellence & Community Empowerment
          </p>
        </div>
      </div>
    </footer>
  );
};
