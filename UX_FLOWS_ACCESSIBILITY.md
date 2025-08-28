# User Experience Flows & Accessibility Guidelines

## UX Flow Overview

This document outlines the key user experience flows for the Jobifies platform, with detailed accessibility compliance guidelines following WCAG 2.1 AA standards. Each flow is designed to be inclusive, efficient, and conversion-optimized.

## Job Seeker User Flows

### Flow 1: Job Seeker Onboarding & Profile Creation

#### Flow Steps
```
1. Landing Page → Sign Up
2. Account Creation Form
3. Email Verification
4. Welcome & Profile Setup Prompt
5. Basic Info Collection
6. Work Experience Entry
7. Skills & Education
8. Profile Photo Upload
9. Preferences Setting
10. Profile Complete → Dashboard
```

#### Detailed Flow Specification

**Step 1: Landing Page Engagement**
```html
<!-- Accessible Hero CTA -->
<section class="hero-section" role="banner" aria-labelledby="hero-heading">
  <h1 id="hero-heading" class="sr-only">Jobifies - Find Your Dream Job Today</h1>
  
  <div class="hero-content">
    <h2 class="hero-title" aria-describedby="hero-description">
      Find Your Dream Job Today
    </h2>
    <p id="hero-description" class="hero-subtitle">
      Connect with top employers and discover opportunities that match your skills and ambitions.
    </p>
    
    <!-- Primary CTA with clear affordance -->
    <a 
      href="/signup" 
      class="btn-primary-large"
      role="button"
      aria-describedby="signup-benefit"
    >
      Get Started - It's Free
    </a>
    <p id="signup-benefit" class="sr-only">
      Sign up for free to access thousands of job opportunities and connect with top employers
    </p>
  </div>
</section>
```

**Step 2: Account Creation Form**
```html
<!-- Accessible Registration Form -->
<form class="registration-form" method="post" action="/register" novalidate>
  <fieldset>
    <legend class="form-legend">Create Your Account</legend>
    
    <!-- Progress Indicator -->
    <div class="progress-indicator" role="progressbar" aria-valuenow="1" aria-valuemin="1" aria-valuemax="5" aria-label="Step 1 of 5">
      <div class="progress-bar">
        <div class="progress-fill" style="width: 20%"></div>
      </div>
      <p class="progress-text">Step 1 of 5: Basic Information</p>
    </div>
    
    <!-- Form Fields with Proper Labels and Error Handling -->
    <div class="form-group">
      <label for="firstName" class="form-label required">
        First Name <span aria-label="required">*</span>
      </label>
      <input 
        type="text" 
        id="firstName" 
        name="firstName" 
        class="form-input" 
        required
        aria-describedby="firstName-error firstName-help"
        autocomplete="given-name"
      />
      <div id="firstName-help" class="form-help">
        Enter your first name as it appears on official documents
      </div>
      <div id="firstName-error" class="form-error" role="alert" aria-live="polite">
        <!-- Error message will be inserted here -->
      </div>
    </div>
    
    <div class="form-group">
      <label for="email" class="form-label required">
        Email Address <span aria-label="required">*</span>
      </label>
      <input 
        type="email" 
        id="email" 
        name="email" 
        class="form-input" 
        required
        aria-describedby="email-error email-help"
        autocomplete="email"
      />
      <div id="email-help" class="form-help">
        We'll use this to send you job matches and important updates
      </div>
      <div id="email-error" class="form-error" role="alert" aria-live="polite">
        <!-- Error message will be inserted here -->
      </div>
    </div>
    
    <!-- Password with Strength Indicator -->
    <div class="form-group">
      <label for="password" class="form-label required">
        Password <span aria-label="required">*</span>
      </label>
      <div class="password-input-container">
        <input 
          type="password" 
          id="password" 
          name="password" 
          class="form-input" 
          required
          aria-describedby="password-error password-help password-strength"
          autocomplete="new-password"
        />
        <button 
          type="button" 
          class="password-toggle"
          aria-label="Show password"
          aria-pressed="false"
        >
          <svg class="icon-eye" aria-hidden="true"><!-- Eye icon --></svg>
        </button>
      </div>
      
      <!-- Password Requirements -->
      <div id="password-help" class="form-help">
        <p>Password must contain:</p>
        <ul class="password-requirements">
          <li aria-describedby="req-length">At least 8 characters</li>
          <li aria-describedby="req-number">One number</li>
          <li aria-describedby="req-special">One special character</li>
        </ul>
      </div>
      
      <!-- Live Password Strength Indicator -->
      <div id="password-strength" class="password-strength" role="status" aria-live="polite">
        <div class="strength-meter">
          <div class="strength-bar" aria-hidden="true"></div>
        </div>
        <span class="strength-text">Password strength: Weak</span>
      </div>
      
      <div id="password-error" class="form-error" role="alert" aria-live="polite">
        <!-- Error message will be inserted here -->
      </div>
    </div>
    
    <!-- Terms and Privacy Consent -->
    <div class="form-group">
      <div class="checkbox-group">
        <input 
          type="checkbox" 
          id="terms-consent" 
          name="termsConsent" 
          required
          aria-describedby="terms-error"
        />
        <label for="terms-consent" class="checkbox-label">
          I agree to the 
          <a href="/terms" target="_blank" aria-label="Terms of Service - opens in new tab">Terms of Service</a> 
          and 
          <a href="/privacy" target="_blank" aria-label="Privacy Policy - opens in new tab">Privacy Policy</a>
        </label>
      </div>
      <div id="terms-error" class="form-error" role="alert" aria-live="polite">
        <!-- Error message will be inserted here -->
      </div>
    </div>
    
    <!-- Submit Button -->
    <button 
      type="submit" 
      class="btn-primary-large w-full"
      aria-describedby="submit-help"
    >
      Create Account
    </button>
    <p id="submit-help" class="form-help text-center">
      You'll receive a verification email after creating your account
    </p>
  </fieldset>
</form>
```

