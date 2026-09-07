// NexVoice Verified Thread style: form fields use linen surfaces, cyan focus signals, and explicit validation feedback.
import { useState } from 'react';
import { DynamicIcon } from './DynamicIcon';

interface AnimatedFormInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  icon?: string;
  error?: string;
  hint?: string;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function AnimatedFormInput({ label, type = 'text', value, onChange, placeholder = '', required = false, icon, error, hint, className = '', onFocus, onBlur }: AnimatedFormInputProps) {
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const hasError = Boolean(error);

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">{label}{required && <span className="ml-1 text-[#0EA5E9]">*</span>}</label>
      <div className={`group relative rounded-xl border-2 transition-all duration-300 ${hasError ? 'border-rose-500 bg-rose-50/30' : focused ? 'border-[#0EA5E9] shadow-[0_0_0_4px_rgba(14,165,233,0.1)]' : 'border-[#E2E8F0] hover:border-[#0EA5E9]/50'}`}>
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors group-hover:text-[#0EA5E9]"><DynamicIcon name={icon} size={18} animated state={hasError ? 'error' : 'idle'} /></div>}
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} onFocus={() => { setFocused(true); onFocus?.(); }} onBlur={() => { setFocused(false); setTouched(true); onBlur?.(); }} placeholder={placeholder} required={required} aria-invalid={hasError} className={`w-full rounded-xl bg-transparent px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#94A3B8] outline-none transition-all ${icon ? 'pl-10' : ''} ${hasError || (focused && value) ? 'pr-10' : ''}`} />
        {hasError && <div className="absolute right-3 top-1/2 -translate-y-1/2"><DynamicIcon name="alert" size={18} state="error" /></div>}
        {focused && !hasError && value && <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-pop-in"><DynamicIcon name="check" size={18} state="success" /></div>}
      </div>
      {hint && !hasError && <p className="text-xs text-[#94A3B8]">{hint}</p>}
      {hasError && <p className="text-xs font-medium text-rose-600 animate-fade-in">{error}</p>}
    </div>
  );
}
