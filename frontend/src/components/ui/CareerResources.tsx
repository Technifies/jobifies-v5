'use client';

import { useState } from 'react';
import {
  BookOpen,
  FileText,
  Video,
  Trophy,
  User,
  Clock,
  ArrowRight,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Star,
  Users,
  TrendingUp,
  Download,
  Play,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react';

interface Resource {
  id: string;
  type: 'article' | 'guide' | 'video' | 'template';
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
    title: string;
    verified: boolean;
  };
  publishDate: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  premium: boolean;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnail: string;
}

interface CareerResourcesProps {
  className?: string;
}

// Mock career resources data
const careerResources: Resource[] = [
  {
    id: '1',
    type: 'article',
    title: '10 Essential Skills Every Software Developer Needs in 2025',
    description: 'Stay ahead of the curve with these must-have technical and soft skills that employers are looking for.',
    author: {
      name: 'Sarah Chen',
      avatar: '/api/placeholder/40/40',
      title: 'Senior Software Engineer at Google',
      verified: true
    },
    publishDate: '2025-01-15',
    readTime: 8,
    views: 12500,
    likes: 847,
    comments: 134,
    featured: true,
    premium: false,
    tags: ['Programming', 'Career Development', 'Tech Skills'],
    difficulty: 'Intermediate',
    category: 'Technology',
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '2',
    type: 'guide',
    title: 'Complete Resume Makeover Guide: From Good to Outstanding',
    description: 'Transform your resume into a powerful tool that gets you interviews. Includes templates and real examples.',
    author: {
      name: 'Michael Rodriguez',
      avatar: '/api/placeholder/40/40',
      title: 'HR Director at Microsoft',
      verified: true
    },
    publishDate: '2025-01-12',
    readTime: 15,
    views: 28900,
    likes: 1240,
    comments: 89,
    featured: true,
    premium: true,
    tags: ['Resume', 'Job Search', 'Career Tips'],
    difficulty: 'Beginner',
    category: 'Job Search',
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '3',
    type: 'video',
    title: 'Mastering the Technical Interview: Live Coding Session',
    description: 'Watch a real technical interview session with expert commentary and tips for success.',
    author: {
      name: 'Alex Kim',
      avatar: '/api/placeholder/40/40',
      title: 'Engineering Manager at Netflix',
      verified: true
    },
    publishDate: '2025-01-10',
    readTime: 45,
    views: 15600,
    likes: 923,
    comments: 156,
    featured: false,
    premium: true,
    tags: ['Technical Interview', 'Coding', 'Engineering'],
    difficulty: 'Advanced',
    category: 'Interview Prep',
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '4',
    type: 'template',
    title: 'Professional Cover Letter Templates - 2025 Edition',
    description: 'Download customizable cover letter templates that have helped thousands land their dream jobs.',
    author: {
      name: 'Jennifer Park',
      avatar: '/api/placeholder/40/40',
      title: 'Career Coach & Writer',
      verified: false
    },
    publishDate: '2025-01-08',
    readTime: 5,
    views: 8900,
    likes: 567,
    comments: 43,
    featured: false,
    premium: false,
    tags: ['Cover Letter', 'Templates', 'Job Application'],
    difficulty: 'Beginner',
    category: 'Job Search',
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '5',
    type: 'article',
    title: 'Salary Negotiation: How I Increased My Offer by 40%',
    description: 'Real strategies and scripts that work. Learn from someone who successfully negotiated multiple offers.',
    author: {
      name: 'David Johnson',
      avatar: '/api/placeholder/40/40',
      title: 'Product Manager at Spotify',
      verified: true
    },
    publishDate: '2025-01-05',
    readTime: 12,
    views: 19200,
    likes: 1100,
    comments: 78,
    featured: false,
    premium: false,
    tags: ['Salary Negotiation', 'Career Growth', 'Professional Development'],
    difficulty: 'Intermediate',
    category: 'Career Growth',
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: '6',
    type: 'guide',
    title: 'Remote Work Success: Building Your Home Office Career',
    description: 'Everything you need to know about thriving in remote positions and building meaningful connections.',
    author: {
      name: 'Lisa Chang',
      avatar: '/api/placeholder/40/40',
      title: 'Remote Work Consultant',
      verified: false
    },
    publishDate: '2025-01-03',
    readTime: 18,
    views: 11400,
    likes: 789,
    comments: 95,
    featured: false,
    premium: true,
    tags: ['Remote Work', 'Productivity', 'Work-Life Balance'],
    difficulty: 'Intermediate',
    category: 'Remote Work',
    thumbnail: '/api/placeholder/300/200'
  }
];

