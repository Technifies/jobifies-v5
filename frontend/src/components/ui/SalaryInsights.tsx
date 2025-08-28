'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  MapPin,
  Briefcase,
  Users,
  Award,
  ChevronDown,
  ChevronUp,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Info
} from 'lucide-react';

interface SalaryData {
  role: string;
  location: string;
  experience: string;
  minSalary: number;
  maxSalary: number;
  averageSalary: number;
  jobCount: number;
  growth: number;
  industry: string;
}

interface LocationSalary {
  location: string;
  averageSalary: number;
  jobCount: number;
  costOfLiving: number;
  adjustedSalary: number;
}

interface TrendData {
  month: string;
  salary: number;
}

interface SalaryInsightsProps {
  className?: string;
}

// Mock salary data
const salaryData: SalaryData[] = [
  {
    role: 'Software Engineer',
    location: 'San Francisco, CA',
    experience: 'Senior',
    minSalary: 140000,
    maxSalary: 200000,
    averageSalary: 170000,
    jobCount: 1250,
    growth: 15,
    industry: 'Technology'
  },
  {
    role: 'Product Manager',
    location: 'New York, NY',
    experience: 'Senior',
    minSalary: 120000,
    maxSalary: 180000,
    averageSalary: 150000,
    jobCount: 890,
    growth: 12,
    industry: 'Technology'
  },
  {
    role: 'Data Scientist',
    location: 'Seattle, WA',
    experience: 'Mid',
    minSalary: 110000,
    maxSalary: 160000,
    averageSalary: 135000,
    jobCount: 670,
    growth: 18,
    industry: 'Technology'
  },
  {
    role: 'UX Designer',
    location: 'Los Angeles, CA',
    experience: 'Mid',
    minSalary: 85000,
    maxSalary: 130000,
    averageSalary: 107000,
    jobCount: 540,
    growth: 20,
    industry: 'Design'
  },
  {
    role: 'Marketing Manager',
    location: 'Chicago, IL',
    experience: 'Senior',
    minSalary: 75000,
    maxSalary: 120000,
    averageSalary: 97000,
    jobCount: 720,
    growth: 8,
    industry: 'Marketing'
  }
];

const locationSalaries: LocationSalary[] = [
  {
    location: 'San Francisco, CA',
    averageSalary: 165000,
    jobCount: 12450,
    costOfLiving: 180,
    adjustedSalary: 91700
  },
  {
    location: 'New York, NY',
    averageSalary: 145000,
    jobCount: 18230,
    costOfLiving: 168,
    adjustedSalary: 86300
  },
  {
    location: 'Seattle, WA',
    averageSalary: 135000,
    jobCount: 8920,
    costOfLiving: 142,
    adjustedSalary: 95100
  },
  {
    location: 'Austin, TX',
    averageSalary: 115000,
    jobCount: 5670,
    costOfLiving: 103,
    adjustedSalary: 111700
  },
  {
    location: 'Denver, CO',
    averageSalary: 108000,
    jobCount: 4230,
    costOfLiving: 110,
    adjustedSalary: 98200
  }
];

const salaryTrends: TrendData[] = [
  { month: 'Jan 2024', salary: 92000 },
  { month: 'Mar 2024', salary: 94000 },
  { month: 'Jun 2024', salary: 97000 },
  { month: 'Sep 2024', salary: 99000 },
  { month: 'Dec 2024', salary: 102000 },
  { month: 'Jan 2025', salary: 105000 }
];

