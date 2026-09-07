// NexVoice Verified Thread style: responsive cyan signal icons convey filing, verification, and submission state.
import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AlertCircle, ArrowLeft, ArrowRight, Award, BookOpen, BriefcaseBusiness, Building2, Calendar, CheckCircle2, Clock, Eye, EyeOff, FileCheck, Folder, Globe, GraduationCap, Heart, IdCard, Loader2, Mail, MapPin, MessageCircle, Rocket, Send, Shield, Sparkles, Star, Tag, ThumbsUp, TrendingUp, Upload, User, Users, XCircle, Zap } from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  animated?: boolean;
  size?: number;
  color?: string;
  state?: 'idle' | 'loading' | 'success' | 'error' | 'hover';
}

const iconMap: Record<string, LucideIcon> = {
  loader: Loader2, check: CheckCircle2, 'check-circle': CheckCircle2, x: XCircle, 'x-circle': XCircle, alert: AlertCircle,
  sparkles: Sparkles, zap: Zap, rocket: Rocket, star: Star, award: Award, heart: Heart, shield: Shield, upload: Upload,
  'file-check': FileCheck, eye: Eye, 'eye-off': EyeOff, user: User, building: Building2, 'map-pin': MapPin,
  calendar: Calendar, clock: Clock, 'arrow-right': ArrowRight, 'arrow-left': ArrowLeft, send: Send, mail: Mail,
  globe: Globe, message: MessageCircle, users: Users, 'thumbs-up': ThumbsUp, trending: TrendingUp, 'graduation-cap': GraduationCap,
  book: BookOpen, 'id-card': IdCard, briefcase: BriefcaseBusiness, tag: Tag, folder: Folder,
};

export function DynamicIcon({ name, className = '', animated = false, size = 20, color = 'currentColor', state = 'idle' }: DynamicIconProps) {
  const Icon = iconMap[name] ?? Sparkles;
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!['loading', 'success', 'error'].includes(state)) return;
    setIsAnimating(true);
    const timer = window.setTimeout(() => setIsAnimating(false), 800);
    return () => window.clearTimeout(timer);
  }, [state]);

  const stateClass = state === 'loading' ? 'animate-spin' : state === 'success' ? 'animate-pop-in text-emerald-500' : state === 'error' ? 'animate-pulse text-rose-500' : animated ? 'transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3' : '';
  const stateColor = state === 'success' ? '#10B981' : state === 'error' ? '#EF4444' : state === 'loading' ? '#0EA5E9' : color;

  return <Icon className={`${className} ${stateClass} ${isAnimating && state !== 'loading' ? 'animate-pop-in' : ''}`} size={size} color={stateColor} strokeWidth={1.8} aria-hidden="true" />;
}
