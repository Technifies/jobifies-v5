import fs from 'fs/promises';
import path from 'path';
import { query, transaction } from '../config/database';
import logger from '../utils/logger';

export interface Migration {
  id: number;
  name: string;
  filename: string;
  executed_at?: Date;
}

export class MigrationRunner {
  private migrationsPath: string;

  constructor(migrationsPath?: string) {
    this.migrationsPath = migrationsPath || path.join(__dirname, 'migrations');
  }

  // Create migrations table if it doesn't exist
  private async createMigrationsTable(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        filename VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await query(createTableQuery);
    logger.info('Migrations table created or verified');
  }

  // Get executed migrations from database
  private async getExecutedMigrations(): Promise<Migration[]> {
    const result = await query('SELECT * FROM migrations ORDER BY id ASC');
    return result.rows;
  }

  // Get all migration files from directory
  private async getMigrationFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.migrationsPath);
      return files
        .filter(file => file.endsWith('.sql'))
        .sort(); // Sort to ensure correct execution order
    } catch (error) {
      logger.error('Error reading migrations directory:', error);
      throw error;
    }
  }

  // Parse migration filename to extract name and ID
  private parseMigrationFilename(filename: string): { id: number; name: string } {
    // Expected format: 001_create_users_table.sql
    const match = filename.match(/^(\d+)_(.+)\.sql$/);
    if (!match) {
      throw new Error(`Invalid migration filename format: ${filename}`);
    }

    return {
      id: parseInt(match[1], 10),
      name: match[2].replace(/_/g, ' '),
    };
  }

  // Read migration file content
  private async readMigrationFile(filename: string): Promise<string> {
    const filePath = path.join(this.migrationsPath, filename);
    return fs.readFile(filePath, 'utf-8');
  }

  // Execute a single migration
  private async executeMigration(filename: string, content: string): Promise<void> {
    const { id, name } = this.parseMigrationFilename(filename);

    await transaction(async (client) => {
      // Execute the migration SQL
      await client.query(content);

      // Record the migration as executed
      await client.query(
        'INSERT INTO migrations (id, name, filename, executed_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)',
        [id, name, filename]
      );

      logger.info(`Migration executed: ${filename}`);
    });
  }

  // Run all pending migrations
  async runMigrations(): Promise<void> {
    try {
      // Create migrations table
      await this.createMigrationsTable();

      // Get executed migrations and available files
      const [executedMigrations, migrationFiles] = await Promise.all([
        this.getExecutedMigrations(),
        this.getMigrationFiles(),
      ]);

      // Find pending migrations
      const executedFilenames = new Set(executedMigrations.map(m => m.filename));
      const pendingMigrations = migrationFiles.filter(
        filename => !executedFilenames.has(filename)
      );

      if (pendingMigrations.length === 0) {
        logger.info('No pending migrations to run');
        return;
      }

      logger.info(`Found ${pendingMigrations.length} pending migrations`);

      // Execute pending migrations in order
      for (const filename of pendingMigrations) {
        try {
          const content = await this.readMigrationFile(filename);
          await this.executeMigration(filename, content);
        } catch (error) {
          logger.error(`Failed to execute migration ${filename}:`, error);
          throw error;
        }
      }

      logger.info(`Successfully executed ${pendingMigrations.length} migrations`);
    } catch (error) {
      logger.error('Migration failed:', error);
      throw error;
    }
  }

  // Get migration status
  async getMigrationStatus(): Promise<{
    executed: Migration[];
    pending: string[];
    total: number;
  }> {
    await this.createMigrationsTable();

    const [executedMigrations, migrationFiles] = await Promise.all([
      this.getExecutedMigrations(),
      this.getMigrationFiles(),
    ]);

    const executedFilenames = new Set(executedMigrations.map(m => m.filename));
    const pendingMigrations = migrationFiles.filter(
      filename => !executedFilenames.has(filename)
    );

    return {
      executed: executedMigrations,
      pending: pendingMigrations,
      total: migrationFiles.length,
    };
  }

  // Create a new migration file
  async createMigration(name: string, content?: string): Promise<string> {
    try {
      const migrationFiles = await this.getMigrationFiles();
      
      // Get next migration number
      let nextId = 1;
      if (migrationFiles.length > 0) {
        const lastFile = migrationFiles[migrationFiles.length - 1];
        const { id } = this.parseMigrationFilename(lastFile);
        nextId = id + 1;
      }

      // Format filename
      const paddedId = nextId.toString().padStart(3, '0');
      const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      const filename = `${paddedId}_${sanitizedName}.sql`;
      const filePath = path.join(this.migrationsPath, filename);

      // Default migration content
      const defaultContent = content || `-- Migration: ${name}
-- Created: ${new Date().toISOString()}

-- Add your SQL statements here
-- Example:
-- CREATE TABLE example_table (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   name VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
`;

      await fs.writeFile(filePath, defaultContent);
      logger.info(`Created migration file: ${filename}`);
      
      return filename;
    } catch (error) {
      logger.error('Failed to create migration:', error);
      throw error;
    }
  }

  // Rollback last migration (dangerous operation)
  async rollbackLastMigration(): Promise<void> {
    try {
      const executedMigrations = await this.getExecutedMigrations();
      
      if (executedMigrations.length === 0) {
        logger.info('No migrations to rollback');
        return;
      }

      const lastMigration = executedMigrations[executedMigrations.length - 1];
      
      // Check if rollback file exists
      const rollbackFilename = lastMigration.filename.replace('.sql', '_rollback.sql');
      const rollbackPath = path.join(this.migrationsPath, rollbackFilename);

      try {
        const rollbackContent = await fs.readFile(rollbackPath, 'utf-8');
        
        await transaction(async (client) => {
          // Execute rollback SQL
          await client.query(rollbackContent);
          
          // Remove migration record
          await client.query('DELETE FROM migrations WHERE id = $1', [lastMigration.id]);
        });

        logger.info(`Rolled back migration: ${lastMigration.filename}`);
      } catch (error) {
        logger.error(`Rollback file not found: ${rollbackFilename}`);
        throw new Error('Cannot rollback without rollback script');
      }
    } catch (error) {
      logger.error('Rollback failed:', error);
      throw error;
    }
  }
}

// CLI interface
if (require.main === module) {
  const runner = new MigrationRunner();
  const command = process.argv[2];

  async function runCLI() {
    try {
      switch (command) {
        case 'run':
        case 'migrate':
          await runner.runMigrations();
          break;
          
        case 'status':
          const status = await runner.getMigrationStatus();
          console.log('Migration Status:');
          console.log(`Total migrations: ${status.total}`);
          console.log(`Executed: ${status.executed.length}`);
          console.log(`Pending: ${status.pending.length}`);
          if (status.pending.length > 0) {
            console.log('Pending migrations:', status.pending.join(', '));
          }
          break;
          
        case 'create':
          const migrationName = process.argv[3];
          if (!migrationName) {
            throw new Error('Migration name is required');
          }
          await runner.createMigration(migrationName);
          break;
          
        case 'rollback':
          await runner.rollbackLastMigration();
          break;
          
        default:
          console.log('Usage:');
          console.log('  npm run migrate run     - Run all pending migrations');
          console.log('  npm run migrate status  - Show migration status');
          console.log('  npm run migrate create <name> - Create new migration');
          console.log('  npm run migrate rollback - Rollback last migration');
      }
      
      process.exit(0);
    } catch (error) {
      console.error('Migration command failed:', error);
      process.exit(1);
    }
  }

  runCLI();
}

export default MigrationRunner;