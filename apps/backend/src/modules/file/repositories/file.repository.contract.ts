import { IFileEntity } from '@global-types/entities/file.entity-type';

import { Module } from '@global-types/entities/file.entity-type';

export abstract class FileRepositoryContract {
  abstract getFiles(params: {
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
  }>;

  abstract getFileById(id: string): Promise<IFileEntity>;

  abstract getFilesByModule(
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
  }>;

  abstract insertFile(
    file: Omit<IFileEntity, 'id' | 'createdAt'>,
  ): Promise<IFileEntity>;

  abstract updateFile(
    id: string,
    data: Partial<IFileEntity>,
  ): Promise<IFileEntity>;

  abstract deleteFile(
    id: string,
  ): Promise<{ success: boolean; id: string }>;

  abstract getFileByHash(
    hash: string,
  ): Promise<IFileEntity | null>;
}
