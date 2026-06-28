import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { randomUUID } from 'crypto';
import * as mime from 'mime-types';
import { FileRepositoryContract } from '../repositories/file.repository.contract';
import {
  IFileEntity,
  Module,
} from '@global-types/entities/file.entity-type';
import { File } from '@nest-lab/fastify-multer';
import { StorageServiceProvider } from './storage.service';
import { IPostSaveFileResponse } from '@global-types/responses/file.response';
import { REPOSITORY_TOKENS_TENANT } from 'src/infra';

@Injectable()
export class FileService {
  constructor(
    private configService: ConfigService,
    private storageService: StorageServiceProvider,
    @Inject(REPOSITORY_TOKENS_TENANT.FILE_REPOSITORY)
    private fileRepository: FileRepositoryContract,
  ) {}

  private getFileType(
    extension: string,
  ): 'image' | 'document' | 'video' | 'audio' {
    const mimeType = mime.lookup(`.${extension}`);

    if (!mimeType) return 'document';

    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';

    return 'document';
  }

  async saveFile({
    file,
    module,
    userId,
  }: {
    file: File;
    module: Module;
    userId?: string;
  }): Promise<IPostSaveFileResponse> {
    const hash = randomUUID();

    const extension = path.extname(file.originalname).substring(1);
    const fileName = `${hash}.${extension}`;
    await this.storageService.saveFile({
      file,
      module,
      filename: fileName,
    });

    const fileEntity: Omit<IFileEntity, 'id' | 'createdAt'> = {
      hash,
      extension,
      originalName: file.originalname,
      module,
      userId,
      isReceived: true,
      fileSize: file.size,
      type: this.getFileType(extension),
      deletedAt: null,
    };
    const entity = await this.fileRepository.insertFile(fileEntity);
    return {
      entity,
      url: this.getFileUrl(entity),
    };
  }

  async saveFileByUrl({
    url,
    module,
    userId,
    originalName = '',
  }: {
    url: string;
    module: Module;
    userId: string;
    originalName?: string;
  }): Promise<IFileEntity> {
    const extension = path.extname(url).substring(1) || 'unknown';
    const hash = randomUUID();

    const fileName = `${hash}.${extension}`;
    const modulePath = path.join(module, fileName);

    await this.storageService.saveFileFromUrl(url, modulePath);

    const fileSize = 0;
    const finalOriginalName = originalName || path.basename(url);

    const fileEntity: Omit<IFileEntity, 'id' | 'createdAt'> = {
      hash,
      extension,
      originalName: finalOriginalName,
      module,
      userId,
      isReceived: true,
      fileSize,
      type: this.getFileType(extension),
      deletedAt: null,
    };

    return this.fileRepository.insertFile(fileEntity);
  }

  async deleteFile(
    id: string,
  ): Promise<{ success: boolean; id: string }> {
    const file = await this.fileRepository.getFileById(id);

    const filePath = path.join(
      file.module,
      `${file.hash}.${file.extension}`,
    );

    await this.storageService.deleteFile(filePath);

    return this.fileRepository.deleteFile(id);
  }

  async getFileById(id: string): Promise<IFileEntity> {
    return this.fileRepository.getFileById(id);
  }

  async getFiles(params: {
    search?: string;
    module?: Module;
    page?: number;
    pageSize?: number;
    userId?: string;
  }) {
    return this.fileRepository.getFiles(params);
  }

  async getFilesByModule(
    module: Module,
    params?: {
      page?: number;
      pageSize?: number;
      userId?: string;
    },
  ) {
    return this.fileRepository.getFilesByModule(module, params);
  }
  /**
   * Public URL must match the Fastify static prefix `/v1/uploads/` in main.ts,
   * not the on-disk `upload.folderBase` (e.g. `/apps/uploads`), which would
   * produce broken URLs like `/v1//apps/uploads/...`.
   */
  private getFileUrl(entity: IFileEntity): string {
    const base = (
      this.configService.get<string>('baseUrl') ?? ''
    ).replace(/\/+$/, '');
    return `${base}/uploads/${entity.module}/${entity.hash}.${entity.extension}`;
  }
}
