import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload, UserRole } from '../types';
import { AuthenticationError, AuthorizationError } from './errorHandler';
import config from '../config';
import logger from '../utils/logger';
import { query } from '../config/database';

// Extend Express Request type
export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    role: UserRole;
    isVerified: boolean;
    isActive: boolean;
  };
}

// Verify JWT token and attach user to request
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AuthenticationError('Access token is required');
    }

    // Verify token
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new AuthenticationError('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new AuthenticationError('Invalid token');
      } else {
        throw new AuthenticationError('Token verification failed');
      }
    }

    // Get user from database
    const userResult = await query(
      `SELECT id, email, role, is_verified, is_active, last_login 
       FROM users 
       WHERE id = $1`,
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      throw new AuthenticationError('User not found');
    }

    const user = userResult.rows[0];

    // Check if user is active
    if (!user.is_active) {
      throw new AuthenticationError('User account is deactivated');
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      isVerified: user.is_verified,
      isActive: user.is_active,
    };

    // Log successful authentication
    logger.info('User authenticated', {
      userId: user.id,
      email: user.email,
      role: user.role,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
    });

    next();
  } catch (error) {
    // Log authentication failure
    logger.warn('Authentication failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
    });

    next(error);
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    
    const userResult = await query(
      `SELECT id, email, role, is_verified, is_active 
       FROM users 
       WHERE id = $1 AND is_active = true`,
      [decoded.userId]
    );

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
        isVerified: user.is_verified,
        isActive: user.is_active,
      };
    }

    next();
  } catch (error) {
    // Don't fail on optional auth, just continue without user
    next();
  }
};

// Role-based authorization middleware
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Authorization failed', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: roles,
        ip: req.ip,
        path: req.path,
      });

      return next(
        new AuthorizationError(
          `Access denied. Required roles: ${roles.join(', ')}`
        )
      );
    }

    next();
  };
};

// Check if user is verified
export const requireVerified = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AuthenticationError('Authentication required'));
  }

  if (!req.user.isVerified) {
    return next(
      new AuthorizationError('Email verification required to access this resource')
    );
  }

  next();
};

// Check if user owns the resource
export const checkOwnership = (resourceUserIdField: string = 'user_id') => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new AuthenticationError('Authentication required'));
      }

      const resourceId = req.params.id;
      if (!resourceId) {
        return next(new Error('Resource ID is required'));
      }

      // Admin and super admin can access any resource
      if ([UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(req.user.role)) {
        return next();
      }

      // Check resource ownership based on the route
      let query_str = '';
      let params = [];

      if (req.baseUrl.includes('jobs')) {
        query_str = `SELECT created_by FROM jobs WHERE id = $1`;
        params = [resourceId];
      } else if (req.baseUrl.includes('companies')) {
        query_str = `SELECT created_by FROM companies WHERE id = $1`;
        params = [resourceId];
      } else if (req.baseUrl.includes('applications')) {
        query_str = `SELECT applicant_id FROM applications WHERE id = $1`;
        params = [resourceId];
      } else if (req.baseUrl.includes('users')) {
        // For user resources, check if user ID matches
        if (resourceId !== req.user.id) {
          return next(new AuthorizationError('Access denied'));
        }
        return next();
      } else {
        // Generic ownership check
        query_str = `SELECT ${resourceUserIdField} FROM ${req.baseUrl.slice(1)} WHERE id = $1`;
        params = [resourceId];
      }

      const result = await query(query_str, params);

      if (result.rows.length === 0) {
        return next(new Error('Resource not found'));
      }

      const resourceOwnerId = result.rows[0][resourceUserIdField] || result.rows[0].created_by || result.rows[0].applicant_id;

      if (resourceOwnerId !== req.user.id) {
        logger.warn('Ownership check failed', {
          userId: req.user.id,
          resourceId,
          resourceOwnerId,
          resource: req.baseUrl,
          ip: req.ip,
        });

        return next(new AuthorizationError('Access denied'));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Rate limiting for specific users
export const userRateLimit = (maxRequests: number, windowMs: number) => {
  const userRequestCounts = new Map<string, { count: number; resetTime: number }>();

  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next();
    }

    const now = Date.now();
    const userId = req.user.id;
    const userKey = `${userId}:${req.ip}`;

    const userCount = userRequestCounts.get(userKey);

    if (!userCount || now > userCount.resetTime) {
      userRequestCounts.set(userKey, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (userCount.count >= maxRequests) {
      logger.warn('User rate limit exceeded', {
        userId,
        ip: req.ip,
        count: userCount.count,
        maxRequests,
      });

      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        error: 'USER_RATE_LIMIT_EXCEEDED',
      });
    }

    userCount.count++;
    next();
  };
};

// Subscription-based access control
export const requireSubscription = (requiredPlans: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new AuthenticationError('Authentication required'));
      }

      // Admin users bypass subscription checks
      if ([UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(req.user.role)) {
        return next();
      }

      // Check user's active subscription
      const subscriptionResult = await query(
        `SELECT plan_type, status, end_date 
         FROM subscriptions 
         WHERE user_id = $1 AND status = 'active' AND end_date > NOW()
         ORDER BY end_date DESC
         LIMIT 1`,
        [req.user.id]
      );

      if (subscriptionResult.rows.length === 0) {
        return next(
          new AuthorizationError('Active subscription required to access this feature')
        );
      }

      const subscription = subscriptionResult.rows[0];

      if (!requiredPlans.includes(subscription.plan_type)) {
        return next(
          new AuthorizationError(
            `This feature requires one of the following subscription plans: ${requiredPlans.join(', ')}`
          )
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};