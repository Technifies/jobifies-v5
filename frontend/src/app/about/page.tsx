import Link from "next/link";
import { Users, Target, Award, Briefcase, Heart, Globe } from "lucide-react";

export default function AboutPage() {
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
              <Link href="/resources" className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors">Resources</Link>
              <Link href="/about" className="text-sm font-medium text-primary-600">About</Link>
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
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-neutral-900 mb-6">About Jobifies</h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              We&apos;re on a mission to revolutionize job searching with AI-powered matching, 
              connecting talented professionals with their dream opportunities worldwide.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Our Mission</h2>
              <p className="text-neutral-600">
                To make job searching more efficient, transparent, and accessible for everyone. 
                We believe that finding the right job should be based on skills, potential, 
                and cultural fit, not just connections or luck.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-success-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Our Vision</h2>
              <p className="text-neutral-600">
                A world where every professional can find meaningful work that aligns with their 
                goals and values, while companies can discover and retain top talent through 
                intelligent matching and data-driven insights.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8 mb-16">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">500k+</div>
                <div className="text-neutral-600">Active Job Seekers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">8k+</div>
                <div className="text-neutral-600">Partner Companies</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">125k+</div>
                <div className="text-neutral-600">Job Opportunities</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">95%</div>
                <div className="text-neutral-600">Match Success Rate</div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-neutral-200 p-6 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">People First</h3>
                <p className="text-sm text-neutral-600">
                  We put people at the center of everything we do, creating meaningful connections 
                  and opportunities.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-neutral-200 p-6 text-center">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-success-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Excellence</h3>
                <p className="text-sm text-neutral-600">
                  We strive for excellence in our technology, user experience, and service quality.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-neutral-200 p-6 text-center">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-warning-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Diversity</h3>
                <p className="text-sm text-neutral-600">
                  We champion diversity and inclusion, believing different perspectives make us stronger.
                </p>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8 mb-16">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Sarah Chen", role: "CEO & Co-Founder", bio: "Former VP of Product at LinkedIn" },
                { name: "Marcus Rodriguez", role: "CTO & Co-Founder", bio: "Ex-Senior Engineer at Google" },
                { name: "Emily Johnson", role: "VP of Engineering", bio: "Former Tech Lead at Microsoft" }
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{member.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-primary-600 mb-2">{member.role}</p>
                  <p className="text-xs text-neutral-600">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Join Our Community?</h2>
            <p className="text-primary-100 mb-6">
              Whether you&apos;re looking for your next opportunity or seeking top talent, we&apos;re here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg border bg-white text-primary-600 border-transparent hover:bg-neutral-100 transition-colors">
                Join as Job Seeker
              </Link>
              <Link href="/register" className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary-600 transition-colors">
                Post Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}