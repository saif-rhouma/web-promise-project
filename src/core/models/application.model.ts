import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { JobPost } from './job-post.model';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  cvUrl: string;

  @Column({
    type: 'text',
    default: 'PENDING',
  })
  status: ApplicationStatus;

  @ManyToOne(() => JobPost, (job) => job.applications, {
    onDelete: 'CASCADE',
  })
  jobPost: JobPost;

  @CreateDateColumn()
  appliedAt: Date;
}
