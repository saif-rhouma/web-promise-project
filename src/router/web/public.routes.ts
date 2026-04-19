import { uploadCV } from '../../core/middlewares/uploader.middleware';
import publicController from '../../core/controllers/public.controller';
import IRouteGroup from 'src/types/IRouteGroup';
import csrfProtection from '../../core/middlewares/csrf.middleware';

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
      path: '/startups/:id',
      handler: publicController.getStartupDetails,
    },
    {
      method: 'get',
      path: '/jobs/:id',
      middleware: [csrfProtection],
      handler: publicController.getJobDetails,
    },
    {
      method: 'post',
      path: '/applications/:jobId',
      middleware: [uploadCV.single('cv')],
      handler: publicController.applyToJob,
    },
    {
      method: 'get',
      path: '/success/:jobId',
      handler: publicController.applySuccess,
    },
  ],
};

export default PublicRoutes;
