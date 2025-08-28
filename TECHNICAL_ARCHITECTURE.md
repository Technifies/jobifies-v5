# Jobifies Platform - Technical Architecture Document

**Technical Lead Architect:** Claude Code  
**Document Version:** 1.0  
**Date:** August 27, 2025  
**Platform:** Next.js 14 + Node.js + PostgreSQL + Redis

---

## 1. SYSTEM ARCHITECTURE DESIGN

### 1.1 High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        JOBIFIES PLATFORM ARCHITECTURE               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐  │
│  │   FRONTEND      │    │    API GATEWAY   │    │   BACKEND       │  │
│  │   (Netlify)     │    │   (Cloudflare)   │    │   (Render)      │  │
│  │                 │    │                  │    │                 │  │
│  │ Next.js 14      │◄──►│ Rate Limiting    │◄──►│ Node.js/Express │  │
│  │ TypeScript      │    │ Load Balancing   │    │ TypeScript      │  │
│  │ Tailwind CSS    │    │ SSL Termination  │    │ JWT Auth        │  │
│  │ React Query     │    │ DDoS Protection  │    │ API Routes      │  │
│  └─────────────────┘    └──────────────────┘    └─────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                     DATA & SERVICES LAYER                      │  │
│  │                                                                 │  │
│  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │  │
│  │ │ PostgreSQL  │ │    Redis    │ │Elasticsearch│ │ File Storage│ │  │
│  │ │             │ │             │ │             │ │             │ │  │
│  │ │ Primary DB  │ │ Cache Layer │ │ Search Index│ │ AWS S3      │ │  │
│  │ │ User Data   │ │ Sessions    │ │ Jobs/Resumes│ │ Documents   │ │  │
│  │ │ Jobs Data   │ │ Search Cache│ │ Full-text   │ │ Images      │ │  │
│  │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    EXTERNAL INTEGRATIONS                       │  │
│  │                                                                 │  │
│  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │  │
│  │ │  Payment    │ │     AI/ML   │ │    Email    │ │     ATS     │ │  │
│  │ │  Services   │ │   Services  │ │   Services  │ │Integration  │ │  │
│  │ │             │ │             │ │             │ │             │ │  │
│  │ │ Stripe      │ │ OpenAI GPT  │ │ SendGrid    │ │ Greenhouse  │ │  │
│  │ │ Razorpay    │ │ Custom NLP  │ │ Twilio SMS  │ │ Workday     │ │  │
│  │ │ PayPal      │ │ Recommendations│ │ Push Notify│ │ BambooHR   │ │  │
│  │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Microservices Architecture Breakdown

**Decision: Modular Monolith with Service-Oriented Components**

Given the team size, timeline, and deployment constraints (Render for backend), I recommend a **modular monolith** architecture that can evolve into microservices:

```
┌─────────────────────────────────────────────────────────────────┐
│                    JOBIFIES BACKEND SERVICES                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────── │
│  │   AUTH SERVICE  │    │  USER SERVICE   │    │  JOB SERVICE  │ │
│  │                 │    │                 │    │               │ │
│  │ • JWT Tokens    │    │ • Profiles      │    │ • Job CRUD    │ │
│  │ • OAuth         │    │ • Preferences   │    │ • Applications│ │
│  │ • Sessions      │    │ • Resume Parse  │    │ • Matching    │ │
│  │ • RBAC          │    │ • Verification  │    │ • Analytics   │ │
│  └─────────────────┘    └─────────────────┘    └─────────────── │
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────── │
│  │ SEARCH SERVICE  │    │PAYMENT SERVICE  │    │NOTIFICATION   │ │
│  │                 │    │                 │    │   SERVICE     │ │
│  │ • Elasticsearch │    │ • Stripe        │    │ • Email       │ │
│  │ • Indexing      │    │ • Razorpay      │    │ • SMS         │ │
│  │ • Faceted Search│    │ • PayPal        │    │ • Push        │ │
│  │ • Auto-complete │    │ • Subscriptions │    │ • Templates   │ │
│  └─────────────────┘    └─────────────────┘    └─────────────── │
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────── │
│  │   AI/ML SERVICE │    │  ADMIN SERVICE  │    │FILE SERVICE   │ │
│  │                 │    │                 │    │               │ │
│  │ • Job Matching  │    │ • User Mgmt     │    │ • S3 Upload   │ │
│  │ • Recommendations│    │ • Content Mod   │    │ • Processing  │ │
│  │ • Resume Parse  │    │ • Analytics     │    │ • Validation  │ │
│  │ • Skills Extract│    │ • Reporting     │    │ • CDN         │ │
│  └─────────────────┘    └─────────────────┘    └─────────────── │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 API Architecture & Endpoints Structure

**RESTful API Design with GraphQL for Complex Queries**

#### Core API Structure:
```
/api/v1/
├── /auth/                    # Authentication endpoints
│   ├── POST /register        # User registration
│   ├── POST /login           # User login
│   ├── POST /logout          # User logout
│   ├── POST /refresh         # Token refresh
│   ├── POST /forgot-password # Password reset
│   └── POST /verify-email    # Email verification
│
├── /users/                   # User management
│   ├── GET /me               # Current user profile
│   ├── PUT /me               # Update profile
│   ├── POST /me/resume       # Upload resume
│   ├── GET /me/applications  # User applications
│   └── DELETE /me            # Delete account
│
├── /jobs/                    # Job management
│   ├── GET /                 # List jobs (with filters)
│   ├── POST /                # Create job (recruiters)
│   ├── GET /:id              # Get job details
│   ├── PUT /:id              # Update job
│   ├── DELETE /:id           # Delete job
│   └── POST /:id/apply       # Apply to job
│
├── /search/                  # Search functionality
│   ├── GET /jobs             # Search jobs
│   ├── GET /candidates       # Search candidates
│   ├── GET /companies        # Search companies
│   └── GET /suggest          # Auto-complete
│
├── /companies/               # Company management
│   ├── GET /                 # List companies
│   ├── POST /                # Create company profile
│   ├── GET /:id              # Company details
│   └── PUT /:id              # Update company
│
├── /subscriptions/           # Payment & subscriptions
│   ├── GET /plans            # Subscription plans
│   ├── POST /subscribe       # Create subscription
│   ├── PUT /subscription     # Update subscription
│   └── POST /webhooks        # Payment webhooks
│
├── /notifications/           # Notification system
│   ├── GET /                 # List notifications
│   ├── PUT /:id/read         # Mark as read
│   ├── POST /preferences     # Notification preferences
│   └── POST /send            # Send notification
│
├── /analytics/               # Analytics & insights
│   ├── GET /dashboard        # User dashboard data
│   ├── GET /job-performance  # Job posting analytics
│   ├── GET /search-trends    # Search analytics
│   └── GET /reports          # Generate reports
│
├── /admin/                   # Admin functionality
│   ├── GET /users            # User management
│   ├── GET /jobs             # Job moderation
│   ├── GET /reports          # Admin reports
│   └── POST /actions         # Admin actions
│
└── /integrations/            # Third-party integrations
    ├── GET /ats              # ATS connections
    ├── POST /ats/sync        # Sync with ATS
    ├── POST /webhooks        # Webhook handlers
    └── GET /status           # Integration status
```

#### GraphQL Endpoint for Complex Queries:
```
/graphql                      # GraphQL endpoint for complex data fetching
```

### 1.4 Caching Strategy with Redis

**Multi-Layer Caching Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                    REDIS CACHING LAYERS                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │  APPLICATION    │  │   SESSION       │  │    SEARCH    │ │
│  │     CACHE       │  │    CACHE        │  │    CACHE     │ │
│  │                 │  │                 │  │              │ │
│  │ • API Responses │  │ • User Sessions │  │ • Search     │ │
│  │ • Job Listings  │  │ • JWT Tokens    │  │   Results    │ │
│  │ • User Profiles │  │ • Temp Data     │  │ • Filters    │ │
│  │ • Company Data  │  │ • OAuth States  │  │ • Facets     │ │
│  │                 │  │                 │  │              │ │
│  │ TTL: 1-24 hours │  │ TTL: 30 minutes │  │ TTL: 5 mins  │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   REAL-TIME     │  │   ANALYTICS     │  │  RATE LIMIT  │ │
│  │     CACHE       │  │     CACHE       │  │    CACHE     │ │
│  │                 │  │                 │  │              │ │
│  │ • Notifications │  │ • Dashboard     │  │ • API Limits │ │
│  │ • Live Updates  │  │   Data          │  │ • User       │ │
│  │ • Chat Messages │  │ • Reports       │  │   Actions    │ │
│  │ • Job Alerts    │  │ • Metrics       │  │ • IP Blocks  │ │
│  │                 │  │                 │  │              │ │
│  │ TTL: Real-time  │  │ TTL: 1-6 hours  │  │ TTL: 1 hour  │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Cache Key Strategies:**
- User data: `user:{userId}:profile`
- Job listings: `jobs:list:{filters_hash}:page:{n}`
- Search results: `search:{type}:{query_hash}:{filters_hash}`
- Session data: `session:{sessionId}`
- Rate limiting: `rate_limit:{ip}:{endpoint}` or `rate_limit:{userId}:{action}`

---

## 2. DATABASE SCHEMA DESIGN

### 2.1 PostgreSQL Database Schema

**Primary Database Structure for 12 Modules:**

```sql
-- ==================================================================
-- MODULE 1: USER MANAGEMENT
-- ==================================================================

