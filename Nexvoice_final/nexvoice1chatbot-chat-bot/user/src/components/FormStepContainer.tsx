// NexVoice Verified Thread style: filing steps are structured as calm, high-trust record panels with a cyan stage marker.
import type { ReactNode } from 'react';
import { DynamicIcon } from './DynamicIcon';

interface FormStepContainerProps { title: string; subtitle: string; icon: string; children: ReactNode; className?: string; isActive?: boolean; }

export function FormStepContainer({ title, subtitle, icon, children, className = '', isActive = true }: FormStepContainerProps) {
  return <section className={`rounded-3xl border border-[#E2E8F0] bg-white p-6 card-shadow transition-all duration-500 sm:p-8 ${isActive ? 'animate-fade-in-up opacity-100' : 'pointer-events-none scale-95 opacity-0'} ${className}`}><div className="mb-6 flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0EA5E9] text-white shadow-md"><DynamicIcon name={icon} size={24} color="#FFFFFF" /></div><div><h2 className="text-xl font-bold text-[#1A1A1A]">{title}</h2><p className="text-sm text-[#64748B]">{subtitle}</p></div></div>{children}</section>;
}
