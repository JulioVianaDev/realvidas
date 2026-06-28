
import { Module } from '@global-types/entities/file.entity-type';
import {
    File,
} from '@nest-lab/fastify-multer';
export interface StorageProviderInterface {
    saveFile(payload: { file: File, filename: string, module: Module }): Promise<string>;
    saveFileFromUrl(url: string, destinationPath: string): Promise<string>;
    deleteFile(filePath: string): Promise<boolean>;
    exists(filePath: string): Promise<boolean>;
}