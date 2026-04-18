import publicController from '../../core/controllers/public.controller';
import IRouteGroup from 'src/types/IRouteGroup';

const PublicRoutes: IRouteGroup = {
  group: {
    prefix: '',
  },
  routes: [
    {
      method: 'get',
      path: '/',
      handler: publicController.home,
    },
    {
      method: 'get',
      path: '/contact',
      handler: publicController.contactPage,
    },
    {
      method: 'post',
      path: '/contact',
      handler: publicController.sendContactMessage,
    },
    {
      method: 'get',
      path: '/startups',
      handler: publicController.listStartups,
    },
    {
      method: 'get',
      path: '/startups/:slug',
      handler: publicController.getStartupDetails,
    },
  ],
};

export default PublicRoutes;
