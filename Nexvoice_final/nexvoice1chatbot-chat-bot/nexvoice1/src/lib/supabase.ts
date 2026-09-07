import { createClient } from '@supabase/supabase-js';
import type { Issue, IssueReportInput, ContactMessageInput } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial mock data for offline preview & immediate testing
const INITIAL_MOCK_ISSUES: Issue[] = [
  {
    id: 'mock-1',
    issue_number: 'NV-2026-000001',
    submission_type: 'STUDENT',
    name: 'Ayesha Khan',
    institution_name: 'National University of Sciences and Technology',
    education_level: 'Undergraduate',
    program: 'BS Computer Science',
    province: 'Islamabad Capital Territory',
    city: 'Islamabad',
    title: 'Delay in Merit Scholarship Disbursement for Fall 2025',
    description: 'The merit-based scholarship funds approved for Fall 2025 have not been disbursed to student accounts for over 4 months. Many students are relying on these funds to cover semester tuition fees and hostel charges.',
    category: 'Scholarships',
    subcategory: 'Merit Scholarship',
    location: 'H-12 Campus, Islamabad',
    is_anonymous: true,
    status: 'PUBLISHED',
    verification_status: 'PENDING',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock-2',
    issue_number: 'NV-2026-000002',
    submission_type: 'INSTITUTION_REPRESENTATIVE',
    name: 'Dr. Tariq Mahmood',
    institution_name: 'University of Engineering and Technology',
    role: 'Assistant Professor / Academic Coordinator',
    province: 'Punjab',
    city: 'Lahore',
    title: 'Outdated Laboratory Equipment in Electrical Engineering Department',
    description: 'The core power electronics lab equipment requires urgent hardware upgrades. Current oscilloscopes and power modules are faulty, affecting mandatory practical sessions for over 400 engineering students.',
    category: 'Facilities',
    subcategory: 'Lab Equipment',
    location: 'Electrical Engineering Block, Lahore',
    is_anonymous: false,
    status: 'PUBLISHED',
    verification_status: 'PENDING',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock-3',
    issue_number: 'NV-2026-000003',
    submission_type: 'STUDENT',
    name: 'Hamza Ali',
    institution_name: 'University of Karachi',
    education_level: 'Postgraduate',
    program: 'MPhil Chemistry',
    province: 'Sindh',
    city: 'Karachi',
    title: 'Lack of Shuttle Bus Services During Evening Classes',
    description: 'Campus shuttle buses discontinue service after 4:00 PM, leaving evening students with severe transportation challenges and safety concerns when leaving campus late in the evening.',
    category: 'Transportation',
    subcategory: 'Bus Schedule',
    location: 'Main Campus Gate 1 & 2',
    is_anonymous: true,
    status: 'PUBLISHED',
    verification_status: 'PENDING',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Helper to access mock storage
const getLocalIssues = (): Issue[] => {
  const stored = localStorage.getItem('nexvoice_mock_issues');
  if (!stored) {
    localStorage.setItem('nexvoice_mock_issues', JSON.stringify(INITIAL_MOCK_ISSUES));
    return INITIAL_MOCK_ISSUES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MOCK_ISSUES;
  }
};

const saveLocalIssues = (issues: Issue[]) => {
  localStorage.setItem('nexvoice_mock_issues', JSON.stringify(issues));
};

// Data service combining Supabase + Local Storage fallback
export const DataService = {
  async fetchIssues(): Promise<Issue[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data as Issue[];
        }
      } catch (err) {
        console.warn('Supabase fetch failed, using local store:', err);
      }
    }
    return getLocalIssues();
  },

  async fetchIssueById(id: string): Promise<Issue | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return data as Issue;
        }
      } catch (err) {
        console.warn('Supabase fetchById failed, trying local store:', err);
      }
    }
    const issues = getLocalIssues();
    return issues.find(i => i.id === id || i.issue_number === id) || null;
  },

  async createIssue(
    issueData: Omit<Issue, 'id' | 'issue_number' | 'created_at' | 'status' | 'verification_status'>,
    documentFile: File | null
  ): Promise<Issue> {
    const issuesCount = getLocalIssues().length + 1;
    const padNum = String(issuesCount).padStart(6, '0');
    const issue_number = `NV-2026-${padNum}`;

    if (supabase) {
      try {
        // 1. Insert issue row
        const { data: newIssue, error: issueError } = await supabase
          .from('issues')
          .insert({
            ...issueData,
            issue_number,
            status: 'PUBLISHED'
          })
          .select()
          .single();

        if (!issueError && newIssue) {
          // 2. Upload document to private storage bucket if available
          if (documentFile) {
            const filePath = `${newIssue.id}/${Date.now()}_${documentFile.name}`;
            const { error: uploadError } = await supabase
              .storage
              .from('identity-documents')
              .upload(filePath, documentFile);

            if (!uploadError) {
              // 3. Record verification row
              await supabase.from('issue_verification').insert({
                issue_id: newIssue.id,
                document_path: filePath,
                verification_status: 'PENDING'
              });
            }
          }
          return { ...newIssue, verification_status: 'PENDING' } as Issue;
        }
      } catch (err) {
        console.warn('Supabase insert failed, storing locally:', err);
      }
    }

    // Local fallback creation
    const newLocalIssue: Issue = {
      ...issueData,
      id: `local-${Date.now()}`,
      issue_number,
      status: 'PUBLISHED',
      verification_status: 'PENDING',
      created_at: new Date().toISOString()
    };

    const currentLocal = getLocalIssues();
    const updated = [newLocalIssue, ...currentLocal];
    saveLocalIssues(updated);
    return newLocalIssue;
  },

  async reportIssue(report: IssueReportInput): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('issue_reports')
          .insert(report);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase report failed:', err);
      }
    }
    // Local fallback log
    const reports = JSON.parse(localStorage.getItem('nexvoice_mock_reports') || '[]');
    reports.push({ ...report, created_at: new Date().toISOString() });
    localStorage.setItem('nexvoice_mock_reports', JSON.stringify(reports));
    return true;
  },

  async fetchSimilarIssues(currentIssue: Issue): Promise<Issue[]> {
    const allIssues = await this.fetchIssues();

    // Never show current issue itself in similar issues
    const candidateIssues = allIssues.filter(
      (issue) => issue.id !== currentIssue.id && issue.issue_number !== currentIssue.issue_number
    );

    // Score candidates based on genuine overlap in available metadata
    const scoredCandidates = candidateIssues.map((candidate) => {
      let score = 0;

      const sameCategory = candidate.category === currentIssue.category;
      const sameInstitution =
        candidate.institution_name.trim().toLowerCase() ===
        currentIssue.institution_name.trim().toLowerCase();
      const sameCity =
        candidate.city.trim().toLowerCase() === currentIssue.city.trim().toLowerCase();
      const sameSubcategory =
        Boolean(candidate.subcategory && currentIssue.subcategory) &&
        candidate.subcategory?.trim().toLowerCase() === currentIssue.subcategory?.trim().toLowerCase();
      const sameProvince =
        candidate.province.trim().toLowerCase() === currentIssue.province.trim().toLowerCase();

      // Highest relevance: Same institution + same category -> 5 pts
      if (sameInstitution && sameCategory) {
        score += 5;
      } else if (sameCategory && sameCity) {
        // Strong relevance: Same category + same city -> 4 pts
        score += 4;
      } else if (sameCategory) {
        // Moderate relevance: Same category -> 2 pts
        score += 2;
      } else if (sameInstitution) {
        // Same institution -> 2 pts
        score += 2;
      }

      // Additional relevance: Same subcategory where available
      if (sameSubcategory) {
        score += 2;
      }

      // Province bonus if different city
      if (sameProvince && !sameCity && score > 0) {
        score += 0.5;
      }

      return { candidate, score };
    });

    // Only include issues that have a meaningful similarity score (>= 2)
    const matchingIssues = scoredCandidates
      .filter((item) => item.score >= 2)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return new Date(b.candidate.created_at).getTime() - new Date(a.candidate.created_at).getTime();
      })
      .map((item) => item.candidate);

    return matchingIssues.slice(0, 3);
  },

  async sendContactMessage(contact: ContactMessageInput): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('contact_messages')
          .insert(contact);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase contact failed:', err);
      }
    }
    const contacts = JSON.parse(localStorage.getItem('nexvoice_mock_contacts') || '[]');
    contacts.push({ ...contact, created_at: new Date().toISOString() });
    localStorage.setItem('nexvoice_mock_contacts', JSON.stringify(contacts));
    return true;
  }
};
