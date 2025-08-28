-- Migration: Initial Database Schema
-- Created: 2025-01-15

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Custom ENUM types
CREATE TYPE user_role AS ENUM ('job_seeker', 'recruiter', 'admin', 'super_admin');
CREATE TYPE experience_level AS ENUM ('entry', 'junior', 'mid', 'senior', 'lead', 'executive');
CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'contract', 'internship', 'freelance');
CREATE TYPE employment_type AS ENUM ('permanent', 'temporary', 'contract', 'internship');
CREATE TYPE remote_preference AS ENUM ('remote', 'hybrid', 'on_site', 'flexible');
CREATE TYPE company_size AS ENUM ('startup', 'small', 'medium', 'large', 'enterprise');
CREATE TYPE language_proficiency AS ENUM ('beginner', 'intermediate', 'advanced', 'native');
CREATE TYPE application_status AS ENUM (
  'submitted', 'under_review', 'shortlisted', 'interview_scheduled',
  'interviewed', 'offer_extended', 'hired', 'rejected', 'withdrawn'
);
CREATE TYPE subscription_plan AS ENUM ('free', 'basic', 'premium', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'cancelled', 'expired', 'pending');
CREATE TYPE payment_method AS ENUM ('stripe', 'razorpay', 'paypal');
CREATE TYPE notification_type AS ENUM ('job_application', 'application_status', 'job_match', 'message', 'subscription', 'system');

-- Users table (main user accounts)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role user_role NOT NULL DEFAULT 'job_seeker',
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  profile_picture VARCHAR(500),
  phone_number VARCHAR(20),
  date_of_birth DATE,
  location VARCHAR(200),
  email_verification_token VARCHAR(255),
  email_verification_expires TIMESTAMP,
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User profiles (extended information for job seekers)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  experience_level experience_level DEFAULT 'entry',
  current_position VARCHAR(200),
  current_company VARCHAR(200),
  skills TEXT[], -- Array of skills
  portfolio_links TEXT[], -- Array of portfolio URLs
  resume_url VARCHAR(500),
  salary_expectation INTEGER,
  preferred_locations TEXT[], -- Array of preferred locations
  job_types job_type[], -- Array of preferred job types
  employment_types employment_type[], -- Array of preferred employment types
  remote_preference remote_preference DEFAULT 'flexible',
  industry_preferences TEXT[], -- Array of industry preferences
  company_size_preferences company_size[], -- Array of preferred company sizes
  availability_date DATE,
  willing_to_relocate BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Companies
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(300) NOT NULL,
  description TEXT,
  industry VARCHAR(200),
  company_size company_size,
  founded_year INTEGER,
  headquarters VARCHAR(300),
  website VARCHAR(500),
  logo_url VARCHAR(500),
  cover_image_url VARCHAR(500),
  verified BOOLEAN DEFAULT FALSE,
  social_links JSONB, -- Store social media links as JSON
  benefits TEXT[], -- Array of company benefits
  culture_values TEXT[], -- Array of culture and values
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL, -- Array of job requirements
  responsibilities TEXT[] NOT NULL, -- Array of job responsibilities
  job_type job_type NOT NULL,
  employment_type employment_type NOT NULL,
  experience_level experience_level NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency VARCHAR(3) DEFAULT 'USD',
  location VARCHAR(300) NOT NULL,
  remote_type remote_preference DEFAULT 'on_site',
  skills_required TEXT[] NOT NULL, -- Array of required skills
  skills_preferred TEXT[], -- Array of preferred skills
  benefits TEXT[], -- Array of job benefits
  application_deadline TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  company_id UUID NOT NULL REFERENCES companies(id),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create basic indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_is_active ON jobs(is_active);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);

-- Triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();