/**
 * Advanced caching configuration for Jobifies
 * Handles multiple cache layers: Redis, CDN, and application-level caching
 */

const redis = require('redis');
const NodeCache = require('node-cache');

class CacheManager {
  constructor(config = {}) {
    this.config = {
      redis: {
        url: config.redisUrl || process.env.REDIS_URL || 'redis://localhost:6379',
        keyPrefix: config.keyPrefix || 'jobifies:',
        defaultTtl: config.defaultTtl || 3600, // 1 hour
        maxRetries: config.maxRetries || 3,
        retryDelayOnFailover: config.retryDelayOnFailover || 100,
        enableOfflineQueue: config.enableOfflineQueue || false
      },
      memory: {
        stdTTL: config.memoryTtl || 300, // 5 minutes
        checkperiod: config.checkPeriod || 60, // Check for expired keys every minute
        useClones: config.useClones || false,
        maxKeys: config.maxKeys || 1000
      },
      cdn: {
        enabled: config.cdnEnabled || process.env.NODE_ENV === 'production',
        maxAge: config.cdnMaxAge || 86400, // 24 hours
        staleWhileRevalidate: config.staleWhileRevalidate || 3600, // 1 hour
        staleIfError: config.staleIfError || 86400 // 24 hours
      }
    };

    this.isProduction = process.env.NODE_ENV === 'production';
    this.redisClient = null;
    this.memoryCache = null;
    this.initializeCaches();
  }

