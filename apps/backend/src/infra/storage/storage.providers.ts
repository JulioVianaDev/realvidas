import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { STORAGE_TOKENS } from './tokens/storage-tokens';
import { StorageProviderInterface } from '../../modules/file/providers/storage-provider-interface';
import { LocalStorageProvider } from '../../modules/file/providers/local-storage.provider';

/**
 * Storage provider factory
 * Returns the appropriate storage provider based on STORAGE_TYPE environment variable
 */
export const storageProviderFactory = (
  configService: ConfigService,
): StorageProviderInterface => {
  const storageType = configService.get<string>('STORAGE_TYPE', 'local').toLowerCase();

  switch (storageType) {
    case 'local':
      return new LocalStorageProvider(configService);
    // Add more storage types here in the future (e.g., 's3', 'gcs', etc.)
    // case 's3':
    //   return new S3StorageProvider(configService);
    default:
      return new LocalStorageProvider(configService);
  }
};

/**
 * Storage provider configuration
 */
export const storageProvider: Provider = {
  provide: STORAGE_TOKENS.STORAGE_PROVIDER,
  useFactory: storageProviderFactory,
  inject: [ConfigService],
};

/**
 * All storage-related providers
 */
export const storageProviders: Provider[] = [
  LocalStorageProvider,
  storageProvider,
];

