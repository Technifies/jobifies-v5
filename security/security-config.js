/**
 * Comprehensive security configuration for Jobifies application
 */

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

class SecurityConfig {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Configure Helmet security headers
   */
  getHelmetConfig() {
    return helmet({
      // Content Security Policy
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            "https://www.google-analytics.com",
            "https://www.googletagmanager.com",
            "https://connect.facebook.net",
            "https://js.stripe.com"
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
            "https://cdnjs.cloudflare.com"
          ],
          imgSrc: [
            "'self'",
            "data:",
            "https:",
            "blob:",
            "https://www.google-analytics.com",
            "https://res.cloudinary.com"
          ],
          fontSrc: [
            "'self'",
            "https://fonts.gstatic.com",
            "https://cdnjs.cloudflare.com"
          ],
          connectSrc: [
            "'self'",
            "https://api.jobifies.com",
            "https://api-staging.jobifies.com",
            "https://www.google-analytics.com",
            "https://api.stripe.com"
          ],
          frameSrc: [
            "'none'"
          ],
          objectSrc: [
            "'none'"
          ],
          mediaSrc: [
            "'self'",
            "https:"
          ],
          manifestSrc: [
            "'self'"
          ],
          workerSrc: [
            "'self'",
            "blob:"
          ],
          baseUri: [
            "'self'"
          ],
          formAction: [
            "'self'"
          ],
          upgradeInsecureRequests: this.isProduction ? true : false
        },
        reportOnly: this.isDevelopment
      },

      // DNS prefetch control
      dnsPrefetchControl: {
        allow: true
      },

      // Expect-CT header
      expectCt: this.isProduction ? {
        maxAge: 86400,
        enforce: true
      } : false,

      // Referrer Policy
      referrerPolicy: {
        policy: ['strict-origin-when-cross-origin']
      },

      // HTTP Strict Transport Security
      hsts: this.isProduction ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      } : false,

      // IE No Open
      ieNoOpen: true,

      // No Sniff
      noSniff: true,

      // Origin Agent Cluster
      originAgentCluster: true,

      // Permissions Policy
      permissionsPolicy: {
        features: {
          camera: [],
          microphone: [],
          geolocation: ['self'],
          payment: ['self'],
          usb: [],
          'screen-wake-lock': []
        }
      },

      // X-Frame-Options
      frameguard: {
        action: 'deny'
      },

      // X-Powered-By
      hidePoweredBy: true,

      // X-XSS-Protection
      xssFilter: true
    });
  }

  /**
   * General rate limiting configuration
   */
  getRateLimitConfig() {
    return rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // requests per window
      message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
      },
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      skip: (req) => {
        // Skip rate limiting for health checks and metrics
        return req.path === '/health' || req.path === '/metrics';
      },
      keyGenerator: (req) => {
        // Use IP address for rate limiting
        return req.ip || req.connection.remoteAddress;
      }
    });
  }

  /**
   * Strict rate limiting for authentication endpoints
   */
  getAuthRateLimitConfig() {
    return rateLimit({
      windowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
      max: parseInt(process.env.LOGIN_RATE_LIMIT_MAX_ATTEMPTS) || 5,
      message: {
        error: 'Too many login attempts, please try again later.',
        retryAfter: '15 minutes'
      },
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: true // Don't count successful requests
    });
  }

  /**
   * Slow down repeated requests
   */
  getSlowDownConfig() {
    return slowDown({
      windowMs: 15 * 60 * 1000, // 15 minutes
      delayAfter: 100, // allow 100 requests per windowMs without delay
      delayMs: 500, // add 500ms delay per request after delayAfter
      maxDelayMs: 20000, // max delay of 20 seconds
      skip: (req) => {
        return req.path === '/health' || req.path === '/metrics';
      }
    });
  }

  /**
   * CORS configuration
   */
  getCorsConfig() {
    const allowedOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
      : ['http://localhost:3000'];

    return {
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          return callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: process.env.CORS_CREDENTIALS === 'true',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'X-HTTP-Method-Override'
      ],
      exposedHeaders: [
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset'
      ],
      maxAge: 86400 // 24 hours
    };
  }

  /**
   * Input validation and sanitization middleware
   */
  getInputSanitizer() {
    return (req, res, next) => {
      // Basic input sanitization
      const sanitizeString = (str) => {
        if (typeof str !== 'string') return str;
        return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      };

      const sanitizeObject = (obj) => {
        for (const key in obj) {
          if (typeof obj[key] === 'string') {
            obj[key] = sanitizeString(obj[key]);
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeObject(obj[key]);
          }
        }
      };

      if (req.body && typeof req.body === 'object') {
        sanitizeObject(req.body);
      }

      if (req.query && typeof req.query === 'object') {
        sanitizeObject(req.query);
      }

      next();
    };
  }

  /**
   * File upload security configuration
   */
  getFileUploadConfig() {
    const allowedMimes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,application/pdf')
      .split(',')
      .map(type => type.trim());

    return {
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
        files: 5, // max 5 files per request
        fields: 20, // max 20 non-file fields
        parts: 25 // max 25 parts total
      },
      fileFilter: (req, file, cb) => {
        if (!allowedMimes.includes(file.mimetype)) {
          return cb(new Error(`File type ${file.mimetype} is not allowed`), false);
        }
        cb(null, true);
      }
    };
  }

  /**
   * Session security configuration
   */
  getSessionConfig() {
    return {
      secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
      name: 'jobifies.sid', // Don't use default session name
      resave: false,
      saveUninitialized: false,
      rolling: true, // Reset expiry on activity
      cookie: {
        secure: process.env.SESSION_SECURE === 'true' || this.isProduction,
        httpOnly: process.env.SESSION_HTTP_ONLY !== 'false',
        maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000, // 24 hours
        sameSite: process.env.SESSION_SAME_SITE || (this.isProduction ? 'strict' : 'lax')
      }
    };
  }

  /**
   * Security middleware for request logging and monitoring
   */
  getSecurityMonitoring() {
    return (req, res, next) => {
      // Log suspicious activities
      const suspiciousPatterns = [
        /\.\./,  // Directory traversal
        /<script/i,  // XSS attempts
        /union.*select/i,  // SQL injection
        /exec\(/,  // Code injection
        /eval\(/   // Code injection
      ];

      const checkSuspicious = (str) => {
        return suspiciousPatterns.some(pattern => pattern.test(str));
      };

      const logSuspiciousRequest = (type, value) => {
        console.warn(`Suspicious ${type} detected:`, {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          url: req.url,
          value: value,
          timestamp: new Date().toISOString()
        });
      };

      // Check URL for suspicious patterns
      if (checkSuspicious(req.url)) {
        logSuspiciousRequest('URL', req.url);
      }

      // Check headers for suspicious patterns
      Object.keys(req.headers).forEach(header => {
        if (checkSuspicious(req.headers[header])) {
          logSuspiciousRequest('header', `${header}: ${req.headers[header]}`);
        }
      });

      // Check body for suspicious patterns (for non-file uploads)
      if (req.body && typeof req.body === 'object') {
        const bodyStr = JSON.stringify(req.body);
        if (checkSuspicious(bodyStr)) {
          logSuspiciousRequest('body', bodyStr.substring(0, 500));
        }
      }

      next();
    };
  }
}

module.exports = new SecurityConfig();