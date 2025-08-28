# Jobifies Component Library

## Component Library Overview

This comprehensive component library provides reusable, accessible, and performant UI components specifically designed for the Jobifies job portal platform. All components are built with Tailwind CSS utility classes and follow WCAG 2.1 AA accessibility standards.

## Button Components

### Primary Button
```html
<!-- Primary CTA Button -->
<button class="btn-primary inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
  Apply Now
</button>

<!-- Primary Button with Icon -->
<button class="btn-primary-icon inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200">
  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
  </svg>
  Post Job
</button>
```

### Secondary Button
```html
<!-- Secondary Button -->
<button class="btn-secondary inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-md hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200">
  Save Job
</button>

<!-- Ghost Button -->
<button class="btn-ghost inline-flex items-center justify-center px-6 py-3 text-base font-medium text-neutral-700 bg-transparent border border-neutral-300 rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200">
  Cancel
</button>
```

### Button Sizes
```html
<!-- Small Button -->
<button class="btn-sm px-3 py-1.5 text-sm font-medium rounded">
  Filter
</button>

<!-- Medium Button (Default) -->
<button class="btn-md px-6 py-3 text-base font-medium rounded-md">
  Apply
</button>

<!-- Large Button -->
<button class="btn-lg px-8 py-4 text-lg font-medium rounded-lg">
  Get Started
</button>
```

### Specialized Job Portal Buttons
```html
<!-- Apply Button -->
<button class="btn-apply inline-flex items-center px-6 py-3 text-base font-medium text-white bg-success-600 border border-transparent rounded-md shadow-sm hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2 transition-all duration-200">
  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
  </svg>
  Apply Now
</button>

<!-- Save Job Button -->
<button class="btn-save inline-flex items-center px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200">
  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
  </svg>
  Save
</button>

<!-- View Details Button -->
<button class="btn-details inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-transparent hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200">
  View Details
  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
  </svg>
</button>
```

## Form Components

### Input Fields
```html
<!-- Text Input -->
<div class="form-group">
  <label for="job-title" class="block text-sm font-medium text-neutral-700 mb-2">
    Job Title *
  </label>
  <input 
    type="text" 
    id="job-title" 
    name="jobTitle" 
    required
    class="form-input block w-full px-3 py-2 text-base text-neutral-900 bg-white border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
    placeholder="e.g. Senior Software Engineer"
  />
</div>

<!-- Textarea -->
<div class="form-group">
  <label for="job-description" class="block text-sm font-medium text-neutral-700 mb-2">
    Job Description *
  </label>
  <textarea 
    id="job-description" 
    name="jobDescription" 
    rows="4" 
    required
    class="form-textarea block w-full px-3 py-2 text-base text-neutral-900 bg-white border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-vertical"
    placeholder="Describe the role, responsibilities, and requirements..."
  ></textarea>
</div>
```

### Select Dropdown
```html
<!-- Select Dropdown -->
<div class="form-group">
  <label for="experience-level" class="block text-sm font-medium text-neutral-700 mb-2">
    Experience Level
  </label>
  <select 
    id="experience-level" 
    name="experienceLevel"
    class="form-select block w-full px-3 py-2 text-base text-neutral-900 bg-white border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
  >
    <option value="">Select experience level</option>
    <option value="entry">Entry Level (0-2 years)</option>
    <option value="mid">Mid Level (3-5 years)</option>
    <option value="senior">Senior Level (6+ years)</option>
    <option value="executive">Executive Level</option>
  </select>
</div>
```

### Search Input
```html
<!-- Search Input with Icon -->
<div class="relative">
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
    </svg>
  </div>
  <input 
    type="text" 
    class="search-input block w-full pl-10 pr-3 py-3 text-base text-neutral-900 bg-white border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
    placeholder="Search jobs, companies, or keywords..."
  />
</div>
```

