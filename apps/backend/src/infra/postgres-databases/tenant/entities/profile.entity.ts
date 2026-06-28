import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { AppModule } from '@global-types/entities/profile.entity-type';

/**
 * A reusable, named permission role (e.g. "Secretário") stored in the tenant
 * database. `modules` holds UPPERCASE module keys; when `permitAll` is true the
 * role can see every module. Users are linked to profiles via
 * `pivot_user_profiles` (see UserProfilePivotEntity).
 */
@Entity('profiles')
export class ProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', array: true, default: '{}' })
  modules: AppModule[];

  @Column({ type: 'boolean', default: false })
  permitAll: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
