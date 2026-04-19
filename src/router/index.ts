import express, { Express, Router as IRouter } from 'express';

import { AuthRoutes } from './apis/auth.routes';
import { ExampleRoutes } from './apis/example.routes';

import HTTP_CODE from '../core/constants/httpCode';
import IRouteGroup from '../types/IRouteGroup';
import runAsyncWrapper from '../utils/runAsyncWrapper';
import PublicRoutes from './web/public.routes';
import AuthWebRoutes from './web/auth-web.routes';
import StartupRoutes from './web/startup.routes';

class Router {
  router: IRouter;
  authRoutes: IRouteGroup;
  publicRoutes: IRouteGroup;
  authWebRoutes: IRouteGroup;
  startupRoutes: IRouteGroup;
  exampleRoutes: IRouteGroup;

  constructor() {
    this.router = express.Router();
    this.authRoutes = AuthRoutes;
    this.publicRoutes = PublicRoutes;
    this.authWebRoutes = AuthWebRoutes;
    this.startupRoutes = StartupRoutes;
    this.exampleRoutes = ExampleRoutes;
  }

  public create(app: Express) {
    this._handleWebAPI();
    // TODO : attach middleware
    this._handleExampleAPI();
    this._handleAuthAPI();
    this._handlePageNotFound();
    this._handleExceptions();
    app.use(this.router);
  }

  private _handlePageNotFound() {
    this.router.all('*', async (_req, res) => {
      // res.status(HTTP_CODE.NotFound).send('Page Not Found');
      res.status(HTTP_CODE.NotFound).render('error-404');
    });
  }

  private _handleExceptions() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.router.use((err, _req, res, _next) => {
      err.statusCode = err.status || err.statusCode || HTTP_CODE.InternalServerError;
      return res.status(err.statusCode).json({
        errorCode: err.message,
        statusCode: err.status,
        details: err.details,
      });
    });
  }

  //! Apis Routes

  private _handleAuthAPI() {
    this._attachRoutes(this.authRoutes, '/api');
  }

  private _handleWebAPI() {
    this._attachRoutes(this.publicRoutes, '');
    this._attachRoutes(this.startupRoutes, '');
    this._attachRoutes(this.authWebRoutes, '');
  }

  private _handleExampleAPI() {
    this._attachRoutes(this.exampleRoutes, '/api/test');
  }

  private _attachRoutes(routeGroup: IRouteGroup, prefix: string = '') {
    [routeGroup].forEach(({ group, routes }) => {
      routes.forEach(({ method, path, middleware = [], validator = [], handler }) => {
        this.router[method](
          prefix + group.prefix + path,
          [...(group.middleware || []), ...middleware],
          [...validator],
          runAsyncWrapper(handler)
        );
      });
    });
  }
}

export default new Router();
