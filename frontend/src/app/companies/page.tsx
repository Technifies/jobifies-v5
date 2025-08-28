import Link from "next/link";
import { Search, Building2, MapPin, Users, Briefcase, Star } from "lucide-react";

export default function CompaniesPage() {
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
              <Link href="/jobs" className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors">Find Jobs</Link>
              <Link href="/companies" className="text-sm font-medium text-primary-600">Companies</Link>
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">Explore Companies</h1>
          <p className="text-lg text-neutral-600 mb-8">
            Discover top companies, read reviews, and learn about company culture before you apply.
          </p>

          {/* Search Section */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 mb-8">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search companies by name or industry"
                  className="block w-full px-3 py-3 pl-10 pr-4 text-base text-neutral-900 bg-white border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <button className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg border text-white bg-primary-600 border-transparent hover:bg-primary-700 focus:ring-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200">
                Search
              </button>
            </div>
          </div>

          {/* Featured Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((company) => (
              <div key={company} className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">TechCorp Inc.</h3>
                      <p className="text-sm text-neutral-600">Technology</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-neutral-700">4.8</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-neutral-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    San Francisco, CA
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Users className="w-4 h-4 mr-2" />
                    1,000-5,000 employees
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    25 open positions
                  </div>
                </div>

                <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
                  Leading technology company focused on innovative solutions for modern businesses. 
                  We offer excellent benefits and a collaborative work environment.
                </p>

                <div className="flex space-x-2">
                  <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
                    View Jobs
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-neutral-600 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <button className="px-6 py-3 text-sm font-medium text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
              Load More Companies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}