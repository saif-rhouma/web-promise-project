import { NextFunction, Request, Response } from 'express';
import Middleware from 'src/types/Middleware';
import UnauthorizedException from '../exceptions/unauthorizedException';
import { MSG_EXCEPTION } from '../constants/messages';
import jwt from 'jsonwebtoken';
import environment from '../../configs/environment';
const authMiddleware: Middleware<void> = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(MSG_EXCEPTION.UNAUTHORIZED_AUTH_HEADER_MISSING_OR_MALFORMED);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(MSG_EXCEPTION.UNAUTHORIZED_TOKEN_NOT_FOUND);
    }
    const decoded = jwt.verify(token, environment.ACCESS_TOKEN_SECRET);
    req['user'] = decoded;
    next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err: unknown) {
    throw new UnauthorizedException(
      `${MSG_EXCEPTION.UNAUTHORIZED_TOKEN} , ${MSG_EXCEPTION.UNAUTHORIZED_TOKEN_EXPIRED}`
    );
  }
};
export default authMiddleware;
