import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// User Types
export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  profile_picture?: string;
  phone_number?: string;
  date_of_birth?: Date;
  location?: string;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
}

export enum UserRole {
  JOB_SEEKER = 'job_seeker',
  RECRUITER = 'recruiter',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface UserProfile {
  user_id: string;
  bio?: string;
  experience_level: ExperienceLevel;
  current_position?: string;
  current_company?: string;
  skills: string[];
  education: Education[];
  work_experience: WorkExperience[];
  certifications: Certification[];
  languages: Language[];
  portfolio_links: string[];
  resume_url?: string;
  salary_expectation?: number;
  preferred_locations: string[];
  job_preferences: JobPreferences;
  created_at: Date;
  updated_at: Date;
}

export enum ExperienceLevel {
  ENTRY = 'entry',
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  EXECUTIVE = 'executive'
}

export interface Education {
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: Date;
  end_date?: Date;
  grade?: string;
  description?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  start_date: Date;
  end_date?: Date;
  is_current: boolean;
  description: string;
  skills_used: string[];
  location?: string;
}

export interface Certification {
  name: string;
  issuing_organization: string;
  issue_date: Date;
  expiry_date?: Date;
  credential_id?: string;
  credential_url?: string;
}

export interface Language {
  name: string;
  proficiency: LanguageProficiency;
}

export enum LanguageProficiency {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  NATIVE = 'native'
}

export interface JobPreferences {
  job_types: JobType[];
  employment_types: EmploymentType[];
  remote_preference: RemotePreference;
  industry_preferences: string[];
  company_size_preferences: CompanySize[];
  salary_range: {
    min: number;
    max: number;
  };
}

// Company Types
export interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  company_size: CompanySize;
  founded_year?: number;
  headquarters: string;
  website?: string;
  logo_url?: string;
  cover_image_url?: string;
  verified: boolean;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export enum CompanySize {
  STARTUP = 'startup',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ENTERPRISE = 'enterprise'
}

// Job Types
export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  job_type: JobType;
  employment_type: EmploymentType;
  experience_level: ExperienceLevel;
  salary_range: {
    min: number;
    max: number;
    currency: string;
  };
  location: string;
  remote_type: RemotePreference;
  skills_required: string[];
  benefits: string[];
  application_deadline?: Date;
  is_active: boolean;
  is_featured: boolean;
  views_count: number;
  applications_count: number;
  company_id: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  FREELANCE = 'freelance'
}

export enum EmploymentType {
  PERMANENT = 'permanent',
  TEMPORARY = 'temporary',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship'
}

export enum RemotePreference {
  REMOTE = 'remote',
  HYBRID = 'hybrid',
  ON_SITE = 'on_site',
  FLEXIBLE = 'flexible'
}

// Application Types
export interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  status: ApplicationStatus;
  cover_letter?: string;
  resume_url?: string;
  additional_documents: string[];
  applied_at: Date;
  reviewed_at?: Date;
  reviewed_by?: string;
  interview_scheduled_at?: Date;
  notes?: string;
  feedback?: string;
  salary_expectation?: number;
  availability_date?: Date;
}

export enum ApplicationStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  SHORTLISTED = 'shortlisted',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  INTERVIEWED = 'interviewed',
  OFFER_EXTENDED = 'offer_extended',
  HIRED = 'hired',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

// Payment and Subscription Types
export interface Subscription {
  id: string;
  user_id: string;
  plan_type: SubscriptionPlan;
  status: SubscriptionStatus;
  start_date: Date;
  end_date: Date;
  auto_renewal: boolean;
  payment_method: PaymentMethod;
  amount: number;
  currency: string;
  created_at: Date;
  updated_at: Date;
}

export enum SubscriptionPlan {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PENDING = 'pending'
}

export enum PaymentMethod {
  STRIPE = 'stripe',
  RAZORPAY = 'razorpay',
  PAYPAL = 'paypal'
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  created_at: Date;
  read_at?: Date;
}

export enum NotificationType {
  JOB_APPLICATION = 'job_application',
  APPLICATION_STATUS = 'application_status',
  JOB_MATCH = 'job_match',
  MESSAGE = 'message',
  SUBSCRIPTION = 'subscription',
  SYSTEM = 'system'
}

// Authentication Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload extends JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Search and Filter Types
export interface JobSearchQuery extends PaginationQuery {
  q?: string;
  location?: string;
  job_type?: JobType;
  employment_type?: EmploymentType;
  experience_level?: ExperienceLevel;
  remote_type?: RemotePreference;
  salary_min?: number;
  salary_max?: number;
  company_id?: string;
  skills?: string[];
  posted_within?: number; // days
}

export interface UserSearchQuery extends PaginationQuery {
  q?: string;
  role?: UserRole;
  skills?: string[];
  experience_level?: ExperienceLevel;
  location?: string;
  is_active?: boolean;
}

// File Upload Types
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

export interface UploadedFile {
  id: string;
  original_name: string;
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  uploaded_at: Date;
}

// Analytics Types
export interface JobAnalytics {
  job_id: string;
  views: number;
  applications: number;
  view_sources: Record<string, number>;
  application_sources: Record<string, number>;
  date: Date;
}

export interface UserActivity {
  user_id: string;
  activity_type: string;
  activity_data: Record<string, any>;
  ip_address: string;
  user_agent: string;
  timestamp: Date;
}

// Email Templates
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content: string;
  variables: string[];
  created_at: Date;
  updated_at: Date;
}

// System Configuration
export interface SystemConfig {
  key: string;
  value: string;
  description?: string;
  updated_by: string;
  updated_at: Date;
}

export default {};