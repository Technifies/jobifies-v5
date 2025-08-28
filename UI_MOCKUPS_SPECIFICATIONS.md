# Jobifies UI Mockups & Specifications

## Landing Page Design

### Hero Section Layout
```html
<!-- Landing Page Hero Section -->
<section class="hero-section bg-gradient-to-br from-primary-50 via-white to-primary-25 relative overflow-hidden">
  <!-- Background Pattern/Decoration -->
  <div class="absolute inset-0 opacity-10">
    <svg class="absolute top-20 right-20 w-64 h-64 text-primary-200" viewBox="0 0 100 100">
      <!-- Geometric pattern SVG -->
    </svg>
  </div>
  
  <div class="container mx-auto px-4 py-20 lg:py-32">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <!-- Hero Content -->
      <div class="hero-content space-y-8">
        <div class="space-y-6">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 leading-tight">
            Find Your 
            <span class="text-primary-600 relative">
              Dream Job
              <!-- Underline decoration -->
              <svg class="absolute -bottom-2 left-0 w-full h-3 text-primary-200" viewBox="0 0 100 12">
                <path d="M2 6C20 0, 40 12, 60 6C75 2, 90 10, 98 6" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </span>
            Today
          </h1>
          
          <p class="text-xl text-neutral-600 max-w-lg leading-relaxed">
            Connect with top employers and discover opportunities that match your skills, ambitions, and career goals.
          </p>
        </div>
        
        <!-- Hero Search Bar -->
        <div class="hero-search bg-white p-2 rounded-2xl shadow-lg border border-neutral-200 max-w-2xl">
          <div class="grid md:grid-cols-3 gap-2">
            <div class="relative">
              <input 
                type="text" 
                placeholder="Job title, keywords..."
                class="w-full px-4 py-3 text-base border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <svg class="absolute right-3 top-3.5 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            
            <div class="relative">
              <input 
                type="text" 
                placeholder="Location"
                class="w-full px-4 py-3 text-base border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <svg class="absolute right-3 top-3.5 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              </svg>
            </div>
            
            <button class="btn-hero-search bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center">
              <span class="hidden sm:inline">Search Jobs</span>
              <span class="sm:hidden">Search</span>
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5-5 5M6 12h12"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Quick Stats -->
        <div class="hero-stats flex flex-wrap gap-8 text-sm text-neutral-600">
          <div class="flex items-center">
            <div class="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
            <span><strong class="text-neutral-900">10,000+</strong> Active Jobs</span>
          </div>
          <div class="flex items-center">
            <div class="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
            <span><strong class="text-neutral-900">5,000+</strong> Companies</span>
          </div>
          <div class="flex items-center">
            <div class="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
            <span><strong class="text-neutral-900">50,000+</strong> Success Stories</span>
          </div>
        </div>
      </div>
      
      <!-- Hero Illustration/Image -->
      <div class="hero-image relative">
        <div class="relative z-10">
          <img 
            src="/hero-illustration.svg" 
            alt="Professional networking and job search illustration"
            class="w-full h-auto max-w-lg mx-auto"
          />
        </div>
        <!-- Floating Elements -->
        <div class="floating-cards absolute inset-0 pointer-events-none">
          <!-- Job card preview -->
          <div class="absolute top-10 -left-4 bg-white p-4 rounded-lg shadow-lg border border-neutral-200 transform rotate-6 animate-float-slow">
            <div class="flex items-center mb-2">
              <div class="w-8 h-8 bg-primary-100 rounded mr-2"></div>
              <div>
                <div class="h-2 bg-neutral-200 rounded w-16 mb-1"></div>
                <div class="h-2 bg-neutral-100 rounded w-12"></div>
              </div>
            </div>
            <div class="h-2 bg-success-200 rounded w-20"></div>
          </div>
          
          <!-- Notification card -->
          <div class="absolute bottom-20 -right-4 bg-white p-3 rounded-lg shadow-lg border border-neutral-200 transform -rotate-3 animate-float-delay">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <div class="text-xs text-neutral-700">New match found!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Features Section
```html
<!-- Key Features Section -->
<section class="features-section py-20 bg-white">
  <div class="container mx-auto px-4">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
        Why Choose Jobifies?
      </h2>
      <p class="text-xl text-neutral-600 max-w-3xl mx-auto">
        Our AI-powered platform makes job searching smarter, faster, and more effective than ever before.
      </p>
    </div>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Feature 1: AI Matching -->
      <div class="feature-card group hover:shadow-lg transition-shadow duration-300 p-8 rounded-xl border border-neutral-100 hover:border-primary-200">
        <div class="feature-icon w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors duration-300">
          <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-neutral-900 mb-3">
          AI-Powered Matching
        </h3>
        <p class="text-neutral-600 leading-relaxed mb-4">
          Our intelligent algorithm analyzes your skills, experience, and preferences to connect you with the most relevant opportunities.
        </p>
        <a href="/features/ai-matching" class="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center">
          Learn more
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
      
      <!-- Feature 2: One-Click Apply -->
      <div class="feature-card group hover:shadow-lg transition-shadow duration-300 p-8 rounded-xl border border-neutral-100 hover:border-primary-200">
        <div class="feature-icon w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-success-200 transition-colors duration-300">
          <svg class="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-neutral-900 mb-3">
          One-Click Applications
        </h3>
        <p class="text-neutral-600 leading-relaxed mb-4">
          Apply to multiple jobs instantly with your saved profile information. No more repetitive form filling.
        </p>
        <a href="/features/quick-apply" class="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center">
          Learn more
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
      
      <!-- Feature 3: Real-time Updates -->
      <div class="feature-card group hover:shadow-lg transition-shadow duration-300 p-8 rounded-xl border border-neutral-100 hover:border-primary-200">
        <div class="feature-icon w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors duration-300">
          <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19H6.5A2.5 2.5 0 014 16.5v-7a4.5 4.5 0 119 0v7a.5.5 0 01-.5.5z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-neutral-900 mb-3">
          Real-Time Updates
        </h3>
        <p class="text-neutral-600 leading-relaxed mb-4">
          Stay informed with instant notifications about application status, new job matches, and employer messages.
        </p>
        <a href="/features/notifications" class="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center">
          Learn more
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</section>
```

## Job Seeker Dashboard

### Dashboard Layout Structure
```html
<!-- Job Seeker Dashboard -->
<div class="dashboard-layout min-h-screen bg-neutral-50">
  <!-- Dashboard Header -->
  <header class="dashboard-header bg-white border-b border-neutral-200 sticky top-0 z-40">
    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center space-x-4">
        <h1 class="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <span class="text-sm text-neutral-500">Welcome back, John!</span>
      </div>
      
      <div class="flex items-center space-x-4">
        <!-- Quick Actions -->
        <button class="btn-quick-action px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200">
          <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          Find Jobs
        </button>
        
        <!-- Profile Completion -->
        <div class="profile-completion-widget flex items-center space-x-2">
          <div class="relative w-10 h-10">
            <svg class="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
              <path
                class="text-neutral-200"
                stroke="currentColor"
                stroke-width="3"
                fill="transparent"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="text-primary-600"
                stroke="currentColor"
                stroke-width="3"
                stroke-dasharray="85, 100"
                fill="transparent"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-xs font-medium text-primary-600">85%</span>
            </div>
          </div>
          <div class="text-sm">
            <p class="font-medium text-neutral-900">Profile</p>
            <p class="text-neutral-500">85% complete</p>
          </div>
        </div>
      </div>
    </div>
  </header>
  
  <div class="dashboard-content flex">
    <!-- Sidebar Navigation -->
    <nav class="dashboard-sidebar w-64 bg-white border-r border-neutral-200 min-h-screen">
      <!-- Sidebar content from component library -->
    </nav>
    
    <!-- Main Dashboard Content -->
    <main class="dashboard-main flex-1 p-6 space-y-8">
      <!-- Dashboard Overview Cards -->
      <section class="overview-section">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Applications Card -->
          <div class="overview-card bg-white p-6 rounded-xl border border-neutral-200 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <span class="text-2xl font-bold text-neutral-900">12</span>
            </div>
            <h3 class="text-sm font-medium text-neutral-600 mb-2">Active Applications</h3>
            <div class="flex items-center text-sm text-success-600">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
              </svg>
              <span>+3 this week</span>
            </div>
          </div>
          
          <!-- Profile Views Card -->
          <div class="overview-card bg-white p-6 rounded-xl border border-neutral-200 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </div>
              <span class="text-2xl font-bold text-neutral-900">248</span>
            </div>
            <h3 class="text-sm font-medium text-neutral-600 mb-2">Profile Views</h3>
            <div class="flex items-center text-sm text-success-600">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
              </svg>
              <span>+15% this month</span>
            </div>
          </div>
          
          <!-- Job Matches Card -->
          <div class="overview-card bg-white p-6 rounded-xl border border-neutral-200 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="text-2xl font-bold text-neutral-900">8</span>
            </div>
            <h3 class="text-sm font-medium text-neutral-600 mb-2">New Job Matches</h3>
            <div class="flex items-center text-sm text-primary-600">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Updated daily</span>
            </div>
          </div>
          
          <!-- Messages Card -->
          <div class="overview-card bg-white p-6 rounded-xl border border-neutral-200 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <span class="text-2xl font-bold text-neutral-900">5</span>
            </div>
            <h3 class="text-sm font-medium text-neutral-600 mb-2">Unread Messages</h3>
            <div class="flex items-center text-sm text-amber-600">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z"/>
              </svg>
              <span>3 from recruiters</span>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Recent Activity & Recommendations -->
      <section class="activity-section grid lg:grid-cols-3 gap-8">
        <!-- Recent Activity -->
        <div class="activity-feed lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-neutral-900">Recent Activity</h3>
            <button class="text-sm text-primary-600 hover:text-primary-700">View all</button>
          </div>
          
          <div class="space-y-4">
            <!-- Activity Item -->
            <div class="activity-item flex items-start space-x-4 p-4 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
              <div class="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-neutral-900">
                  Your application for <strong>Senior Developer</strong> at TechCorp was viewed by the hiring manager.
                </p>
                <p class="text-xs text-neutral-500 mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div class="activity-item flex items-start space-x-4 p-4 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-neutral-900">
                  8 new job matches found based on your profile and preferences.
                </p>
                <p class="text-xs text-neutral-500 mt-1">4 hours ago</p>
              </div>
            </div>
            
            <div class="activity-item flex items-start space-x-4 p-4 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
              <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-neutral-900">
                  Your profile received 15 new views from potential employers.
                </p>
                <p class="text-xs text-neutral-500 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Job Recommendations Sidebar -->
        <div class="recommendations-sidebar bg-white rounded-xl border border-neutral-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-neutral-900">For You</h3>
            <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          
          <div class="space-y-4">
            <!-- Recommended Job -->
            <div class="job-recommendation p-4 border border-neutral-200 rounded-lg hover:border-primary-200 hover:shadow-sm transition-all duration-200">
              <div class="flex items-start space-x-3 mb-3">
                <img src="/company-logo.jpg" alt="Company" class="w-8 h-8 rounded object-cover">
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-neutral-900 truncate">
                    Product Designer
                  </h4>
                  <p class="text-xs text-neutral-600">InnovateCorp</p>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="job-match-badge inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <div class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                  92% match
                </span>
                <span class="text-xs text-neutral-500">Remote</span>
              </div>
            </div>
            
            <!-- More recommendations... -->
          </div>
          
          <button class="w-full mt-4 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200">
            View All Matches
          </button>
        </div>
      </section>
    </main>
  </div>
