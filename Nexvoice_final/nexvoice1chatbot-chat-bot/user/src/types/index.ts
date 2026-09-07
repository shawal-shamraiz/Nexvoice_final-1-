export type SubmissionType = 'STUDENT' | 'INSTITUTION_REPRESENTATIVE';

export type IssueStatus = 
  | 'PENDING_VERIFICATION' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'REMOVED'
  | 'PUBLISHED' 
  | 'REPORTED' 
  | 'ARCHIVED';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type AdminRole = 'STUDENT' | 'ADMIN';

export type ModerationAction = 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'REMOVED' | 'RESTORED';

export type ReactionType = 'LIKE' | 'HEART' | 'SAD' | 'ANGRY' | 'CLAP';

export interface Profile {
  id: string;
  full_name: string;
  role: AdminRole;
  created_at?: string;
  updated_at?: string;
}

export interface IssueModerationHistory {
  id: string;
  issue_id: string;
  action: ModerationAction;
  admin_id?: string;
  admin_name?: string;
  note?: string;
  created_at: string;
}

export type Category = 
  | 'Admissions'
  | 'Scholarships'
  | 'Fees'
  | 'Exams'
  | 'Academic Policies'
  | 'Transportation'
  | 'Hostel'
  | 'Facilities'
  | 'Teachers / Faculty'
  | 'Technology / LMS'
  | 'Student Services'
  | 'Other';

export const ISSUE_CATEGORIES: Category[] = [
  'Admissions',
  'Scholarships',
  'Fees',
  'Exams',
  'Academic Policies',
  'Transportation',
  'Hostel',
  'Facilities',
  'Teachers / Faculty',
  'Technology / LMS',
  'Student Services',
  'Other'
];

export const PROVINCES: string[] = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Gilgit-Baltistan',
  'Azad Jammu & Kashmir'
];

export interface Issue {
  id: string;
  issue_number: string;
  submission_type: SubmissionType;
  name: string;
  institution_name: string;
  education_level?: string;
  program?: string;
  province: string;
  city: string;
  student_id?: string;
  institution_id?: string;
  role?: string;
  title: string;
  description: string;
  category: Category;
  subcategory?: string;
  location?: string;
  is_anonymous: boolean;
  status: IssueStatus;
  created_at: string;
  updated_at?: string;
  verification_status?: VerificationStatus;
  approved_by?: string;
  approved_at?: string;
  rejected_by?: string;
  rejected_at?: string;
  rejection_reason?: string;
  removed_by?: string;
  removed_at?: string;
  removal_reason?: string;
  reactions_count?: number;
  comments_count?: number;
}

export interface ReactionCounts {
  LIKE: number;
  HEART: number;
  SAD: number;
  ANGRY: number;
  CLAP: number;
  total: number;
  userReactions: ReactionType[];
}

export interface IssueComment {
  id: string;
  issue_id: string;
  author_name: string;
  content: string;
  status: 'VISIBLE' | 'HIDDEN' | 'REMOVED';
  likes_count: number;
  reports_count: number;
  created_at: string;
  user_liked?: boolean;
}

export interface IssueReportInput {
  issue_id?: string;
  comment_id?: string;
  reason: string;
  description?: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}
