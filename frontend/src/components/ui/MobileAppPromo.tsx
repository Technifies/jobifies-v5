'use client';

import { useState } from 'react';
import {
  Smartphone,
  Download,
  Bell,
  Search,
  Bookmark,
  MessageSquare,
  Star,
  QrCode,
  Apple,
  Play,
  Send,
  CheckCircle,
  Globe,
  Zap,
  Shield,
  Clock
} from 'lucide-react';

interface MobileAppPromoProps {
  className?: string;
}

// App features data
const appFeatures = [
  {
    icon: Search,
    title: 'Smart Job Search',
    description: 'AI-powered job matching with advanced filters and real-time notifications',
    color: 'text-primary-600',
    bgColor: 'bg-primary-100'
  },
  {
    icon: Bell,
    title: 'Instant Alerts',
    description: 'Get notified immediately when jobs matching your criteria are posted',
    color: 'text-success-600',
    bgColor: 'bg-success-100'
  },
  {
    icon: MessageSquare,
    title: 'Quick Apply',
    description: 'Apply to jobs with one tap using your saved profile and resume',
    color: 'text-warning-600',
    bgColor: 'bg-warning-100'
  },
  {
    icon: Bookmark,
    title: 'Save & Organize',
    description: 'Bookmark jobs, track applications, and manage your job search efficiently',
    color: 'text-info-600',
    bgColor: 'bg-info-100'
  },
  {
    icon: Zap,
    title: 'Fast Performance',
    description: 'Lightning-fast app performance with offline capabilities for job browsing',
    color: 'text-primary-600',
    bgColor: 'bg-primary-100'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is protected with enterprise-grade security and privacy controls',
    color: 'text-success-600',
    bgColor: 'bg-success-100'
  }
];

// App statistics
const appStats = [
  { value: '4.8', label: 'App Store Rating', icon: Star },
  { value: '500k+', label: 'Downloads', icon: Download },
  { value: '2M+', label: 'Jobs Applied', icon: Send },
  { value: '95%', label: 'User Satisfaction', icon: CheckCircle }
];

export default function MobileAppPromo({ className }: MobileAppPromoProps) {
  const [selectedOS, setSelectedOS] = useState<'ios' | 'android'>('ios');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber) {
      // Simulate sending SMS
      setLinkSent(true);
      setTimeout(() => setLinkSent(false), 3000);
    }
  };

  return (
    <section className={`py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white ${className}`}>
      <div className="container-xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Smartphone className="w-6 h-6 text-primary-200 mr-2" />
            <h2 className="text-3xl font-bold">Take Your Job Search Mobile</h2>
          </div>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Download the Jobifies mobile app for the ultimate job search experience on-the-go
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - App Promotion */}
          <div>
            {/* Mobile App Mockup */}
            <div className="relative mb-8">
              <div className="w-80 h-96 mx-auto bg-gradient-to-b from-neutral-900 to-neutral-800 rounded-3xl p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                  {/* Mockup Screen Content */}
                  <div className="absolute inset-0 bg-gradient-to-b from-primary-50 to-white p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-bold text-neutral-900">Jobifies</div>
                      <div className="flex items-center">
                        <Bell className="w-5 h-5 text-primary-600 mr-2" />
                        <div className="w-8 h-8 bg-primary-600 rounded-full" />
                      </div>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white rounded-lg p-3 shadow-sm border mb-4">
                      <div className="flex items-center text-neutral-600">
                        <Search className="w-4 h-4 mr-2" />
                        <span className="text-sm">Search jobs...</span>
                      </div>
                    </div>

                    {/* Job Cards */}
                    {[
                      { title: 'Senior Developer', company: 'Google', salary: '$150k' },
                      { title: 'Product Manager', company: 'Apple', salary: '$140k' },
                      { title: 'UX Designer', company: 'Netflix', salary: '$120k' }
                    ].map((job, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 shadow-sm border mb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-neutral-900">{job.title}</div>
                            <div className="text-xs text-neutral-600">{job.company}</div>
                            <div className="text-xs text-success-600 font-medium">{job.salary}</div>
                          </div>
                          <div className="flex">
                            <Bookmark className="w-4 h-4 text-neutral-400 mr-2" />
                            <div className="w-6 h-6 bg-neutral-200 rounded" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Floating Action Button */}
                  <div className="absolute bottom-4 right-4 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Floating Feature Badges */}
              <div className="absolute -left-4 top-1/4 bg-white text-neutral-900 px-3 py-2 rounded-full shadow-lg text-sm font-medium">
                <Bell className="w-4 h-4 inline mr-1 text-success-600" />
                Instant Alerts
              </div>
              <div className="absolute -right-4 top-1/2 bg-white text-neutral-900 px-3 py-2 rounded-full shadow-lg text-sm font-medium">
                <Zap className="w-4 h-4 inline mr-1 text-warning-600" />
                One-Tap Apply
              </div>
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button className="flex items-center bg-black hover:bg-neutral-800 text-white px-6 py-3 rounded-xl transition-colors">
                <Apple className="w-8 h-8 mr-3" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </button>

              <button className="flex items-center bg-black hover:bg-neutral-800 text-white px-6 py-3 rounded-xl transition-colors">
                <Play className="w-8 h-8 mr-3" />
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </button>
            </div>

            {/* App Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {appStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-primary-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-6 h-6 text-primary-200" />
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-primary-200">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Features & Download Options */}
          <div>
            {/* Key Features */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6">Why Choose the Jobifies App?</h3>
              <div className="grid gap-4">
                {appFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start bg-primary-500 bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                      <div className={`w-10 h-10 ${feature.bgColor} rounded-lg flex items-center justify-center mr-4 flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${feature.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-white mb-1">{feature.title}</h4>
                        <p className="text-primary-100 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Download Options */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-xl font-bold mb-4">Get the App Now</h4>
              
              {/* SMS Download */}
              <div className="mb-6">
                <h5 className="font-semibold text-primary-100 mb-3">Send download link to your phone</h5>
                <form onSubmit={handleSendLink} className="flex gap-3">
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-primary-300 text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
                  >
                    <Send className="w-4 h-4 inline mr-2" />
                    Send
                  </button>
                </form>
                
                {linkSent && (
                  <div className="mt-3 flex items-center text-success-300">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Download link sent successfully!
                  </div>
                )}
              </div>

              {/* QR Code Option */}
              <div className="text-center">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="inline-flex items-center text-primary-200 hover:text-white transition-colors"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  {showQR ? 'Hide' : 'Show'} QR Code
                </button>

                {showQR && (
                  <div className="mt-4 p-4 bg-white rounded-lg inline-block">
                    <div className="w-32 h-32 bg-neutral-900 rounded-lg flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-neutral-600 text-sm mt-2">Scan to download</p>
                  </div>
                )}
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-xl font-semibold">4.8</span>
              </div>
              <p className="text-primary-100">
                "Best job search app I've ever used. Found my dream job in just 2 weeks!"
              </p>
              <p className="text-primary-200 text-sm mt-2">- Sarah M., Product Manager</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 pt-12 border-t border-primary-500 border-opacity-20">
          <h3 className="text-2xl font-bold mb-4">
            Join 500,000+ professionals already using Jobifies mobile
          </h3>
          <p className="text-primary-100 mb-6 text-lg">
            Don't miss out on your next opportunity. Download now and start your journey.
          </p>
          
          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-6 text-primary-200">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>Available 24/7</span>
            </div>
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              <span>Global Jobs</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              <span>Lightning Fast</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}