-- Core user authentication table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'job_seeker',
    status user_status_enum NOT NULL DEFAULT 'pending_verification',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    deleted_at TIMESTAMP -- Soft delete
);

-- User profiles for job seekers
CREATE TABLE job_seeker_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    location_city VARCHAR(100),
    location_state VARCHAR(100),
    location_country VARCHAR(100),
    profile_photo_url VARCHAR(500),
    professional_summary TEXT,
    desired_salary_min INTEGER,
    desired_salary_max INTEGER,
    desired_salary_currency VARCHAR(3) DEFAULT 'USD',
    availability availability_enum DEFAULT 'open_to_work',
    work_authorization work_auth_enum,
    profile_visibility visibility_enum DEFAULT 'public',
    profile_completeness INTEGER DEFAULT 0, -- Percentage
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work experience
CREATE TABLE work_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    job_title VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE, -- NULL for current position
    is_current BOOLEAN DEFAULT FALSE,
    location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Education
CREATE TABLE educations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    institution_name VARCHAR(200) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    field_of_study VARCHAR(100),
    start_date DATE,
    end_date DATE,
    gpa DECIMAL(3,2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category skill_category_enum,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level proficiency_enum NOT NULL,
    years_of_experience INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, skill_id)
);

-- ==================================================================
-- MODULE 2: COMPANY & RECRUITER MANAGEMENT
-- ==================================================================

-- Companies
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE,
    description TEXT,
    industry industry_enum,
    company_size company_size_enum,
    founded_year INTEGER,
    website_url VARCHAR(300),
    logo_url VARCHAR(500),
    headquarters_location VARCHAR(200),
    company_type company_type_enum DEFAULT 'private',
    status company_status_enum DEFAULT 'active',
    verification_status verification_enum DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company locations/offices
CREATE TABLE company_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    is_headquarters BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recruiter profiles
CREATE TABLE recruiter_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    job_title VARCHAR(200),
    phone VARCHAR(20),
    department VARCHAR(100),
    permissions recruiter_permissions_enum[] DEFAULT ARRAY['view_candidates'],
    is_company_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================================
-- MODULE 3: JOB POSTING & MANAGEMENT
-- ==================================================================

-- Job postings
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200),
    description TEXT NOT NULL,
    requirements TEXT,
    benefits TEXT,
    job_type job_type_enum NOT NULL,
    experience_level experience_level_enum NOT NULL,
    location_type location_type_enum NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'USD',
    salary_visible BOOLEAN DEFAULT TRUE,
    location_city VARCHAR(100),
    location_state VARCHAR(100),
    location_country VARCHAR(100),
    remote_work_allowed BOOLEAN DEFAULT FALSE,
    application_deadline DATE,
    application_limit INTEGER,
    status job_status_enum DEFAULT 'draft',
    priority_level priority_enum DEFAULT 'normal',
    view_count INTEGER DEFAULT 0,
    application_count INTEGER DEFAULT 0,
    featured_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    closed_at TIMESTAMP
);

-- Job required skills
CREATE TABLE job_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT TRUE,
    minimum_years INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, skill_id)
);

-- Job applications
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_url VARCHAR(500),
    status application_status_enum DEFAULT 'submitted',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT, -- Recruiter notes
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    UNIQUE(job_id, user_id)
);

-- Application screening questions and answers
CREATE TABLE job_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    question_type question_type_enum NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    options JSONB, -- For multiple choice questions
    order_position INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE application_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
    question_id UUID REFERENCES job_questions(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================================
-- MODULE 4: SUBSCRIPTIONS & PAYMENTS
-- ==================================================================

-- Subscription plans
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    plan_type plan_type_enum NOT NULL,
    target_audience audience_enum NOT NULL,
    price_monthly DECIMAL(10,2),
    price_annual DECIMAL(10,2),
    features JSONB NOT NULL,
    limits JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    status subscription_status_enum DEFAULT 'active',
    billing_cycle billing_cycle_enum DEFAULT 'monthly',
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    stripe_subscription_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment transactions
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status payment_status_enum DEFAULT 'pending',
    payment_method payment_method_enum NOT NULL,
    payment_gateway_id VARCHAR(200),
    gateway_response JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================================
-- MODULE 5: NOTIFICATIONS & ALERTS
-- ==================================================================

-- Notification templates
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    email_template TEXT,
    sms_template TEXT,
    push_template TEXT,
    template_variables JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type notification_type_enum NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    channels notification_channel_enum[] DEFAULT ARRAY['in_app'],
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification preferences
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    notification_type notification_type_enum NOT NULL,
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    push_enabled BOOLEAN DEFAULT TRUE,
    frequency frequency_enum DEFAULT 'immediate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, notification_type)
);

-- ==================================================================
-- MODULE 6: ANALYTICS & INSIGHTS
-- ==================================================================

-- User activity tracking
CREATE TABLE user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type activity_type_enum NOT NULL,
    entity_type VARCHAR(50), -- job, profile, company, etc.
    entity_id UUID,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Search analytics
CREATE TABLE search_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    search_type search_type_enum NOT NULL,
    query TEXT,
    filters JSONB,
    results_count INTEGER,
    clicked_result_id UUID,
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job performance metrics
CREATE TABLE job_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    applications INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, date)
);

-- ==================================================================
-- MODULE 7: AI/ML DATA STORAGE
-- ==================================================================

-- AI model predictions and recommendations
CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recommendation_type recommendation_type_enum NOT NULL,
    entity_id UUID NOT NULL, -- job_id or user_id being recommended
    score DECIMAL(5,4) NOT NULL, -- 0.0000 to 1.0000
    explanation TEXT,
    model_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills extraction and matching
CREATE TABLE skill_extractions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    source_type extraction_source_enum NOT NULL,
    source_text TEXT NOT NULL,
    extracted_skills JSONB NOT NULL,
    confidence_score DECIMAL(5,4),
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================================
-- MODULE 8: ADMIN & MODERATION
-- ==================================================================

-- Content moderation
CREATE TABLE content_moderations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type content_type_enum NOT NULL,
    content_id UUID NOT NULL,
    reported_by UUID REFERENCES users(id),
    moderator_id UUID REFERENCES users(id),
    reason moderation_reason_enum NOT NULL,
    status moderation_status_enum DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- System logs
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level log_level_enum NOT NULL,
    message TEXT NOT NULL,
    component VARCHAR(100),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================================
-- MODULE 9: ATS INTEGRATIONS
-- ==================================================================

-- ATS connections
CREATE TABLE ats_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    ats_provider ats_provider_enum NOT NULL,
    connection_name VARCHAR(200) NOT NULL,
    api_credentials JSONB NOT NULL, -- Encrypted
    webhook_url VARCHAR(500),
    sync_settings JSONB,
    status integration_status_enum DEFAULT 'connected',
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sync logs
CREATE TABLE integration_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID REFERENCES ats_integrations(id) ON DELETE CASCADE,
    sync_type sync_type_enum NOT NULL,
    status sync_status_enum NOT NULL,
    records_processed INTEGER,
    errors_encountered INTEGER,
    error_details JSONB,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================================
-- MODULE 10: FILE MANAGEMENT
-- ==================================================================

-- File uploads
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_category file_category_enum NOT NULL,
    upload_status upload_status_enum DEFAULT 'processing',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Resume parsing results
