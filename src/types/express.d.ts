import type { User } from '../core/models/user.model';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

export {};
