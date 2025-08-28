import Link from "next/link";
import { Briefcase } from "lucide-react";

// Import all the enhanced components we created originally
import AdvancedJobSearch from "@/components/ui/AdvancedJobSearch";
import TrendingJobs from "@/components/ui/TrendingJobs";
import FeaturedCompanies from "@/components/ui/FeaturedCompanies";
import JobCategories from "@/components/ui/JobCategories";
import SalaryInsights from "@/components/ui/SalaryInsights";
import CareerResources from "@/components/ui/CareerResources";
import SuccessStories from "@/components/ui/SuccessStories";
import PlatformStats from "@/components/ui/PlatformStats";
import MobileAppPromo from "@/components/ui/MobileAppPromo";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200/60 bg-white/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">Jobifies</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/jobs" className="text-sm font-medium text-primary-600 hover:text-brand-600 transition-colors relative group">
                Find Jobs
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/companies" className="text-sm font-medium text-primary-600 hover:text-brand-600 transition-colors relative group">
                Companies
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/salary-insights" className="text-sm font-medium text-primary-600 hover:text-brand-600 transition-colors relative group">
                Salaries
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/resources" className="text-sm font-medium text-primary-600 hover:text-brand-600 transition-colors relative group">
                Resources
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/about" className="text-sm font-medium text-primary-600 hover:text-brand-600 transition-colors relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 transition-all group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-sm font-medium text-primary-600 hover:text-brand-600 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-brand-50">Sign In</Link>
              <Link href="/register" className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold rounded-xl border text-white bg-gradient-to-r from-brand-500 to-brand-600 border-transparent hover:from-brand-400 hover:to-brand-500 focus:ring-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-brand-500/25 transform hover:-translate-y-0.5 hover:scale-105">Get Started</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-neutral-25 via-white to-brand-25/30">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-50/40 to-accent-50/30"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-brand-200/15 to-brand-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-accent-200/15 to-accent-300/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-brand-100/80 to-accent-100/80 backdrop-blur-sm rounded-full text-sm font-medium text-primary-800 mb-8 border border-brand-300/50 shadow-sm hover:shadow-md transition-all duration-300">
            <span className="w-2 h-2 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full mr-2 animate-pulse shadow-sm"></span>
            New: AI-Powered Job Matching Available Now
          </div>
          
          <h1 className="text-responsive-2xl font-bold mb-6 leading-tight">
            <span className="text-primary-900">Find Your Dream Job with</span>{" "}
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 bg-clip-text text-transparent">
              AI-Powered
            </span>{" "}
            <span className="text-primary-900">Matching</span>
          </h1>
          <p className="text-responsive-lg text-primary-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with top employers and discover opportunities that match your skills perfectly. 
            Our advanced AI technology and comprehensive platform help you find the perfect job faster than ever before.
          </p>

          {/* Enhanced Search Component */}
          <div className="max-w-5xl mx-auto">
            <AdvancedJobSearch className="mb-12" />
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 opacity-70">
            <div className="text-sm text-primary-600">Trusted by 500k+ professionals</div>
            <div className="w-px h-4 bg-primary-300"></div>
            <div className="text-sm text-primary-600">125k+ active jobs</div>
            <div className="w-px h-4 bg-primary-300"></div>
            <div className="text-sm text-primary-600">8k+ companies</div>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <div className="bg-gradient-to-br from-neutral-25 to-neutral-50/50">
        <PlatformStats />
      </div>

      {/* Trending Jobs Section */}
      <TrendingJobs />

      {/* Job Categories Section */}
      <div className="bg-gradient-to-br from-brand-25/30 to-white">
        <JobCategories />
      </div>

      {/* Featured Companies Section */}
      <FeaturedCompanies />

      {/* Salary Insights Section */}
      <div className="bg-gradient-to-br from-success-25/30 to-white">
        <SalaryInsights />
      </div>

      {/* Success Stories Section */}
      <SuccessStories />

      {/* Career Resources Section */}
      <div className="bg-gradient-to-br from-accent-25/30 to-neutral-25/50">
        <CareerResources />
      </div>

      {/* Mobile App Promotion */}
      <MobileAppPromo />

      {/* Enhanced CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary-700 to-primary-800"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-800/30 to-accent-800/30"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-brand-500/20 to-brand-600/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-accent-500/20 to-accent-600/15 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-white/5"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 mb-8 border border-white/30 shadow-lg hover:bg-white/20 transition-all duration-300">
            <span className="w-2 h-2 bg-gradient-to-r from-accent-400 to-accent-500 rounded-full mr-2 animate-pulse shadow-sm"></span>
            Join 500k+ professionals who found their dream jobs
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
            Ready to Transform Your{" "}
            <span className="bg-gradient-to-r from-accent-400 to-brand-400 bg-clip-text text-transparent">
              Career?
            </span>
          </h2>
          <p className="text-xl mb-12 text-white/80 max-w-3xl mx-auto leading-relaxed">
            Start your journey today with our AI-powered job matching platform. 
            Discover opportunities that truly align with your skills and career aspirations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/register" className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-400 hover:to-brand-500 focus:ring-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-800 transition-all duration-300 shadow-xl hover:shadow-brand-400/30 transform hover:-translate-y-1 hover:scale-105">
              <span>Create Free Account</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/jobs" className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl border-2 border-white/40 text-white bg-white/10 backdrop-blur-sm hover:bg-accent-500 hover:text-white hover:border-accent-500 focus:ring-accent-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-800 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-accent-500/20">
              <span>Browse 125k+ Jobs</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>
          
          {/* Enhanced Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent-400 to-brand-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">125k+</div>
              <div className="text-white/60 text-sm">Active Jobs</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent-400 to-brand-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">8k+</div>
              <div className="text-white/60 text-sm">Trusted Companies</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent-400 to-brand-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">500k+</div>
              <div className="text-white/60 text-sm">Job Seekers</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent-400 to-brand-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">95%</div>
              <div className="text-white/60 text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-800 text-white py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-800/20 to-accent-800/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-500/10 to-brand-600/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-accent-500/8 to-accent-600/6 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-white/3"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Jobifies</span>
              </div>
              <p className="text-white/70 mb-8 max-w-md leading-relaxed">
                The future of job searching, powered by AI technology. 
                Connecting talent with opportunity across the globe with intelligent matching.
              </p>
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-brand-500/30 cursor-pointer transition-all duration-200 hover:scale-110 border border-white/20 shadow-lg hover:shadow-brand-500/20">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-brand-500/30 cursor-pointer transition-all duration-200 hover:scale-110 border border-white/20 shadow-lg hover:shadow-brand-500/20">
                  <span className="text-sm font-bold">𝕏</span>
                </div>
                <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-brand-500/30 cursor-pointer transition-all duration-200 hover:scale-110 border border-white/20 shadow-lg hover:shadow-brand-500/20">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-lg text-white">Job Seekers</h3>
              <ul className="space-y-3 text-white/60">
                <li><Link href="/jobs" className="hover:text-brand-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">Browse Jobs</Link></li>
                <li><Link href="/companies" className="hover:text-brand-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">Companies</Link></li>
                <li><Link href="/salary-insights" className="hover:text-brand-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">Salary Insights</Link></li>
                <li><Link href="/resources" className="hover:text-brand-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">Career Resources</Link></li>
                <li><Link href="/resume-builder" className="hover:text-brand-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">Resume Builder</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-lg text-white">Employers</h3>
              <ul className="space-y-3 text-white/60">
                <li><Link href="/post-job" className="hover:text-brand-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">Post a Job</Link></li>
                <li><Link href="/search-resumes" className="hover:text-brand-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">Search Resumes</Link></li>
                <li><Link href="/employer-resources" className="hover:text-brand-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">Employer Resources</Link></li>
                <li><Link href="/pricing" className="hover:text-brand-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-lg text-white">Company</h3>
              <ul className="space-y-3 text-white/60">
                <li><Link href="/about" className="hover:text-brand-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-brand-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-brand-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">Careers</Link></li>
                <li><Link href="/press" className="hover:text-brand-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">Press</Link></li>
                <li><Link href="/privacy" className="hover:text-brand-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-brand-400 transition-colors hover:translate-x-1 transform duration-200 inline-block">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/60 text-center md:text-left">
                &copy; 2025 Jobifies. All rights reserved. Built with ❤️ for job seekers worldwide.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="text-white/60 hover:text-brand-400 text-sm transition-colors">Privacy</Link>
                <Link href="/terms" className="text-white/60 hover:text-brand-400 text-sm transition-colors">Terms</Link>
                <Link href="/sitemap" className="text-white/60 hover:text-brand-400 text-sm transition-colors">Sitemap</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}