import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
@Entity('enterprises')
export class EnterpriseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  cpf: string | null;

  @Column({ type: 'varchar', unique: true, nullable: true })
  cnpj: string | null;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  /** Company profile: segment, how you work, etc. Max 2024 characters. */
  @Column({ type: 'varchar', length: 2024, nullable: true })
  description: string | null;

  @Column({ type: 'uuid', unique: true, nullable: true })
  phoneId: string | null;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'uuid' })
  ownerId: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  mainGoogleEmail: string | null;

  @Column({ type: 'varchar', nullable: true })
  googleRefreshToken: string | null;

  @Column({ type: 'varchar', nullable: true })
  googleAccessToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  tokenExpiresAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  timezone: string | null;

  /** Public URL segment used as /s/:shortPath/catalog etc.
   * Source of truth for uniqueness lives in main DB (url_shorteners). */
  @Column({ type: 'varchar', length: 40, nullable: true })
  shortPath: string | null;

  @Column({ type: 'boolean', default: false })
  needCpfInCatalog: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
