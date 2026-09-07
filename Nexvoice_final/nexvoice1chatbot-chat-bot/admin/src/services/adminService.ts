import { supabase } from '../lib/supabase';
import type { Issue, IssueModerationHistory, Profile, DashboardStats, DuplicateMatch, ContentReport, ReportStatus, IssueComment } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getLocalIssues = (): Issue[] => {
  const stored = localStorage.getItem('nexvoice_issues_cache');
  if (!stored) return [];
  try { return JSON.parse(stored) as Issue[]; } catch { return []; }
};

const saveLocalIssues = (issues: Issue[]) => localStorage.setItem('nexvoice_issues_cache', JSON.stringify(issues));

const getLocalHistory = (): IssueModerationHistory[] => {
  const stored = localStorage.getItem('nexvoice_mock_history');
  if (!stored) return [];
  try { return JSON.parse(stored) as IssueModerationHistory[]; } catch { return []; }
};

const saveLocalHistory = (history: IssueModerationHistory[]) => {
  localStorage.setItem('nexvoice_mock_history', JSON.stringify(history));
};

const getAuthHeaders = async (): Promise<HeadersInit> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
    } catch {
      // Ignore
    }
  }
  const storedAdmin = localStorage.getItem('nexvoice_admin_session');
  if (storedAdmin) {
    try {
      const admin = JSON.parse(storedAdmin) as Profile;
      if (admin.email) headers['x-admin-email'] = admin.email;
    } catch {
      // Ignore
    }
  }
  return headers;
};

