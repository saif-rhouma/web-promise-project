import authSessionMiddleware from '../../core/middlewares/auth-session.middleware';
import AdminController from '../../core/controllers/admin.controller';
import IRouteGroup from 'src/types/IRouteGroup';
import csrfProtection from '../../core/middlewares/csrf.middleware';
import { authorize } from '../../core/middlewares/role.middleware';
import { UserRole } from '../../core/models/user.model';

const AdminRoutes: IRouteGroup = {
  group: {
    prefix: '',
    middleware: [authSessionMiddleware, authorize(UserRole.ADMIN)],
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
    // JOBS PAGE
    // ======================
    {
      method: 'get',
      path: '/jobs',
      middleware: [csrfProtection],
      handler: AdminController.jobsPage,
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
    // PATCH USER STATUS
    // ======================
    {
      method: 'patch',
      path: '/users/:id/status',
      handler: AdminController.toggleStatus,
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
    // TOGGLE JOB STATUS
    // ======================
    {
      method: 'patch',
      path: '/jobs/:id/status',
      handler: AdminController.toggleJobStatus,
    },

    // ======================
    // TOGGLE JOB STATUS
    // ======================
    {
      method: 'get',
      path: '/change-password',
      middleware: [csrfProtection],
      handler: AdminController.passwordPage,
    },
  ],
};

export default AdminRoutes;
