// Mock data for testing job portal functionality

export interface MockJob {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    logo?: string;
    verified: boolean;
  };
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
  experience: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  remote: 'remote' | 'hybrid' | 'on_site' | 'flexible';
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  benefits: string[];
  postedDate: string;
  applicationDeadline?: string;
  featured: boolean;
  applicationsCount: number;
  viewsCount: number;
}

export interface MockCompany {
  id: string;
  name: string;
  description: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  headquarters: string;
  website?: string;
  logo?: string;
  verified: boolean;
  openJobs: number;
  rating: number;
  benefits: string[];
  culture: string[];
}

export interface MockUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'job_seeker' | 'recruiter' | 'admin';
  profile?: {
    bio: string;
    experience: string;
    skills: string[];
    location: string;
    avatar?: string;
  };
}

export const mockCompanies: MockCompany[] = [
  {
    id: '1',
    name: 'TechCorp Inc.',
    description: 'Leading technology company specializing in innovative software solutions and cloud infrastructure.',
    industry: 'Technology',
    size: 'large',
    headquarters: 'San Francisco, CA',
    website: 'https://techcorp.example.com',
    verified: true,
    openJobs: 15,
    rating: 4.8,
    benefits: ['Health Insurance', 'Dental & Vision', '401k Matching', 'Flexible PTO', 'Remote Work Options'],
    culture: ['Innovation', 'Collaboration', 'Work-Life Balance', 'Continuous Learning']
  },
  {
    id: '2',
    name: 'StartupFlow',
    description: 'Fast-growing fintech startup revolutionizing digital payments and financial services.',
    industry: 'Financial Services',
    size: 'startup',
    headquarters: 'New York, NY',
    website: 'https://startupflow.example.com',
    verified: true,
    openJobs: 8,
    rating: 4.6,
    benefits: ['Equity Options', 'Health Insurance', 'Flexible Hours', 'Learning Budget', 'Catered Meals'],
    culture: ['Move Fast', 'Think Big', 'Customer First', 'Transparency']
  },
  {
    id: '3',
    name: 'Global Solutions Ltd',
    description: 'International consulting firm providing business transformation and digital solutions.',
    industry: 'Consulting',
    size: 'enterprise',
    headquarters: 'Chicago, IL',
    website: 'https://globalsolutions.example.com',
    verified: true,
    openJobs: 12,
    rating: 4.7,
    benefits: ['Premium Healthcare', 'Retirement Plans', 'Professional Development', 'Travel Allowances'],
    culture: ['Excellence', 'Integrity', 'Client Success', 'Global Mindset']
  },
  {
    id: '4',
    name: 'DesignStudio Creative',
    description: 'Award-winning creative agency specializing in branding, digital design, and user experiences.',
    industry: 'Design & Creative',
    size: 'medium',
    headquarters: 'Los Angeles, CA',
    website: 'https://designstudio.example.com',
    verified: true,
    openJobs: 6,
    rating: 4.9,
    benefits: ['Creative Freedom', 'Health Benefits', 'Flexible Schedule', 'Design Tools Budget'],
    culture: ['Creativity', 'Quality', 'Collaboration', 'Innovation']
  },
  {
    id: '5',
    name: 'HealthTech Innovations',
    description: 'Pioneering healthcare technology company developing AI-powered medical solutions.',
    industry: 'Healthcare',
    size: 'medium',
    headquarters: 'Boston, MA',
    website: 'https://healthtech.example.com',
    verified: true,
    openJobs: 9,
    rating: 4.5,
    benefits: ['Comprehensive Health Coverage', 'Stock Options', 'Research Time', 'Conference Attendance'],
    culture: ['Impact', 'Scientific Rigor', 'Patient Care', 'Innovation']
  },
  {
    id: '6',
    name: 'DataDriven Analytics',
    description: 'Data science consulting firm helping enterprises make data-driven decisions.',
    industry: 'Data & Analytics',
    size: 'small',
    headquarters: 'Seattle, WA',
    website: 'https://datadriven.example.com',
    verified: true,
    openJobs: 4,
    rating: 4.4,
    benefits: ['Competitive Salary', 'Health Insurance', 'Learning Stipend', 'Remote Work'],
    culture: ['Data-Driven', 'Analytical Thinking', 'Client Success', 'Growth Mindset']
  }
];

