import { initializeDatabase, closeDatabase } from '../src/config/database';
import logger from '../src/utils/logger';

// Setup test environment
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Initialize test database connection
  try {
    await initializeDatabase();
    logger.info('Test database initialized');
  } catch (error) {
    logger.error('Failed to initialize test database:', error);
    process.exit(1);
  }
});

// Cleanup after tests
afterAll(async () => {
  try {
    await closeDatabase();
    logger.info('Test database connections closed');
  } catch (error) {
    logger.error('Failed to close test database connections:', error);
  }
});

// Suppress console output during tests
if (process.env.NODE_ENV === 'test') {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
  console.info = jest.fn();
}