import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { EnterpriseRole, InvitationStatus } from '../../main/entities/enums';

@Entity('enterprise_invitations')
@Unique(['enterpriseId', 'email'])
export class EnterpriseInvitationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  enterpriseId: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'enum', enum: EnterpriseRole, default: EnterpriseRole.EMPLOYEE })
  role: EnterpriseRole;

  @Column({ type: 'varchar', unique: true })
  token: string;

  @Column({ type: 'enum', enum: InvitationStatus, default: InvitationStatus.PENDING })
  status: InvitationStatus;

  @Column({ type: 'uuid' })
  invitedById: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne('EnterpriseEntity', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'enterpriseId' })
  enterprise: any;

  // invitedById references users in the main DB — no TypeORM relation here
  // because UserEntity is not part of the tenant DataSource.
}
