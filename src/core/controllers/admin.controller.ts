import { Request, Response } from 'express';
import AsyncRouteHandler from 'src/types/AsyncRouteHandler';

import usersRepository from '../repositories/user.repository';
import startupProfileRepository from '../repositories/startup-profile.repository';
import jobPostRepository from '../repositories/job-post.repository';
import applicationRepository from '../repositories/application.repository';
import contactRepository from '../repositories/contact.repository';

import { getUser } from '../../helpers/getUser.helpers';

import { ProfileType, UserRole } from '../models/user.model';
import { JobStatus } from '../models/job-post.model';

class AdminController {
  // ======================
  // DASHBOARD
  // ======================
  dashboardPage: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = await getUser(req, res, usersRepository);

      const totalUsers = await usersRepository.repo.count();

      const totalStartups = await usersRepository.repo.count({
        where: {
          type: ProfileType.STARTUP,
        },
      });

      const totalEnterprises = await usersRepository.repo.count({
        where: {
          type: ProfileType.ENTERPRISE,
        },
      });

      const totalJobs = await jobPostRepository.repo.count();

      const publishedJobs = await jobPostRepository.repo.count({
        where: {
          status: JobStatus.PUBLISHED,
        },
      });

      const draftJobs = await jobPostRepository.repo.count({
        where: {
          status: JobStatus.DRAFT,
        },
      });

      const archivedJobs = await jobPostRepository.repo.count({
        where: {
          status: JobStatus.ARCHIVED,
        },
      });

      const totalApplications = await applicationRepository.repo.count();

      const totalContacts = await contactRepository.repo.count();

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

      return res.render('pages/admin/dashboard', {
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
      const user = await getUser(req, res, usersRepository);

      const users = await usersRepository.findAll({
        relations: ['startupProfile'],
        order: {
          createdAt: 'DESC',
        },
      });

      return res.render('pages/admin/users', {
        csrfToken: req.csrfToken(),
        user,
        users,
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
      const user = await getUser(req, res, usersRepository);

      const startups = await startupProfileRepository.findAll({
        relations: ['user', 'jobPosts'],
      });

      return res.render('pages/admin/startups', {
        csrfToken: req.csrfToken(),
        user,
        startups,
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
      const user = await getUser(req, res, usersRepository);

      const jobs = await jobPostRepository.findAll({
        relations: ['startup', 'applications'],
        order: {
          createdAt: 'DESC',
        },
      });

      return res.render('pages/admin/jobs', {
        csrfToken: req.csrfToken(),
        user,
        jobs,
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
      const user = await getUser(req, res, usersRepository);

      const applications = await applicationRepository.findAll({
        relations: ['jobPost', 'jobPost.startup'],
        order: {
          appliedAt: 'DESC',
        },
      });

      return res.render('pages/admin/applications', {
        csrfToken: req.csrfToken(),
        user,
        applications,
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
      const user = await getUser(req, res, usersRepository);

      const contacts = await contactRepository.findAll({
        relations: ['sender', 'receiver'],
        order: {
          createdAt: 'DESC',
        },
      });

      return res.render('pages/admin/contacts', {
        csrfToken: req.csrfToken(),
        user,
        contacts,
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

      const user = await usersRepository.findOne({
        where: {
          id,
        },
        relations: ['startupProfile'],
      });

      if (!user) {
        return res.status(404).send('User not found');
      }

      return res.render('pages/admin/user-detail', {
        csrfToken: req.csrfToken(),
        user,
        currentPath: req.path,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).send('Failed');
    }
  };

  // ======================
  // JOB DETAILS
  // ======================
  jobDetailsPage: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const job = await jobPostRepository.findOne({
        where: {
          id,
        },
        relations: ['startup', 'applications'],
      });

      if (!job) {
        return res.status(404).send('Job not found');
      }

      return res.render('pages/admin/job-detail', {
        csrfToken: req.csrfToken(),
        job,
        currentPath: req.path,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).send('Failed');
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

      user.role = role as UserRole;

      await usersRepository.save(user);

      return res.json({
        success: true,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: 'Failed',
      });
    }
  };

  // ======================
  // TOGGLE JOB STATUS
  // ======================
  toggleJobStatus: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
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

      job.status = job.status === JobStatus.PUBLISHED ? JobStatus.ARCHIVED : JobStatus.PUBLISHED;

      await jobPostRepository.save(job);

      return res.json({
        success: true,
        status: job.status,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: 'Failed',
      });
    }
  };
}

export default new AdminController();
