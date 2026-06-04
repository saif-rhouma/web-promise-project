import { NextFunction, Request, Response } from 'express';
import Middleware from 'src/types/Middleware';
import siteConfigRepository from '../repositories/site-config.repository';
import UnauthorizedException from '../exceptions/unauthorizedException';
import { MSG_EXCEPTION } from '../constants/messages';

const registrationMiddleware: Middleware<void> = async (req: Request, _res: Response, next: NextFunction) => {
  let config = req['config'];
  if (config) {
    config = await siteConfigRepository.getConfig();
    req['config'] = config;
  }

  if (!config.registration.enabled) {
    return next(
      new UnauthorizedException(`${MSG_EXCEPTION.UNAUTHORIZED_TOKEN}, ${MSG_EXCEPTION.UNAUTHORIZED_TOKEN_EXPIRED}`)
    );
  }

  next();
};
export default registrationMiddleware;
