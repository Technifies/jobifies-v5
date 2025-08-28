import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from './errorHandler';

// Helper function to handle validation results
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : error.type,
      message: error.msg,
      value: error.type === 'field' ? (error as any).value : undefined,
    }));

    const errorMessage = formattedErrors
      .map(err => `${err.field}: ${err.message}`)
      .join(', ');

    return next(new ValidationError(errorMessage));
  }
  
  next();
};

// Common validation rules
export const emailValidation = () => 
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address');

export const passwordValidation = () =>
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');

export const uuidValidation = (field: string) =>
  param(field)
    .isUUID()
    .withMessage(`${field} must be a valid UUID`);

export const paginationValidation = () => [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Sort field is invalid'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be either asc or desc'),
];

// Authentication validation
export const registerValidation = () => [
  body('first_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('last_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),
  
  emailValidation(),
  passwordValidation(),
  
  body('role')
    .isIn(['job_seeker', 'recruiter'])
    .withMessage('Role must be either job_seeker or recruiter'),
  
  body('phone_number')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
];

export const loginValidation = () => [
  emailValidation(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const forgotPasswordValidation = () => [
  emailValidation(),
];

export const resetPasswordValidation = () => [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  passwordValidation(),
];

export const changePasswordValidation = () => [
  body('current_password')
    .notEmpty()
    .withMessage('Current password is required'),
  passwordValidation(),
];

// User validation
export const updateProfileValidation = () => [
  body('first_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('last_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('phone_number')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  
  body('date_of_birth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must not exceed 100 characters'),
];

// Job validation
export const createJobValidation = () => [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Job title must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage('Job description must be between 50 and 5000 characters'),
  
  body('job_type')
    .isIn(['full_time', 'part_time', 'contract', 'internship', 'freelance'])
    .withMessage('Invalid job type'),
  
  body('employment_type')
    .isIn(['permanent', 'temporary', 'contract', 'internship'])
    .withMessage('Invalid employment type'),
  
  body('experience_level')
    .isIn(['entry', 'junior', 'mid', 'senior', 'lead', 'executive'])
    .withMessage('Invalid experience level'),
  
  body('location')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  
  body('remote_type')
    .isIn(['remote', 'hybrid', 'on_site', 'flexible'])
    .withMessage('Invalid remote type'),
  
  body('salary_range.min')
    .isInt({ min: 0 })
    .withMessage('Minimum salary must be a non-negative number'),
  
  body('salary_range.max')
    .isInt({ min: 0 })
    .withMessage('Maximum salary must be a non-negative number')
    .custom((value, { req }) => {
      if (value < req.body.salary_range?.min) {
        throw new Error('Maximum salary must be greater than minimum salary');
      }
      return true;
    }),
  
  body('salary_range.currency')
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency code must be 3 characters (e.g., USD, EUR)'),
  
  body('requirements')
    .isArray({ min: 1 })
    .withMessage('At least one requirement is needed'),
  
  body('requirements.*')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Each requirement must be between 5 and 500 characters'),
  
  body('responsibilities')
    .isArray({ min: 1 })
    .withMessage('At least one responsibility is needed'),
  
  body('responsibilities.*')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Each responsibility must be between 5 and 500 characters'),
  
  body('skills_required')
    .isArray()
    .withMessage('Skills required must be an array'),
  
  body('skills_required.*')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each skill must be between 1 and 50 characters'),
  
  body('company_id')
    .isUUID()
    .withMessage('Company ID must be a valid UUID'),
  
  body('application_deadline')
    .optional()
    .isISO8601()
    .withMessage('Application deadline must be a valid date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Application deadline must be in the future');
      }
      return true;
    }),
];

export const updateJobValidation = () => [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Job title must be between 5 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage('Job description must be between 50 and 5000 characters'),
  
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean'),
];

// Company validation
export const createCompanyValidation = () => [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Company name must be between 2 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Company description must be between 50 and 2000 characters'),
  
  body('industry')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Industry must be between 2 and 100 characters'),
  
  body('company_size')
    .isIn(['startup', 'small', 'medium', 'large', 'enterprise'])
    .withMessage('Invalid company size'),
  
  body('headquarters')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Headquarters must be between 2 and 200 characters'),
  
  body('website')
    .optional()
    .isURL()
    .withMessage('Website must be a valid URL'),
  
  body('founded_year')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage('Founded year must be a valid year'),
];

// Application validation
export const createApplicationValidation = () => [
  body('job_id')
    .isUUID()
    .withMessage('Job ID must be a valid UUID'),
  
  body('cover_letter')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Cover letter must not exceed 2000 characters'),
  
  body('salary_expectation')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Salary expectation must be a non-negative number'),
  
  body('availability_date')
    .optional()
    .isISO8601()
    .withMessage('Availability date must be a valid date'),
];

export const updateApplicationStatusValidation = () => [
  body('status')
    .isIn([
      'submitted', 'under_review', 'shortlisted', 'interview_scheduled',
      'interviewed', 'offer_extended', 'hired', 'rejected', 'withdrawn'
    ])
    .withMessage('Invalid application status'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters'),
  
  body('feedback')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Feedback must not exceed 1000 characters'),
  
  body('interview_scheduled_at')
    .optional()
    .isISO8601()
    .withMessage('Interview date must be a valid date'),
];

// Search validation
export const jobSearchValidation = () => [
  ...paginationValidation(),
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Search query must be between 1 and 200 characters'),
  
  query('location')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Location must be between 1 and 100 characters'),
  
  query('job_type')
    .optional()
    .isIn(['full_time', 'part_time', 'contract', 'internship', 'freelance'])
    .withMessage('Invalid job type'),
  
  query('experience_level')
    .optional()
    .isIn(['entry', 'junior', 'mid', 'senior', 'lead', 'executive'])
    .withMessage('Invalid experience level'),
  
  query('salary_min')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum salary must be a non-negative number'),
  
  query('salary_max')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Maximum salary must be a non-negative number'),
  
  query('posted_within')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Posted within must be between 1 and 365 days'),
];

// File upload validation
export const fileUploadValidation = () => [
  body('file_type')
    .isIn(['resume', 'profile_picture', 'company_logo'])
    .withMessage('Invalid file type'),
];

// Combine validation with error handling
export const validate = (validations: ValidationChain[]) => {
  return [...validations, handleValidationErrors];
};