**Step 3: Email Verification Flow**
```html
<!-- Email Verification Page -->
<main class="verification-page" role="main">
  <div class="verification-container">
    <div class="verification-header text-center">
      <svg class="verification-icon" aria-hidden="true"><!-- Email icon --></svg>
      <h1 class="verification-title">Check Your Email</h1>
      <p class="verification-description">
        We've sent a verification link to <strong id="user-email">john@example.com</strong>
      </p>
    </div>
    
    <!-- Verification Actions -->
    <div class="verification-actions">
      <button 
        type="button" 
        class="btn-primary resend-btn"
        aria-describedby="resend-help"
        data-action="resend-verification"
      >
        Resend Verification Email
      </button>
      <p id="resend-help" class="form-help text-center">
        Didn't receive the email? Check your spam folder or request a new one
      </p>
      
      <!-- Status Messages -->
      <div id="verification-status" role="status" aria-live="polite" class="status-message">
        <!-- Dynamic status messages will appear here -->
      </div>
    </div>
    
    <!-- Alternative Actions -->
    <div class="verification-alternatives text-center">
      <p class="text-neutral-600">
        Need to use a different email? 
        <a href="/signup" class="text-primary-600 hover:text-primary-700">
          Start over with new email
        </a>
      </p>
    </div>
  </div>
</main>
```

### Flow 2: Job Search & Application Process

#### Flow Steps
```
1. Dashboard → Browse Jobs
2. Search & Filter Interface
3. Job Results Browsing
4. Job Details Review
5. Application Decision
6. Quick Apply / Full Application
7. Application Confirmation
8. Application Tracking
```

#### Detailed Flow Specification

