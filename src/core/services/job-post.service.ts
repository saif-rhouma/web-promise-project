import { JobStatus } from '../models/job-post.model';
import jobPostRepository from '../repositories/job-post.repository';
class JobPostService {
  private readonly jobPostRepository = jobPostRepository;

  count(status: JobStatus | null) {
    if (status) {
      return this.jobPostRepository.countJobsWithStatus(status);
    } else {
      return this.jobPostRepository.countJobs();
    }
  }
}

export default new JobPostService();
