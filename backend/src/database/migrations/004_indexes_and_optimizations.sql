-- Migration: Additional Indexes and Optimizations
-- Created: 2025-01-15

-- Additional indexes for better performance
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_jobs_job_type ON jobs(job_type);
CREATE INDEX idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_application_deadline ON jobs(application_deadline);
CREATE INDEX idx_jobs_created_by ON jobs(created_by);

-- GIN indexes for array fields and text search
CREATE INDEX idx_jobs_skills_required ON jobs USING GIN(skills_required);
CREATE INDEX idx_jobs_title_description ON jobs USING GIN(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_user_profiles_skills ON user_profiles USING GIN(skills);

-- Composite indexes for common queries
CREATE INDEX idx_jobs_active_created ON jobs(is_active, created_at DESC);
CREATE INDEX idx_jobs_company_active ON jobs(company_id, is_active);
CREATE INDEX idx_applications_user_status ON applications(applicant_id, status);

-- Partial indexes for better performance
CREATE INDEX idx_active_users ON users(id) WHERE is_active = true;
CREATE INDEX idx_active_jobs ON jobs(id) WHERE is_active = true;
CREATE INDEX idx_unread_notifications ON notifications(user_id, created_at) WHERE read = false;

-- Add constraints for data integrity
ALTER TABLE jobs ADD CONSTRAINT check_salary_range CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max);
ALTER TABLE subscriptions ADD CONSTRAINT check_subscription_dates CHECK (start_date <= end_date);
ALTER TABLE education ADD CONSTRAINT check_education_dates CHECK (start_date <= COALESCE(end_date, start_date));
ALTER TABLE work_experience ADD CONSTRAINT check_work_dates CHECK (start_date <= COALESCE(end_date, start_date));

-- Add check constraints for enum-like values
ALTER TABLE jobs ADD CONSTRAINT check_salary_currency_format CHECK (salary_currency ~ '^[A-Z]{3}$');
ALTER TABLE payment_transactions ADD CONSTRAINT check_currency_format CHECK (currency ~ '^[A-Z]{3}$');
ALTER TABLE subscriptions ADD CONSTRAINT check_currency_format CHECK (currency ~ '^[A-Z]{3}$');

-- Function to update job view count
CREATE OR REPLACE FUNCTION increment_job_views(job_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE jobs 
  SET views_count = views_count + 1 
  WHERE id = job_id AND is_active = true;
  
  -- Update daily analytics
  INSERT INTO job_analytics (job_id, views, date)
  VALUES (job_id, 1, CURRENT_DATE)
  ON CONFLICT (job_id, date)
  DO UPDATE SET views = job_analytics.views + 1;
END;
$$ LANGUAGE plpgsql;

-- Function to search jobs with full-text search
CREATE OR REPLACE FUNCTION search_jobs(
  search_query TEXT DEFAULT NULL,
  location_filter TEXT DEFAULT NULL,
  job_type_filter job_type DEFAULT NULL,
  experience_filter experience_level DEFAULT NULL,
  salary_min_filter INTEGER DEFAULT NULL,
  salary_max_filter INTEGER DEFAULT NULL,
  company_id_filter UUID DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
  job_id UUID,
  title VARCHAR(300),
  company_name VARCHAR(300),
  location VARCHAR(300),
  job_type job_type,
  experience_level experience_level,
  salary_min INTEGER,
  salary_max INTEGER,
  created_at TIMESTAMP,
  relevance_score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    j.id,
    j.title,
    c.name,
    j.location,
    j.job_type,
    j.experience_level,
    j.salary_min,
    j.salary_max,
    j.created_at,
    CASE 
      WHEN search_query IS NOT NULL THEN 
        ts_rank(to_tsvector('english', j.title || ' ' || j.description), plainto_tsquery('english', search_query))
      ELSE 0.0
    END::REAL
  FROM jobs j
  INNER JOIN companies c ON j.company_id = c.id
  WHERE j.is_active = true
    AND (search_query IS NULL OR to_tsvector('english', j.title || ' ' || j.description) @@ plainto_tsquery('english', search_query))
    AND (location_filter IS NULL OR j.location ILIKE '%' || location_filter || '%')
    AND (job_type_filter IS NULL OR j.job_type = job_type_filter)
    AND (experience_filter IS NULL OR j.experience_level = experience_filter)
    AND (salary_min_filter IS NULL OR j.salary_max IS NULL OR j.salary_max >= salary_min_filter)
    AND (salary_max_filter IS NULL OR j.salary_min IS NULL OR j.salary_min <= salary_max_filter)
    AND (company_id_filter IS NULL OR j.company_id = company_id_filter)
    AND (j.application_deadline IS NULL OR j.application_deadline > NOW())
  ORDER BY
    CASE WHEN search_query IS NOT NULL THEN
      ts_rank(to_tsvector('english', j.title || ' ' || j.description), plainto_tsquery('english', search_query))
    ELSE 0.0 END DESC,
    j.is_featured DESC,
    j.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get job recommendations for a user
CREATE OR REPLACE FUNCTION get_job_recommendations(
  user_id_param UUID,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE(
  job_id UUID,
  title VARCHAR(300),
  company_name VARCHAR(300),
  match_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH user_skills AS (
    SELECT unnest(skills) as skill
    FROM user_profiles 
    WHERE user_id = user_id_param
  ),
  user_preferences AS (
    SELECT 
      preferred_locations,
      job_types,
      employment_types,
      remote_preference,
      experience_level
    FROM user_profiles 
    WHERE user_id = user_id_param
  )
  SELECT 
    j.id,
    j.title,
    c.name,
    (
      -- Skill matching (40% weight)
      COALESCE(
        (SELECT COUNT(*) FROM user_skills us WHERE us.skill = ANY(j.skills_required)) * 40 / 
        GREATEST(array_length(j.skills_required, 1), 1), 0
      ) +
      -- Location matching (20% weight)
      CASE 
        WHEN up.preferred_locations IS NULL THEN 10
        WHEN j.location = ANY(up.preferred_locations) THEN 20
        ELSE 0 
      END +
      -- Job type matching (20% weight)
      CASE 
        WHEN up.job_types IS NULL THEN 10
        WHEN j.job_type = ANY(up.job_types) THEN 20
        ELSE 0 
      END +
      -- Experience level matching (20% weight)
      CASE 
        WHEN j.experience_level = up.experience_level THEN 20
        ELSE 0 
      END
    )::INTEGER as match_score
  FROM jobs j
  INNER JOIN companies c ON j.company_id = c.id
  CROSS JOIN user_preferences up
  WHERE j.is_active = true
    AND j.created_by != user_id_param  -- Don't recommend user's own jobs
    AND NOT EXISTS (
      SELECT 1 FROM applications a 
      WHERE a.job_id = j.id AND a.applicant_id = user_id_param
    )  -- Don't recommend jobs user has already applied to
    AND (j.application_deadline IS NULL OR j.application_deadline > NOW())
  ORDER BY match_score DESC, j.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;