import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import AsyncRouteHandler from 'src/types/AsyncRouteHandler';
import usersRepository from '../repositories/user.repository';
import { StartupProfile } from '../models/startup-profile.model';
import jobPostRepository from '../repositories/job-post.repository';
import { JobPost, JobStatus } from '../models/job-post.model';
import { getUser } from '../../helpers/getUser.helpers';
import { comparePassword, hashPassword } from '../../helpers/auth.helpers';
import applicationRepository from '../repositories/application.repository';
import { ProfileType } from '../models/user.model';
import { Not } from 'typeorm';

class StartupController {
  // ======================
  // PROFILE PAGE (GET)
  // ======================

  dashboardPage: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = await getUser(req, res, usersRepository);

      if (!user?.startupProfile?.id) {
        return res.redirect('/startup/profile');
      }

      const startupId = user.startupProfile.id;

      // ======================
      // JOBS
      // ======================

      const jobs = await jobPostRepository.findAll({
        where: {
          startup: {
            id: startupId,
          },
        } as any,
        relations: ['applications'],
        order: {
          createdAt: 'DESC',
        },
      });

      // ======================
      // APPLICATIONS PER JOB
      // ======================

      const applicationsPerJob = jobs.map((job) => ({
        title: job.title,
        total: job.applications?.length || 0,
      }));

      // ======================
      // APPLICATIONS OVER TIME
      // ======================

      const applications = await applicationRepository.findByStartup(startupId);

      const groupedApplications: Record<string, number> = {};

      applications.forEach((app) => {
        const date = new Date(app.appliedAt).toLocaleDateString('fr-FR');

        groupedApplications[date] = (groupedApplications[date] || 0) + 1;
      });

      const applicationsOverTime = Object.keys(groupedApplications).map((date) => ({
        date,
        total: groupedApplications[date],
      }));

      // ======================
      // STATS
      // ======================

      const stats = {
        totalJobs: jobs.length,
        totalApplications: applications.length,
        publishedJobs: jobs.filter((j) => j.status === JobStatus.PUBLISHED).length,
        draftJobs: jobs.filter((j) => j.status === JobStatus.DRAFT).length,
      };