</div>
```

## Job Search Results Page

### Search Results Layout
```html
<!-- Job Search Results Page -->
<div class="search-results-page min-h-screen bg-neutral-50">
  <!-- Search Header -->
  <header class="search-header bg-white border-b border-neutral-200 sticky top-0 z-40">
    <div class="container mx-auto px-4 py-4">
      <!-- Search Bar -->
      <div class="search-bar-container bg-white p-2 rounded-xl shadow-sm border border-neutral-200 mb-4">
        <div class="grid md:grid-cols-4 gap-2">
          <div class="relative md:col-span-2">
            <input 
              type="text" 
              value="Software Engineer"
              class="w-full px-4 py-3 text-base border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
            />
            <svg class="absolute right-3 top-3.5 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          
          <div class="relative">
            <input 
              type="text" 
              value="San Francisco"
              class="w-full px-4 py-3 text-base border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
            />
            <svg class="absolute right-3 top-3.5 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            </svg>
          </div>
          
          <button class="btn-search bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200">
            Search
          </button>
        </div>
      </div>
      
      <!-- Search Results Meta -->
      <div class="search-meta flex items-center justify-between">
        <div class="search-info">
          <p class="text-sm text-neutral-600">
            <strong class="text-neutral-900">1,247</strong> jobs found for "Software Engineer" in San Francisco
          </p>
        </div>
        
        <div class="search-controls flex items-center space-x-4">
          <!-- Sort Dropdown -->
          <div class="sort-dropdown relative">
            <select class="appearance-none bg-white border border-neutral-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="relevance">Sort by: Relevance</option>
              <option value="date">Date Posted</option>
              <option value="salary-high">Salary: High to Low</option>
              <option value="salary-low">Salary: Low to High</option>
              <option value="company">Company A-Z</option>
            </select>
          </div>
          
          <!-- View Toggle -->
          <div class="view-toggle flex bg-neutral-100 rounded-lg p-1">
            <button class="view-btn-list px-3 py-2 text-sm font-medium bg-white text-primary-600 rounded-md shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
            </button>
            <button class="view-btn-grid px-3 py-2 text-sm font-medium text-neutral-600 hover:text-primary-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
  
  <div class="search-content container mx-auto px-4 py-6">
    <div class="grid lg:grid-cols-4 gap-8">
      <!-- Filters Sidebar -->
      <aside class="filters-sidebar lg:col-span-1">
        <!-- Filter panel from component library -->
        <div class="filter-panel bg-white rounded-lg border border-neutral-200 shadow-sm p-6 sticky top-24">
          <!-- Filters content -->
        </div>
      </aside>
      
      <!-- Job Results -->
      <main class="job-results lg:col-span-3">
        <div class="space-y-4">
          <!-- Featured Jobs Section -->
          <div class="featured-jobs mb-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-neutral-900 flex items-center">
                <svg class="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                Featured Jobs
              </h3>
              <span class="text-sm text-neutral-500">Sponsored</span>
            </div>
            
            <div class="featured-job-card bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-xl shadow-lg">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center">
                  <img src="/featured-company-logo.jpg" alt="Company" class="w-12 h-12 rounded-lg bg-white p-2 mr-4">
                  <div>
                    <h4 class="text-xl font-bold mb-1">Senior Full Stack Engineer</h4>
                    <p class="text-primary-100">TechVantage Solutions</p>
                  </div>
                </div>
                <span class="featured-badge bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
              </div>
              
              <div class="flex flex-wrap gap-3 mb-4">
                <span class="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">Remote</span>
                <span class="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">Full-time</span>
                <span class="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">$140k - $180k</span>
              </div>
              
              <p class="text-primary-50 mb-6 line-clamp-2">
                Join our innovative team building next-generation fintech solutions. We offer competitive compensation, equity, and unlimited PTO.
              </p>
              
              <div class="flex items-center justify-between">
                <div class="text-primary-100 text-sm">
                  Posted 2 days ago • 50+ applicants
                </div>
                <button class="bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
          
          <!-- Regular Job Listings -->
          <div class="job-listings space-y-4">
            <!-- Job Card 1 -->
            <div class="job-card bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-start space-x-4">
                  <img src="/company-logo-1.jpg" alt="Company" class="w-14 h-14 rounded-lg object-cover">
                  <div>
                    <h4 class="text-lg font-semibold text-neutral-900 mb-1">
                      Senior Software Engineer
                    </h4>
                    <p class="text-sm text-neutral-600 mb-2">InnovateTech Corp</p>
                    <div class="flex items-center text-sm text-neutral-500">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      </svg>
                      San Francisco, CA (Hybrid)
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3">
                  <div class="job-match-indicator text-right">
                    <div class="flex items-center justify-end mb-1">
                      <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span class="text-sm text-green-700 font-medium">88% match</span>
                    </div>
                  </div>
                  
                  <button class="save-job-btn p-2 text-neutral-400 hover:text-red-500 transition-colors duration-200">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="job-tags flex flex-wrap gap-2 mb-4">
                <span class="job-type-badge bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  Full-time
                </span>
                <span class="experience-badge bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  Senior Level
                </span>
                <span class="tech-badge bg-neutral-100 text-neutral-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  React
                </span>
                <span class="tech-badge bg-neutral-100 text-neutral-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  Node.js
                </span>
                <span class="tech-badge bg-neutral-100 text-neutral-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  AWS
                </span>
              </div>
              
              <p class="job-description text-sm text-neutral-600 mb-4 line-clamp-2">
                We're looking for a Senior Software Engineer to join our growing team. You'll work on cutting-edge projects using React, Node.js, and AWS to build scalable web applications that serve millions of users.
              </p>
              
              <div class="job-details flex items-center justify-between text-sm text-neutral-500">
                <div class="flex items-center space-x-4">
                  <span class="salary-range font-medium text-primary-600">$120k - $160k</span>
                  <span>• Posted 3 days ago</span>
                  <span>• 25 applicants</span>
                </div>
                
                <div class="job-actions flex items-center space-x-3">
                  <button class="btn-outline-sm px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors duration-200">
                    Quick Apply
                  </button>
                  <button class="btn-primary-sm px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Additional job cards... -->
          </div>
          
          <!-- Load More / Pagination -->
          <div class="load-more-section text-center py-8">
            <button class="load-more-btn px-8 py-3 text-base font-medium text-primary-600 bg-white border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors duration-200">
              Load More Jobs
            </button>
            <p class="text-sm text-neutral-500 mt-3">
              Showing 20 of 1,247 results
            </p>
          </div>
        </div>
      </main>
    </div>
  </div>
