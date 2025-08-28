import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import config from '../config';

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    let log = `${timestamp} [${level}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// Create logs directory if it doesn't exist
const logsDir = path.resolve(config.logging.filePath);

// Daily rotate file transport for all logs
const fileRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: config.logging.maxSize,
  maxFiles: config.logging.maxFiles,
  format: logFormat,
});

// Daily rotate file transport for errors
const errorFileRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: config.logging.maxSize,
  maxFiles: config.logging.maxFiles,
  format: logFormat,
});

// Create logger
const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: { service: 'jobifies-api' },
  transports: [
    fileRotateTransport,
    errorFileRotateTransport,
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: config.logging.maxSize,
      maxFiles: config.logging.maxFiles,
      format: logFormat,
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: config.logging.maxSize,
      maxFiles: config.logging.maxFiles,
      format: logFormat,
    }),
  ],
});

// Add console transport for development
if (config.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
  }));
}

// Log rotation event handlers
fileRotateTransport.on('rotate', (oldFilename, newFilename) => {
  logger.info('Log file rotated', { oldFilename, newFilename });
});

fileRotateTransport.on('archive', (zipFilename) => {
  logger.info('Log file archived', { zipFilename });
});

// Helper methods
export const logHTTP = (req: any, res: any, responseTime: number) => {
  const logData = {
    method: req.method,
    url: req.url,
    status: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id,
  };

  if (res.statusCode >= 400) {
    logger.error('HTTP Error', logData);
  } else {
    logger.info('HTTP Request', logData);
  }
};

export const logDatabaseQuery = (query: string, duration: number, error?: any) => {
  const logData = {
    query: query.substring(0, 200), // Truncate long queries
    duration: `${duration}ms`,
  };

  if (error) {
    logger.error('Database Query Error', { ...logData, error: error.message });
  } else {
    logger.debug('Database Query', logData);
  }
};

export const logAuth = (event: string, userId?: string, email?: string, ip?: string) => {
  logger.info('Auth Event', {
    event,
    userId,
    email,
    ip,
    timestamp: new Date().toISOString(),
  });
};

export const logSecurity = (event: string, details: any, ip?: string) => {
  logger.warn('Security Event', {
    event,
    details,
    ip,
    timestamp: new Date().toISOString(),
  });
};

export const logPayment = (event: string, details: any, userId?: string) => {
  logger.info('Payment Event', {
    event,
    details,
    userId,
    timestamp: new Date().toISOString(),
  });
};

export const logEmail = (event: string, to: string, subject: string, status: 'sent' | 'failed', error?: any) => {
  const logData = {
    event,
    to,
    subject,
    status,
    timestamp: new Date().toISOString(),
  };

  if (error) {
    logger.error('Email Failed', { ...logData, error: error.message });
  } else {
    logger.info('Email Sent', logData);
  }
};

export const logFileUpload = (filename: string, size: number, userId: string, status: 'success' | 'failed', error?: any) => {
  const logData = {
    filename,
    size,
    userId,
    status,
    timestamp: new Date().toISOString(),
  };

  if (error) {
    logger.error('File Upload Failed', { ...logData, error: error.message });
  } else {
    logger.info('File Upload Success', logData);
  }
};

export default logger;