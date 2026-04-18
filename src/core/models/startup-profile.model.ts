import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.model';
import { JobPost } from './job-post.model';

@Entity()
export class StartupProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  sector: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  coverUrl: string;

  @OneToOne(() => User, (user) => user.startupProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => JobPost, (job) => job.startup)
  jobPosts: JobPost[];
}
