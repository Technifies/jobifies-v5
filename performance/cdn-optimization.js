/**
 * CDN and Performance Optimization Configuration for Jobifies
 * Handles image optimization, asset compression, and CDN integration
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

class CDNOptimizer {
  constructor(config = {}) {
    this.config = {
      imageFormats: ['webp', 'jpeg', 'png'],
      imageSizes: [320, 640, 768, 1024, 1280, 1920],
      imageQuality: {
        webp: 80,
        jpeg: 85,
        png: 90
      },
      maxFileSize: 10 * 1024 * 1024, // 10MB
      cachePath: config.cachePath || './cache/optimized',
      cdnBaseUrl: config.cdnBaseUrl || process.env.CDN_BASE_URL,
      enableImageOptimization: config.enableImageOptimization !== false,
      enableResponsiveImages: config.enableResponsiveImages !== false,
      enableWebP: config.enableWebP !== false,
      enableAVIF: config.enableAVIF || false,
      ...config
    };

    this.isProduction = process.env.NODE_ENV === 'production';
    this.supportedMimes = {
      'image/jpeg': 'jpeg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'image/svg+xml': 'svg'
    };
  }

  /**
   * Initialize optimizer
   */
  async initialize() {
    try {
      // Create cache directory
      await fs.mkdir(this.config.cachePath, { recursive: true });
      console.log('✅ CDN Optimizer initialized');
    } catch (error) {
      console.error('❌ Failed to initialize CDN Optimizer:', error);
    }
  }

  /**
   * Generate file hash for caching
   */
  generateFileHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex').substring(0, 16);
  }

  /**
   * Get optimal image format based on browser support
   */
  getOptimalFormat(acceptHeader = '', originalFormat = 'jpeg') {
    if (this.config.enableAVIF && acceptHeader.includes('image/avif')) {
      return 'avif';
    }
    if (this.config.enableWebP && acceptHeader.includes('image/webp')) {
      return 'webp';
    }
    return originalFormat;
  }

  /**
   * Optimize single image
   */
  async optimizeImage(buffer, options = {}) {
    const {
      width,
      height,
      format = 'jpeg',
      quality,
      progressive = true,
      stripMetadata = true
    } = options;

    try {
      let pipeline = sharp(buffer);

      // Strip metadata for smaller files (but keep orientation)
      if (stripMetadata) {
        pipeline = pipeline.rotate(); // Auto-rotate based on EXIF
      }

      // Resize if dimensions specified
      if (width || height) {
        pipeline = pipeline.resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // Apply format-specific optimizations
      switch (format) {
        case 'webp':
          pipeline = pipeline.webp({
            quality: quality || this.config.imageQuality.webp,
            progressive,
            effort: this.isProduction ? 6 : 4
          });
          break;
        
        case 'avif':
          pipeline = pipeline.avif({
            quality: quality || this.config.imageQuality.webp,
            effort: this.isProduction ? 9 : 4
          });
          break;
        
        case 'jpeg':
          pipeline = pipeline.jpeg({
            quality: quality || this.config.imageQuality.jpeg,
            progressive,
            mozjpeg: true // Use mozjpeg encoder for better compression
          });
          break;
        
        case 'png':
          pipeline = pipeline.png({
            quality: quality || this.config.imageQuality.png,
            progressive,
            compressionLevel: this.isProduction ? 9 : 6,
            palette: true // Use palette for smaller files when possible
          });
          break;
      }

      return await pipeline.toBuffer();
    } catch (error) {
      console.error('Image optimization error:', error);
      throw error;
    }
  }

  /**
   * Generate responsive image set
   */
  async generateResponsiveImages(buffer, options = {}) {
    const {
      formats = ['webp', 'jpeg'],
      sizes = this.config.imageSizes,
      quality,
      filename = 'image'
    } = options;

    const results = [];
    const originalMeta = await sharp(buffer).metadata();

    for (const format of formats) {
      for (const width of sizes) {
        // Skip if width is larger than original
        if (width > originalMeta.width) continue;

        try {
          const optimizedBuffer = await this.optimizeImage(buffer, {
            width,
            format,
            quality
          });

          const hash = this.generateFileHash(optimizedBuffer);
          const extension = format === 'jpeg' ? 'jpg' : format;
          const optimizedFilename = `${filename}_${width}w_${hash}.${extension}`;

          results.push({
            buffer: optimizedBuffer,
            filename: optimizedFilename,
            format,
            width,
            size: optimizedBuffer.length,
            url: this.config.cdnBaseUrl ? `${this.config.cdnBaseUrl}/${optimizedFilename}` : optimizedFilename
          });
        } catch (error) {
          console.error(`Failed to optimize image ${filename} at ${width}px in ${format}:`, error);
        }
      }
    }

    return results;
  }

  /**
   * Express middleware for image optimization
   */
  imageOptimizationMiddleware() {
    return async (req, res, next) => {
      // Only handle image requests
      if (!req.path.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
        return next();
      }

      const { w: width, h: height, q: quality, f: format } = req.query;
      const acceptHeader = req.get('Accept') || '';
      const originalUrl = req.path;

      try {
        // Generate cache key
        const cacheKey = crypto
          .createHash('sha256')
          .update(`${originalUrl}_${width}_${height}_${quality}_${format}_${acceptHeader}`)
          .digest('hex')
          .substring(0, 16);

        const cacheFile = path.join(this.config.cachePath, `${cacheKey}.webp`);

        // Check if optimized version exists in cache
        try {
          const cachedBuffer = await fs.readFile(cacheFile);
          res.set({
            'Content-Type': 'image/webp',
            'Cache-Control': 'public, max-age=31536000, immutable',
            'X-Optimized': 'cache-hit'
          });
          return res.send(cachedBuffer);
        } catch {
          // Cache miss, continue to optimization
        }

        // Get original image (this would typically come from your file storage)
        const originalPath = path.join('./uploads', originalUrl);
        const originalBuffer = await fs.readFile(originalPath);

        // Determine optimal format
        const optimalFormat = format || this.getOptimalFormat(acceptHeader, 'webp');

        // Optimize image
        const optimizedBuffer = await this.optimizeImage(originalBuffer, {
          width: width ? parseInt(width) : undefined,
          height: height ? parseInt(height) : undefined,
          format: optimalFormat,
          quality: quality ? parseInt(quality) : undefined
        });

        // Cache the optimized image
        await fs.writeFile(cacheFile, optimizedBuffer);

        // Set response headers
        res.set({
          'Content-Type': `image/${optimalFormat}`,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Length': optimizedBuffer.length,
          'X-Optimized': 'cache-miss',
          'X-Original-Size': originalBuffer.length,
          'X-Compressed-Size': optimizedBuffer.length,
          'X-Compression-Ratio': Math.round((1 - optimizedBuffer.length / originalBuffer.length) * 100)
        });

        res.send(optimizedBuffer);
      } catch (error) {
        console.error('Image optimization middleware error:', error);
        next(); // Fall back to serving original image
      }
    };
  }

  /**
   * Generate picture element HTML for responsive images
   */
  generatePictureElement(imageUrl, options = {}) {
    const {
      alt = '',
      sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
      loading = 'lazy',
      className = '',
      formats = ['webp', 'jpeg']
    } = options;

    const baseName = path.basename(imageUrl, path.extname(imageUrl));
    const sources = [];

    // Generate source elements for each format
    formats.forEach(format => {
      const srcset = this.config.imageSizes
        .map(size => {
          const url = this.config.cdnBaseUrl 
            ? `${this.config.cdnBaseUrl}/${baseName}_${size}w.${format === 'jpeg' ? 'jpg' : format}`
            : `${baseName}_${size}w.${format === 'jpeg' ? 'jpg' : format}`;
          return `${url} ${size}w`;
        })
        .join(', ');

      sources.push(`<source srcset="${srcset}" sizes="${sizes}" type="image/${format}">`);
    });

    // Fallback img element
    const fallbackSrc = this.config.cdnBaseUrl 
      ? `${this.config.cdnBaseUrl}/${baseName}_${this.config.imageSizes[0]}w.jpg`
      : `${baseName}_${this.config.imageSizes[0]}w.jpg`;

    const img = `<img src="${fallbackSrc}" alt="${alt}" loading="${loading}" class="${className}">`;

    return `<picture>${sources.join('')}${img}</picture>`;
  }

  /**
   * Asset compression middleware
   */
  compressionMiddleware() {
    const compression = require('compression');
    
    return compression({
      filter: (req, res) => {
        // Don't compress if response is already compressed
        if (res.get('Content-Encoding')) {
          return false;
        }

        // Don't compress images, videos, or already compressed files
        const contentType = res.get('Content-Type') || '';
        if (contentType.startsWith('image/') || 
            contentType.startsWith('video/') ||
            contentType.startsWith('audio/') ||
            req.path.match(/\.(jpg|jpeg|png|gif|webp|mp4|mp3|zip|gz|br)$/i)) {
          return false;
        }

        return true;
      },
      level: this.isProduction ? 6 : 4, // Higher compression in production
      threshold: 1024, // Only compress files larger than 1KB
      windowBits: 15,
      memLevel: 8
    });
  }

  /**
   * Static file caching headers
   */
  getStaticFileHeaders(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const now = new Date();
    
    // Different cache strategies for different file types
    const cacheConfigs = {
      // Long cache for versioned assets
      '.js': { maxAge: 31536000, immutable: true }, // 1 year
      '.css': { maxAge: 31536000, immutable: true },
      '.woff': { maxAge: 31536000, immutable: true },
      '.woff2': { maxAge: 31536000, immutable: true },
      
      // Medium cache for images
      '.jpg': { maxAge: 86400 * 30 }, // 30 days
      '.jpeg': { maxAge: 86400 * 30 },
      '.png': { maxAge: 86400 * 30 },
      '.webp': { maxAge: 86400 * 30 },
      '.gif': { maxAge: 86400 * 30 },
      '.svg': { maxAge: 86400 * 30 },
      '.ico': { maxAge: 86400 * 30 },
      
      // Short cache for dynamic content
      '.html': { maxAge: 3600 }, // 1 hour
      '.json': { maxAge: 3600 },
      '.xml': { maxAge: 3600 }
    };

    const config = cacheConfigs[ext] || { maxAge: 3600 };
    const expires = new Date(now.getTime() + config.maxAge * 1000);

    const headers = {
      'Cache-Control': `public, max-age=${config.maxAge}${config.immutable ? ', immutable' : ''}`,
      'Expires': expires.toUTCString(),
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    };

    // Add ETag for better caching
    if (!config.immutable) {
      headers['ETag'] = `"${this.generateFileHash(Buffer.from(filePath))}"`;
    }

    return headers;
  }

  /**
   * Preload critical resources
   */
  generatePreloadHeaders(resources) {
    const links = resources.map(resource => {
      const { href, as, type, crossorigin, media } = resource;
      let link = `<${href}>; rel=preload; as=${as}`;
      
      if (type) link += `; type=${type}`;
      if (crossorigin) link += `; crossorigin=${crossorigin}`;
      if (media) link += `; media=${media}`;
      
      return link;
    });

    return links.join(', ');
  }

  /**
   * Critical CSS inlining
   */
  async inlineCriticalCSS(htmlContent, criticalCSSPath) {
    try {
      const criticalCSS = await fs.readFile(criticalCSSPath, 'utf8');
      const inlinedCSS = `<style>${criticalCSS}</style>`;
      
      // Insert critical CSS before first external CSS
      return htmlContent.replace(
        /<link[^>]+rel=["']stylesheet["'][^>]*>/i,
        `${inlinedCSS}$&`
      );
    } catch (error) {
      console.error('Critical CSS inlining error:', error);
      return htmlContent;
    }
  }

  /**
   * Service Worker generation for caching strategy
   */
  generateServiceWorkerConfig() {
    return {
      // Cache strategies
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.jobifies\.com/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 3,
            cacheableResponse: {
              statuses: [0, 200]
            },
            broadcastUpdate: {
              channelName: 'api-updates'
            }
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 86400 * 30 // 30 days
            }
          }
        },
        {
          urlPattern: /\.(?:js|css)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources'
          }
        }
      ],

      // Precaching
      precacheAndRoute: [
        { url: '/', revision: null },
        { url: '/jobs', revision: null },
        { url: '/companies', revision: null }
      ],

      // Background sync
      backgroundSync: {
        name: 'jobifies-queue',
        options: {
          maxRetentionTime: 24 * 60 // 24 hours in minutes
        }
      }
    };
  }

  /**
   * Performance monitoring
   */
  getPerformanceMetrics() {
    return {
      // Web Vitals thresholds
      coreWebVitals: {
        LCP: 2.5, // Largest Contentful Paint (seconds)
        FID: 0.1, // First Input Delay (seconds)
        CLS: 0.1  // Cumulative Layout Shift
      },

      // Custom metrics
      customMetrics: {
        TTFB: 0.8, // Time to First Byte (seconds)
        FCP: 1.8,  // First Contentful Paint (seconds)
        TTI: 5.0   // Time to Interactive (seconds)
      }
    };
  }
}

module.exports = CDNOptimizer;