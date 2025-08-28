import Link from "next/link";
import { Search, DollarSign, TrendingUp, BarChart3, Briefcase, MapPin } from "lucide-react";

export default function SalaryInsightsPage() {
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
              <Link href="/companies" className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors">Companies</Link>
              <Link href="/salary-insights" className="text-sm font-medium text-primary-600">Salaries</Link>
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
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">Salary Insights</h1>
          <p className="text-lg text-neutral-600 mb-8">
            Get comprehensive salary data, market trends, and compensation insights to make informed career decisions.
          </p>

          {/* Search Section */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Job title or role"
                  className="block w-full px-3 py-3 pl-10 pr-4 text-base text-neutral-900 bg-white border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Location"
                  className="block w-full px-3 py-3 pl-10 pr-4 text-base text-neutral-900 bg-white border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <button className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg border text-white bg-primary-600 border-transparent hover:bg-primary-700 focus:ring-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200">
                <BarChart3 className="w-5 h-5 mr-2" />
                Get Insights
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-success-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-success-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">$125,000</h3>
              <p className="text-sm text-neutral-600">Average Software Engineer Salary</p>
              <p className="text-xs text-success-600 mt-1">↑ 8% from last year</p>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">95%</h3>
              <p className="text-sm text-neutral-600">Salary Data Accuracy</p>
              <p className="text-xs text-primary-600 mt-1">Based on 500k+ reports</p>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-warning-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-warning-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">12%</h3>
              <p className="text-sm text-neutral-600">Average Salary Growth</p>
              <p className="text-xs text-warning-600 mt-1">Year over year</p>
            </div>
          </div>

          {/* Popular Roles */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Popular Roles & Salaries</h2>
            <div className="space-y-4">
              {[
                { role: "Software Engineer", salary: "$95k - $155k", growth: "+8%", companies: "2,500+" },
                { role: "Product Manager", salary: "$110k - $180k", growth: "+12%", companies: "1,200+" },
                { role: "Data Scientist", salary: "$105k - $170k", growth: "+15%", companies: "800+" },
                { role: "UX Designer", salary: "$85k - $135k", growth: "+10%", companies: "600+" },
                { role: "DevOps Engineer", salary: "$100k - $165k", growth: "+18%", companies: "900+" },
              ].map((job, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900">{job.role}</h3>
                    <p className="text-sm text-neutral-600">{job.companies} companies hiring</p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="font-semibold text-neutral-900">{job.salary}</p>
                      <p className="text-sm text-success-600">{job.growth} YoY</p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Get Personalized Salary Insights</h2>
            <p className="text-primary-100 mb-6">
              Create a free account to get customized salary reports based on your experience and location.
            </p>
            <Link href="/register" className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg border bg-white text-primary-600 border-transparent hover:bg-neutral-100 transition-colors">
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}