'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Building2,
  Briefcase,
  Award,
  Globe,
  Clock,
  Target,
  CheckCircle,
  Star,
  MapPin,
  DollarSign,
  Activity
} from 'lucide-react';
import { getPlatformStats } from '@/lib/mockData';

interface PlatformStat {
  id: string;
  icon: React.ElementType;
  value: number;
  label: string;
  description: string;
  suffix?: string;
  prefix?: string;
  color: string;
  bgColor: string;
  growth?: number;
  animated?: boolean;
}

interface TrustedCompany {
  id: string;
  name: string;
  logo: string;
  industry: string;
  jobCount: number;
  rating: number;
}

interface PlatformStatsProps {
  className?: string;
}


// Mock trusted companies
const trustedCompanies: TrustedCompany[] = [
  {
    id: '1',
    name: 'Google',
    logo: '/api/placeholder/60/60',
    industry: 'Technology',
    jobCount: 847,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Microsoft',
    logo: '/api/placeholder/60/60',
    industry: 'Technology',
    jobCount: 623,
    rating: 4.7
  },
  {
    id: '3',
    name: 'Apple',
    logo: '/api/placeholder/60/60',
    industry: 'Technology',
    jobCount: 456,
    rating: 4.6
  },
  {
    id: '4',
    name: 'Amazon',
    logo: '/api/placeholder/60/60',
    industry: 'E-commerce',
    jobCount: 1234,
    rating: 4.2
  },
  {
    id: '5',
    name: 'Meta',
    logo: '/api/placeholder/60/60',
    industry: 'Social Media',
    jobCount: 389,
    rating: 4.3
  },
  {
    id: '6',
    name: 'Netflix',
    logo: '/api/placeholder/60/60',
    industry: 'Entertainment',
    jobCount: 178,
    rating: 4.4
  },
  {
    id: '7',
    name: 'Spotify',
    logo: '/api/placeholder/60/60',
    industry: 'Music',
    jobCount: 134,
    rating: 4.5
  },
  {
    id: '8',
    name: 'Uber',
    logo: '/api/placeholder/60/60',
    industry: 'Transportation',
    jobCount: 267,
    rating: 4.1
  },
  {
    id: '9',
    name: 'Airbnb',
    logo: '/api/placeholder/60/60',
    industry: 'Travel',
    jobCount: 156,
    rating: 4.6
  },
  {
    id: '10',
    name: 'Tesla',
    logo: '/api/placeholder/60/60',
    industry: 'Automotive',
    jobCount: 445,
    rating: 4.2
  }
];

