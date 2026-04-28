import path from 'path';
import fs from 'fs';
import AsyncRouteHandler from 'src/types/AsyncRouteHandler';
import startupProfileRepository from '../repositories/startup-profile.repository';
import usersRepository from '../repositories/user.repository';
import jobPostRepository from '../repositories/job-post.repository';
import applicationRepository from '../repositories/application.repository';
// import HTTP_CODE from '../constants/httpCode';
import { Application } from '../models/application.model';
import { sendContactEmail } from '../../utils/mailer';
import { ProfileType } from '../models/user.model';

class PublicController {
  home: AsyncRouteHandler = async (_req, res) => {
    const randomProfiles = await startupProfileRepository.getRandomAvatarsOnly(10);
    res.render('home', { randomProfiles });
  };

  contactPage: AsyncRouteHandler = async (req, res) => {
    res.render('contact', {
      query: req.query,
    });
  };

  listStartups: AsyncRouteHandler = async (_req, res) => {
    const users = await usersRepository.findAll({
      relations: ['startupProfile'],
      where: {
        type: ProfileType.STARTUP,
      },
    });
    const startups = users.map((u) => u.startupProfile).filter(Boolean);
    res.render('startups', { startups, page: 'startups' });
  };

  listEnterprise: AsyncRouteHandler = async (_req, res) => {
    const users = await usersRepository.findAll({
      relations: ['startupProfile'],
      where: {
        type: ProfileType.ENTERPRISE,
      },
    });
    const startups = users.map((u) => u.startupProfile).filter(Boolean);
    res.render('startups', { startups });
  };

  getStartupDetails: AsyncRouteHandler = async (req, res) => {
    const startupId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const startup = await startupProfileRepository.findOne({
      where: { id: startupId },
      relations: ['jobPosts'],
    });
    res.render('startup-detail', { startup });
  };

  getJobDetails: AsyncRouteHandler = async (req, res) => {
    const jobId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const job = await jobPostRepository.findOne({
      where: { id: jobId },
      relations: ['startup'],
    });

    if (!job) return res.status(404).send('Job not found');
    res.render('job-detail', { csrfToken: req.csrfToken(), job });
  };

  applyToJob: AsyncRouteHandler = async (req, res) => {
    try {
      const { jobId } = req.params;

      const { fullName, email, phone, message } = req.body;

      const cvUrl = req.file || null;
      if (!cvUrl) {
        return res.redirect(`/jobs/${jobId}`);
      }

      const application = new Application();
      application.fullName = fullName;
      application.email = email;
      application.message = message;
      application.phone = phone;

      application.cvUrl = cvUrl.filename;
      application.status = 'PENDING' as any;

      application.jobPost = { id: jobId } as any;

      await applicationRepository.save(application);

      return res.redirect(`/success/${jobId}`);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Error submitting application');
    }
  };

  applySuccess: AsyncRouteHandler = async (req, res) => {
    const jobId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const job = await jobPostRepository.findOne({
      where: { id: jobId },
      relations: ['startup'],
    });

    if (!job) return res.render('error-404');
    res.render('success', { job });
  };

  sendContactMessage: AsyncRouteHandler = async (req, res) => {
    try {
      const { username, email, phone, subject, message } = req.body;

      await sendContactEmail({
        username,
        email,
        phone,
        subject,
        message,
      });

      return res.redirect('/contact?success=true');
    } catch (err) {
      console.error('Contact error:', err);
      return res.redirect('/contact?error=true');
    }
  };

  downloadJob: AsyncRouteHandler = async (req, res) => {
    try {
      const jobId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const job = await jobPostRepository.findOne({
        where: { id: jobId },
        relations: ['startup'],
      });

      if (!job) return res.status(404).send('Job not found');

      const filePath = path.join(process.cwd(), '/src/uploads/jobs/', `${jobId}.pdf` as string);

      const stat = fs.statSync(filePath);
      res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Length': stat.size,
        'Content-Disposition': `attachment; filename="${`${job.title?.toLocaleLowerCase()}.pdf`}"`,
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
}

export default new PublicController();
