// NexVoice Verified Thread style: the user-provided signal mark anchors the midnight shell, with cyan motion for interactive feedback.
import { Link } from 'react-router-dom';

interface LogoProps {
  compact?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ compact = false, className = '' }) => (
  <Link to="/" aria-label="NexVoice home" className={`group inline-flex items-center gap-3 ${className}`}>
    <img src="/logo2.jpeg" alt="NexVoice logo" className={`${compact ? 'h-8 w-auto' : 'h-10 w-auto'} shrink-0 rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-3deg]`} />
    {!compact && <span className="leading-none"><span className="block text-xl font-black tracking-tight text-white transition-colors group-hover:text-[#0EA5E9]">NexVoice</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">Public issue registry</span></span>}
  </Link>
);
