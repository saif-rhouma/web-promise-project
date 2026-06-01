import authSessionMiddleware from '../../core/middlewares/auth-session.middleware';
import AdminController from '../../core/controllers/admin.controller';
import IRouteGroup from 'src/types/IRouteGroup';
import csrfProtection from '../../core/middlewares/csrf.middleware';

const AdminRoutes: IRouteGroup = {
  group: {
    prefix: '', // ✅ Removed /admin prefix here since it's added in index.ts
    middleware: [authSessionMiddleware],
  },

  routes: [
    // ======================
    // DASHBOARD PAGE
    // ======================
    {
      method: 'get',
      path: '/dashboard',
      middleware: [csrfProtection],
      handler: AdminController.dashboardPage,
    },

    {
      method: 'get',
      path: '/',
      middleware: [csrfProtection],
      handler: AdminController.dashboardPage,
    },

    // ======================
    // USERS PAGE
    // ======================
    {
      method: 'get',
      path: '/users',
      middleware: [csrfProtection],
      handler: AdminController.usersPage,
    },

    // ======================
    // STARTUPS PAGE
    // ======================
    {
      method: 'get',
      path: '/startups',
      handler: AdminController.startupsPage,
    },

    // ======================
    // JOBS PAGE
    // ======================
    {
      method: 'get',
      path: '/jobs',
      middleware: [csrfProtection],
      handler: AdminController.jobsPage,
    },

    // ======================
    // APPLICATIONS PAGE
    // ======================
    {
      method: 'get',
      path: '/applications',
      handler: AdminController.applicationsPage,
    },

    // ======================
    // CONTACTS PAGE
    // ======================
    {
      method: 'get',
      path: '/contacts',
      handler: AdminController.contactsPage,
    },

    // ======================
    // USER DETAILS
    // ======================
    {
      method: 'get',
      path: '/user/:id',
      handler: AdminController.userDetailsPage,
    },

    // ======================
    // JOB DETAILS
    // ======================
    {
      method: 'get',
      path: '/job/:id',
      handler: AdminController.jobDetailsPage,
    },

    // ======================
    // DELETE USER
    // ======================
    {
      method: 'delete',
      path: '/users/:id',
      handler: AdminController.deleteUser,
    },

    // ======================
    // DELETE JOB
    // ======================
    {
      method: 'delete',
      path: '/jobs/:id',
      handler: AdminController.deleteJob,
    },

    // ======================
    // UPDATE USER ROLE
    // ======================
    {
      method: 'patch',
      path: '/users/:id/role',
      handler: AdminController.updateUserRole,
    },

    // ======================
    // TOGGLE JOB STATUS
    // ======================
    {
      method: 'patch',
      path: '/jobs/:id/status',
      handler: AdminController.toggleJobStatus,
    },
  ],
};

export default AdminRoutes;
