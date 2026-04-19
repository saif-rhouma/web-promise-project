import AppDataSource from '../../database/data-source';
import { Application } from '../models/application.model';

import BaseRepository from './baseRepository';

class ApplicationRepository extends BaseRepository<Application> {
  constructor() {
    super(AppDataSource.getRepository(Application));
  }
}

export default new ApplicationRepository();
