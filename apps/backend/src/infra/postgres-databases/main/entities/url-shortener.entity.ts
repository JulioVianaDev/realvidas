import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('url_shorteners')
export class UrlShortenerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_url_shorteners_path', { unique: true, where: '"deletedAt" IS NULL' })
  @Column({ type: 'varchar', length: 40 })
  path: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  enterpriseId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