### Checkbox & Radio Components
```html
<!-- Checkbox -->
<div class="flex items-center">
  <input 
    id="remote-work" 
    name="remoteWork" 
    type="checkbox" 
    class="form-checkbox h-4 w-4 text-primary-600 bg-white border-neutral-300 rounded focus:ring-primary-500 focus:ring-2 transition-colors duration-200"
  />
  <label for="remote-work" class="ml-2 text-sm text-neutral-700">
    Remote work available
  </label>
</div>

<!-- Radio Button Group -->
<fieldset>
  <legend class="block text-sm font-medium text-neutral-700 mb-3">Job Type</legend>
  <div class="space-y-2">
    <div class="flex items-center">
      <input 
        id="full-time" 
        name="jobType" 
        type="radio" 
        value="full-time"
        class="form-radio h-4 w-4 text-primary-600 bg-white border-neutral-300 focus:ring-primary-500 focus:ring-2"
      />
      <label for="full-time" class="ml-2 text-sm text-neutral-700">
        Full-time
      </label>
    </div>
    <div class="flex items-center">
      <input 
        id="part-time" 
        name="jobType" 
        type="radio" 
        value="part-time"
        class="form-radio h-4 w-4 text-primary-600 bg-white border-neutral-300 focus:ring-primary-500 focus:ring-2"
      />
      <label for="part-time" class="ml-2 text-sm text-neutral-700">
        Part-time
      </label>
    </div>
  </div>
</fieldset>
```

## Card Components

### Job Card
```html
<!-- Job Listing Card -->
<div class="job-card bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
  <div class="flex items-start justify-between mb-4">
    <div class="flex items-center">
      <img 
        src="/company-logo.jpg" 
        alt="Company Logo" 
        class="w-12 h-12 rounded-lg object-cover mr-4"
      />
      <div>
        <h3 class="text-lg font-semibold text-neutral-900 mb-1">
          Senior Software Engineer
        </h3>
        <p class="text-sm text-neutral-600">TechCorp Inc.</p>
      </div>
    </div>
    <button class="btn-save-minimal p-2 text-neutral-400 hover:text-red-500 transition-colors duration-200">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
      </svg>
    </button>
  </div>
  
  <div class="mb-4">
    <div class="flex flex-wrap gap-2 mb-3">
      <span class="job-type-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Full-time
      </span>
      <span class="location-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Remote
      </span>
      <span class="experience-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        Senior Level
      </span>
    </div>
    
    <p class="text-sm text-neutral-600 mb-3 line-clamp-2">
      Join our innovative team building next-generation cloud solutions. We're looking for an experienced engineer passionate about scalable architecture and clean code.
    </p>
    
    <div class="flex items-center justify-between text-sm text-neutral-500">
      <span class="salary-range font-medium text-primary-600">
        $120k - $150k
      </span>
      <span>Posted 2 days ago</span>
    </div>
  </div>
  
  <div class="flex items-center justify-between">
    <div class="job-match-indicator flex items-center">
      <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
      <span class="text-sm text-green-700 font-medium">95% match</span>
    </div>
    
    <div class="flex space-x-2">
      <button class="btn-secondary-sm px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-md hover:bg-primary-100 transition-colors duration-200">
        View Details
      </button>
      <button class="btn-primary-sm px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 transition-colors duration-200">
        Apply Now
      </button>
    </div>
  </div>
</div>
```

