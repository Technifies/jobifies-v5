'use client';

import { useState, useEffect } from 'react';
import {
  Quote,
  Star,
  TrendingUp,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  Award,
  Users,
  Heart,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

interface SuccessStory {
  id: string;
  user: {
    name: string;
    avatar: string;
    title: string;
    location: string;
    previousRole?: string;
  };
  story: {
    quote: string;
    fullStory?: string;
    timeframe: string;
    salaryIncrease?: number;
    careerChange: boolean;
  };
  jobDetails: {
    company: string;
    companyLogo: string;
    position: string;
    industry: string;
    jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  };
  metrics: {
    applicationsSubmitted: number;
    interviewsReceived: number;
    timeToHire: number; // days
    rating: number;
  };
  tags: string[];
  featured: boolean;
  verified: boolean;
  publishDate: string;
}

interface SuccessStoriesProps {
  className?: string;
}

// Mock success stories data
const successStories: SuccessStory[] = [
  {
    id: '1',
    user: {
      name: 'Emily Chen',
      avatar: '/api/placeholder/60/60',
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      previousRole: 'Junior Developer'
    },
    story: {
      quote: 'Jobifies helped me land my dream job at Google with a 60% salary increase. The AI matching was incredibly accurate!',
      fullStory: 'After struggling with traditional job boards for months, I found Jobifies and was amazed by how well it matched my skills with relevant opportunities. The platform\'s AI understood my career goals and presented me with positions that were perfect fits.',
      timeframe: 'Found job in 3 weeks',
      salaryIncrease: 60,
      careerChange: false
    },
    jobDetails: {
      company: 'Google',
      companyLogo: '/api/placeholder/40/40',
      position: 'Senior Software Engineer',
      industry: 'Technology',
      jobType: 'Full-time'
    },
    metrics: {
      applicationsSubmitted: 12,
      interviewsReceived: 8,
      timeToHire: 21,
      rating: 5
    },
    tags: ['Career Growth', 'Tech', 'AI Matching', 'Salary Increase'],
    featured: true,
    verified: true,
    publishDate: '2025-01-10'
  },
  {
    id: '2',
    user: {
      name: 'Marcus Johnson',
      avatar: '/api/placeholder/60/60',
      title: 'Product Manager',
      location: 'New York, NY',
      previousRole: 'Marketing Specialist'
    },
    story: {
      quote: 'Successfully transitioned from marketing to product management thanks to Jobifies\' career transition tools and guidance.',
      fullStory: 'I wanted to pivot my career but didn\'t know where to start. Jobifies not only helped me identify transferable skills but also connected me with mentors and resources specific to product management.',
      timeframe: 'Career transition in 2 months',
      salaryIncrease: 35,
      careerChange: true
    },
    jobDetails: {
      company: 'Spotify',
      companyLogo: '/api/placeholder/40/40',
      position: 'Product Manager',
      industry: 'Technology',
      jobType: 'Full-time'
    },
    metrics: {
      applicationsSubmitted: 18,
      interviewsReceived: 6,
      timeToHire: 45,
      rating: 5
    },
    tags: ['Career Change', 'Product Management', 'Mentorship', 'Skill Development'],
    featured: true,
    verified: true,
    publishDate: '2025-01-08'
  },
  {
    id: '3',
    user: {
      name: 'Sarah Rodriguez',
      avatar: '/api/placeholder/60/60',
      title: 'Remote UX Designer',
      location: 'Austin, TX'
    },
    story: {
      quote: 'Found the perfect remote position that allows me to work from anywhere while doing what I love.',
      fullStory: 'As a new parent, finding a flexible remote job was crucial. Jobifies\' remote job filters and work-life balance focus helped me find a company that truly values employee wellbeing.',
      timeframe: 'Remote job in 4 weeks',
      careerChange: false
    },
    jobDetails: {
      company: 'Figma',
      companyLogo: '/api/placeholder/40/40',
      position: 'Senior UX Designer',
      industry: 'Design',
      jobType: 'Remote'
    },
    metrics: {
      applicationsSubmitted: 15,
      interviewsReceived: 9,
      timeToHire: 28,
      rating: 5
    },
    tags: ['Remote Work', 'UX Design', 'Work-Life Balance', 'Flexibility'],
    featured: false,
    verified: true,
    publishDate: '2025-01-05'
  },
  {
    id: '4',
    user: {
      name: 'David Kim',
      avatar: '/api/placeholder/60/60',
      title: 'Data Scientist',
      location: 'Seattle, WA',
      previousRole: 'Business Analyst'
    },
    story: {
      quote: 'The skill assessment feature helped me identify gaps and get targeted training before applying to data science roles.',
      fullStory: 'Jobifies\' comprehensive approach didn\'t just help me find jobs - it helped me become a better candidate through personalized learning recommendations and skill development.',
      timeframe: 'Upskilled and hired in 6 weeks',
      salaryIncrease: 45,
      careerChange: false
    },
    jobDetails: {
      company: 'Netflix',
      companyLogo: '/api/placeholder/40/40',
      position: 'Senior Data Scientist',
      industry: 'Technology',
      jobType: 'Full-time'
    },
    metrics: {
      applicationsSubmitted: 9,
      interviewsReceived: 7,
      timeToHire: 42,
      rating: 5
    },
    tags: ['Data Science', 'Skill Development', 'Career Growth', 'Analytics'],
    featured: false,
    verified: true,
    publishDate: '2025-01-03'
  },
  {
    id: '5',
    user: {
      name: 'Jennifer Martinez',
      avatar: '/api/placeholder/60/60',
      title: 'Marketing Director',
      location: 'Los Angeles, CA'
    },
    story: {
      quote: 'After being laid off, Jobifies helped me bounce back stronger with a leadership role at a company I love.',
      fullStory: 'The job loss was devastating, but Jobifies\' career coaches helped me reframe my experience and target leadership positions. The platform\'s company culture insights were invaluable.',
      timeframe: 'Back to work in 5 weeks',
      salaryIncrease: 20,
      careerChange: false
    },
    jobDetails: {
      company: 'Adobe',
      companyLogo: '/api/placeholder/40/40',
      position: 'Marketing Director',
      industry: 'Technology',
      jobType: 'Full-time'
    },
    metrics: {
      applicationsSubmitted: 14,
      interviewsReceived: 5,
      timeToHire: 35,
      rating: 4
    },
    tags: ['Leadership', 'Career Recovery', 'Marketing', 'Resilience'],
    featured: false,
    verified: true,
    publishDate: '2025-01-01'
  }
];

export default function SuccessStories({ className }: SuccessStoriesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [likedStories, setLikedStories] = useState<Set<string>>(new Set());

  // Auto-play carousel for featured stories
  useEffect(() => {
    if (!isAutoPlaying) return;

    const featuredStories = successStories.filter(story => story.featured);
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featuredStories.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const toggleLikeStory = (storyId: string) => {
    setLikedStories(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(storyId)) {
        newLiked.delete(storyId);
      } else {
        newLiked.add(storyId);
      }
      return newLiked;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    
    // Use consistent date format for server/client hydration
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const featuredStories = successStories.filter(story => story.featured);
  const regularStories = successStories.filter(story => !story.featured);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % featuredStories.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => 
      prev === 0 ? featuredStories.length - 1 : prev - 1
    );
    setIsAutoPlaying(false);
  };

  const StoryCard = ({ story, featured = false }: { story: SuccessStory; featured?: boolean }) => (
    <div 
      className={`group bg-white rounded-xl border-2 transition-all duration-300 hover:shadow-xl ${
        featured 
          ? 'border-primary-200 shadow-lg bg-gradient-to-br from-white to-primary-25' 
          : 'border-neutral-200 shadow-md hover:-translate-y-1'
      }`}
    >
      {/* Featured Badge */}
      {story.featured && (
        <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs px-3 py-1 rounded-full font-medium z-10">
          ⭐ Featured
        </div>
      )}

      <div className="p-6">
        {/* User Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-neutral-200 rounded-full mr-4" />
            <div>
              <div className="flex items-center">
                <h3 className="font-semibold text-neutral-900">{story.user.name}</h3>
                {story.verified && (
                  <CheckCircle className="w-4 h-4 text-success-500 ml-2" />
                )}
              </div>
              <p className="text-sm text-neutral-600">{story.user.title}</p>
              <div className="flex items-center text-xs text-neutral-500 mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{story.user.location}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => toggleLikeStory(story.id)}
            className={`p-2 rounded-lg transition-colors ${
              likedStories.has(story.id)
                ? 'bg-error-100 text-error-600'
                : 'bg-neutral-100 text-neutral-600 hover:bg-error-100 hover:text-error-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${likedStories.has(story.id) ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Quote */}
        <div className="relative mb-4">
          <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary-200" />
          <p className="text-neutral-800 pl-6 italic leading-relaxed">
            "{story.story.quote}"
          </p>
        </div>

        {/* Job Details */}
        <div className="bg-neutral-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-neutral-200 rounded mr-3" />
              <div>
                <div className="font-semibold text-neutral-900">{story.jobDetails.position}</div>
                <div className="text-sm text-neutral-600">{story.jobDetails.company}</div>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              story.jobDetails.jobType === 'Remote' ? 'bg-success-100 text-success-800' :
              story.jobDetails.jobType === 'Contract' ? 'bg-warning-100 text-warning-800' :
              'bg-primary-100 text-primary-800'
            }`}>
              {story.jobDetails.jobType}
            </span>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-success-600">
              {story.metrics.timeToHire}
            </div>
            <div className="text-xs text-neutral-600">days to hire</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary-600">
              {story.metrics.interviewsReceived}/{story.metrics.applicationsSubmitted}
            </div>
            <div className="text-xs text-neutral-600">interview rate</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Timeframe:</span>
            <span className="font-medium text-neutral-900">{story.story.timeframe}</span>
          </div>
          {story.story.salaryIncrease && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Salary Increase:</span>
              <span className="font-medium text-success-600">+{story.story.salaryIncrease}%</span>
            </div>
          )}
          {story.story.careerChange && (
            <div className="flex items-center text-sm text-info-600">
              <Target className="w-4 h-4 mr-1" />
              <span>Career Transition</span>
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < story.metrics.rating ? 'text-warning-400 fill-current' : 'text-neutral-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-neutral-600">
              {story.metrics.rating}/5
            </span>
          </div>
          <span className="text-xs text-neutral-500">{formatDate(story.publishDate)}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {story.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-xs font-medium"
            >
              {tag}
            </span>
          ))}
          {story.tags.length > 3 && (
            <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-xs">
              +{story.tags.length - 3}
            </span>
          )}
        </div>

        {/* Read More */}
        <button
          onClick={() => setSelectedStory(selectedStory === story.id ? null : story.id)}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
        >
          {selectedStory === story.id ? 'Show Less' : 'Read Full Story'}
          <ExternalLink className="w-4 h-4 ml-1" />
        </button>

        {/* Expanded Story */}
        {selectedStory === story.id && story.story.fullStory && (
          <div className="mt-4 p-4 bg-primary-25 rounded-lg">
            <p className="text-sm text-neutral-700 leading-relaxed">
              {story.story.fullStory}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section className={`py-16 bg-gradient-to-br from-primary-25 to-success-25 ${className}`}>
      <div className="container-xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Award className="w-6 h-6 text-success-600 mr-2" />
            <h2 className="text-3xl font-bold text-neutral-900">Success Stories</h2>
          </div>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Real stories from professionals who found their dream jobs through Jobifies
          </p>
        </div>

        {/* Featured Stories Carousel */}
        {featuredStories.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-neutral-900 flex items-center">
                <Star className="w-6 h-6 text-warning-500 mr-2" />
                Featured Success Stories
              </h3>
              
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors"
                  aria-label="Previous story"
                >
                  <ChevronLeft className="w-5 h-5 text-neutral-600" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors"
                  aria-label="Next story"
                >
                  <ChevronRight className="w-5 h-5 text-neutral-600" />
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {featuredStories.map((story, index) => (
                  <div key={story.id} className="w-full flex-shrink-0 px-2">
                    <div className="max-w-3xl mx-auto">
                      <StoryCard story={story} featured />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                {featuredStories.map((_, index) => (
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
                    aria-label={`Go to story ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* All Success Stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {regularStories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">95%</div>
            <div className="text-sm text-neutral-600">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success-600">25 days</div>
            <div className="text-sm text-neutral-600">Average Time to Hire</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning-600">40%</div>
            <div className="text-sm text-neutral-600">Average Salary Increase</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-info-600">10k+</div>
            <div className="text-sm text-neutral-600">Success Stories</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              Ready to Write Your Success Story?
            </h3>
            <p className="text-neutral-600 mb-6">
              Join thousands of professionals who have transformed their careers with Jobifies
            </p>
            <button className="btn-primary btn-primary-lg">
              Start Your Journey Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}