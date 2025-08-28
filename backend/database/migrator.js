/**
 * Advanced database migration system for Jobifies
 * Handles schema migrations, data migrations, and rollbacks
 */

const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');
const crypto = require('crypto');

class DatabaseMigrator {
  constructor(config = {}) {
    this.config = {
      connectionString: config.connectionString || process.env.DATABASE_URL,
      migrationsPath: config.migrationsPath || path.join(__dirname, 'migrations'),
      seedsPath: config.seedsPath || path.join(__dirname, 'seeds'),
      tableName: config.tableName || 'schema_migrations',
      lockTimeout: config.lockTimeout || 30000, // 30 seconds
      ...config
    };
    
    this.pool = new Pool({
      connectionString: this.config.connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }

  /**
   * Initialize migrations table
   */
  async initializeMigrationsTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS ${this.config.tableName} (
        id SERIAL PRIMARY KEY,
        version VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        checksum VARCHAR(64) NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        execution_time INTEGER NOT NULL,
        success BOOLEAN NOT NULL DEFAULT true,
        error_message TEXT,
        rollback_sql TEXT
      );
      
      CREATE INDEX IF NOT EXISTS idx_schema_migrations_version 
      ON ${this.config.tableName} (version);
      
      CREATE INDEX IF NOT EXISTS idx_schema_migrations_executed_at 
      ON ${this.config.tableName} (executed_at);
    `;
    
    await this.pool.query(query);
  }

  /**
   * Get migration lock
   */
  async acquireLock(lockName = 'migration_lock') {
    const lockId = crypto.createHash('crc32').update(lockName).digest('hex');
    const query = 'SELECT pg_try_advisory_lock($1) as acquired';
    
    const result = await this.pool.query(query, [parseInt(lockId, 16)]);
    
    if (!result.rows[0].acquired) {
      throw new Error('Could not acquire migration lock. Another migration may be running.');
    }
    
    // Set timeout to release lock automatically
    setTimeout(async () => {
      await this.releaseLock(lockName);
    }, this.config.lockTimeout);
    
    return lockId;
  }

  /**
   * Release migration lock
   */
  async releaseLock(lockName = 'migration_lock') {
    const lockId = crypto.createHash('crc32').update(lockName).digest('hex');
    const query = 'SELECT pg_advisory_unlock($1) as released';
    
    await this.pool.query(query, [parseInt(lockId, 16)]);
  }

  /**
   * Calculate file checksum
   */
  calculateChecksum(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Parse migration file
   */
  async parseMigrationFile(filePath) {
    const content = await fs.readFile(filePath, 'utf8');
    const filename = path.basename(filePath);
    
    // Extract version and name from filename (e.g., 001_initial_schema.sql)
    const match = filename.match(/^(\d+)_(.+)\.sql$/);
    if (!match) {
      throw new Error(`Invalid migration filename format: ${filename}`);
    }
    
    const [, version, name] = match;
    
    // Split migration and rollback sections
    const sections = content.split(/-- ?\+\+\+\+\+ ?ROLLBACK ?START ?\+\+\+\+\+/i);
    const upSql = sections[0].trim();
    const downSql = sections[1] ? sections[1].replace(/-- ?\+\+\+\+\+ ?ROLLBACK ?END ?\+\+\+\+\+/i, '').trim() : null;
    
    return {
      version,
      name: name.replace(/_/g, ' '),
      filename,
      upSql,
      downSql,
      checksum: this.calculateChecksum(content),
      filePath
    };
  }

  /**
   * Get all migration files
   */
  async getMigrationFiles() {
    try {
      const files = await fs.readdir(this.config.migrationsPath);
      const migrationFiles = files
        .filter(file => file.endsWith('.sql'))
        .sort(); // Sort by filename (which includes version number)
      
      const migrations = [];
      for (const file of migrationFiles) {
        const filePath = path.join(this.config.migrationsPath, file);
        const migration = await this.parseMigrationFile(filePath);
        migrations.push(migration);
      }
      
      return migrations;
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('Migrations directory not found, creating it...');
        await fs.mkdir(this.config.migrationsPath, { recursive: true });
        return [];
      }
      throw error;
    }
  }

  /**
   * Get executed migrations from database
   */
  async getExecutedMigrations() {
    const query = `
      SELECT version, name, checksum, executed_at, success, error_message
      FROM ${this.config.tableName}
      ORDER BY version ASC
    `;
    
    const result = await this.pool.query(query);
    return result.rows;
  }

  /**
   * Execute a single migration
   */
  async executeMigration(migration, direction = 'up') {
    const startTime = Date.now();
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const sql = direction === 'up' ? migration.upSql : migration.downSql;
      if (!sql) {
        throw new Error(`No ${direction} SQL found for migration ${migration.version}`);
      }
      
      console.log(`${direction === 'up' ? 'Applying' : 'Rolling back'} migration: ${migration.version} - ${migration.name}`);
      
      // Execute the migration SQL
      await client.query(sql);
      
      const executionTime = Date.now() - startTime;
      
      if (direction === 'up') {
        // Record successful migration
        await client.query(`
          INSERT INTO ${this.config.tableName} 
          (version, name, checksum, execution_time, success, rollback_sql) 
          VALUES ($1, $2, $3, $4, true, $5)
          ON CONFLICT (version) DO UPDATE SET
            checksum = EXCLUDED.checksum,
            execution_time = EXCLUDED.execution_time,
            executed_at = NOW(),
            success = true,
            error_message = NULL
        `, [migration.version, migration.name, migration.checksum, executionTime, migration.downSql]);
      } else {
        // Remove migration record on rollback
        await client.query(`
          DELETE FROM ${this.config.tableName} 
          WHERE version = $1
        `, [migration.version]);
      }
      
      await client.query('COMMIT');
      console.log(`✅ Migration ${migration.version} ${direction === 'up' ? 'applied' : 'rolled back'} successfully (${executionTime}ms)`);
      
    } catch (error) {
      await client.query('ROLLBACK');
      
      // Record failed migration
      if (direction === 'up') {
        try {
          await client.query(`
            INSERT INTO ${this.config.tableName} 
            (version, name, checksum, execution_time, success, error_message) 
            VALUES ($1, $2, $3, $4, false, $5)
            ON CONFLICT (version) DO UPDATE SET
              execution_time = EXCLUDED.execution_time,
              executed_at = NOW(),
              success = false,
              error_message = EXCLUDED.error_message
          `, [migration.version, migration.name, migration.checksum, Date.now() - startTime, error.message]);
        } catch (recordError) {
          console.error('Failed to record migration error:', recordError);
        }
      }
      
      console.error(`❌ Migration ${migration.version} failed:`, error.message);
      throw error;
      
    } finally {
      client.release();
    }
  }

  /**
   * Run pending migrations
   */
  async migrate() {
    const lockId = await this.acquireLock();
    
    try {
      await this.initializeMigrationsTable();
      
      const allMigrations = await this.getMigrationFiles();
      const executedMigrations = await getExecutedMigrations();
      const executedVersions = new Set(executedMigrations.map(m => m.version));
      
      const pendingMigrations = allMigrations.filter(m => !executedVersions.has(m.version));
      
      if (pendingMigrations.length === 0) {
        console.log('✅ No pending migrations to run');
        return;
      }
      
      console.log(`🚀 Running ${pendingMigrations.length} pending migrations...`);
      
      for (const migration of pendingMigrations) {
        // Check for checksum changes in already executed migrations
        const executed = executedMigrations.find(m => m.version === migration.version);
        if (executed && executed.checksum !== migration.checksum) {
          console.warn(`⚠️  Warning: Checksum mismatch for migration ${migration.version}. Migration file may have been modified after execution.`);
        }
        
        await this.executeMigration(migration, 'up');
      }
      
      console.log('✅ All migrations completed successfully');
      
    } finally {
      await this.releaseLock();
    }
  }

  /**
   * Rollback migrations
   */
  async rollback(steps = 1) {
    const lockId = await this.acquireLock();
    
    try {
      const executedMigrations = await this.getExecutedMigrations();
      const migrationsToRollback = executedMigrations
        .filter(m => m.success)
        .slice(-steps)
        .reverse(); // Rollback in reverse order
      
      if (migrationsToRollback.length === 0) {
        console.log('✅ No migrations to rollback');
        return;
      }
      
      console.log(`🔄 Rolling back ${migrationsToRollback.length} migrations...`);
      
      const allMigrations = await this.getMigrationFiles();
      const migrationMap = new Map(allMigrations.map(m => [m.version, m]));
      
      for (const executed of migrationsToRollback) {
        const migration = migrationMap.get(executed.version);
        if (!migration) {
          console.warn(`⚠️  Warning: Migration file not found for version ${executed.version}, skipping rollback`);
          continue;
        }
        
        await this.executeMigration(migration, 'down');
      }
      
      console.log('✅ Rollback completed successfully');
      
    } finally {
      await this.releaseLock();
    }
  }

  /**
   * Get migration status
   */
  async status() {
    await this.initializeMigrationsTable();
    
    const allMigrations = await this.getMigrationFiles();
    const executedMigrations = await this.getExecutedMigrations();
    const executedMap = new Map(executedMigrations.map(m => [m.version, m]));
    
    console.log('\n📊 Migration Status:\n');
    console.log('Version'.padEnd(10) + 'Name'.padEnd(30) + 'Status'.padEnd(15) + 'Executed At');
    console.log('-'.repeat(80));
    
    for (const migration of allMigrations) {
      const executed = executedMap.get(migration.version);
      const status = executed 
        ? (executed.success ? '✅ Applied' : '❌ Failed')
        : '⏳ Pending';
      const executedAt = executed ? executed.executed_at.toISOString() : '-';
      
      console.log(
        migration.version.padEnd(10) +
        migration.name.padEnd(30) +
        status.padEnd(15) +
        executedAt
      );
    }
    
    const pendingCount = allMigrations.filter(m => !executedMap.has(m.version)).length;
    const appliedCount = executedMigrations.filter(m => m.success).length;
    const failedCount = executedMigrations.filter(m => !m.success).length;
    
    console.log('\n📈 Summary:');
    console.log(`- Total migrations: ${allMigrations.length}`);
    console.log(`- Applied: ${appliedCount}`);
    console.log(`- Pending: ${pendingCount}`);
    console.log(`- Failed: ${failedCount}`);
  }

  /**
   * Create a new migration file
   */
  async createMigration(name, type = 'schema') {
    const migrations = await this.getMigrationFiles();
    const lastVersion = migrations.length > 0 
      ? Math.max(...migrations.map(m => parseInt(m.version)))
      : 0;
    
    const newVersion = String(lastVersion + 1).padStart(3, '0');
    const filename = `${newVersion}_${name.toLowerCase().replace(/\s+/g, '_')}.sql`;
    const filePath = path.join(this.config.migrationsPath, filename);
    
    const template = type === 'data' ? this.getDataMigrationTemplate(name) : this.getSchemaMigrationTemplate(name);
    
    await fs.writeFile(filePath, template);
    console.log(`✅ Created migration file: ${filename}`);
    return filePath;
  }

  /**
   * Get schema migration template
   */
  getSchemaMigrationTemplate(name) {
    return `-- Migration: ${name}
-- Created: ${new Date().toISOString()}
-- Type: Schema Migration

-- ++++++++++++++++++++++++++++++++++++++++++++++
-- UP MIGRATION
-- ++++++++++++++++++++++++++++++++++++++++++++++

-- Add your schema changes here
-- Example:
-- CREATE TABLE example_table (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- CREATE INDEX idx_example_table_name ON example_table(name);

-- +++++ ROLLBACK START +++++
-- ++++++++++++++++++++++++++++++++++++++++++++++
-- DOWN MIGRATION (ROLLBACK)
-- ++++++++++++++++++++++++++++++++++++++++++++++

-- Add rollback statements here (reverse of UP migration)
-- Example:
-- DROP TABLE IF EXISTS example_table;

-- +++++ ROLLBACK END +++++
`;
  }

  /**
   * Get data migration template
   */
  getDataMigrationTemplate(name) {
    return `-- Data Migration: ${name}
-- Created: ${new Date().toISOString()}
-- Type: Data Migration

-- ++++++++++++++++++++++++++++++++++++++++++++++
-- UP MIGRATION
-- ++++++++++++++++++++++++++++++++++++++++++++++

-- Add your data changes here
-- Example:
-- INSERT INTO users (email, role, created_at) VALUES
--   ('admin@jobifies.com', 'admin', NOW()),
--   ('support@jobifies.com', 'support', NOW());

-- UPDATE settings SET value = 'new_value' WHERE key = 'setting_key';

-- +++++ ROLLBACK START +++++
-- ++++++++++++++++++++++++++++++++++++++++++++++
-- DOWN MIGRATION (ROLLBACK)
-- ++++++++++++++++++++++++++++++++++++++++++++++

-- Add rollback statements here
-- Example:
-- DELETE FROM users WHERE email IN ('admin@jobifies.com', 'support@jobifies.com');
-- UPDATE settings SET value = 'old_value' WHERE key = 'setting_key';

-- +++++ ROLLBACK END +++++
`;
  }

  /**
   * Seed database with initial data
   */
  async seed() {
    try {
      const seedFiles = await fs.readdir(this.config.seedsPath);
      const sqlFiles = seedFiles
        .filter(file => file.endsWith('.sql'))
        .sort();
      
      console.log(`🌱 Running ${sqlFiles.length} seed files...`);
      
      for (const file of sqlFiles) {
        const filePath = path.join(this.config.seedsPath, file);
        const content = await fs.readFile(filePath, 'utf8');
        
        console.log(`Executing seed: ${file}`);
        await this.pool.query(content);
        console.log(`✅ Seed ${file} completed`);
      }
      
      console.log('✅ Database seeding completed successfully');
      
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('Seeds directory not found, skipping seeding');
        return;
      }
      throw error;
    }
  }

  /**
   * Close database connection
   */
  async close() {
    await this.pool.end();
  }
}

module.exports = DatabaseMigrator;