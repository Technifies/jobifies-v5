/**
 * Metrics collection service for application monitoring
 */

const prometheus = require('prom-client');
const EventEmitter = require('events');

class MetricsCollector extends EventEmitter {
  constructor() {
    super();
    
    // Create a Registry which registers the metrics
    this.register = new prometheus.Registry();
    
    // Add default labels which are added to all metrics
    this.register.setDefaultLabels({
      app: 'jobifies',
      environment: process.env.NODE_ENV || 'development'
    });
    
    // Enable collection of default metrics
    prometheus.collectDefaultMetrics({ register: this.register });
    
    this.initializeMetrics();
  }

  initializeMetrics() {
    // HTTP request duration histogram
    this.httpRequestDuration = new prometheus.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
    });

    // HTTP request total counter
    this.httpRequestTotal = new prometheus.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code']
    });

    // Database query duration histogram
    this.dbQueryDuration = new prometheus.Histogram({
      name: 'db_query_duration_seconds',
      help: 'Duration of database queries in seconds',
      labelNames: ['query_type', 'table'],
      buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 3, 5]
    });

    // Database connection pool gauge
    this.dbConnections = new prometheus.Gauge({
      name: 'db_connections_active',
      help: 'Number of active database connections',
      labelNames: ['pool']
    });

    // Redis operations counter
    this.redisOperations = new prometheus.Counter({
      name: 'redis_operations_total',
      help: 'Total number of Redis operations',
      labelNames: ['operation', 'status']
    });

    // Cache hit/miss ratio
    this.cacheHits = new prometheus.Counter({
      name: 'cache_hits_total',
      help: 'Total number of cache hits',
      labelNames: ['cache_type']
    });

    this.cacheMisses = new prometheus.Counter({
      name: 'cache_misses_total',
      help: 'Total number of cache misses',
      labelNames: ['cache_type']
    });

    // User sessions gauge
    this.activeSessions = new prometheus.Gauge({
      name: 'active_user_sessions',
      help: 'Number of active user sessions'
    });

    // Job application metrics
    this.jobApplications = new prometheus.Counter({
      name: 'job_applications_total',
      help: 'Total number of job applications',
      labelNames: ['status', 'job_type']
    });

    // File upload metrics
    this.fileUploads = new prometheus.Counter({
      name: 'file_uploads_total',
      help: 'Total number of file uploads',
      labelNames: ['file_type', 'status']
    });

    // Email sending metrics
    this.emailsSent = new prometheus.Counter({
      name: 'emails_sent_total',
      help: 'Total number of emails sent',
      labelNames: ['type', 'status']
    });

    // API rate limiting
    this.rateLimitHits = new prometheus.Counter({
      name: 'rate_limit_hits_total',
      help: 'Total number of rate limit hits',
      labelNames: ['endpoint', 'ip']
    });

    // Error metrics
    this.errors = new prometheus.Counter({
      name: 'application_errors_total',
      help: 'Total number of application errors',
      labelNames: ['type', 'severity', 'component']
    });

    // Register all metrics
    this.register.registerMetric(this.httpRequestDuration);
    this.register.registerMetric(this.httpRequestTotal);
    this.register.registerMetric(this.dbQueryDuration);
    this.register.registerMetric(this.dbConnections);
    this.register.registerMetric(this.redisOperations);
    this.register.registerMetric(this.cacheHits);
    this.register.registerMetric(this.cacheMisses);
    this.register.registerMetric(this.activeSessions);
    this.register.registerMetric(this.jobApplications);
    this.register.registerMetric(this.fileUploads);
    this.register.registerMetric(this.emailsSent);
    this.register.registerMetric(this.rateLimitHits);
    this.register.registerMetric(this.errors);
  }

  // Express middleware for HTTP metrics
  httpMiddleware() {
    return (req, res, next) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const route = req.route ? req.route.path : req.path;
        
        this.httpRequestDuration
          .labels(req.method, route, res.statusCode)
          .observe(duration);
          
        this.httpRequestTotal
          .labels(req.method, route, res.statusCode)
          .inc();
      });
      
      next();
    };
  }

  // Database metrics
  recordDbQuery(queryType, table, duration) {
    this.dbQueryDuration
      .labels(queryType, table)
      .observe(duration / 1000);
  }

  updateDbConnections(pool, count) {
    this.dbConnections.labels(pool).set(count);
  }

  // Redis metrics
  recordRedisOperation(operation, status) {
    this.redisOperations.labels(operation, status).inc();
  }

  // Cache metrics
  recordCacheHit(cacheType) {
    this.cacheHits.labels(cacheType).inc();
  }

  recordCacheMiss(cacheType) {
    this.cacheMisses.labels(cacheType).inc();
  }

  // Session metrics
  updateActiveSessions(count) {
    this.activeSessions.set(count);
  }

  // Business metrics
  recordJobApplication(status, jobType) {
    this.jobApplications.labels(status, jobType).inc();
  }

  recordFileUpload(fileType, status) {
    this.fileUploads.labels(fileType, status).inc();
  }

  recordEmailSent(type, status) {
    this.emailsSent.labels(type, status).inc();
  }

  // Rate limiting metrics
  recordRateLimitHit(endpoint, ip) {
    this.rateLimitHits.labels(endpoint, ip).inc();
  }

  // Error metrics
  recordError(type, severity, component) {
    this.errors.labels(type, severity, component).inc();
    this.emit('error', { type, severity, component, timestamp: new Date() });
  }

  // Get metrics for Prometheus
  getMetrics() {
    return this.register.metrics();
  }

  // Get metrics as JSON
  async getMetricsAsJSON() {
    const metrics = await this.register.getMetricsAsJSON();
    return metrics;
  }

  // Clear all metrics (useful for testing)
  clearMetrics() {
    this.register.clear();
    this.initializeMetrics();
  }

  // Custom gauge setter
  setGauge(name, value, labels = {}) {
    const gauge = this.register.getSingleMetric(name);
    if (gauge) {
      gauge.set(labels, value);
    }
  }

  // Custom counter incrementer
  incrementCounter(name, labels = {}, value = 1) {
    const counter = this.register.getSingleMetric(name);
    if (counter) {
      counter.inc(labels, value);
    }
  }
}

// Export singleton instance
module.exports = new MetricsCollector();