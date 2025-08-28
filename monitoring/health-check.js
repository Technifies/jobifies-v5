/**
 * Health check service for monitoring application components
 */

const http = require('http');
const https = require('https');
const { Pool } = require('pg');
const redis = require('redis');

class HealthChecker {
  constructor(config = {}) {
    this.config = {
      timeout: config.timeout || 5000,
      retries: config.retries || 3,
      database: config.database || process.env.DATABASE_URL,
      redis: config.redis || process.env.REDIS_URL,
      endpoints: config.endpoints || []
    };
    
    this.status = {
      overall: 'unknown',
      timestamp: new Date().toISOString(),
      services: {}
    };
  }

  /**
   * Check database connectivity
   */
  async checkDatabase() {
    try {
      const pool = new Pool({
        connectionString: this.config.database,
        connectionTimeoutMillis: this.config.timeout,
        query_timeout: this.config.timeout
      });

      const start = Date.now();
      const result = await pool.query('SELECT 1 as health_check, NOW() as current_time');
      const responseTime = Date.now() - start;

      await pool.end();

      return {
        status: 'healthy',
        responseTime,
        details: {
          query_result: result.rows[0],
          connection: 'successful'
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        details: {
          connection: 'failed'
        }
      };
    }
  }

  /**
   * Check Redis connectivity
   */
  async checkRedis() {
    try {
      const client = redis.createClient({
        url: this.config.redis,
        socket: {
          connectTimeout: this.config.timeout,
          commandTimeout: this.config.timeout
        }
      });

      const start = Date.now();
      await client.connect();
      
      // Test basic operations
      await client.set('health_check', 'ok', { EX: 60 });
      const value = await client.get('health_check');
      await client.del('health_check');
      
      const responseTime = Date.now() - start;
      await client.quit();

      return {
        status: 'healthy',
        responseTime,
        details: {
          ping: 'successful',
          set_get: value === 'ok' ? 'successful' : 'failed'
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        details: {
          connection: 'failed'
        }
      };
    }
  }

  /**
   * Check HTTP endpoint
   */
  async checkEndpoint(url, options = {}) {
    return new Promise((resolve) => {
      const isHttps = url.startsWith('https://');
      const client = isHttps ? https : http;
      
      const requestOptions = {
        timeout: this.config.timeout,
        method: options.method || 'GET',
        headers: options.headers || {}
      };

      const start = Date.now();
      const req = client.request(url, requestOptions, (res) => {
        const responseTime = Date.now() - start;
        let data = '';

        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            status: res.statusCode >= 200 && res.statusCode < 400 ? 'healthy' : 'unhealthy',
            statusCode: res.statusCode,
            responseTime,
            details: {
              headers: res.headers,
              body: data.substring(0, 500) // Limit response body
            }
          });
        });
      });

      req.on('error', (error) => {
        resolve({
          status: 'unhealthy',
          error: error.message,
          responseTime: Date.now() - start,
          details: {
            connection: 'failed'
          }
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          status: 'unhealthy',
          error: 'Request timeout',
          responseTime: this.config.timeout,
          details: {
            timeout: true
          }
        });
      });

      req.end();
    });
  }

  /**
   * Check system resources
   */
  checkSystem() {
    const used = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      status: 'healthy',
      details: {
        memory: {
          rss: Math.round(used.rss / 1024 / 1024 * 100) / 100,
          heapTotal: Math.round(used.heapTotal / 1024 / 1024 * 100) / 100,
          heapUsed: Math.round(used.heapUsed / 1024 / 1024 * 100) / 100,
          external: Math.round(used.external / 1024 / 1024 * 100) / 100,
          unit: 'MB'
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system,
          unit: 'microseconds'
        },
        uptime: Math.round(process.uptime()),
        node_version: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };
  }

  /**
   * Run all health checks
   */
  async runAllChecks() {
    const checks = {};
    
    // Database check
    if (this.config.database) {
      checks.database = await this.checkDatabase();
    }
    
    // Redis check
    if (this.config.redis) {
      checks.redis = await this.checkRedis();
    }
    
    // Endpoint checks
    for (const endpoint of this.config.endpoints) {
      const name = endpoint.name || endpoint.url;
      checks[name] = await this.checkEndpoint(endpoint.url, endpoint.options);
    }
    
    // System check
    checks.system = this.checkSystem();
    
    // Determine overall status
    const statuses = Object.values(checks).map(check => check.status);
    const hasUnhealthy = statuses.includes('unhealthy');
    const hasUnknown = statuses.includes('unknown');
    
    this.status = {
      overall: hasUnhealthy ? 'unhealthy' : hasUnknown ? 'degraded' : 'healthy',
      timestamp: new Date().toISOString(),
      services: checks
    };
    
    return this.status;
  }

  /**
   * Get current status
   */
  getStatus() {
    return this.status;
  }
}

module.exports = HealthChecker;