CREATE TABLE resume_parsing_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID REFERENCES files(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parsed_data JSONB NOT NULL,
    confidence_score DECIMAL(5,4),
    parser_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================================
-- ENUMS AND TYPES DEFINITIONS
-- ==================================================================

-- Create all the enums used in the schema
CREATE TYPE user_role_enum AS ENUM ('job_seeker', 'recruiter', 'company_admin', 'platform_admin');
CREATE TYPE user_status_enum AS ENUM ('pending_verification', 'active', 'suspended', 'deleted');
CREATE TYPE availability_enum AS ENUM ('open_to_work', 'passively_looking', 'not_looking');
CREATE TYPE work_auth_enum AS ENUM ('citizen', 'permanent_resident', 'work_visa', 'need_sponsorship');
CREATE TYPE visibility_enum AS ENUM ('public', 'private', 'recruiters_only');
CREATE TYPE skill_category_enum AS ENUM ('technical', 'soft', 'language', 'certification');
CREATE TYPE proficiency_enum AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE job_type_enum AS ENUM ('full_time', 'part_time', 'contract', 'temporary', 'internship');
CREATE TYPE location_type_enum AS ENUM ('on_site', 'remote', 'hybrid');
CREATE TYPE experience_level_enum AS ENUM ('entry', 'mid', 'senior', 'executive');
CREATE TYPE job_status_enum AS ENUM ('draft', 'published', 'paused', 'closed', 'expired');
CREATE TYPE application_status_enum AS ENUM ('submitted', 'reviewing', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected', 'withdrawn');
CREATE TYPE subscription_status_enum AS ENUM ('active', 'past_due', 'canceled', 'unpaid');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'succeeded', 'failed', 'refunded');
CREATE TYPE notification_type_enum AS ENUM ('application_update', 'new_job_match', 'profile_view', 'message', 'system_alert');

-- ==================================================================
-- INDEXES FOR PERFORMANCE
-- ==================================================================

-- User management indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_job_seeker_profiles_user_id ON job_seeker_profiles(user_id);
CREATE INDEX idx_work_experiences_user_id ON work_experiences(user_id);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);

-- Job and application indexes
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_location ON jobs(location_city, location_state, location_country);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_jobs_job_type ON jobs(job_type);
CREATE INDEX idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);

-- Search and performance indexes
CREATE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_notifications_user_id_unread ON notifications(user_id) WHERE is_read = FALSE;
CREATE INDEX idx_user_activities_user_id_created_at ON user_activities(user_id, created_at DESC);

