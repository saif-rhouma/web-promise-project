import { type Request, type Response, type NextFunction } from 'express';

type AsyncRouteHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export default AsyncRouteHandler;
