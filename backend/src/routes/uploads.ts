/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: File upload endpoints
 */

import { Router, Response } from 'express';
import { Request } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All upload routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/v1/uploads/resume:
 *   post:
 *     summary: Upload resume file
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 */
router.post('/resume', asyncHandler(async (req: Request, res: Response) => {
  // TODO: Implement resume upload
  res.json({
    success: true,
    message: 'Resume upload endpoint - To be implemented',
  });
}));

/**
 * @swagger
 * /api/v1/uploads/profile-picture:
 *   post:
 *     summary: Upload profile picture
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 */
router.post('/profile-picture', asyncHandler(async (req: Request, res: Response) => {
  // TODO: Implement profile picture upload
  res.json({
    success: true,
    message: 'Profile picture upload endpoint - To be implemented',
  });
}));

export default router;