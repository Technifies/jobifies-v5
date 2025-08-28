import bcrypt from 'bcrypt';
import { query, transaction } from '../config/database';
import config from '../config';
import logger from '../utils/logger';

export class Seeder {
  async seedEmailTemplates(): Promise<void> {
    const templates = [
      {
        name: 'welcome',
        subject: 'Welcome to Jobifies!',
        html_content: '<!DOCTYPE html><html><head><title>Welcome</title></head><body><h1>Welcome to Jobifies!</h1><p>Thank you for joining us.</p></body></html>',
        text_content: 'Welcome to Jobifies! Thank you for joining us.',
        variables: ['firstName', 'lastName'],
      },
      {
        name: 'verification',
        subject: 'Verify Your Email Address',
        html_content: '<!DOCTYPE html><html><head><title>Verify Email</title></head><body><h1>Please verify your email</h1><p>Click the link to verify: {{verificationLink}}</p></body></html>',
        text_content: 'Please verify your email by clicking the link: {{verificationLink}}',
        variables: ['firstName', 'verificationLink'],
      },
      {
        name: 'password_reset',
        subject: 'Reset Your Password',
        html_content: '<!DOCTYPE html><html><head><title>Password Reset</title></head><body><h1>Reset Your Password</h1><p>Click the link to reset: {{resetLink}}</p></body></html>',
        text_content: 'Reset your password by clicking the link: {{resetLink}}',
        variables: ['firstName', 'resetLink'],
      },
    ];

    for (const template of templates) {
      await query(
        `INSERT INTO email_templates (name, subject, html_content, text_content, variables) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (name) DO UPDATE SET 
         subject = EXCLUDED.subject, 
         html_content = EXCLUDED.html_content,
         text_content = EXCLUDED.text_content,
         variables = EXCLUDED.variables`,
        [
          template.name,
          template.subject,
          template.html_content,
          template.text_content,
          template.variables,
        ]
      );
    }

    logger.info('Email templates seeded successfully');
  }

