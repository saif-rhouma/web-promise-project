import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('site_config')
export class SiteConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Main configuration blob
  @Column({ type: 'json' })
  settings: {
    maintenanceMode: boolean;

    registration: {
      enabled: boolean;
    };

    verification: {
      required: boolean;
    };

    socialLinks: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      youtube?: string;
      linkedIn?: string;
    };

    siteName?: string;
    logoUrl?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