</div>
```

## Job Details Page

### Job Details Layout
```html
<!-- Job Details Page -->
<div class="job-details-page min-h-screen bg-neutral-50">
  <!-- Breadcrumb Navigation -->
  <nav class="breadcrumb-nav bg-white border-b border-neutral-200 py-4">
    <div class="container mx-auto px-4">
      <ol class="flex items-center space-x-2 text-sm text-neutral-500">
        <li><a href="/" class="hover:text-primary-600">Home</a></li>
        <li><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></li>
        <li><a href="/jobs" class="hover:text-primary-600">Jobs</a></li>
        <li><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></li>
        <li class="text-neutral-900">Senior Software Engineer</li>
      </ol>
    </div>
  </nav>
  
  <div class="job-details-content container mx-auto px-4 py-8">
    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Main Job Content -->
      <main class="job-details-main lg:col-span-2">
        <!-- Job Header -->
        <header class="job-header bg-white rounded-xl border border-neutral-200 shadow-sm p-8 mb-8">
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-start space-x-6">
              <img 
                src="/company-logo.jpg" 
                alt="InnovateTech Corp Logo" 
                class="w-20 h-20 rounded-xl object-cover border border-neutral-200"
              />
              <div>
                <h1 class="text-3xl font-bold text-neutral-900 mb-2">
                  Senior Software Engineer
                </h1>
                <div class="company-info flex items-center space-x-4 mb-3">
                  <a href="/company/innovatetech" class="text-lg font-medium text-primary-600 hover:text-primary-700">
                    InnovateTech Corp
                  </a>
                  <div class="flex items-center text-blue-600">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-sm font-medium">Verified</span>
                  </div>
                </div>
                <div class="job-meta flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    </svg>
                    San Francisco, CA (Hybrid)
                  </div>
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Posted 3 days ago
                  </div>
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                    </svg>
                    28 applicants
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Job Match Score -->
            <div class="job-match-score text-center">
              <div class="relative w-20 h-20">
                <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    class="text-neutral-200"
                    stroke="currentColor"
                    stroke-width="3"
                    fill="transparent"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    class="text-green-500"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-dasharray="88, 100"
                    fill="transparent"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-lg font-bold text-green-700">88%</span>
                </div>
              </div>
              <p class="text-sm text-green-700 font-medium mt-1">Great match</p>
            </div>
          </div>
          
          <!-- Job Tags -->
          <div class="job-tags flex flex-wrap gap-3 mb-6">
            <span class="job-type-badge bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
              Full-time
            </span>
            <span class="experience-badge bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm font-medium">
              Senior Level
            </span>
            <span class="salary-badge bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium">
              $120k - $160k
            </span>
            <span class="remote-badge bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-sm font-medium">
              Hybrid
            </span>
          </div>
          
          <!-- Action Buttons -->
          <div class="job-actions flex items-center space-x-4">
            <button class="btn-apply-large flex-1 sm:flex-none px-8 py-3 text-base font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200">
              Apply Now
            </button>
            <button class="btn-save-large px-6 py-3 text-base font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
              <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              Save Job
            </button>
            <button class="btn-share px-6 py-3 text-base font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
              <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
              </svg>
              Share
            </button>
          </div>
        </header>
        
        <!-- Job Description Content -->
        <div class="job-description-content space-y-8">
          <!-- Job Description -->
          <section class="job-description bg-white rounded-xl border border-neutral-200 shadow-sm p-8">
            <h2 class="text-xl font-bold text-neutral-900 mb-6">Job Description</h2>
            
            <div class="prose prose-neutral max-w-none">
              <p class="text-neutral-700 leading-relaxed mb-6">
                We're looking for a Senior Software Engineer to join our growing team and help build the next generation of our platform. You'll work closely with our product, design, and engineering teams to deliver high-quality software that serves millions of users worldwide.
              </p>
              
              <h3 class="text-lg font-semibold text-neutral-900 mb-4">What You'll Do</h3>
              <ul class="list-disc list-inside space-y-2 text-neutral-700 mb-6">
                <li>Design and develop scalable web applications using React, Node.js, and AWS</li>
                <li>Collaborate with cross-functional teams to define, design, and ship new features</li>
                <li>Write clean, maintainable, and well-tested code</li>
                <li>Participate in code reviews and provide constructive feedback</li>
                <li>Mentor junior developers and contribute to team knowledge sharing</li>
                <li>Stay up-to-date with the latest industry trends and technologies</li>
              </ul>
              
              <h3 class="text-lg font-semibold text-neutral-900 mb-4">What We're Looking For</h3>
              <ul class="list-disc list-inside space-y-2 text-neutral-700 mb-6">
                <li>5+ years of experience in full-stack web development</li>
                <li>Strong proficiency in JavaScript, React, and Node.js</li>
                <li>Experience with cloud platforms, preferably AWS</li>
                <li>Solid understanding of database design and optimization</li>
                <li>Experience with agile development methodologies</li>
                <li>Excellent communication and collaboration skills</li>
              </ul>
              
              <h3 class="text-lg font-semibold text-neutral-900 mb-4">Nice to Have</h3>
              <ul class="list-disc list-inside space-y-2 text-neutral-700 mb-6">
                <li>Experience with TypeScript and GraphQL</li>
                <li>Knowledge of containerization (Docker, Kubernetes)</li>
                <li>Experience with CI/CD pipelines</li>
                <li>Background in fintech or B2B SaaS</li>
              </ul>
            </div>
          </section>
          
          <!-- Skills & Requirements -->
          <section class="skills-requirements bg-white rounded-xl border border-neutral-200 shadow-sm p-8">
            <h2 class="text-xl font-bold text-neutral-900 mb-6">Skills & Requirements</h2>
            
            <div class="skills-grid grid md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-lg font-semibold text-neutral-900 mb-4">Required Skills</h3>
                <div class="skills-list space-y-3">
                  <div class="skill-item flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span class="text-neutral-900 font-medium">JavaScript</span>
                    <div class="skill-match flex items-center text-green-600">
                      <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span class="text-sm font-medium">Expert</span>
                    </div>
                  </div>
                  <div class="skill-item flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span class="text-neutral-900 font-medium">React</span>
                    <div class="skill-match flex items-center text-green-600">
                      <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span class="text-sm font-medium">Expert</span>
                    </div>
                  </div>
                  <div class="skill-item flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span class="text-neutral-900 font-medium">Node.js</span>
                    <div class="skill-match flex items-center text-green-600">
                      <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span class="text-sm font-medium">Advanced</span>
                    </div>
                  </div>
                  <div class="skill-item flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span class="text-neutral-900 font-medium">AWS</span>
                    <div class="skill-match flex items-center text-amber-600">
                      <div class="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                      <span class="text-sm font-medium">Intermediate</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold text-neutral-900 mb-4">Preferred Skills</h3>
                <div class="skills-list space-y-3">
                  <div class="skill-item flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span class="text-neutral-900 font-medium">TypeScript</span>
                    <div class="skill-match flex items-center text-neutral-500">
                      <div class="w-2 h-2 bg-neutral-400 rounded-full mr-2"></div>
                      <span class="text-sm font-medium">Learning</span>
                    </div>
                  </div>
                  <div class="skill-item flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span class="text-neutral-900 font-medium">GraphQL</span>
                    <div class="skill-match flex items-center text-neutral-500">
                      <div class="w-2 h-2 bg-neutral-400 rounded-full mr-2"></div>
                      <span class="text-sm font-medium">Not Listed</span>
                    </div>
                  </div>
                  <div class="skill-item flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span class="text-neutral-900 font-medium">Docker</span>
                    <div class="skill-match flex items-center text-amber-600">
                      <div class="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                      <span class="text-sm font-medium">Beginner</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <!-- Sidebar -->
      <aside class="job-details-sidebar">
        <!-- Quick Apply Widget -->
        <div class="quick-apply-widget bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mb-6 sticky top-6">
          <div class="text-center mb-6">
            <h3 class="text-lg font-semibold text-neutral-900 mb-2">Ready to Apply?</h3>
            <p class="text-sm text-neutral-600">Your profile matches this job perfectly!</p>
          </div>
          
          <div class="profile-preview mb-6">
            <div class="flex items-center space-x-3 mb-4">
              <img src="/user-avatar.jpg" alt="Your Profile" class="w-10 h-10 rounded-full object-cover">
              <div>
                <p class="text-sm font-medium text-neutral-900">John Doe</p>
                <p class="text-xs text-neutral-600">Senior Developer</p>
              </div>
            </div>
            <div class="profile-completion bg-neutral-50 rounded-lg p-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-neutral-700">Profile Strength</span>
                <span class="font-medium text-green-600">Excellent</span>
              </div>
              <div class="w-full bg-neutral-200 rounded-full h-2 mt-2">
                <div class="bg-green-500 h-2 rounded-full" style="width: 88%"></div>
              </div>
            </div>
          </div>
          
          <button class="w-full btn-apply px-6 py-3 text-base font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 mb-3">
            Apply with Profile
          </button>
          
          <p class="text-xs text-center text-neutral-500">
            By applying, you agree to our <a href="/terms" class="text-primary-600">Terms of Service</a>
          </p>
        </div>
        
        <!-- Company Info Widget -->
        <div class="company-info-widget bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mb-6">
          <h3 class="text-lg font-semibold text-neutral-900 mb-4">About InnovateTech Corp</h3>
          
          <div class="company-stats space-y-4 mb-6">
            <div class="stat-item flex items-center justify-between">
              <span class="text-sm text-neutral-600">Industry</span>
              <span class="text-sm font-medium text-neutral-900">Technology</span>
            </div>
            <div class="stat-item flex items-center justify-between">
              <span class="text-sm text-neutral-600">Company Size</span>
              <span class="text-sm font-medium text-neutral-900">201-500 employees</span>
            </div>
            <div class="stat-item flex items-center justify-between">
              <span class="text-sm text-neutral-600">Founded</span>
              <span class="text-sm font-medium text-neutral-900">2018</span>
            </div>
            <div class="stat-item flex items-center justify-between">
              <span class="text-sm text-neutral-600">Open Jobs</span>
              <span class="text-sm font-medium text-neutral-900">15 positions</span>
            </div>
          </div>
          
          <p class="text-sm text-neutral-600 mb-4 line-clamp-3">
            InnovateTech Corp is a leading technology company specializing in cloud solutions and digital transformation services for enterprise clients.
          </p>
          
          <button class="w-full px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200">
            View Company Profile
          </button>
        </div>
        
        <!-- Similar Jobs Widget -->
        <div class="similar-jobs-widget bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
          <h3 class="text-lg font-semibold text-neutral-900 mb-4">Similar Jobs</h3>
          
          <div class="similar-jobs-list space-y-4">
            <div class="similar-job-item p-4 border border-neutral-200 rounded-lg hover:border-primary-200 hover:shadow-sm transition-all duration-200">
              <div class="flex items-start space-x-3">
                <img src="/similar-company-1.jpg" alt="Company" class="w-8 h-8 rounded object-cover">
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-neutral-900 truncate">
                    Full Stack Developer
                  </h4>
                  <p class="text-xs text-neutral-600">TechStart Inc.</p>
                  <div class="flex items-center justify-between mt-2">
                    <span class="text-xs text-green-600 font-medium">95% match</span>
                    <span class="text-xs text-neutral-500">$110k - $140k</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="similar-job-item p-4 border border-neutral-200 rounded-lg hover:border-primary-200 hover:shadow-sm transition-all duration-200">
              <div class="flex items-start space-x-3">
                <img src="/similar-company-2.jpg" alt="Company" class="w-8 h-8 rounded object-cover">
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-neutral-900 truncate">
                    Senior Frontend Engineer
                  </h4>
                  <p class="text-xs text-neutral-600">CloudTech Solutions</p>
                  <div class="flex items-center justify-between mt-2">
                    <span class="text-xs text-green-600 font-medium">92% match</span>
                    <span class="text-xs text-neutral-500">$125k - $155k</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button class="w-full mt-4 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200">
            View All Similar Jobs
          </button>
        </div>
      </aside>
    </div>
  </div>
</div>
```

This comprehensive UI mockups specification provides detailed layouts for the key pages of the Jobifies platform, including responsive design considerations, accessibility features, and modern job portal patterns. Each mockup follows the established design system and component library while addressing specific user needs and business objectives.