import { Global, Module } from '@nestjs/common';
import { FileService } from './services/file.service';
import { FileController } from './controllers/file.controller';
import { StorageServiceProvider } from './services/storage.service';

@Global()
@Module({
  imports: [],
  controllers: [FileController],
  providers: [StorageServiceProvider, FileService],
  exports: [FileService],
})
export class FileModule {}