**Step 1: Job Search Interface**
```html
<!-- Accessible Job Search -->
<section class="job-search-section" role="search" aria-labelledby="search-heading">
  <h2 id="search-heading">Find Your Perfect Job</h2>
  
  <form class="job-search-form" role="search" method="get" action="/jobs">
    <div class="search-inputs-container">
      <div class="search-input-group">
        <label for="job-keywords" class="search-label">
          Job Title, Keywords, or Company
        </label>
        <div class="search-input-wrapper">
          <input 
            type="text" 
            id="job-keywords" 
            name="keywords" 
            class="search-input" 
            placeholder="e.g. Software Engineer, Marketing Manager"
            aria-describedby="keywords-help"
            autocomplete="off"
            role="combobox"
            aria-expanded="false"
            aria-autocomplete="list"
          />
          <svg class="search-icon" aria-hidden="true"><!-- Search icon --></svg>
          
          <!-- Search Suggestions Dropdown -->
          <div id="keywords-suggestions" class="suggestions-dropdown" role="listbox" aria-labelledby="job-keywords">
            <!-- Dynamic suggestions will be populated here -->
          </div>
        </div>
        <div id="keywords-help" class="search-help">
          Start typing to see suggestions based on popular job titles and your profile
        </div>
      </div>
      
      <div class="search-input-group">
        <label for="job-location" class="search-label">
          Location
        </label>
        <div class="search-input-wrapper">
          <input 
            type="text" 
            id="job-location" 
            name="location" 
            class="search-input" 
            placeholder="City, state, or remote"
            aria-describedby="location-help"
            autocomplete="off"
            role="combobox"
            aria-expanded="false"
            aria-autocomplete="list"
          />
          <svg class="location-icon" aria-hidden="true"><!-- Location icon --></svg>
          
          <!-- Location Suggestions -->
          <div id="location-suggestions" class="suggestions-dropdown" role="listbox" aria-labelledby="job-location">
            <!-- Dynamic location suggestions -->
          </div>
        </div>
        <div id="location-help" class="search-help">
          Enter a city, state, or "remote" for work-from-home opportunities
        </div>
      </div>
      
      <button type="submit" class="search-submit-btn" aria-describedby="search-submit-help">
        <span class="btn-text">Search Jobs</span>
        <svg class="btn-icon" aria-hidden="true"><!-- Arrow icon --></svg>
      </button>
      <div id="search-submit-help" class="sr-only">
        Search for jobs matching your criteria
      </div>
    </div>
  </form>
</section>
```

