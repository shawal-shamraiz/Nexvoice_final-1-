import React, { useState, useEffect } from 'react';
import type { IssueComment } from '../types';
import { DataService } from '../lib/supabase';
import { MessageSquare, ThumbsUp, Flag, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CommentsSectionProps {
  issueId: string;
  onReportComment?: (commentId: string) => void;
}

const PROFANITY_LIST = ['abuse', 'spam', 'hate', 'badword', 'offensive'];

export const CommentsSection: React.FC<CommentsSectionProps> = ({ issueId, onReportComment }) => {
  const [comments, setComments] = useState<IssueComment[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [lastSubmittedAt, setLastSubmittedAt] = useState<number>(0);

  useEffect(() => {
    let active = true;
    DataService.fetchComments(issueId)
      .then((data) => {
        if (active) setComments(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [issueId]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!authorName.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (!content.trim()) {
      setErrorMessage('Please write a comment before posting.');
      return;
    }

    if (content.length > 500) {
      setErrorMessage('Comment exceeds maximum length of 500 characters.');
      return;
    }

    // Basic profanity check
    const lowerContent = content.toLowerCase();
    const containsProfanity = PROFANITY_LIST.some((word) => lowerContent.includes(word));
    if (containsProfanity) {
      setErrorMessage('Your comment contains inappropriate language. Please keep comments respectful.');
      return;
    }

    // Rate limit check (10 seconds between comments)
    const now = Date.now();
    if (now - lastSubmittedAt < 10000) {
      setErrorMessage('Please wait a few seconds before posting another comment.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await DataService.postComment(issueId, authorName.trim(), content.trim());
      setComments((prev) => [...prev, created]);
      setContent('');
      setLastSubmittedAt(now);
      setSuccessMessage('Your comment has been posted!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setErrorMessage('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const userLiked = !c.user_liked;
          return {
            ...c,
            user_liked: userLiked,
            likes_count: Math.max(0, c.likes_count + (userLiked ? 1 : -1)),
          };
        }
        return c;
      })
    );

    try {
      await DataService.toggleCommentLike(commentId);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-[#1E293B] flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-indigo-600" />
          Community Discussion ({comments.length})
        </h2>
        <span className="text-xs text-slate-500 font-medium">Public Discussion Feed</span>
      </div>

      {/* Comment Form */}
      <form onSubmit={handlePostComment} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="sm:w-1/3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Your Name / Alias
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Ali Raza"
              maxLength={100}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            />
          </div>
          <div className="sm:w-2/3">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Write a Comment
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                {content.length}/500 chars
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              placeholder="Share your experience, insights, or support for this concern..."
              maxLength={500}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white resize-none"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-center text-xs font-medium text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 mr-2 shrink-0 text-emerald-600" />
            {successMessage}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-6 text-xs text-slate-400 font-medium">Loading comments...</div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    {comment.author_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-[#1E293B]">{comment.author_name}</span>
                  <span className="text-[11px] text-slate-400">
                    • {new Date(comment.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                      comment.user_liked
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5 mr-1" />
                    {comment.likes_count}
                  </button>

                  {onReportComment && (
                    <button
                      onClick={() => onReportComment(comment.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded"
                      title="Report Comment"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed pl-9 whitespace-pre-line">
                {comment.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <p className="text-xs font-medium text-slate-500">No comments yet on this concern.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Be the first student to comment above!</p>
          </div>
        )}
      </div>
    </div>
  );
};
