// NexVoice Verified Thread style: the progress ledger makes each filing stage visible and reversible only when completed.
import { DynamicIcon } from './DynamicIcon';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
  icons: string[];
  onStepClick?: (step: number) => void;
}

export function StepProgress({ currentStep, totalSteps, labels, icons, onStepClick }: StepProgressProps) {
  const progress = totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 0;
  return (
    <div className="w-full py-4 sm:py-6"><div className="relative flex items-start justify-between"><div className="absolute left-0 right-0 top-6 h-0.5 bg-[#E2E8F0]"><div className="h-full bg-[#0EA5E9] transition-all duration-500" style={{ width: `${progress}%` }} /></div>{Array.from({ length: totalSteps }, (_, index) => {
      const stepNumber = index + 1; const active = stepNumber === currentStep; const completed = stepNumber < currentStep; const clickable = Boolean(onStepClick && completed);
      return <div key={stepNumber} className="relative z-10 flex min-w-0 flex-col items-center text-center"><button type="button" onClick={() => clickable && onStepClick?.(stepNumber)} disabled={!clickable} className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${active ? 'scale-110 bg-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/30' : completed ? 'bg-emerald-500 text-white hover:scale-110' : 'border-2 border-[#E2E8F0] bg-white text-[#94A3B8]'} ${clickable ? 'cursor-pointer hover:shadow-lg' : ''}`}>{completed ? <DynamicIcon name="check" size={24} color="#FFFFFF" state="success" /> : <span className="text-sm font-bold">{stepNumber}</span>}</button><span className={`mt-2 max-w-16 text-[10px] font-medium leading-tight sm:max-w-none sm:text-xs ${active ? 'text-[#0EA5E9]' : completed ? 'text-emerald-500' : 'text-[#94A3B8]'}`}>{labels[index]}</span>{icons[index] && <DynamicIcon name={icons[index]} size={14} className="mt-1 opacity-50" color={active ? '#0EA5E9' : '#94A3B8'} />}</div>;
    })}</div></div>
  );
}
