// NexVoice Verified Thread style: restrained motion gives public-record cards a responsive, credible feel.
import type { CSSProperties, ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-in' | 'fade-in-up' | 'scale-in' | 'pop-in';
  delay?: number;
  hoverEffect?: 'lift' | 'glow' | 'border' | 'none';
  onClick?: () => void;
}

const animationClasses: Record<NonNullable<AnimatedCardProps['animation']>, string> = {
  'fade-in': 'animate-fade-in',
  'fade-in-up': 'animate-fade-in-up',
  'scale-in': 'animate-scale-in',
  'pop-in': 'animate-pop-in',
};

const hoverClasses: Record<NonNullable<AnimatedCardProps['hoverEffect']>, string> = {
  lift: 'hover:-translate-y-1.5 hover:shadow-xl',
  glow: 'hover:shadow-[0_0_30px_rgba(14,165,233,0.16)]',
  border: 'hover:border-[#0EA5E9] hover:shadow-md',
  none: '',
};

export function AnimatedCard({
  children,
  className = '',
  animation = 'fade-in-up',
  delay = 0,
  hoverEffect = 'lift',
  onClick,
}: AnimatedCardProps) {
  const style: CSSProperties = { animationDelay: `${delay}ms` };

  return (
    <div
      className={`${animationClasses[animation]} ${hoverClasses[hoverEffect]} transition-[transform,box-shadow,border-color] duration-300 ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
