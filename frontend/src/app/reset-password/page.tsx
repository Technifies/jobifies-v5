import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password - Jobifies',
  description: 'Create a new password for your Jobifies account using the reset link sent to your email.',
  keywords: 'reset password, new password, jobifies, account recovery',
};

export default function ResetPasswordPage() {
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
        <div className="w-full max-w-md">
          {/* Reset Password Card */}
          <div className="bg-white shadow-lg rounded-2xl p-8 border border-neutral-100">
            <Suspense fallback={<div className="text-center">Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>

          {/* Help Links */}
          <div className="mt-8 text-center space-y-2">
            <div className="flex justify-center space-x-6 text-sm text-neutral-500">
              <Link
                href="/help/password-security"
                className="hover:text-neutral-700 transition-colors"
              >
                Password Security Tips
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
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-success-100 rounded-full opacity-20 blur-3xl" />
      </div>
    </div>
  );
}