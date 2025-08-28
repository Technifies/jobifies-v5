import bcrypt from 'bcrypt';
import { query, transaction } from '../../config/database';
import config from '../../config';
import logger from '../../utils/logger';

export class ComprehensiveDataSeeder {
  private companies = [
    {
      name: 'TechCorp Inc.',
      description: 'Leading technology company specializing in innovative software solutions and cloud infrastructure.',
      industry: 'Technology',
      company_size: 'large',
      founded_year: 2010,
      headquarters: 'San Francisco, CA',
      website: 'https://techcorp.example.com',
      verified: true,
      benefits: ['Health Insurance', 'Dental & Vision', '401k Matching', 'Flexible PTO', 'Remote Work Options'],
      culture_values: ['Innovation', 'Collaboration', 'Work-Life Balance', 'Continuous Learning']
    },
    {
      name: 'StartupFlow',
      description: 'Fast-growing fintech startup revolutionizing digital payments and financial services.',
      industry: 'Financial Services',
      company_size: 'startup',
      founded_year: 2020,
      headquarters: 'New York, NY',
      website: 'https://startupflow.example.com',
      verified: true,
      benefits: ['Equity Options', 'Health Insurance', 'Flexible Hours', 'Learning Budget', 'Catered Meals'],
      culture_values: ['Move Fast', 'Think Big', 'Customer First', 'Transparency']
    },
    {
      name: 'Global Solutions Ltd',
      description: 'International consulting firm providing business transformation and digital solutions.',
      industry: 'Consulting',
      company_size: 'enterprise',
      founded_year: 2005,
      headquarters: 'Chicago, IL',
      website: 'https://globalsolutions.example.com',
      verified: true,
      benefits: ['Premium Healthcare', 'Retirement Plans', 'Professional Development', 'Travel Allowances'],
      culture_values: ['Excellence', 'Integrity', 'Client Success', 'Global Mindset']
    },
    {
      name: 'DesignStudio Creative',
      description: 'Award-winning creative agency specializing in branding, digital design, and user experiences.',
      industry: 'Design & Creative',
      company_size: 'medium',
      founded_year: 2015,
      headquarters: 'Los Angeles, CA',
      website: 'https://designstudio.example.com',
      verified: true,
      benefits: ['Creative Freedom', 'Health Benefits', 'Flexible Schedule', 'Design Tools Budget'],
      culture_values: ['Creativity', 'Quality', 'Collaboration', 'Innovation']
    },
    {
      name: 'HealthTech Innovations',
      description: 'Pioneering healthcare technology company developing AI-powered medical solutions.',
      industry: 'Healthcare',
      company_size: 'medium',
      founded_year: 2018,
      headquarters: 'Boston, MA',
      website: 'https://healthtech.example.com',
      verified: true,
      benefits: ['Comprehensive Health Coverage', 'Stock Options', 'Research Time', 'Conference Attendance'],
      culture_values: ['Impact', 'Scientific Rigor', 'Patient Care', 'Innovation']
    },
    {
      name: 'DataDriven Analytics',
      description: 'Data science consulting firm helping enterprises make data-driven decisions.',
      industry: 'Data & Analytics',
      company_size: 'small',
      founded_year: 2019,
      headquarters: 'Seattle, WA',
      website: 'https://datadriven.example.com',
      verified: true,
      benefits: ['Competitive Salary', 'Health Insurance', 'Learning Stipend', 'Remote Work'],
      culture_values: ['Data-Driven', 'Analytical Thinking', 'Client Success', 'Growth Mindset']
    }
  ];

