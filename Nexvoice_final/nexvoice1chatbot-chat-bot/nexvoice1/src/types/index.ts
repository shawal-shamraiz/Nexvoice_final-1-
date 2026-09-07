export type SubmissionType = 'STUDENT' | 'INSTITUTION_REPRESENTATIVE';

export type IssueStatus = 'PUBLISHED' | 'REPORTED' | 'ARCHIVED';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

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
}

export interface IssueReportInput {
  issue_id: string;
  reason: string;
  description?: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}