  /**
   * Initialize cache systems
   */
  async initializeCaches() {
    try {
      // Initialize Redis client
      this.redisClient = redis.createClient({
        url: this.config.redis.url,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > this.config.redis.maxRetries) {
              return new Error('Redis connection failed after max retries');
            }
            return Math.min(retries * 50, 500);
          }
        },
        retryDelayOnFailover: this.config.redis.retryDelayOnFailover,
        enableOfflineQueue: this.config.redis.enableOfflineQueue
      });

      this.redisClient.on('error', (err) => {
        console.error('Redis Cache Error:', err);
      });

      this.redisClient.on('connect', () => {
        console.log('✅ Redis cache connected');
      });

      this.redisClient.on('reconnecting', () => {
        console.log('🔄 Redis cache reconnecting...');
      });

      await this.redisClient.connect();

      // Initialize in-memory cache
      this.memoryCache = new NodeCache(this.config.memory);

      console.log('✅ Cache systems initialized');
    } catch (error) {
      console.error('❌ Failed to initialize cache systems:', error);
      // Fallback to memory cache only
      this.memoryCache = new NodeCache(this.config.memory);
      console.log('⚠️  Running with memory cache only');
    }
  }

  /**
   * Generate cache key with prefix
   */
  generateKey(key, namespace = '') {
    const prefix = this.config.redis.keyPrefix;
    return namespace ? `${prefix}${namespace}:${key}` : `${prefix}${key}`;
  }

  /**
   * Multi-level cache get
   */
  async get(key, options = {}) {
    const {
      namespace = '',
      fallback = null,
      skipMemory = false,
      skipRedis = false
    } = options;

    const cacheKey = this.generateKey(key, namespace);
    const memoryKey = `${namespace}:${key}`;

    try {
      // Level 1: Memory cache (fastest)
      if (!skipMemory && this.memoryCache) {
        const memoryValue = this.memoryCache.get(memoryKey);
        if (memoryValue !== undefined) {
          return memoryValue;
        }
      }

      // Level 2: Redis cache (fast, persistent)
      if (!skipRedis && this.redisClient && this.redisClient.isReady) {
        const redisValue = await this.redisClient.get(cacheKey);
        if (redisValue !== null) {
          const parsedValue = JSON.parse(redisValue);
          
          // Store in memory cache for faster access
          if (!skipMemory && this.memoryCache) {
            this.memoryCache.set(memoryKey, parsedValue, this.config.memory.stdTTL);
          }
          
          return parsedValue;
        }
      }

      return fallback;
    } catch (error) {
      console.error('Cache get error:', error);
      return fallback;
    }
  }

  /**
   * Multi-level cache set
   */
  async set(key, value, options = {}) {
    const {
      namespace = '',
      ttl = this.config.redis.defaultTtl,
      skipMemory = false,
      skipRedis = false
    } = options;

    const cacheKey = this.generateKey(key, namespace);
    const memoryKey = `${namespace}:${key}`;

    try {
      // Set in Redis cache
      if (!skipRedis && this.redisClient && this.redisClient.isReady) {
        await this.redisClient.setEx(cacheKey, ttl, JSON.stringify(value));
      }

      // Set in memory cache
      if (!skipMemory && this.memoryCache) {
        const memoryTtl = Math.min(ttl, this.config.memory.stdTTL);
        this.memoryCache.set(memoryKey, value, memoryTtl);
      }

      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Delete from all cache levels
   */
  async del(key, options = {}) {
    const { namespace = '' } = options;
    const cacheKey = this.generateKey(key, namespace);
    const memoryKey = `${namespace}:${key}`;

    try {
      // Delete from Redis
      if (this.redisClient && this.redisClient.isReady) {
        await this.redisClient.del(cacheKey);
      }

      // Delete from memory
      if (this.memoryCache) {
        this.memoryCache.del(memoryKey);
      }

      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Clear cache by pattern
   */
  async clearPattern(pattern, options = {}) {
    const { namespace = '' } = options;
    const fullPattern = this.generateKey(pattern, namespace);

    try {
      if (this.redisClient && this.redisClient.isReady) {
        const keys = await this.redisClient.keys(fullPattern);
        if (keys.length > 0) {
          await this.redisClient.del(keys);
        }
      }

      // Clear memory cache (this clears all as NodeCache doesn't support pattern matching)
      if (namespace && this.memoryCache) {
        const keys = this.memoryCache.keys();
        keys.forEach(key => {
          if (key.startsWith(`${namespace}:`)) {
            this.memoryCache.del(key);
          }
        });
      }

      return true;
    } catch (error) {
      console.error('Cache clear pattern error:', error);
      return false;
    }
  }

  /**
   * Get or set with function (cache-aside pattern)
   */
  async getOrSet(key, fetchFunction, options = {}) {
    const {
      namespace = '',
      ttl = this.config.redis.defaultTtl,
      skipCache = false
    } = options;

    if (skipCache) {
      return await fetchFunction();
    }

    // Try to get from cache first
    const cached = await this.get(key, { namespace });
    if (cached !== null) {
      return cached;
    }

    // Fetch data and cache it
    try {
      const data = await fetchFunction();
      if (data !== null && data !== undefined) {
        await this.set(key, data, { namespace, ttl });
      }
      return data;
    } catch (error) {
      console.error('Cache getOrSet error:', error);
      throw error;
    }
  }

  /**
   * Increment counter in cache
   */
  async increment(key, options = {}) {
    const {
      namespace = '',
      by = 1,
      ttl = this.config.redis.defaultTtl,
      initial = 0
    } = options;

    const cacheKey = this.generateKey(key, namespace);

    try {
      if (this.redisClient && this.redisClient.isReady) {
        const current = await this.redisClient.get(cacheKey);
        if (current === null) {
          // Set initial value with TTL
          await this.redisClient.setEx(cacheKey, ttl, initial + by);
          return initial + by;
        } else {
          // Increment existing value
          return await this.redisClient.incrBy(cacheKey, by);
        }
      } else {
        // Fallback to memory cache
        const memoryKey = `${namespace}:${key}`;
        const current = this.memoryCache.get(memoryKey) || initial;
        const newValue = current + by;
        this.memoryCache.set(memoryKey, newValue, ttl);
        return newValue;
      }
    } catch (error) {
      console.error('Cache increment error:', error);
      return null;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats() {
    const stats = {
      memory: {
        keys: 0,
        hits: 0,
        misses: 0,
        size: 0
      },
      redis: {
        connected: false,
        keys: 0,
        memory: 0
      }
    };

    try {
      // Memory cache stats
      if (this.memoryCache) {
        const memStats = this.memoryCache.getStats();
        stats.memory = {
          keys: memStats.keys,
          hits: memStats.hits,
          misses: memStats.misses,
          size: memStats.ksize + memStats.vsize
        };
      }

      // Redis stats
      if (this.redisClient && this.redisClient.isReady) {
        stats.redis.connected = true;
        const info = await this.redisClient.info('memory');
        const memoryMatch = info.match(/used_memory:(\d+)/);
        if (memoryMatch) {
          stats.redis.memory = parseInt(memoryMatch[1]);
        }

        // Count keys with our prefix
        const keys = await this.redisClient.keys(`${this.config.redis.keyPrefix}*`);
        stats.redis.keys = keys.length;
      }
    } catch (error) {
      console.error('Error getting cache stats:', error);
    }

    return stats;
  }

  /**
   * Express middleware for response caching
   */
  middleware(options = {}) {
    const {
      ttl = 300, // 5 minutes
      namespace = 'http',
      skipQuery = false,
      skipBody = false,
      keyGenerator = null
    } = options;

    return async (req, res, next) => {
      // Skip caching for non-GET requests
      if (req.method !== 'GET') {
        return next();
      }

      // Generate cache key
      let cacheKey;
      if (keyGenerator && typeof keyGenerator === 'function') {
        cacheKey = keyGenerator(req);
      } else {
        const baseKey = req.path;
        const queryKey = skipQuery ? '' : JSON.stringify(req.query);
        cacheKey = `${baseKey}:${queryKey}`;
      }

      // Try to get cached response
      const cached = await this.get(cacheKey, { namespace });
      if (cached) {
        // Set cache headers
        res.set('X-Cache', 'HIT');
        res.set('Cache-Control', `public, max-age=${ttl}`);
        return res.json(cached);
      }

      // Capture response
      const originalJson = res.json;
      res.json = function(data) {
        // Cache the response
        cacheManager.set(cacheKey, data, { namespace, ttl }).catch(err => {
          console.error('Response caching error:', err);
        });

        // Set cache headers
        res.set('X-Cache', 'MISS');
        res.set('Cache-Control', `public, max-age=${ttl}`);
        
        return originalJson.call(this, data);
      };

      next();
    };
  }

  /**
   * CDN cache headers configuration
   */
  getCDNHeaders(type = 'default', customTtl = null) {
    const configs = {
      static: {
        'Cache-Control': `public, max-age=${customTtl || 31536000}, immutable`, // 1 year
        'Expires': new Date(Date.now() + (customTtl || 31536000) * 1000).toUTCString(),
        'ETag': `"${Date.now()}"`,
        'Vary': 'Accept-Encoding'
      },
      api: {
        'Cache-Control': `public, max-age=${customTtl || 300}, s-maxage=${customTtl || 600}`, // 5min client, 10min CDN
        'Vary': 'Accept-Encoding, Authorization',
        'ETag': `"${Date.now()}"`
      },
      dynamic: {
        'Cache-Control': `public, max-age=${customTtl || 60}, s-maxage=${customTtl || 300}`, // 1min client, 5min CDN
        'Vary': 'Accept-Encoding, Authorization, Cookie'
      },
      private: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      stale: {
        'Cache-Control': `public, max-age=${customTtl || this.config.cdn.maxAge}, stale-while-revalidate=${this.config.cdn.staleWhileRevalidate}, stale-if-error=${this.config.cdn.staleIfError}`,
        'Vary': 'Accept-Encoding'
      }
    };

    return configs[type] || configs.default;
  }

  /**
   * Graceful shutdown
   */
  async close() {
    try {
      if (this.redisClient && this.redisClient.isReady) {
        await this.redisClient.quit();
        console.log('✅ Redis connection closed');
      }

      if (this.memoryCache) {
        this.memoryCache.close();
        console.log('✅ Memory cache closed');
      }
    } catch (error) {
      console.error('Error closing cache connections:', error);
    }
  }
}

// Create singleton instance
const cacheManager = new CacheManager();

// Export both the class and instance
module.exports = {
  CacheManager,
  cacheManager
};