export default function PlatformStats({ className }: PlatformStatsProps) {
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});
  const [isInView, setIsInView] = useState(false);
  
  // Get platform stats from mock data
  const stats = getPlatformStats();
  
  // Create dynamic platform stats
  const platformStats: PlatformStat[] = [
    {
      id: '1',
      icon: Briefcase,
      value: stats.totalJobs,
      label: 'Active Jobs',
      description: 'Live job postings from verified companies',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
      growth: 15,
      animated: true
    },
    {
      id: '2',
      icon: Building2,
      value: stats.totalCompanies,
      label: 'Trusted Companies',
      description: 'Verified employers actively hiring',
      color: 'text-success-600',
      bgColor: 'bg-success-100',
      growth: 22,
      animated: true
    },
    {
      id: '3',
      icon: Users,
      value: stats.totalJobSeekers,
      label: 'Job Seekers',
      description: 'Professionals using our platform',
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
      growth: 18,
      animated: true
    },
    {
      id: '4',
      icon: CheckCircle,
      value: stats.successfulPlacements,
      label: 'Successful Hires',
      description: 'Professionals placed in great jobs',
      color: 'text-success-600',
      bgColor: 'bg-success-100',
      growth: 28,
      animated: true
    },
    {
      id: '5',
      icon: DollarSign,
      value: stats.averageSalary,
      label: 'Average Salary',
      description: 'Annual compensation across all roles',
      prefix: '$',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
      growth: 12,
      animated: true
    },
    {
      id: '6',
      icon: Globe,
      value: stats.remoteJobsPercent,
      label: 'Remote Jobs',
      description: 'Positions offering remote work options',
      suffix: '%',
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
      growth: 35,
      animated: true
    }
  ];

  // Intersection Observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('platform-stats');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [isInView]);

  // Animate counters
  useEffect(() => {
    if (!isInView) return;

    const animateValue = (stat: PlatformStat) => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = stat.value / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(Math.ceil(increment * step), stat.value);
        
        setAnimatedValues(prev => ({
          ...prev,
          [stat.id]: current
        }));

        if (step >= steps) {
          clearInterval(timer);
        }
      }, duration / steps);

      return timer;
    };

    const timers = platformStats
      .filter(stat => stat.animated)
      .map(stat => animateValue(stat));

    return () => {
      timers.forEach(timer => clearInterval(timer));
    };
  }, [isInView]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toLocaleString();
  };

  const StatCard = ({ stat }: { stat: PlatformStat }) => {
    const Icon = stat.icon;
    const displayValue = stat.animated && isInView 
      ? (animatedValues[stat.id] || 0) 
      : stat.value;

    return (
      <div className="group bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <Icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          
          {stat.growth && (
            <div className={`flex items-center text-sm font-medium ${
              stat.growth > 0 ? 'text-success-600' : 'text-primary-600'
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${stat.growth < 0 ? 'rotate-180' : ''}`} />
              <span>{Math.abs(stat.growth)}%</span>
            </div>
          )}
        </div>

        <div className="mb-2">
          <div className="text-2xl font-bold text-neutral-900">
            {stat.prefix}{formatNumber(displayValue)}{stat.suffix}
          </div>
          <div className="text-sm font-medium text-neutral-800">
            {stat.label}
          </div>
        </div>

        <p className="text-sm text-neutral-600">
          {stat.description}
        </p>
      </div>
    );
  };

  return (
    <section id="platform-stats" className={`py-16 bg-white ${className}`}>
      <div className="container-xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-3xl font-bold text-neutral-900">Platform at a Glance</h2>
          </div>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Real-time insights into our thriving job marketplace and growing community
          </p>
        </div>

        {/* Main Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {platformStats.map(stat => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        {/* Trusted Companies Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">
              Trusted by Leading Companies
            </h3>
            <p className="text-neutral-600">
              Join thousands of verified employers finding top talent on Jobifies
            </p>
          </div>

          {/* Company Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
            {trustedCompanies.slice(0, 10).map((company) => (
              <div 
                key={company.id} 
                className="group flex flex-col items-center p-4 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="w-12 h-12 bg-neutral-200 rounded-lg mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-neutral-800 text-center">
                  {company.name}
                </span>
                <div className="flex items-center mt-1">
                  <Star className="w-3 h-3 text-warning-400 fill-current" />
                  <span className="text-xs text-neutral-600 ml-1">{company.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Highlights */}
        <div className="bg-gradient-to-br from-primary-50 to-success-50 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">
              Our Achievements
            </h3>
            <p className="text-neutral-600">
              Milestones that showcase our commitment to connecting talent with opportunity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-lg font-semibold text-neutral-900 mb-2">
                #1 Job Platform
              </h4>
              <p className="text-sm text-neutral-600">
                Ranked highest in user satisfaction and job placement success
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-success-600" />
              </div>
              <h4 className="text-lg font-semibold text-neutral-900 mb-2">
                500M+ Matches Made
              </h4>
              <p className="text-sm text-neutral-600">
                AI-powered connections between job seekers and employers
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-warning-600" />
              </div>
              <h4 className="text-lg font-semibold text-neutral-900 mb-2">
                Global Reach
              </h4>
              <p className="text-sm text-neutral-600">
                Connecting talent across 45 countries and 6 continents
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-neutral-900 flex items-center">
              <Activity className="w-5 h-5 text-primary-600 mr-2" />
              Live Activity
            </h3>
            <div className="flex items-center text-sm text-success-600">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-2 animate-pulse" />
              <span>Live Updates</span>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { action: 'New job posted', company: 'Google', role: 'Software Engineer', time: '2 min ago', icon: Briefcase, color: 'text-primary-600' },
              { action: 'Successful hire', company: 'Microsoft', role: 'Product Manager', time: '5 min ago', icon: CheckCircle, color: 'text-success-600' },
              { action: 'Company joined', company: 'Stripe', role: 'Tech Startup', time: '8 min ago', icon: Building2, color: 'text-warning-600' },
              { action: 'New user registered', company: 'SF Bay Area', role: 'Data Scientist', time: '12 min ago', icon: Users, color: 'text-info-600' }
            ].map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center">
                    <Icon className={`w-4 h-4 ${activity.color} mr-3`} />
                    <div>
                      <span className="text-sm font-medium text-neutral-900">
                        {activity.action}
                      </span>
                      <span className="text-sm text-neutral-600 ml-1">
                        • {activity.company} - {activity.role}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-500">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}