export const mockJobs: MockJob[] = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    company: {
      id: '1',
      name: 'TechCorp Inc.',
      verified: true
    },
    location: 'San Francisco, CA',
    salary: {
      min: 120000,
      max: 160000,
      currency: 'USD'
    },
    type: 'full_time',
    experience: 'senior',
    remote: 'hybrid',
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
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
    benefits: ['Health Insurance', 'Dental & Vision', '401k Matching', 'Stock Options', 'Flexible PTO'],
    postedDate: '2025-08-25',
    featured: true,
    applicationsCount: 24,
    viewsCount: 156
  },
  {
    id: '2',
    title: 'Frontend React Developer',
    company: {
      id: '1',
      name: 'TechCorp Inc.',
      verified: true
    },
    location: 'Remote',
    salary: {
      min: 90000,
      max: 130000,
      currency: 'USD'
    },
    type: 'full_time',
    experience: 'mid',
    remote: 'remote',
    description: 'Join our frontend team to build amazing user interfaces and experiences. We\'re looking for a passionate React developer who loves creating pixel-perfect, responsive applications.',
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
    skills: ['React', 'JavaScript', 'CSS3', 'HTML5', 'Redux'],
    benefits: ['Health Insurance', '401k Matching', 'Remote Work Stipend', 'Learning Budget'],
    postedDate: '2025-08-26',
    featured: false,
    applicationsCount: 18,
    viewsCount: 89
  },
  {
    id: '3',
    title: 'Product Manager',
    company: {
      id: '2',
      name: 'StartupFlow',
      verified: true
    },
    location: 'New York, NY',
    salary: {
      min: 110000,
      max: 150000,
      currency: 'USD'
    },
    type: 'full_time',
    experience: 'mid',
    remote: 'hybrid',
    description: 'Lead product development for our innovative fintech solutions. Drive product strategy, work with engineering teams, and deliver exceptional user experiences.',
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
    skills: ['Product Management', 'Agile', 'Data Analysis', 'User Research'],
    benefits: ['Equity Options', 'Health Insurance', 'Flexible PTO', 'Catered Meals'],
    postedDate: '2025-08-24',
    featured: true,
    applicationsCount: 32,
    viewsCount: 203
  },
  {
    id: '4',
    title: 'UX/UI Designer',
    company: {
      id: '4',
      name: 'DesignStudio Creative',
      verified: true
    },
    location: 'Los Angeles, CA',
    salary: {
      min: 85000,
      max: 115000,
      currency: 'USD'
    },
    type: 'full_time',
    experience: 'mid',
    remote: 'hybrid',
    description: 'Create beautiful and intuitive user experiences for web and mobile applications. Work with a talented team of designers and developers to bring ideas to life.',
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
    skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
    benefits: ['Creative Freedom', 'Health Benefits', 'Design Tools Budget', 'Flexible Schedule'],
    postedDate: '2025-08-27',
    featured: false,
    applicationsCount: 15,
    viewsCount: 76
  },
  {
    id: '5',
    title: 'Data Scientist',
    company: {
      id: '2',
      name: 'StartupFlow',
      verified: true
    },
    location: 'New York, NY',
    salary: {
      min: 115000,
      max: 145000,
      currency: 'USD'
    },
    type: 'full_time',
    experience: 'mid',
    remote: 'remote',
    description: 'Join our data team to build machine learning models and drive data-driven decision making. Work with large datasets to uncover insights and improve our products.',
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
    skills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Pandas'],
    benefits: ['Equity Options', 'Health Insurance', 'Learning Budget', 'Conference Attendance'],
    postedDate: '2025-08-23',
    featured: true,
    applicationsCount: 28,
    viewsCount: 134
  },
  {
    id: '6',
    title: 'DevOps Engineer',
    company: {
      id: '1',
      name: 'TechCorp Inc.',
      verified: true
    },
    location: 'San Francisco, CA',
    salary: {
      min: 130000,
      max: 170000,
      currency: 'USD'
    },
    type: 'full_time',
    experience: 'senior',
    remote: 'hybrid',
    description: 'We\'re seeking a DevOps Engineer to help scale our infrastructure and improve our deployment processes. You\'ll work with cutting-edge technologies in a cloud-native environment.',
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
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux'],
    benefits: ['Health Insurance', 'Stock Options', 'Professional Development', 'Flexible Hours'],
    postedDate: '2025-08-26',
    featured: false,
    applicationsCount: 19,
    viewsCount: 98
  },
  {
    id: '7',
    title: 'Machine Learning Engineer',
    company: {
      id: '5',
      name: 'HealthTech Innovations',
      verified: true
    },
    location: 'Boston, MA',
    salary: {
      min: 135000,
      max: 175000,
      currency: 'USD'
    },
    type: 'full_time',
    experience: 'senior',
    remote: 'hybrid',
    description: 'Develop AI-powered solutions for healthcare applications. Work on cutting-edge projects that can save lives and improve patient outcomes.',
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
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning'],
    benefits: ['Stock Options', 'Health Coverage', 'Research Time', 'Conference Attendance'],
    postedDate: '2025-08-25',
    featured: true,
    applicationsCount: 21,
    viewsCount: 112
  },
  {
    id: '8',
    title: 'Business Analyst',
    company: {
      id: '3',
      name: 'Global Solutions Ltd',
      verified: true
    },
    location: 'Chicago, IL',
    salary: {
      min: 70000,
      max: 95000,
      currency: 'USD'
    },
    type: 'full_time',
    experience: 'junior',
    remote: 'hybrid',
    description: 'Work with clients to understand their business needs and translate requirements into technical solutions. Drive digital transformation projects across various industries.',
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
    skills: ['Business Analysis', 'Requirements Gathering', 'Process Modeling', 'Communication'],
    benefits: ['Premium Healthcare', 'Retirement Plans', 'Professional Development', 'Travel Allowances'],
    postedDate: '2025-08-27',
    featured: false,
    applicationsCount: 12,
    viewsCount: 67
  },
  {
    id: '9',
    title: 'Marketing Manager',
    company: {
      id: '1',
      name: 'TechCorp Inc.',
      verified: true
    },
    location: 'Remote',
    salary: {
      min: 80000,
      max: 110000,
      currency: 'USD'
    },
    type: 'full_time',
    experience: 'mid',
    remote: 'remote',
    description: 'Lead marketing initiatives to drive brand awareness and customer acquisition. Develop and execute comprehensive marketing strategies.',
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
    skills: ['Digital Marketing', 'Google Analytics', 'Content Marketing', 'SEO', 'SEM'],
    benefits: ['Health Insurance', 'Remote Work', 'Marketing Budget', 'Professional Development'],
    postedDate: '2025-08-26',
    featured: false,
    applicationsCount: 16,
    viewsCount: 84
  },
  {
    id: '10',
    title: 'Software Engineering Intern',
    company: {
      id: '1',
      name: 'TechCorp Inc.',
      verified: true
    },
    location: 'San Francisco, CA',
    salary: {
      min: 25,
      max: 35,
      currency: 'USD'
    },
    type: 'internship',
    experience: 'entry',
    remote: 'hybrid',
    description: 'Join our engineering team as an intern to gain hands-on experience in software development. Work on real projects and learn from experienced engineers.',
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
    skills: ['Programming Basics', 'Problem Solving', 'Communication', 'Learning Attitude'],
    benefits: ['Mentorship', 'Learning Opportunities', 'Networking', 'Potential Full-time Offer'],
    postedDate: '2025-08-28',
    featured: false,
    applicationsCount: 8,
    viewsCount: 45
  }
];

