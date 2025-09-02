import Link from "next/link";
import { Briefcase } from "lucide-react";
import JobListings from "@/components/jobs/JobListings";

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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">Find Your Next Job</h1>
            <p className="text-lg text-neutral-600">
              Discover thousands of job opportunities from top companies worldwide. 
              Use our advanced search to find the perfect match for your skills and career goals.
            </p>
          </div>

          {/* Dynamic Job Listings */}
          <JobListings showFilters={true} />
        </div>
      </div>
    </div>
  );
}