import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

import { StartupProfile } from './startup-profile.model';

export enum ContactStatus {
  PENDING = 'PENDING',
  READ = 'READ',
  REPLIED = 'REPLIED',
  ARCHIVED = 'ARCHIVED',
}

@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // =========================
  // SENDER STARTUP
  // =========================
  @ManyToOne(() => StartupProfile, {
    onDelete: 'CASCADE',
  })
  sender: StartupProfile;

  // =========================
  // RECEIVER STARTUP
  // =========================
  @ManyToOne(() => StartupProfile, {
    onDelete: 'CASCADE',
  })
  receiver: StartupProfile;

  // =========================
  // CONTACT CONTENT
  // =========================
  @Column()
  subject: string;

  @Column('text')
  message: string;

  // =========================
  // OPTIONAL CONTACT INFO
  // =========================
  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  // =========================
  // STATUS
  // =========================
  @Column({
    type: 'text',
    default: ContactStatus.PENDING,
  })
  status: ContactStatus;

  // =========================
  // READ TRACKING
  // =========================
  @Column({
    default: false,
  })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
