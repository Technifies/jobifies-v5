'use client';

import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { 
  MapPin, 
  Building, 
  Clock, 
  DollarSign, 
  Bookmark,
  BookmarkCheck,
  Users,
  Briefcase,
  Calendar
} from 'lucide-react';

import { Job } from '@/types/job';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/stores/authStore';
import { jobService } from '@/lib/services/jobService';
import { toast } from 'react-hot-toast';

interface JobCardProps {
  job: Job;
  className?: string;
  showCompanyInfo?: boolean;
  onSaveToggle?: (jobId: string, saved: boolean) => void;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  className = '',
  showCompanyInfo = true,
  onSaveToggle,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [isSaved, setIsSaved] = React.useState(job.user_saved || false);
  const [isToggling, setIsToggling] = React.useState(false);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please sign in to save jobs');
      return;
    }

    if (user?.role !== 'job_seeker') {
      toast.error('Only job seekers can save jobs');
      return;
    }

    setIsToggling(true);
    
    try {
      if (isSaved) {
        await jobService.unsaveJob(job.id);
        setIsSaved(false);
        toast.success('Job removed from saved');
      } else {
        await jobService.saveJob(job.id);
        setIsSaved(true);
        toast.success('Job saved successfully');
      }
      
      onSaveToggle?.(job.id, !isSaved);
    } catch (error) {
      console.error('Error toggling save job:', error);
      toast.error('Failed to update saved status');
    } finally {
      setIsToggling(false);
    }
  };

  const formatSalaryRange = () => {
    if (job.salary_min || job.salary_max) {
      const currency = job.currency || 'USD';
      const min = job.salary_min ? `${job.salary_min.toLocaleString()}` : '';
      const max = job.salary_max ? `${job.salary_max.toLocaleString()}` : '';
      
      if (min && max) {
        return `${currency} ${min} - ${max}`;
      } else if (min) {
        return `${currency} ${min}+`;
      } else if (max) {
        return `Up to ${currency} ${max}`;
      }
    }
    return null;
  };

  const formatJobType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatExperienceLevel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  const timeAgo = formatDistanceToNow(new Date(job.created_at), { addSuffix: true });
  const salaryDisplay = formatSalaryRange();

  return (
    <div className={`bg-white rounded-lg border border-neutral-200 hover:border-primary-300 transition-all duration-200 hover:shadow-lg ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            {showCompanyInfo && (
              <div className="flex items-center gap-3 mb-3">
                {job.company_logo && (
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                    <img 
                      src={job.company_logo} 
                      alt={job.company_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-neutral-900 truncate">
                    {job.company_name}
                  </h3>
                  {job.company_industry && (
                    <p className="text-sm text-neutral-600 truncate">
                      {job.company_industry}
                    </p>
                  )}
                </div>
              </div>
            )}

            <Link href={`/jobs/${job.id}`} className="group">
              <h2 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                {job.title}
              </h2>
            </Link>
          </div>

          {/* Save Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveToggle}
            disabled={isToggling}
            className="flex-shrink-0 ml-3"
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-primary-600" />
            ) : (
              <Bookmark className="w-5 h-5 text-neutral-400 hover:text-primary-600" />
            )}
          </Button>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {job.location} {job.remote && '(Remote)'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Briefcase className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {formatJobType(job.job_type)} • {formatJobType(job.employment_type)}
            </span>
          </div>

          {salaryDisplay && (
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <DollarSign className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{salaryDisplay}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {formatExperienceLevel(job.experience_level)} level
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-neutral-700 text-sm line-clamp-3 mb-4">
          {job.description}
        </p>

        {/* Skills */}
        {job.required_skills && job.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.required_skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-md font-medium"
              >
                {skill}
              </span>
            ))}
            {job.required_skills.length > 4 && (
              <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-md font-medium">
                +{job.required_skills.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{timeAgo}</span>
            </div>
            
            {job.application_count > 0 && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{job.application_count} applicants</span>
              </div>
            )}

            {job.deadline && (
              <div className="flex items-center gap-1 text-warning-600">
                <Calendar className="w-3 h-3" />
                <span>
                  Deadline: {new Date(job.deadline).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {user?.role === 'job_seeker' && (
              <Button
                size="sm"
                variant={job.user_applied ? 'secondary' : 'primary'}
                disabled={job.user_applied}
                onClick={(e) => {
                  e.preventDefault();
                  // Handle apply - will implement later
                  toast.info('Apply functionality coming soon');
                }}
              >
                {job.user_applied ? 'Applied' : 'Apply Now'}
              </Button>
            )}

            <Link href={`/jobs/${job.id}`}>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;