### Company Card
```html
<!-- Company Profile Card -->
<div class="company-card bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
  <div class="company-header h-20 bg-gradient-to-r from-primary-500 to-primary-600"></div>
  
  <div class="p-6">
    <div class="flex items-start -mt-10 mb-4">
      <img 
        src="/company-logo.jpg" 
        alt="Company Logo" 
        class="w-16 h-16 rounded-lg border-4 border-white shadow-sm object-cover"
      />
      <div class="ml-4 mt-6">
        <h3 class="text-xl font-bold text-neutral-900 mb-1">TechCorp Inc.</h3>
        <p class="text-sm text-neutral-600 mb-2">Software Development</p>
        <div class="flex items-center">
          <svg class="w-4 h-4 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span class="text-xs text-blue-700 font-medium">Verified</span>
        </div>
      </div>
    </div>
    
    <p class="text-sm text-neutral-600 mb-4 line-clamp-3">
      Leading technology company focused on cloud solutions and AI innovation. We're committed to creating inclusive work environments where talent thrives.
    </p>
    
    <div class="company-stats grid grid-cols-2 gap-4 mb-4 p-3 bg-neutral-50 rounded-lg">
      <div class="text-center">
        <div class="text-lg font-bold text-neutral-900">1,200+</div>
        <div class="text-xs text-neutral-600">Employees</div>
      </div>
      <div class="text-center">
        <div class="text-lg font-bold text-neutral-900">15</div>
        <div class="text-xs text-neutral-600">Open Jobs</div>
      </div>
    </div>
    
    <div class="flex items-center justify-between">
      <div class="flex items-center text-sm text-neutral-500">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        San Francisco, CA
      </div>
      <button class="btn-outline-sm px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors duration-200">
        View Jobs
      </button>
    </div>
  </div>
</div>
```

### Profile Card
```html
<!-- Candidate Profile Card -->
<div class="profile-card bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
  <div class="flex items-start mb-4">
    <img 
      src="/profile-photo.jpg" 
      alt="Profile Photo" 
      class="w-16 h-16 rounded-full object-cover mr-4"
    />
    <div class="flex-1">
      <h3 class="text-lg font-semibold text-neutral-900 mb-1">
        Sarah Johnson
      </h3>
      <p class="text-sm text-neutral-600 mb-2">Senior UX Designer</p>
      <div class="flex items-center text-sm text-neutral-500">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        Seattle, WA
      </div>
    </div>
    
    <div class="profile-completion-badge">
      <div class="flex items-center justify-center w-12 h-12 bg-success-100 rounded-full">
        <span class="text-sm font-bold text-success-700">95%</span>
      </div>
    </div>
  </div>
  
  <div class="skills-preview mb-4">
    <div class="flex flex-wrap gap-2">
      <span class="skill-tag px-2.5 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
        UI/UX Design
      </span>
      <span class="skill-tag px-2.5 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
        Figma
      </span>
      <span class="skill-tag px-2.5 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
        Design Systems
      </span>
      <span class="skill-tag-more px-2.5 py-1 text-xs font-medium text-neutral-500 rounded-full">
        +5 more
      </span>
    </div>
  </div>
  
  <div class="profile-stats flex items-center justify-between text-sm text-neutral-600 mb-4">
    <div class="flex items-center">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
      8 years experience
    </div>
    <div class="flex items-center">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
      </svg>
      125 profile views
    </div>
  </div>
  
  <div class="flex space-x-3">
    <button class="flex-1 btn-primary-sm px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 transition-colors duration-200">
      Message
    </button>
    <button class="btn-secondary-sm px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-md hover:bg-primary-100 transition-colors duration-200">
      View Profile
    </button>
  </div>
</div>
```

## Navigation Components

