import authMiddleware from '../../core/middlewares/auth.middleware';
import exampleController from '../../core/controllers/example.controller';
import fileManagerController from '../../core/controllers/filemanager.controller';
import IRouteGroup from 'src/types/IRouteGroup';
// import Uploader from '../../core/middlewares/uploader.middleware';

export const ExampleRoutes: IRouteGroup = {
  group: {
    prefix: '/example',
  },
  routes: [
    {
      method: 'get',
      path: '/',
      handler: exampleController.public,
    },
    {
      method: 'get',
      path: '/protected',
      middleware: [authMiddleware],
      handler: exampleController.authProtected,
    },
    // {
    //   method: 'post',
    //   path: '/',
    //   middleware: [Uploader.single('file')],
    //   handler: fileManagerController.upload,
    // },

    {
      method: 'get',
      path: '/download/:fileName',
      handler: fileManagerController.download,
    },
  ],
};
