'use client';

import { useState } from 'react';
import {
  Code,
  Stethoscope,
  TrendingUp,
  Megaphone,
  PaintBucket,
  Shield,
  Users,
  Wrench,
  GraduationCap,
  Truck,
  ChefHat,
  Building2,
  ArrowRight,
  Search,
  Filter,
  ChevronDown,
  Star,
  MapPin,
  Clock
} from 'lucide-react';

interface JobCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  jobCount: number;
  averageSalary: number;
  growth: number;
  popular: boolean;
  subcategories: string[];
  topCompanies: string[];
  skills: string[];
  color: string;
  bgColor: string;
}

interface JobCategoriesProps {
  className?: string;
}

// Mock job categories data
const jobCategories: JobCategory[] = [
  {
    id: '1',
    name: 'Technology',
    icon: Code,
    description: 'Software development, engineering, and IT roles',
    jobCount: 12547,
    averageSalary: 95000,
    growth: 22,
    popular: true,
    subcategories: ['Software Engineering', 'Data Science', 'DevOps', 'Cybersecurity', 'Product Management'],
    topCompanies: ['Google', 'Microsoft', 'Apple', 'Meta', 'Amazon'],
    skills: ['JavaScript', 'Python', 'React', 'AWS', 'Docker'],
    color: 'text-primary-600',
    bgColor: 'bg-primary-100'
  },
  {
    id: '2',
    name: 'Healthcare',
    icon: Stethoscope,
    description: 'Medical professionals, nursing, and healthcare administration',
    jobCount: 8934,
    averageSalary: 78000,
    growth: 18,
    popular: true,
    subcategories: ['Nursing', 'Medical Assistant', 'Healthcare Admin', 'Pharmacy', 'Physical Therapy'],
    topCompanies: ['Kaiser Permanente', 'Mayo Clinic', 'Cleveland Clinic', 'Johns Hopkins', 'Anthem'],
    skills: ['Patient Care', 'Medical Records', 'Healthcare Software', 'Clinical Research', 'HIPAA'],
    color: 'text-success-600',
    bgColor: 'bg-success-100'
  },
  {
    id: '3',
    name: 'Finance',
    icon: TrendingUp,
    description: 'Banking, investment, accounting, and financial services',
    jobCount: 6789,
    averageSalary: 87000,
    growth: 12,
    popular: true,
    subcategories: ['Investment Banking', 'Financial Analysis', 'Accounting', 'Risk Management', 'Insurance'],
    topCompanies: ['JPMorgan Chase', 'Goldman Sachs', 'Bank of America', 'Wells Fargo', 'Citigroup'],
    skills: ['Financial Modeling', 'Excel', 'SQL', 'Risk Analysis', 'Compliance'],
    color: 'text-warning-600',
    bgColor: 'bg-warning-100'
  },
  {
    id: '4',
    name: 'Marketing',
    icon: Megaphone,
    description: 'Digital marketing, advertising, and brand management',
    jobCount: 5423,
    averageSalary: 65000,
    growth: 15,
    popular: true,
    subcategories: ['Digital Marketing', 'Content Marketing', 'Social Media', 'SEO/SEM', 'Brand Management'],
    topCompanies: ['Facebook', 'Google', 'Adobe', 'Salesforce', 'HubSpot'],
    skills: ['Google Analytics', 'Content Creation', 'Social Media', 'Adobe Creative', 'Marketing Automation'],
    color: 'text-info-600',
    bgColor: 'bg-info-100'
  },
  {
    id: '5',
    name: 'Design',
    icon: PaintBucket,
    description: 'UX/UI design, graphic design, and creative roles',
    jobCount: 3876,
    averageSalary: 72000,
    growth: 20,
    popular: false,
    subcategories: ['UX/UI Design', 'Graphic Design', 'Product Design', 'Web Design', 'Brand Design'],
    topCompanies: ['Adobe', 'Figma', 'Apple', 'Airbnb', 'Spotify'],
    skills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Design Systems'],
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  },
  {
    id: '6',
    name: 'Sales',
    icon: Users,
    description: 'Sales representatives, account management, and business development',
    jobCount: 7234,
    averageSalary: 68000,
    growth: 8,
    popular: false,
    subcategories: ['Sales Representative', 'Account Management', 'Business Development', 'Sales Engineering', 'Inside Sales'],
    topCompanies: ['Salesforce', 'Oracle', 'Microsoft', 'IBM', 'Cisco'],
    skills: ['CRM Software', 'Lead Generation', 'Negotiation', 'Sales Analytics', 'Customer Relationship'],
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    id: '7',
    name: 'Education',
    icon: GraduationCap,
    description: 'Teaching, training, and educational administration',
    jobCount: 4567,
    averageSalary: 52000,
    growth: 5,
    popular: false,
    subcategories: ['K-12 Teaching', 'Higher Education', 'Corporate Training', 'Curriculum Development', 'Educational Technology'],
    topCompanies: ['Pearson', 'McGraw Hill', 'Khan Academy', 'Coursera', 'edX'],
    skills: ['Curriculum Development', 'Classroom Management', 'Educational Technology', 'Assessment', 'Learning Management'],
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  {
    id: '8',
    name: 'Operations',
    icon: Wrench,
    description: 'Operations management, logistics, and supply chain',
    jobCount: 5689,
    averageSalary: 75000,
    growth: 10,
    popular: false,
    subcategories: ['Operations Management', 'Supply Chain', 'Logistics', 'Project Management', 'Quality Assurance'],
    topCompanies: ['Amazon', 'UPS', 'FedEx', 'Walmart', 'Target'],
    skills: ['Project Management', 'Process Improvement', 'Supply Chain Management', 'Data Analysis', 'Logistics'],
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  }
];

export default function JobCategories({ className }: JobCategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = jobCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.subcategories.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const popularCategories = jobCategories.filter(cat => cat.popular);
  const displayedCategories = showAllCategories ? filteredCategories : popularCategories;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const formatSalary = (salary: number) => {
    return `$${(salary / 1000).toFixed(0)}k avg`;
  };

  const CategoryCard = ({ category, featured = false }: { category: JobCategory; featured?: boolean }) => {
    const Icon = category.icon;
    
    return (
      <div
        className={`group relative bg-white rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-2 ${
          featured 
            ? 'border-primary-200 shadow-lg bg-gradient-to-br from-white to-primary-25' 
            : 'border-neutral-200 shadow-md hover:border-primary-300'
        }`}
        onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
      >
        {/* Popular Badge */}
        {category.popular && (
          <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs px-3 py-1 rounded-full font-medium">
            Popular
          </div>
        )}

        <div className="p-6">
          {/* Category Header */}
          <div className="flex items-center justify-between mb-4">
            <div className={`w-14 h-14 ${category.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <Icon className={`w-7 h-7 ${category.color}`} />
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-neutral-900">
                {formatNumber(category.jobCount)}
              </div>
              <div className="text-sm text-neutral-600">jobs</div>
            </div>
          </div>

          {/* Category Info */}
          <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
            {category.name}
          </h3>
          <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
            {category.description}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-success-600">
                {formatSalary(category.averageSalary)}
              </div>
              <div className="text-xs text-neutral-600">salary</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-success-500 mr-1" />
                <span className="text-lg font-bold text-success-600">+{category.growth}%</span>
              </div>
              <div className="text-xs text-neutral-600">growth</div>
            </div>
          </div>

          {/* Top Skills Preview */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {category.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 ${category.bgColor} ${category.color} rounded-md text-xs font-medium`}
                >
                  {skill}
                </span>
              ))}
              {category.skills.length > 3 && (
                <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-xs">
                  +{category.skills.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Expand/Collapse Indicator */}
          <div className="flex items-center justify-between">
            <button className="text-primary-600 font-medium text-sm hover:text-primary-700 transition-colors">
              View Jobs
            </button>
            <ChevronDown 
              className={`w-5 h-5 text-neutral-400 transition-transform ${
                selectedCategory === category.id ? 'rotate-180' : ''
              }`} 
            />
          </div>
        </div>

        {/* Expanded Content */}
        {selectedCategory === category.id && (
          <div className="border-t border-neutral-200 p-6 bg-neutral-50 rounded-b-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subcategories */}
              <div>
                <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                  <Building2 className="w-4 h-4 mr-2 text-primary-600" />
                  Job Types
                </h4>
                <div className="space-y-2">
                  {category.subcategories.map((sub, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-neutral-700">{sub}</span>
                      <span className="text-xs text-neutral-500">
                        {Math.floor(category.jobCount / category.subcategories.length * (Math.random() * 0.5 + 0.75))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Companies */}
              <div>
                <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                  <Star className="w-4 h-4 mr-2 text-primary-600" />
                  Top Employers
                </h4>
                <div className="space-y-2">
                  {category.topCompanies.map((company, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-6 h-6 bg-neutral-200 rounded mr-2" />
                      <span className="text-sm text-neutral-700">{company}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-neutral-200">
              <button className="flex-1 btn-primary">
                Browse {category.name} Jobs
              </button>
              <button className="btn-ghost">
                Set Alert
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className={`py-16 bg-gradient-to-br from-neutral-50 to-primary-25 ${className}`}>
      <div className="container-xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Explore Job Categories
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Discover opportunities across various industries and find your perfect career path
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories or job types..."
              className="form-input pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                showAllCategories
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-primary-300'
              }`}
            >
              <Filter className="w-4 h-4 mr-2 inline" />
              {showAllCategories ? 'Show Popular' : 'Show All'}
            </button>
          </div>
        </div>

        {/* Popular Categories Quick Access */}
        {!showAllCategories && !searchQuery && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
              <Star className="w-5 h-5 text-primary-600 mr-2" />
              Most Popular Categories
            </h3>
            <div className="flex flex-wrap gap-3">
              {popularCategories.map(category => (
                <button
                  key={category.id}
                  className="px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-25 transition-colors text-sm font-medium"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <category.icon className="w-4 h-4 inline mr-2" />
                  {category.name} ({formatNumber(category.jobCount)})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
        }`}>
          {displayedCategories.map((category) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              featured={category.popular}
            />
          ))}
        </div>

        {/* View More/Less Button */}
        {!searchQuery && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="btn-ghost btn-primary-lg"
            >
              {showAllCategories ? 'Show Popular Categories' : 'View All Categories'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}

        {/* Category Insights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Growing Industries</h3>
            <p className="text-neutral-600">
              Technology and healthcare sectors show the highest job growth rates
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-success-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Remote Opportunities</h3>
            <p className="text-neutral-600">
              Over 60% of jobs in design and technology offer remote work options
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-warning-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Hiring Speed</h3>
            <p className="text-neutral-600">
              Most positions are filled within 2-4 weeks of posting across all categories
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}