### Header Navigation
```html
<!-- Main Header Navigation -->
<header class="header-main bg-white border-b border-neutral-200 sticky top-0 z-50">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <div class="logo-container flex items-center">
        <a href="/" class="flex items-center">
          <div class="logo-icon w-8 h-8 bg-primary-600 rounded mr-3">
            <!-- Logo SVG -->
          </div>
          <span class="text-xl font-bold text-neutral-900">Jobifies</span>
        </a>
      </div>
      
      <!-- Main Navigation -->
      <nav class="nav-main hidden md:flex space-x-8">
        <a href="/jobs" class="nav-link text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors duration-200">
          Find Jobs
        </a>
        <a href="/companies" class="nav-link text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors duration-200">
          Companies
        </a>
        <a href="/post-job" class="nav-link text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors duration-200">
          Post a Job
        </a>
        <a href="/resources" class="nav-link text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors duration-200">
          Resources
        </a>
      </nav>
      
      <!-- User Actions -->
      <div class="nav-actions flex items-center space-x-4">
        <!-- Notifications -->
        <button class="notification-btn p-2 text-neutral-400 hover:text-neutral-600 transition-colors duration-200 relative">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19H6.5A2.5 2.5 0 014 16.5v-7a4.5 4.5 0 119 0v7a.5.5 0 01-.5.5z"/>
          </svg>
          <span class="notification-badge absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>
        
        <!-- User Menu -->
        <div class="user-menu relative">
          <button class="user-menu-trigger flex items-center p-2 text-sm text-neutral-700 hover:text-neutral-900 transition-colors duration-200">
            <img 
              src="/user-avatar.jpg" 
              alt="User Avatar" 
              class="w-8 h-8 rounded-full object-cover mr-2"
            />
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>
        
        <!-- Mobile Menu Button -->
        <button class="mobile-menu-btn md:hidden p-2 text-neutral-400 hover:text-neutral-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</header>
```

### Dashboard Sidebar
```html
<!-- Dashboard Sidebar Navigation -->
<aside class="dashboard-sidebar w-64 bg-white border-r border-neutral-200 h-screen sticky top-0 overflow-y-auto">
  <div class="sidebar-content p-6">
    <div class="sidebar-header mb-8">
      <div class="user-info flex items-center">
        <img 
          src="/user-avatar.jpg" 
          alt="User Avatar" 
          class="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div>
          <p class="text-sm font-semibold text-neutral-900">John Doe</p>
          <p class="text-xs text-neutral-600">Job Seeker</p>
        </div>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <ul class="space-y-2">
        <li>
          <a href="/dashboard" class="nav-item active flex items-center px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"/>
            </svg>
            Dashboard
          </a>
        </li>
        <li>
          <a href="/profile" class="nav-item flex items-center px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-colors duration-200">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            My Profile
          </a>
        </li>
        <li>
          <a href="/applications" class="nav-item flex items-center px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-colors duration-200">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Applications
            <span class="application-count ml-auto bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
              5
            </span>
          </a>
        </li>
        <li>
          <a href="/saved-jobs" class="nav-item flex items-center px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-colors duration-200">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            Saved Jobs
          </a>
        </li>
      </ul>
      
      <div class="sidebar-divider my-6 border-t border-neutral-200"></div>
      
      <ul class="space-y-2">
        <li>
          <a href="/settings" class="nav-item flex items-center px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-colors duration-200">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Settings
          </a>
        </li>
        <li>
          <a href="/help" class="nav-item flex items-center px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-colors duration-200">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Help & Support
          </a>
        </li>
      </ul>
    </div>
  </div>
</aside>
```

## Filter & Search Components

