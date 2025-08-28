import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import EmailVerificationForm from '@/components/auth/EmailVerificationForm';

export const metadata: Metadata = {
  title: 'Verify Email - Jobifies',
  description: 'Verify your email address to complete your Jobifies account setup and access all features.',
  keywords: 'email verification, verify email, jobifies, account activation',
};

export default function VerifyEmailPage() {
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

            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Email Verification Card */}
          <div className="bg-white shadow-lg rounded-2xl p-8 border border-neutral-100">
            <EmailVerificationForm />
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-neutral-100">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 text-center">
              Need help?
            </h3>
            <div className="space-y-3 text-sm text-neutral-600">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Email not arriving?</p>
                  <p>Check your spam/junk folder or try adding noreply@jobifies.com to your contacts.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-info-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Link not working?</p>
                  <p>Copy the full URL from your email and paste it directly into your browser.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-warning-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Email expired?</p>
                  <p>Verification links are valid for 24 hours. Request a new one if needed.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Help Links */}
          <div className="mt-8 text-center space-y-2">
            <div className="flex justify-center space-x-6 text-sm text-neutral-500">
              <Link
                href="/help/email-verification"
                className="hover:text-neutral-700 transition-colors"
              >
                Verification Help
              </Link>
              <Link
                href="/contact"
                className="hover:text-neutral-700 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/help"
                className="hover:text-neutral-700 transition-colors"
              >
                Help Center
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
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-info-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-success-100 rounded-full opacity-10 blur-3xl" />
      </div>
    </div>
  );
}