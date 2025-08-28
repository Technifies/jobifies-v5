/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative endpoints
 */

import { Router, Response } from 'express';
import { AuthenticatedRequest, UserRole } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN));

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/users', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // TODO: Implement admin get all users
  res.json({
    success: true,
    message: 'Admin users endpoint - To be implemented',
  });
}));

/**
 * @swagger
 * /api/v1/admin/stats:
 *   get:
 *     summary: Get system statistics (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/stats', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // TODO: Implement admin stats
  res.json({
    success: true,
    message: 'Admin stats endpoint - To be implemented',
  });
}));

export default router;