  private jobs = [
    // TechCorp Inc. Jobs
    {
      title: 'Senior Full Stack Developer',
      description: `We are seeking a Senior Full Stack Developer to join our engineering team. You will be responsible for designing and implementing scalable web applications using modern technologies.

Key Responsibilities:
- Develop and maintain full-stack web applications
- Collaborate with product managers and designers
- Lead technical decisions and mentor junior developers
- Ensure code quality through reviews and testing

What We Offer:
- Competitive salary and equity
- Comprehensive benefits package
- Flexible work arrangements
- Professional development opportunities`,
      requirements: [
        '5+ years of full-stack development experience',
        'Proficiency in JavaScript/TypeScript',
        'Experience with React and Node.js',
        'Strong understanding of databases (PostgreSQL/MongoDB)',
        'Experience with cloud platforms (AWS/GCP/Azure)',
        'Bachelor\'s degree in Computer Science or equivalent'
      ],
      responsibilities: [
        'Design and develop scalable web applications',
        'Write clean, maintainable, and testable code',
        'Participate in code reviews and technical discussions',
        'Mentor junior team members',
        'Collaborate with cross-functional teams',
        'Stay updated with latest technology trends'
      ],
      job_type: 'full_time',
      employment_type: 'permanent',
      experience_level: 'senior',
      salary_min: 120000,
      salary_max: 160000,
      location: 'San Francisco, CA',
      remote_type: 'hybrid',
      skills_required: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
      skills_preferred: ['Docker', 'Kubernetes', 'GraphQL', 'Redis', 'Microservices'],
      benefits: ['Health Insurance', 'Dental & Vision', '401k Matching', 'Stock Options', 'Flexible PTO']
    },
    {
      title: 'Frontend React Developer',
      description: `Join our frontend team to build amazing user interfaces and experiences. We're looking for a passionate React developer who loves creating pixel-perfect, responsive applications.`,
      requirements: [
        '3+ years of React development experience',
        'Strong knowledge of HTML5, CSS3, and JavaScript',
        'Experience with state management (Redux/Zustand)',
        'Understanding of responsive design principles',
        'Experience with modern build tools (Webpack/Vite)'
      ],
      responsibilities: [
        'Develop responsive and interactive user interfaces',
        'Optimize applications for maximum speed and scalability',
        'Collaborate with UX/UI designers',
        'Write reusable and modular components',
        'Ensure cross-browser compatibility'
      ],
      job_type: 'full_time',
      employment_type: 'permanent',
      experience_level: 'mid',
      salary_min: 90000,
      salary_max: 130000,
      location: 'San Francisco, CA',
      remote_type: 'remote',
      skills_required: ['React', 'JavaScript', 'CSS3', 'HTML5', 'Redux'],
      skills_preferred: ['TypeScript', 'Next.js', 'Tailwind CSS', 'Jest', 'Cypress'],
      benefits: ['Health Insurance', '401k Matching', 'Remote Work Stipend', 'Learning Budget']
    },
    {
      title: 'DevOps Engineer',
      description: `We're seeking a DevOps Engineer to help scale our infrastructure and improve our deployment processes. You'll work with cutting-edge technologies in a cloud-native environment.`,
      requirements: [
        '4+ years of DevOps/Infrastructure experience',
        'Strong experience with AWS/GCP/Azure',
        'Proficiency in Infrastructure as Code (Terraform/CloudFormation)',
        'Experience with containerization (Docker/Kubernetes)',
        'Knowledge of CI/CD pipelines'
      ],
      responsibilities: [
        'Design and maintain cloud infrastructure',
        'Implement and improve CI/CD pipelines',
        'Monitor system performance and reliability',
        'Automate deployment processes',
        'Ensure security best practices'
      ],
      job_type: 'full_time',
      employment_type: 'permanent',
      experience_level: 'senior',
      salary_min: 130000,
      salary_max: 170000,
      location: 'San Francisco, CA',
      remote_type: 'hybrid',
      skills_required: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux'],
      skills_preferred: ['Helm', 'Prometheus', 'Grafana', 'Jenkins', 'Python'],
      benefits: ['Health Insurance', 'Stock Options', 'Professional Development', 'Flexible Hours']
    },
    // StartupFlow Jobs
    {
      title: 'Product Manager',
      description: `Lead product development for our innovative fintech solutions. Drive product strategy, work with engineering teams, and deliver exceptional user experiences.`,
      requirements: [
        '3+ years of product management experience',
        'Experience in fintech or payments industry',
        'Strong analytical and problem-solving skills',
        'Experience with agile development methodologies',
        'Bachelor\'s degree in Business, Engineering, or related field'
      ],
      responsibilities: [
        'Define product roadmap and strategy',
        'Work closely with engineering and design teams',
        'Analyze user feedback and market trends',
        'Manage product launches and feature rollouts',
        'Collaborate with stakeholders across the organization'
      ],
      job_type: 'full_time',
      employment_type: 'permanent',
      experience_level: 'mid',
      salary_min: 110000,
      salary_max: 150000,
      location: 'New York, NY',
      remote_type: 'hybrid',
      skills_required: ['Product Management', 'Agile', 'Data Analysis', 'User Research'],
      skills_preferred: ['Fintech Experience', 'SQL', 'A/B Testing', 'Figma', 'JIRA'],
      benefits: ['Equity Options', 'Health Insurance', 'Flexible PTO', 'Catered Meals']
    },
    {
      title: 'Data Scientist',
      description: `Join our data team to build machine learning models and drive data-driven decision making. Work with large datasets to uncover insights and improve our products.`,
      requirements: [
        'Master\'s degree in Data Science, Statistics, or related field',
        '2+ years of data science experience',
        'Proficiency in Python and SQL',
        'Experience with machine learning frameworks',
        'Strong statistical analysis skills'
      ],
      responsibilities: [
        'Develop and deploy machine learning models',
        'Analyze complex datasets to extract insights',
        'Create data visualizations and reports',
        'Collaborate with product and engineering teams',
        'Present findings to stakeholders'
      ],
      job_type: 'full_time',
      employment_type: 'permanent',
      experience_level: 'mid',
      salary_min: 115000,
      salary_max: 145000,
      location: 'New York, NY',
      remote_type: 'remote',
      skills_required: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Pandas'],
      skills_preferred: ['TensorFlow', 'PyTorch', 'Spark', 'AWS', 'Docker'],
      benefits: ['Equity Options', 'Health Insurance', 'Learning Budget', 'Conference Attendance']
    },
    // Global Solutions Ltd Jobs
    {
      title: 'Business Analyst',
      description: `Work with clients to understand their business needs and translate requirements into technical solutions. Drive digital transformation projects across various industries.`,
      requirements: [
        'Bachelor\'s degree in Business, Economics, or related field',
        '2+ years of business analysis experience',
        'Strong analytical and communication skills',
        'Experience with process modeling and documentation',
        'Knowledge of business intelligence tools'
      ],
      responsibilities: [
        'Gather and document business requirements',
        'Analyze current business processes',
        'Recommend process improvements',
        'Facilitate workshops and stakeholder meetings',
        'Support project implementation'
      ],
      job_type: 'full_time',
      employment_type: 'permanent',
      experience_level: 'junior',
      salary_min: 70000,
      salary_max: 95000,
      location: 'Chicago, IL',
      remote_type: 'hybrid',
      skills_required: ['Business Analysis', 'Requirements Gathering', 'Process Modeling', 'Communication'],
      skills_preferred: ['SQL', 'Tableau', 'Visio', 'JIRA', 'Agile'],
      benefits: ['Premium Healthcare', 'Retirement Plans', 'Professional Development', 'Travel Allowances']
    },
    // DesignStudio Creative Jobs
    {
      title: 'UX/UI Designer',
      description: `Create beautiful and intuitive user experiences for web and mobile applications. Work with a talented team of designers and developers to bring ideas to life.`,
      requirements: [
        'Bachelor\'s degree in Design or related field',
        '3+ years of UX/UI design experience',
        'Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)',
        'Strong portfolio showcasing design work',
        'Understanding of user-centered design principles'
      ],
      responsibilities: [
        'Design user interfaces for web and mobile applications',
        'Conduct user research and usability testing',
        'Create wireframes, prototypes, and design systems',
        'Collaborate with developers on implementation',
        'Present design concepts to clients'
      ],
      job_type: 'full_time',
      employment_type: 'permanent',
      experience_level: 'mid',
      salary_min: 85000,
      salary_max: 115000,
      location: 'Los Angeles, CA',
      remote_type: 'hybrid',
      skills_required: ['Figma', 'Sketch', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
      skills_preferred: ['After Effects', 'Principle', 'InVision', 'Webflow', 'HTML/CSS'],
      benefits: ['Creative Freedom', 'Health Benefits', 'Design Tools Budget', 'Flexible Schedule']
    },
    // HealthTech Innovations Jobs
    {
      title: 'Machine Learning Engineer',
      description: `Develop AI-powered solutions for healthcare applications. Work on cutting-edge projects that can save lives and improve patient outcomes.`,
      requirements: [
        'Master\'s degree in Computer Science, Machine Learning, or related field',
        '3+ years of machine learning experience',
        'Strong programming skills in Python',
        'Experience with deep learning frameworks',
        'Knowledge of healthcare domain preferred'
      ],
      responsibilities: [
        'Develop and deploy machine learning models',
        'Process and analyze medical data',
        'Collaborate with medical professionals',
        'Ensure model accuracy and compliance',
        'Research latest ML techniques'
      ],
      job_type: 'full_time',
      employment_type: 'permanent',
      experience_level: 'senior',
      salary_min: 135000,
      salary_max: 175000,
      location: 'Boston, MA',
      remote_type: 'hybrid',
      skills_required: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning'],
      skills_preferred: ['Medical Imaging', 'HIPAA', 'Kubernetes', 'MLOps', 'Research'],
      benefits: ['Stock Options', 'Health Coverage', 'Research Time', 'Conference Attendance']
    },
    // DataDriven Analytics Jobs
    {
      title: 'Data Analyst',
      description: `Help clients make data-driven decisions by analyzing complex datasets and creating insightful reports and visualizations.`,
      requirements: [
        'Bachelor\'s degree in Statistics, Mathematics, or related field',
        '1+ years of data analysis experience',
        'Proficiency in SQL and Excel',
        'Experience with data visualization tools',
        'Strong analytical and problem-solving skills'
      ],
      responsibilities: [
        'Analyze client datasets to identify trends and insights',
        'Create reports and dashboards',
        'Present findings to clients',
        'Support business decision-making',
        'Maintain data quality and accuracy'
      ],
      job_type: 'full_time',
      employment_type: 'permanent',
      experience_level: 'junior',
      salary_min: 65000,
      salary_max: 85000,
      location: 'Seattle, WA',
      remote_type: 'remote',
      skills_required: ['SQL', 'Excel', 'Data Analysis', 'Statistics', 'Python'],
      skills_preferred: ['Tableau', 'Power BI', 'R', 'Google Analytics', 'A/B Testing'],
      benefits: ['Health Insurance', 'Remote Work', 'Learning Stipend', 'Flexible Hours']
    },
    // Additional diverse roles
    {
      title: 'Marketing Manager',
      description: `Lead marketing initiatives to drive brand awareness and customer acquisition. Develop and execute comprehensive marketing strategies.`,
      requirements: [
        'Bachelor\'s degree in Marketing or related field',
        '4+ years of marketing experience',
        'Experience with digital marketing channels',
        'Strong project management skills',
        'Data-driven approach to marketing'
      ],
      responsibilities: [
        'Develop marketing strategies and campaigns',
        'Manage digital marketing channels',
        'Analyze campaign performance',
        'Coordinate with sales and product teams',
        'Manage marketing budget'
      ],
      job_type: 'full_time',
      employment_type: 'permanent',
      experience_level: 'mid',
      salary_min: 80000,
      salary_max: 110000,
      location: 'Remote',
      remote_type: 'remote',
      skills_required: ['Digital Marketing', 'Google Analytics', 'Content Marketing', 'SEO', 'SEM'],
      skills_preferred: ['HubSpot', 'Salesforce', 'A/B Testing', 'Email Marketing', 'Social Media'],
      benefits: ['Health Insurance', 'Remote Work', 'Marketing Budget', 'Professional Development']
    },
    {
      title: 'Software Engineering Intern',
      description: `Join our engineering team as an intern to gain hands-on experience in software development. Work on real projects and learn from experienced engineers.`,
      requirements: [
        'Currently pursuing Computer Science degree',
        'Basic programming knowledge (any language)',
        'Strong problem-solving skills',
        'Eagerness to learn and grow',
        'Available for 3-month internship'
      ],
      responsibilities: [
        'Assist in software development projects',
        'Write clean and documented code',
        'Participate in code reviews',
        'Learn new technologies and frameworks',
        'Present final project to team'
      ],
      job_type: 'internship',
      employment_type: 'internship',
      experience_level: 'entry',
      salary_min: 25,
      salary_max: 35,
      location: 'San Francisco, CA',
      remote_type: 'hybrid',
      skills_required: ['Programming Basics', 'Problem Solving', 'Communication', 'Learning Attitude'],
      skills_preferred: ['JavaScript', 'Python', 'Git', 'SQL', 'Web Development'],
      benefits: ['Mentorship', 'Learning Opportunities', 'Networking', 'Potential Full-time Offer']
    }
  ];

  private jobSeekers = [
    {
      email: 'john.developer@email.com',
      first_name: 'John',
      last_name: 'Developer',
      profile: {
        bio: 'Passionate full-stack developer with 5 years of experience building scalable web applications. Love working with React, Node.js, and cloud technologies.',
        experience_level: 'senior',
        current_position: 'Senior Software Engineer',
        current_company: 'Previous Tech Company',
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
        salary_expectation: 125000,
        preferred_locations: ['San Francisco, CA', 'New York, NY', 'Remote'],
        job_types: ['full_time'],
        employment_types: ['permanent'],
        remote_preference: 'hybrid'
      },
      education: [
        {
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          field_of_study: 'Computer Science',
          start_date: '2015-08-01',
          end_date: '2019-05-01',
          grade: '3.7 GPA'
        }
      ],
      work_experience: [
        {
          company: 'Previous Tech Company',
          position: 'Senior Software Engineer',
          start_date: '2021-03-01',
          end_date: null,
          is_current: true,
          description: 'Lead development of customer-facing web applications using React and Node.js',
          skills_used: ['React', 'Node.js', 'PostgreSQL', 'AWS']
        },
        {
          company: 'Mid-Size Startup',
          position: 'Software Developer',
          start_date: '2019-06-01',
          end_date: '2021-02-28',
          is_current: false,
          description: 'Developed full-stack features and improved application performance',
          skills_used: ['JavaScript', 'Express.js', 'MongoDB', 'React']
        }
      ]
    },
    {
      email: 'sarah.designer@email.com',
      first_name: 'Sarah',
      last_name: 'Chen',
      profile: {
        bio: 'Creative UX/UI designer with a passion for creating intuitive and beautiful user experiences. Expert in design thinking and user research.',
        experience_level: 'mid',
        current_position: 'UX Designer',
        current_company: 'Design Agency',
        skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'Design Systems'],
        salary_expectation: 95000,
        preferred_locations: ['Los Angeles, CA', 'San Francisco, CA', 'Remote'],
        job_types: ['full_time', 'contract'],
        employment_types: ['permanent', 'contract'],
        remote_preference: 'remote'
      },
      education: [
        {
          institution: 'Art Center College of Design',
          degree: 'Bachelor of Fine Arts',
          field_of_study: 'Graphic Design',
          start_date: '2016-09-01',
          end_date: '2020-05-01',
          grade: '3.8 GPA'
        }
      ],
      work_experience: [
        {
          company: 'Design Agency',
          position: 'UX Designer',
          start_date: '2022-01-01',
          end_date: null,
          is_current: true,
          description: 'Design user interfaces for web and mobile applications, conduct user research',
          skills_used: ['Figma', 'User Research', 'Prototyping', 'Design Systems']
        }
      ]
    },
    {
      email: 'mike.analyst@email.com',
      first_name: 'Michael',
      last_name: 'Rodriguez',
      profile: {
        bio: 'Data-driven business analyst with experience in process optimization and business intelligence. Strong background in SQL and data visualization.',
        experience_level: 'junior',
        current_position: 'Junior Business Analyst',
        current_company: 'Consulting Firm',
        skills: ['SQL', 'Excel', 'Tableau', 'Business Analysis', 'Process Modeling', 'Data Visualization'],
        salary_expectation: 75000,
        preferred_locations: ['Chicago, IL', 'Remote'],
        job_types: ['full_time'],
        employment_types: ['permanent'],
        remote_preference: 'hybrid'
      }
    },
    {
      email: 'emily.scientist@email.com',
      first_name: 'Emily',
      last_name: 'Watson',
      profile: {
        bio: 'Data scientist with PhD in Statistics and experience in machine learning. Passionate about using data to solve real-world problems.',
        experience_level: 'senior',
        current_position: 'Senior Data Scientist',
        current_company: 'Tech Startup',
        skills: ['Python', 'R', 'Machine Learning', 'Statistics', 'Deep Learning', 'SQL', 'TensorFlow'],
        salary_expectation: 140000,
        preferred_locations: ['Boston, MA', 'New York, NY', 'Remote'],
        job_types: ['full_time'],
        employment_types: ['permanent'],
        remote_preference: 'flexible'
      }
    },
    {
      email: 'alex.marketing@email.com',
      first_name: 'Alex',
      last_name: 'Johnson',
      profile: {
        bio: 'Digital marketing professional with expertise in growth marketing, SEO, and content strategy. Results-driven approach to customer acquisition.',
        experience_level: 'mid',
        current_position: 'Marketing Manager',
        current_company: 'E-commerce Company',
        skills: ['Digital Marketing', 'SEO', 'Content Marketing', 'Google Analytics', 'PPC', 'Social Media Marketing'],
        salary_expectation: 90000,
        preferred_locations: ['Remote'],
        job_types: ['full_time', 'contract'],
        employment_types: ['permanent', 'contract'],
        remote_preference: 'remote'
      }
    }
  ];

