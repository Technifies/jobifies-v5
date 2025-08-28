import { User } from './index';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      password_hash: string;
      first_name: string;
      last_name: string;
      role: string;
      is_verified: boolean;
      is_active: boolean;
      profile_picture?: string;
      phone_number?: string;
      date_of_birth?: Date;
      location?: string;
      created_at: Date;
      updated_at: Date;
      last_login?: Date;
    }
    
    interface Request {
      user?: User;
    }
  }
}

export {};