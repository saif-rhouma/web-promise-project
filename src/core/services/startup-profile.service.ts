import startupProfileRepository from '../repositories/startup-profile.repository';

class StartupProfileService {
  private readonly startupProfileRepository = startupProfileRepository;

  getStartupsDetails(startupId: string) {
    return this.startupProfileRepository.getStartupsDetails(startupId);
  }
}

export default new StartupProfileService();
