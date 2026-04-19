import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import AppDataSource from '../../database/data-source';
import { JobPost } from '../models/job-post.model';

import BaseRepository from './baseRepository';

class JobPostRepository extends BaseRepository<JobPost> {
  constructor() {
    super(AppDataSource.getRepository(JobPost));
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
    } as FindManyOptions<JobPost>);
  }
}

export default new JobPostRepository();