-- Full-text search indexes
CREATE INDEX idx_jobs_full_text ON jobs USING GIN(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_companies_full_text ON companies USING GIN(to_tsvector('english', name || ' ' || description));

```

### 2.2 Database Performance Optimization

**Optimization Strategies:**

1. **Connection Pooling:** pgBouncer for efficient connection management
2. **Read Replicas:** Primary-replica setup for read-heavy operations
3. **Partitioning:** Time-based partitioning for logs and analytics tables
4. **Query Optimization:** Regular EXPLAIN ANALYZE on slow queries
5. **Materialized Views:** For complex analytics queries

---

## 3. TECHNICAL DECISION DOCUMENTATION

### 3.1 Technology Stack Confirmation & Refinements

**Confirmed Technology Choices with Justifications:**

#### Frontend Stack:
- **Next.js 14:** Server-side rendering for SEO, excellent TypeScript support, built-in optimization
- **TypeScript:** Type safety, better developer experience, reduced runtime errors
- **Tailwind CSS:** Rapid UI development, consistent design system, small bundle size
- **React Query (TanStack Query):** Powerful data fetching, caching, and synchronization
- **Zustand:** Lightweight state management for client-side state
- **React Hook Form:** Performant forms with minimal re-renders
- **Framer Motion:** Smooth animations and transitions

#### Backend Stack:
- **Node.js + Express:** JavaScript ecosystem consistency, excellent TypeScript support
- **PostgreSQL:** ACID compliance, complex queries support, JSON operations
- **Redis:** High-performance caching, session storage, real-time features
- **Elasticsearch:** Advanced search capabilities, faceted search, analytics
- **AWS S3:** Reliable file storage, CDN integration, cost-effective

#### Deployment & Infrastructure:
- **Frontend: Netlify**
  - Automatic builds from Git
  - Global CDN with edge computing
  - Built-in form handling and serverless functions
  - Excellent Next.js support

- **Backend: Render**
  - Easy deployment from Git
  - Auto-scaling capabilities
  - PostgreSQL and Redis managed services
  - Cost-effective for startups

### 3.2 Database Design Patterns & Relationships

**Entity Relationship Design Principles:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CORE ENTITY RELATIONSHIPS                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│     USERS ──┬── JOB_SEEKER_PROFILES ──┬── WORK_EXPERIENCES             │
│             │                          ├── EDUCATIONS                   │
│             │                          ├── USER_SKILLS                  │
│             │                          └── JOB_APPLICATIONS             │
│             │                                                           │
│             ├── RECRUITER_PROFILES ─── COMPANIES ──┬── COMPANY_LOCATIONS│
│             │                                       ├── JOBS             │
│             │                                       └── JOB_SKILLS       │
│             │                                                           │
│             ├── SUBSCRIPTIONS ─── SUBSCRIPTION_PLANS                    │
│             ├── PAYMENTS                                                 │
│             ├── NOTIFICATIONS                                            │
│             ├── USER_ACTIVITIES                                          │
│             └── FILES ─── RESUME_PARSING_RESULTS                        │
│                                                                         │
│     JOBS ───┬── JOB_APPLICATIONS ──┬── APPLICATION_ANSWERS              │
│             ├── JOB_SKILLS          └── JOB_QUESTIONS                   │
│             └── JOB_METRICS                                              │
│                                                                         │
│     SKILLS ──┬── USER_SKILLS                                            │
│              └── JOB_SKILLS                                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────┘
```

**Design Patterns Applied:**

1. **Single Table Inheritance:** Users table with role-based profiles
2. **Polymorphic Associations:** Files can belong to different entities
3. **Event Sourcing:** User activities for audit and analytics
4. **JSONB Fields:** Flexible metadata storage without schema changes
5. **Soft Deletes:** Maintain data integrity with deleted_at timestamps
6. **Temporal Data:** Track changes over time with created_at/updated_at

### 3.3 Authentication & Authorization Architecture

**JWT-based Authentication with OAuth Integration:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CLIENT                    API GATEWAY                    AUTH SERVICE  │
│     │                          │                             │          │
│     │ 1. Login Request         │                             │          │
│     ├─────────────────────────►│ 2. Forward to Auth         │          │
│     │                          ├─────────────────────────────►│          │
│     │                          │                             │          │
│     │                          │ 3. Validate Credentials     │          │
│     │                          │    Generate JWT Tokens      │          │
│     │                          │◄─────────────────────────────┤          │
│     │ 4. Return JWT Tokens     │                             │          │
│     │◄─────────────────────────┤                             │          │
│     │                          │                             │          │
│     │ 5. API Request + JWT     │                             │          │
│     ├─────────────────────────►│ 6. Verify JWT              │          │
│     │                          ├─────────────────────────────►│          │
│     │                          │ 7. Return User Context     │          │
│     │                          │◄─────────────────────────────┤          │
│     │ 8. Authorized Response   │                             │          │
│     │◄─────────────────────────┤                             │          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**JWT Token Structure:**
```json
{
  "access_token": {
    "sub": "user_id",
    "email": "user@example.com",
    "role": "job_seeker|recruiter|admin",
    "permissions": ["read:profile", "write:applications"],
    "exp": 1640995200,
    "iat": 1640908800
  },
  "refresh_token": {
    "sub": "user_id",
    "type": "refresh",
    "exp": 1648684800,
    "iat": 1640908800
  }
}
```

**Role-Based Access Control (RBAC) Matrix:**

| Resource | Job Seeker | Recruiter | Company Admin | Platform Admin |
|----------|------------|-----------|---------------|----------------|
| Own Profile | CRUD | R | R | CRUD |
| Other Profiles | R (public) | R | R | CRUD |
| Job Listings | R | CRUD (own) | CRUD (company) | CRUD |
| Applications | CRUD (own) | R (for jobs) | R (company jobs) | CRUD |
| Company Data | R | R | CRUD | CRUD |
| User Management | - | - | CRU (team) | CRUD |
| System Settings | - | - | - | CRUD |

### 3.4 File Storage Strategy

**Multi-Tier File Storage Architecture:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FILE STORAGE STRATEGY                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CLIENT UPLOAD          PROCESSING LAYER           STORAGE LAYER        │
│                                                                     │
│  ┌─────────────┐       ┌─────────────┐            ┌─────────────┐      │
│  │   Resume    │──────►│   Upload    │────────────►│   AWS S3    │      │
│  │   Images    │       │ Validation  │            │   Primary   │      │
│  │ Documents   │       │ Virus Scan  │            │   Storage   │      │
│  └─────────────┘       │  Metadata   │            └─────────────┘      │
│                        │ Extraction  │                    │             │
│                        └─────────────┘                    │             │
│                               │                           │             │
│                        ┌─────────────┐            ┌─────────────┐      │
│                        │   Resume    │            │ CloudFront  │      │
│                        │  Parsing    │◄───────────┤     CDN     │      │
│                        │    AI/ML    │            │ Distribution │      │
│                        └─────────────┘            └─────────────┘      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**File Processing Pipeline:**
1. **Client Upload:** Direct upload to S3 with presigned URLs
2. **Validation:** File type, size, and content validation
3. **Virus Scanning:** ClamAV or AWS GuardDuty integration
4. **Metadata Extraction:** File properties and EXIF data
5. **Resume Parsing:** AI-powered extraction of structured data
6. **CDN Distribution:** Global content delivery via CloudFront
7. **Backup Strategy:** Cross-region replication for critical files

**File Categories & Retention:**
- **Resumes/CVs:** 7 years retention, high availability
- **Profile Images:** 3 years retention, CDN optimized
- **Company Logos:** Permanent storage, multiple sizes
- **System Logs:** 1 year retention, compressed storage
- **Temporary Files:** 24-hour auto-deletion

### 3.5 Search Architecture with Elasticsearch

**Elasticsearch Cluster Design:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ELASTICSEARCH ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  APPLICATION LAYER              ELASTICSEARCH CLUSTER                  │
│                                                                     │
│  ┌─────────────────┐            ┌─────────────────────────────────┐ │
│  │   Search API    │◄──────────►│           MASTER NODES              │ │
│  │                 │            │         (3 nodes for HA)           │ │
│  │ • Query Builder │            │                                     │ │
│  │ • Result Parser │            │ • Cluster management                │ │
│  │ • Aggregations  │            │ • Index management                  │ │
│  │ • Auto-complete │            │ • Shard allocation                  │ │
│  └─────────────────┘            └─────────────────────────────────┘ │
│           │                                        │                    │
│           │                     ┌─────────────────────────────────┐ │
│           └────────────────────►│           DATA NODES                │ │
│                                 │         (6 nodes minimum)          │ │
│                                 │                                     │ │
│                                 │ ┌─────────────┐ ┌─────────────┐     │ │
│                                 │ │    Jobs     │ │  Candidates │     │ │
│                                 │ │   Index     │ │    Index    │     │ │
│                                 │ └─────────────┘ └─────────────┘     │ │
│                                 │ ┌─────────────┐ ┌─────────────┐     │ │
│                                 │ │ Companies   │ │  Analytics  │     │ │
│                                 │ │   Index     │ │    Index    │     │ │
│                                 │ └─────────────┘ └─────────────┘     │ │
│                                 └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

**Index Structures:**

```json
// Jobs Index Mapping
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "standard",
        "fields": {
          "keyword": {"type": "keyword"},
          "suggest": {"type": "completion"}
        }
      },
      "description": {
        "type": "text",
        "analyzer": "english"
      },
      "skills": {
        "type": "nested",
        "properties": {
          "name": {"type": "keyword"},
          "required": {"type": "boolean"},
          "years": {"type": "integer"}
        }
      },
      "location": {
        "type": "geo_point"
      },
      "salary_range": {
        "type": "integer_range"
      },
      "company": {
        "type": "nested",
        "properties": {
          "name": {"type": "keyword"},
          "industry": {"type": "keyword"},
          "size": {"type": "keyword"}
        }
      },
      "created_at": {"type": "date"},
      "boost_score": {"type": "float"}
    }
  }
}

// Candidates Index Mapping
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "fields": {
          "keyword": {"type": "keyword"}
        }
      },
      "summary": {
        "type": "text",
        "analyzer": "english"
      },
      "skills": {
        "type": "nested",
        "properties": {
          "name": {"type": "keyword"},
          "level": {"type": "keyword"},
          "years": {"type": "integer"}
        }
      },
      "experience": {
        "type": "nested",
        "properties": {
          "title": {"type": "text"},
          "company": {"type": "keyword"},
          "duration_months": {"type": "integer"}
        }
      },
      "location": {
        "type": "geo_point"
      },
      "salary_expectation": {
        "type": "integer_range"
      },
      "availability": {"type": "keyword"},
      "last_active": {"type": "date"}
    }
  }
}
```

**Search Features Implementation:**
- **Full-text Search:** Multi-field search with relevance scoring
- **Faceted Search:** Dynamic filters based on search results
- **Geo-location Search:** Distance-based job/candidate matching
- **Auto-complete:** Type-ahead suggestions for better UX
- **Synonyms & Stemming:** Handle variations in job titles and skills
- **Boosting:** Premium jobs and active candidates get higher scores
- **Analytics:** Search performance and user behavior tracking

---

## 4. SCALABILITY & PERFORMANCE PLAN

### 4.1 Load Balancing Strategy

**Multi-Layer Load Balancing Architecture:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                      LOAD BALANCING ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   USERS                     EDGE LAYER               APPLICATION LAYER │
│      │                                                                 │
│      │                ┌─────────────────┐                             │
│      ├───────────────►│   Cloudflare    │                             │
│      │                │                 │                             │
│      │                │ • DDoS Protection                             │
│      │                │ • SSL Termination                             │
│      │                │ • Rate Limiting  │                             │
│      │                │ • Caching        │                             │
│      │                └─────────────────┘                             │
│      │                         │                                       │
│      │                ┌─────────────────┐                             │
│      │                │   Netlify CDN   │                             │
│      │                │  (Frontend)     │                             │
│      │                │                 │                             │
│      │                │ • Global CDN                                   │
│      │                │ • Edge Functions                               │
│      │                │ • Auto-scaling  │                             │
│      │                └─────────────────┘                             │
│                                                                       │
│   API TRAFFIC                   │                                       │
│      │                ┌─────────────────┐                             │
│      │                │ Render Platform │                             │
│      └───────────────►│  Load Balancer  │                             │
│                       │                 │                             │
│                       │ • Health Checks │                             │
│                       │ • Round Robin   │                             │
│                       │ • Sticky Sessions│                           │
│                       └─────────────────┘                             │
│                               │                                       │
│                       ┌───────┼───────┐                               │
│                       │       │       │                               │
│               ┌───────▼─┐ ┌───▼───┐ ┌─▼─────┐                         │
│               │ API     │ │ API   │ │ API   │                         │
│               │Instance │ │Instance│ │Instance│                       │
│               │   #1    │ │  #2   │ │  #3   │                         │
│               │         │ │       │ │       │                         │
│               └─────────┘ └───────┘ └───────┘                         │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Load Balancing Configuration:**

1. **Frontend (Netlify):**
   - Automatic global CDN distribution
   - Edge function processing
   - Intelligent traffic routing
   - Automatic failover

2. **API Gateway (Cloudflare):**
   - Geographic load distribution
   - Health check monitoring
   - Circuit breaker patterns
   - Rate limiting per user/IP

3. **Backend (Render):**
   - Application-level load balancing
   - Auto-scaling based on CPU/memory
   - Session affinity for stateful operations
   - Rolling deployments

### 4.2 Database Optimization Approach

**Multi-Tier Database Optimization Strategy:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DATABASE OPTIMIZATION LAYERS                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  APPLICATION LAYER          CACHING LAYER          DATABASE LAYER    │
│                                                                     │
│  ┌─────────────────┐       ┌─────────────────┐    ┌───────────────┐ │
│  │ Connection      │       │     Redis       │    │  PostgreSQL   │ │
│  │   Pooling       │◄─────►│     Cache       │◄──►│   Primary     │ │
│  │                 │       │                 │    │   Database    │ │
│  │ • pgBouncer     │       │ • Query Results │    │               │ │
│  │ • Connection    │       │ • Session Data  │    │ • ACID        │ │
│  │   Reuse         │       │ • User Profiles │    │ • JSONB       │ │
│  │ • Pool Size     │       │ • Job Listings  │    │ • Full-text   │ │
│  │   Management    │       │ • Search Cache  │    │   Search      │ │
│  └─────────────────┘       └─────────────────┘    └───────────────┘ │
│                                     │                       │         │
│                                     │              ┌───────────────┐ │
│                                     │              │  PostgreSQL   │ │
│                                     └─────────────►│   Read        │ │
│                                                    │   Replicas    │ │
│                                                    │               │ │
│                                                    │ • Read-only   │ │
│                                                    │ • Reports     │ │
│                                                    │ • Analytics   │ │
│                                                    │ • Async Ops   │ │
│                                                    └───────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

**Database Performance Optimizations:**

1. **Query Optimization:**
   ```sql
   -- Example optimized job search query
   SELECT j.id, j.title, j.salary_min, j.salary_max, c.name as company_name
   FROM jobs j
   INNER JOIN companies c ON j.company_id = c.id
   WHERE j.status = 'published'
     AND j.location_city = $1
     AND j.salary_min >= $2
   ORDER BY j.created_at DESC, j.priority_level DESC
   LIMIT 20 OFFSET $3;
   
   -- Supporting indexes
   CREATE INDEX CONCURRENTLY idx_jobs_search_optimized 
   ON jobs (status, location_city, salary_min, created_at DESC, priority_level DESC);
   ```

2. **Connection Management:**
   - pgBouncer with transaction pooling
   - Pool size: 25 connections per instance
   - Connection timeout: 30 seconds
   - Idle connection timeout: 10 minutes

3. **Read Replica Strategy:**
   - 2 read replicas for high availability
   - Read-only queries routed to replicas
   - Automatic failover to primary if replica fails
   - Async replication with <1 second lag

4. **Partitioning Strategy:**
   ```sql
   -- Partition user_activities by date
   CREATE TABLE user_activities (
       id UUID DEFAULT gen_random_uuid(),
       user_id UUID NOT NULL,
       activity_type activity_type_enum NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   ) PARTITION BY RANGE (created_at);
   
   -- Monthly partitions
   CREATE TABLE user_activities_2025_08 
   PARTITION OF user_activities 
   FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');
   ```

### 4.3 Caching Layers and Strategies

**Comprehensive Caching Architecture:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CACHING STRATEGY LAYERS                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│    BROWSER          CDN LAYER          APPLICATION LAYER             │
│      │                 │                       │                     │
│ ┌────▼────┐      ┌─────▼─────┐         ┌──────▼──────┐              │
│ │Browser  │      │Cloudflare │         │   Redis     │              │
│ │ Cache   │      │    CDN    │         │   Cache     │              │
│ │         │      │           │         │             │              │
│ │• Static │      │• Static   │         │• API Results│              │
│ │  Assets │      │  Assets   │         │• User Data  │              │
│ │• API    │      │• Images   │         │• Sessions   │              │
│ │  Cache  │      │• JS/CSS   │         │• Search     │              │
│ │         │      │• Documents│         │  Results    │              │
│ │TTL: 24h │      │           │         │• Job Lists  │              │
│ └─────────┘      │TTL: 30    │         │             │              │
│                  │days       │         │TTL: 1-24h   │              │
│                  └───────────┘         └─────────────┘              │
│                                                │                     │
│                                        ┌──────▼──────┐              │
│                                        │Application  │              │
│                                        │Memory Cache │              │
│                                        │             │              │
│                                        │• Hot Data   │              │
│                                        │• Config     │              │
│                                        │• Templates  │              │
│                                        │             │              │
│                                        │TTL: 5-60min │              │
│                                        └─────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

**Cache Implementation Strategy:**

1. **Redis Configuration:**
   ```javascript
   // Cache configuration
   const cacheConfig = {
     // User profiles - longer TTL as they change less frequently
     'user:profile': { ttl: 3600 * 24 }, // 24 hours
     
     // Job listings - medium TTL with cache invalidation
     'jobs:list': { ttl: 3600 * 2 }, // 2 hours
     
     // Search results - short TTL due to dynamic nature
     'search:results': { ttl: 300 }, // 5 minutes
     
     // Session data - security sensitive
     'session': { ttl: 1800 }, // 30 minutes
     
     // API responses - varies by endpoint
     'api:response': { ttl: 600 } // 10 minutes
   };
   ```

2. **Cache Strategies by Data Type:**
   - **Static Content:** CDN caching with 30-day TTL
   - **User Profiles:** Redis with 24-hour TTL + cache invalidation
   - **Job Listings:** Redis with 2-hour TTL + real-time updates
   - **Search Results:** Redis with 5-minute TTL + pagination caching
   - **Analytics Data:** Redis with 6-hour TTL + background refresh

3. **Cache Invalidation Patterns:**
   ```javascript
   // Event-based cache invalidation
   const cacheInvalidation = {
     'user_profile_updated': ['user:{userId}:*'],
     'job_posted': ['jobs:list:*', 'search:jobs:*'],
     'application_submitted': ['user:{userId}:applications', 'job:{jobId}:metrics'],
     'subscription_changed': ['user:{userId}:permissions']
   };
   ```

### 4.4 CDN Implementation Plan

**Global Content Delivery Strategy:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CDN IMPLEMENTATION PLAN                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   GLOBAL USERS                    EDGE LOCATIONS                     │
│                                                                     │
│  ┌─────────────┐                ┌─────────────────────────────────┐ │
│  │   Americas  │               │        Cloudflare CDN           │ │
│  │             │◄─────────────►│                                 │ │
│  │ • US East   │               │ • 200+ Edge Locations          │ │
│  │ • US West   │               │ • Intelligent Routing          │ │
│  │ • Canada    │               │ • DDoS Protection               │ │
│  │ • Brazil    │               │ • SSL/TLS Termination           │ │
│  └─────────────┘               │ • Rate Limiting                 │ │
│                                 │ • Image Optimization            │ │
│  ┌─────────────┐               │ • Minification                  │ │
│  │    Europe   │               │ • Brotli Compression            │ │
│  │             │◄─────────────►│                                 │ │
│  │ • London    │               └─────────────────────────────────┘ │
│  │ • Frankfurt │                              │                    │
│  │ • Paris     │               ┌─────────────▼─────────────┐      │
│  │ • Amsterdam │               │       Origin Servers      │      │
│  └─────────────┘               │                           │      │
│                                 │ • Netlify (Frontend)      │      │
│  ┌─────────────┐               │ • Render (API)            │      │
│  │ Asia-Pacific│               │ • AWS S3 (Files)          │      │
│  │             │◄─────────────►│ • Elasticsearch (Search)  │      │
│  │ • Tokyo     │               │                           │      │
│  │ • Singapore │               └───────────────────────────┘      │
│  │ • Sydney    │                                                  │
│  │ • Mumbai    │                                                  │
│  └─────────────┘                                                  │
└─────────────────────────────────────────────────────────────────────┘
```

**CDN Configuration Strategy:**

1. **Content Categories & Caching Rules:**
   ```javascript
   const cdnRules = {
     // Static assets - Long-term caching
     '*.js|*.css|*.png|*.jpg|*.svg': {
       ttl: '30 days',
       compression: 'brotli',
       minify: true
     },
     
     // HTML pages - Short-term with revalidation
     '*.html': {
       ttl: '1 hour',
       revalidate: true,
       compression: 'gzip'
     },
     
     // API responses - Very short caching
     '/api/*': {
       ttl: '5 minutes',
       bypassCache: ['POST', 'PUT', 'DELETE'],
       headers: ['Authorization']
     },
     
     // Resume files - Medium-term caching
     '/files/resumes/*': {
       ttl: '7 days',
       privateCache: true,
       requireAuth: true
     }
   };
   ```

2. **Performance Optimizations:**
   - **Image Optimization:** Auto WebP conversion with fallbacks
   - **Minification:** JavaScript, CSS, and HTML compression
   - **HTTP/2 Push:** Critical resource preloading
   - **Brotli Compression:** 20-25% better than gzip
   - **Smart Caching:** ML-driven cache decisions

### 4.5 Auto-Scaling Configuration for Render

**Render Auto-Scaling Strategy:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    RENDER AUTO-SCALING CONFIGURATION                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   TRAFFIC LOAD              SCALING TRIGGERS              INSTANCES   │
│                                                                     │
│      Low                   ┌─────────────────┐              1-2      │
│   (0-100 RPM)             │  CPU < 30%      │            ┌─────────┐ │
│       │                   │  Memory < 50%   │            │Instance │ │
│       │                   │  Response < 200ms│           │   #1    │ │
│       ▼                   └─────────────────┘            └─────────┘ │
│  ┌──────────┐                      │                                 │
│  │ Baseline │                      │                                 │
│  │ Resource │                      ▼                                 │
│  │   Usage  │             ┌─────────────────┐                       │
│  └──────────┘             │  Scale Down     │                       │
│                           │  Conditions     │                       │
│      │                    │                 │                       │
│      │                    │ • CPU < 30%     │                       │
│      ▼                    │   for 10 min    │                       │
│                           │ • Low traffic   │                       │
│    Medium                 │   sustained     │                       │
│  (100-500 RPM)           └─────────────────┘                       │
│       │                                                              │
│       │                  ┌─────────────────┐              2-4       │
│       ▼                  │  CPU 30-70%     │            ┌─────────┐ │
│  ┌──────────┐           │  Memory 50-80%  │            │Instance │ │
│  │ Moderate │           │  Response < 500ms│           │   #2    │ │
│  │ Resource │           └─────────────────┘            └─────────┘ │
│  │   Load   │                    │                     ┌─────────┐ │
│  └──────────┘                    │                     │Instance │ │
│                                  ▼                     │   #3    │ │
│      │                 ┌─────────────────┐             └─────────┘ │
│      │                 │  Scale Up       │                         │
│      ▼                 │  Conditions     │                         │
│                        │                 │                         │
│     High               │ • CPU > 70%     │                         │
│  (500+ RPM)           │   for 5 min     │                         │
│       │                │ • Memory > 80%  │              4-8        │
│       ▼                │ • Response > 1s │            ┌─────────┐  │
│  ┌──────────┐         │ • Queue length  │            │Instance │  │
│  │   Peak   │         │   > 100         │            │   #4    │  │
│  │ Resource │         └─────────────────┘            └─────────┘  │
│  │   Load   │                                        ┌─────────┐  │
│  └──────────┘                                        │Instance │  │
│                                                      │   #5    │  │
│                                                      └─────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

**Auto-Scaling Configuration:**

```yaml
# render.yaml configuration
services:
  - type: web
    name: jobifies-api
    env: node
    plan: standard
    buildCommand: npm run build
    startCommand: npm start
    
    # Auto-scaling configuration
    scaling:
      minInstances: 2
      maxInstances: 8
      targetCPU: 70
      targetMemory: 80
      scaleUpCooldown: 300s  # 5 minutes
      scaleDownCooldown: 600s # 10 minutes
    
    # Health checks
    healthCheckPath: /health
    healthCheckTimeout: 10s
    healthCheckInterval: 30s
    
    # Environment variables
    envVars:
      - key: NODE_ENV
        value: production
      - key: MAX_CONNECTIONS
        value: 100
      - key: REDIS_URL
        fromService:
          type: redis
          name: jobifies-redis
      - key: DATABASE_URL
        fromDatabase:
          name: jobifies-db
```

**Performance Monitoring & Metrics:**

1. **Key Performance Indicators:**
   - **Response Time:** < 200ms for 95th percentile
   - **Throughput:** Handle 10,000+ concurrent users
   - **Error Rate:** < 0.1% for critical endpoints
   - **Availability:** 99.9% uptime (8.76 hours downtime/year)

2. **Auto-Scaling Triggers:**
   ```javascript
   const scalingMetrics = {
     scaleUp: {
       cpu: { threshold: 70, duration: '5m' },
       memory: { threshold: 80, duration: '5m' },
       responseTime: { threshold: 1000, duration: '3m' },
       errorRate: { threshold: 1, duration: '2m' }
     },
     scaleDown: {
       cpu: { threshold: 30, duration: '10m' },
       memory: { threshold: 50, duration: '10m' },
       responseTime: { threshold: 200, duration: '15m' }
     }
   };
   ```

3. **Resource Limits & Optimization:**
   - **Memory:** 512MB base, up to 2GB per instance
   - **CPU:** 0.5 vCPU base, up to 2 vCPU per instance
   - **Connection Pool:** 25 DB connections per instance
   - **Request Timeout:** 30 seconds
   - **Graceful Shutdown:** 30-second drain period

---

## 5. SECURITY ARCHITECTURE

### 5.1 Authentication Flow Design (JWT + OAuth)

**Multi-Provider Authentication Architecture:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                       AUTHENTICATION ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│    CLIENT APPLICATION          AUTH PROVIDERS         AUTH SERVICE   │
│                                                                     │
│  ┌──────────────────┐              ┌─────────────────┐             │
│  │  Login Options  │              │    Google      │             │
│  │                 │              │     OAuth       │             │
│  │ • Email/Password │              │                 │             │
│  │ • Google OAuth  │◄─────────────►│ Client ID/      │             │
│  │ • LinkedIn OAuth│              │ Secret Config   │             │
│  │ • GitHub OAuth  │              │                 │             │
│  │ • Magic Links   │              └─────────────────┘             │
│  │ • 2FA Support   │                      │                     │
│  └──────────────────┘              ┌─────────────────┐             │
│           │                       │   LinkedIn     │             │
│           │                       │     OAuth       │             │
│           │                       │                 │             │
│           │                       │ Professional    │             │
│           │                       │ Profile Import  │             │
│           │                       └─────────────────┘             │
│           │                               │                     │
│           └──────────────────────────────────────► ┌───────────────┐ │
│                                                    │ JWT Token    │ │
│                                                    │  Generation  │ │
│                                                    │              │ │
│                                                    │ • Access     │ │
│                                                    │   Token      │ │
│                                                    │ • Refresh    │ │
│                                                    │   Token      │ │
│                                                    │ • User Claims│ │
│                                                    │ • Role/Perms │ │
│                                                    └───────────────┘ │
│                                                            │       │
│                                              ┌───────────────┘       │
│                                              │                     │
│                                     ┌────────▼────────┐              │
│                                     │   User Session     │              │
│                                     │   Management       │              │
│                                     │                   │              │
│                                     │ • Session Storage │              │
│                                     │ • Token Validation│              │
│                                     │ • Logout Handling │              │
│                                     │ • Session Timeout │              │
│                                     └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

**Authentication Flow Implementation:**

1. **JWT Token Management:**
   ```javascript
   // JWT configuration
   const jwtConfig = {
     accessToken: {
       secret: process.env.JWT_ACCESS_SECRET,
       expiresIn: '15m',
       algorithm: 'HS256'
     },
     refreshToken: {
       secret: process.env.JWT_REFRESH_SECRET,
       expiresIn: '7d',
       algorithm: 'HS256'
     }
   };
   
   // Token structure
   const tokenPayload = {
     sub: user.id,
     email: user.email,
     role: user.role,
     permissions: user.permissions,
     iat: Date.now(),
     exp: Date.now() + (15 * 60 * 1000), // 15 minutes
     jti: uuidv4() // Unique token ID for revocation
   };
   ```

2. **OAuth Provider Integration:**
   ```javascript
   // OAuth configuration
   const oauthProviders = {
     google: {
       clientId: process.env.GOOGLE_CLIENT_ID,
       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
       redirectUri: `${process.env.BASE_URL}/auth/google/callback`,
       scope: 'openid profile email'
     },
     linkedin: {
       clientId: process.env.LINKEDIN_CLIENT_ID,
       clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
       redirectUri: `${process.env.BASE_URL}/auth/linkedin/callback`,
       scope: 'r_liteprofile r_emailaddress'
     },
     github: {
       clientId: process.env.GITHUB_CLIENT_ID,
       clientSecret: process.env.GITHUB_CLIENT_SECRET,
       redirectUri: `${process.env.BASE_URL}/auth/github/callback`,
       scope: 'user:email'
     }
   };
   ```

3. **Two-Factor Authentication:**
   ```javascript
   // 2FA implementation using TOTP
   const twoFactorAuth = {
     generateSecret: () => {
       return speakeasy.generateSecret({
         issuer: 'Jobifies',
         name: user.email,
         length: 32
       });
     },
     verifyToken: (token, secret) => {
       return speakeasy.totp.verify({
         secret: secret,
         encoding: 'base32',
         token: token,
         window: 2 // Allow 2 time steps of variance
       });
     }
   };
   ```

### 5.2 Data Encryption Strategies

**Multi-Layer Encryption Architecture:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA ENCRYPTION LAYERS                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│    TRANSIT LAYER           AT-REST LAYER           APPLICATION LAYER   │
│                                                                     │
│  ┌─────────────────┐      ┌─────────────────┐     ┌─────────────────┐ │
│  │  TLS/SSL 1.3   │      │ Database AES-256│     │ Field-level    │ │
│  │  Encryption    │      │   Encryption    │     │  Encryption     │ │
│  │               │      │                 │     │                 │ │
│  │ • HTTPS Only   │      │ • Postgres      │     │ • PII Data      │ │
│  │ • HSTS Headers │      │   Transparent   │     │ • Passwords     │ │
│  │ • Perfect      │      │   Encryption    │     │ • API Keys      │ │
│  │   Forward     │      │ • Redis TLS     │     │ • OAuth Tokens  │ │
│  │   Secrecy     │      │ • S3 Server     │     │ • Payment Data  │ │
│  │ • Certificate  │      │   Side         │     │                 │ │
│  │   Pinning     │      │   Encryption    │     │ • AES-256-GCM   │ │
│  └─────────────────┘      └─────────────────┘     │ • PBKDF2/bcrypt │ │
│                                                      └─────────────────┘ │
│                                                               │     │
│                                              ┌─────────────────┐     │
│                                              │   Key         │     │
│                                              │ Management   │     │
│                                              │              │     │
│                                              │ • AWS KMS     │     │
│                                              │ • Key        │     │
│                                              │   Rotation    │     │
│                                              │ • Secure     │     │
│                                              │   Storage     │     │
│                                              │ • Access     │     │
│                                              │   Control     │     │
│                                              └─────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
```

**Encryption Implementation:**

1. **Field-Level Encryption:**
   ```javascript
   // Encryption utility for sensitive data
   const encryptionUtils = {
     // Encrypt PII data
     encryptPII: (data) => {
       const cipher = crypto.createCipher('aes-256-gcm', process.env.ENCRYPTION_KEY);
       let encrypted = cipher.update(data, 'utf8', 'hex');
       encrypted += cipher.final('hex');
       const authTag = cipher.getAuthTag();
       return {
         encrypted: encrypted,
         authTag: authTag.toString('hex')
       };
     },
     
     // Decrypt PII data
     decryptPII: (encryptedData, authTag) => {
       const decipher = crypto.createDecipher('aes-256-gcm', process.env.ENCRYPTION_KEY);
       decipher.setAuthTag(Buffer.from(authTag, 'hex'));
       let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
       decrypted += decipher.final('utf8');
       return decrypted;
     },
     
     // Hash passwords
     hashPassword: async (password) => {
       const saltRounds = 12;
       return await bcrypt.hash(password, saltRounds);
     }
   };
   ```

2. **Database Encryption Configuration:**
   ```sql
   -- PostgreSQL encryption settings
   ALTER SYSTEM SET ssl = 'on';
   ALTER SYSTEM SET ssl_cert_file = '/path/to/server.crt';
   ALTER SYSTEM SET ssl_key_file = '/path/to/server.key';
   ALTER SYSTEM SET ssl_ca_file = '/path/to/ca.crt';
   
   -- Enable transparent data encryption for sensitive columns
   CREATE EXTENSION IF NOT EXISTS pgcrypto;
   
   -- Encrypt sensitive user data
   ALTER TABLE job_seeker_profiles 
   ADD COLUMN phone_encrypted BYTEA,
   ADD COLUMN ssn_encrypted BYTEA;
   ```

### 5.3 API Security Measures

**Comprehensive API Security Stack:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                          API SECURITY LAYERS                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   EDGE PROTECTION       AUTHENTICATION        INPUT VALIDATION       │
│                                                                     │
│  ┌───────────────┐      ┌───────────────┐      ┌───────────────┐ │
│  │ Cloudflare    │      │ JWT Token     │      │ Schema        │ │
│  │ Protection    │      │ Validation    │      │ Validation    │ │
│  │               │      │               │      │               │ │
│  │• DDoS Shield  │      │• Signature    │      │• JSON Schema  │ │
│  │• Rate Limiting│      │  Verification │      │  Validation   │ │
│  │• WAF Rules    │      │• Expiry Check │      │• Sanitization │ │
│  │• Geo Blocking │      │• Role/Scope   │      │• XSS Protection│ │
│  │• IP Reputation│      │  Validation   │      │• SQL Injection│ │
│  └───────────────┘      └───────────────┘      │  Prevention   │ │
│                                                     └───────────────┘ │
│    AUTHORIZATION         OUTPUT SECURITY         MONITORING & LOGGING   │
│                                                                     │
│  ┌───────────────┐      ┌───────────────┐      ┌───────────────┐ │
│  │ Permission    │      │ Data          │      │ Security      │ │
│  │ Checks        │      │ Sanitization  │      │ Monitoring    │ │
│  │               │      │               │      │               │ │
│  │• RBAC         │      │• PII Masking  │      │• Failed Auth  │ │
│  │  Enforcement  │      │• Data Redaction│      │  Attempts     │ │
│  │• Resource     │      │• CORS Headers │      │• Suspicious   │ │
│  │  Access       │      │• Security     │      │  Activity     │ │
│  │  Control      │      │  Headers      │      │• Audit Trails │ │
│  │• Ownership    │      │• Content Type │      │• Real-time    │ │
│  │  Validation   │      │  Validation   │      │  Alerts       │ │
│  └───────────────┘      └───────────────┘      └───────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

**API Security Implementation:**

1. **Request Validation Middleware:**
   ```javascript
   // Input validation and sanitization
   const securityMiddleware = {
     // Validate request schema
     validateSchema: (schema) => {
       return (req, res, next) => {
         const { error } = schema.validate(req.body);
         if (error) {
           return res.status(400).json({
             error: 'Invalid request data',
             details: error.details.map(d => d.message)
           });
         }
         next();
       };
     },
     
     // Rate limiting per user/IP
     rateLimiter: rateLimit({
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: (req) => {
         if (req.user?.role === 'premium') return 1000;
         if (req.user?.role === 'basic') return 500;
         return 100; // Anonymous users
       },
       message: 'Too many requests, please try again later',
       standardHeaders: true,
       legacyHeaders: false
     }),
     
     // SQL injection prevention
     sanitizeInput: (req, res, next) => {
       const sanitizeObject = (obj) => {
         Object.keys(obj).forEach(key => {
           if (typeof obj[key] === 'string') {
             obj[key] = obj[key].replace(/[<>"'%;()&+]/g, '');
           } else if (typeof obj[key] === 'object') {
             sanitizeObject(obj[key]);
           }
         });
       };
       
       if (req.body) sanitizeObject(req.body);
       if (req.query) sanitizeObject(req.query);
       if (req.params) sanitizeObject(req.params);
       next();
     }
   };
   ```

2. **Security Headers Configuration:**
   ```javascript
   // Security headers middleware
   const securityHeaders = helmet({
     contentSecurityPolicy: {
       directives: {
         defaultSrc: ["'self'"],
         styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
         scriptSrc: ["'self'", "'unsafe-eval'"],
         imgSrc: ["'self'", "data:", "https:"],
         connectSrc: ["'self'", "https://api.jobifies.com"],
         fontSrc: ["'self'", "fonts.gstatic.com"],
         objectSrc: ["'none'"],
         mediaSrc: ["'self'"],
         frameSrc: ["'none'"]
       }
     },
     crossOriginEmbedderPolicy: false,
     hsts: {
       maxAge: 31536000,
       includeSubDomains: true,
       preload: true
     }
   });
   ```

### 5.4 RBAC (Role-Based Access Control) Design

**Hierarchical Permission System:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                        RBAC PERMISSION MATRIX                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│    ROLES                   PERMISSIONS              RESOURCES         │
│                                                                     │
│  ┌───────────────┐       ┌───────────────┐       ┌───────────────┐ │
│  │   Job Seeker   │       │     CRUD        │       │   Own Profile  │ │
│  │               │◄──────►│   Operations    │◄──────►│   Applications  │ │
│  │ • Profile Mgmt │       │               │       │   Job Searches  │ │
│  │ • Apply to Jobs│       │ Create - C    │       └───────────────┘ │
│  │ • View Jobs   │       │ Read - R      │                       │
│  │ • Notifications│       │ Update - U    │       ┌───────────────┐ │
│  └───────────────┘       │ Delete - D    │       │  Company      │ │
│                          └───────────────┘       │  Jobs         │ │
│  ┌───────────────┐                       │  Candidates   │ │
│  │   Recruiter    │       ┌───────────────┐       │  ATS Data     │ │
│  │               │◄──────►│  Scope-Based   │◄──────►└───────────────┘ │
│  │ • Job Posting  │       │   Access      │                       │
│  │ • Candidate    │       │             │                       │
│  │   Search      │       │ Own Company │       ┌───────────────┐ │
│  │ • Application │       │   Jobs Only   │       │   System      │ │
│  │   Management  │       │ Team Jobs   │       │ Settings     │ │
│  └───────────────┘       │   Based on    │       │ User         │ │
│                          │   Role        │       │ Management   │ │
│  ┌───────────────┐       └───────────────┘       │ Content      │ │
│  │Company Admin│                               │ Moderation   │ │
│  │              │       ┌───────────────┐       │ Analytics    │ │
│  │ • Team Mgmt   │◄──────►│  Hierarchical  │◄──────►└───────────────┘ │
│  │ • Company     │       │   Permissions │                       │
│  │   Profile     │       │             │                       │
│  │ • Billing     │       │ Admin >     │                       │
│  │ • Integrations│       │ Recruiter > │                       │
│  └───────────────┘       │ Job Seeker  │                       │
│                          └───────────────┘                       │
│  ┌───────────────┐                                               │
│  │Platform Admin│                                               │
│  │              │                                               │
│  │ • Full System │                                               │
│  │   Access      │                                               │
│  │ • User        │                                               │
│  │   Management  │                                               │
│  │ • Content     │                                               │
│  │   Moderation  │                                               │
│  │ • System      │                                               │
│  │   Config      │                                               │
│  └───────────────┘                                               │
└─────────────────────────────────────────────────────────────────────┘
```

**RBAC Implementation:**

```javascript
// Permission definition system
const permissions = {
  // Resource-based permissions
  profiles: {
    'read:own': 'Read own profile',
    'read:others': 'Read other profiles',
    'write:own': 'Update own profile',
    'write:others': 'Update other profiles',
    'delete:own': 'Delete own profile'
  },
  jobs: {
    'read:all': 'Read all jobs',
    'write:own': 'Create/update own jobs',
    'write:company': 'Create/update company jobs',
    'delete:own': 'Delete own jobs',
    'publish:own': 'Publish own jobs'
  },
  applications: {
    'read:own': 'Read own applications',
    'read:received': 'Read received applications',
    'write:own': 'Submit applications',
    'update:received': 'Update application status'
  },
  admin: {
    'read:users': 'View user management',
    'write:users': 'Modify users',
    'read:system': 'View system settings',
    'write:system': 'Modify system settings'
  }
};

// Role definitions
const roles = {
  job_seeker: {
    permissions: [
      'profiles:read:own',
      'profiles:write:own',
      'profiles:delete:own',
      'jobs:read:all',
      'applications:read:own',
      'applications:write:own'
    ]
  },
  recruiter: {
    permissions: [
      'profiles:read:own',
      'profiles:read:others',
      'profiles:write:own',
      'jobs:read:all',
      'jobs:write:own',
      'jobs:publish:own',
      'applications:read:received'
    ]
  },
  company_admin: {
    inherits: ['recruiter'],
    permissions: [
      'jobs:write:company',
      'jobs:delete:own',
      'profiles:write:others', // Team members
      'admin:read:users' // Company users only
    ]
  },
  platform_admin: {
    permissions: ['*'] // All permissions
  }
};

// Permission checking middleware
const checkPermission = (resource, action, scope = 'own') => {
  return async (req, res, next) => {
    const user = req.user;
    const permission = `${resource}:${action}:${scope}`;
    
    // Check if user has required permission
    const hasPermission = await rbacService.checkPermission(user, permission);
    
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: permission,
        userRole: user.role
      });
    }
    
    next();
  };
};
```

### 5.5 Security Audit Checkpoints

**Security Monitoring & Compliance Framework:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                       SECURITY AUDIT FRAMEWORK                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   AUTOMATED MONITORING         MANUAL AUDITS         COMPLIANCE       │
│                                                                     │
│  ┌─────────────────┐        ┌─────────────────┐       ┌───────────────┐ │
│  │ Real-time       │        │ Quarterly       │       │ GDPR         │ │
│  │ Alerts          │        │ Security        │       │ Compliance   │ │
│  │                 │        │ Reviews         │       │              │ │
│  │• Failed Logins  │        │                 │       │• Data        │ │
│  │  (5+ in 10min)  │        │• Code Reviews   │       │  Processing  │ │
│  │• Unusual API    │        │• Dependency     │       │  Records     │ │
│  │  Traffic        │        │  Audits         │       │• Consent     │ │
│  │• Permission     │        │• Access Log     │       │  Management  │ │
│  │  Escalations    │        │  Analysis       │       │• Data        │ │
│  │• Data Export    │        │• Penetration    │       │  Portability │ │
│  │  Requests       │        │  Testing        │       └───────────────┘ │
│  └─────────────────┘        └─────────────────┘                       │
│                                                    ┌───────────────┐ │
│  ┌─────────────────┐        ┌─────────────────┐       │ SOC 2        │ │
│  │ Vulnerability   │        │ Annual          │       │ Compliance   │ │
│  │ Scanning        │        │ Assessments     │       │              │ │
│  │                 │        │                 │       │• Security    │ │
│  │• Daily OWASP    │        │• External        │       │  Controls    │ │
│  │  Top 10 Scans  │        │  Security Audit │       │• Availability│ │
│  │• Container      │        │• Compliance      │       │  Monitoring  │ │
│  │  Security       │        │  Review         │       │• Processing  │ │
│  │• SSL/TLS        │        │• Business        │       │  Integrity   │ │
│  │  Certificate    │        │  Continuity     │       │• Confidential│ │
│  │  Monitoring     │        │  Testing        │       │  Data        │ │
│  └─────────────────┘        └─────────────────┘       └───────────────┘ │
│                                                                     │
│  ┌─────────────────┐                               ┌───────────────┐ │
│  │ Incident        │                               │ PCI DSS      │ │
│  │ Response        │                               │ Compliance   │ │
│  │                 │                               │              │ │
│  │• Automated       │                               │• Payment     │ │
│  │  Detection       │                               │  Data        │ │
│  │• Response        │                               │  Protection  │ │
│  │  Playbooks       │                               │• Tokenization│ │
│  │• Forensics       │                               │• Encryption  │ │
│  │  Tools           │                               │• Access      │ │
│  │• Recovery        │                               │  Controls    │ │
│  │  Procedures      │                               │• Regular     │ │
│  └─────────────────┘                               │  Testing     │ │
│                                                    └───────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

**Security Audit Implementation:**

```javascript
// Security monitoring service
const securityMonitor = {
  // Real-time threat detection
  detectAnomalies: {
    failedLogins: {
      threshold: 5,
      timeWindow: '10m',
      action: 'block_ip_and_alert'
    },
    suspiciousApiActivity: {
      threshold: 100,
      timeWindow: '1m',
      action: 'rate_limit_and_alert'
    },
    dataExportRequests: {
      threshold: 1,
      timeWindow: '1h',
      action: 'manual_review_and_alert'
    }
  },
  
  // Compliance monitoring
  complianceChecks: {
    gdpr: {
      dataRetention: 'validate_retention_policies',
      consentTracking: 'audit_consent_records',
      dataPortability: 'test_export_functionality'
    },
    soc2: {
      accessControls: 'validate_rbac_implementation',
      dataEncryption: 'verify_encryption_at_rest_and_transit',
      monitoring: 'audit_logging_and_alerting'
    },
    pciDss: {
      paymentDataHandling: 'audit_payment_data_flow',
      encryption: 'validate_payment_encryption',
      accessRestriction: 'verify_cardholder_data_access'
    }
  }
};
```

**Security Audit Implementation:**

```javascript
// Security monitoring service
const securityMonitor = {
  // Real-time threat detection
  detectAnomalies: {
    failedLogins: {
      threshold: 5,
      timeWindow: '10m',
      action: 'block_ip_and_alert'
    },
    suspiciousApiActivity: {
      threshold: 100,
      timeWindow: '1m',
      action: 'rate_limit_and_alert'
    },
    dataExportRequests: {
      threshold: 1,
      timeWindow: '1h',
      action: 'manual_review_and_alert'
    }
  },
  
  // Compliance monitoring
  complianceChecks: {
    gdpr: {
      dataRetention: 'validate_retention_policies',
      consentTracking: 'audit_consent_records',
      dataPortability: 'test_export_functionality'
    },
    soc2: {
      accessControls: 'validate_rbac_implementation',
      dataEncryption: 'verify_encryption_at_rest_and_transit',
      monitoring: 'audit_logging_and_alerting'
    },
    pciDss: {
      paymentDataHandling: 'audit_payment_data_flow',
      encryption: 'validate_payment_encryption',
      accessRestriction: 'verify_cardholder_data_access'
    }
  }
};
```

### 6.1 Payment Gateway Integration Patterns

**Multi-Payment Provider Architecture:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PAYMENT INTEGRATION ARCHITECTURE                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   CLIENT APPLICATION       PAYMENT ORCHESTRATOR      PROVIDERS      │
│                                                                     │
│  ┌─────────────────┐         ┌─────────────────┐    ┌─────────────┐ │
│  │ Payment Form    │         │ Payment Service │    │   Stripe    │ │
│  │                 │         │                 │    │             │ │
│  │ • Card Input    │◄───────►│ • Provider      │◄──►│ • Primary   │ │
│  │ • PayPal Button │         │   Selection     │    │   Provider  │ │
│  │ • Bank Transfer │         │ • Fallback      │    │ • Cards     │ │
│  │ • Razorpay      │         │   Logic         │    │ • Digital   │ │
│  │   (India)       │         │ • Tokenization  │    │   Wallets   │ │
│  └─────────────────┘         │ • PCI Scope     │    └─────────────┘ │
│                               │   Reduction     │                    │
│                               └─────────────────┘    ┌─────────────┐ │
│                                       │              │   PayPal    │ │
│                                       │              │             │ │
│                                       ├─────────────►│ • Secondary │ │
│                                       │              │   Provider  │ │
│                                       │              │ • PayPal    │ │
│                                       │              │   Checkout  │ │
│                                       │              │ • Express   │ │
│                                       │              └─────────────┘ │
│                                       │                              │
│                                       │              ┌─────────────┐ │
│                                       │              │  Razorpay   │ │
│                                       │              │             │ │
│                                       └─────────────►│ • Regional  │ │
│                                                      │   Provider  │ │
│                                                      │ • India     │ │
│                                                      │   Market    │ │
│                                                      │ • UPI       │ │
│                                                      │ • Net       │ │
│                                                      │   Banking   │ │
│                                                      └─────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

This completes the comprehensive technical architecture document for the Jobifies platform. The document covers all requested deliverables including system architecture, database design, security, scalability, integrations, development standards, and deployment strategies, providing the development team with detailed technical guidance for implementation.

---

## 6. INTEGRATION ARCHITECTURE