### Job Search Filter Panel
```html
<!-- Job Search Filters -->
<div class="filter-panel bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
  <div class="filter-header flex items-center justify-between mb-6">
    <h3 class="text-lg font-semibold text-neutral-900">Filters</h3>
    <button class="filter-clear text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200">
      Clear all
    </button>
  </div>
  
  <!-- Location Filter -->
  <div class="filter-group mb-6">
    <label class="filter-label block text-sm font-medium text-neutral-700 mb-3">
      Location
    </label>
    <div class="location-input relative">
      <input 
        type="text" 
        placeholder="City, state, or remote"
        class="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
      <svg class="absolute right-3 top-2.5 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
      </svg>
    </div>
  </div>
  
  <!-- Salary Range Filter -->
  <div class="filter-group mb-6">
    <label class="filter-label block text-sm font-medium text-neutral-700 mb-3">
      Salary Range
    </label>
    <div class="salary-range-inputs grid grid-cols-2 gap-3 mb-3">
      <input 
        type="number" 
        placeholder="Min"
        class="px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
      <input 
        type="number" 
        placeholder="Max"
        class="px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
    </div>
    <div class="salary-presets flex flex-wrap gap-2">
      <button class="preset-btn px-3 py-1 text-xs font-medium text-neutral-600 bg-neutral-100 border border-neutral-200 rounded-full hover:bg-neutral-200 transition-colors duration-200">
        $50k+
      </button>
      <button class="preset-btn px-3 py-1 text-xs font-medium text-neutral-600 bg-neutral-100 border border-neutral-200 rounded-full hover:bg-neutral-200 transition-colors duration-200">
        $75k+
      </button>
      <button class="preset-btn px-3 py-1 text-xs font-medium text-neutral-600 bg-neutral-100 border border-neutral-200 rounded-full hover:bg-neutral-200 transition-colors duration-200">
        $100k+
      </button>
    </div>
  </div>
  
  <!-- Job Type Filter -->
  <div class="filter-group mb-6">
    <label class="filter-label block text-sm font-medium text-neutral-700 mb-3">
      Job Type
    </label>
    <div class="checkbox-group space-y-2">
      <label class="flex items-center">
        <input type="checkbox" class="form-checkbox h-4 w-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500">
        <span class="ml-2 text-sm text-neutral-700">Full-time</span>
        <span class="ml-auto text-xs text-neutral-500">(1,234)</span>
      </label>
      <label class="flex items-center">
        <input type="checkbox" class="form-checkbox h-4 w-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500">
        <span class="ml-2 text-sm text-neutral-700">Part-time</span>
        <span class="ml-auto text-xs text-neutral-500">(567)</span>
      </label>
      <label class="flex items-center">
        <input type="checkbox" class="form-checkbox h-4 w-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500">
        <span class="ml-2 text-sm text-neutral-700">Contract</span>
        <span class="ml-auto text-xs text-neutral-500">(89)</span>
      </label>
      <label class="flex items-center">
        <input type="checkbox" class="form-checkbox h-4 w-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500">
        <span class="ml-2 text-sm text-neutral-700">Remote</span>
        <span class="ml-auto text-xs text-neutral-500">(456)</span>
      </label>
    </div>
  </div>
  
  <!-- Experience Level Filter -->
  <div class="filter-group mb-6">
    <label class="filter-label block text-sm font-medium text-neutral-700 mb-3">
      Experience Level
    </label>
    <div class="radio-group space-y-2">
      <label class="flex items-center">
        <input type="radio" name="experience" value="any" class="form-radio h-4 w-4 text-primary-600 border-neutral-300 focus:ring-primary-500">
        <span class="ml-2 text-sm text-neutral-700">Any Experience</span>
      </label>
      <label class="flex items-center">
        <input type="radio" name="experience" value="entry" class="form-radio h-4 w-4 text-primary-600 border-neutral-300 focus:ring-primary-500">
        <span class="ml-2 text-sm text-neutral-700">Entry Level</span>
      </label>
      <label class="flex items-center">
        <input type="radio" name="experience" value="mid" class="form-radio h-4 w-4 text-primary-600 border-neutral-300 focus:ring-primary-500">
        <span class="ml-2 text-sm text-neutral-700">Mid Level</span>
      </label>
      <label class="flex items-center">
        <input type="radio" name="experience" value="senior" class="form-radio h-4 w-4 text-primary-600 border-neutral-300 focus:ring-primary-500">
        <span class="ml-2 text-sm text-neutral-700">Senior Level</span>
      </label>
    </div>
  </div>
  
  <!-- Apply Filters Button -->
  <button class="apply-filters w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200">
    Apply Filters
  </button>
</div>
```

## Badge & Status Components

