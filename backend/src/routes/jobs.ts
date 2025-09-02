/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job management endpoints
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { validate, createJobValidation, jobSearchValidation } from '../middleware/validation';
import jobController from '../controllers/jobController';

const router = Router();

/**
 * @swagger
 * /api/v1/jobs:
 *   get:
 *     summary: Get all jobs with filtering and pagination
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: remote
 *         schema:
 *           type: boolean
 */
router.get('/', optionalAuth, validate(jobSearchValidation()), asyncHandler(jobController.getAllJobs));

/**
 * @swagger
 * /api/v1/jobs/featured:
 *   get:
 *     summary: Get featured/popular jobs
 *     tags: [Jobs]
 */
router.get('/featured', asyncHandler(jobController.getFeaturedJobs));

/**
 * @swagger
 * /api/v1/jobs:
 *   post:
 *     summary: Create a new job posting
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticateToken, validate(createJobValidation()), asyncHandler(jobController.createJob));

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Jobs]
 */
router.get('/:id', optionalAuth, asyncHandler(jobController.getJobById));

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   put:
 *     summary: Update job by ID
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticateToken, validate(createJobValidation()), asyncHandler(jobController.updateJob));

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   delete:
 *     summary: Delete job by ID
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticateToken, asyncHandler(jobController.deleteJob));

/**
 * @swagger
 * /api/v1/jobs/company/{companyId}:
 *   get:
 *     summary: Get jobs by company
 *     tags: [Jobs]
 */
router.get('/company/:companyId', asyncHandler(jobController.getJobsByCompany));

export default router;