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

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STARTUP,
  })
  role: UserRole;

  @OneToOne(() => StartupProfile, (profile) => profile.user)
  startupProfile: StartupProfile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