**Step 2: Job Results with Filtering**
```html
<!-- Accessible Job Results -->
<main class="job-results-page" role="main">
  <div class="results-header">
    <h1 id="results-heading">Job Search Results</h1>
    <div class="results-summary" aria-live="polite">
      <p><strong>1,247</strong> jobs found for "Software Engineer" in San Francisco</p>
    </div>
    
    <!-- Skip Link for Screen Readers -->
    <a href="#job-results" class="skip-link">
      Skip to job results
    </a>
  </div>
  
  <div class="results-layout">
    <!-- Filters Sidebar -->
    <aside class="filters-sidebar" role="complementary" aria-labelledby="filters-heading">
      <h2 id="filters-heading">Filter Jobs</h2>
      
      <!-- Filter Form -->
      <form class="filters-form" method="get" action="/jobs">
        <!-- Preserve current search -->
        <input type="hidden" name="keywords" value="Software Engineer">
        <input type="hidden" name="location" value="San Francisco">
        
        <!-- Salary Filter -->
        <fieldset class="filter-group">
          <legend class="filter-legend">Salary Range</legend>
          
          <div class="salary-inputs">
            <div class="salary-input-group">
              <label for="salary-min" class="salary-label">Minimum</label>
              <div class="salary-input-wrapper">
                <span class="salary-symbol" aria-hidden="true">$</span>
                <input 
                  type="number" 
                  id="salary-min" 
                  name="salaryMin" 
                  class="salary-input" 
                  placeholder="50,000"
                  aria-describedby="salary-min-help"
                  min="0"
                  step="1000"
                />
              </div>
              <div id="salary-min-help" class="input-help">
                Minimum annual salary in USD
              </div>
            </div>
            
            <div class="salary-input-group">
              <label for="salary-max" class="salary-label">Maximum</label>
              <div class="salary-input-wrapper">
                <span class="salary-symbol" aria-hidden="true">$</span>
                <input 
                  type="number" 
                  id="salary-max" 
                  name="salaryMax" 
                  class="salary-input" 
                  placeholder="150,000"
                  aria-describedby="salary-max-help"
                  min="0"
                  step="1000"
                />
              </div>
              <div id="salary-max-help" class="input-help">
                Maximum annual salary in USD
              </div>
            </div>
          </div>
        </fieldset>
        
        <!-- Job Type Filter -->
        <fieldset class="filter-group">
          <legend class="filter-legend">Job Type</legend>
          
          <div class="checkbox-filters">
            <div class="filter-option">
              <input 
                type="checkbox" 
                id="job-type-fulltime" 
                name="jobType" 
                value="fulltime"
                aria-describedby="fulltime-count"
              />
              <label for="job-type-fulltime" class="filter-label">
                <span class="label-text">Full-time</span>
                <span id="fulltime-count" class="result-count">(1,156)</span>
              </label>
            </div>
            
            <div class="filter-option">
              <input 
                type="checkbox" 
                id="job-type-parttime" 
                name="jobType" 
                value="parttime"
                aria-describedby="parttime-count"
              />
              <label for="job-type-parttime" class="filter-label">
                <span class="label-text">Part-time</span>
                <span id="parttime-count" class="result-count">(67)</span>
              </label>
            </div>
            
            <div class="filter-option">
              <input 
                type="checkbox" 
                id="job-type-remote" 
                name="jobType" 
                value="remote"
                aria-describedby="remote-count"
              />
              <label for="job-type-remote" class="filter-label">
                <span class="label-text">Remote</span>
                <span id="remote-count" class="result-count">(423)</span>
              </label>
            </div>
          </div>
        </fieldset>
        
        <!-- Apply Filters Button -->
        <button 
          type="submit" 
          class="apply-filters-btn"
          aria-describedby="apply-filters-help"
        >
          Apply Filters
        </button>
        <div id="apply-filters-help" class="sr-only">
          Update job results based on selected filters
        </div>
        
        <!-- Clear Filters -->
        <button 
          type="button" 
          class="clear-filters-btn"
          aria-describedby="clear-filters-help"
        >
          Clear All Filters
        </button>
        <div id="clear-filters-help" class="sr-only">
          Remove all applied filters and show all results
        </div>
      </form>
    </aside>
    
    <!-- Job Results List -->
    <section id="job-results" class="job-results-section" aria-labelledby="results-heading">
      <div class="results-controls">
        <div class="sort-controls">
          <label for="sort-select" class="sort-label">Sort by:</label>
          <select 
            id="sort-select" 
            name="sort" 
            class="sort-select"
            aria-describedby="sort-help"
          >
            <option value="relevance">Relevance</option>
            <option value="date">Date Posted</option>
            <option value="salary-high">Salary: High to Low</option>
            <option value="salary-low">Salary: Low to High</option>
          </select>
          <div id="sort-help" class="sr-only">
            Change the order of job results
          </div>
        </div>
      </div>
      
      <!-- Job Cards List -->
      <div class="job-cards-list" role="list">
        <article class="job-card" role="listitem" tabindex="0" aria-describedby="job-1-summary">
          <div class="job-card-header">
            <div class="job-company-info">
              <img 
                src="/company-logo.jpg" 
                alt="InnovateTech Corp logo" 
                class="company-logo"
              />
              <div class="job-title-section">
                <h3 class="job-title">
                  <a href="/job/senior-software-engineer-123" aria-describedby="job-1-details">
                    Senior Software Engineer
                  </a>
                </h3>
                <p class="company-name">
                  <a href="/company/innovatetech">InnovateTech Corp</a>
                </p>
              </div>
            </div>
            
            <div class="job-actions">
              <button 
                class="save-job-btn"
                aria-label="Save Senior Software Engineer job at InnovateTech Corp"
                aria-pressed="false"
                data-job-id="123"
              >
                <svg class="save-icon" aria-hidden="true"><!-- Heart icon --></svg>
              </button>
            </div>
          </div>
          
          <div id="job-1-summary" class="job-summary">
            <div class="job-details">
              <div class="job-location">
                <svg class="location-icon" aria-hidden="true"><!-- Location icon --></svg>
                <span>San Francisco, CA (Hybrid)</span>
              </div>
              <div class="job-salary">
                <svg class="salary-icon" aria-hidden="true"><!-- Dollar icon --></svg>
                <span>$120k - $160k</span>
              </div>
              <div class="job-posted">
                <svg class="time-icon" aria-hidden="true"><!-- Clock icon --></svg>
                <span>Posted 2 days ago</span>
              </div>
            </div>
            
            <div class="job-tags">
              <span class="job-tag job-type">Full-time</span>
              <span class="job-tag experience-level">Senior Level</span>
              <span class="job-tag skill">React</span>
              <span class="job-tag skill">Node.js</span>
            </div>
            
            <p class="job-description">
              Join our innovative team building next-generation cloud solutions. We're looking for an experienced engineer passionate about scalable architecture and clean code.
            </p>
            
            <div class="job-match">
              <div class="match-score">
                <div class="match-indicator match-high" aria-label="88% match">
                  <span class="match-percentage">88%</span>
                  <span class="match-label">match</span>
                </div>
              </div>
            </div>
          </div>
          
          <div id="job-1-details" class="sr-only">
            View full details for Senior Software Engineer position at InnovateTech Corp
          </div>
          
          <div class="job-card-actions">
            <button class="btn-secondary job-details-btn">
              View Details
            </button>
            <button class="btn-primary job-apply-btn" aria-describedby="apply-help-123">
              Apply Now
            </button>
            <div id="apply-help-123" class="sr-only">
              Apply for Senior Software Engineer at InnovateTech Corp
            </div>
          </div>
        </article>
        
        <!-- More job cards... -->
      </div>
      
      <!-- Pagination -->
      <nav class="pagination-nav" aria-label="Job results pages">
        <button 
          class="pagination-btn pagination-prev"
          aria-label="Go to previous page"
          disabled
        >
          Previous
        </button>
        
        <div class="pagination-pages">
          <button class="pagination-page current" aria-current="page" aria-label="Page 1, current page">1</button>
          <button class="pagination-page" aria-label="Go to page 2">2</button>
          <button class="pagination-page" aria-label="Go to page 3">3</button>
          <span class="pagination-ellipsis" aria-hidden="true">...</span>
          <button class="pagination-page" aria-label="Go to page 25">25</button>
        </div>
        
        <button 
          class="pagination-btn pagination-next"
          aria-label="Go to next page"
        >
          Next
        </button>
      </nav>
    </section>
  </div>
</main>
```

