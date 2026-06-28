import { Inject, Injectable } from '@nestjs/common';
import { StorageProviderInterface } from '../providers/storage-provider-interface';
import { File } from '@nest-lab/fastify-multer';
import { Module } from '@global-types/entities/file.entity-type';
import { STORAGE_TOKENS } from 'src/infra/storage';

@Injectable()
export class StorageServiceProvider
  implements StorageProviderInterface
{
  constructor(
    @Inject(STORAGE_TOKENS.STORAGE_PROVIDER)
    private readonly storageProvider: StorageProviderInterface,
  ) {}

  async saveFile(payload: {
    file: File;
    filename: string;
    module: Module;
  }): Promise<string> {
    return this.storageProvider.saveFile(payload);
  }

  async saveFileFromUrl(
    url: string,
    destinationPath: string,
  ): Promise<string> {
    return this.storageProvider.saveFileFromUrl(
      url,
      destinationPath,
    );
  }

  async deleteFile(filePath: string): Promise<boolean> {
    return this.storageProvider.deleteFile(filePath);
  }

  async exists(filePath: string): Promise<boolean> {
    return this.storageProvider.exists(filePath);
  }
}
