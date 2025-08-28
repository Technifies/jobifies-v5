import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import { query } from './database';
import config from './index';
import logger from '../utils/logger';
import { User, UserRole, JWTPayload } from '../types';

// Local Strategy for email/password authentication
passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email: string, password: string, done) => {
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
          return done(null, false, { message: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // Check if user is active
        if (!user.is_active) {
          return done(null, false, { message: 'Account has been deactivated' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Update last login
        await query(
          'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
          [user.id]
        );

        // Remove password hash before returning
        const { password_hash, ...userWithoutPassword } = user;

        logger.info('User authenticated via local strategy', {
          userId: user.id,
          email: user.email,
          role: user.role,
        });

        return done(null, userWithoutPassword);
      } catch (error) {
        logger.error('Local strategy authentication error:', error);
        return done(error);
      }
    }
  )
);

// JWT Strategy for token-based authentication
passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.secret,
      issuer: 'jobifies-api',
      audience: 'jobifies-users',
    },
    async (jwtPayload: JWTPayload, done) => {
      try {
        // Find user by ID from JWT payload
        const result = await query(
          `SELECT id, email, first_name, last_name, role, 
           is_verified, is_active, last_login 
           FROM users 
           WHERE id = $1`,
          [jwtPayload.userId]
        );

        if (result.rows.length === 0) {
          return done(null, false, { message: 'User not found' });
        }

        const user = result.rows[0];

        // Check if user is active
        if (!user.is_active) {
          return done(null, false, { message: 'Account has been deactivated' });
        }

        // Check token expiration (additional check)
        const currentTime = Math.floor(Date.now() / 1000);
        if (jwtPayload.exp && jwtPayload.exp < currentTime) {
          return done(null, false, { message: 'Token has expired' });
        }

        logger.debug('User authenticated via JWT strategy', {
          userId: user.id,
          email: user.email,
          role: user.role,
        });

        return done(null, user);
      } catch (error) {
        logger.error('JWT strategy authentication error:', error);
        return done(error);
      }
    }
  )
);

// Admin JWT Strategy (for admin-specific routes)
passport.use(
  'jwt-admin',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.secret,
      issuer: 'jobifies-api',
      audience: 'jobifies-users',
    },
    async (jwtPayload: JWTPayload, done) => {
      try {
        const result = await query(
          `SELECT id, email, first_name, last_name, role, 
           is_verified, is_active 
           FROM users 
           WHERE id = $1`,
          [jwtPayload.userId]
        );

        if (result.rows.length === 0) {
          return done(null, false, { message: 'User not found' });
        }

        const user = result.rows[0];

        // Check if user is active
        if (!user.is_active) {
          return done(null, false, { message: 'Account has been deactivated' });
        }

        // Check if user has admin privileges
        if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)) {
          return done(null, false, { message: 'Admin privileges required' });
        }

        return done(null, user);
      } catch (error) {
        logger.error('JWT admin strategy authentication error:', error);
        return done(error);
      }
    }
  )
);

// Serialize user for session storage (if using sessions)
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session storage
passport.deserializeUser(async (id: string, done) => {
  try {
    const result = await query(
      `SELECT id, email, first_name, last_name, role, 
       is_verified, is_active, profile_picture 
       FROM users 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return done(null, false);
    }

    const user = result.rows[0];
    done(null, user);
  } catch (error) {
    logger.error('User deserialization error:', error);
    done(error);
  }
});

// Helper function to authenticate with different strategies
export const authenticateJWT = passport.authenticate('jwt', { session: false });
export const authenticateLocal = passport.authenticate('local', { session: false });
export const authenticateAdmin = passport.authenticate('jwt-admin', { session: false });

// Middleware to check if user is verified
export const requireVerification = (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      error: 'UNAUTHORIZED',
    });
  }

  if (!req.user.is_verified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required',
      error: 'EMAIL_NOT_VERIFIED',
    });
  }

  next();
};

// Middleware to check user roles
export const requireRole = (...roles: UserRole[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'UNAUTHORIZED',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        error: 'FORBIDDEN',
      });
    }

    next();
  };
};

// Optional authentication middleware
export const optionalAuth = (req: any, res: any, next: any) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (err) {
      return next();
    }
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};

export default passport;