## Recruiter User Flows

### Flow 3: Job Posting Creation

#### Flow Steps
```
1. Recruiter Dashboard → Post New Job
2. Job Basic Information
3. Job Description & Requirements
4. Skills & Qualifications
5. Compensation & Benefits
6. Application Settings
7. Preview & Publish
8. Payment (if premium)
9. Job Published Confirmation
```

#### Detailed Flow Specification

**Step 1: Job Posting Form**
```html
<!-- Accessible Job Posting Form -->
<main class="job-posting-page" role="main">
  <div class="posting-header">
    <h1>Post a New Job</h1>
    <p class="posting-description">
      Fill out the form below to attract the best candidates for your position
    </p>
  </div>
  
  <form class="job-posting-form" method="post" action="/jobs/create" novalidate>
    <!-- Progress Indicator -->
    <div class="form-progress" role="progressbar" aria-valuenow="1" aria-valuemin="1" aria-valuemax="6" aria-label="Step 1 of 6">
      <div class="progress-steps">
        <div class="progress-step active" aria-current="step">
          <div class="step-number">1</div>
          <div class="step-label">Basic Info</div>
        </div>
        <div class="progress-step">
          <div class="step-number">2</div>
          <div class="step-label">Description</div>
        </div>
        <div class="progress-step">
          <div class="step-number">3</div>
          <div class="step-label">Requirements</div>
        </div>
        <div class="progress-step">
          <div class="step-number">4</div>
          <div class="step-label">Compensation</div>
        </div>
        <div class="progress-step">
          <div class="step-number">5</div>
          <div class="step-label">Settings</div>
        </div>
        <div class="progress-step">
          <div class="step-number">6</div>
          <div class="step-label">Review</div>
        </div>
      </div>
    </div>
    
    <!-- Step 1: Basic Information -->
    <fieldset class="form-step active" id="step-1">
      <legend class="step-legend">Basic Job Information</legend>
      
      <div class="form-row">
        <div class="form-group">
          <label for="job-title" class="form-label required">
            Job Title <span aria-label="required">*</span>
          </label>
          <input 
            type="text" 
            id="job-title" 
            name="jobTitle" 
            class="form-input" 
            required
            aria-describedby="job-title-help job-title-error"
            autocomplete="off"
          />
          <div id="job-title-help" class="form-help">
            Use a clear, specific job title that candidates will search for (e.g., "Senior Software Engineer" not "Code Ninja")
          </div>
          <div id="job-title-error" class="form-error" role="alert" aria-live="polite">
            <!-- Error message will be inserted here -->
          </div>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="job-department" class="form-label">
            Department
          </label>
          <select 
            id="job-department" 
            name="department" 
            class="form-select"
            aria-describedby="job-department-help"
          >
            <option value="">Select a department</option>
            <option value="engineering">Engineering</option>
            <option value="product">Product</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="operations">Operations</option>
            <option value="hr">Human Resources</option>
            <option value="finance">Finance</option>
            <option value="other">Other</option>
          </select>
          <div id="job-department-help" class="form-help">
            Select the department this position belongs to
          </div>
        </div>
        
        <div class="form-group">
          <label for="job-level" class="form-label required">
            Experience Level <span aria-label="required">*</span>
          </label>
          <select 
            id="job-level" 
            name="experienceLevel" 
            class="form-select" 
            required
            aria-describedby="job-level-help job-level-error"
          >
            <option value="">Select experience level</option>
            <option value="entry">Entry Level (0-2 years)</option>
            <option value="mid">Mid Level (3-5 years)</option>
            <option value="senior">Senior Level (6+ years)</option>
            <option value="lead">Lead/Principal</option>
            <option value="executive">Executive</option>
          </select>
          <div id="job-level-help" class="form-help">
            Choose the experience level that best matches this role
          </div>
          <div id="job-level-error" class="form-error" role="alert" aria-live="polite">
            <!-- Error message will be inserted here -->
          </div>
        </div>
      </div>
      
      <!-- Employment Type -->
      <fieldset class="form-group">
        <legend class="form-legend required">
          Employment Type <span aria-label="required">*</span>
        </legend>
        
        <div class="radio-group">
          <div class="radio-option">
            <input 
              type="radio" 
              id="employment-fulltime" 
              name="employmentType" 
              value="fulltime"
              required
              aria-describedby="employment-type-error"
            />
            <label for="employment-fulltime" class="radio-label">
              <span class="radio-text">Full-time</span>
              <span class="radio-description">Standard 40 hours per week</span>
            </label>
          </div>
          
          <div class="radio-option">
            <input 
              type="radio" 
              id="employment-parttime" 
              name="employmentType" 
              value="parttime"
              required
            />
            <label for="employment-parttime" class="radio-label">
              <span class="radio-text">Part-time</span>
              <span class="radio-description">Less than 40 hours per week</span>
            </label>
          </div>
          
          <div class="radio-option">
            <input 
              type="radio" 
              id="employment-contract" 
              name="employmentType" 
              value="contract"
              required
            />
            <label for="employment-contract" class="radio-label">
              <span class="radio-text">Contract</span>
              <span class="radio-description">Fixed-term or project-based</span>
            </label>
          </div>
        </div>
        
        <div id="employment-type-error" class="form-error" role="alert" aria-live="polite">
          <!-- Error message will be inserted here -->
        </div>
      </fieldset>
      
      <!-- Work Location -->
      <fieldset class="form-group">
        <legend class="form-legend required">
          Work Location <span aria-label="required">*</span>
        </legend>
        
        <div class="radio-group">
          <div class="radio-option">
            <input 
              type="radio" 
              id="location-onsite" 
              name="workLocation" 
              value="onsite"
              required
              aria-describedby="work-location-error"
            />
            <label for="location-onsite" class="radio-label">
              <span class="radio-text">On-site</span>
              <span class="radio-description">Work from office location</span>
            </label>
          </div>
          
          <div class="radio-option">
            <input 
              type="radio" 
              id="location-remote" 
              name="workLocation" 
              value="remote"
              required
            />
            <label for="location-remote" class="radio-label">
              <span class="radio-text">Remote</span>
              <span class="radio-description">Work from home/anywhere</span>
            </label>
          </div>
          
          <div class="radio-option">
            <input 
              type="radio" 
              id="location-hybrid" 
              name="workLocation" 
              value="hybrid"
              required
            />
            <label for="location-hybrid" class="radio-label">
              <span class="radio-text">Hybrid</span>
              <span class="radio-description">Mix of office and remote work</span>
            </label>
          </div>
        </div>
        
        <div id="work-location-error" class="form-error" role="alert" aria-live="polite">
          <!-- Error message will be inserted here -->
        </div>
      </fieldset>
      
      <!-- Office Location (conditional) -->
      <div class="form-group office-location-group" id="office-location-group">
        <label for="office-location" class="form-label required">
          Office Location <span aria-label="required">*</span>
        </label>
        <input 
          type="text" 
          id="office-location" 
          name="officeLocation" 
          class="form-input" 
          placeholder="City, State"
          aria-describedby="office-location-help office-location-error"
          autocomplete="off"
        />
        <div id="office-location-help" class="form-help">
          Enter the city and state where the office is located
        </div>
        <div id="office-location-error" class="form-error" role="alert" aria-live="polite">
          <!-- Error message will be inserted here -->
        </div>
      </div>
    </fieldset>
    
    <!-- Navigation Buttons -->
    <div class="form-navigation">
      <button 
        type="button" 
        class="btn-secondary prev-step-btn"
        aria-label="Go to previous step"
        disabled
      >
        Previous
      </button>
      
      <button 
        type="button" 
        class="btn-primary next-step-btn"
        aria-label="Go to next step"
        data-next="step-2"
      >
        Next: Job Description
      </button>
    </div>
    
    <!-- Save Draft -->
    <div class="form-draft">
      <button 
        type="button" 
        class="btn-ghost save-draft-btn"
        aria-describedby="save-draft-help"
      >
        Save as Draft
      </button>
      <div id="save-draft-help" class="form-help">
        Your progress will be saved and you can continue later
      </div>
    </div>
  </form>
</main>
```

