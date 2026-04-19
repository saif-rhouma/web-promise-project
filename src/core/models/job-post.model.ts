// entities/job-post.model.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Application } from './application.model';
import { StartupProfile } from './startup-profile.model';

export enum JobStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity()
export class JobPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ================= BASIC =================
  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ nullable: true })
  qualification: string;

  @Column({ nullable: true })
  gender: string;

  // @Column({ nullable: true })
  // address: string;

  // ================= JOB META =================
  @Column({ nullable: true })
  period: string;

  @Column({ nullable: true })
  remoteWork: string; // on-site | hybrid | remote

  // ================= RICH CONTENT =================
  @Column({ type: 'json', nullable: true })
  roles: string;

  @Column({ type: 'json', nullable: true })
  offers: string;

  @Column({ type: 'json', nullable: true })
  knowledge: string;

  @Column({ type: 'json', nullable: true })
  softSkills: string;

  @Column({ type: 'json', nullable: true })
  tools: string;

  @Column({ type: 'json', nullable: true })
  preferredExperience: string;

  @Column({ type: 'simple-array', nullable: true })
  languages: string[];

  @Column({ nullable: true })
  cover: string;

  // ================= STATUS =================
  @Column({ type: 'text', default: JobStatus.DRAFT })
  status: JobStatus;

  // ================= RELATION =================
  @ManyToOne(() => StartupProfile, (startup) => startup.jobPosts, {
    onDelete: 'CASCADE',
  })
  startup: StartupProfile;

  @OneToMany(() => Application, (app) => app.jobPost)
  applications: Application[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
