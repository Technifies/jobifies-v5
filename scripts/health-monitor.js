#!/usr/bin/env node

/**
 * Jobifies Production Health Monitor
 * Monitors the health of deployed backend and frontend services
 * Run this script to verify deployment status and performance
 */

const https = require('https');
const http = require('http');

// Configuration
const CONFIG = {
  backend: {
    url: 'https://jobifies-v5-backend.onrender.com',
    healthEndpoint: '/api/health',
    timeout: 10000
  },
  frontend: {
    url: 'https://jobifies-portal.netlify.app',
    timeout: 10000
  },
  checkInterval: 30000, // 30 seconds
  retries: 3
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class HealthMonitor {
  constructor() {
    this.results = {
      backend: { status: 'unknown', lastCheck: null, responseTime: null },
      frontend: { status: 'unknown', lastCheck: null, responseTime: null }
    };
  }

  log(level, message) {
    const timestamp = new Date().toISOString();
    const levelColors = {
      info: colors.blue,
      success: colors.green,
      warning: colors.yellow,
      error: colors.red
    };
    
    console.log(
      `${levelColors[level]}[${level.toUpperCase()}]${colors.reset} ` +
      `${colors.cyan}${timestamp}${colors.reset} ${message}`
    );
  }

  async makeRequest(url, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const req = client.request({
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        timeout: timeout,
        headers: {
          'User-Agent': 'Jobifies-Health-Monitor/1.0'
        }
      }, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          const responseTime = Date.now() - startTime;
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            responseTime: responseTime
          });
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.end();
    });
  }

  async checkBackendHealth() {
    const url = CONFIG.backend.url + CONFIG.backend.healthEndpoint;
    
    try {
      this.log('info', `Checking backend health: ${url}`);
      const response = await this.makeRequest(url, CONFIG.backend.timeout);
      
      if (response.statusCode === 200) {
        let healthData = {};
        try {
          healthData = JSON.parse(response.body);
        } catch (e) {
          // Ignore JSON parse errors
        }
        
        this.results.backend = {
          status: 'healthy',
          lastCheck: new Date().toISOString(),
          responseTime: response.responseTime,
          statusCode: response.statusCode,
          data: healthData
        };
        
        this.log('success', 
          `Backend is healthy (${response.responseTime}ms) - ${healthData.message || 'OK'}`
        );
        
        return true;
      } else {
        throw new Error(`HTTP ${response.statusCode}`);
      }
    } catch (error) {
      this.results.backend = {
        status: 'unhealthy',
        lastCheck: new Date().toISOString(),
        error: error.message,
        responseTime: null
      };
      
      this.log('error', `Backend health check failed: ${error.message}`);
      return false;
    }
  }

  async checkFrontendHealth() {
    const url = CONFIG.frontend.url;
    
    try {
      this.log('info', `Checking frontend health: ${url}`);
      const response = await this.makeRequest(url, CONFIG.frontend.timeout);
      
      if (response.statusCode === 200) {
        this.results.frontend = {
          status: 'healthy',
          lastCheck: new Date().toISOString(),
          responseTime: response.responseTime,
          statusCode: response.statusCode
        };
        
        this.log('success', 
          `Frontend is healthy (${response.responseTime}ms)`
        );
        
        return true;
      } else {
        throw new Error(`HTTP ${response.statusCode}`);
      }
    } catch (error) {
      this.results.frontend = {
        status: 'unhealthy',
        lastCheck: new Date().toISOString(),
        error: error.message,
        responseTime: null
      };
      
      this.log('error', `Frontend health check failed: ${error.message}`);
      return false;
    }
  }

  async checkDatabaseConnectivity() {
    const url = CONFIG.backend.url + '/api/health/database';
    
    try {
      this.log('info', `Checking database connectivity...`);
      const response = await this.makeRequest(url, CONFIG.backend.timeout);
      
      if (response.statusCode === 200) {
        const data = JSON.parse(response.body);
        this.log('success', `Database is connected - ${data.message || 'OK'}`);
        return true;
      } else {
        throw new Error(`HTTP ${response.statusCode}`);
      }
    } catch (error) {
      this.log('warning', `Database connectivity check failed: ${error.message}`);
      return false;
    }
  }

  async runFullHealthCheck() {
    this.log('info', '🔍 Starting comprehensive health check...');
    console.log('='.repeat(60));
    
    const results = await Promise.allSettled([
      this.checkBackendHealth(),
      this.checkFrontendHealth(),
      this.checkDatabaseConnectivity()
    ]);
    
    console.log('='.repeat(60));
    this.printHealthSummary();
    
    return results;
  }

  printHealthSummary() {
    console.log(`${colors.magenta}📊 Health Check Summary${colors.reset}`);
    console.log('-'.repeat(40));
    
    // Backend Status
    const backendStatus = this.results.backend.status === 'healthy' ? 
      `${colors.green}✅ HEALTHY${colors.reset}` : 
      `${colors.red}❌ UNHEALTHY${colors.reset}`;
    
    console.log(`Backend:   ${backendStatus}`);
    if (this.results.backend.responseTime) {
      console.log(`           Response Time: ${this.results.backend.responseTime}ms`);
    }
    if (this.results.backend.error) {
      console.log(`           Error: ${this.results.backend.error}`);
    }
    
    // Frontend Status
    const frontendStatus = this.results.frontend.status === 'healthy' ? 
      `${colors.green}✅ HEALTHY${colors.reset}` : 
      `${colors.red}❌ UNHEALTHY${colors.reset}`;
    
    console.log(`Frontend:  ${frontendStatus}`);
    if (this.results.frontend.responseTime) {
      console.log(`           Response Time: ${this.results.frontend.responseTime}ms`);
    }
    if (this.results.frontend.error) {
      console.log(`           Error: ${this.results.frontend.error}`);
    }
    
    console.log('-'.repeat(40));
  }

  async startMonitoring() {
    this.log('info', '🚀 Starting Jobifies Health Monitor...');
    this.log('info', `Monitoring interval: ${CONFIG.checkInterval / 1000}s`);
    
    // Run initial check
    await this.runFullHealthCheck();
    
    // Set up recurring checks
    setInterval(async () => {
      await this.runFullHealthCheck();
    }, CONFIG.checkInterval);
  }
}

// CLI Interface
async function main() {
  const monitor = new HealthMonitor();
  
  const args = process.argv.slice(2);
  const command = args[0] || 'check';
  
  switch (command) {
    case 'check':
    case 'health':
      await monitor.runFullHealthCheck();
      break;
      
    case 'monitor':
    case 'watch':
      await monitor.startMonitoring();
      break;
      
    case 'backend':
      await monitor.checkBackendHealth();
      break;
      
    case 'frontend':
      await monitor.checkFrontendHealth();
      break;
      
    case 'database':
    case 'db':
      await monitor.checkDatabaseConnectivity();
      break;
      
    default:
      console.log('Jobifies Health Monitor');
      console.log('Usage: node health-monitor.js [command]');
      console.log('');
      console.log('Commands:');
      console.log('  check     - Run single health check (default)');
      console.log('  monitor   - Start continuous monitoring');
      console.log('  backend   - Check backend only');
      console.log('  frontend  - Check frontend only');
      console.log('  database  - Check database only');
      break;
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down health monitor...');
  process.exit(0);
});

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Health monitor error:', error);
    process.exit(1);
  });
}

module.exports = HealthMonitor;