## Accessibility Compliance Guidelines

### WCAG 2.1 AA Requirements

#### 1. Perceivable
- **Color Contrast**: All text maintains 4.5:1 contrast ratio (3:1 for large text 18px+)
- **Resizable Text**: Support up to 200% zoom without horizontal scrolling
- **Images**: All images include descriptive alt text
- **Audio/Video**: Captions provided for multimedia content

#### 2. Operable
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Focus Management**: Clear focus indicators with 2px outline
- **Timing**: No automatic timeouts without user control
- **Seizure Prevention**: No flashing content exceeding 3 times per second

#### 3. Understandable
- **Language**: Page language declared (lang="en")
- **Consistent Navigation**: Navigation order consistent across pages
- **Error Identification**: Clear error messages with suggestions
- **Help Text**: Instructions provided for complex interactions

#### 4. Robust
- **Valid HTML**: Semantic HTML with proper heading hierarchy
- **ARIA Labels**: Appropriate ARIA attributes for complex UI
- **Compatibility**: Works with assistive technologies

### Implementation Checklist

#### Forms
- [ ] All form inputs have associated labels
- [ ] Required fields clearly marked
- [ ] Error messages announced to screen readers
- [ ] Field validation occurs on blur/submit
- [ ] Progress indicators for multi-step forms
- [ ] Autocomplete attributes for personal information

