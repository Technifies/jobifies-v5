import 'reflect-metadata';
import App from './app';
import config from './config';
import { initializeDatabase } from './config/database';
import logger from './utils/logger';
import './config/passport'; // Initialize Passport strategies

async function bootstrap() {
  try {
    // Initialize database connections (temporarily disabled for deployment)
    logger.info('Skipping database initialization for initial deployment...');
    // await initializeDatabase();
    
    // Create Express application
    const app = new App();
    
    // Start server
    const server = app.app.listen(config.PORT, () => {
      logger.info(`🚀 Jobifies API Server started on port ${config.PORT}`);
      logger.info(`📚 API Documentation available at: http://localhost:${config.PORT}/api-docs`);
      logger.info(`🌍 Environment: ${config.NODE_ENV}`);
      logger.info(`🔌 API Version: ${config.API_VERSION}`);
      
      if (config.NODE_ENV === 'development') {
        logger.info(`🏠 Health Check: http://localhost:${config.PORT}/health`);
        logger.info(`🔍 API Base URL: http://localhost:${config.PORT}/api/${config.API_VERSION}`);
      }
    });

    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      const bind = typeof config.PORT === 'string' 
        ? 'Pipe ' + config.PORT 
        : 'Port ' + config.PORT;

      switch (error.code) {
        case 'EACCES':
          logger.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
          // Close database connections
          const { closeDatabase } = await import('./config/database');
          await closeDatabase();
          logger.info('Database connections closed');
          
          logger.info('Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during graceful shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after 30 seconds');
        process.exit(1);
      }, 30000);
    };

    // Register shutdown handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Don't exit the process in production, just log the error
      if (config.NODE_ENV !== 'production') {
        process.exit(1);
      }
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Log memory usage periodically in development
    if (config.NODE_ENV === 'development') {
      setInterval(() => {
        const memUsage = process.memoryUsage();
        logger.debug('Memory Usage:', {
          rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
          external: `${Math.round(memUsage.external / 1024 / 1024)} MB`,
        });
      }, 60000); // Log every minute
    }

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
bootstrap().catch((error) => {
  logger.error('Bootstrap failed:', error);
  process.exit(1);
});