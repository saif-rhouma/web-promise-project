import IRouteGroup from 'src/types/IRouteGroup';
import authWebController from '../../core/controllers/auth-web.controller';
import csrfProtection from '../../core/middlewares/csrf.middleware';
import configMiddleware from '../../core/middlewares/config.middleware';
import registrationMiddleware from '../../core/middlewares/registration.middleware';

const AuthWebRoutes: IRouteGroup = {
  group: {
    prefix: '/auth',
    middleware: [csrfProtection, configMiddleware],
  },
  routes: [
    {
      method: 'get',
      path: '/login',
      handler: authWebController.loginPage,
    },
    {
      method: 'post',
      path: '/login',
      handler: authWebController.login,
    },
    {
      method: 'get',
      path: '/register',
      middleware: [registrationMiddleware],
      handler: authWebController.registerPage,
    },
    {
      method: 'post',
      path: '/register',
      middleware: [registrationMiddleware],
      handler: authWebController.register,
    },
    {
      method: 'post',
      path: '/logout',
      handler: authWebController.logout,
    },
  ],
};

export default AuthWebRoutes;
