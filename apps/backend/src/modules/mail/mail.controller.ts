import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  FileInterceptor,
  File,
} from '@nest-lab/fastify-multer';
import { MailService } from './mail.service';
import { ApiConsumes, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SendTemplateDto } from './dto/send-template.dto';

class SendMailDto {
  to: string;
  subject: string;
  html: string;
}

@Controller({
  path: 'mail',
  version: '1',
})
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'string',
          description: 'JSON string containing email data',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async sendMail(
    @Body('data') data: string,
    @UploadedFile() file?: File,
  ) {
    try {
      console.log('data', data);
      console.log('file', file);
      const sendMailDto: SendMailDto = JSON.parse(data);
      const result = await this.mailService.sendMail(
        sendMailDto.to,
        sendMailDto.subject,
        sendMailDto.html,
        file
          ? [
              {
                filename: file.originalname,
                path:
                  file.path ||
                  file.buffer.toString('base64'),
              },
            ]
          : undefined,
      );
      return {
        success: true,
        message: 'Email sent successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('send-template')
  @ApiOperation({
    summary: 'Send email using a React template',
    description:
      'Choose a template type (e.g. reset-password) and pass variables in params. Subject is optional (template default is used if omitted).',
  })
  @ApiResponse({ status: 201, description: 'Email sent successfully' })
  @ApiResponse({ status: 400, description: 'Validation or template error' })
  async sendTemplate(@Body() dto: SendTemplateDto) {
    try {
      const result = await this.mailService.sendByTemplateType({
        to: dto.to,
        subject: dto.subject,
        templateType: dto.templateType,
        params: dto.params,
      });
      return {
        success: true,
        message: 'Email sent successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message ?? 'Failed to send email',
      };
    }
  }
}
