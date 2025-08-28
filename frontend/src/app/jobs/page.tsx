import Link from "next/link";
import { Search, MapPin, Filter, Briefcase, Clock, DollarSign } from "lucide-react";

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-neutral-900">Jobifies</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/jobs" className="text-sm font-medium text-primary-600">Find Jobs</Link>
              <Link href="/companies" className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors">Companies</Link>
              <Link href="/salary-insights" className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors">Salaries</Link>
              <Link href="/resources" className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors">Resources</Link>
              <Link href="/about" className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors">About</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors">Sign In</Link>
              <Link href="/register" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border text-white bg-primary-600 border-transparent hover:bg-primary-700 focus:ring-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200">Get Started</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">Find Your Next Job</h1>
          <p className="text-lg text-neutral-600 mb-8">
            Discover thousands of job opportunities from top companies worldwide. 
            Use our advanced search to find the perfect match for your skills and career goals.
          </p>

          {/* Search Section */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="block w-full px-3 py-3 pl-10 pr-4 text-base text-neutral-900 bg-white border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  className="block w-full px-3 py-3 pl-10 pr-4 text-base text-neutral-900 bg-white border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <button className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg border text-white bg-primary-600 border-transparent hover:bg-primary-700 focus:ring-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200">
                <Search className="w-5 h-5 mr-2" />
                Search Jobs
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button className="inline-flex items-center px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
              <Filter className="w-4 h-4 mr-2" />
              All Filters
            </button>
            <button className="px-4 py-2 bg-primary-100 text-primary-700 border border-primary-200 rounded-lg hover:bg-primary-200 transition-colors text-sm">
              Remote
            </button>
            <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
              Full-time
            </button>
            <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
              Entry Level
            </button>
            <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
              $100k+
            </button>
          </div>

          {/* Job Results */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((job) => (
              <div key={job} className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Senior Software Engineer</h3>
                    <p className="text-primary-600 font-medium mb-2">TechCorp Inc.</p>
                    <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        San Francisco, CA
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Full-time
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        $120k - $180k
                      </div>
                    </div>
                    <p className="text-neutral-600 text-sm line-clamp-2">
                      We are looking for a Senior Software Engineer to join our growing team. 
                      You will be responsible for designing and implementing scalable web applications...
                    </p>
                  </div>
                  <div className="ml-6 flex flex-col space-y-2">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
                      Apply Now
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-neutral-600 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <button className="px-6 py-3 text-sm font-medium text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
              Load More Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}