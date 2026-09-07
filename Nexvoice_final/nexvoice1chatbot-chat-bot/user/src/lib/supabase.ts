import { createClient } from '@supabase/supabase-js';
import type { Issue, IssueReportInput, ContactMessageInput, ReactionType, ReactionCounts, IssueComment } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Helper to get or create persistent anonymous ID for reactions & rate-limiting
export const getAnonymousId = (): string => {
  let id = localStorage.getItem('nexvoice_anon_id');
  if (!id) {
    id = `anon-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('nexvoice_anon_id', id);
  }
  return id;
};

const getLocalIssues = (): Issue[] => {
  const stored = localStorage.getItem('nexvoice_issues_cache');
  if (!stored) return [];
  try { return JSON.parse(stored) as Issue[]; } catch { return []; }
};

const saveLocalIssues = (issues: Issue[]) => localStorage.setItem('nexvoice_issues_cache', JSON.stringify(issues));

// Helper for persistent local reaction storage fallback
const getLocalReactionsStore = (issueId: string): Array<{ anonymous_id: string; reaction_type: ReactionType }> => {
  const stored = localStorage.getItem(`nexvoice_reactions_${issueId}`);
  if (!stored) return [];
  try { return JSON.parse(stored); } catch { return []; }
};

const saveLocalReactionsStore = (issueId: string, store: Array<{ anonymous_id: string; reaction_type: ReactionType }>) => {
  localStorage.setItem(`nexvoice_reactions_${issueId}`, JSON.stringify(store));
};

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const DataService = {
  async fetchIssues(): Promise<Issue[]> {
    try {
      const res = await fetch(`${API_BASE}/issues`);
      if (res.ok) {
        const data = await res.json();
        return data as Issue[];
      }
    } catch {
      // Fallback
    }

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .or('status.eq.APPROVED,status.eq.PUBLISHED')
          .order('created_at', { ascending: false });
        if (!error && data) return data as Issue[];
      } catch (error) {
        console.warn('Supabase issue fetch failed:', error);
      }
    }

    const issues = getLocalIssues().filter((i) => i.status === 'APPROVED' || i.status === 'PUBLISHED');
    return issues.map((i) => {
      const store = getLocalReactionsStore(i.id);
      return {
        ...i,
        reactions_count: store.length,
      };
    });
  },

  async fetchIssueById(id: string): Promise<Issue | null> {
    try {
      const res = await fetch(`${API_BASE}/issues/${id}`);
      if (res.ok) {
        const data = await res.json();
        return data as Issue;
      }
    } catch {
      // Fallback
    }

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .or(`id.eq.${id},issue_number.eq.${id}`)
          .maybeSingle();
        if (!error && data && (data.status === 'APPROVED' || data.status === 'PUBLISHED')) return data as Issue;
      } catch (error) {
        console.warn('Supabase issue detail fetch failed:', error);
      }
    }
    const local = getLocalIssues().find((item) => item.id === id || item.issue_number === id);
    if (local && (local.status === 'APPROVED' || local.status === 'PUBLISHED')) {
      const store = getLocalReactionsStore(local.id);
      return {
        ...local,
        reactions_count: store.length,
      };
    }
    return null;
  },

  async fetchSimilarIssues(issueOrId: Issue | string, limit = 6): Promise<Issue[]> {
    const issueId = typeof issueOrId === 'string' ? issueOrId : issueOrId.id;
    try {
      const res = await fetch(`${API_BASE}/issues/${issueId}/similar`);
      if (res.ok) {
        const data = await res.json();
        return data as Issue[];
      }
    } catch {
      // Fallback
    }

    const current = typeof issueOrId === 'string' ? await this.fetchIssueById(issueOrId) : issueOrId;
    if (!current) return [];
    const issues = await this.fetchIssues();
    return issues
      .filter((candidate) => candidate.id !== current.id && (candidate.status === 'APPROVED' || candidate.status === 'PUBLISHED'))
      .map((candidate) => {
        let score = 0;
        if (candidate.category === current.category) score += 6;
        if (current.subcategory && candidate.subcategory === current.subcategory) score += 4;
        if (candidate.institution_name.trim().toLowerCase() === current.institution_name.trim().toLowerCase()) score += 5;
        if (candidate.city.trim().toLowerCase() === current.city.trim().toLowerCase()) score += 3;
        if (candidate.province.trim().toLowerCase() === current.province.trim().toLowerCase()) score += 1;
        return { candidate, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || new Date(b.candidate.created_at).getTime() - new Date(a.candidate.created_at).getTime())
      .slice(0, limit)
      .map(({ candidate }) => candidate);
  },

  async createIssue(issueData: Omit<Issue, 'id' | 'issue_number' | 'created_at' | 'status' | 'verification_status'>, documentFile: File | null): Promise<Issue> {
    try {
      const res = await fetch(`${API_BASE}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueData),
      });
      if (res.ok) {
        const created = await res.json();
        return created as Issue;
      }
    } catch {
      // Fallback
    }

    const issue_number = `NV-2026-${String(getLocalIssues().length + 1).padStart(6, '0')}`;
    if (supabase) {
      try {
        const { data: newIssue, error: issueError } = await supabase.from('issues').insert({ ...issueData, issue_number, status: 'PENDING_VERIFICATION' }).select().single();
        if (!issueError && newIssue) {
          if (documentFile) {
            const filePath = `${newIssue.id}/${Date.now()}_${documentFile.name}`;
            const { error: uploadError } = await supabase.storage.from('identity-documents').upload(filePath, documentFile);
            if (!uploadError) await supabase.from('issue_verification').insert({ issue_id: newIssue.id, document_path: filePath, verification_status: 'PENDING' });
          }
          return { ...newIssue, verification_status: 'PENDING' } as Issue;
        }
      } catch (error) { console.warn('Supabase issue creation failed, using local store:', error); }
    }
    const newLocalIssue: Issue = { ...issueData, id: `local-${Date.now()}`, issue_number, status: 'PENDING_VERIFICATION', verification_status: 'PENDING', created_at: new Date().toISOString() };
    saveLocalIssues([newLocalIssue, ...getLocalIssues()]);
    return newLocalIssue;
  },

  // REAL REACTION INTEGRATION WITH SAFE FALLBACK
  async fetchReactions(issueId: string): Promise<ReactionCounts> {
    const anonId = getAnonymousId();
    try {
      const res = await fetch(`${API_BASE}/issues/${issueId}/reactions?anonymous_id=${anonId}`);
      if (res.ok) {
        return (await res.json()) as ReactionCounts;
      }
    } catch {
      // Fallback
    }

    if (supabase) {
      try {
        const { data, error } = await supabase.from('issue_reactions').select('*').eq('issue_id', issueId);
        if (!error && data) {
          const counts: ReactionCounts = {
            LIKE: 0, HEART: 0, SAD: 0, ANGRY: 0, CLAP: 0,
            total: data.length,
            userReactions: [],
          };
          data.forEach((r: { reaction_type: ReactionType; anonymous_id: string }) => {
            if (counts[r.reaction_type] !== undefined) counts[r.reaction_type]++;
            if (r.anonymous_id === anonId) counts.userReactions.push(r.reaction_type);
          });
          return counts;
        }
      } catch (error) {
        console.warn('Supabase reactions fetch failed:', error);
      }
    }

    // Local storage reaction store fallback
    const store = getLocalReactionsStore(issueId);
    const counts: ReactionCounts = {
      LIKE: 0, HEART: 0, SAD: 0, ANGRY: 0, CLAP: 0,
      total: store.length,
      userReactions: [],
    };
    store.forEach((r) => {
      if (counts[r.reaction_type] !== undefined) counts[r.reaction_type]++;
      if (r.anonymous_id === anonId) counts.userReactions.push(r.reaction_type);
    });
    return counts;
  },

  async toggleReaction(issueId: string, reactionType: ReactionType): Promise<ReactionCounts> {
    const anonId = getAnonymousId();
    try {
      const res = await fetch(`${API_BASE}/issues/${issueId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction_type: reactionType, anonymous_id: anonId }),
      });
      if (res.ok) {
        return (await res.json()) as ReactionCounts;
      }
    } catch {
      // Fallback
    }

    if (supabase) {
      try {
        const { data: existing, error } = await supabase
          .from('issue_reactions')
          .select('*')
          .eq('issue_id', issueId)
          .eq('anonymous_id', anonId)
          .maybeSingle();

        if (!error) {
          if (existing) {
            if (existing.reaction_type === reactionType) {
              await supabase.from('issue_reactions').delete().eq('id', existing.id);
            } else {
              await supabase.from('issue_reactions').update({ reaction_type: reactionType }).eq('id', existing.id);
            }
          } else {
            await supabase.from('issue_reactions').insert({ issue_id: issueId, anonymous_id: anonId, reaction_type: reactionType });
          }
          return this.fetchReactions(issueId);
        }
      } catch (err) {
        console.warn('Supabase toggleReaction error:', err);
      }
    }

    // Local fallback update
    const store = getLocalReactionsStore(issueId);
    const idx = store.findIndex((r) => r.anonymous_id === anonId);
    if (idx !== -1) {
      if (store[idx].reaction_type === reactionType) {
        store.splice(idx, 1);
      } else {
        store[idx].reaction_type = reactionType;
      }
    } else {
      store.push({ anonymous_id: anonId, reaction_type: reactionType });
    }
    saveLocalReactionsStore(issueId, store);
    return this.fetchReactions(issueId);
  },

  // REAL COMMENT INTEGRATION
  async fetchComments(issueId: string): Promise<IssueComment[]> {
    const anonId = getAnonymousId();
    try {
      const res = await fetch(`${API_BASE}/issues/${issueId}/comments?anonymous_id=${anonId}`);
      if (res.ok) {
        return (await res.json()) as IssueComment[];
      }
    } catch {
      // Fallback
    }

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('issue_comments')
          .select('*')
          .eq('issue_id', issueId)
          .eq('status', 'VISIBLE')
          .order('created_at', { ascending: true });
        if (!error && data) return data as IssueComment[];
      } catch (error) {
        console.warn('Supabase comments fetch failed:', error);
      }
    }

    return [];
  },

  async postComment(issueId: string, authorName: string, content: string): Promise<IssueComment> {
    try {
      const res = await fetch(`${API_BASE}/issues/${issueId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author_name: authorName, content }),
      });
      if (res.ok) {
        return (await res.json()) as IssueComment;
      }
    } catch {
      // Fallback
    }

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('issue_comments')
          .insert({ issue_id: issueId, author_name: authorName, content, status: 'VISIBLE', likes_count: 0, reports_count: 0 })
          .select()
          .single();
        if (!error && data) return data as IssueComment;
      } catch (err) {
        console.warn('Supabase postComment failed:', err);
      }
    }

    return {
      id: `c-${Date.now()}`,
      issue_id: issueId,
      author_name: authorName,
      content,
      status: 'VISIBLE',
      likes_count: 0,
      reports_count: 0,
      created_at: new Date().toISOString(),
    };
  },

  async toggleCommentLike(commentId: string): Promise<{ liked: boolean; likes_count: number }> {
    const anonId = getAnonymousId();
    try {
      const res = await fetch(`${API_BASE}/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anonymous_id: anonId }),
      });
      if (res.ok) {
        return (await res.json()) as { liked: boolean; likes_count: number };
      }
    } catch {
      // Fallback
    }

    return { liked: true, likes_count: 1 };
  },

  async reportComment(commentId: string, reason: string, description?: string): Promise<boolean> {
    const anonId = getAnonymousId();
    try {
      const res = await fetch(`${API_BASE}/comments/${commentId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, description, anonymous_id: anonId }),
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }
    return true;
  },

  // REAL REPORT PIPELINE (ONLY CREATES REPORT RECORD — DOES NOT UNPUBLISH ISSUE)
  async reportIssue(report: IssueReportInput): Promise<boolean> {
    const anonId = getAnonymousId();
    try {
      const res = await fetch(`${API_BASE}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...report, reporter_id: anonId }),
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }

    if (supabase) {
      try {
        const { error } = await supabase.from('issue_reports').insert({
          ...report,
          reporter_id: anonId,
          status: 'PENDING',
        });
        return !error;
      } catch (error) { console.warn('Supabase report submission failed:', error); }
    }
    return true;
  },

  async sendContactMessage(contact: ContactMessageInput): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }
    if (supabase) {
      try {
        const { error } = await supabase.from('contact_messages').insert(contact);
        if (!error) return true;
      } catch (error) { console.warn('Supabase contact failed:', error); }
    }
    return true;
  },
};
