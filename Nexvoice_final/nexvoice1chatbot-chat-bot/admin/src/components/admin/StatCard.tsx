import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  color = 'text-[#0EA5E9]',
  bgColor = 'bg-sky-50',
  description,
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 card-shadow flex items-start justify-between">
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">{label}</span>
        <div className="text-2xl font-black text-[#1E2B37]">{value}</div>
        {description && <p className="text-[11px] text-[#64748B]">{description}</p>}
      </div>
      <div className={`p-3 rounded-xl ${bgColor} ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
