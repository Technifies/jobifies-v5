import { User } from './index';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: string;
      is_verified: boolean;
      is_active: boolean;
    }
    
    interface Request {
      user?: User;
    }
  }
}

export {};