#### Navigation
- [ ] Skip links provided for main content
- [ ] Breadcrumb navigation available
- [ ] Current page/step clearly identified
- [ ] Keyboard shortcuts documented
- [ ] Focus trap in modals/overlays

#### Interactive Elements
- [ ] Buttons have descriptive labels
- [ ] Links indicate their purpose/destination
- [ ] Loading states communicated to screen readers
- [ ] Success/error states announced
- [ ] Expandable content properly labeled

#### Mobile Accessibility
- [ ] Touch targets minimum 44x44px
- [ ] Gestures have keyboard alternatives
- [ ] Orientation changes supported
- [ ] Screen reader compatibility on mobile
- [ ] Voice control compatibility

### Testing Procedures

#### Automated Testing
```bash
# Accessibility testing tools to integrate
npm install --save-dev @axe-core/cli
npm install --save-dev lighthouse-ci
npm install --save-dev pa11y

# Run accessibility audits
axe-core src/
lighthouse --accessibility-audit
pa11y-ci --sitemap https://jobifies.com/sitemap.xml
```

#### Manual Testing
1. **Keyboard Navigation Test**
   - Tab through entire page
   - Verify logical tab order
   - Test all interactive elements
   - Ensure focus is visible

2. **Screen Reader Test**
   - Test with NVDA (free)
   - Verify content is announced correctly
   - Check heading structure navigation
   - Test form field associations

