import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark'; // 'light' for dark backgrounds (navbar/footer), 'dark' for light backgrounds
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  clickable?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showTagline = false,
  clickable = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const isLight = variant === 'light';

  const content = (
    <div className={`flex items-center space-x-3 group ${className}`}>
      {/* Official NexVoice Logo Mark (preserved proportions & aspect ratio) */}
      <div
        className={`${iconSizes[size]} shrink-0 rounded-xl flex items-center justify-center p-1.5 transition-transform duration-200 group-hover:scale-105 ${
          isLight
            ? 'bg-[#1E293B] border border-[#334155] shadow-md shadow-black/20'
            : 'bg-[#EEF2FF] border border-[#E0E7FF] shadow-xs'
        }`}
      >
        <img
          src="/favicon.svg"
          alt="NexVoice Logo"
          className="w-full h-full object-contain"
          width="48"
          height="46"
        />
      </div>

      <div className="flex flex-col">
        <span
          className={`font-black tracking-tight leading-none transition-colors ${
            titleSizes[size]
          } ${isLight ? 'text-white group-hover:text-slate-200' : 'text-[#0F172A] group-hover:text-[#4F46E5]'}`}
        >
          Nex<span className="text-[#4F46E5]">Voice</span>
        </span>

        {showTagline && (
          <span
            className={`block text-[10px] uppercase font-bold tracking-widest mt-1 ${
              isLight ? 'text-[#94A3B8]' : 'text-[#64748B]'
            }`}
          >
            Public Issue Platform
          </span>
        )}
      </div>
    </div>
  );

  if (clickable) {
    return (
      <Link to="/" className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
};
