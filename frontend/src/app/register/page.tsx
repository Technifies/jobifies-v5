import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account - Jobifies',
  description: 'Create your Jobifies account to access thousands of job opportunities and connect with top employers.',
  keywords: 'register, sign up, create account, jobifies, jobs, career, job seeker, recruiter',
};

// Enable static generation for Netlify export
// export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-sm border-b border-neutral-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Back to Home */}
            <Link
              href="/"
              className="inline-flex items-center text-sm text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">Jobifies</span>
            </Link>

            {/* Login Link */}
            <Link
              href="/login"
              className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">
          {/* Register Card */}
          <div className="bg-white shadow-lg rounded-2xl p-8 border border-neutral-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900">
                Create your account
              </h2>
              <p className="mt-2 text-neutral-600">
                Join Jobifies to discover amazing career opportunities.
              </p>
            </div>

            {/* Temporary message */}
            <div className="text-center p-6 bg-info-50 rounded-lg border border-info-200">
              <p className="text-info-800 font-medium mb-2">Registration Coming Soon</p>
              <p className="text-info-600 text-sm">
                This feature is currently under development. Please check back later.
              </p>
            </div>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-primary-600 hover:text-primary-500 transition-colors focus:outline-none focus:underline"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-neutral-100">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 text-center">
              Why join Jobifies?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-neutral-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span>Access to premium job listings</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span>AI-powered job matching</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-info-500 rounded-full"></div>
                <span>Direct employer messaging</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                <span>Career development resources</span>
              </div>
            </div>
          </div>

          {/* Help Links */}
          <div className="mt-8 text-center space-y-2">
            <div className="flex justify-center space-x-6 text-sm text-neutral-500">
              <Link
                href="/help"
                className="hover:text-neutral-700 transition-colors"
              >
                Help Center
              </Link>
              <Link
                href="/contact"
                className="hover:text-neutral-700 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/privacy"
                className="hover:text-neutral-700 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 text-center text-xs text-neutral-500">
        <p>&copy; {new Date().getFullYear()} Jobifies. All rights reserved.</p>
      </footer>

      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-primary-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-success-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-info-100 rounded-full opacity-10 blur-3xl" />
      </div>
    </div>
  );
}