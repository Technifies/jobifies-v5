import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectRedis from 'connect-redis';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import passport from 'passport';

import config from './config';
import { redis } from './config/database';
import logger, { logHTTP } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { ApiResponse } from './types';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import jobRoutes from './routes/jobs';
import companyRoutes from './routes/companies';
import applicationRoutes from './routes/applications';
import paymentRoutes from './routes/payments';
import adminRoutes from './routes/admin';
import uploadRoutes from './routes/uploads';
import healthRoutes from './routes/health';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }));

    // CORS configuration
    const corsOptions = {
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (mobile apps, postman, etc.)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = Array.isArray(config.security.corsOrigin) 
          ? config.security.corsOrigin 
          : [config.security.corsOrigin];
        
        if (allowedOrigins.indexOf(origin) !== -1 || config.NODE_ENV === 'development') {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'), false);
        }
      },
      credentials: true,
      optionsSuccessStatus: 200,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    };

    this.app.use(cors(corsOptions));
    this.app.use(compression());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.maxRequests,
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        error: 'RATE_LIMIT_EXCEEDED',
      },
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: config.rateLimit.skipSuccessfulRequests,
      keyGenerator: (req: Request) => {
        return req.ip + ':' + req.get('User-Agent');
      },
    });

    // Slow down repeated requests
    const speedLimiter = slowDown({
      windowMs: config.rateLimit.windowMs,
      delayAfter: Math.floor(config.rateLimit.maxRequests * 0.5),
      delayMs: () => 100,
      maxDelayMs: 10000,
      validate: { delayMs: false }
    });

    this.app.use('/api', limiter);
    this.app.use('/api', speedLimiter);

    // Body parsing middleware
    this.app.use(express.json({ 
      limit: '10mb',
      verify: (req: any, res, buf) => {
        req.rawBody = buf;
      }
    }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(cookieParser());

    // Session configuration with Redis store
    this.app.use(session({
      store: new connectRedis({
        client: redis,
        prefix: 'jobifies:sess:',
      }),
      secret: config.security.sessionSecret,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
      },
    }));

    // Initialize Passport
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Request logging
    if (config.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }
    this.app.use(requestLogger);

    // Trust proxy (important for Render.com deployment)
    this.app.set('trust proxy', true);

    // API versioning
    this.app.use(`/api/${config.API_VERSION}`, (req: Request, res: Response, next: NextFunction) => {
      res.setHeader('API-Version', config.API_VERSION);
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check route (outside of API versioning)
    this.app.use('/health', healthRoutes);

    // API routes with versioning
    const apiRouter = express.Router();
    
    apiRouter.use('/auth', authRoutes);
    apiRouter.use('/users', userRoutes);
    apiRouter.use('/jobs', jobRoutes);
    apiRouter.use('/companies', companyRoutes);
    apiRouter.use('/applications', applicationRoutes);
    apiRouter.use('/payments', paymentRoutes);
    apiRouter.use('/admin', adminRoutes);
    apiRouter.use('/uploads', uploadRoutes);

    this.app.use(`/api/${config.API_VERSION}`, apiRouter);

    // Root route
    this.app.get('/', (req: Request, res: Response) => {
      const response: ApiResponse = {
        success: true,
        message: 'Jobifies API is running',
        data: {
          version: config.API_VERSION,
          timestamp: new Date().toISOString(),
          environment: config.NODE_ENV,
        },
      };
      res.json(response);
    });
  }

  private initializeSwagger(): void {
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Jobifies API',
          version: '1.0.0',
          description: 'A comprehensive job portal API built with Node.js, Express, and TypeScript',
          contact: {
            name: 'Jobifies Team',
            email: 'support@jobifies.com',
          },
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
          },
        },
        servers: [
          {
            url: config.urls.backend,
            description: config.NODE_ENV === 'production' ? 'Production Server' : 'Development Server',
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      apis: ['./src/routes/*.ts', './src/models/*.ts'], // Path to the API files
    };

    const specs = swaggerJsdoc(options);
    
    // Swagger UI options
    const swaggerUiOptions = {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Jobifies API Documentation',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
      },
    };

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);

    // Graceful shutdown handlers
    process.on('SIGTERM', this.gracefulShutdown);
    process.on('SIGINT', this.gracefulShutdown);
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });
  }

  private gracefulShutdown = (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    const server = this.app.listen();
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

    // Force close after 30 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after 30 seconds');
      process.exit(1);
    }, 30000);
  };
}

export default App;