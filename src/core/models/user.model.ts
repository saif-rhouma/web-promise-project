import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { StartupProfile } from './startup-profile.model';

export enum UserRole {
  ADMIN = 'ADMIN',
  STARTUP = 'STARTUP',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column({
    type: 'text',
    default: 'STARTUP',
  })
  role: UserRole;

  @OneToOne(() => StartupProfile, (profile) => profile.user, {
    cascade: true,
    eager: true,
  })
  startupProfile: StartupProfile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
}