  async seedAdminUser(): Promise<void> {
    const adminEmail = 'admin@jobifies.com';
    const adminPassword = 'Admin123!'; // Should be changed in production

    // Check if admin user already exists
    const existingAdmin = await query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    
    if (existingAdmin.rows.length > 0) {
      logger.info('Admin user already exists, skipping creation');
      return;
    }

    const passwordHash = await bcrypt.hash(adminPassword, config.security.bcryptRounds);

    await query(
      `INSERT INTO users (
        email, password_hash, first_name, last_name, role, 
        is_verified, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        adminEmail,
        passwordHash,
        'System',
        'Administrator',
        'super_admin',
        true,
        true,
      ]
    );

    logger.info('Admin user created successfully', {
      email: adminEmail,
      password: adminPassword, // Remove this in production
    });
  }

  async seedSystemConfig(): Promise<void> {
    const configs = [
      {
        key: 'site_name',
        value: 'Jobifies',
        description: 'Name of the job portal',
      },
      {
        key: 'max_applications_per_day',
        value: '10',
        description: 'Maximum number of job applications per day for free users',
      },
      {
        key: 'max_job_posts_free',
        value: '5',
        description: 'Maximum number of job posts for free recruiters',
      },
      {
        key: 'featured_job_price',
        value: '49.99',
        description: 'Price for featuring a job post (USD)',
      },
      {
        key: 'maintenance_mode',
        value: 'false',
        description: 'Enable/disable maintenance mode',
      },
    ];

    // Get admin user for updated_by field
    const adminResult = await query(
      'SELECT id FROM users WHERE role = $1 LIMIT 1',
      ['super_admin']
    );

    if (adminResult.rows.length === 0) {
      logger.warn('No admin user found for system config seeding');
      return;
    }

    const adminId = adminResult.rows[0].id;

    for (const config of configs) {
      await query(
        `INSERT INTO system_config (key, value, description, updated_by) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (key) DO UPDATE SET 
         value = EXCLUDED.value, 
         description = EXCLUDED.description,
         updated_by = EXCLUDED.updated_by`,
        [config.key, config.value, config.description, adminId]
      );
    }

    logger.info('System configuration seeded successfully');
  }

  async seedSampleData(): Promise<void> {
    if (config.NODE_ENV === 'production') {
      logger.warn('Skipping sample data seeding in production');
      return;
    }

    // Seed sample recruiter
    const recruiterEmail = 'recruiter@example.com';
    const recruiterPassword = 'Recruiter123!';

    const existingRecruiter = await query('SELECT id FROM users WHERE email = $1', [recruiterEmail]);
    
    let recruiterId: string;

    if (existingRecruiter.rows.length === 0) {
      const recruiterPasswordHash = await bcrypt.hash(recruiterPassword, config.security.bcryptRounds);
      
      const recruiterResult = await query(
        `INSERT INTO users (
          email, password_hash, first_name, last_name, role, 
          is_verified, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [
          recruiterEmail,
          recruiterPasswordHash,
          'Jane',
          'Recruiter',
          'recruiter',
          true,
          true,
        ]
      );
      
      recruiterId = recruiterResult.rows[0].id;
      logger.info('Sample recruiter created', { email: recruiterEmail });
    } else {
      recruiterId = existingRecruiter.rows[0].id;
    }

    // Seed sample company
    const existingCompany = await query('SELECT id FROM companies WHERE name = $1', ['TechCorp Inc.']);
    
    let companyId: string;

    if (existingCompany.rows.length === 0) {
      const companyResult = await query(
        `INSERT INTO companies (
          name, description, industry, company_size, headquarters, 
          website, verified, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [
          'TechCorp Inc.',
          'A leading technology company specializing in innovative software solutions.',
          'Technology',
          'large',
          'San Francisco, CA',
          'https://techcorp.example.com',
          true,
          recruiterId,
        ]
      );
      
      companyId = companyResult.rows[0].id;
      logger.info('Sample company created');
    } else {
      companyId = existingCompany.rows[0].id;
    }

    // Seed sample job seeker
    const jobSeekerEmail = 'jobseeker@example.com';
    const jobSeekerPassword = 'JobSeeker123!';

    const existingJobSeeker = await query('SELECT id FROM users WHERE email = $1', [jobSeekerEmail]);
    
    if (existingJobSeeker.rows.length === 0) {
      const jobSeekerPasswordHash = await bcrypt.hash(jobSeekerPassword, config.security.bcryptRounds);
      
      await transaction(async (client) => {
        const userResult = await client.query(
          `INSERT INTO users (
            email, password_hash, first_name, last_name, role, 
            is_verified, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
          [
            jobSeekerEmail,
            jobSeekerPasswordHash,
            'John',
            'Developer',
            'job_seeker',
            true,
            true,
          ]
        );
        
        const userId = userResult.rows[0].id;

        // Create user profile
        await client.query(
          `INSERT INTO user_profiles (
            user_id, bio, experience_level, current_position, 
            skills, salary_expectation
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            userId,
            'Experienced software developer with expertise in full-stack development.',
            'senior',
            'Senior Software Engineer',
            ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL'],
            120000,
          ]
        );
      });
      
      logger.info('Sample job seeker created', { email: jobSeekerEmail });
    }

    // Seed sample jobs
    const sampleJobs = [
      {
        title: 'Senior Full Stack Developer',
        description: 'We are looking for a senior full-stack developer to join our team.',
        requirements: ['5+ years of experience', 'React expertise', 'Node.js knowledge'],
        responsibilities: ['Develop new features', 'Code review', 'Mentor junior developers'],
        job_type: 'full_time',
        employment_type: 'permanent',
        experience_level: 'senior',
        salary_min: 100000,
        salary_max: 150000,
        location: 'San Francisco, CA',
        remote_type: 'hybrid',
        skills_required: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
        benefits: ['Health insurance', '401k', 'Flexible hours'],
      },
      {
        title: 'Frontend Developer',
        description: 'Join our frontend team to build amazing user interfaces.',
        requirements: ['3+ years of experience', 'React expertise', 'CSS knowledge'],
        responsibilities: ['Build user interfaces', 'Optimize performance', 'Work with design team'],
        job_type: 'full_time',
        employment_type: 'permanent',
        experience_level: 'mid',
        salary_min: 80000,
        salary_max: 120000,
        location: 'Remote',
        remote_type: 'remote',
        skills_required: ['JavaScript', 'React', 'CSS', 'HTML'],
        benefits: ['Health insurance', 'Remote work', 'Learning budget'],
      },
    ];

    for (const job of sampleJobs) {
      const existingJob = await query('SELECT id FROM jobs WHERE title = $1', [job.title]);
      
      if (existingJob.rows.length === 0) {
        await query(
          `INSERT INTO jobs (
            title, description, requirements, responsibilities, job_type,
            employment_type, experience_level, salary_min, salary_max,
            location, remote_type, skills_required, benefits,
            company_id, created_by, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
          [
            job.title, job.description, job.requirements, job.responsibilities,
            job.job_type, job.employment_type, job.experience_level,
            job.salary_min, job.salary_max, job.location, job.remote_type,
            job.skills_required, job.benefits, companyId, recruiterId, true,
          ]
        );
      }
    }

    logger.info('Sample data seeded successfully');
  }

  async runAllSeeds(): Promise<void> {
    try {
      logger.info('Starting database seeding...');
      
      await this.seedEmailTemplates();
      await this.seedAdminUser();
      await this.seedSystemConfig();
      await this.seedSampleData();
      
      logger.info('Database seeding completed successfully');
    } catch (error) {
      logger.error('Database seeding failed:', error);
      throw error;
    }
  }

  async runComprehensiveSeeds(): Promise<void> {
    try {
      logger.info('Starting comprehensive database seeding...');
      
      // Run basic seeds first
      await this.seedEmailTemplates();
      await this.seedAdminUser();
      await this.seedSystemConfig();
      
      // Import and run comprehensive seeding
      const { default: ComprehensiveDataSeeder } = await import('./seeds/comprehensive-data');
      const comprehensiveSeeder = new ComprehensiveDataSeeder();
      await comprehensiveSeeder.runComprehensiveSeeding();
      
      logger.info('Comprehensive database seeding completed successfully');
    } catch (error) {
      logger.error('Comprehensive database seeding failed:', error);
      throw error;
    }
  }
}

// CLI interface
if (require.main === module) {
  const seeder = new Seeder();
  const command = process.argv[2];
  
  if (command === 'comprehensive' || command === '--comprehensive' || command === '-c') {
    seeder.runComprehensiveSeeds()
      .then(() => {
        logger.info('Comprehensive seeding completed');
        process.exit(0);
      })
      .catch((error) => {
        logger.error('Comprehensive seeding failed:', error);
        process.exit(1);
      });
  } else {
    seeder.runAllSeeds()
      .then(() => {
        logger.info('Basic seeding completed');
        process.exit(0);
      })
      .catch((error) => {
        logger.error('Basic seeding failed:', error);
        process.exit(1);
      });
  }
}

export default Seeder;