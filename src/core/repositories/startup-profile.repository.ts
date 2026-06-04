import AppDataSource from '../../database/data-source';
import { JobStatus } from '../models/job-post.model';
import { StartupProfile } from '../models/startup-profile.model';

import BaseRepository from './baseRepository';

class StartupProfileRepository extends BaseRepository<StartupProfile> {
  constructor() {
    super(AppDataSource.getRepository(StartupProfile));
  }

  async getRandomAvatarsOnly(limit: number = 10): Promise<any[]> {
    const dbType = this.repo.manager.connection.options.type;

    const randomFn = dbType === 'mysql' || dbType === 'mariadb' ? 'RAND()' : 'RANDOM()';

    const result = await this.repo
      .createQueryBuilder('startup')
      .select(['startup.id', 'startup.name', 'startup.avatar'])
      .where('startup.avatar IS NOT NULL')
      .orderBy(randomFn)
      .limit(limit)
      .getRawMany();

    return result.map((r) => ({
      id: r.startup_id,
      name: r.startup_name,
      avatar: r.startup_avatar,
    }));
  }

  async getStartupsDetails(startupId: string) {
    const result = await this.repo
      .createQueryBuilder('startup')
      .leftJoinAndSelect('startup.jobPosts', 'jobPost', 'jobPost.status = :status', { status: JobStatus.PUBLISHED })
      .where('startup.id = :id', { id: startupId })
      .getOne();
    return result;
  }
}

export default new StartupProfileRepository();
