// NexVoice Verified Thread style: official status marks use cyan, teal, amber, and cool gray on linen surfaces.
import type { ReactNode } from 'react';

export type StatusType =
  | 'UNDER_REVIEW'
  | 'RESOLVED'
  | 'PENDING_VERIFICATION'
  | 'PUBLISHED'
  | 'REPORTED'
  | 'ARCHIVED';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface BadgeConfig {
  label: string;
  className: string;
  dot: string;
}

const statusConfig: Record<StatusType, BadgeConfig> = {
  UNDER_REVIEW: {
    label: 'Under review',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
    dot: 'bg-amber-500',
  },
  RESOLVED: {
    label: 'Resolved',
    className: 'border-teal-200 bg-teal-50 text-teal-700',
    dot: 'bg-teal-500',
  },
  PUBLISHED: {
    label: 'Published',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  PENDING_VERIFICATION: {
    label: 'Pending verification',
    className: 'border-slate-200 bg-slate-50 text-slate-600',
    dot: 'bg-slate-400',
  },
  REPORTED: {
    label: 'Reported',
    className: 'border-rose-200 bg-rose-50 text-rose-700',
    dot: 'bg-rose-500',
  },
  ARCHIVED: {
    label: 'Archived',
    className: 'border-slate-300 bg-slate-100 text-slate-500',
    dot: 'bg-slate-500',
  },
};

const sizeClasses: Record<NonNullable<StatusBadgeProps['size']>, string> = {
  sm: 'gap-1 px-2 py-0.5 text-[11px]',
  md: 'gap-1.5 px-3 py-1 text-xs',
  lg: 'gap-2 px-4 py-1.5 text-sm',
};

const dotSizes: Record<NonNullable<StatusBadgeProps['size']>, string> = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-2.5 w-2.5',
};

export function StatusBadge({ status, className = '', size = 'md' }: StatusBadgeProps): ReactNode {
  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center rounded-full border font-semibold transition-transform duration-200 hover:scale-[1.03] ${config.className} ${sizeClasses[size]} ${className}`}>
      <span className={`${dotSizes[size]} ${config.dot} rounded-full animate-pulse`} aria-hidden="true" />
      {config.label}
    </span>
  );
}
