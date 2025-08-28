// Authentication Types for Jobifies Frontend

export enum UserRole {
  JOB_SEEKER = 'job_seeker',
  RECRUITER = 'recruiter',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum ExperienceLevel {
  ENTRY = 'entry',
  JUNIOR = 'junior', 
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  EXECUTIVE = 'executive'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  profilePicture?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

export interface EmailVerificationData {
  token: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Authentication State Types
export interface AuthState {
  // State
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  verifyEmail: (data: EmailVerificationData) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  refreshTokens: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

// Form Validation Types
export interface FormFieldError {
  message: string;
  type?: string;
}

export interface FormErrors {
  [key: string]: FormFieldError | undefined;
}

// Password Strength Types
export enum PasswordStrength {
  WEAK = 'weak',
  FAIR = 'fair',
  GOOD = 'good',
  STRONG = 'strong'
}

export interface PasswordValidation {
  strength: PasswordStrength;
  score: number;
  feedback: string[];
  requirements: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
}

// Social Login Types (for UI only initially)
export enum SocialProvider {
  GOOGLE = 'google',
  LINKEDIN = 'linkedin',
  FACEBOOK = 'facebook'
}

export interface SocialLoginButton {
  provider: SocialProvider;
  label: string;
  icon: string;
  color: string;
  disabled?: boolean;
}

// Route Protection Types
export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  requireVerification?: boolean;
}

// Authentication Context Types
export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  verifyEmail: (data: EmailVerificationData) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  refreshTokens: () => Promise<void>;
  clearError: () => void;
}

// Token Storage Types
export interface TokenStorage {
  getTokens: () => AuthTokens | null;
  setTokens: (tokens: AuthTokens) => void;
  clearTokens: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

// HTTP Client Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface RequestConfig {
  requiresAuth?: boolean;
  retryOnTokenExpiry?: boolean;
}

// Form Component Types
export interface AuthFormProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: FormFieldError;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
  'aria-describedby'?: string;
}

// Navigation Types
export interface AuthRoute {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  protected?: boolean;
  allowedRoles?: UserRole[];
  redirectIfAuthenticated?: boolean;
}

// Session Management Types
export interface SessionInfo {
  user: User;
  expiresAt: Date;
  lastActivity: Date;
  rememberMe: boolean;
}

// Security Types
export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: Date;
  activeSessions: number;
  securityQuestions: boolean;
}

// Validation Schema Types (for Zod)
export interface ValidationSchema {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  acceptTerms?: boolean;
  role?: UserRole;
}

export default {};