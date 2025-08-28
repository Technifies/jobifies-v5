#!/usr/bin/env node

/**
 * Database CLI tool for Jobifies
 * Provides command-line interface for database operations
 */

const { program } = require('commander');
const DatabaseMigrator = require('./migrator');
const path = require('path');

// Create migrator instance
const migrator = new DatabaseMigrator({
  connectionString: process.env.DATABASE_URL,
  migrationsPath: path.join(__dirname, 'migrations'),
  seedsPath: path.join(__dirname, 'seeds')
});

// Configure CLI
program
  .name('db')
  .description('Jobifies Database Management CLI')
  .version('1.0.0');

// Migration commands
program
  .command('migrate')
  .description('Run pending database migrations')
  .action(async () => {
    try {
      await migrator.migrate();
      process.exit(0);
    } catch (error) {
      console.error('Migration failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('rollback')
  .description('Rollback database migrations')
  .option('-s, --steps <steps>', 'Number of migrations to rollback', '1')
  .action(async (options) => {
    try {
      const steps = parseInt(options.steps);
      await migrator.rollback(steps);
      process.exit(0);
    } catch (error) {
      console.error('Rollback failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Show migration status')
  .action(async () => {
    try {
      await migrator.status();
      process.exit(0);
    } catch (error) {
      console.error('Status check failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('create')
  .description('Create a new migration file')
  .argument('<name>', 'Migration name')
  .option('-t, --type <type>', 'Migration type (schema|data)', 'schema')
  .action(async (name, options) => {
    try {
      await migrator.createMigration(name, options.type);
      process.exit(0);
    } catch (error) {
      console.error('Migration creation failed:', error.message);
      process.exit(1);
    }
  });

// Seed commands
program
  .command('seed')
  .description('Run database seeds')
  .action(async () => {
    try {
      await migrator.seed();
      process.exit(0);
    } catch (error) {
      console.error('Seeding failed:', error.message);
      process.exit(1);
    }
  });

// Database utility commands
program
  .command('reset')
  .description('Reset database (rollback all migrations and re-migrate)')
  .option('--force', 'Force reset without confirmation')
  .action(async (options) => {
    try {
      if (!options.force) {
        const readline = require('readline');
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        const answer = await new Promise(resolve => {
          rl.question('⚠️  This will rollback ALL migrations and re-run them. Continue? (y/N): ', resolve);
        });

        rl.close();

        if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
          console.log('Reset cancelled');
          process.exit(0);
        }
      }

      console.log('🔄 Resetting database...');
      
      // Get current migration count
      const executedMigrations = await migrator.getExecutedMigrations();
      const migrationCount = executedMigrations.filter(m => m.success).length;
      
      if (migrationCount > 0) {
        console.log(`Rolling back ${migrationCount} migrations...`);
        await migrator.rollback(migrationCount);
      }
      
      console.log('Re-running all migrations...');
      await migrator.migrate();
      
      console.log('✅ Database reset completed');
      process.exit(0);
    } catch (error) {
      console.error('Reset failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('setup')
  .description('Setup database for first time (migrate + seed)')
  .action(async () => {
    try {
      console.log('🚀 Setting up database for first time...');
      
      await migrator.migrate();
      await migrator.seed();
      
      console.log('✅ Database setup completed successfully');
      process.exit(0);
    } catch (error) {
      console.error('Setup failed:', error.message);
      process.exit(1);
    }
  });

// Connection test
program
  .command('test')
  .description('Test database connection')
  .action(async () => {
    try {
      const { Pool } = require('pg');
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });

      const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
      console.log('✅ Database connection successful');
      console.log('Current time:', result.rows[0].current_time);
      console.log('PostgreSQL version:', result.rows[0].pg_version);
      
      await pool.end();
      process.exit(0);
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      process.exit(1);
    }
  });

// Backup and restore commands
program
  .command('backup')
  .description('Create database backup')
  .option('-f, --file <file>', 'Backup file path', `backup-${Date.now()}.sql`)
  .action(async (options) => {
    try {
      const { spawn } = require('child_process');
      const fs = require('fs');
      
      console.log(`📦 Creating backup: ${options.file}`);
      
      const backupProcess = spawn('pg_dump', [process.env.DATABASE_URL], {
        stdio: ['ignore', 'pipe', 'inherit']
      });

      const writeStream = fs.createWriteStream(options.file);
      backupProcess.stdout.pipe(writeStream);

      backupProcess.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ Backup created successfully: ${options.file}`);
          process.exit(0);
        } else {
          console.error('❌ Backup failed');
          process.exit(1);
        }
      });

      backupProcess.on('error', (error) => {
        console.error('❌ Backup error:', error.message);
        process.exit(1);
      });
    } catch (error) {
      console.error('Backup failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('restore')
  .description('Restore database from backup')
  .argument('<file>', 'Backup file path')
  .option('--force', 'Force restore without confirmation')
  .action(async (file, options) => {
    try {
      const fs = require('fs');
      
      if (!fs.existsSync(file)) {
        console.error(`❌ Backup file not found: ${file}`);
        process.exit(1);
      }

      if (!options.force) {
        const readline = require('readline');
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        const answer = await new Promise(resolve => {
          rl.question('⚠️  This will replace all current data. Continue? (y/N): ', resolve);
        });

        rl.close();

        if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
          console.log('Restore cancelled');
          process.exit(0);
        }
      }

      const { spawn } = require('child_process');
      
      console.log(`📥 Restoring from backup: ${file}`);
      
      const restoreProcess = spawn('psql', [process.env.DATABASE_URL, '-f', file], {
        stdio: 'inherit'
      });

      restoreProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Restore completed successfully');
          process.exit(0);
        } else {
          console.error('❌ Restore failed');
          process.exit(1);
        }
      });

      restoreProcess.on('error', (error) => {
        console.error('❌ Restore error:', error.message);
        process.exit(1);
      });
    } catch (error) {
      console.error('Restore failed:', error.message);
      process.exit(1);
    }
  });

// Handle cleanup
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  await migrator.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down...');
  await migrator.close();
  process.exit(0);
});

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}