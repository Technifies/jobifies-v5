import { httpClient } from '../api/client';
import { Job, JobFilters, PaginatedResponse } from '@/types/job';

export interface JobSearchParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class JobService {
  private baseUrl = '/jobs';

  // Get all jobs with filtering and pagination
  async getJobs(filters: JobFilters = {}, searchParams: JobSearchParams = {}): Promise<PaginatedResponse<Job>> {
    const params = new URLSearchParams();

    // Add search params
    if (searchParams.page) params.append('page', searchParams.page.toString());
    if (searchParams.limit) params.append('limit', searchParams.limit.toString());
    if (searchParams.sortBy) params.append('sortBy', searchParams.sortBy);
    if (searchParams.sortOrder) params.append('sortOrder', searchParams.sortOrder);

    // Add filters
    if (filters.search) params.append('search', filters.search);
    if (filters.jobType?.length) params.append('jobType', filters.jobType.join(','));
    if (filters.employmentType?.length) params.append('employmentType', filters.employmentType.join(','));
    if (filters.experienceLevel?.length) params.append('experienceLevel', filters.experienceLevel.join(','));
    if (filters.location) params.append('location', filters.location);
    if (filters.companyId) params.append('companyId', filters.companyId);
    if (filters.salaryMin) params.append('salaryMin', filters.salaryMin.toString());
    if (filters.salaryMax) params.append('salaryMax', filters.salaryMax.toString());
    if (filters.skills?.length) params.append('skills', filters.skills.join(','));
    if (filters.remote !== undefined) params.append('remote', filters.remote.toString());

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

    const response = await httpClient.get<PaginatedResponse<Job>>(url);
    return response.data;
  }

  // Get job by ID
  async getJobById(id: string): Promise<Job> {
    const response = await httpClient.get<{ data: Job }>(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  // Get featured jobs
  async getFeaturedJobs(limit: number = 10): Promise<Job[]> {
    const response = await httpClient.get<{ data: Job[] }>(`${this.baseUrl}/featured?limit=${limit}`);
    return response.data.data;
  }

  // Create job (for recruiters)
  async createJob(jobData: Partial<Job>): Promise<Job> {
    const response = await httpClient.post<{ data: Job }>(this.baseUrl, jobData);
    return response.data.data;
  }

  // Update job
  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    const response = await httpClient.put<{ data: Job }>(`${this.baseUrl}/${id}`, jobData);
    return response.data.data;
  }

  // Delete job
  async deleteJob(id: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/${id}`);
  }

  // Get jobs by company
  async getJobsByCompany(companyId: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<Job>> {
    const response = await httpClient.get<PaginatedResponse<Job>>(
      `${this.baseUrl}/company/${companyId}?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  // Save/unsave job (for job seekers)
  async saveJob(jobId: string): Promise<void> {
    await httpClient.post(`/saved-jobs`, { jobId });
  }

  async unsaveJob(jobId: string): Promise<void> {
    await httpClient.delete(`/saved-jobs/${jobId}`);
  }

  // Apply to job
  async applyToJob(jobId: string, applicationData: {
    coverLetter?: string;
    resumeUrl?: string;
    additionalDocuments?: string[];
  }): Promise<void> {
    await httpClient.post(`/applications`, {
      jobId,
      ...applicationData,
    });
  }
}

export const jobService = new JobService();