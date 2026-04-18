// entities/JobPost.ts
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

@Entity()
export class JobPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  imageUrl: string;

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
