import authSessionMiddleware from '../../core/middlewares/auth-session.middleware';
import StartupController from '../../core/controllers/startup.controller';
import ContactController from '../../core/controllers/contact.controller';
import IRouteGroup from 'src/types/IRouteGroup';
import { uploadImage, uploadJobFiles } from '../../core/middlewares/uploader.middleware';
import csrfProtection from '../../core/middlewares/csrf.middleware';

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
      path: '/',
      handler: StartupController.dashboardPage,
    },
    // ======================
    // GET PROFILE PAGE
    // ======================
    {
      method: 'get',
      path: '/dashboard',
      handler: StartupController.dashboardPage,
    },
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
      middleware: [uploadImage.single('cover'), csrfProtection],
      handler: StartupController.updateProfile,
    },
    // ======================
    // GET PASSWORD CHANGE PAGE
    // ======================
    {
      method: 'get',
      path: '/profile/password',
      middleware: [csrfProtection],
      handler: StartupController.passwordPage,
    },

    // ======================
    // UPDATE PASSWORD CHANGE PAGE (POST)
    // ======================
    {
      method: 'post',
      path: '/change-password',
      middleware: [csrfProtection],
      handler: StartupController.changePassword,
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
      middleware: [
        uploadJobFiles.fields([
          { name: 'cover', maxCount: 1 },
          { name: 'pdfFile', maxCount: 1 },
        ]),
        csrfProtection,
      ],
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
      middleware: [
        uploadJobFiles.fields([
          { name: 'cover', maxCount: 1 },
          { name: 'pdfFile', maxCount: 1 },
        ]),
        csrfProtection,
      ],
      handler: StartupController.updateJob,
    },

    {
      method: 'get',
      path: '/applications',
      handler: StartupController.getApplications,
    },
    {
      method: 'get',
      path: '/jobs/:id/applications',
      handler: StartupController.getApplicationsByJob,
    },
    {
      method: 'patch',
      path: '/applications/:id/status',
      handler: StartupController.updateApplicationStatus,
    },
    {
      method: 'get',
      path: '/applications/:id/cv',
      handler: StartupController.downloadCV,
    },

    // ======================
    // VIEW PUBLIC DASHBOARD
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
    //  LIST STARTUPS
    // ======================
    {
      method: 'get',
      path: '/startups',
      middleware: [csrfProtection],
      handler: StartupController.startupsPage,
    },

    // ======================
    // CONTACTS PAGE
    // ======================
    {
      method: 'get',
      path: '/messages',
      middleware: [csrfProtection],
      handler: ContactController.contactsPage,
    },

    // ======================
    // CONTACT DETAILS PAGE
    // ======================
    {
      method: 'get',
      path: '/contacts/:id',
      middleware: [csrfProtection],
      handler: ContactController.getContactDetails,
    },

    // ======================
    // SEND CONTACT MESSAGE
    // ======================
    {
      method: 'post',
      path: '/contacts/send',
      middleware: [csrfProtection],
      handler: ContactController.sendContact,
    },

    // ======================
    // UPDATE CONTACT STATUS
    // ======================
    {
      method: 'patch',
      path: '/contacts/:id/status',
      middleware: [csrfProtection],
      handler: ContactController.updateStatus,
    },

    // ======================
    // MARK AS READ
    // ======================
    {
      method: 'patch',
      path: '/contacts/:id/read',
      middleware: [csrfProtection],
      handler: ContactController.markAsRead,
    },

    // ======================
    // DELETE CONTACT
    // ======================
    {
      method: 'delete',
      path: '/contacts/:id',
      middleware: [csrfProtection],
      handler: ContactController.deleteContact,
    },

    // ======================
    // CONVERSATION VIEW (CHAT STYLE)
    // ======================
    {
      method: 'get',
      path: '/contacts/conversation/:id',
      middleware: [csrfProtection],
      handler: ContactController.getConversation,
    },

    // ======================
    // OPTIONAL: LOGOUT FROM STARTUP AREA
    // ======================
    {
      method: 'get',
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
