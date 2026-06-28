import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { EnterpriseRole } from '../../main/entities/enums';

@Entity('enterprise_members')
@Unique(['enterpriseId', 'userId'])
export class EnterpriseMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  enterpriseId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'enum', enum: EnterpriseRole, default: EnterpriseRole.EMPLOYEE })
  role: EnterpriseRole;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne('EnterpriseEntity', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'enterpriseId' })
  enterprise: any;
}
