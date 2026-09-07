// NexVoice Verified Thread style: a deep midnight navigation bar makes cyan route and filing actions unmistakable.
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Compass, Home, Info, Menu, PlusCircle, Sparkles, X } from 'lucide-react';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Explore records', path: '/issues', icon: Compass },
    { label: 'File an issue', path: '/raise-issue', icon: PlusCircle },
    { label: 'How it works', path: '/how-it-works', icon: BookOpen },
    { label: 'About', path: '/about', icon: Info },
  ];

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? 'border-[#0EA5E9]/30 bg-[#1E2B37]/95 shadow-lg backdrop-blur-md' : 'border-[#0EA5E9]/20 bg-[#1E2B37]'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="flex min-h-[4.5rem] items-center justify-between py-2">
        <Logo />
        <nav className="hidden items-center gap-1 lg:gap-2 md:flex" aria-label="Primary navigation">
          {navLinks.map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} className={({ isActive }) => `flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${isActive ? 'bg-[#0EA5E9] font-semibold text-white shadow-inner' : 'text-slate-300 hover:bg-[#0EA5E9]/20 hover:text-white'}`}><Icon className="h-3.5 w-3.5" />{label}</NavLink>)}
        </nav>
        <div className="hidden items-center md:flex"><button onClick={() => navigate('/raise-issue')} className="inline-flex items-center rounded-xl border border-white/10 bg-[#0EA5E9] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-sky-500 hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] active:scale-[0.97]"><PlusCircle className="mr-2 h-4 w-4" />File an issue<Sparkles className="ml-1 h-3 w-3 text-white/70" /></button></div>
        <div className="flex items-center md:hidden"><button onClick={() => setMobileMenuOpen((open) => !open)} className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-[#0EA5E9]/30 hover:text-white" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen}>{mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button></div>
      </div></div>
      {mobileMenuOpen && <div className="space-y-2 border-t border-[#0EA5E9]/30 bg-[#1E2B37] px-4 pb-6 pt-3 shadow-2xl animate-fade-in md:hidden">
        {navLinks.map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors ${isActive ? 'bg-[#0EA5E9] font-semibold text-white' : 'text-slate-300 hover:bg-[#0EA5E9]/20 hover:text-white'}`}><Icon className="h-5 w-5" />{label}</NavLink>)}
        <div className="pt-2"><button onClick={() => { setMobileMenuOpen(false); navigate('/raise-issue'); }} className="flex w-full items-center justify-center rounded-xl bg-[#0EA5E9] px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-sky-500 active:scale-[0.97]"><PlusCircle className="mr-2 h-5 w-5" />File an issue</button></div>
      </div>}
    </header>
  );
};
