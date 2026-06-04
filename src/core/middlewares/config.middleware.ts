import { NextFunction, Request, Response } from 'express';
import Middleware from 'src/types/Middleware';
import siteConfigRepository from '../repositories/site-config.repository';

const configMiddleware: Middleware<void> = async (req: Request, _res: Response, next: NextFunction) => {
  const config = await siteConfigRepository.getConfig();
  req['config'] = config;

  next();
};
export default configMiddleware;
