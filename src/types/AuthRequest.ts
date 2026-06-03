import { Request } from 'express';
import type { User } from '../core/models/user.model';

export interface AuthRequest extends Request {
  user?: User;
}
