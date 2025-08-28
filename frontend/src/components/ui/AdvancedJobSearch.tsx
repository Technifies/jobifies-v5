'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Building2, 
  DollarSign, 
  Clock, 
  Briefcase,
  Filter,
  X,
  ChevronDown,
  TrendingUp
} from 'lucide-react';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'job' | 'skill' | 'company' | 'location';
  count?: number;
}

interface AdvancedJobSearchProps {
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
}

interface SearchFilters {
  query: string;
  location: string;
  company: string;
  salaryMin: number;
  salaryMax: number;
  experienceLevel: string;
  jobType: string[];
  remoteOnly: boolean;
}

const popularSearches = [
  'React Developer', 'Product Manager', 'Data Scientist', 'UX Designer',
  'Marketing Manager', 'Sales Representative', 'Software Engineer', 'Business Analyst'
];

const experienceLevels = [
  { value: '', label: 'Any Experience' },
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (2-5 years)' },
  { value: 'senior', label: 'Senior Level (5-10 years)' },
  { value: 'executive', label: 'Executive (10+ years)' }
];

const jobTypes = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' }
];

const mockSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'Software Engineer', type: 'job', count: 1250 },
  { id: '2', text: 'React', type: 'skill', count: 890 },
  { id: '3', text: 'Google', type: 'company', count: 45 },
  { id: '4', text: 'San Francisco, CA', type: 'location', count: 2100 },
  { id: '5', text: 'Product Manager', type: 'job', count: 780 },
  { id: '6', text: 'JavaScript', type: 'skill', count: 1100 }
];

const cities = [
  'New York, NY', 'San Francisco, CA', 'Seattle, WA', 'Austin, TX',
  'Chicago, IL', 'Boston, MA', 'Los Angeles, CA', 'Denver, CO',
  'Atlanta, GA', 'Miami, FL', 'Remote', 'Hybrid'
];

