import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

/**
 * Links a user to a profile (many-to-many). A user can hold several profiles
 * and a profile can be assigned to several users. Lives in the tenant database.
 */
@Entity('pivot_user_profiles')
@Unique(['userId', 'profileId'])
export class UserProfilePivotEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  profileId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne('ProfileEntity', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profileId' })
  profile: any;
}
