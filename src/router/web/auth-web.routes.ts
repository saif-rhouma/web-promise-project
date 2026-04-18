import IRouteGroup from 'src/types/IRouteGroup';
import authWebController from '../../core/controllers/auth-web.controller';

const AuthWebRoutes: IRouteGroup = {
  group: {
    prefix: '/auth',
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
      handler: authWebController.registerPage,
    },
    {
      method: 'post',
      path: '/register',
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
