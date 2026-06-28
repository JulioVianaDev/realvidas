import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { storageProviders } from './storage.providers';
import { STORAGE_TOKENS } from './tokens/storage-tokens';

/**
 * Global Storage Module
 * 
 * Provides storage providers for the entire application based on STORAGE_TYPE environment variable.
 * 
 * Usage in services:
 * @example
 * ```typescript
 * import { STORAGE_TOKENS } from '@infra/storage/tokens/storage-tokens';
 * 
 * @Injectable()
 * export class StorageService {
 *   constructor(
 *     @Inject(STORAGE_TOKENS.STORAGE_PROVIDER)
 *     private readonly storageProvider: StorageProviderInterface,
 *   ) {}
 * }
 * ```
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [...storageProviders],
  exports: [STORAGE_TOKENS.STORAGE_PROVIDER, ...Object.values(STORAGE_TOKENS)],
})
export class StorageModule {}