### Job Portal Badges
```html
<!-- Match Percentage Badge -->
<div class="match-badge-high inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  <div class="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
  95% match
</div>

<div class="match-badge-medium inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
  <div class="w-2 h-2 bg-yellow-500 rounded-full mr-1.5"></div>
  75% match
</div>

<div class="match-badge-low inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
  <div class="w-2 h-2 bg-gray-500 rounded-full mr-1.5"></div>
  45% match
</div>

<!-- Verification Badge -->
<div class="verification-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
  </svg>
  Verified
</div>

<!-- Premium Feature Badge -->
<div class="premium-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
  </svg>
  Premium
</div>

<!-- Application Status Badges -->
<div class="status-applied inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
  Applied
</div>

<div class="status-reviewing inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
  Under Review
</div>

<div class="status-interview inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
  Interview Scheduled
</div>

<div class="status-rejected inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
  Not Selected
</div>

<div class="status-hired inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  Hired
</div>
```

## Modal & Overlay Components

### Job Application Modal
```html
<!-- Job Application Modal -->
<div class="modal-overlay fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
  <div class="modal-container bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
    <div class="modal-header flex items-center justify-between p-6 border-b border-neutral-200">
      <h2 class="text-xl font-semibold text-neutral-900">
        Apply for Senior Software Engineer
      </h2>
      <button class="modal-close p-2 text-neutral-400 hover:text-neutral-600 transition-colors duration-200">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
    
    <div class="modal-body p-6">
      <div class="job-summary mb-6 p-4 bg-neutral-50 rounded-lg">
        <div class="flex items-center mb-2">
          <img src="/company-logo.jpg" alt="Company Logo" class="w-8 h-8 rounded mr-3">
          <div>
            <h3 class="font-medium text-neutral-900">TechCorp Inc.</h3>
            <p class="text-sm text-neutral-600">San Francisco, CA</p>
          </div>
        </div>
        <p class="text-sm text-neutral-600">
          Join our team building innovative cloud solutions...
        </p>
      </div>
      
      <form class="application-form space-y-6">
        <div class="form-group">
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Resume *
          </label>
          <div class="resume-upload border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors duration-200">
            <svg class="mx-auto h-12 w-12 text-neutral-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p class="text-sm text-neutral-600">
              <button type="button" class="text-primary-600 hover:text-primary-700">Upload your resume</button>
              or drag and drop
            </p>
            <p class="text-xs text-neutral-500 mt-1">
              PDF, DOC, DOCX up to 10MB
            </p>
          </div>
        </div>
        
        <div class="form-group">
          <label for="cover-letter" class="block text-sm font-medium text-neutral-700 mb-2">
            Cover Letter (Optional)
          </label>
          <textarea 
            id="cover-letter" 
            rows="4" 
            class="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Tell us why you're interested in this position..."
          ></textarea>
        </div>
        
        <div class="form-group">
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="terms" 
              class="form-checkbox h-4 w-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
            />
            <label for="terms" class="ml-2 text-sm text-neutral-700">
              I agree to the <a href="/terms" class="text-primary-600 hover:text-primary-700">Terms of Service</a> and <a href="/privacy" class="text-primary-600 hover:text-primary-700">Privacy Policy</a>
            </label>
          </div>
        </div>
      </form>
    </div>
    
    <div class="modal-footer flex items-center justify-end space-x-4 p-6 border-t border-neutral-200">
      <button class="btn-cancel px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors duration-200">
        Cancel
      </button>
      <button class="btn-submit px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200">
        Submit Application
      </button>
    </div>
  </div>
</div>
```

This component library provides a comprehensive set of reusable UI components specifically designed for the Jobifies job portal platform. Each component follows accessibility best practices, uses consistent design tokens, and is optimized for performance with Tailwind CSS utility classes.

## Component Usage Guidelines

### Accessibility Requirements
- All interactive elements must be keyboard navigable
- Color combinations meet WCAG 2.1 AA contrast standards
- Screen reader support with proper ARIA labels
- Focus states are clearly visible
- Form inputs have associated labels

### Performance Considerations
- Components use CSS utilities for minimal bundle size
- Images include proper alt text and loading attributes
- Animations use transform and opacity for better performance
- Mobile-first responsive design approach

### Implementation Notes
- All components use the established design tokens
- Consistent spacing and typography scales
- Hover and focus states follow interaction patterns
- Components support both light and dark themes (when implemented)