3. **Color/Contrast Test**
   - Test with Color Oracle simulator
   - Verify information not conveyed by color alone
   - Check all text meets contrast requirements

4. **Mobile Accessibility Test**
   - Test with VoiceOver on iOS
   - Test with TalkBack on Android
   - Verify touch targets are adequate
   - Test landscape/portrait modes

### Error Prevention & Recovery

#### Form Error Handling
```html
<!-- Accessible Error Message Pattern -->
<div class="form-group has-error">
  <label for="email-input" class="form-label">
    Email Address <span aria-label="required">*</span>
  </label>
  <input 
    type="email" 
    id="email-input" 
    name="email" 
    class="form-input error" 
    required
    aria-describedby="email-error email-help"
    aria-invalid="true"
  />
  <div id="email-help" class="form-help">
    We'll use this email to send you job notifications
  </div>
  <div id="email-error" class="form-error" role="alert" aria-live="assertive">
    <svg class="error-icon" aria-hidden="true"><!-- Error icon --></svg>
    Please enter a valid email address (e.g., john@example.com)
  </div>
</div>
```

#### Loading States
```html
<!-- Accessible Loading State -->
<button class="btn-primary" aria-describedby="loading-status" disabled>
  <span class="btn-spinner" aria-hidden="true"></span>
  <span class="btn-text">Applying...</span>
</button>
<div id="loading-status" role="status" aria-live="polite">
  Your application is being submitted. Please wait.
</div>
```

#### Success Confirmations
```html
<!-- Accessible Success Message -->
<div class="success-message" role="alert" aria-live="polite" tabindex="0">
  <svg class="success-icon" aria-hidden="true"><!-- Check icon --></svg>
  <div class="success-content">
    <h3 class="success-title">Application Submitted Successfully!</h3>
    <p class="success-description">
      Your application for Senior Software Engineer at TechCorp has been sent. 
      You'll receive a confirmation email shortly.
    </p>
    <div class="success-actions">
      <a href="/applications" class="btn-primary">View My Applications</a>
      <button type="button" class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
        Dismiss
      </button>
    </div>
  </div>
</div>
```

This comprehensive UX flows and accessibility documentation ensures that Jobifies provides an inclusive, efficient, and compliant user experience for all users, including those using assistive technologies.