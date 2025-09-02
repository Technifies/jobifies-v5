'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Briefcase, DollarSign, Grid, List, Loader2 } from 'lucide-react';

import { Job, JobFilters, PaginatedResponse } from '@/types/job';
import { jobService } from '@/lib/services/jobService';
import JobCard from './JobCard';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface JobListingsProps {
  initialFilters?: JobFilters;
  showFilters?: boolean;
  className?: string;
}

const JobListings: React.FC<JobListingsProps> = ({
  initialFilters = {},
  showFilters = true,
  className = '',
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState<JobFilters>(initialFilters);
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Load jobs
  const loadJobs = async (page: number = 1, append: boolean = false) => {
    try {
      if (page === 1 && !append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await jobService.getJobs(filters, {
        page,
        limit: pagination.limit,
        sortBy,
        sortOrder,
      });

      if (append && page > 1) {
        setJobs(prev => [...prev, ...response.data]);
      } else {
        setJobs(response.data);
      }

      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters = { ...filters, search: searchTerm };
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle filter change
  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle load more
  const handleLoadMore = () => {
    if (pagination.hasNextPage && !loadingMore) {
      loadJobs(pagination.page + 1, true);
    }
  };

  // Handle sort change
  const handleSortChange = (newSortBy: string, newSortOrder?: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    if (newSortOrder) setSortOrder(newSortOrder);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle job save toggle
  const handleJobSaveToggle = (jobId: string, saved: boolean) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, user_saved: saved } : job
    ));
  };

  // Load jobs when filters change
  useEffect(() => {
    loadJobs(1, false);
  }, [filters, sortBy, sortOrder]);

  // Clear filters
  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Search and Filters Header */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <Button type="submit" className="px-6">
                Search
              </Button>
            </div>
          </form>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Location"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-neutral-500" />
              <select
                value={filters.jobType?.[0] || ''}
                onChange={(e) => handleFilterChange('jobType', e.target.value ? [e.target.value] : undefined)}
                className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Job Type</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-neutral-500" />
              <input
                type="number"
                placeholder="Min Salary"
                value={filters.salaryMin || ''}
                onChange={(e) => handleFilterChange('salaryMin', e.target.value ? parseInt(e.target.value) : undefined)}
                className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-1 focus:ring-primary-500 w-24"
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.remote || false}
                onChange={(e) => handleFilterChange('remote', e.target.checked || undefined)}
                className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">Remote</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-neutral-600"
              >
                Clear Filters
              </Button>

              <div className="text-sm text-neutral-600">
                {pagination.totalCount} jobs found
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-') as [string, 'asc' | 'desc'];
                  handleSortChange(newSortBy, newSortOrder);
                }}
                className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:ring-1 focus:ring-primary-500"
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="salary_max-desc">Salary: High to Low</option>
                <option value="salary_max-asc">Salary: Low to High</option>
                <option value="title-asc">Title: A to Z</option>
                <option value="title-desc">Title: Z to A</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-neutral-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-neutral-600 hover:bg-neutral-100'}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-neutral-600 hover:bg-neutral-100'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <span className="ml-2 text-neutral-600">Loading jobs...</span>
        </div>
      )}

      {/* Jobs List */}
      {!loading && (
        <>
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-12 h-12 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No jobs found</h3>
              <p className="text-neutral-600 mb-4">
                Try adjusting your search criteria or filters to find more jobs.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'
              }>
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSaveToggle={handleJobSaveToggle}
                    className={viewMode === 'grid' ? '' : 'w-full'}
                  />
                ))}
              </div>

              {/* Load More */}
              {pagination.hasNextPage && (
                <div className="text-center mt-8">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    variant="outline"
                    className="px-8"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      'Load More Jobs'
                    )}
                  </Button>
                </div>
              )}

              {/* Pagination Info */}
              <div className="text-center mt-4 text-sm text-neutral-600">
                Showing {jobs.length} of {pagination.totalCount} jobs
                {pagination.totalPages > 1 && (
                  <span> (Page {pagination.page} of {pagination.totalPages})</span>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default JobListings;