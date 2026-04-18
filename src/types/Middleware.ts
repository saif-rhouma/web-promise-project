import { type Request, type Response, type NextFunction } from 'express';

type Middleware<T> = (
  req: Request,
  res: Response<T>,
  next: NextFunction,

  ...args: any[]
) => void;

export default Middleware;
