import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { UserEntity } from '../user.entity';
import type { TenantEntity } from '../tenant.entity';
import { UserTenantRole } from '../enums';

/** Pivot: pivot_relation_user_tenant. User <-> Tenant with role. */
@Entity('pivot_relation_user_tenant')
export class UserTenantPivotEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'enum', enum: UserTenantRole, default: UserTenantRole.MEMBER })
  role: UserTenantRole;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne('UserEntity', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne('TenantEntity', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: TenantEntity;
}
