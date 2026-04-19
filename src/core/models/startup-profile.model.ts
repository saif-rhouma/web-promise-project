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
  email: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  sector: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  adress: string;

  // ✅ SOCIAL LINKS
  @Column({ type: 'json', nullable: true })
  socialLinks: {
    facebook?: string;
    linkedin?: string;
    youtube?: string;
  };

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  cover: string;

  @OneToOne(() => User, (user) => user.startupProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => JobPost, (job) => job.startup)
  jobPosts: JobPost[];
}
