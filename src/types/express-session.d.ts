import { UserRole } from '../core/models/user.model';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      email: string;
      role: UserRole;
    };
    accessToken?: string;
    refreshToken?: string;
  }
}
