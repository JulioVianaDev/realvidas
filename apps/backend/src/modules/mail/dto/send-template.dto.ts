import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export enum MailTemplateType {
  RESET_PASSWORD = 'reset-password',
  LOGIN_CODE = 'login-code',
}

export class SendTemplateDto {
  @ApiProperty({ example: 'user@example.com', description: 'Recipient email' })
  @IsEmail()
  to: string;

  @ApiPropertyOptional({
    example: 'Reset your password',
    description: 'Email subject (optional, template has default)',
  })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({
    enum: MailTemplateType,
    example: MailTemplateType.RESET_PASSWORD,
    description: 'Template type to render',
  })
  @IsEnum(MailTemplateType)
  templateType: MailTemplateType;

  @ApiProperty({
    description: 'Template variables (e.g. resetUrl, userName for reset-password)',
    example: { resetUrl: 'https://app.example.com/reset?token=abc123', userName: 'John' },
  })
  @IsObject()
  params: Record<string, unknown>;
}