// Utility functions for mock data
export const getMockJobsByCompany = (companyId: string): MockJob[] => {
  return mockJobs.filter(job => job.company.id === companyId);
};

export const getMockJobsBySkill = (skill: string): MockJob[] => {
  return mockJobs.filter(job => 
    job.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
  );
};

export const getMockJobsByLocation = (location: string): MockJob[] => {
  return mockJobs.filter(job => 
    job.location.toLowerCase().includes(location.toLowerCase()) ||
    job.remote === 'remote'
  );
};

export const getMockJobsByExperience = (experience: string): MockJob[] => {
  return mockJobs.filter(job => job.experience === experience);
};

export const getMockFeaturedJobs = (): MockJob[] => {
  return mockJobs.filter(job => job.featured);
};

export const getMockRecentJobs = (days: number = 7): MockJob[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return mockJobs.filter(job => {
    const postedDate = new Date(job.postedDate);
    return postedDate >= cutoffDate;
  });
};

export const getTrendingJobs = () => {
  // Transform mock jobs to match TrendingJobs component interface
  return mockJobs.slice(0, 6).map(job => ({
    id: job.id,
    title: job.title,
    company: {
      name: job.company.name,
      logo: '/api/placeholder/40/40',
      rating: mockCompanies.find(c => c.id === job.company.id)?.rating || 4.5,
      verified: job.company.verified
    },
    location: job.location,
    salary: {
      min: job.salary.min,
      max: job.salary.max,
      currency: job.salary.currency
    },
    type: job.type.replace('_', '-'),
    posted: getTimeAgo(job.postedDate),
    featured: job.featured,
    urgent: job.viewsCount > 100 && job.applicationsCount < 20,
    matchScore: Math.floor(Math.random() * 20 + 80), // Random match score between 80-100
    description: job.description,
    skills: job.skills,
    applicants: job.applicationsCount
  }));
};

