import { Request, Response } from 'express';
import AsyncRouteHandler from 'src/types/AsyncRouteHandler';
import usersRepository from '../repositories/user.repository';
import { StartupProfile } from '../models/startup-profile.model';
import jobPostRepository from '../repositories/job-post.repository';
import { JobPost, JobStatus } from '../models/job-post.model';
import { getUser } from '../../helpers/getUser.helpers';

class StartupController {
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
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return res.status(500).send('Failed to load profile');
    }
  };

  // ======================
  // PROFILE UPDATE (POST)
  // ======================
  updateProfile: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = await getUser(req, res, usersRepository);

      const { phone, name, email, description, sector, website, adress, socialLinks } = req.body;

      // ✅ SAFE FILE EXTRACTION
      const coverFile = req.file;

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

      // ======================
      // FILE (ONLY IF EXIST)
      // ======================

      if (coverFile) {
        user.startupProfile.cover = `/uploads/images/${coverFile.filename}`;
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

      user.startupProfile.avatar = `/uploads/images/${file.filename}`;

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

      const [jobs, total] = await jobPostRepository.findAndCount({
        where: {
          startup: { id: user.startupProfile.id },
        },
        order: {
          createdAt: 'DESC',
        },
        take: limit,
        skip,
      });

      const totalPages = Math.ceil(total / limit);

      return res.render('pages/startup/manage-jobs', {
        csrfToken: req.csrfToken(),
        jobs,
        page,
        totalPages,
        user,
        startupProfile: user?.startupProfile || {},
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
      const coverFile = req.file;

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
        job.cover = `/uploads/images/${coverFile.filename}`;
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

      const files = req.files as {
        cover?: Express.Multer.File[];
      };

      const coverFile = files?.cover?.[0];

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
        languages: req.body.languages,

        roles: req.body.roles,
        offers: req.body.offers,
        knowledge: req.body.knowledge,
        softSkills: req.body.softSkills,
        tools: req.body.tools,
        preferredExperience: req.body.preferredExperience,

        status: action === 'publish' ? 'published' : 'draft',
      });

      if (coverFile) {
        job.cover = `/uploads/images/${coverFile.filename}`;
      }

      await jobPostRepository.save(job);
      if (action === 'draft') {
        return res.redirect(`/startup/jobs/${jobId}/edit`);
      }
      return res.redirect(`/startup/jobs/`);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Error updating job');
    }
  };
}

export default new StartupController();
