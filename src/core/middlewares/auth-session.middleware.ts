import { NextFunction, Request, Response } from 'express';
import Middleware from 'src/types/Middleware';
import UnauthorizedException from '../exceptions/unauthorizedException';
import { MSG_EXCEPTION } from '../constants/messages';

const authSessionMiddleware: Middleware<void> = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.session || !req.session['user']) {
    return next(
      new UnauthorizedException(`${MSG_EXCEPTION.UNAUTHORIZED_TOKEN}, ${MSG_EXCEPTION.UNAUTHORIZED_TOKEN_EXPIRED}`)
    );
  }

  next();
};
export default authSessionMiddleware;