export const getFeaturedCompanies = () => {
  // Transform mock companies to match FeaturedCompanies component interface
  return mockCompanies.map((company, index) => ({
    id: company.id,
    name: company.name,
    logo: '/api/placeholder/80/80',
    description: company.description,
    industry: company.industry,
    location: company.headquarters,
    size: company.size,
    founded: 2010 + (index * 2), // Mock founded years
    rating: company.rating,
    reviewCount: Math.floor(Math.random() * 2000 + 500), // Random review count
    openJobs: company.openJobs,
    verified: company.verified,
    featured: index < 3, // First 3 companies are featured
    salaryRange: {
      min: company.size === 'startup' ? 70000 : company.size === 'large' ? 120000 : 90000,
      max: company.size === 'startup' ? 120000 : company.size === 'large' ? 200000 : 150000,
      currency: 'USD'
    },
    benefits: company.benefits,
    tags: company.culture,
    culture: {
      workLifeBalance: Math.floor(Math.random() * 2 + 4), // 4-5
      compensation: Math.floor(Math.random() * 2 + 4), // 4-5  
      careerGrowth: Math.floor(Math.random() * 2 + 4), // 4-5
      diversity: Math.floor(Math.random() * 2 + 4) // 4-5
    },
    recentNews: index === 0 ? 'Recently raised $100M Series C funding' : undefined,
    hiring: company.openJobs > 5
  }));
};

const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return '1 week ago';
};

export const searchMockJobs = (query: string): MockJob[] => {
  const searchTerm = query.toLowerCase();
  return mockJobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm) ||
    job.company.name.toLowerCase().includes(searchTerm) ||
    job.description.toLowerCase().includes(searchTerm) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
    job.location.toLowerCase().includes(searchTerm)
  );
};

// Platform statistics
export const mockPlatformStats = {
  totalJobs: mockJobs.length,
  totalCompanies: mockCompanies.length,
  totalJobSeekers: 500000,
  successfulPlacements: 485000,
  averageSalary: 95000,
  remoteJobsPercent: Math.round((mockJobs.filter(job => job.remote === 'remote').length / mockJobs.length) * 100)
};

export const getPlatformStats = () => {
  return {
    totalJobs: mockJobs.length,
    totalCompanies: mockCompanies.length,
    totalJobSeekers: 567892,
    successfulPlacements: 89234,
    averageSalary: 95000,
    remoteJobsPercent: Math.round((mockJobs.filter(job => job.remote === 'remote').length / mockJobs.length) * 100)
  };
};

// Job categories with counts
export const mockJobCategories = [
  { name: 'Technology', count: mockJobs.filter(job => ['JavaScript', 'React', 'Python', 'AWS'].some(skill => job.skills.includes(skill))).length, icon: '💻' },
  { name: 'Design', count: mockJobs.filter(job => ['Figma', 'Sketch', 'Adobe Creative Suite'].some(skill => job.skills.includes(skill))).length, icon: '🎨' },
  { name: 'Marketing', count: mockJobs.filter(job => ['Digital Marketing', 'SEO', 'Content Marketing'].some(skill => job.skills.includes(skill))).length, icon: '📢' },
  { name: 'Data Science', count: mockJobs.filter(job => ['Python', 'Machine Learning', 'Statistics'].some(skill => job.skills.includes(skill))).length, icon: '📊' },
  { name: 'Product', count: mockJobs.filter(job => ['Product Management', 'Agile'].some(skill => job.skills.includes(skill))).length, icon: '🚀' },
  { name: 'Business', count: mockJobs.filter(job => ['Business Analysis', 'Requirements Gathering'].some(skill => job.skills.includes(skill))).length, icon: '💼' }
];

export default {
  jobs: mockJobs,
  companies: mockCompanies,
  stats: mockPlatformStats,
  categories: mockJobCategories,
  utils: {
    getMockJobsByCompany,
    getMockJobsBySkill,
    getMockJobsByLocation,
    getMockJobsByExperience,
    getMockFeaturedJobs,
    getMockRecentJobs,
    searchMockJobs
  }
};