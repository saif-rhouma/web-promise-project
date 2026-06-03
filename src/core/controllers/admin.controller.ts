import { Request, Response } from 'express';
import AsyncRouteHandler from 'src/types/AsyncRouteHandler';

import usersRepository from '../repositories/user.repository';
import startupProfileRepository from '../repositories/startup-profile.repository';
import jobPostRepository from '../repositories/job-post.repository';
import applicationRepository from '../repositories/application.repository';
import contactRepository from '../repositories/contact.repository';

import { AccountStatus, ProfileType, UserRole } from '../models/user.model';
import { JobStatus } from '../models/job-post.model';

class AdminController {
  // ======================
  // DASHBOARD

  // ======================
  dashboardPage: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = req['user'];
      const totalUsers = await usersRepository.countWithRole(UserRole.USER);

      const totalStartups = await usersRepository.countStartups();

      const totalEnterprises = await usersRepository.countEnterprise();

      const totalJobs = await jobPostRepository.countJobs();

      const publishedJobs = await jobPostRepository.countJobsWithStatus(JobStatus.PUBLISHED);

      const draftJobs = await jobPostRepository.countJobsWithStatus(JobStatus.DRAFT);

      const archivedJobs = await jobPostRepository.countJobsWithStatus(JobStatus.ARCHIVED);

      const totalApplications = await applicationRepository.count();

      const totalContacts = await contactRepository.count();

      const latestJobs = await jobPostRepository.findAll({
        relations: ['startup'],
        order: {
          createdAt: 'DESC',
        },
        take: 10,
      });

      const latestApplications = await applicationRepository.findAll({
        relations: ['jobPost', 'jobPost.startup'],
        order: {
          appliedAt: 'DESC',
        },
        take: 10,
      });

      const applicationsByMonth = await applicationRepository.applicationsByMonth();
      const jobsByMonth = await jobPostRepository.jobsByMonth();
      const registrationsByMonth = await usersRepository.registrationsByMonth();