      return res.render('pages/startup/dashboard', {
        user,
        startupProfile: user?.startupProfile || {},
        currentPath: req.path,

        stats,

        jobs,

        applicationsPerJob,
        applicationsOverTime,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).send('Failed to load dashboard');
    }
  };

  // ======================
  // PROFILE PAGE (GET)
  // ======================

  profilePage: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = await getUser(req, res, usersRepository);
      return res.render('pages/startup/profile', {
        csrfToken: req.csrfToken(),
        user,
        startupProfile: user?.startupProfile || {},
        currentPath: req.path,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return res.status(500).send('Failed to load profile');
    }
  };

  // ======================
  // PASSWORD CHANGE (GET)
  // ======================

  passwordPage: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = await getUser(req, res, usersRepository);
      return res.render('pages/startup/change-password', {
        csrfToken: req.csrfToken(),
        user,
        startupProfile: user?.startupProfile || {},
        currentPath: req.path,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return res.status(500).send('Failed to load profile');
    }
  };

  changePassword: AsyncRouteHandler = async (req, res) => {
    try {
      const user = await getUser(req, res, usersRepository);

      const { oldPassword, newPassword, confirmPassword } = req.body;
      // ======================
      // VALIDATION
      // ======================
      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).send('All fields are required');
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
      }

      // ======================
      // VERIFY OLD PASSWORD
      // ======================
      const isValid = await comparePassword(user.password, oldPassword);

      if (!isValid) {
        return res.status(400).send('Old password is incorrect');
      }

      // ======================
      // HASH NEW PASSWORD
      // ======================
      user.password = await hashPassword(newPassword);

      await usersRepository.save(user);

      return res.redirect('/startup/profile');
    } catch (error) {
      console.error(error);
      return res.status(500).send('Failed to change password');
    }
  };

  // ======================
  // PROFILE UPDATE (POST)
  // ======================
  updateProfile: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = await getUser(req, res, usersRepository);

      const { phone, name, email, description, sector, website, adress, socialLinks } = req.body;

      // ======================
      // USER UPDATE
      // ======================
      user.phone = phone;

      // ======================
      // PROFILE INIT
      // ======================
      if (!user.startupProfile) {
        user.startupProfile = new StartupProfile();
      }

      // ✅ SAFE FILE EXTRACTION
      const coverFile = req.file;

      // ======================
      // FILE (ONLY IF EXIST)
      // ======================

      if (coverFile) {
        user.startupProfile.cover = `${coverFile.filename}`;
      }

      // ======================
      // PROFILE UPDATE
      // ======================
      user.startupProfile.name = name;
      user.startupProfile.description = description;
      user.startupProfile.sector = sector;
      user.startupProfile.email = email;
      user.startupProfile.website = website;
      user.startupProfile.phone = phone;
      user.startupProfile.adress = adress;

      user.startupProfile.socialLinks = {
        facebook: socialLinks?.facebook || '',
        linkedin: socialLinks?.linkedin || '',
        youtube: socialLinks?.youtube || '',
      };

      // ======================
      // SAVE
      // ======================
      await usersRepository.save(user);

      return res.redirect('/startup/profile');
    } catch (error) {
      console.error(error);
      return res.status(500).send('Failed to update profile');
    }
  };

  // ======================
  // PROFILE UPDATE AVATAR (POST)
  // ======================
  updateAvatar: AsyncRouteHandler = async (req, res) => {
    try {
      const user = await getUser(req, res, usersRepository);
      const file = req.file;
      if (!file) return res.status(400).json({ message: 'No file uploaded' });

      if (!user.startupProfile) {
        user.startupProfile = new StartupProfile();
      }

      user.startupProfile.avatar = `${file.filename}`;

      await usersRepository.save(user);

      return res.json({
        avatar: user.startupProfile.avatar,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Upload failed' });
    }
  };

  // ======================
  // POST JOB PAGE (GET)
  // ======================
  postJobPage: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = await getUser(req, res, usersRepository);
      return res.render('pages/startup/post-job', {
        csrfToken: req.csrfToken(),
        user,
        startupProfile: user?.startupProfile || {},
        currentPath: req.path,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return res.status(500).send('Failed to load profile');
    }
  };
  // ======================
  // GET JOBS LIST PAGE (GET)
  // ======================
  getJobs: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = await getUser(req, res, usersRepository);

      const page = parseInt((req.query.page as string) || '1');
      const limit = 10;
      const skip = (page - 1) * limit;

      const [jobs, total] = await jobPostRepository.findJobsDetails(user.startupProfile?.id, limit, skip);
      console.log('---> jobs', jobs);
      const totalPages = Math.ceil(total / limit);

      return res.render('pages/startup/manage-jobs', {
        csrfToken: req.csrfToken(),
        jobs,
        page,
        totalPages,
        user,
        startupProfile: user?.startupProfile || {},
        currentPath: req.path,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Failed to load jobs');
    }
  };

  // ======================
  // POST JOB PAGE (GET)
  // ======================
  deleteJob: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = await getUser(req, res, usersRepository);
      const jobId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const job = await jobPostRepository.findOne({
        where: {
          id: jobId,
          startup: { id: user.startupProfile.id },
        },
        relations: ['startup'],
      });

      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      await jobPostRepository.destroy(job.id);

      return res.json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Delete failed' });
    }
  };
  // ======================
  // POST JOB PAGE (GET)
  // ======================
  toggleStatus: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = await getUser(req, res, usersRepository);
      if (!user) return res.status(401).json({ message: 'Unauthorized' });
      const jobId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const job = await jobPostRepository.findOne({
        where: { id: jobId },
      });

      if (!job) return res.status(404).json({ message: 'Job not found' });

      job.status = job.status === JobStatus.PUBLISHED ? JobStatus.ARCHIVED : JobStatus.PUBLISHED;

      await jobPostRepository.save(job);

      return res.json({
        success: true,
        status: job.status,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Toggle failed' });
    }
  };
  // ======================
  // POST JOB PAGE (POST)
  // ======================
  createJob = async (req: Request, res: Response) => {
    try {
      const user = await getUser(req, res, usersRepository);
      // ✅ SAFE FILE EXTRACTION
      const files = req.files as
        | {
            [fieldname: string]: Express.Multer.File[];
          }
        | undefined;

      const coverFile = files?.cover?.[0];
      const pdfFile = files?.pdfFile?.[0];

      if (!coverFile) {
        return res.redirect('/startup/profile');
      }

      if (!user?.startupProfile) return res.status(400).send('No startup profile');

      const {
        title,
        description,
        location,
        category,
        type,
        experience,
        qualification,
        gender,
        period,
        remoteWork,
        languages,
        roles,
        offers,
        knowledge,
        softSkills,
        tools,
        preferredExperience,
        action, // 👈 publish or draft
      } = req.body;

      const job = new JobPost();
      job.title = title;
      job.description = description;
      job.location = location;

      job.category = category;
      job.type = type;
      job.experience = experience;
      job.qualification = qualification;
      job.gender = gender;
      // job.address = address;

      // ======================
      // FILE (ONLY IF EXIST)
      // ======================

      if (coverFile) {
        job.cover = `${coverFile.filename}`;
      }

      if (pdfFile) {
        job.pdfFile = pdfFile.filename;
      }

      job.period = period;
      job.remoteWork = remoteWork;

      job.languages = Array.isArray(languages) ? languages : [languages];

      // 🔥 rich editors (JSON safe)
      job.roles = roles;
      job.offers = offers;
      job.knowledge = knowledge;
      job.softSkills = softSkills;
      job.tools = tools;
      job.preferredExperience = preferredExperience;

      job.startup = user.startupProfile;

      // ================= STATUS LOGIC =================
      job.status = action === 'publish' ? JobStatus.PUBLISHED : JobStatus.DRAFT;

      await jobPostRepository.save(job);

      return res.redirect('/startup/jobs');
    } catch (err) {
      console.error(err);
      return res.status(500).send('Failed to save job');
    }
  };

  editPage = async (req: Request, res: Response) => {
    try {
      const user = await getUser(req, res, usersRepository);
      const jobId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const job = await jobPostRepository.findOne({
        where: { id: jobId },
        relations: ['startup'],
      });

      if (!job) return res.status(404).send('Job not found');

      return res.render('pages/startup/post-job-edit', {
        csrfToken: req.csrfToken(),
        job,
        user,
        startupProfile: user?.startupProfile || {},
        currentPath: req.path,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Error loading edit page');
    }
  };

  updateJob = async (req: Request, res: Response) => {
    try {
      const jobId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const action = req.body.action;

      const job = await jobPostRepository.findOne({
        where: { id: jobId },
      });

      if (!job) return res.status(404).send('Job not found');

      const files = req.files as
        | {
            [fieldname: string]: Express.Multer.File[];
          }
        | undefined;

      const coverFile = files?.cover?.[0];
      const pdfFile = files?.pdfFile?.[0];

      // ======================
      // FILE (ONLY IF EXIST)
      // ======================

      if (coverFile) {
        job.cover = `${coverFile.filename}`;
      }

      if (pdfFile) {
        job.pdfFile = pdfFile.filename;
      }

      // ✅ Safe languages handling
      const languages = req.body.languages
        ? Array.isArray(req.body.languages)
          ? req.body.languages
          : [req.body.languages]
        : [];

      // ================= UPDATE FIELDS =================
      Object.assign(job, {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        category: req.body.category,
        type: req.body.type,
        experience: req.body.experience,
        qualification: req.body.qualification,
        gender: req.body.gender,
        address: req.body.address,
        period: req.body.period,
        remoteWork: req.body.remoteWork,
        languages,
        roles: req.body.roles,
        offers: req.body.offers,
        knowledge: req.body.knowledge,
        softSkills: req.body.softSkills,
        tools: req.body.tools,
        preferredExperience: req.body.preferredExperience,

        status: action === 'publish' ? JobStatus.PUBLISHED : JobStatus.DRAFT,
      });

      await jobPostRepository.save(job);
      // ✅ redirect logic
      if (action === 'draft') {
        return res.redirect(`/startup/jobs/${jobId}/edit`);
      }

      return res.redirect(`/startup/jobs/`);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Error updating job');
    }
  };

  getApplications: AsyncRouteHandler = async (req, res) => {
    try {
      const user = await getUser(req, res, usersRepository);

      if (!user.startupProfile?.id) {
        return res.redirect('/startup/profile');
      }

      const applications = await applicationRepository.findByStartup(user.startupProfile?.id);

      return res.render('pages/startup/applications', {
        applications,
        user,
        startupProfile: user?.startupProfile || {},
        currentPath: req.path,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Failed to load applications');
    }
  };

  getApplicationsByJob: AsyncRouteHandler = async (req, res) => {
    try {
      const user = await getUser(req, res, usersRepository);
      const jobId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const applications = await applicationRepository.findByJob(jobId);
      let job;
      if (applications.length > 0) {
        job = applications[0].jobPost;
      }

      return res.render('pages/startup/applications', {
        applications,
        user,
        startupProfile: user?.startupProfile || {},
        job,
        currentPath: req.path,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Failed');
    }
  };

  updateApplicationStatus: AsyncRouteHandler = async (req, res) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { status } = req.body;

      const app = await applicationRepository.findOne({
        where: { id },
      });

      if (!app) return res.status(404).json({ message: 'Not found' });

      app.status = status;

      await applicationRepository.save(app);

      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed' });
    }
  };

  downloadCV: AsyncRouteHandler = async (req, res) => {
    try {
      const user = await getUser(req, res, usersRepository);

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const application = await applicationRepository.findOne({
        where: { id },
        relations: ['jobPost', 'jobPost.startup'],
      });

      if (!application) {
        return res.status(404).send('Application not found');
      }

      // 🔒 SECURITY: ensure startup owns this application
      if (application.jobPost.startup.id !== user.startupProfile.id) {
        return res.status(403).send('Unauthorized');
      }

      const filePath = path.join(process.cwd(), '/src/uploads/cv/', application.cvUrl as string);

      const stat = fs.statSync(filePath);
      res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Length': stat.size,
        'Content-Disposition': `attachment; filename="${`${application.fullName?.toLocaleLowerCase()} - CV.pdf`}"`,
      });

      const fileStream = fs.createReadStream(filePath);

      fileStream.pipe(res);

      fileStream.on('error', (err) => {
        console.error('Error during file streaming:', err);
        res.status(500).send('File streaming failed.');
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Download failed');
    }
  };
  // ======================
  // PROFILE PAGE (GET)
  // ======================

  startupsPage: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = await getUser(req, res, usersRepository);

      if (!user?.startupProfile?.id) {
        return res.redirect('/startup/dashboard');
      }

      const users = await usersRepository.findAll({
        relations: ['startupProfile'],
        where: {
          type: ProfileType.STARTUP,
          id: Not(user?.id),
        },
      });

      const startups = users.map((u) => u.startupProfile).filter(Boolean);
      return res.render('pages/startup/startups', {
        csrfToken: req.csrfToken(),
        user,
        startupProfile: user?.startupProfile || {},
        currentPath: req.path,
        startups,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).send('Failed to load dashboard');
    }
  };
}

export default new StartupController();
