import React, { useState, useEffect } from 'react';
import type { ReactionType, ReactionCounts } from '../types';
import { DataService } from '../lib/supabase';

interface ReactionPickerProps {
  issueId: string;
}

const REACTION_CONFIG: Array<{ type: ReactionType; emoji: string; label: string }> = [
  { type: 'LIKE', emoji: '👍', label: 'Support' },
  { type: 'HEART', emoji: '❤️', label: 'Solidarity' },
  { type: 'SAD', emoji: '😟', label: 'Concerned' },
  { type: 'ANGRY', emoji: '😡', label: 'Outraged' },
  { type: 'CLAP', emoji: '👏', label: 'Applaud' },
];

export const ReactionPicker: React.FC<ReactionPickerProps> = ({ issueId }) => {
  const [counts, setCounts] = useState<ReactionCounts>({
    LIKE: 0,
    HEART: 0,
    SAD: 0,
    ANGRY: 0,
    CLAP: 0,
    total: 0,
    userReactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [animatingType, setAnimatingType] = useState<ReactionType | null>(null);

  useEffect(() => {
    let active = true;
    DataService.fetchReactions(issueId)
      .then((res) => {
        if (active) setCounts(res);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [issueId]);

  const handleToggleReaction = async (type: ReactionType) => {
    setAnimatingType(type);
    setTimeout(() => setAnimatingType(null), 300);

    // Optimistic UI update
    const hasReaction = counts.userReactions.includes(type);
    const updatedUserReactions = hasReaction
      ? counts.userReactions.filter((r) => r !== type)
      : [...counts.userReactions, type];

    const updatedCounts = {
      ...counts,
      [type]: Math.max(0, counts[type] + (hasReaction ? -1 : 1)),
      userReactions: updatedUserReactions,
    };
    updatedCounts.total = updatedCounts.LIKE + updatedCounts.HEART + updatedCounts.SAD + updatedCounts.ANGRY + updatedCounts.CLAP;
    setCounts(updatedCounts);

    try {
      const real = await DataService.toggleReaction(issueId, type);
      setCounts(real);
    } catch {
      // Keep optimistic or revert if needed
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 py-3 px-4 bg-slate-50 rounded-2xl border border-slate-100 animate-pulse">
        <div className="h-6 w-24 bg-slate-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-50 via-indigo-50/30 to-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#1E293B] flex items-center">
            Community Support & Reactions
          </h3>
          <p className="text-xs text-slate-500">Express your stance and support this concern</p>
        </div>
        <div className="text-xs font-bold text-indigo-700 bg-indigo-100/70 px-3 py-1 rounded-full border border-indigo-200">
          {counts.total} Total Reactions
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {REACTION_CONFIG.map(({ type, emoji, label }) => {
          const isActive = counts.userReactions.includes(type);
          const isAnimating = animatingType === type;
          const count = counts[type] || 0;

          return (
            <button
              key={type}
              onClick={() => handleToggleReaction(type)}
              className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
              } ${isAnimating ? 'animate-bounce' : ''}`}
            >
              <span className="text-base leading-none">{emoji}</span>
              <span>{label}</span>
              <span
                className={`ml-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