export default function AdvancedJobSearch({ onSearch, className }: AdvancedJobSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    company: '',
    salaryMin: 0,
    salaryMax: 200000,
    experienceLevel: '',
    jobType: [],
    remoteOnly: false
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);

  const searchRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);

  // Mock search suggestions
  useEffect(() => {
    if (filters.query.length > 1) {
      const filtered = mockSuggestions.filter(s => 
        s.text.toLowerCase().includes(filters.query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [filters.query]);

  // Mock location suggestions
  useEffect(() => {
    if (filters.location.length > 1) {
      const filtered = cities.filter(city => 
        city.toLowerCase().includes(filters.location.toLowerCase())
      );
      setLocationSuggestions(filtered);
    } else {
      setLocationSuggestions([]);
    }
  }, [filters.location]);

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const handleJobTypeToggle = (jobType: string) => {
    setFilters(prev => ({
      ...prev,
      jobType: prev.jobType.includes(jobType)
        ? prev.jobType.filter(t => t !== jobType)
        : [...prev.jobType, jobType]
    }));
  };

  const handlePopularSearch = (search: string) => {
    setFilters(prev => ({ ...prev, query: search }));
    setShowSuggestions(false);
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'location') {
      setFilters(prev => ({ ...prev, location: suggestion.text }));
      setShowLocationSuggestions(false);
    } else {
      setFilters(prev => ({ ...prev, query: suggestion.text }));
      setShowSuggestions(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      location: '',
      company: '',
      salaryMin: 0,
      salaryMax: 200000,
      experienceLevel: '',
      jobType: [],
      remoteOnly: false
    });
  };

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      {/* Main Search Bar */}
      <div className="bg-white rounded-xl shadow-xl border border-neutral-200 p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Job Search Input */}
          <div className="lg:col-span-4 relative">
            <label className="block text-sm font-medium text-neutral-700 mb-2">Job title, keywords, or company</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                ref={searchRef}
                type="text"
                placeholder="e.g. Software Engineer, Marketing"
                className="block w-full px-3 py-2 pl-10 pr-4 text-base text-neutral-900 bg-white border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              
              {/* Search Suggestions */}
              {showSuggestions && (suggestions.length > 0 || filters.query === '') && (
                <div className="absolute top-full left-0 right-0 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 mt-1">
                  {filters.query === '' && (
                    <div className="p-4 border-b border-neutral-100">
                      <div className="flex items-center mb-3">
                        <TrendingUp className="w-4 h-4 text-primary-600 mr-2" />
                        <span className="text-sm font-medium text-neutral-700">Popular searches</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((search) => (
                          <button
                            key={search}
                            onClick={() => handlePopularSearch(search)}
                            className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm hover:bg-primary-100 transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {suggestions.length > 0 && (
                    <div className="max-h-64 overflow-y-auto">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleSuggestionSelect(suggestion)}
                          className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center justify-between group"
                        >
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-3 ${
                              suggestion.type === 'job' ? 'bg-primary-500' :
                              suggestion.type === 'skill' ? 'bg-success-500' :
                              suggestion.type === 'company' ? 'bg-warning-500' :
                              'bg-info-500'
                            }`} />
                            <span className="text-neutral-900">{suggestion.text}</span>
                            <span className="ml-2 text-xs text-neutral-500 capitalize">
                              {suggestion.type}
                            </span>
                          </div>
                          {suggestion.count && (
                            <span className="text-xs text-neutral-400">
                              {suggestion.count.toLocaleString()} jobs
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Location Input */}
          <div className="lg:col-span-3 relative">
            <label className="block text-sm font-medium text-neutral-700 mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                ref={locationRef}
                type="text"
                placeholder="City, state, or remote"
                className="block w-full px-3 py-2 pl-10 pr-4 text-base text-neutral-900 bg-white border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                onFocus={() => setShowLocationSuggestions(true)}
                onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
              />
              
              {/* Location Suggestions */}
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 mt-1 max-h-64 overflow-y-auto">
                  {locationSuggestions.map((city, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setFilters(prev => ({ ...prev, location: city }));
                        setShowLocationSuggestions(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-neutral-50 flex items-center"
                    >
                      <MapPin className="w-4 h-4 text-neutral-400 mr-3" />
                      <span className="text-neutral-900">{city}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Company Input */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">Company</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Company name"
                className="block w-full px-3 py-2 pl-10 pr-4 text-base text-neutral-900 bg-white border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                value={filters.company}
                onChange={(e) => setFilters(prev => ({ ...prev, company: e.target.value }))}
              />
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="lg:col-span-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-medium rounded-lg border text-primary-600 bg-white border-neutral-300 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 focus:ring-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:scale-105"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-1">
            <button
              onClick={handleSearch}
              className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-semibold rounded-lg border text-white bg-gradient-to-r from-brand-500 to-brand-600 border-transparent hover:from-brand-600 hover:to-brand-700 focus:ring-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-brand-500/25 transform hover:-translate-y-0.5 hover:scale-105"
            >
              Search
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t border-neutral-200 mt-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Salary Range</label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-neutral-400" />
                    <input
                      type="number"
                      placeholder="Min"
                      className="block w-full px-3 py-2 text-sm text-neutral-900 bg-white border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      value={filters.salaryMin || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, salaryMin: parseInt(e.target.value) || 0 }))}
                    />
                    <span className="text-neutral-400">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="block w-full px-3 py-2 text-sm text-neutral-900 bg-white border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      value={filters.salaryMax || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, salaryMax: parseInt(e.target.value) || 200000 }))}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>$0</span>
                    <span>$200k+</span>
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Experience Level</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <select
                    className="block w-full px-3 py-2 pl-10 text-base text-neutral-900 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 appearance-none"
                    value={filters.experienceLevel}
                    onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value }))}
                  >
                    {experienceLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Job Type</label>
                <div className="space-y-2">
                  {jobTypes.map((type) => (
                    <label key={type.value} className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 bg-white border-neutral-300 rounded focus:ring-primary-500 focus:ring-2"
                        checked={filters.jobType.includes(type.value)}
                        onChange={() => handleJobTypeToggle(type.value)}
                      />
                      <span className="ml-2 text-sm text-neutral-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Remote Option */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Work Style</label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox text-primary-600 rounded"
                    checked={filters.remoteOnly}
                    onChange={(e) => setFilters(prev => ({ ...prev, remoteOnly: e.target.checked }))}
                  />
                  <span className="ml-2 text-sm text-neutral-700">Remote only</span>
                </label>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-neutral-100">
              <button
                onClick={resetFilters}
                className="text-sm text-neutral-600 hover:text-neutral-800 flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all filters
              </button>
              
              {/* Active Filters Count */}
              <div className="text-sm text-neutral-600">
                {Object.values(filters).filter(Boolean).length > 0 && (
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs">
                    {Object.values(filters).filter(Boolean).length} filters active
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-white border border-brand-200 rounded-lg hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 transition-all duration-200 text-sm font-medium text-primary-600 hover:scale-105">
          Remote Jobs
        </button>
        <button className="px-4 py-2 bg-white border border-accent-200 rounded-lg hover:bg-accent-50 hover:border-accent-300 hover:text-accent-700 transition-all duration-200 text-sm font-medium text-primary-600 hover:scale-105">
          High Paying Jobs
        </button>
        <button className="px-4 py-2 bg-white border border-success-200 rounded-lg hover:bg-success-50 hover:border-success-300 hover:text-success-700 transition-all duration-200 text-sm font-medium text-primary-600 hover:scale-105">
          Entry Level
        </button>
        <button className="px-4 py-2 bg-white border border-brand-200 rounded-lg hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 transition-all duration-200 text-sm font-medium text-primary-600 hover:scale-105">
          Tech Jobs
        </button>
        <button className="px-4 py-2 bg-white border border-accent-200 rounded-lg hover:bg-accent-50 hover:border-accent-300 hover:text-accent-700 transition-all duration-200 text-sm font-medium text-primary-600 hover:scale-105">
          Marketing Jobs
        </button>
      </div>
    </div>
  );
}