export const AdminService = {
  async signIn(email: string, password: string) {
    if (!supabase) {
      if ((email === 'ahsan@nexvoice.org' || email === 'shawal@nexvoice.org' || email.includes('admin')) && password.length >= 6) {
        const mockProfile: Profile = {
          id: email.includes('shawal') ? 'shawal-uuid' : 'ahsan-uuid',
          full_name: email.includes('shawal') ? 'Shawal' : 'Ahsan Iqbal',
          role: 'ADMIN',
          email,
        };
        localStorage.setItem('nexvoice_admin_session', JSON.stringify(mockProfile));
        return { data: { user: { id: mockProfile.id, email } }, error: null, profile: mockProfile };
      }
      return { data: null, error: { message: 'Invalid admin credentials' }, profile: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return { data: null, error, profile: null };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (!profile || profile.role !== 'ADMIN') {
      await supabase.auth.signOut();
      return { data: null, error: { message: 'Unauthorized: User is not an admin' }, profile: null };
    }

    const fullProfile = { ...profile, email: data.user.email } as Profile;
    localStorage.setItem('nexvoice_admin_session', JSON.stringify(fullProfile));
    return { data, error: null, profile: fullProfile };
  },

  async signOut() {
    localStorage.removeItem('nexvoice_admin_session');
    if (supabase) {
      await supabase.auth.signOut();
    }
  },

  async getCurrentAdminProfile(): Promise<Profile | null> {
    if (!supabase) {
      const stored = localStorage.getItem('nexvoice_admin_session');
      return stored ? (JSON.parse(stored) as Profile) : null;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const stored = localStorage.getItem('nexvoice_admin_session');
      return stored ? (JSON.parse(stored) as Profile) : null;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    return profile ? ({ ...profile, email: user.email } as Profile) : null;
  },

  async updatePassword(newPassword: string) {
    if (supabase) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return true;
    }
    return true;
  },

  async fetchAllIssues(): Promise<Issue[]> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/issues`, { headers });
      if (res.ok) {
        return (await res.json()) as Issue[];
      }
    } catch {
      // Fallback
    }

    if (supabase) {
      try {
        const { data, error } = await supabase.from('issues').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as Issue[];
      } catch (err) {
        console.warn('Supabase fetchAllIssues failed:', err);
      }
    }
    return getLocalIssues();
  },

  async fetchIssueById(id: string): Promise<Issue | null> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/issues/${id}`, { headers });
      if (res.ok) {
        return (await res.json()) as Issue;
      }
    } catch {
      // Fallback
    }

    if (supabase) {
      try {
        const { data, error } = await supabase.from('issues').select('*').or(`id.eq.${id},issue_number.eq.${id}`).maybeSingle();
        if (!error && data) return data as Issue;
      } catch (err) {
        console.warn('Supabase fetchIssueById failed:', err);
      }
    }
    const issues = getLocalIssues();
    return issues.find((i) => i.id === id || i.issue_number === id) || null;
  },

  async fetchDuplicates(issueId: string): Promise<DuplicateMatch[]> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/issues/${issueId}/duplicates`, { headers });
      if (res.ok) {
        return (await res.json()) as DuplicateMatch[];
      }
    } catch {
      // Fallback
    }
    return [];
  },

  async fetchVerificationDocument(issueId: string): Promise<string | null> {
    if (supabase) {
      try {
        const { data: record } = await supabase.from('issue_verification').select('document_path').eq('issue_id', issueId).maybeSingle();
        if (record?.document_path) {
          const { data: signedUrlData } = await supabase.storage.from('identity-documents').createSignedUrl(record.document_path, 3600);
          return signedUrlData?.signedUrl || null;
        }
      } catch (err) {
        console.warn('Failed to fetch verification document URL:', err);
      }
    }
    return null;
  },

  async fetchModerationHistory(issueId: string): Promise<IssueModerationHistory[]> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/issues/${issueId}/history`, { headers });
      if (res.ok) {
        return (await res.json()) as IssueModerationHistory[];
      }
    } catch {
      // Fallback
    }

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('issue_moderation_history')
          .select('*')
          .eq('issue_id', issueId)
          .order('created_at', { ascending: true });
        if (!error && data) return data as IssueModerationHistory[];
      } catch (err) {
        console.warn('Failed to fetch moderation history:', err);
      }
    }
    return getLocalHistory().filter((h) => h.issue_id === issueId);
  },

  async approveIssue(issueId: string, admin: Profile, note?: string): Promise<boolean> {
    const timestamp = new Date().toISOString();
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/issues/${issueId}/approve`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ note }),
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }

    if (supabase) {
      try {
        const { error: updateErr } = await supabase.from('issues').update({
          status: 'APPROVED',
          approved_by: admin.id,
          approved_at: timestamp,
          updated_at: timestamp,
        }).eq('id', issueId);

        if (!updateErr) {
          await supabase.from('issue_moderation_history').insert({
            issue_id: issueId,
            action: 'APPROVED',
            admin_id: admin.id,
            admin_name: admin.full_name,
            note: note || 'Issue approved for public publication.',
          });
          return true;
        }
      } catch (err) {
        console.warn('Supabase approveIssue failed:', err);
      }
    }

    const issues = getLocalIssues();
    const idx = issues.findIndex((i) => i.id === issueId);
    if (idx !== -1) {
      issues[idx] = {
        ...issues[idx],
        status: 'APPROVED',
        approved_by: admin.id,
        approved_at: timestamp,
        updated_at: timestamp,
      };
      saveLocalIssues(issues);

      const history = getLocalHistory();
      history.push({
        id: `hist-${Date.now()}`,
        issue_id: issueId,
        action: 'APPROVED',
        admin_id: admin.id,
        admin_name: admin.full_name,
        note: note || 'Issue approved for public publication.',
        created_at: timestamp,
      });
      saveLocalHistory(history);
      return true;
    }
    return false;
  },

  async rejectIssue(issueId: string, admin: Profile, reason: string): Promise<boolean> {
    const timestamp = new Date().toISOString();
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/issues/${issueId}/reject`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ reason }),
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }

    if (supabase) {
      try {
        const { error: updateErr } = await supabase.from('issues').update({
          status: 'REJECTED',
          rejected_by: admin.id,
          rejected_at: timestamp,
          rejection_reason: reason,
          updated_at: timestamp,
        }).eq('id', issueId);

        if (!updateErr) {
          await supabase.from('issue_moderation_history').insert({
            issue_id: issueId,
            action: 'REJECTED',
            admin_id: admin.id,
            admin_name: admin.full_name,
            note: reason,
          });
          return true;
        }
      } catch (err) {
        console.warn('Supabase rejectIssue failed:', err);
      }
    }

    const issues = getLocalIssues();
    const idx = issues.findIndex((i) => i.id === issueId);
    if (idx !== -1) {
      issues[idx] = {
        ...issues[idx],
        status: 'REJECTED',
        rejected_by: admin.id,
        rejected_at: timestamp,
        rejection_reason: reason,
        updated_at: timestamp,
      };
      saveLocalIssues(issues);

      const history = getLocalHistory();
      history.push({
        id: `hist-${Date.now()}`,
        issue_id: issueId,
        action: 'REJECTED',
        admin_id: admin.id,
        admin_name: admin.full_name,
        note: reason,
        created_at: timestamp,
      });
      saveLocalHistory(history);
      return true;
    }
    return false;
  },

  async removeIssue(issueId: string, admin: Profile, reason: string): Promise<boolean> {
    const timestamp = new Date().toISOString();
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/issues/${issueId}/remove`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ reason }),
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }

    if (supabase) {
      try {
        const { error: updateErr } = await supabase.from('issues').update({
          status: 'REMOVED',
          removed_by: admin.id,
          removed_at: timestamp,
          removal_reason: reason,
          updated_at: timestamp,
        }).eq('id', issueId);

        if (!updateErr) {
          await supabase.from('issue_moderation_history').insert({
            issue_id: issueId,
            action: 'REMOVED',
            admin_id: admin.id,
            admin_name: admin.full_name,
            note: reason,
          });
          return true;
        }
      } catch (err) {
        console.warn('Supabase removeIssue failed:', err);
      }
    }

    const issues = getLocalIssues();
    const idx = issues.findIndex((i) => i.id === issueId);
    if (idx !== -1) {
      issues[idx] = {
        ...issues[idx],
        status: 'REMOVED',
        removed_by: admin.id,
        removed_at: timestamp,
        removal_reason: reason,
        updated_at: timestamp,
      };
      saveLocalIssues(issues);

      const history = getLocalHistory();
      history.push({
        id: `hist-${Date.now()}`,
        issue_id: issueId,
        action: 'REMOVED',
        admin_id: admin.id,
        admin_name: admin.full_name,
        note: reason,
        created_at: timestamp,
      });
      saveLocalHistory(history);
      return true;
    }
    return false;
  },

  async restoreIssue(issueId: string, admin: Profile, note?: string): Promise<boolean> {
    const timestamp = new Date().toISOString();
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/issues/${issueId}/restore`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ note }),
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }

    if (supabase) {
      try {
        const { error: updateErr } = await supabase.from('issues').update({
          status: 'APPROVED',
          approved_by: admin.id,
          approved_at: timestamp,
          updated_at: timestamp,
        }).eq('id', issueId);

        if (!updateErr) {
          await supabase.from('issue_moderation_history').insert({
            issue_id: issueId,
            action: 'RESTORED',
            admin_id: admin.id,
            admin_name: admin.full_name,
            note: note || 'Restored issue to public visibility.',
          });
          return true;
        }
      } catch (err) {
        console.warn('Supabase restoreIssue failed:', err);
      }
    }

    const issues = getLocalIssues();
    const idx = issues.findIndex((i) => i.id === issueId);
    if (idx !== -1) {
      issues[idx] = {
        ...issues[idx],
        status: 'APPROVED',
        approved_by: admin.id,
        approved_at: timestamp,
        updated_at: timestamp,
      };
      saveLocalIssues(issues);

      const history = getLocalHistory();
      history.push({
        id: `hist-${Date.now()}`,
        issue_id: issueId,
        action: 'RESTORED',
        admin_id: admin.id,
        admin_name: admin.full_name,
        note: note || 'Restored issue to public visibility.',
        created_at: timestamp,
      });
      saveLocalHistory(history);
      return true;
    }
    return false;
  },

  // REAL REPORTS METHODS (PERSISTS DISMISSED/RESOLVED STATUS, REVIEWED_BY, REVIEWED_AT)
  async fetchReports(): Promise<ContentReport[]> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/reports`, { headers });
      if (res.ok) {
        return (await res.json()) as ContentReport[];
      }
    } catch {
      // Fallback
    }

    if (supabase) {
      try {
        const { data, error } = await supabase.from('issue_reports').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as ContentReport[];
      } catch (err) {
        console.warn('Supabase fetchReports failed:', err);
      }
    }

    return [];
  },

  async updateReportStatus(reportId: string, status: ReportStatus, adminId?: string): Promise<boolean> {
    const timestamp = new Date().toISOString();
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/reports/${reportId}/status`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ status }),
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }

    if (supabase) {
      try {
        const updateData: Record<string, any> = {
          status,
          reviewed_at: timestamp,
        };
        if (adminId) updateData.reviewed_by = adminId;
        const { error } = await supabase.from('issue_reports').update(updateData).eq('id', reportId);
        return !error;
      } catch (err) {
        console.warn('Supabase updateReportStatus failed:', err);
        return false;
      }
    }

    return true;
  },

  // COMMENTS MODERATION
  async fetchAllComments(): Promise<IssueComment[]> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/comments`, { headers });
      if (res.ok) {
        return (await res.json()) as IssueComment[];
      }
    } catch {
      // Fallback
    }

    if (supabase) {
      try {
        const { data } = await supabase.from('issue_comments').select('*').order('created_at', { ascending: false });
        if (data) return data as IssueComment[];
      } catch (err) {
        console.warn('Supabase fetchAllComments failed:', err);
      }
    }

    return [];
  },

  async deleteComment(commentId: string): Promise<boolean> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/comments/${commentId}`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }

    if (supabase) {
      try {
        const { error } = await supabase.from('issue_comments').update({ status: 'REMOVED' }).eq('id', commentId);
        return !error;
      } catch (err) {
        console.warn('Supabase deleteComment failed:', err);
      }
    }

    return true;
  },

  // REAL DASHBOARD STATS (NO HARDCODED MOCK FALLBACKS)
  async fetchDashboardStats(): Promise<DashboardStats> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/dashboard`, { headers });
      if (res.ok) {
        return (await res.json()) as DashboardStats;
      }
    } catch {
      // Fallback
    }

    const issues = await this.fetchAllIssues();
    const totalIssues = issues.length;
    const pendingVerification = issues.filter((i) => i.status === 'PENDING_VERIFICATION').length;
    const approved = issues.filter((i) => i.status === 'APPROVED' || i.status === 'PUBLISHED').length;
    const rejected = issues.filter((i) => i.status === 'REJECTED').length;
    const removed = issues.filter((i) => i.status === 'REMOVED').length;
    const reportedIssues = issues.filter((i) => i.status === 'REPORTED').length;

    const reports = await this.fetchReports();
    const pendingReports = reports.filter((r) => r.status === 'PENDING').length;

    const approvedIssues = issues.filter((i) => i.status === 'APPROVED' || i.status === 'PUBLISHED');

    const catMap = new Map<string, number>();
    issues.forEach((i) => {
      catMap.set(i.category, (catMap.get(i.category) || 0) + 1);
    });
    const categoryDistribution = Array.from(catMap.entries()).map(([name, count]) => ({ name, count }));

    const provMap = new Map<string, number>();
    issues.forEach((i) => {
      provMap.set(i.province, (provMap.get(i.province) || 0) + 1);
    });
    const provinceDistribution = Array.from(provMap.entries()).map(([name, count]) => ({ name, count }));

    const instMap = new Map<string, number>();
    issues.forEach((i) => {
      instMap.set(i.institution_name, (instMap.get(i.institution_name) || 0) + 1);
    });
    const institutionDistribution = Array.from(instMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const statusDistribution = [
      { name: 'Pending Verification', count: pendingVerification },
      { name: 'Approved', count: approved },
      { name: 'Rejected', count: rejected },
      { name: 'Removed', count: removed },
      { name: 'Reported', count: reportedIssues },
    ];

    const mostSupportedIssues = approvedIssues
      .map((i) => ({
        id: i.id,
        issue_number: i.issue_number,
        title: i.title,
        category: i.category,
        reactionsCount: i.reactions_count || 0,
      }))
      .sort((a, b) => b.reactionsCount - a.reactionsCount)
      .slice(0, 5);

    const mostCommentedIssues = approvedIssues
      .map((i) => ({
        id: i.id,
        issue_number: i.issue_number,
        title: i.title,
        category: i.category,
        commentsCount: i.comments_count || 0,
      }))
      .sort((a, b) => b.commentsCount - a.commentsCount)
      .slice(0, 5);

    const daysMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      daysMap.set(dateStr, 0);
    }
    issues.forEach((issue) => {
      const dateStr = new Date(issue.created_at).toISOString().split('T')[0];
      if (daysMap.has(dateStr)) {
        daysMap.set(dateStr, (daysMap.get(dateStr) || 0) + 1);
      }
    });
    const issuesOverTime = Array.from(daysMap.entries()).map(([date, count]) => ({ date, count }));

    let totalReactions = 0;
    let totalComments = 0;

    if (supabase) {
      try {
        const [rRes, cRes] = await Promise.all([
          supabase.from('issue_reactions').select('id', { count: 'exact' }),
          supabase.from('issue_comments').select('id', { count: 'exact' }).eq('status', 'VISIBLE'),
        ]);
        if (rRes.count !== null) totalReactions = rRes.count;
        if (cRes.count !== null) totalComments = cRes.count;
      } catch {
        // Fallback
      }
    }

    return {
      totalIssues,
      pendingVerification,
      approved,
      rejected,
      removed,
      reportedIssues,
      totalComments,
      totalReactions,
      pendingReports,
      categoryDistribution,
      provinceDistribution,
      institutionDistribution,
      statusDistribution,
      mostSupportedIssues,
      mostCommentedIssues,
      issuesOverTime,
    };
  },

  // CONTACT MESSAGES INBOX (ADMIN ONLY)
  async fetchContactMessages(): Promise<Array<{ name: string; email: string; subject: string; message: string; created_at?: string }>> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/contact-messages`, { headers });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to Supabase direct query
    }

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase fetchContactMessages failed:', err);
      }
    }

    return [];
  },
};
