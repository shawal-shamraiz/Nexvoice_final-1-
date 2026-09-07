import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, PlusCircle } from 'lucide-react';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore Issues', path: '/issues' },
    { label: 'Raise an Issue', path: '/raise-issue' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A] text-white shadow-md border-b border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <Logo variant="light" size="md" showTagline={true} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                    isActive
                      ? 'bg-[#4F46E5] text-white shadow-sm font-semibold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => navigate('/raise-issue')}
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all border border-indigo-400/20 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
            >
              <PlusCircle className="w-4 h-4 mr-2 text-[#10B981]" />
              Raise an Issue
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#1E293B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F172A] border-t border-[#1E293B] px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-[#4F46E5] text-white font-semibold'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/raise-issue');
              }}
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold shadow-md active:scale-95 transition-transform"
            >
              <PlusCircle className="w-5 h-5 mr-2 text-[#10B981]" />
              Raise an Issue
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
