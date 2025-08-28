/**
 * @swagger
 * tags:
 *   name: Health
 *   description: System health and status endpoints
 */

import { Router, Request, Response } from 'express';
import { healthCheck } from '../config/database';
import { ApiResponse } from '../types';
import logger from '../utils/logger';
import emailService from '../services/emailService';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Basic health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Service is healthy"
 *                 data:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     uptime:
 *                       type: number
 *                     environment:
 *                       type: string
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    message: 'Service is healthy',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    },
  };

  res.status(200).json(response);
}));

/**
 * @swagger
 * /health/detailed:
 *   get:
 *     summary: Detailed health check with dependencies
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *                     services:
 *                       type: object
 *                       properties:
 *                         database:
 *                           type: object
 *                         redis:
 *                           type: object
 *                         email:
 *                           type: object
 *       503:
 *         description: Service is unhealthy
 */
router.get('/detailed', asyncHandler(async (req: Request, res: Response) => {
  const healthChecks = {
    database: { status: 'unknown', message: '', responseTime: 0 },
    redis: { status: 'unknown', message: '', responseTime: 0 },
    email: { status: 'unknown', message: '', responseTime: 0 },
  };

  let overallHealth = true;

  try {
    // Database and Redis health check
    const dbStart = Date.now();
    const dbHealth = await healthCheck();
    const dbTime = Date.now() - dbStart;

    healthChecks.database = {
      status: dbHealth.postgres ? 'healthy' : 'unhealthy',
      message: dbHealth.postgres ? 'Connected' : 'Connection failed',
      responseTime: dbTime,
    };

    healthChecks.redis = {
      status: dbHealth.redis ? 'healthy' : 'unhealthy',
      message: dbHealth.redis ? 'Connected' : 'Connection failed',
      responseTime: dbTime,
    };

    if (!dbHealth.postgres || !dbHealth.redis) {
      overallHealth = false;
    }
  } catch (error) {
    logger.error('Database health check failed:', error);
    healthChecks.database.status = 'unhealthy';
    healthChecks.database.message = 'Health check failed';
    healthChecks.redis.status = 'unhealthy';
    healthChecks.redis.message = 'Health check failed';
    overallHealth = false;
  }

  try {
    // Email service health check
    const emailStart = Date.now();
    const emailHealthy = await emailService.testConnection();
    const emailTime = Date.now() - emailStart;

    healthChecks.email = {
      status: emailHealthy ? 'healthy' : 'unhealthy',
      message: emailHealthy ? 'SMTP connection verified' : 'SMTP connection failed',
      responseTime: emailTime,
    };

    if (!emailHealthy) {
      // Email is not critical for overall health in this implementation
      logger.warn('Email service is not healthy but not marking overall as unhealthy');
    }
  } catch (error) {
    logger.error('Email health check failed:', error);
    healthChecks.email.status = 'unhealthy';
    healthChecks.email.message = 'Email test failed';
  }

  const statusCode = overallHealth ? 200 : 503;
  const response: ApiResponse = {
    success: overallHealth,
    message: overallHealth ? 'All services are healthy' : 'Some services are unhealthy',
    data: {
      status: overallHealth ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      services: healthChecks,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
      },
      cpu: {
        usage: process.cpuUsage(),
      },
    },
  };

  res.status(statusCode).json(response);
}));

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness probe for Kubernetes/Docker
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready to accept requests
 *       503:
 *         description: Service is not ready
 */
router.get('/ready', asyncHandler(async (req: Request, res: Response) => {
  try {
    // Check if essential services are available
    const dbHealth = await healthCheck();
    
    if (!dbHealth.postgres) {
      return res.status(503).json({
        success: false,
        message: 'Service not ready - Database unavailable',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Service is ready',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Readiness check failed:', error);
    return res.status(503).json({
      success: false,
      message: 'Service not ready',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness probe for Kubernetes/Docker
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is alive
 */
router.get('/live', asyncHandler(async (req: Request, res: Response) => {
  // Simple liveness check - just verify the process is running
  res.status(200).json({
    success: true,
    message: 'Service is alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}));

export default router;