import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { Role } from './enums';
import type { TenantEntity } from './tenant.entity';

/** User - main DB (public schema). Global user accounts. Relation to trials and tenants via pivots. */
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  cpf: string | null;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ type: 'int', nullable: true })
  age: number | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  language: string | null;

  /** light | dark | system — used for transactional emails (system → light). */
  @Column({ type: 'varchar', length: 16, nullable: true })
  theme: string | null;

  @Column({
    type: 'boolean',
    name: 'email_confirmed',
    default: false,
  })
  emailConfirmed: boolean;

  @Column({ type: 'uuid', nullable: true })
  currentTenantViewId: string | null;

  @Column({
    type: 'boolean',
    name: 'register_completed',
    default: false,
  })
  registerCompleted: boolean;

  /** Pending email verification: { code, expiresAt } — cleared after confirm. */
  @Column({ type: 'jsonb', name: 'auth_codes', nullable: true })
  authCodes: { code: string; expiresAt: string } | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ManyToOne('TenantEntity', { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'currentTenantViewId' })
  currentTenantView: TenantEntity | null;

  @ManyToMany('TenantEntity', 'users')
  @JoinTable({
    name: 'pivot_relation_user_tenant',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'tenantId',
      referencedColumnName: 'id',
    },
  })
  tenants: TenantEntity[];
}
