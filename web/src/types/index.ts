export type SignalType = 'hiring_surge' | 'layoff' | 'expansion' | 'restructuring';

export interface OpenRole {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  salary_range?: string;
  experience_level?: string;
}

export interface SignalItem {
  id: number;
  title: string;
  summary?: string;
  source_url?: string;
  source_name: string;
  careers_url?: string;
  signal_type: SignalType;
  confidence_score: number;
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  company_name?: string;
  impact_headcount?: number;
  is_verified: boolean;
  published_at: string;
  created_at?: string;
  // Job portal details
  department?: string;
  salary_range?: string;
  experience_level?: string;
  work_mode?: string;
  open_roles?: OpenRole[];
  application_count?: number;
}

export type CandidateType = 'Student / Fresher' | 'Experienced Professional';

export interface AcceptanceDetails {
  ticket_id: string;
  interview_date: string;
  interview_time: string;
  interview_round: string;
  recruiter_name: string;
  recruiter_title: string;
  matched_skills: string[];
  feedback: string;
}

export interface JobApplication {
  id: string;
  signal_id: number;
  role_title: string;
  company_name: string;
  candidate_type?: CandidateType;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  applicant_linkedin?: string;
  applicant_portfolio?: string;
  university_or_current_company?: string;
  degree_or_experience_years?: string;
  skills_summary?: string;
  cover_note?: string;
  resume_name?: string;
  resume_text?: string;
  match_score?: number;
  status: 'Accepted' | 'Interview Scheduled' | 'Shortlisted' | 'Under Review' | 'Submitted';
  acceptance_details?: AcceptanceDetails;
  submitted_at: string;
}

export interface SignalStats {
  total_signals: number;
  total_hiring_headcount: number;
  total_layoff_headcount: number;
  net_headcount: number;
  by_type: Record<string, number>;
  top_companies: Array<{ company: string; count: number; net_headcount: number }>;
  top_countries: Array<{ country: string; count: number }>;
}

export interface GeoProperties {
  signal_id: number;
  company?: string;
  signal_type: SignalType;
  impact_headcount?: number;
  title: string;
  country?: string;
  city?: string;
  published_at?: string;
  careers_url?: string;
}

export interface GeoFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lon, lat]
  };
  properties: GeoProperties;
}

export interface GeoFeatureCollection {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

export interface AIExtractResponse {
  success: boolean;
  extracted_signal?: SignalItem;
  raw_analysis?: string;
  message?: string;
}
