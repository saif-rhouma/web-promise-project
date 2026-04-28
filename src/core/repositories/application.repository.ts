import AppDataSource from '../../database/data-source';
import { Application } from '../models/application.model';

import BaseRepository from './baseRepository';

class ApplicationRepository extends BaseRepository<Application> {
  constructor() {
    super(AppDataSource.getRepository(Application));
  }

  findByStartup(startupId: string) {
    return this.repo.find({
      where: {
        jobPost: {
          startup: {
            id: startupId,
          },
        },
      },
      relations: ['jobPost'],
      order: {
        appliedAt: 'DESC',
      },
    });
  }

  findByJob(jobId: string) {
    return this.repo.find({
      where: {
        jobPost: {
          id: jobId,
        },
      },
      relations: ['jobPost'],
      order: {
        appliedAt: 'DESC',
      },
    });
  }
}

export default new ApplicationRepository();
