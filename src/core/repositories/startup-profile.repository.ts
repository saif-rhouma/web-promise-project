import AppDataSource from '../../database/data-source';
import { StartupProfile } from '../models/startup-profile.model';

import BaseRepository from './baseRepository';

class StartupProfileRepository extends BaseRepository<StartupProfile> {
  constructor() {
    super(AppDataSource.getRepository(StartupProfile));
  }
}

export default new StartupProfileRepository();