  private recruiters = [
    {
      email: 'jane.recruiter@techcorp.com',
      first_name: 'Jane',
      last_name: 'Smith',
      company: 'TechCorp Inc.'
    },
    {
      email: 'bob.hiring@startupflow.com',
      first_name: 'Bob',
      last_name: 'Wilson',
      company: 'StartupFlow'
    },
    {
      email: 'lisa.hr@globalsolutions.com',
      first_name: 'Lisa',
      last_name: 'Brown',
      company: 'Global Solutions Ltd'
    }
  ];

  async seedCompanies(): Promise<Map<string, string>> {
    const companyIds = new Map<string, string>();

    // Get admin user for created_by field
    const adminResult = await query('SELECT id FROM users WHERE role = $1 LIMIT 1', ['super_admin']);
    if (adminResult.rows.length === 0) {
      throw new Error('Admin user not found. Please seed admin user first.');
    }
    const adminId = adminResult.rows[0].id;

    for (const company of this.companies) {
      const existingCompany = await query('SELECT id FROM companies WHERE name = $1', [company.name]);
      
      let companyId: string;
      if (existingCompany.rows.length === 0) {
        const result = await query(`
          INSERT INTO companies (
            name, description, industry, company_size, founded_year,
            headquarters, website, verified, benefits, culture_values, created_by
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id
        `, [
          company.name,
          company.description,
          company.industry,
          company.company_size,
          company.founded_year,
          company.headquarters,
          company.website,
          company.verified,
          company.benefits,
          company.culture_values,
          adminId
        ]);
        companyId = result.rows[0].id;
        logger.info(`Created company: ${company.name}`);
      } else {
        companyId = existingCompany.rows[0].id;
        logger.info(`Company already exists: ${company.name}`);
      }
      
      companyIds.set(company.name, companyId);
    }

    return companyIds;
  }

