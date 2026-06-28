import { Controller, Post, Get, Delete, Param, Query, Body, UploadedFile, UseInterceptors, ParseIntPipe } from '@nestjs/common';
import { FileService } from '../services/file.service';
import { Module } from '@global-types/entities/file.entity-type';
import { File, FileInterceptor, } from '@nest-lab/fastify-multer';

@Controller({
    path: 'files',
    version: '1'
})
export class FileController {
    constructor(private readonly fileService: FileService) { }

    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: File,
        @Body('module') module: Module,
    ) {
        return this.fileService.saveFile({ file, module, });
    }

    @Post('url')
    async uploadFileByUrl(
        @Body() body: { url: string; module: Module; userId: string; originalName?: string }
    ) {
        return this.fileService.saveFileByUrl(body);
    }

    @Delete(':id')
    async deleteFile(@Param('id') id: string) {
        return this.fileService.deleteFile(id);
    }

    @Get(':id')
    async getFile(@Param('id') id: string) {
        return this.fileService.getFileById(id);
    }

    @Get()
    async getFiles(
        @Query('search') search?: string,
        @Query('module') module?: Module,
        @Query('page', ParseIntPipe) page = 1,
        @Query('pageSize', ParseIntPipe) pageSize = 10,
        @Query('userId') userId?: string,
    ) {
        return this.fileService.getFiles({ search, module, page, pageSize, userId });
    }

    @Get('module/:module')
    async getFilesByModule(
        @Param('module') module: Module,
        @Query('page', ParseIntPipe) page = 1,
        @Query('pageSize', ParseIntPipe) pageSize = 10,
        @Query('userId') userId?: string,
    ) {
        return this.fileService.getFilesByModule(module, { page, pageSize, userId });
    }
}