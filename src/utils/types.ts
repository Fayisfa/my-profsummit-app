// types.ts

export type UserRole = 'State Admin' | 'Campus Unit User' | 'District' | 'RSC Admin';
export type View = 'Overview' | 'Events' | 'Submissions' | 'Leaderboard' | 'Document'| 'Registration Overview' | 'Submission Overview' | 'Retention Analysis' | 'District Current Year' | 'District Past Year' | 'Division Overview' | 'College Overview' | 'Share Center';
export type GradingType = 'Fixed' | 'Variable' | 'Tiered' | 'Discretion' | 'Manual';
export type SubmissionType = 'Media Upload' | 'Quantitative Input' | 'Text Submission' | 'Simple Participation' | 'Image Upload' | 'Video Upload';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected'; // Updated to match DB

export interface User {
  id: number | string; // Can be number (mock) or string (live)
  name: string;
  role: UserRole;
  campusId?: string; // Changed to string to match campus ID
  district?: string;
}

export interface Campus {
  id: string; // Changed to string to match DB schema (VARCHAR)
  name: string;
  district: string;
  points: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  submissionType: SubmissionType[];
  gradingType: GradingType;
  maxPoints: number;
  deadline: string;
  placeholder?: string;
}

export interface Submission {
  id: number;
  event_id: number; // Matches DB column name
  campus_id: string; // Changed to string to match DB schema
  submitted_by: string; // Matches DB column name
  status: SubmissionStatus;
  created_at: string; // Matches DB column name
  items?: any; // For the JSON field
  data?: any; // For the JSON field
  feedback?: string;
  marks?: number;
  campus_name?: string; // From the JOIN query
}


export interface RegistrationData {
    college_country: string;
    id: string;
    name: string;
    email: string;
    college: string;
    college_district: string;
    native_district: string;
    college_division: string;
    mobile: string,
    native_division: string;
    attended_2023: boolean;
    created_at: string;
    updated_at: string;
    type: string;
    attend_type: string;
    heard_from: string;
}
