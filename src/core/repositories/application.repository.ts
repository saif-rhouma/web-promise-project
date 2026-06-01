import { getMonthExpression } from '../../helpers/getMonthExpression.helpers';
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

  applicationsByMonth() {
    const monthExpr = getMonthExpression('application.appliedAt');
    return this.repo
      .createQueryBuilder('application')
      .select(monthExpr, 'month')
      .addSelect('COUNT(*)', 'count')
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();
  }
}

export default new ApplicationRepository();
