import { createClient } from '@supabase/supabase-js';
import type { Issue, IssueReportInput, ContactMessageInput } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

const getLocalIssues = (): Issue[] => {
  const stored = localStorage.getItem('nexvoice_issues_cache');
  if (!stored) return [];
  try { return JSON.parse(stored) as Issue[]; } catch { return []; }
};

const resolveIssue = (issues: Issue[], id: string) => issues.find((item) => item.id === id || item.issue_number === id) || null;

export const DataService = {
  async fetchIssues(): Promise<Issue[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('issues').select('*').or('status.eq.APPROVED,status.eq.PUBLISHED').order('created_at', { ascending: false });
        if (!error && data) return data as Issue[];
      } catch (error) { console.warn('Supabase issue fetch failed:', error); }
    }
    return getLocalIssues().filter((i) => i.status === 'APPROVED' || i.status === 'PUBLISHED');
  },

  async fetchIssueById(id: string): Promise<Issue | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('issues').select('*').or(`id.eq.${id},issue_number.eq.${id}`).maybeSingle();
        if (!error && data && (data.status === 'APPROVED' || data.status === 'PUBLISHED')) return data as Issue;
      } catch (error) { console.warn('Supabase issue detail fetch failed:', error); }
    }
    const local = resolveIssue(getLocalIssues(), id);
    if (local && (local.status === 'APPROVED' || local.status === 'PUBLISHED')) return local;
    return null;
  },

  async fetchSimilarIssues(issueOrId: Issue | string, limit = 6): Promise<Issue[]> {
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
      } catch (error) { console.warn('Supabase issue creation failed:', error); }
    }
    const newLocalIssue: Issue = { ...issueData, id: `local-${Date.now()}`, issue_number, status: 'PENDING_VERIFICATION', verification_status: 'PENDING', created_at: new Date().toISOString() };
    return newLocalIssue;
  },

  async reportIssue(report: IssueReportInput): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase.from('issue_reports').insert(report);
        return !error;
      } catch (error) { console.warn('Supabase report submission failed:', error); return false; }
    }
    return true;
  },

  async sendContactMessage(contact: ContactMessageInput): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase.from('contact_messages').insert(contact);
        if (!error) return true;
      } catch (error) { console.warn('Supabase contact failed:', error); }
    }
    return true;
  },
};
