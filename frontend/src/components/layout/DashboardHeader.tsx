'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut,
  Shield,
  Mail
} from 'lucide-react';

import { useAuth } from '@/lib/stores/authStore';
import { UserRole } from '@/types/auth';

import Button from '@/components/ui/Button';
import { WarningAlert } from '@/components/ui/Alert';

interface DashboardHeaderProps {
  onMenuToggle?: () => void;
  showMobileMenu?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onMenuToggle,
  showMobileMenu = false,
}) => {
  const router = useRouter();
  const { user, logout, isVerified, resendVerification } = useAuth();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleResendVerification = async () => {
    if (user?.email) {
      try {
        await resendVerification(user.email);
      } catch (error) {
        console.error('Resend verification error:', error);
      }
    }
  };

  const roleDisplayName = user?.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'User';

  return (
    <>
      {/* Email Verification Banner */}
      {user && !isVerified() && (
        <div className="bg-warning-50 border-b border-warning-200 px-4 py-3">
          <WarningAlert>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-warning-600" />
                <span className="text-sm font-medium">
                  Please verify your email address to access all features.
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleResendVerification}
                  className="text-warning-700 hover:text-warning-800"
                >
                  Resend
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => router.push('/verify-email')}
                  className="text-warning-700 hover:text-warning-800"
                >
                  Verify Now
                </Button>
              </div>
            </div>
          </WarningAlert>
        </div>
      )}

      {/* Main Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Toggle menu"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              {/* Logo */}
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">J</span>
                </div>
                <span className="text-xl font-bold text-neutral-900 hidden sm:block">
                  Jobifies
                </span>
              </Link>
            </div>

            {/* Center Section - Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search jobs, companies, or candidates..."
                  className="form-input pl-10 w-full"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Mobile Search */}
              <button className="md:hidden p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 relative"
                >
                  <Bell className="w-5 h-5" />
                  {/* Notification badge */}
                  <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <h3 className="text-sm font-semibold text-neutral-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="px-4 py-8 text-center text-neutral-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-2 rounded-md text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-primary-600" />
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-neutral-500">{roleDisplayName}</p>
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-semibold text-neutral-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-neutral-500">{user?.email}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                          user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN
                            ? 'bg-error-100 text-error-700'
                            : user?.role === UserRole.RECRUITER
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-success-100 text-success-700'
                        }`}>
                          {(user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) && (
                            <Shield className="w-3 h-3" />
                          )}
                          <span>{roleDisplayName}</span>
                        </div>
                        {!isVerified() && (
                          <div className="px-2 py-1 bg-warning-100 text-warning-700 rounded-full text-xs">
                            Unverified
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      >
                        <User className="w-4 h-4 mr-3" />
                        View Profile
                      </Link>
                      
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>

                      {(user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) && (
                        <Link
                          href="/admin"
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        >
                          <Shield className="w-4 h-4 mr-3" />
                          Admin Panel
                        </Link>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-neutral-100 pt-1">
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-error-700 hover:bg-error-50 disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        {isLoggingOut ? 'Signing out...' : 'Sign out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close dropdowns */}
      {(showProfileMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowProfileMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </>
  );
};

export default DashboardHeader;