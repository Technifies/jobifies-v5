#!/usr/bin/env node

/**
 * Environment configuration generator for Jobifies
 * Generates secure environment configurations for different environments
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

class EnvGenerator {
  constructor() {
    this.environments = ['development', 'staging', 'production'];
    this.secrets = new Map();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Generate a secure random secret
   */
  generateSecret(length = 64) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate a JWT secret
   */
  generateJWTSecret() {
    return crypto.randomBytes(32).toString('base64');
  }

  /**
   * Prompt user for input
   */
  async prompt(question, defaultValue = '') {
    return new Promise((resolve) => {
      const displayDefault = defaultValue ? ` (${defaultValue})` : '';
      this.rl.question(`${question}${displayDefault}: `, (answer) => {
        resolve(answer.trim() || defaultValue);
      });
    });
  }

  /**
   * Generate environment configuration
   */
  async generateEnvironmentConfig(environment) {
    console.log(`\n🔧 Configuring ${environment} environment...\n`);

    const config = {
      NODE_ENV: environment,
      PORT: environment === 'development' ? '5000' : '${PORT}',
      API_VERSION: 'v1',
      APP_NAME: 'Jobifies',
      APP_VERSION: '1.0.0'
    };

    // Generate secrets
    config.JWT_SECRET = this.generateJWTSecret();
    config.JWT_EXPIRES_IN = '24h';
    config.JWT_REFRESH_EXPIRES_IN = '7d';
    config.SESSION_SECRET = this.generateSecret(32);
    config.SESSION_MAX_AGE = '86400000';

    // Environment-specific configurations
    if (environment === 'development') {
      config.DATABASE_URL = 'postgresql://jobifies:jobifies123@localhost:5432/jobifies_dev';
      config.REDIS_URL = 'redis://localhost:6379';
      config.CORS_ORIGIN = 'http://localhost:3000';
      config.SESSION_SECURE = 'false';
      config.LOG_LEVEL = 'debug';
      config.ENABLE_API_DOCS = 'true';
      config.MOCK_EMAIL_SERVICE = 'true';
    } else if (environment === 'staging') {
      config.DATABASE_URL = await this.prompt('Staging Database URL');
      config.REDIS_URL = await this.prompt('Staging Redis URL');
      config.CORS_ORIGIN = await this.prompt('Staging Frontend URL', 'https://staging.jobifies.com');
      config.SESSION_SECURE = 'true';
      config.LOG_LEVEL = 'info';
      config.ENABLE_API_DOCS = 'false';
      config.MOCK_EMAIL_SERVICE = 'false';
    } else if (environment === 'production') {
      config.DATABASE_URL = '${DATABASE_URL}';
      config.REDIS_URL = '${REDIS_URL}';
      config.CORS_ORIGIN = await this.prompt('Production Frontend URL', 'https://jobifies.com');
      config.SESSION_SECURE = 'true';
      config.LOG_LEVEL = 'warn';
      config.ENABLE_API_DOCS = 'false';
      config.MOCK_EMAIL_SERVICE = 'false';
      config.HELMET_ENABLED = 'true';
      config.TRUST_PROXY = 'true';
      config.ENABLE_HTTPS_REDIRECT = 'true';
    }

    // Common configurations
    config.DB_POOL_MIN = environment === 'development' ? '2' : '5';
    config.DB_POOL_MAX = environment === 'development' ? '10' : '20';
    config.DB_IDLE_TIMEOUT_MS = '30000';
    config.DB_CONNECTION_TIMEOUT_MS = '5000';

    config.REDIS_POOL_MIN = environment === 'development' ? '2' : '5';
    config.REDIS_POOL_MAX = environment === 'development' ? '10' : '20';
    config.REDIS_TTL = '3600';

    config.BCRYPT_ROUNDS = environment === 'development' ? '10' : '12';
    config.CORS_CREDENTIALS = 'true';

    config.RATE_LIMIT_WINDOW_MS = '900000'; // 15 minutes
    config.RATE_LIMIT_MAX_REQUESTS = environment === 'development' ? '10000' : '1000';
    config.LOGIN_RATE_LIMIT_WINDOW_MS = '900000';
    config.LOGIN_RATE_LIMIT_MAX_ATTEMPTS = '5';

    config.MAX_FILE_SIZE = '5242880'; // 5MB
    config.ALLOWED_FILE_TYPES = 'image/jpeg,image/png,image/webp,application/pdf';
    config.UPLOAD_PATH = './uploads';

    // Optional configurations that need user input
    const needsUserInput = [
      { key: 'SMTP_HOST', question: 'SMTP Host (e.g., smtp.gmail.com)', default: 'smtp.gmail.com' },
      { key: 'SMTP_PORT', question: 'SMTP Port', default: '587' },
      { key: 'SMTP_USER', question: 'SMTP Username/Email' },
      { key: 'SMTP_PASS', question: 'SMTP Password/App Password' },
      { key: 'FROM_EMAIL', question: 'From Email Address', default: 'noreply@jobifies.com' },
      { key: 'ADMIN_EMAIL', question: 'Admin Email Address' }
    ];

    console.log('\n📧 Email Configuration:');
    for (const { key, question, default: defaultVal } of needsUserInput) {
      config[key] = await this.prompt(question, defaultVal);
    }

    // Security configurations
    config.HSTS_MAX_AGE = '31536000';
    config.HSTS_INCLUDE_SUBDOMAINS = 'true';
    config.HSTS_PRELOAD = 'true';
    config.CSP_REPORT_ONLY = environment === 'development' ? 'true' : 'false';

    // Feature flags
    config.ENABLE_REGISTRATION = 'true';
    config.ENABLE_EMAIL_VERIFICATION = 'true';
    config.ENABLE_PASSWORD_RESET = 'true';
    config.ENABLE_SOCIAL_LOGIN = 'true';
    config.ENABLE_PREMIUM_FEATURES = 'true';

    return config;
  }

  /**
   * Write environment file
   */
  writeEnvFile(environment, config) {
    const filename = `.env.${environment}`;
    const filepath = path.join(process.cwd(), filename);

    let content = `# ==========================================\n`;
    content += `# JOBIFIES ${environment.toUpperCase()} ENVIRONMENT\n`;
    content += `# Generated on: ${new Date().toISOString()}\n`;
    content += `# ==========================================\n\n`;

    // Group configurations
    const groups = {
      'ENVIRONMENT': ['NODE_ENV', 'PORT', 'API_VERSION', 'APP_NAME', 'APP_VERSION'],
      'DATABASE': ['DATABASE_URL', 'DB_POOL_MIN', 'DB_POOL_MAX', 'DB_IDLE_TIMEOUT_MS', 'DB_CONNECTION_TIMEOUT_MS'],
      'REDIS': ['REDIS_URL', 'REDIS_POOL_MIN', 'REDIS_POOL_MAX', 'REDIS_TTL'],
      'SECURITY': ['JWT_SECRET', 'JWT_EXPIRES_IN', 'JWT_REFRESH_EXPIRES_IN', 'SESSION_SECRET', 'SESSION_MAX_AGE', 'SESSION_SECURE', 'BCRYPT_ROUNDS'],
      'CORS': ['CORS_ORIGIN', 'CORS_CREDENTIALS'],
      'RATE_LIMITING': ['RATE_LIMIT_WINDOW_MS', 'RATE_LIMIT_MAX_REQUESTS', 'LOGIN_RATE_LIMIT_WINDOW_MS', 'LOGIN_RATE_LIMIT_MAX_ATTEMPTS'],
      'FILE_UPLOAD': ['MAX_FILE_SIZE', 'ALLOWED_FILE_TYPES', 'UPLOAD_PATH'],
      'EMAIL': ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'FROM_EMAIL', 'ADMIN_EMAIL'],
      'SECURITY_HEADERS': ['HELMET_ENABLED', 'TRUST_PROXY', 'HSTS_MAX_AGE', 'HSTS_INCLUDE_SUBDOMAINS', 'HSTS_PRELOAD', 'CSP_REPORT_ONLY'],
      'FEATURES': ['ENABLE_REGISTRATION', 'ENABLE_EMAIL_VERIFICATION', 'ENABLE_PASSWORD_RESET', 'ENABLE_SOCIAL_LOGIN', 'ENABLE_PREMIUM_FEATURES'],
      'DEVELOPMENT': ['LOG_LEVEL', 'ENABLE_API_DOCS', 'MOCK_EMAIL_SERVICE', 'ENABLE_HTTPS_REDIRECT']
    };

    Object.entries(groups).forEach(([groupName, keys]) => {
      const groupConfig = keys
        .filter(key => config.hasOwnProperty(key))
        .map(key => config[key] ? `${key}=${config[key]}` : `# ${key}=`)
        .join('\n');

      if (groupConfig) {
        content += `# ${groupName}\n${groupConfig}\n\n`;
      }
    });

    // Add remaining configurations
    Object.entries(config).forEach(([key, value]) => {
      const isInGroups = Object.values(groups).flat().includes(key);
      if (!isInGroups) {
        content += `${key}=${value}\n`;
      }
    });

    fs.writeFileSync(filepath, content);
    console.log(`✅ Environment file created: ${filename}`);

    // Create secure backup
    if (environment === 'production') {
      const backupPath = path.join(process.cwd(), 'config', 'secrets');
      if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath, { recursive: true });
      }
      
      const backupFile = path.join(backupPath, `${environment}-secrets-${Date.now()}.backup`);
      fs.writeFileSync(backupFile, content);
      console.log(`🔐 Secure backup created: ${backupFile}`);
    }
  }

  /**
   * Generate secrets summary
   */
  generateSecretsFile(configs) {
    const secretsPath = path.join(process.cwd(), 'config', 'secrets.md');
    if (!fs.existsSync(path.dirname(secretsPath))) {
      fs.mkdirSync(path.dirname(secretsPath), { recursive: true });
    }

    let content = `# Jobifies Secrets Management\n\n`;
    content += `Generated on: ${new Date().toISOString()}\n\n`;
    content += `## Important Security Notes\n\n`;
    content += `- 🔒 Never commit these secrets to version control\n`;
    content += `- 🔐 Store production secrets in a secure password manager\n`;
    content += `- 🔄 Rotate secrets regularly (at least quarterly)\n`;
    content += `- 📝 Update secrets in deployment environment variables\n\n`;

    Object.entries(configs).forEach(([env, config]) => {
      content += `## ${env.toUpperCase()} Environment Secrets\n\n`;
      content += `### Critical Secrets:\n`;
      content += `- JWT_SECRET: \`${config.JWT_SECRET}\`\n`;
      content += `- SESSION_SECRET: \`${config.SESSION_SECRET}\`\n\n`;
    });

    content += `## Deployment Instructions\n\n`;
    content += `### Render.com:\n`;
    content += `1. Go to your service dashboard\n`;
    content += `2. Navigate to Environment tab\n`;
    content += `3. Add each environment variable\n`;
    content += `4. Redeploy the service\n\n`;

    content += `### Netlify:\n`;
    content += `1. Go to Site settings > Environment variables\n`;
    content += `2. Add NEXT_PUBLIC_* variables only\n`;
    content += `3. Trigger a new deploy\n\n`;

    fs.writeFileSync(secretsPath, content);
    console.log(`📋 Secrets documentation created: config/secrets.md`);
  }

  /**
   * Main execution
   */
  async run() {
    console.log('🚀 Jobifies Environment Configuration Generator\n');

    const configs = {};

    try {
      // Get user preferences
      const selectedEnvs = await this.prompt(
        'Which environments to configure? (development,staging,production)', 
        'development,staging,production'
      );

      const environments = selectedEnvs.split(',').map(env => env.trim());

      for (const env of environments) {
        if (this.environments.includes(env)) {
          configs[env] = await this.generateEnvironmentConfig(env);
          this.writeEnvFile(env, configs[env]);
        }
      }

      this.generateSecretsFile(configs);

      console.log('\n✅ Environment configuration completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Review the generated .env files');
      console.log('2. Update deployment environment variables');
      console.log('3. Test each environment configuration');
      console.log('4. Store production secrets securely');
      console.log('\n⚠️  Remember: Never commit .env files to version control!');

    } catch (error) {
      console.error('❌ Error generating environment configuration:', error);
    } finally {
      this.rl.close();
    }
  }
}

// Run if called directly
if (require.main === module) {
  const generator = new EnvGenerator();
  generator.run();
}

module.exports = EnvGenerator;