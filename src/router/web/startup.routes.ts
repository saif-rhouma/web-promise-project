import authSessionMiddleware from '../../core/middlewares/auth-session.middleware';
import StartupController from '../../core/controllers/startup.controller';
import IRouteGroup from 'src/types/IRouteGroup';
import { uploadImage } from '../../core/middlewares/uploader.middleware';
import csrfProtection from '../..//core/middlewares/csrf.middleware';

const StartupRoutes: IRouteGroup = {
  group: {
    prefix: '/startup',
    middleware: [authSessionMiddleware],
  },

  routes: [
    // ======================
    // GET PROFILE PAGE
    // ======================
    {
      method: 'get',
      path: '/profile',
      middleware: [csrfProtection],
      handler: StartupController.profilePage,
    },

    // ======================
    // UPDATE PROFILE
    // ======================
    {
      method: 'post',
      path: '/profile',
      middleware: [
        uploadImage.fields([
          { name: 'avatar', maxCount: 1 },
          { name: 'cover', maxCount: 1 },
        ]),
        csrfProtection,
      ],
      handler: StartupController.updateProfile,
    },

    // ======================
    // UPDATE AVATAR PROFILE
    // ======================
    {
      method: 'post',
      path: '/profile/avatar',
      middleware: [uploadImage.single('avatar'), csrfProtection],
      handler: StartupController.updateAvatar,
    },

    // ======================
    // GET POST A JOBS PAGE
    // ======================
    {
      method: 'get',
      path: '/post-job',
      middleware: [csrfProtection],
      handler: StartupController.postJobPage,
    },

    // ======================
    // CREATE POST A JOBS
    // ======================
    {
      method: 'post',
      path: '/jobs/create',
      middleware: [uploadImage.single('cover'), csrfProtection],
      handler: StartupController.createJob,
    },

    // ======================
    // GET UPDATE POST A JOBS PAGE
    // ======================
    {
      method: 'get',
      path: '/jobs/:id/edit',
      middleware: [csrfProtection],
      handler: StartupController.editPage,
    },

    // ======================
    // GET JOBS LIST PAGE
    // ======================
    {
      method: 'get',
      path: '/jobs/',
      middleware: [csrfProtection],
      handler: StartupController.getJobs,
    },

    // ======================
    // GET JOBS LIST PAGE
    // ======================
    {
      method: 'delete',
      path: '/jobs/:id',
      middleware: [csrfProtection],
      handler: StartupController.deleteJob,
    },

    // ======================
    // GET JOBS LIST PAGE
    // ======================
    {
      method: 'patch',
      path: '/jobs/:id/status',
      middleware: [csrfProtection],
      handler: StartupController.toggleStatus,
    },

    // ======================
    // CREATE POST A JOBS
    // ======================
    {
      method: 'post',
      path: '/jobs/:id/edit',
      middleware: [uploadImage.single('cover'), csrfProtection],
      handler: StartupController.updateJob,
    },

    // ======================
    // OPTIONAL: VIEW PUBLIC DASHBOARD
    // ======================
    {
      method: 'get',
      path: '/dashboard',
      handler: async (req, res) => {
        return res.render('pages/startup/dashboard', {
          user: req.session['user'],
        });
      },
    },

    // ======================
    // OPTIONAL: LOGOUT FROM STARTUP AREA
    // ======================
    {
      method: 'post',
      path: '/logout',
      handler: async (req, res) => {
        req.session.destroy(() => {
          return res.redirect('/auth/login');
        });
      },
    },
  ],
};

export default StartupRoutes;
