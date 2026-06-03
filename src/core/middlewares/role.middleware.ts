// middlewares/role.middleware.ts

import { Response, NextFunction } from 'express';
import { UserRole } from '../models/user.model';
import { AuthRequest } from '../../types/AuthRequest';

export const authorize =
  (...roles: UserRole[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
