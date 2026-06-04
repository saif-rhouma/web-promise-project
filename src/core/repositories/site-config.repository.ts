import AppDataSource from '../../database/data-source';

import { SiteConfig } from '../models/site-config.model';
import BaseRepository from './baseRepository';

class SiteConfigRepository extends BaseRepository<SiteConfig> {
  constructor() {
    super(AppDataSource.getRepository(SiteConfig));
  }
  async getConfig() {
    let config = await this.repo.findOne({ where: {} });

    if (!config) {
      config = this.repo.create({
        settings: {
          maintenanceMode: false,
          registration: { enabled: true },
          verification: { required: true },
          socialLinks: {},
        },
      });

      await this.repo.save(config);
    }

    return config.settings;
  }

  async getConfigObject() {
    let config = await this.repo.findOne({ where: {} });

    if (!config) {
      config = this.repo.create({
        settings: {
          maintenanceMode: false,
          registration: { enabled: true },
          verification: { required: true },
          socialLinks: {},
        },
      });

      await this.repo.save(config);
    }

    return config;
  }
}

export default new SiteConfigRepository();
