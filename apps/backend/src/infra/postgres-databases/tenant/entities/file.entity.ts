import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { Module } from '@global-types/entities/file.entity-type';

/**
 * File - tenant DB. Uploaded/received files are tenant-scoped: every tenant
 * customizes its own catalog, chat and assistant assets, so file metadata must
 * live in the tenant schema (see AGENTS.md multitenancy rule), never in main.
 * Mirrors IFileEntity from @global-types/entities/file.entity-type.
 */
@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Random UUID used as the on-disk filename (`<hash>.<extension>`). Looked up by getFileByHash. */
  @Index()
  @Column({ type: 'varchar' })
  hash: string;

  @Column({ type: 'varchar' })
  extension: string;

  @Column({ type: 'varchar' })
  originalName: string;

  /** Owning module: user | enterprise | answers | chat | assistant | product | combo | catalog | campaign. */
  @Column({ type: 'varchar' })
  module: Module;

  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ type: 'boolean', default: false })
  isReceived: boolean;

  @Column({ type: 'bigint', default: 0 })
  fileSize: number;

  @Column({ type: 'varchar' })
  type: 'image' | 'document' | 'video' | 'audio';

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