  async seedRecruiters(companyIds: Map<string, string>): Promise<Map<string, string>> {
    const recruiterIds = new Map<string, string>();

    for (const recruiter of this.recruiters) {
      const existingRecruiter = await query('SELECT id FROM users WHERE email = $1', [recruiter.email]);
      
      let recruiterId: string;
      if (existingRecruiter.rows.length === 0) {
        const passwordHash = await bcrypt.hash('Recruiter123!', config.security.bcryptRounds);
        
        const result = await query(`
          INSERT INTO users (
            email, password_hash, first_name, last_name, role, 
            is_verified, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
        `, [
          recruiter.email,
          passwordHash,
          recruiter.first_name,
          recruiter.last_name,
          'recruiter',
          true,
          true
        ]);
        
        recruiterId = result.rows[0].id;
        logger.info(`Created recruiter: ${recruiter.email}`);
      } else {
        recruiterId = existingRecruiter.rows[0].id;
        logger.info(`Recruiter already exists: ${recruiter.email}`);
      }
      
      recruiterIds.set(recruiter.company, recruiterId);
    }

    return recruiterIds;
  }

  async seedJobs(companyIds: Map<string, string>, recruiterIds: Map<string, string>): Promise<void> {
    const companyJobMapping = [
      { company: 'TechCorp Inc.', jobIndices: [0, 1, 2, 10] }, // Full Stack, Frontend, DevOps, Intern
      { company: 'StartupFlow', jobIndices: [3, 4] }, // Product Manager, Data Scientist
      { company: 'Global Solutions Ltd', jobIndices: [5] }, // Business Analyst
      { company: 'DesignStudio Creative', jobIndices: [6] }, // UX/UI Designer
      { company: 'HealthTech Innovations', jobIndices: [7] }, // ML Engineer
      { company: 'DataDriven Analytics', jobIndices: [8] }, // Data Analyst
      { company: 'TechCorp Inc.', jobIndices: [9] } // Marketing Manager
    ];

    for (const mapping of companyJobMapping) {
      const companyId = companyIds.get(mapping.company);
      const recruiterId = recruiterIds.get(mapping.company) || recruiterIds.values().next().value;
      
      if (!companyId || !recruiterId) continue;

      for (const jobIndex of mapping.jobIndices) {
        const job = this.jobs[jobIndex];
        if (!job) continue;

        const existingJob = await query(
          'SELECT id FROM jobs WHERE title = $1 AND company_id = $2', 
          [job.title, companyId]
        );
        
        if (existingJob.rows.length === 0) {
          await query(`
            INSERT INTO jobs (
              title, description, requirements, responsibilities, job_type,
              employment_type, experience_level, salary_min, salary_max,
              location, remote_type, skills_required, skills_preferred,
              benefits, company_id, created_by, is_active, is_featured
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          `, [
            job.title,
            job.description,
            job.requirements,
            job.responsibilities,
            job.job_type,
            job.employment_type,
            job.experience_level,
            job.salary_min,
            job.salary_max,
            job.location,
            job.remote_type,
            job.skills_required,
            job.skills_preferred || [],
            job.benefits,
            companyId,
            recruiterId,
            true,
            Math.random() > 0.7 // 30% chance of being featured
          ]);
          
          logger.info(`Created job: ${job.title} at ${mapping.company}`);
        }
      }
    }
  }

