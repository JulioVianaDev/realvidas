import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { EntityManager, ILike } from 'typeorm';
import {
  IFileEntity,
  Module,
} from '@global-types/entities/file.entity-type';
import { FileRepositoryContract } from 'src/modules/file/repositories/file.repository.contract';
import { BaseTypeOrmRepository } from '../base.typeorm.repository';
import { FileEntity } from '../../entities/file.entity';
import { TENANT_CONNECTION } from '../../tenant.module';

/**
 * Tenant-scoped TypeORM implementation of FileRepositoryContract.
 * Files belong to the tenant schema (see AGENTS.md multitenancy rule).
 */
@Injectable()
export class FileTypeOrmRepository
  extends BaseTypeOrmRepository
  implements FileRepositoryContract
{
  constructor(
    @Inject(TENANT_CONNECTION)
    entityManager: EntityManager | null,
  ) {
    super(entityManager);
  }

  private get fileRepo() {
    return this.getManager().getRepository(FileEntity);
  }

  private buildMetadata(total: number, page: number, pageSize: number) {
    return {
      page,
      total,
      hasNextPage: total > page * pageSize,
      hasPreviousPage: page > 1,
      lastPage: Math.ceil(total / pageSize) || 1,
    };
  }

  async getFiles(params: {
    search?: string;
    module?: Module;
    page?: number;
    pageSize?: number;
    userId?: string;
  }): Promise<{
    data: IFileEntity[];
    metadata: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      lastPage: number;
      total: number;
      page: number;
    };
  }> {
    const { search, module, userId, page = 1, pageSize = 10 } = params;

    const where: Record<string, unknown> = {};
    if (module) where.module = module;
    if (userId !== undefined) where.userId = userId;
    if (search) where.originalName = ILike(`%${search}%`);

    const [data, total] = await this.fileRepo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return {
      data: data as unknown as IFileEntity[],
      metadata: this.buildMetadata(total, page, pageSize),
    };
  }

  async getFileById(id: string): Promise<IFileEntity> {
    const file = await this.fileRepo.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException(`File ${id} not found`);
    }
    return file as unknown as IFileEntity;
  }

  async getFilesByModule(
    module: Module,
    params?: {
      page?: number;
      pageSize?: number;
      userId?: string;
    },
  ): Promise<{
    data: IFileEntity[];
    metadata: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      lastPage: number;
      total: number;
      page: number;
    };
  }> {
    const { userId, page = 1, pageSize = 10 } = params ?? {};

    const where: Record<string, unknown> = { module };
    if (userId !== undefined) where.userId = userId;

    const [data, total] = await this.fileRepo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return {
      data: data as unknown as IFileEntity[],
      metadata: this.buildMetadata(total, page, pageSize),
    };
  }

  async insertFile(
    file: Omit<IFileEntity, 'id' | 'createdAt'>,
  ): Promise<IFileEntity> {
    const entity = this.fileRepo.create(
      file as unknown as Partial<FileEntity>,
    );
    return this.fileRepo.save(entity) as unknown as Promise<IFileEntity>;
  }

  async updateFile(
    id: string,
    data: Partial<IFileEntity>,
  ): Promise<IFileEntity> {
    await this.fileRepo.update(
      id,
      data as unknown as Partial<FileEntity>,
    );
    return this.getFileById(id);
  }

  async deleteFile(id: string): Promise<{ success: boolean; id: string }> {
    await this.fileRepo.softDelete(id);
    return { success: true, id };
  }

  async getFileByHash(hash: string): Promise<IFileEntity | null> {
    const file = await this.fileRepo.findOne({ where: { hash } });
    return (file as unknown as IFileEntity) ?? null;
  }
}
