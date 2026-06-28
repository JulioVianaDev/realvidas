import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { StorageProviderInterface } from './storage-provider-interface';
import { File } from '@nest-lab/fastify-multer';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid4 } from 'uuid';
import { Module } from '@global-types/entities/file.entity-type';

const streamPipeline = promisify(pipeline);

/**
 * Check if a file exists at a given path.
 */
export const checkIfFileOrDirectoryExists = (path: string): boolean => {
    return fs.existsSync(path);
};

/**
 * Check if a file have size.
 */
export const getFileSizeIfExists = (path: string): number | null => {
    if (fs.existsSync(path)) {
        const stats = fs.statSync(path);
        return stats.size;
    }
    return 0;
};

/**
 * Check if a directory exists at a given path.
 */
export const checkDirectoryExistsOrCreate = (path: string) => {
    if (!checkIfFileOrDirectoryExists(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
};

@Injectable()
export class LocalStorageProvider implements StorageProviderInterface {
    private readonly uploadsDir: string;
    private readonly baseUrl: string;

    constructor(private readonly configService: ConfigService) {
        const rootPath = String(configService.get('rootPath'));
        const folderBase = String(
            configService.get('upload.folderBase'),
        ).replace(/^[/\\]+/, '');
        this.uploadsDir = path.join(rootPath, folderBase);
        this.baseUrl = String(
            this.configService.get('baseUrl') ?? '',
        ).replace(/\/+$/, '');
        this.ensureDirectoryExists(this.uploadsDir);
    }

    private ensureDirectoryExists(dirPath: string): void {
        checkDirectoryExistsOrCreate(dirPath);
    }

    /** Path under {@link this.uploadsDir} that static serving maps to `/…/uploads/`. */
    private getUploadsUrlPathPrefix(): string {
        try {
            const apiPath = new URL(this.baseUrl).pathname.replace(
                /\/+$/,
                '',
            );
            return `${apiPath}/uploads/`.replace(/\/+/g, '/');
        } catch {
            return '/uploads/';
        }
    }

    getAbsolutePathFromUrl(url: string): string {
        const pathname = new URL(url).pathname.replace(/\/+/g, '/');
        const prefix = this.getUploadsUrlPathPrefix();
        if (pathname.startsWith(prefix)) {
            const relative = pathname.slice(prefix.length);
            return path.join(
                this.uploadsDir,
                ...relative.split('/').filter(Boolean),
            );
        }
        /** Old bug: `/v1//apps/uploads/...` from concatenating `folderBase` into URLs */
        try {
            const apiPath = new URL(this.baseUrl).pathname.replace(
                /\/+$/,
                '',
            );
            const legacy = `${apiPath}/apps/uploads/`.replace(/\/+/g, '/');
            if (pathname.startsWith(legacy)) {
                const relative = pathname.slice(legacy.length);
                return path.join(
                    this.uploadsDir,
                    ...relative.split('/').filter(Boolean),
                );
            }
        } catch {
            /* ignore */
        }
        return url.replace(this.baseUrl, this.uploadsDir);
    }

    getUrlFromAbsolutePath(absolutePath: string): string {
        const resolvedRoot = path.resolve(this.uploadsDir);
        const resolvedFile = path.resolve(absolutePath);
        let relative = path.relative(resolvedRoot, resolvedFile);
        if (relative.startsWith('..') || path.isAbsolute(relative)) {
            throw new Error(
                `File path is outside uploads directory: ${absolutePath}`,
            );
        }
        const relPosix = relative.split(path.sep).join('/');
        return `${this.baseUrl}/uploads/${relPosix}`;
    }

    /**
     * Saves a file from multer to the local disk
     * Handles both disk storage (file.path) and memory storage (file.buffer) scenarios
     * @returns The URL path to the saved file
     */
    async saveFile({ file, filename, module }: { file: File, filename: string, module: Module }): Promise<string> {
        const fullFolderPath = `${this.uploadsDir}/${module}`;
        this.ensureDirectoryExists(fullFolderPath);
        const fullDestPath = `${fullFolderPath}/${filename}`;
        if (file.buffer) {
            await fs.promises.writeFile(fullDestPath, file.buffer);
            return this.getUrlFromAbsolutePath(fullDestPath);
        } else if (file.path) {
            return new Promise((resolve, reject) => {
                const readStream = fs.createReadStream(file.path);
                const writeStream = fs.createWriteStream(fullDestPath);

                readStream.on('error', reject);
                writeStream.on('error', reject);
                writeStream.on('finish', () => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                    resolve(this.getUrlFromAbsolutePath(fullDestPath));
                });

                readStream.pipe(writeStream);
            });
        } else {
            throw new Error('File has neither buffer nor path property');
        }
    }

    /**
     * Downloads a file from a URL and saves it to local disk
     * @param url - The URL to download from
     * @param destinationPath - The relative path where the file should be saved (e.g., "module/filename.ext")
     * @returns The URL path to the saved file
     */
    async saveFileFromUrl(url: string, destinationPath: string): Promise<string> {
        const fullDestPath = destinationPath.startsWith(this.uploadsDir)
            ? destinationPath
            : `${this.uploadsDir}/${destinationPath}`;

        // Ensure the directory exists
        const dirPath = path.dirname(fullDestPath);
        this.ensureDirectoryExists(dirPath);

        // Handle internal URLs - just copy the file
        if (url.includes(this.baseUrl)) {
            const sourcePath = this.getAbsolutePathFromUrl(url);
            await fs.promises.copyFile(sourcePath, fullDestPath);
            return this.getUrlFromAbsolutePath(fullDestPath);
        }

        // Handle external URLs - download the file
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Download failed: ${response.statusText}`);
        }

        await streamPipeline(response.body, fs.createWriteStream(fullDestPath));
        return this.getUrlFromAbsolutePath(fullDestPath);
    }

    /**
     * Saves a buffer to local disk
     * @returns The URL path to the saved file
     */
    async saveFileFromBuffer(buffer: Buffer, extension: string, module: Module, userId?: number): Promise<string> {
        const targetPath = this.configService.get(`upload.folders.${module}.path`);
        const fullFolderPath = `${this.uploadsDir}/${targetPath}`;
        this.ensureDirectoryExists(fullFolderPath);

        const filename = `${uuid4()}.${extension.toLowerCase()}`;
        const fullDestPath = `${fullFolderPath}/${filename}`;

        await fs.promises.writeFile(fullDestPath, buffer);
        return this.getUrlFromAbsolutePath(fullDestPath);
    }

    /**
     * Deletes a file from local disk
     */
    async deleteFile(filePath: string): Promise<boolean> {
        const fullPath = filePath.startsWith(this.uploadsDir)
            ? filePath
            : `${this.uploadsDir}/${filePath}`;

        if (fs.existsSync(fullPath)) {
            await fs.promises.unlink(fullPath);
            return true;
        }

        return false;
    }

    /**
     * Checks if a file exists
     */
    async exists(filePath: string): Promise<boolean> {
        const fullPath = filePath.startsWith(this.uploadsDir)
            ? filePath
            : `${this.uploadsDir}/${filePath}`;
        return fs.existsSync(fullPath);
    }

    /**
     * Gets the extension from a URL
     */
    private getExtensionFromUrl(url: string): string {
        try {
            const parsedUrl = new URL(url);
            const pathname = parsedUrl.pathname;
            const extension = path.extname(pathname).substring(1);
            return extension || 'unknown';
        } catch (error) {
            // If URL parsing fails, try to extract extension directly
            const match = url.match(/\.([a-zA-Z0-9]+)(\?.*)?$/);
            return match ? match[1] : 'unknown';
        }
    }
}