  async seedJobSeekers(): Promise<void> {
    for (const jobSeeker of this.jobSeekers) {
      const existingUser = await query('SELECT id FROM users WHERE email = $1', [jobSeeker.email]);
      
      if (existingUser.rows.length === 0) {
        const passwordHash = await bcrypt.hash('JobSeeker123!', config.security.bcryptRounds);
        
        await transaction(async (client) => {
          // Create user
          const userResult = await client.query(`
            INSERT INTO users (
              email, password_hash, first_name, last_name, role, 
              is_verified, is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
          `, [
            jobSeeker.email,
            passwordHash,
            jobSeeker.first_name,
            jobSeeker.last_name,
            'job_seeker',
            true,
            true
          ]);
          
          const userId = userResult.rows[0].id;

          // Create user profile
          if (jobSeeker.profile) {
            await client.query(`
              INSERT INTO user_profiles (
                user_id, bio, experience_level, current_position, current_company,
                skills, salary_expectation, preferred_locations, job_types,
                employment_types, remote_preference
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            `, [
              userId,
              jobSeeker.profile.bio,
              jobSeeker.profile.experience_level,
              jobSeeker.profile.current_position,
              jobSeeker.profile.current_company,
              jobSeeker.profile.skills,
              jobSeeker.profile.salary_expectation,
              jobSeeker.profile.preferred_locations,
              jobSeeker.profile.job_types,
              jobSeeker.profile.employment_types,
              jobSeeker.profile.remote_preference
            ]);
          }

          // Create education records
          if (jobSeeker.education) {
            for (const edu of jobSeeker.education) {
              await client.query(`
                INSERT INTO education (
                  user_id, institution, degree, field_of_study, 
                  start_date, end_date, grade
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
              `, [
                userId,
                edu.institution,
                edu.degree,
                edu.field_of_study,
                edu.start_date,
                edu.end_date,
                edu.grade
              ]);
            }
          }

          // Create work experience records
          if (jobSeeker.work_experience) {
            for (const work of jobSeeker.work_experience) {
              await client.query(`
                INSERT INTO work_experience (
                  user_id, company, position, start_date, end_date, 
                  is_current, description, skills_used
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
              `, [
                userId,
                work.company,
                work.position,
                work.start_date,
                work.end_date,
                work.is_current,
                work.description,
                work.skills_used
              ]);
            }
          }
        });
        
        logger.info(`Created job seeker: ${jobSeeker.email}`);
      }
    }
  }

