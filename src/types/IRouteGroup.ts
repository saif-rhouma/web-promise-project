import { RequestHandler } from 'express';
import { IRoute } from './IRoute';

export default interface IRouteGroup {
  group: {
    prefix: string;
    middleware?: RequestHandler[];
  };
  routes: IRoute[];
}
