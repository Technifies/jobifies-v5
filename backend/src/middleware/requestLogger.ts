import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger, { logHTTP } from '../utils/logger';

// Extend Request interface to include startTime and requestId
declare global {
  namespace Express {
    interface Request {
      startTime?: number;
      requestId?: string;
    }
  }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Add request ID and start time
  req.requestId = uuidv4();
  req.startTime = Date.now();

  // Add request ID to response headers
  res.setHeader('X-Request-ID', req.requestId);

  // Skip logging for health checks and static files
  const skipPaths = ['/health', '/favicon.ico', '/robots.txt'];
  const shouldSkip = skipPaths.some(path => req.path.startsWith(path));

  if (shouldSkip) {
    return next();
  }

  // Log request start
  logger.info('Request Started', {
    requestId: req.requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length'),
    userId: req.user?.id,
    origin: req.get('Origin'),
    referer: req.get('Referer'),
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(body: any) {
    // Calculate response time
    const responseTime = req.startTime ? Date.now() - req.startTime : 0;
    
    // Log response
    logHTTP(req, res, responseTime);
    
    // Log detailed response info
    logger.info('Request Completed', {
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userId: req.user?.id,
      responseSize: JSON.stringify(body).length,
    });

    return originalJson.call(this, body);
  };

  // Override res.send to log response
  const originalSend = res.send;
  res.send = function(body: any) {
    // Calculate response time
    const responseTime = req.startTime ? Date.now() - req.startTime : 0;
    
    // Log response
    logHTTP(req, res, responseTime);
    
    // Log detailed response info
    logger.info('Request Completed', {
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userId: req.user?.id,
      responseSize: typeof body === 'string' ? body.length : JSON.stringify(body).length,
    });

    return originalSend.call(this, body);
  };

  next();
};