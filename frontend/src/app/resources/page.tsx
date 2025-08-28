import Link from "next/link";
import { BookOpen, Users, Video, FileText, Briefcase, TrendingUp } from "lucide-react";

export default function ResourcesPage() {
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
              <Link href="/salary-insights" className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors">Salaries</Link>
              <Link href="/resources" className="text-sm font-medium text-primary-600">Resources</Link>
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
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">Career Resources</h1>
          <p className="text-lg text-neutral-600 mb-8">
            Everything you need to advance your career - from resume tips to interview prep and industry insights.
          </p>

          {/* Resource Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Resume Builder</h3>
              <p className="text-neutral-600 mb-4">
                Create professional resumes with our AI-powered builder and expert-approved templates.
              </p>
              <button className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                Build Resume →
              </button>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Interview Prep</h3>
              <p className="text-neutral-600 mb-4">
                Practice with mock interviews and get expert tips to ace your next job interview.
              </p>
              <button className="text-success-600 font-medium hover:text-success-700 transition-colors">
                Start Prep →
              </button>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-warning-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Skill Assessment</h3>
              <p className="text-neutral-600 mb-4">
                Evaluate your skills and get personalized recommendations for career growth.
              </p>
              <button className="text-warning-600 font-medium hover:text-warning-700 transition-colors">
                Take Assessment →
              </button>
            </div>
          </div>

          {/* Latest Articles */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Latest Career Articles</h2>
              <button className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                View All →
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "10 Tips for Remote Work Success",
                  excerpt: "Master the art of working from home with these proven strategies...",
                  readTime: "5 min read",
                  category: "Remote Work"
                },
                {
                  title: "Negotiating Your Salary: A Complete Guide",
                  excerpt: "Learn how to confidently negotiate a better compensation package...",
                  readTime: "8 min read",
                  category: "Salary"
                },
                {
                  title: "The Future of Tech Careers in 2025",
                  excerpt: "Explore emerging technology roles and skills that will be in demand...",
                  readTime: "6 min read",
                  category: "Tech Trends"
                }
              ].map((article, index) => (
                <div key={index} className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-neutral-500">{article.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">{article.title}</h3>
                  <p className="text-sm text-neutral-600 mb-3">{article.excerpt}</p>
                  <button className="text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors">
                    Read More →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tools Section */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Career Tools</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                <div className="w-10 h-10 bg-info-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-info-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Career Path Planner</h3>
                  <p className="text-sm text-neutral-600 mb-2">
                    Map out your career journey and set achievable goals.
                  </p>
                  <button className="text-info-600 text-sm font-medium hover:text-info-700 transition-colors">
                    Plan Career →
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Networking Hub</h3>
                  <p className="text-sm text-neutral-600 mb-2">
                    Connect with professionals in your industry.
                  </p>
                  <button className="text-success-600 text-sm font-medium hover:text-success-700 transition-colors">
                    Start Networking →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}