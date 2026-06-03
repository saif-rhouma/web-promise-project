import { FindOptionsWhere } from 'typeorm';
import AppDataSource from '../../database/data-source';
import { JobPost, JobStatus } from '../models/job-post.model';

import BaseRepository from './baseRepository';
import { getMonthExpression } from '../../helpers/getMonthExpression.helpers';

class JobPostRepository extends BaseRepository<JobPost> {
  constructor() {
    super(AppDataSource.getRepository(JobPost));
  }

  countJobs() {
    return this.repo.count();
  }

  countJobsWithStatus(status: JobStatus) {
    return this.repo.count({
      where: {
        status: status,
      },
    });
  }

  /**
   * Paginated find + count helper
   */
  async findAndCount({
    where,
    take = 10,
    skip = 0,
    order = { createdAt: 'DESC' },
    relations = [],
  }: {
    where?: FindOptionsWhere<JobPost> | FindOptionsWhere<JobPost>[];
    take?: number;
    skip?: number;
    order?: any;
    relations?: string[];
  } = {}) {
    return this.repo.findAndCount({
      where,
      take,
      skip,
      order,
      relations,
    });
  }
  async findJobsDetails(startupId, limit, skip) {
    return this.repo
      .createQueryBuilder('job')
      .leftJoin('job.startup', 'startup')
      .where('startup.id = :startupId', {
        startupId: startupId,
      })
      .loadRelationCountAndMap(
        'job.applicationsCount', // 👈 new virtual field
        'job.applications'
      )
      .orderBy('job.createdAt', 'DESC')
      .take(limit)
      .skip(skip)
      .getManyAndCount();
  }

  async getRandom(limit: number = 10): Promise<any[]> {
    const dbType = this.repo.manager.connection.options.type;

    const randomFn = dbType === 'mysql' || dbType === 'mariadb' ? 'RAND()' : 'RANDOM()';

    const result = await this.repo
      .createQueryBuilder('job')
      .leftJoin('job.startup', 'startup')
      .where('job.cover IS NOT NULL')
      .andWhere('job.status = :status', { status: JobStatus.PUBLISHED })
      .orderBy(randomFn)
      .limit(limit)
      .getRawMany();

    return result;
  }
  async jobsByMonth() {
    const monthExpr = getMonthExpression('job.createdAt');
    return this.repo
      .createQueryBuilder('job')
      .select(monthExpr, 'month')
      .addSelect('COUNT(*)', 'count')
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();
  }
}

export default new JobPostRepository();
