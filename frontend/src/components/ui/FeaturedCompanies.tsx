'use client';

import { useState } from 'react';
import {
  Building2,
  MapPin,
  Users,
  Star,
  TrendingUp,
  Award,
  ExternalLink,
  ChevronRight,
  Heart,
  HeartHandshake,
  Verified,
  DollarSign,
  Clock,
  Globe,
  Briefcase
} from 'lucide-react';
import { getFeaturedCompanies } from '@/lib/mockData';

interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  industry: string;
  location: string;
  size: string;
  founded: number;
  rating: number;
  reviewCount: number;
  openJobs: number;
  verified: boolean;
  featured: boolean;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  benefits: string[];
  tags: string[];
  culture: {
    workLifeBalance: number;
    compensation: number;
    careerGrowth: number;
    diversity: number;
  };
  recentNews?: string;
  hiring: boolean;
}

interface FeaturedCompaniesProps {
  className?: string;
}

export default function FeaturedCompanies({ className }: FeaturedCompaniesProps) {
  const [followedCompanies, setFollowedCompanies] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Get featured companies from mock data
  const featuredCompanies = getFeaturedCompanies();

  const categories = [
    { value: 'all', label: 'All Companies', count: featuredCompanies.length },
    { value: 'technology', label: 'Technology', count: featuredCompanies.filter(c => c.industry === 'Technology').length },
    { value: 'featured', label: 'Featured', count: featuredCompanies.filter(c => c.featured).length },
    { value: 'hiring', label: 'Actively Hiring', count: featuredCompanies.filter(c => c.hiring).length }
  ];

  const toggleFollowCompany = (companyId: string) => {
    setFollowedCompanies(prev => {
      const newFollowed = new Set(prev);
      if (newFollowed.has(companyId)) {
        newFollowed.delete(companyId);
      } else {
        newFollowed.add(companyId);
      }
      return newFollowed;
    });
  };

  const formatSalary = (min: number, max: number) => {
    const formatNumber = (num: number) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
      return num.toString();
    };
    return `$${formatNumber(min)}-${formatNumber(max)}`;
  };

  const filteredCompanies = featuredCompanies.filter(company => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'technology') return company.industry === 'Technology';
    if (selectedCategory === 'featured') return company.featured;
    if (selectedCategory === 'hiring') return company.hiring;
    return true;
  });

  const CultureBar = ({ label, value }: { label: string; value: number }) => (
    <div className="flex items-center justify-between text-sm">
      <span className="text-neutral-600">{label}</span>
      <div className="flex items-center ml-2">
        <div className="w-20 bg-neutral-200 rounded-full h-1.5 mr-2">
          <div 
            className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(value / 5) * 100}%` }}
          />
        </div>
        <span className="text-neutral-700 font-medium w-6">{value}</span>
      </div>
    </div>
  );

  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="container-xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Award className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-3xl font-bold text-neutral-900">Featured Companies</h2>
          </div>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Discover verified companies with great culture, competitive benefits, and exciting opportunities
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>

        {/* Companies Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
        }`}>
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              className={`group bg-white rounded-xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                company.featured 
                  ? 'border-primary-200 shadow-lg bg-gradient-to-br from-white to-primary-25' 
                  : 'border-neutral-200 shadow-md'
              }`}
            >
              {/* Featured Badge */}
              {company.featured && (
                <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                  ⭐ Featured
                </div>
              )}

              <div className="p-6">
                {/* Company Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-neutral-100 rounded-xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                      <Building2 className="w-8 h-8 text-neutral-600" />
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                          {company.name}
                        </h3>
                        {company.verified && (
                          <Verified className="w-5 h-5 text-success-500 ml-2" fill="currentColor" />
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-primary-600 font-medium mr-3">
                          {company.industry}
                        </span>
                        {company.hiring && (
                          <span className="bg-success-100 text-success-700 text-xs px-2 py-1 rounded-full font-medium">
                            Hiring
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <button
                    onClick={() => toggleFollowCompany(company.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      followedCompanies.has(company.id)
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                    aria-label={followedCompanies.has(company.id) ? 'Unfollow company' : 'Follow company'}
                  >
                    {followedCompanies.has(company.id) ? (
                      <HeartHandshake className="w-5 h-5" />
                    ) : (
                      <Heart className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Company Info */}
                <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                  {company.description}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-neutral-600">
                    <Star className="w-4 h-4 text-warning-400 fill-current mr-2" />
                    <span className="font-medium">{company.rating}</span>
                    <span className="ml-1">({company.reviewCount.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span className="font-medium text-primary-700">
                      {company.openJobs.toLocaleString()} jobs
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{company.size}</span>
                  </div>
                </div>

                {/* Salary Range */}
                <div className="bg-success-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-success-600 mr-2" />
                      <span className="text-sm text-neutral-600">Salary Range</span>
                    </div>
                    <span className="font-semibold text-success-700">
                      {formatSalary(company.salaryRange.min, company.salaryRange.max)}
                    </span>
                  </div>
                </div>

                {/* Culture Metrics */}
                <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-neutral-900 mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-primary-600" />
                    Company Culture
                  </h4>
                  <div className="space-y-2">
                    <CultureBar label="Work-Life Balance" value={company.culture.workLifeBalance} />
                    <CultureBar label="Compensation" value={company.culture.compensation} />
                    <CultureBar label="Career Growth" value={company.culture.careerGrowth} />
                    <CultureBar label="Diversity" value={company.culture.diversity} />
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {company.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {company.tags.length > 3 && (
                    <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-xs">
                      +{company.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Recent News */}
                {company.recentNews && (
                  <div className="bg-info-50 border border-info-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-info-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                      <p className="text-sm text-info-800">{company.recentNews}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 btn-primary">
                    View Jobs ({company.openJobs})
                  </button>
                  <button className="btn-ghost flex items-center justify-center">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="btn-ghost btn-primary-lg">
            Explore All Companies
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 p-8 bg-gradient-to-r from-primary-50 to-success-50 rounded-2xl">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">Why Companies Choose Jobifies</h3>
            <p className="text-neutral-600">Join thousands of verified employers finding top talent</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Quality Candidates</h4>
              <p className="text-sm text-neutral-600">Access to pre-screened, qualified professionals</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-success-600" />
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Faster Hiring</h4>
              <p className="text-sm text-neutral-600">AI-powered matching reduces time-to-hire by 60%</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-warning-600" />
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Brand Visibility</h4>
              <p className="text-sm text-neutral-600">Showcase your company culture and attract top talent</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}