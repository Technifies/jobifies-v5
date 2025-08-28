import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { query, transaction, redis } from '../config/database';
import config from '../config';
import logger from '../utils/logger';
import { User, UserRole, AuthTokens, JWTPayload } from '../types';
import { AuthenticationError, ValidationError, NotFoundError } from '../middleware/errorHandler';
import emailService from './emailService';

export class AuthService {
  // Generate JWT tokens
  private generateTokens(userId: string, email: string, role: UserRole): AuthTokens {
    const payload: JWTPayload = {
      userId,
      email,
      role,
      iss: 'jobifies-api',
      aud: 'jobifies-users',
    };

    const accessToken = jwt.sign(payload, config.jwt?.secret || process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: config.jwt?.expiresIn || '24h',
    });

    const refreshToken = jwt.sign(payload, config.jwt?.refreshSecret || process.env.JWT_SECRET || 'fallback-refresh-secret', {
      expiresIn: config.jwt?.refreshExpiresIn || '7d',
    });

    return { accessToken, refreshToken };
  }

  // Hash password
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.security.bcryptRounds);
  }

  // Generate verification token
  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Register new user
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phoneNumber?: string;
  }): Promise<{ user: Omit<User, 'password_hash'>; tokens: AuthTokens; verificationToken: string }> {
    const { email, password, firstName, lastName, role, phoneNumber } = userData;

    try {
      // Check if user already exists
      const existingUser = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
      
      if (existingUser.rows.length > 0) {
        throw new ValidationError('User with this email already exists');
      }

      // Hash password
      const passwordHash = await this.hashPassword(password);
      
      // Generate verification token
      const verificationToken = this.generateVerificationToken();
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create user in transaction
      const result = await transaction(async (client) => {
        // Insert user
        const userResult = await client.query(
          `INSERT INTO users (
            email, password_hash, first_name, last_name, role, phone_number,
            email_verification_token, email_verification_expires
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id, email, first_name, last_name, role, is_verified, is_active, created_at`,
          [
            email.toLowerCase(),
            passwordHash,
            firstName,
            lastName,
            role,
            phoneNumber,
            verificationToken,
            verificationExpires,
          ]
        );

        const user = userResult.rows[0];

        // Create user profile for job seekers
        if (role === UserRole.JOB_SEEKER) {
          await client.query(
            'INSERT INTO user_profiles (user_id) VALUES ($1)',
            [user.id]
          );
        }

        return user;
      });

      // Generate tokens
      const tokens = this.generateTokens(result.id, result.email, result.role);

      // Store refresh token in Redis
      await redis.setEx(`refresh_token:${result.id}`, 7 * 24 * 60 * 60, tokens.refreshToken);

      // Send verification email (async)
      emailService.sendVerificationEmail(result.email, result.first_name, verificationToken)
        .catch(error => logger.error('Failed to send verification email:', error));

      logger.info('User registered successfully', {
        userId: result.id,
        email: result.email,
        role: result.role,
      });

      const { password_hash, ...userWithoutPassword } = result as any;

      return {
        user: userWithoutPassword,
        tokens,
        verificationToken,
      };
    } catch (error) {
      logger.error('User registration failed:', error);
      throw error;
    }
  }

  // Login user
  async login(email: string, password: string): Promise<{ user: Omit<User, 'password_hash'>; tokens: AuthTokens }> {
    try {
      // Find user by email
      const result = await query(
        `SELECT id, email, password_hash, first_name, last_name, role, 
         is_verified, is_active, last_login 
         FROM users 
         WHERE email = $1`,
        [email.toLowerCase()]
      );

      if (result.rows.length === 0) {
        throw new AuthenticationError('Invalid email or password');
      }

      const user = result.rows[0];

      // Check if user is active
      if (!user.is_active) {
        throw new AuthenticationError('Account has been deactivated');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Generate tokens
      const tokens = this.generateTokens(user.id, user.email, user.role);

      // Store refresh token in Redis
      await redis.setEx(`refresh_token:${user.id}`, 7 * 24 * 60 * 60, tokens.refreshToken);

      // Update last login
      await query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      logger.info('User logged in successfully', {
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const { password_hash, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        tokens,
      };
    } catch (error) {
      logger.error('User login failed:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as JWTPayload;

      // Check if refresh token exists in Redis
      const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw new AuthenticationError('Invalid refresh token');
      }

      // Get user details
      const result = await query(
        'SELECT id, email, role, is_active FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (result.rows.length === 0 || !result.rows[0].is_active) {
        throw new AuthenticationError('User not found or inactive');
      }

      const user = result.rows[0];

      // Generate new tokens
      const tokens = this.generateTokens(user.id, user.email, user.role);

      // Update refresh token in Redis
      await redis.setEx(`refresh_token:${user.id}`, 7 * 24 * 60 * 60, tokens.refreshToken);

      logger.info('Tokens refreshed successfully', {
        userId: user.id,
        email: user.email,
      });

      return tokens;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthenticationError('Invalid refresh token');
      }
      logger.error('Token refresh failed:', error);
      throw error;
    }
  }

  // Logout user
  async logout(userId: string): Promise<void> {
    try {
      // Remove refresh token from Redis
      await redis.del(`refresh_token:${userId}`);

      logger.info('User logged out successfully', { userId });
    } catch (error) {
      logger.error('Logout failed:', error);
      throw error;
    }
  }

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    try {
      const result = await query(
        `UPDATE users 
         SET is_verified = true, 
             email_verification_token = NULL, 
             email_verification_expires = NULL 
         WHERE email_verification_token = $1 
           AND email_verification_expires > NOW()
         RETURNING id, email, first_name`,
        [token]
      );

      if (result.rows.length === 0) {
        throw new ValidationError('Invalid or expired verification token');
      }

      const user = result.rows[0];

      logger.info('Email verified successfully', {
        userId: user.id,
        email: user.email,
      });

      // Send welcome email (async)
      emailService.sendWelcomeEmail(user.email, user.first_name)
        .catch(error => logger.error('Failed to send welcome email:', error));
    } catch (error) {
      logger.error('Email verification failed:', error);
      throw error;
    }
  }

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<void> {
    try {
      const result = await query(
        'SELECT id, first_name, is_verified FROM users WHERE email = $1 AND is_active = true',
        [email.toLowerCase()]
      );

      if (result.rows.length === 0) {
        throw new NotFoundError('User not found');
      }

      const user = result.rows[0];

      if (user.is_verified) {
        throw new ValidationError('Email is already verified');
      }

      // Generate new verification token
      const verificationToken = this.generateVerificationToken();
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await query(
        `UPDATE users 
         SET email_verification_token = $1, email_verification_expires = $2 
         WHERE id = $3`,
        [verificationToken, verificationExpires, user.id]
      );

      // Send verification email
      await emailService.sendVerificationEmail(email, user.first_name, verificationToken);

      logger.info('Verification email resent', {
        userId: user.id,
        email,
      });
    } catch (error) {
      logger.error('Failed to resend verification email:', error);
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    try {
      const result = await query(
        'SELECT id, first_name FROM users WHERE email = $1 AND is_active = true',
        [email.toLowerCase()]
      );

      if (result.rows.length === 0) {
        // Don't reveal if email exists
        logger.warn('Password reset requested for non-existent email', { email });
        return;
      }

      const user = result.rows[0];

      // Generate reset token
      const resetToken = this.generateVerificationToken();
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await query(
        `UPDATE users 
         SET password_reset_token = $1, password_reset_expires = $2 
         WHERE id = $3`,
        [resetToken, resetExpires, user.id]
      );

      // Send reset email
      await emailService.sendPasswordResetEmail(email, user.first_name, resetToken);

      logger.info('Password reset email sent', {
        userId: user.id,
        email,
      });
    } catch (error) {
      logger.error('Password reset request failed:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // Hash new password
      const passwordHash = await this.hashPassword(newPassword);

      const result = await query(
        `UPDATE users 
         SET password_hash = $1,
             password_reset_token = NULL,
             password_reset_expires = NULL
         WHERE password_reset_token = $2 
           AND password_reset_expires > NOW()
         RETURNING id, email`,
        [passwordHash, token]
      );

      if (result.rows.length === 0) {
        throw new ValidationError('Invalid or expired reset token');
      }

      const user = result.rows[0];

      // Revoke all existing refresh tokens
      await redis.del(`refresh_token:${user.id}`);

      logger.info('Password reset successfully', {
        userId: user.id,
        email: user.email,
      });
    } catch (error) {
      logger.error('Password reset failed:', error);
      throw error;
    }
  }

  // Change password (authenticated user)
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Get current password hash
      const result = await query(
        'SELECT password_hash FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        throw new NotFoundError('User not found');
      }

      const user = result.rows[0];

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValidPassword) {
        throw new AuthenticationError('Current password is incorrect');
      }

      // Hash new password
      const newPasswordHash = await this.hashPassword(newPassword);

      // Update password
      await query(
        'UPDATE users SET password_hash = $1 WHERE id = $2',
        [newPasswordHash, userId]
      );

      // Revoke all existing refresh tokens except current session
      await redis.del(`refresh_token:${userId}`);

      logger.info('Password changed successfully', { userId });
    } catch (error) {
      logger.error('Password change failed:', error);
      throw error;
    }
  }

  // Validate JWT token
  async validateToken(token: string): Promise<JWTPayload> {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
      
      // Additional validation can be added here
      const result = await query(
        'SELECT id FROM users WHERE id = $1 AND is_active = true',
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        throw new AuthenticationError('User not found or inactive');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthenticationError('Invalid token');
      }
      throw error;
    }
  }
}

export default new AuthService();