  async seedSampleApplications(): Promise<void> {
    // Get some jobs and job seekers to create sample applications
    const jobsResult = await query('SELECT id, title, company_id FROM jobs LIMIT 5');
    const jobSeekersResult = await query('SELECT id, email FROM users WHERE role = $1 LIMIT 3', ['job_seeker']);

    if (jobsResult.rows.length === 0 || jobSeekersResult.rows.length === 0) {
      logger.info('No jobs or job seekers found for sample applications');
      return;
    }

    const applications = [
      {
        status: 'submitted',
        cover_letter: 'I am very interested in this position and believe my skills align well with your requirements.'
      },
      {
        status: 'under_review',
        cover_letter: 'Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team.'
      },
      {
        status: 'shortlisted',
        cover_letter: 'I am excited about the possibility of joining your company and contributing to your mission.'
      }
    ];

    for (let i = 0; i < Math.min(jobsResult.rows.length, applications.length); i++) {
      const job = jobsResult.rows[i];
      const jobSeeker = jobSeekersResult.rows[i % jobSeekersResult.rows.length];
      const application = applications[i];

      const existingApplication = await query(
        'SELECT id FROM applications WHERE job_id = $1 AND applicant_id = $2',
        [job.id, jobSeeker.id]
      );

      if (existingApplication.rows.length === 0) {
        await query(`
          INSERT INTO applications (
            job_id, applicant_id, status, cover_letter, salary_expectation
          ) VALUES ($1, $2, $3, $4, $5)
        `, [
          job.id,
          jobSeeker.id,
          application.status,
          application.cover_letter,
          Math.floor(Math.random() * 50000) + 80000 // Random salary expectation
        ]);

        logger.info(`Created application: ${jobSeeker.email} -> ${job.title}`);
      }
    }
  }

  async runComprehensiveSeeding(): Promise<void> {
    try {
      logger.info('Starting comprehensive data seeding...');
      
      // Seed companies
      const companyIds = await this.seedCompanies();
      logger.info(`Seeded ${companyIds.size} companies`);

      // Seed recruiters
      const recruiterIds = await this.seedRecruiters(companyIds);
      logger.info(`Seeded ${recruiterIds.size} recruiters`);

      // Seed jobs
      await this.seedJobs(companyIds, recruiterIds);
      logger.info('Seeded jobs');

      // Seed job seekers
      await this.seedJobSeekers();
      logger.info('Seeded job seekers');

      // Seed sample applications
      await this.seedSampleApplications();
      logger.info('Seeded sample applications');

      logger.info('Comprehensive data seeding completed successfully');
      
    } catch (error) {
      logger.error('Comprehensive data seeding failed:', error);
      throw error;
    }
  }
}

export default ComprehensiveDataSeeder;