export default function SalaryInsights({ className }: SalaryInsightsProps) {
  const [selectedView, setSelectedView] = useState<'roles' | 'locations' | 'trends'>('roles');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'salary' | 'growth' | 'jobs'>('salary');

  const experienceLevels = ['all', 'Entry', 'Mid', 'Senior', 'Executive'];
  const industries = ['all', 'Technology', 'Design', 'Marketing', 'Finance', 'Healthcare'];

  const formatSalary = (salary: number) => {
    if (salary >= 1000000) return `$${(salary / 1000000).toFixed(1)}M`;
    if (salary >= 1000) return `$${Math.round(salary / 1000)}k`;
    return `$${salary.toLocaleString()}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const filteredSalaryData = salaryData.filter(data => {
    if (selectedExperience !== 'all' && data.experience !== selectedExperience) return false;
    if (selectedIndustry !== 'all' && data.industry !== selectedIndustry) return false;
    return true;
  });

  const sortedSalaryData = [...filteredSalaryData].sort((a, b) => {
    switch (sortBy) {
      case 'salary': return b.averageSalary - a.averageSalary;
      case 'growth': return b.growth - a.growth;
      case 'jobs': return b.jobCount - a.jobCount;
      default: return 0;
    }
  });

  const SalaryBar = ({ current, max, color = 'bg-primary-500' }: { current: number; max: number; color?: string }) => (
    <div className="w-full bg-neutral-200 rounded-full h-2">
      <div 
        className={`${color} h-2 rounded-full transition-all duration-1000 ease-out`}
        style={{ width: `${(current / max) * 100}%` }}
      />
    </div>
  );

  const RolesView = () => {
    const maxSalary = Math.max(...sortedSalaryData.map(d => d.averageSalary));
    
    return (
      <div className="space-y-4">
        {sortedSalaryData.map((data, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-neutral-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{data.role}</h3>
                <div className="flex items-center text-sm text-neutral-600 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{data.location}</span>
                  <span className="ml-4 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                    {data.experience} Level
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-success-600">
                  {formatSalary(data.averageSalary)}
                </div>
                <div className="text-sm text-neutral-600">average</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-neutral-600 mb-2">
                <span>{formatSalary(data.minSalary)}</span>
                <span>{formatSalary(data.maxSalary)}</span>
              </div>
              <SalaryBar current={data.averageSalary} max={maxSalary} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-neutral-900">
                  {formatNumber(data.jobCount)}
                </div>
                <div className="text-xs text-neutral-600">open jobs</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-success-500 mr-1" />
                  <span className="text-lg font-semibold text-success-600">+{data.growth}%</span>
                </div>
                <div className="text-xs text-neutral-600">growth</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-primary-600">
                  {data.industry}
                </div>
                <div className="text-xs text-neutral-600">industry</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const LocationsView = () => {
    const maxSalary = Math.max(...locationSalaries.map(l => l.averageSalary));
    const maxAdjusted = Math.max(...locationSalaries.map(l => l.adjustedSalary));

    return (
      <div className="space-y-4">
        {locationSalaries.map((location, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-neutral-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
                  <MapPin className="w-5 h-5 text-primary-600 mr-2" />
                  {location.location}
                </h3>
                <div className="text-sm text-neutral-600 mt-1">
                  {formatNumber(location.jobCount)} available positions
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-success-600">
                  {formatSalary(location.averageSalary)}
                </div>
                <div className="text-sm text-neutral-600">average salary</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-neutral-700">Nominal Salary</span>
                  <span className="text-sm text-neutral-600">{formatSalary(location.averageSalary)}</span>
                </div>
                <SalaryBar current={location.averageSalary} max={maxSalary} color="bg-primary-500" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-neutral-700">
                    Cost-Adjusted
                    <Info className="w-3 h-3 text-neutral-400 ml-1 inline" />
                  </span>
                  <span className="text-sm text-neutral-600">{formatSalary(location.adjustedSalary)}</span>
                </div>
                <SalaryBar current={location.adjustedSalary} max={maxAdjusted} color="bg-success-500" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Cost of Living Index</span>
                <span className="text-sm font-medium text-warning-600">{location.costOfLiving}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const TrendsView = () => (
    <div className="bg-white p-6 rounded-xl border border-neutral-200">
      <h3 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center">
        <LineChart className="w-5 h-5 text-primary-600 mr-2" />
        Salary Trends Over Time
      </h3>
      
      <div className="space-y-4">
        {salaryTrends.map((trend, index) => {
          const prevSalary = index > 0 ? salaryTrends[index - 1].salary : trend.salary;
          const change = trend.salary - prevSalary;
          const changePercent = prevSalary ? ((change / prevSalary) * 100) : 0;
          
          return (
            <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary-500 rounded-full mr-4" />
                <span className="font-medium text-neutral-900">{trend.month}</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-semibold text-success-600 mr-4">
                  {formatSalary(trend.salary)}
                </span>
                {index > 0 && (
                  <div className={`flex items-center text-sm ${
                    change >= 0 ? 'text-success-600' : 'text-error-600'
                  }`}>
                    <TrendingUp className={`w-4 h-4 mr-1 ${change < 0 ? 'rotate-180' : ''}`} />
                    <span>{changePercent.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-primary-50 rounded-lg">
        <p className="text-sm text-primary-800">
          <strong>Insight:</strong> Salaries have increased by an average of 14% over the past year, 
          with the strongest growth in tech and healthcare sectors.
        </p>
      </div>
    </div>
  );

  return (
    <section className={`py-16 bg-gradient-to-br from-success-25 to-primary-25 ${className}`}>
      <div className="container-xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6 text-success-600 mr-2" />
            <h2 className="text-3xl font-bold text-neutral-900">Salary Insights</h2>
          </div>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Discover competitive salary ranges, market trends, and location-based compensation data
          </p>
        </div>

        {/* View Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedView('roles')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedView === 'roles'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Briefcase className="w-4 h-4 mr-2 inline" />
            By Roles
          </button>
          <button
            onClick={() => setSelectedView('locations')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedView === 'locations'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <MapPin className="w-4 h-4 mr-2 inline" />
            By Locations
          </button>
          <button
            onClick={() => setSelectedView('trends')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedView === 'trends'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-2 inline" />
            Market Trends
          </button>
        </div>

        {/* Filters */}
        {selectedView === 'roles' && (
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-600" />
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="form-input py-2 text-sm"
              >
                {experienceLevels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Experience' : `${level} Level`}
                  </option>
                ))}
              </select>
            </div>
            
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="form-input py-2 text-sm"
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry === 'all' ? 'All Industries' : industry}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="form-input py-2 text-sm"
            >
              <option value="salary">Sort by Salary</option>
              <option value="growth">Sort by Growth</option>
              <option value="jobs">Sort by Job Count</option>
            </select>
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {selectedView === 'roles' && <RolesView />}
          {selectedView === 'locations' && <LocationsView />}
          {selectedView === 'trends' && <TrendsView />}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-success-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">14% Growth</h3>
            <p className="text-neutral-600">Average salary increase across all roles this year</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">50k+ Jobs</h3>
            <p className="text-neutral-600">Active positions with transparent salary ranges</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-warning-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Top 10%</h3>
            <p className="text-neutral-600">Salary data accuracy compared to market reports</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              Get Personalized Salary Insights
            </h3>
            <p className="text-neutral-600 mb-6">
              Enter your role and location to see detailed compensation analysis and market positioning
            </p>
            <button className="btn-primary btn-primary-lg">
              Calculate My Market Value
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}