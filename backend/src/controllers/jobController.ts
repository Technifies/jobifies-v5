import { Request, Response } from 'express';
import jobService from '../services/jobService';
import logger from '../utils/logger';
import { JobFilters, JobSearchParams } from '../types';

interface CustomError extends Error {
  name: string;
}

class JobController {
  // Get all jobs with filters and pagination
  async getAllJobs(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        sortBy = 'created_at',
        sortOrder = 'desc',
        search,
        jobType,
        employmentType,
        experienceLevel,
        location,
        companyId,
        salaryMin,
        salaryMax,
        skills,
        remote,
      } = req.query;

      // Parse filters
      const filters: JobFilters = {
        search: search as string,
        jobType: jobType ? String(jobType).split(',') : undefined,
        employmentType: employmentType ? String(employmentType).split(',') : undefined,
        experienceLevel: experienceLevel ? String(experienceLevel).split(',') : undefined,
        location: location as string,
        companyId: companyId as string,
        salaryMin: salaryMin ? parseInt(salaryMin as string) : undefined,
        salaryMax: salaryMax ? parseInt(salaryMax as string) : undefined,
        skills: skills ? String(skills).split(',') : undefined,
        remote: remote ? remote === 'true' : undefined,
      };

      // Parse search params
      const searchParams: JobSearchParams = {
        page: parseInt(page as string) || 1,
        limit: Math.min(parseInt(limit as string) || 20, 100), // Max 100 items per page
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      };

      const result = await jobService.getAllJobs(filters, searchParams);

      res.json({
        success: true,
        message: 'Jobs retrieved successfully',
        data: result.data,
        pagination: result.pagination,
        filters: {
          ...filters,
          // Remove undefined values for cleaner response
          ...Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined)
          ),
        },
      });
    } catch (error) {
      logger.error('Error in getAllJobs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve jobs',
        error: process.env.NODE_ENV === 'development' ? (error as CustomError).message : 'Internal server error',
      });
    }
  }

  // Get job by ID
  async getJobById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Job ID is required',
        });
        return;
      }

      const job = await jobService.getJobById(id, userId);

      res.json({
        success: true,
        message: 'Job retrieved successfully',
        data: job,
      });
    } catch (error) {
      logger.error('Error in getJobById:', error);
      
      if ((error as CustomError).name === 'NotFoundError') {
        res.status(404).json({
          success: false,
          message: (error as CustomError).message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Failed to retrieve job',
        error: process.env.NODE_ENV === 'development' ? (error as CustomError).message : 'Internal server error',
      });
    }
  }

  // Create new job
  async createJob(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const jobData = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      // Validate required fields
      const requiredFields = [
        'title', 'description', 'requirements', 'responsibilities',
        'jobType', 'employmentType', 'experienceLevel', 'companyId'
      ];

      const missingFields = requiredFields.filter(field => !jobData[field]);
      
      if (missingFields.length > 0) {
        res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`,
        });
        return;
      }

      const newJob = await jobService.createJob(jobData, userId);

      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        data: newJob,
      });
    } catch (error) {
      logger.error('Error in createJob:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create job',
        error: process.env.NODE_ENV === 'development' ? (error as CustomError).message : 'Internal server error',
      });
    }
  }

  // Update job
  async updateJob(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const jobData = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Job ID is required',
        });
        return;
      }

      const updatedJob = await jobService.updateJob(id, jobData, userId);

      res.json({
        success: true,
        message: 'Job updated successfully',
        data: updatedJob,
      });
    } catch (error) {
      logger.error('Error in updateJob:', error);
      
      if ((error as CustomError).name === 'NotFoundError') {
        res.status(404).json({
          success: false,
          message: (error as CustomError).message,
        });
        return;
      }

      if ((error as CustomError).name === 'ValidationError') {
        res.status(400).json({
          success: false,
          message: (error as CustomError).message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update job',
        error: process.env.NODE_ENV === 'development' ? (error as CustomError).message : 'Internal server error',
      });
    }
  }

  // Delete job
  async deleteJob(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Job ID is required',
        });
        return;
      }

      await jobService.deleteJob(id, userId);

      res.json({
        success: true,
        message: 'Job deleted successfully',
      });
    } catch (error) {
      logger.error('Error in deleteJob:', error);
      
      if ((error as CustomError).name === 'NotFoundError') {
        res.status(404).json({
          success: false,
          message: (error as CustomError).message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete job',
        error: process.env.NODE_ENV === 'development' ? (error as CustomError).message : 'Internal server error',
      });
    }
  }

  // Get featured jobs
  async getFeaturedJobs(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 10 } = req.query;
      const limitNum = Math.min(parseInt(limit as string) || 10, 50); // Max 50 items

      const jobs = await jobService.getFeaturedJobs(limitNum);

      res.json({
        success: true,
        message: 'Featured jobs retrieved successfully',
        data: jobs,
        count: jobs.length,
      });
    } catch (error) {
      logger.error('Error in getFeaturedJobs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve featured jobs',
        error: process.env.NODE_ENV === 'development' ? (error as CustomError).message : 'Internal server error',
      });
    }
  }

  // Get jobs by company
  async getJobsByCompany(req: Request, res: Response): Promise<void> {
    try {
      const { companyId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      if (!companyId) {
        res.status(400).json({
          success: false,
          message: 'Company ID is required',
        });
        return;
      }

      const pageNum = parseInt(page as string) || 1;
      const limitNum = Math.min(parseInt(limit as string) || 20, 100);

      const result = await jobService.getJobsByCompany(companyId, pageNum, limitNum);

      res.json({
        success: true,
        message: 'Company jobs retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error('Error in getJobsByCompany:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve company jobs',
        error: process.env.NODE_ENV === 'development' ? (error as CustomError).message : 'Internal server error',
      });
    }
  }
}

export default new JobController();