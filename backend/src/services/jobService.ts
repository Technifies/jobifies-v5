import { query, transaction } from '../config/database';
import logger from '../utils/logger';
import { Job, JobFilters, JobSearchParams, PaginationResult } from '../types';
import { NotFoundError, ValidationError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

export class JobService {
  // Get all jobs with filtering and pagination
  async getAllJobs(filters: JobFilters, searchParams: JobSearchParams): Promise<PaginationResult<Job>> {
    const { page = 1, limit = 20, sortBy = 'created_at', sortOrder = 'desc' } = searchParams;
    const offset = (page - 1) * limit;

    let whereConditions: string[] = ['j.status = $1'];
    let queryParams: any[] = ['active'];
    let paramIndex = 2;

    // Build WHERE conditions based on filters
    if (filters.search) {
      whereConditions.push(`(
        j.title ILIKE $${paramIndex} OR 
        j.description ILIKE $${paramIndex} OR 
        c.name ILIKE $${paramIndex}
      )`);
      queryParams.push(`%${filters.search}%`);
      paramIndex++;
    }

    if (filters.jobType?.length) {
      whereConditions.push(`j.job_type = ANY($${paramIndex})`);
      queryParams.push(filters.jobType);
      paramIndex++;
    }

    if (filters.employmentType?.length) {
      whereConditions.push(`j.employment_type = ANY($${paramIndex})`);
      queryParams.push(filters.employmentType);
      paramIndex++;
    }

    if (filters.experienceLevel?.length) {
      whereConditions.push(`j.experience_level = ANY($${paramIndex})`);
      queryParams.push(filters.experienceLevel);
      paramIndex++;
    }

    if (filters.location) {
      whereConditions.push(`j.location ILIKE $${paramIndex}`);
      queryParams.push(`%${filters.location}%`);
      paramIndex++;
    }

    if (filters.companyId) {
      whereConditions.push(`j.company_id = $${paramIndex}`);
      queryParams.push(filters.companyId);
      paramIndex++;
    }

    if (filters.salaryMin) {
      whereConditions.push(`j.salary_min >= $${paramIndex}`);
      queryParams.push(filters.salaryMin);
      paramIndex++;
    }

    if (filters.salaryMax) {
      whereConditions.push(`j.salary_max <= $${paramIndex}`);
      queryParams.push(filters.salaryMax);
      paramIndex++;
    }

    if (filters.skills?.length) {
      whereConditions.push(`j.required_skills && $${paramIndex}`);
      queryParams.push(filters.skills);
      paramIndex++;
    }

    if (filters.remote !== undefined) {
      whereConditions.push(`j.remote = $${paramIndex}`);
      queryParams.push(filters.remote);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Validate sortBy field
    const validSortFields = ['created_at', 'title', 'salary_min', 'salary_max', 'deadline'];
    const validSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = ['asc', 'desc'].includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Main query
    const jobQuery = `
      SELECT 
        j.id,
        j.title,
        j.description,
        j.requirements,
        j.responsibilities,
        j.job_type,
        j.employment_type,
        j.experience_level,
        j.salary_min,
        j.salary_max,
        j.currency,
        j.location,
        j.remote,
        j.required_skills,
        j.preferred_skills,
        j.benefits,
        j.application_deadline as deadline,
        j.status,
        j.created_at,
        j.updated_at,
        c.id as company_id,
        c.name as company_name,
        c.logo_url as company_logo,
        c.industry as company_industry,
        c.company_size,
        (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as application_count
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      ${whereClause}
      ORDER BY j.${validSortBy} ${validSortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    // Count query
    const countQuery = `
      SELECT COUNT(*) as total
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      ${whereClause}
    `;

    queryParams.push(limit, offset);

    try {
      const [jobsResult, countResult] = await Promise.all([
        query(jobQuery, queryParams),
        query(countQuery, queryParams.slice(0, -2)) // Remove limit and offset for count
      ]);

      const jobs = jobsResult.rows;
      const totalCount = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(totalCount / limit);

      return {
        data: jobs,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      logger.error('Error fetching jobs:', error);
      throw error;
    }
  }

  // Get job by ID
  async getJobById(jobId: string, userId?: string): Promise<Job> {
    const jobQuery = `
      SELECT 
        j.*,
        c.id as company_id,
        c.name as company_name,
        c.logo_url as company_logo,
        c.industry as company_industry,
        c.company_size,
        c.description as company_description,
        c.website as company_website,
        c.headquarters as company_headquarters,
        (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as application_count,
        ${userId ? `(SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id AND a.user_id = $2) > 0 as user_applied,` : 'false as user_applied,'}
        ${userId ? `(SELECT COUNT(*) FROM saved_jobs s WHERE s.job_id = j.id AND s.user_id = $2) > 0 as user_saved` : 'false as user_saved'}
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.id = $1 AND j.status = 'active'
    `;

    const params = userId ? [jobId, userId] : [jobId];

    try {
      const result = await query(jobQuery, params);
      
      if (result.rows.length === 0) {
        throw new NotFoundError('Job not found');
      }

      return result.rows[0];
    } catch (error) {
      logger.error('Error fetching job by ID:', error);
      throw error;
    }
  }

  // Create new job
  async createJob(jobData: any, userId: string): Promise<Job> {
    const jobId = uuidv4();

    const insertQuery = `
      INSERT INTO jobs (
        id, title, description, requirements, responsibilities, job_type,
        employment_type, experience_level, salary_min, salary_max, currency,
        location, remote, required_skills, preferred_skills, benefits,
        application_deadline, company_id, created_by, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 'active'
      )
      RETURNING *
    `;

    const params = [
      jobId,
      jobData.title,
      jobData.description,
      jobData.requirements,
      jobData.responsibilities,
      jobData.jobType,
      jobData.employmentType,
      jobData.experienceLevel,
      jobData.salaryMin,
      jobData.salaryMax,
      jobData.currency || 'USD',
      jobData.location,
      jobData.remote || false,
      jobData.requiredSkills || [],
      jobData.preferredSkills || [],
      jobData.benefits || [],
      jobData.applicationDeadline,
      jobData.companyId,
      userId,
    ];

    try {
      const result = await query(insertQuery, params);
      logger.info('Job created successfully', { jobId, createdBy: userId });
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating job:', error);
      throw error;
    }
  }

  // Update job
  async updateJob(jobId: string, jobData: any, userId: string): Promise<Job> {
    const updateFields = [];
    const params = [jobId];
    let paramIndex = 2;

    // Build dynamic update query
    const updatableFields = [
      'title', 'description', 'requirements', 'responsibilities', 'job_type',
      'employment_type', 'experience_level', 'salary_min', 'salary_max', 'currency',
      'location', 'remote', 'required_skills', 'preferred_skills', 'benefits',
      'application_deadline', 'status'
    ];

    for (const field of updatableFields) {
      if (jobData[field] !== undefined) {
        updateFields.push(`${field} = $${paramIndex}`);
        params.push(jobData[field]);
        paramIndex++;
      }
    }

    if (updateFields.length === 0) {
      throw new ValidationError('No valid fields to update');
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    const updateQuery = `
      UPDATE jobs 
      SET ${updateFields.join(', ')}
      WHERE id = $1 AND created_by = $${paramIndex}
      RETURNING *
    `;

    params.push(userId);

    try {
      const result = await query(updateQuery, params);
      
      if (result.rows.length === 0) {
        throw new NotFoundError('Job not found or you do not have permission to update it');
      }

      logger.info('Job updated successfully', { jobId, updatedBy: userId });
      return result.rows[0];
    } catch (error) {
      logger.error('Error updating job:', error);
      throw error;
    }
  }

  // Delete job
  async deleteJob(jobId: string, userId: string): Promise<void> {
    const deleteQuery = `
      UPDATE jobs 
      SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND created_by = $2 AND status != 'deleted'
      RETURNING id
    `;

    try {
      const result = await query(deleteQuery, [jobId, userId]);
      
      if (result.rows.length === 0) {
        throw new NotFoundError('Job not found or you do not have permission to delete it');
      }

      logger.info('Job deleted successfully', { jobId, deletedBy: userId });
    } catch (error) {
      logger.error('Error deleting job:', error);
      throw error;
    }
  }

  // Get popular/featured jobs
  async getFeaturedJobs(limit: number = 10): Promise<Job[]> {
    const featuredQuery = `
      SELECT 
        j.*,
        c.name as company_name,
        c.logo_url as company_logo,
        c.industry as company_industry,
        (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as application_count
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.status = 'active' AND j.featured = true
      ORDER BY j.created_at DESC, application_count DESC
      LIMIT $1
    `;

    try {
      const result = await query(featuredQuery, [limit]);
      return result.rows;
    } catch (error) {
      logger.error('Error fetching featured jobs:', error);
      throw error;
    }
  }

  // Get jobs by company
  async getJobsByCompany(companyId: string, page: number = 1, limit: number = 20): Promise<PaginationResult<Job>> {
    const offset = (page - 1) * limit;

    const jobsQuery = `
      SELECT j.*, 
             (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as application_count
      FROM jobs j
      WHERE j.company_id = $1 AND j.status = 'active'
      ORDER BY j.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM jobs j
      WHERE j.company_id = $1 AND j.status = 'active'
    `;

    try {
      const [jobsResult, countResult] = await Promise.all([
        query(jobsQuery, [companyId, limit, offset]),
        query(countQuery, [companyId])
      ]);

      const jobs = jobsResult.rows;
      const totalCount = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(totalCount / limit);

      return {
        data: jobs,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      logger.error('Error fetching jobs by company:', error);
      throw error;
    }
  }
}

export default new JobService();