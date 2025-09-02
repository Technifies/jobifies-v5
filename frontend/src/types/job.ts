// Job Types for Frontend
export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  job_type: JobType;
  employment_type: EmploymentType;
  experience_level: ExperienceLevel;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  location: string;
  remote: boolean;
  required_skills: string[];
  preferred_skills?: string[];
  benefits?: string[];
  deadline?: string;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  
  // Company information
  company_id: string;
  company_name: string;
  company_logo?: string;
  company_industry?: string;
  company_size?: CompanySize;
  company_description?: string;
  company_website?: string;
  company_headquarters?: string;
  
  // Aggregated data
  application_count: number;
  user_applied?: boolean;
  user_saved?: boolean;
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

export enum ExperienceLevel {
  ENTRY = 'entry',
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  EXECUTIVE = 'executive'
}

export enum JobStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  DRAFT = 'draft',
  EXPIRED = 'expired'
}

export enum CompanySize {
  STARTUP = 'startup',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ENTERPRISE = 'enterprise'
}

export interface JobFilters {
  search?: string;
  jobType?: JobType[];
  employmentType?: EmploymentType[];
  experienceLevel?: ExperienceLevel[];
  location?: string;
  companyId?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  remote?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters?: JobFilters;
}

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  status: ApplicationStatus;
  cover_letter?: string;
  resume_url?: string;
  additional_documents: string[];
  applied_at: string;
  updated_at: string;
}

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  SHORTLISTED = 'shortlisted',
  INTERVIEWED = 'interviewed',
  OFFERED = 'offered',
  HIRED = 'hired',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string;
  saved_at: string;
  job?: Job;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  company_size?: CompanySize;
  founded_year?: number;
  headquarters?: string;
  website?: string;
  logo_url?: string;
  cover_image_url?: string;
  verified: boolean;
  social_links?: Record<string, string>;
  benefits?: string[];
  culture_values?: string[];
  created_at: string;
  updated_at: string;
}