'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  MapPin, 
  Building2, 
  Clock, 
  DollarSign,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Star,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { mockJobs, getTrendingJobs } from '@/lib/mockData';

interface TrendingJobsProps {
  className?: string;
}

export default function TrendingJobs({ className }: TrendingJobsProps) {
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [visibleJobs, setVisibleJobs] = useState(3);
  
  // Get trending jobs from mock data
  const trendingJobs = getTrendingJobs();

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % Math.ceil(trendingJobs.length / visibleJobs));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, visibleJobs]);

  // Handle responsive visible jobs
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleJobs(3);
      } else if (window.innerWidth >= 768) {
        setVisibleJobs(2);
      } else {
        setVisibleJobs(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(jobId)) {
        newSaved.delete(jobId);
      } else {
        newSaved.add(jobId);
      }
      return newSaved;
    });
  };

  const formatSalary = (min: number, max: number, currency: string) => {
    const formatNumber = (num: number) => {
      if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
      return num.toString();
    };
    return `$${formatNumber(min)}-${formatNumber(max)}`;
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % Math.ceil(trendingJobs.length / visibleJobs));
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => 
      prev === 0 ? Math.ceil(trendingJobs.length / visibleJobs) - 1 : prev - 1
    );
    setIsAutoPlaying(false);
  };

  const getVisibleJobs = () => {
    const start = currentIndex * visibleJobs;
    return trendingJobs.slice(start, start + visibleJobs);
  };

  return (
    <section className={`py-16 bg-gradient-to-br from-neutral-50 to-primary-25 ${className}`}>
      <div className="container-xl">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center mb-2">
              <TrendingUp className="w-6 h-6 text-primary-600 mr-2" />
              <h2 className="text-3xl font-bold text-neutral-900">Trending Jobs</h2>
            </div>
            <p className="text-lg text-neutral-600">
              Hot job opportunities that are getting lots of attention right now
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors"
              aria-label="Previous jobs"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors"
              aria-label="Next jobs"
            >
              <ChevronRight className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Jobs Carousel */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {Array.from({ length: Math.ceil(trendingJobs.length / visibleJobs) }).map((_, slideIndex) => (
              <div 
                key={slideIndex}
                className="w-full flex-shrink-0"
              >
                <div className={`grid gap-6 ${
                  visibleJobs === 3 ? 'grid-cols-1 lg:grid-cols-3' :
                  visibleJobs === 2 ? 'grid-cols-1 md:grid-cols-2' :
                  'grid-cols-1'
                }`}>
                  {trendingJobs
                    .slice(slideIndex * visibleJobs, (slideIndex + 1) * visibleJobs)
                    .map((job) => (
                    <div
                      key={job.id}
                      className={`group relative bg-white rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                        job.featured 
                          ? 'border-primary-200 shadow-md bg-gradient-to-br from-white to-primary-25' 
                          : 'border-neutral-200 shadow-sm'
                      }`}
                    >
                      {/* Featured Badge */}
                      {job.featured && (
                        <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Featured
                        </div>
                      )}

                      {/* Urgent Badge */}
                      {job.urgent && (
                        <div className="absolute top-4 left-4 bg-error-100 text-error-700 text-xs px-2 py-1 rounded-full font-medium">
                          Urgent
                        </div>
                      )}

                      <div className="p-6">
                        {/* Company Info */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mr-3">
                              <Building2 className="w-6 h-6 text-neutral-600" />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-semibold text-neutral-900">{job.company.name}</h3>
                                {job.company.verified && (
                                  <div className="ml-2 w-4 h-4 bg-success-500 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center mt-1">
                                <Star className="w-4 h-4 text-warning-400 fill-current" />
                                <span className="text-sm text-neutral-600 ml-1">
                                  {job.company.rating}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Save Button */}
                          <button
                            onClick={() => toggleSaveJob(job.id)}
                            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                            aria-label={savedJobs.has(job.id) ? 'Unsave job' : 'Save job'}
                          >
                            {savedJobs.has(job.id) ? (
                              <BookmarkCheck className="w-5 h-5 text-primary-600" />
                            ) : (
                              <Bookmark className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600" />
                            )}
                          </button>
                        </div>

                        {/* Job Title */}
                        <h4 className="text-xl font-semibold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors">
                          {job.title}
                        </h4>

                        {/* Job Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-neutral-600">
                            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="text-sm">{job.location}</span>
                          </div>
                          <div className="flex items-center text-neutral-600">
                            <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="text-sm font-medium text-success-700">
                              {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                            </span>
                          </div>
                          <div className="flex items-center text-neutral-600">
                            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="text-sm">{job.type} • {job.posted}</span>
                          </div>
                        </div>

                        {/* Match Score */}
                        {job.matchScore && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-neutral-600">Match Score</span>
                              <span className="font-semibold text-success-700">{job.matchScore}%</span>
                            </div>
                            <div className="w-full bg-neutral-200 rounded-full h-2">
                              <div 
                                className="bg-success-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${job.matchScore}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Skills */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {job.skills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 3 && (
                              <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-xs">
                                +{job.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Applicants */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center text-neutral-600">
                            <Users className="w-4 h-4 mr-2" />
                            <span className="text-sm">{job.applicants} applicants</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button className="flex-1 btn-primary">
                            Apply Now
                          </button>
                          <button className="btn-ghost flex items-center justify-center">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(trendingJobs.length / visibleJobs) }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex 
                    ? 'bg-primary-600' 
                    : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All Jobs Button */}
        <div className="text-center mt-8">
          <button className="btn-ghost btn-primary-lg">
            View All Trending Jobs
            <TrendingUp className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}