      return res.render('pages/admin/dashboard-0', {
        csrfToken: req.csrfToken(),
        user,

        stats: {
          totalUsers,
          totalStartups,
          totalEnterprises,
          totalJobs,
          publishedJobs,
          draftJobs,
          archivedJobs,
          totalApplications,
          totalContacts,
        },
        applicationsByMonth,
        jobsByMonth,
        registrationsByMonth,
        latestJobs,
        latestApplications,

        currentPath: req.path,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).send('Failed to load dashboard');
    }
  };

  // ======================
  // USERS PAGE
  // ======================
  usersPage: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const totalStartups = await usersRepository.countStartups();

      const totalEnterprises = await usersRepository.countEnterprise();

      const user = req['user'];

      // ✅ Pagination support
      const page = Number.parseInt((req.query.page as string) || '1');
      const limit = 20;
      const skip = (page - 1) * limit;

      const totalUsers = await usersRepository.count();
      const totalPages = Math.ceil(totalUsers / limit);

      const users = await usersRepository.findAllAccounts(skip, limit);

      return res.render('pages/admin/users', {
        csrfToken: req.csrfToken(),
        user,
        users,
        totalUsers,
        stats: {
          totalUsers,
          totalStartups,
          totalEnterprises,
        },
        totalPages,
        currentPage: page,
        currentPath: req.path,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).send('Failed to load users');
    }
  };

  // ======================
  // STARTUPS PAGE
  // ======================
  startupsPage: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = req['user'];

      // ✅ Pagination support
      const page = parseInt((req.query.page as string) || '1');
      const limit = 20;
      const skip = (page - 1) * limit;

      const totalStartups = await usersRepository.countWithType(ProfileType.STARTUP);

      const totalPages = Math.ceil(totalStartups / limit);

      const startups = await startupProfileRepository.findAll({
        relations: ['user', 'jobPosts'],
        skip,
        take: limit,
      });

      return res.render('pages/admin/startups', {
        csrfToken: req.csrfToken(),
        user,
        startups,
        totalStartups,
        totalPages,
        currentPage: page,
        currentPath: req.path,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).send('Failed to load startups');
    }
  };

  // ======================
  // JOBS PAGE
  // ======================
  jobsPage: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = req['user'];

      // ✅ Pagination support
      const page = Number.parseInt((req.query.page as string) || '1');
      const limit = 20;
      const skip = (page - 1) * limit;

      const totalJobs = await jobPostRepository.countJobs();

      const publishedJobs = await jobPostRepository.countJobsWithStatus(JobStatus.PUBLISHED);
      const archivedJobs = await jobPostRepository.countJobsWithStatus(JobStatus.ARCHIVED);

      const totalPages = Math.ceil(totalJobs / limit);

      const jobs = await jobPostRepository.findAll({
        relations: ['startup', 'applications'],
        order: {
          createdAt: 'DESC',
        },
        skip,
        take: limit,
      });

      return res.render('pages/admin/jobs', {
        csrfToken: req.csrfToken(),
        user,
        jobs,
        stats: {
          totalJobs,
          publishedJobs,
          archivedJobs,
        },
        totalJobs,
        totalPages,
        currentPage: page,
        currentPath: req.path,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).send('Failed to load jobs');
    }
  };

  // ======================
  // APPLICATIONS PAGE
  // ======================
  applicationsPage: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = req['user'];

      // ✅ Pagination support
      const page = parseInt((req.query.page as string) || '1');
      const limit = 20;
      const skip = (page - 1) * limit;

      const totalApplications = await applicationRepository.count();
      const totalPages = Math.ceil(totalApplications / limit);

      const applications = await applicationRepository.findAll({
        relations: ['jobPost', 'jobPost.startup'],
        order: {
          appliedAt: 'DESC',
        },
        skip,
        take: limit,
      });

      return res.render('pages/admin/applications', {
        csrfToken: req.csrfToken(),
        user,
        applications,
        totalApplications,
        totalPages,
        currentPage: page,
        currentPath: req.path,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).send('Failed to load applications');
    }
  };

  // ======================
  // CONTACTS PAGE
  // ======================
  contactsPage: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = req['user'];

      // ✅ Pagination support
      const page = parseInt((req.query.page as string) || '1');
      const limit = 20;
      const skip = (page - 1) * limit;

      const totalContacts = await contactRepository.count();
      const totalPages = Math.ceil(totalContacts / limit);

      const contacts = await contactRepository.findAll({
        relations: ['sender', 'receiver'],
        order: {
          createdAt: 'DESC',
        },
        skip,
        take: limit,
      });

      return res.render('pages/admin/contacts', {
        csrfToken: req.csrfToken(),
        user,
        contacts,
        totalContacts,
        totalPages,
        currentPage: page,
        currentPath: req.path,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).send('Failed to load contacts');
    }
  };

  // ======================
  // USER DETAILS
  // ======================
  userDetailsPage: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      // ✅ Ensure user exists and is valid for admin view
      const user = await usersRepository.findOne({
        where: {
          id,
        },
        relations: ['startupProfile'],
      });

      if (!user) {
        return res.status(404).render('pages/admin/user-detail', {
          csrfToken: req.csrfToken(),
          user: null as any,
          currentPath: req.path,
        });
      }

      return res.render('pages/admin/user-detail', {
        csrfToken: req.csrfToken(),
        user,
        currentPath: req.path,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).send('Failed to load user details');
    }
  };

  // ======================
  // JOB DETAILS
  // ======================
  jobDetailsPage: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      // ✅ Ensure job exists and is valid for admin view
      const job = await jobPostRepository.findOne({
        where: {
          id,
        },
        relations: ['startup', 'applications'],
      });

      if (!job) {
        return res.status(404).render('pages/admin/job-detail', {
          csrfToken: req.csrfToken(),
          job: null as any,
          currentPath: req.path,
        });
      }

      return res.render('pages/admin/job-detail', {
        csrfToken: req.csrfToken(),
        job,
        currentPath: req.path,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).send('Failed to load job details');
    }
  };

  // ======================
  // DELETE USER
  // ======================
  deleteUser: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const deleted = await usersRepository.destroy(id);

      if (!deleted) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      return res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: 'Delete failed',
      });
    }
  };

  // ======================
  // DELETE JOB
  // ======================
  deleteJob: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const deleted = await jobPostRepository.destroy(id);

      if (!deleted) {
        return res.status(404).json({
          message: 'Job not found',
        });
      }

      return res.json({
        success: true,
        message: 'Job deleted successfully',
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: 'Delete failed',
      });
    }
  };

  // ======================
  // UPDATE USER ROLE
  // ======================
  updateUserRole: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const { role } = req.body;

      const user = await usersRepository.findOne({
        where: {
          id,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      if (!['admin', 'enterprise'].includes(role)) {
        return res.status(400).json({
          message: 'Invalid role. Allowed roles: admin, enterprise',
        });
      }

      user.role = role as UserRole;

      await usersRepository.save(user);

      return res.json({
        success: true,
        message: 'User role updated successfully',
        role: user.role,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: 'Failed to update user role',
      });
    }
  };

  // ======================
  // TOGGLE JOB STATUS
  // ======================
  toggleStatus: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const user = await usersRepository.findOne({
        where: {
          id,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: 'Job not found',
        });
      }

      user.status = user.status === AccountStatus.ACTIVE ? AccountStatus.BLOCKED : AccountStatus.ACTIVE;

      await usersRepository.save(user);

      return res.json({
        success: true,
        status: user.status,
        message: user.status === AccountStatus.ACTIVE ? 'Blocked' : 'Activated',
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: 'Failed to toggle job status',
      });
    }
  };

  // ======================
  // TOGGLE JOB STATUS
  // ======================
  toggleJobStatus: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const { status } = req.body;

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const job = await jobPostRepository.findOne({
        where: {
          id,
        },
      });

      if (!job) {
        return res.status(404).json({
          message: 'Job not found',
        });
      }

      job.status = status;

      await jobPostRepository.save(job);

      return res.json({
        success: true,
        status: job.status,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: 'Failed to toggle job status',
      });
    }
  };

  // ======================
  // PASSWORD CHANGE (GET)
  // ======================

  passwordPage: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = req['user'];
      return res.render('pages/admin/change-password', {
        csrfToken: req.csrfToken(),
        user,
        currentPath: req.path,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send('Failed to load profile');
    }
  };
}

export default new AdminController();