const resourceCategories = [
  { value: 'all', label: 'All Resources', count: careerResources.length },
  { value: 'Technology', label: 'Technology', count: careerResources.filter(r => r.category === 'Technology').length },
  { value: 'Job Search', label: 'Job Search', count: careerResources.filter(r => r.category === 'Job Search').length },
  { value: 'Interview Prep', label: 'Interview Prep', count: careerResources.filter(r => r.category === 'Interview Prep').length },
  { value: 'Career Growth', label: 'Career Growth', count: careerResources.filter(r => r.category === 'Career Growth').length },
  { value: 'Remote Work', label: 'Remote Work', count: careerResources.filter(r => r.category === 'Remote Work').length }
];

const resourceTypes = [
  { value: 'all', label: 'All Types', icon: BookOpen },
  { value: 'article', label: 'Articles', icon: FileText },
  { value: 'guide', label: 'Guides', icon: BookOpen },
  { value: 'video', label: 'Videos', icon: Video },
  { value: 'template', label: 'Templates', icon: Download }
];

export default function CareerResources({ className }: CareerResourcesProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [savedResources, setSavedResources] = useState<Set<string>>(new Set());
  const [likedResources, setLikedResources] = useState<Set<string>>(new Set());

  const toggleSaveResource = (resourceId: string) => {
    setSavedResources(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(resourceId)) {
        newSaved.delete(resourceId);
      } else {
        newSaved.add(resourceId);
      }
      return newSaved;
    });
  };

  const toggleLikeResource = (resourceId: string) => {
    setLikedResources(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(resourceId)) {
        newLiked.delete(resourceId);
      } else {
        newLiked.add(resourceId);
      }
      return newLiked;
    });
  };

  const filteredResources = careerResources.filter(resource => {
    if (selectedCategory !== 'all' && resource.category !== selectedCategory) return false;
    if (selectedType !== 'all' && resource.type !== selectedType) return false;
    return true;
  });

  const featuredResources = filteredResources.filter(r => r.featured);
  const regularResources = filteredResources.filter(r => !r.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return FileText;
      case 'guide': return BookOpen;
      case 'video': return Video;
      case 'template': return Download;
      default: return FileText;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success-100 text-success-800';
      case 'Intermediate': return 'bg-warning-100 text-warning-800';
      case 'Advanced': return 'bg-error-100 text-error-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const ResourceCard = ({ resource, featured = false }: { resource: Resource; featured?: boolean }) => {
    const TypeIcon = getTypeIcon(resource.type);
    
    return (
      <div 
        className={`group bg-white rounded-xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
          featured 
            ? 'border-primary-200 shadow-lg bg-gradient-to-br from-white to-primary-25' 
            : 'border-neutral-200 shadow-md'
        }`}
      >
        {/* Featured Badge */}
        {resource.featured && (
          <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs px-3 py-1 rounded-full font-medium z-10">
            ⭐ Featured
          </div>
        )}

        {/* Premium Badge */}
        {resource.premium && (
          <div className="absolute top-4 left-4 bg-warning-500 text-white text-xs px-2 py-1 rounded-full font-medium z-10">
            Premium
          </div>
        )}

        <div className="relative">
          {/* Thumbnail */}
          <div className="h-48 bg-neutral-200 rounded-t-xl relative overflow-hidden">
            {resource.type === 'video' && (
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <Play className="w-12 h-12 text-white" />
              </div>
            )}
            <div className="absolute bottom-2 left-2 flex items-center gap-2">
              <span className={`px-2 py-1 bg-white bg-opacity-90 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                {resource.difficulty}
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Resource Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <TypeIcon className="w-5 h-5 text-primary-600 mr-2" />
                <span className="text-sm font-medium text-primary-600 capitalize">
                  {resource.type}
                </span>
              </div>
              
              <button
                onClick={() => toggleSaveResource(resource.id)}
                className="p-1 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label={savedResources.has(resource.id) ? 'Unsave resource' : 'Save resource'}
              >
                {savedResources.has(resource.id) ? (
                  <BookmarkCheck className="w-5 h-5 text-primary-600" />
                ) : (
                  <Bookmark className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600" />
                )}
              </button>
            </div>

            {/* Title and Description */}
            <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
              {resource.title}
            </h3>
            <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
              {resource.description}
            </p>

            {/* Author Info */}
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-neutral-200 rounded-full mr-3" />
              <div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-neutral-900">{resource.author.name}</span>
                  {resource.author.verified && (
                    <div className="ml-1 w-3 h-3 bg-primary-500 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <span className="text-xs text-neutral-600">{resource.author.title}</span>
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex items-center justify-between text-sm text-neutral-600 mb-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{resource.readTime} min read</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>{formatNumber(resource.views)}</span>
              </div>
              <span>{formatDate(resource.publishDate)}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {resource.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs"
                >
                  {tag}
                </span>
              ))}
              {resource.tags.length > 3 && (
                <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-xs">
                  +{resource.tags.length - 3}
                </span>
              )}
            </div>

            {/* Engagement */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLikeResource(resource.id)}
                  className={`flex items-center transition-colors ${
                    likedResources.has(resource.id) 
                      ? 'text-error-600' 
                      : 'text-neutral-600 hover:text-error-600'
                  }`}
                >
                  <Heart 
                    className={`w-4 h-4 mr-1 ${likedResources.has(resource.id) ? 'fill-current' : ''}`} 
                  />
                  <span className="text-sm">{formatNumber(resource.likes)}</span>
                </button>
                <div className="flex items-center text-neutral-600">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{formatNumber(resource.comments)}</span>
                </div>
              </div>

              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                Read More
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className={`py-16 bg-gradient-to-br from-neutral-50 to-info-25 ${className}`}>
      <div className="container-xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-info-600 mr-2" />
            <h2 className="text-3xl font-bold text-neutral-900">Career Resources</h2>
          </div>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Expert insights, guides, and tools to accelerate your career growth and job search success
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {resourceCategories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {resourceTypes.map(type => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === type.value
                    ? 'bg-info-600 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Featured Resources */}
        {featuredResources.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-neutral-900 mb-8 flex items-center">
              <Star className="w-6 h-6 text-warning-500 mr-2" />
              Featured Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {featuredResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} featured />
              ))}
            </div>
          </div>
        )}

        {/* Regular Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {regularResources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="btn-ghost btn-primary-lg">
            Load More Resources
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 p-8 bg-white rounded-2xl shadow-lg max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-info-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-info-600" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">Stay Updated</h3>
            <p className="text-neutral-600">
              Get the latest career insights, job market trends, and exclusive resources delivered to your inbox
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 form-input"
            />
            <button className="btn-primary whitespace-nowrap">
              Subscribe Now
            </button>
          </div>
        </div>

        {/* Resource Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">500+</div>
            <div className="text-sm text-neutral-600">Expert Articles</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success-600">2M+</div>
            <div className="text-sm text-neutral-600">Resources Downloaded</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning-600">50+</div>
            <div className="text-sm text-neutral-600">Industry Experts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-info-600">95%</div>
            <div className="text-sm text-neutral-600">User Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
}