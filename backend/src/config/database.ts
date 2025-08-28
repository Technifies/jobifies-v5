import { Pool, PoolConfig } from 'pg';
import { createClient, RedisClientType } from 'redis';
import config from './index';
import logger from '../utils/logger';

// PostgreSQL Connection Pool
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: Pool;
  private redisClient: RedisClientType;

  private constructor() {
    // PostgreSQL pool configuration
    const poolConfig: PoolConfig = {
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.user,
      password: config.database.password,
      ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
      min: config.database.pool.min,
      max: config.database.pool.max,
      connectionTimeoutMillis: config.database.connectionTimeout,
      idleTimeoutMillis: 30000,
      allowExitOnIdle: false,
    };

    // Handle DATABASE_URL for Render.com deployment
    if (process.env.DATABASE_URL) {
      poolConfig.connectionString = process.env.DATABASE_URL;
      poolConfig.ssl = { rejectUnauthorized: false };
    }

    this.pool = new Pool(poolConfig);

    // Pool event handlers
    this.pool.on('connect', (client) => {
      logger.info('New PostgreSQL client connected');
    });

    this.pool.on('error', (err, client) => {
      logger.error('Unexpected error on idle PostgreSQL client', err);
    });

    this.pool.on('acquire', (client) => {
      logger.debug('PostgreSQL client acquired from pool');
    });

    this.pool.on('release', (client) => {
      logger.debug('PostgreSQL client released back to pool');
    });

    // Redis client configuration
    const redisUrl = process.env.REDIS_URL || 
      `redis://${config.redis.password ? `:${config.redis.password}@` : ''}${config.redis.host}:${config.redis.port}/${config.redis.db}`;

    this.redisClient = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: config.redis.connectTimeout,
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
    });

    // Redis event handlers
    this.redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    this.redisClient.on('ready', () => {
      logger.info('Redis client ready');
    });

    this.redisClient.on('error', (err) => {
      logger.error('Redis client error', err);
    });

    this.redisClient.on('end', () => {
      logger.info('Redis client disconnected');
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async initialize(): Promise<void> {
    try {
      // Test PostgreSQL connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      logger.info('PostgreSQL connection established successfully');

      // Connect Redis client
      if (!this.redisClient.isOpen) {
        await this.redisClient.connect();
        logger.info('Redis connection established successfully');
      }
    } catch (error) {
      logger.error('Database initialization failed', error);
      throw error;
    }
  }

  public getPool(): Pool {
    return this.pool;
  }

  public getRedisClient(): RedisClientType {
    return this.redisClient;
  }

  public async query(text: string, params?: any[]): Promise<any> {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      logger.debug('Executed query', { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      logger.error('Query execution failed', { text, params, error });
      throw error;
    }
  }

  public async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  public async close(): Promise<void> {
    try {
      await this.pool.end();
      await this.redisClient.disconnect();
      logger.info('Database connections closed');
    } catch (error) {
      logger.error('Error closing database connections', error);
      throw error;
    }
  }

  // Health check methods
  public async healthCheck(): Promise<{ postgres: boolean; redis: boolean }> {
    const health = { postgres: false, redis: false };

    try {
      const client = await this.pool.connect();
      await client.query('SELECT 1');
      client.release();
      health.postgres = true;
    } catch (error) {
      logger.error('PostgreSQL health check failed', error);
    }

    try {
      await this.redisClient.ping();
      health.redis = true;
    } catch (error) {
      logger.error('Redis health check failed', error);
    }

    return health;
  }
}

// Singleton instance
const db = DatabaseConnection.getInstance();

// Export commonly used methods
export const pool = db.getPool();
export const redis = db.getRedisClient();
export const query = db.query.bind(db);
export const transaction = db.transaction.bind(db);
export const initializeDatabase = db.initialize.bind(db);
export const closeDatabase = db.close.bind(db);
export const healthCheck = db.healthCheck.bind(db);

export default db;